from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

class AddressModel(BaseModel):
    street: str
    city: str
    state: str
    postalCode: str
    country: str

class BusinessHoursModel(BaseModel):
    open: str
    close: str
    days: List[str]

class SocialMediaModel(BaseModel):
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    twitter: Optional[str] = None

class DocumentsModel(BaseModel):
    licenseDocuments: Optional[List[str]] = None
    certificationDocuments: Optional[List[str]] = None
    identityDocuments: Optional[List[str]] = None
    otherDocuments: Optional[List[str]] = None

class RegisterPartnerRequest(BaseModel):
    businessName: str
    businessType: List[str]
    description: str
    cuisineTypes: List[str]
    address: AddressModel
    businessHours: BusinessHoursModel
    contactEmail: Optional[str] = None
    contactPhone: Optional[str] = None
    whatsappNumber: Optional[str] = None
    gstNumber: Optional[str] = None
    licenseNumber: Optional[str] = None
    establishedYear: Optional[int] = None
    deliveryRadius: Optional[float] = 5.0
    minimumOrderAmount: Optional[float] = 100.0
    deliveryFee: Optional[float] = 0.0
    estimatedDeliveryTime: Optional[int] = 30
    commissionRate: Optional[float] = 20.0
    logoUrl: Optional[str] = None
    bannerUrl: Optional[str] = None
    socialMedia: Optional[SocialMediaModel] = None
    isVegetarian: Optional[bool] = False
    hasDelivery: Optional[bool] = True
    hasPickup: Optional[bool] = True
    acceptsCash: Optional[bool] = True
    acceptsCard: Optional[bool] = True
    acceptsUPI: Optional[bool] = True
    documents: Optional[DocumentsModel] = None
    isAcceptingOrders: Optional[bool] = True
    isFeatured: Optional[bool] = False

config = {
    "type": "api",
    "name": "RegisterTiffinCenter",
    "description": "TiffinWale register tiffin center workflow - connects to NestJS backend with Redis caching",
    "flows": ["tiffinwale-tiffin-centers"],
    "method": "POST",
    "path": "/partners/register",
    "bodySchema": RegisterPartnerRequest.model_json_schema(),
    "responseSchema": {
        201: {
            "type": "object",
            "properties": {
                "_id": {"type": "string"},
                "businessName": {"type": "string"},
                "businessType": {"type": "array", "items": {"type": "string"}},
                "address": {"type": "object"},
                "status": {"type": "string"}
            }
        },
        400: {
            "type": "object",
            "properties": {
                "statusCode": {"type": "number"},
                "message": {"type": "string"},
                "error": {"type": "string"}
            }
        }
    },
    "emits": [
        "partner.registered",
        "tiffin.center.created",
        "analytics.partner.registered"
    ]
}

async def handler(req, context):
    """
    Motia Register Tiffin Center Workflow - Connects to NestJS Backend
    """
    try:
        body = req.get("body", {})
        headers = req.get("headers", {})
        
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Register Tiffin Center Workflow Started", {
            "businessName": body.get("businessName"),
            "businessType": body.get("businessType"),
            "city": body.get("address", {}).get("city"),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Validate input using Pydantic model
        partner_data = RegisterPartnerRequest(**body).model_dump()

        # Forward to NestJS backend
        nestjs_partner_url = "http://localhost:3001/api/partners"
        
        request_headers = {
            "Content-Type": "application/json"
        }
        
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                nestjs_partner_url,
                json=partner_data,
                headers=request_headers
            )
            
            context.logger.info("NestJS Register Partner Backend Response", {
                "status_code": response.status_code,
                "businessName": partner_data.get("businessName"),
                "traceId": context.trace_id
            })
            
            if response.status_code == 201:
                partner_response = response.json()
                partner_id = partner_response.get("_id")
                
                # Cache partner data
                if partner_id:
                    partner_cache_key = f"partner:{partner_id}"
                    await context.state.set("tiffin_center_cache", partner_cache_key, partner_response)
                    
                    # Cache in location-based index
                    city = partner_data.get("address", {}).get("city", "").lower()
                    if city:
                        city_partners_key = f"partners:city:{city}"
                        # Get existing partners for this city
                        existing_partners = await context.state.get("tiffin_center_cache", city_partners_key) or []
                        if not isinstance(existing_partners, list):
                            existing_partners = []
                        existing_partners.append(partner_id)
                        await context.state.set("tiffin_center_cache", city_partners_key, existing_partners)

                # Emit workflow events
                await context.emit({
                    "topic": "partner.registered",
                    "data": {
                        "partnerId": partner_id,
                        "businessName": partner_response.get("businessName"),
                        "businessType": partner_response.get("businessType"),
                        "city": partner_data.get("address", {}).get("city"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                await context.emit({
                    "topic": "tiffin.center.created",
                    "data": {
                        "partnerId": partner_id,
                        "businessName": partner_response.get("businessName"),
                        "location": {
                            "city": partner_data.get("address", {}).get("city"),
                            "state": partner_data.get("address", {}).get("state")
                        },
                        "cuisineTypes": partner_data.get("cuisineTypes"),
                        "timestamp": datetime.now().isoformat()
                    }
                })

                await context.emit({
                    "topic": "analytics.partner.registered",
                    "data": {
                        "partnerId": partner_id,
                        "businessType": partner_data.get("businessType"),
                        "city": partner_data.get("address", {}).get("city"),
                        "registrationDate": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Register Tiffin Center Workflow Completed Successfully", {
                    "partnerId": partner_id,
                    "businessName": partner_response.get("businessName"),
                    "traceId": context.trace_id
                })

                return {
                    "status": 201,
                    "body": partner_response
                }
                
            else:
                error_response = response.json() if response.content else {"message": "Registration failed"}
                
                context.logger.error("Motia Register Tiffin Center Workflow Failed", {
                    "businessName": partner_data.get("businessName"),
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except Exception as error:
        context.logger.error("Motia Register Tiffin Center Workflow Error", {
            "error": str(error),
            "businessName": body.get("businessName"),
            "traceId": context.trace_id
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Register tiffin center workflow failed",
                "error": "Internal server error"
            }
        }