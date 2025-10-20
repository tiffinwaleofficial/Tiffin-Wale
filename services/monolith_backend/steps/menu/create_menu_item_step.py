from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import httpx

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def set_cache(self, key, value, category=None):
        return True
    async def delete_cache(self, key):
        return True

redis_service = SimpleRedisService()

class NutritionalInfo(BaseModel):
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

class CreateMenuItemRequest(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    imageUrl: Optional[str] = None
    businessPartner: str
    category: Optional[str] = None
    isAvailable: Optional[bool] = True
    tags: Optional[List[str]] = None
    allergens: Optional[List[str]] = None
    nutritionalInfo: Optional[NutritionalInfo] = None

config = {
    "type": "api",
    "name": "CreateMenuItem",
    "description": "TiffinWale create menu item workflow - connects to NestJS backend",
    "flows": ["tiffinwale-menu"],
    "method": "POST",
    "path": "/menu/items",
    "bodySchema": CreateMenuItemRequest.model_json_schema(),
    "responseSchema": {
        201: {
            "type": "object",
            "properties": {
                "_id": {"type": "string"},
                "name": {"type": "string"},
                "price": {"type": "number"},
                "businessPartner": {"type": "string"}
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
        "menu.item.created",
        "menu.cache.invalidated",
        "menu.partner.updated"
    ]
}

async def handler(req, context):
    """
    Motia Create Menu Item Workflow - Connects to NestJS Backend
    Pure workflow orchestrator for menu item creation
    """
    try:
        body = req.get("body", {})
        headers = req.get("headers", {})
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Create Menu Item Workflow Started", {
            "itemName": body.get("name"),
            "partnerId": body.get("businessPartner"),
            "price": body.get("price"),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Step 1: Forward menu item creation to NestJS backend (real business logic)
        nestjs_menu_url = "http://localhost:3001/api/menu"
        
        request_headers = {
            "Content-Type": "application/json"
        }
        
        # Include JWT token if provided
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                nestjs_menu_url,
                json=body,
                headers=request_headers
            )
            
            context.logger.info("NestJS Create Menu Item Backend Response", {
                "status_code": response.status_code,
                "itemName": body.get("name"),
                "partnerId": body.get("businessPartner"),
                "traceId": context.trace_id
            })
            
            if response.status_code == 201:
                # Step 2: Extract real menu item data from NestJS (item returned directly)
                menu_item = response.json()
                
                # Step 3: Invalidate partner menu cache (since new item added)
                partner_id = menu_item.get("businessPartner")
                if partner_id:
                    partner_menu_cache_key = f"motia:menu:partner:{partner_id}"
                    await redis_service.delete_cache(partner_menu_cache_key)
                
                # Step 4: Emit workflow events for downstream processing
                await context.emit({
                    "topic": "menu.item.created",
                    "data": {
                        "itemId": menu_item.get("_id"),
                        "itemName": menu_item.get("name"),
                        "partnerId": menu_item.get("businessPartner"),
                        "price": menu_item.get("price"),
                        "isAvailable": menu_item.get("isAvailable", True),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                # Emit cache invalidation event
                await context.emit({
                    "topic": "menu.cache.invalidated",
                    "data": {
                        "partnerId": partner_id,
                        "reason": "new_item_created",
                        "itemId": menu_item.get("_id"),
                        "itemName": menu_item.get("name"),
                        "timestamp": datetime.now().isoformat()
                    }
                })

                # Emit partner menu update event
                await context.emit({
                    "topic": "menu.partner.updated",
                    "data": {
                        "partnerId": partner_id,
                        "action": "item_added",
                        "itemId": menu_item.get("_id"),
                        "itemName": menu_item.get("name"),
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Create Menu Item Workflow Completed Successfully", {
                    "itemId": menu_item.get("_id"),
                    "itemName": menu_item.get("name"),
                    "partnerId": menu_item.get("businessPartner"),
                    "price": menu_item.get("price"),
                    "traceId": context.trace_id
                })

                # Step 5: Return the exact NestJS response (no modification)
                return {
                    "status": 201,
                    "body": menu_item
                }
                
            else:
                # Step 6: Handle menu item creation failure
                error_response = response.json() if response.content else {"message": "Menu item creation failed"}
                
                await context.emit({
                    "topic": "menu.item.creation.failed",
                    "data": {
                        "itemName": body.get("name"),
                        "partnerId": body.get("businessPartner"),
                        "reason": "backend_validation_failed",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Create Menu Item Workflow Failed", {
                    "itemName": body.get("name"),
                    "partnerId": body.get("businessPartner"),
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Create Menu Item Backend Timeout", {
            "itemName": body.get("name"),
            "partnerId": body.get("businessPartner"),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "menu.item.creation.failed",
            "data": {
                "itemName": body.get("name"),
                "partnerId": body.get("businessPartner"),
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Menu item creation service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Create Menu Item Workflow Error", {
            "error": str(error),
            "itemName": body.get("name"),
            "partnerId": body.get("businessPartner"),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "menu.item.creation.failed",
            "data": {
                "itemName": body.get("name"),
                "partnerId": body.get("businessPartner"),
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Create menu item workflow failed",
                "error": "Internal server error"
            }
        }
