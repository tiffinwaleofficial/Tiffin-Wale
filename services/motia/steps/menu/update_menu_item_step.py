from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import httpx

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def delete_cache(self, key):
        return True

redis_service = SimpleRedisService()

class NutritionalInfo(BaseModel):
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

class UpdateMenuItemRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    imageUrl: Optional[str] = None
    category: Optional[str] = None
    isAvailable: Optional[bool] = None
    tags: Optional[List[str]] = None
    allergens: Optional[List[str]] = None
    nutritionalInfo: Optional[NutritionalInfo] = None

config = {
    "type": "api",
    "name": "UpdateMenuItem",
    "description": "TiffinWale update menu item workflow - connects to NestJS backend",
    "flows": ["tiffinwale-menu"],
    "method": "PATCH",
    "path": "/menu/items/{itemId}",
    "bodySchema": UpdateMenuItemRequest.model_json_schema(),
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "_id": {"type": "string"},
                "name": {"type": "string"},
                "price": {"type": "number"},
                "businessPartner": {"type": "string"}
            }
        },
        404: {
            "type": "object",
            "properties": {
                "statusCode": {"type": "number"},
                "message": {"type": "string"},
                "error": {"type": "string"}
            }
        }
    },
    "emits": [
        "menu.item.updated",
        "menu.cache.invalidated",
        "menu.availability.changed"
    ]
}

async def handler(req, context):
    """
    Motia Update Menu Item Workflow - Connects to NestJS Backend
    Pure workflow orchestrator for menu item updates
    """
    try:
        body = req.get("body", {})
        params = req.get("params", {})
        headers = req.get("headers", {})
        
        item_id = params.get("itemId")
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Update Menu Item Workflow Started", {
            "itemId": item_id,
            "updateFields": list(body.keys()),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        if not item_id:
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Menu item ID is required",
                    "error": "Bad Request"
                }
            }

        # Step 1: Forward menu item update to NestJS backend (real business logic)
        nestjs_menu_url = f"http://localhost:3001/api/menu/{item_id}"
        
        request_headers = {
            "Content-Type": "application/json"
        }
        
        # Include JWT token if provided
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.patch(
                nestjs_menu_url,
                json=body,
                headers=request_headers
            )
            
            context.logger.info("NestJS Update Menu Item Backend Response", {
                "status_code": response.status_code,
                "itemId": item_id,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                # Step 2: Extract real menu item data from NestJS (item returned directly)
                updated_item = response.json()
                
                # Step 3: Invalidate partner menu cache (since item updated)
                partner_id = updated_item.get("businessPartner")
                if partner_id:
                    partner_menu_cache_key = f"motia:menu:partner:{partner_id}"
                    await redis_service.delete_cache(partner_menu_cache_key)
                
                # Step 4: Emit workflow events for downstream processing
                await context.emit({
                    "topic": "menu.item.updated",
                    "data": {
                        "itemId": item_id,
                        "itemName": updated_item.get("name"),
                        "partnerId": updated_item.get("businessPartner"),
                        "updatedFields": list(body.keys()),
                        "newPrice": updated_item.get("price"),
                        "isAvailable": updated_item.get("isAvailable"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                # Emit cache invalidation event
                await context.emit({
                    "topic": "menu.cache.invalidated",
                    "data": {
                        "partnerId": partner_id,
                        "reason": "item_updated",
                        "itemId": item_id,
                        "itemName": updated_item.get("name"),
                        "updatedFields": list(body.keys()),
                        "timestamp": datetime.now().isoformat()
                    }
                })

                # Emit availability change event if availability was updated
                if "isAvailable" in body:
                    await context.emit({
                        "topic": "menu.availability.changed",
                        "data": {
                            "itemId": item_id,
                            "itemName": updated_item.get("name"),
                            "partnerId": updated_item.get("businessPartner"),
                            "newAvailability": updated_item.get("isAvailable"),
                            "timestamp": datetime.now().isoformat()
                        }
                    })

                context.logger.info("Motia Update Menu Item Workflow Completed Successfully", {
                    "itemId": item_id,
                    "itemName": updated_item.get("name"),
                    "partnerId": updated_item.get("businessPartner"),
                    "updatedFields": list(body.keys()),
                    "traceId": context.trace_id
                })

                # Step 5: Return the exact NestJS response (no modification)
                return {
                    "status": 200,
                    "body": updated_item
                }
                
            else:
                # Step 6: Handle menu item update failure
                error_response = response.json() if response.content else {"message": "Menu item update failed"}
                
                await context.emit({
                    "topic": "menu.item.update.failed",
                    "data": {
                        "itemId": item_id,
                        "attemptedFields": list(body.keys()),
                        "reason": "backend_validation_failed",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Update Menu Item Workflow Failed", {
                    "itemId": item_id,
                    "attemptedFields": list(body.keys()),
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Update Menu Item Backend Timeout", {
            "itemId": item_id,
            "attemptedFields": list(body.keys()),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "menu.item.update.failed",
            "data": {
                "itemId": item_id,
                "attemptedFields": list(body.keys()),
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Menu item update service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Update Menu Item Workflow Error", {
            "error": str(error),
            "itemId": item_id,
            "attemptedFields": list(body.keys()),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "menu.item.update.failed",
            "data": {
                "itemId": item_id,
                "attemptedFields": list(body.keys()),
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Update menu item workflow failed",
                "error": "Internal server error"
            }
        }
