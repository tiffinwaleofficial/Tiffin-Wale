from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

class InventoryItem(BaseModel):
    menuItemId: str
    availableQuantity: int = Field(..., ge=0)
    isAvailable: bool = True
    estimatedPrepTime: Optional[int] = None  # in minutes

class UpdateInventoryRequest(BaseModel):
    partnerId: str
    inventory: List[InventoryItem]
    operationalStatus: Optional[str] = None  # "open", "closed", "busy"
    specialNote: Optional[str] = None

config = {
    "type": "api",
    "name": "UpdateCenterInventory",
    "description": "TiffinWale update tiffin center inventory workflow - connects to NestJS backend",
    "flows": ["tiffinwale-tiffin-centers"],
    "method": "PUT",
    "path": "/partners/{partnerId}/inventory",
    "bodySchema": UpdateInventoryRequest.model_json_schema(),
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "partnerId": {"type": "string"},
                "inventory": {"type": "array"},
                "operationalStatus": {"type": "string"},
                "lastUpdated": {"type": "string"}
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
        "inventory.updated",
        "partner.status.changed",
        "analytics.inventory.tracked"
    ]
}

async def handler(req, context):
    """
    Motia Update Tiffin Center Inventory Workflow - Connects to NestJS Backend
    """
    try:
        body = req.get("body", {})
        headers = req.get("headers", {})
        path_params = req.get("pathParams", {})
        
        partner_id = path_params.get("partnerId")
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Update Center Inventory Workflow Started", {
            "partnerId": partner_id,
            "inventoryItemCount": len(body.get("inventory", [])),
            "operationalStatus": body.get("operationalStatus"),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        if not partner_id:
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Partner ID is required",
                    "error": "Bad Request"
                }
            }

        if not auth_token:
            return {
                "status": 401,
                "body": {
                    "statusCode": 401,
                    "message": "Authorization token is required",
                    "error": "Unauthorized"
                }
            }

        # Validate input using Pydantic model
        inventory_data = UpdateInventoryRequest(**body).model_dump()

        # Forward to NestJS backend (assuming there's an inventory endpoint)
        nestjs_inventory_url = f"http://localhost:3001/api/partners/{partner_id}/inventory"
        
        request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.put(
                nestjs_inventory_url,
                json=inventory_data,
                headers=request_headers
            )
            
            context.logger.info("NestJS Update Inventory Backend Response", {
                "status_code": response.status_code,
                "partnerId": partner_id,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                inventory_response = response.json()
                
                # Invalidate partner cache
                partner_cache_key = f"partner:{partner_id}"
                await context.state.delete("tiffin_center_cache", partner_cache_key)
                
                # Cache updated inventory
                inventory_cache_key = f"partner:inventory:{partner_id}"
                await context.state.set("tiffin_center_cache", inventory_cache_key, inventory_response)
                
                # Emit workflow events
                await context.emit({
                    "topic": "inventory.updated",
                    "data": {
                        "partnerId": partner_id,
                        "inventoryItemCount": len(inventory_data.get("inventory", [])),
                        "operationalStatus": inventory_data.get("operationalStatus"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                if inventory_data.get("operationalStatus"):
                    await context.emit({
                        "topic": "partner.status.changed",
                        "data": {
                            "partnerId": partner_id,
                            "newStatus": inventory_data.get("operationalStatus"),
                            "timestamp": datetime.now().isoformat()
                        }
                    })

                await context.emit({
                    "topic": "analytics.inventory.tracked",
                    "data": {
                        "partnerId": partner_id,
                        "action": "inventory_updated",
                        "itemCount": len(inventory_data.get("inventory", [])),
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Update Center Inventory Workflow Completed Successfully", {
                    "partnerId": partner_id,
                    "inventoryItemCount": len(inventory_data.get("inventory", [])),
                    "traceId": context.trace_id
                })

                return {
                    "status": 200,
                    "body": inventory_response
                }
                
            else:
                error_response = response.json() if response.content else {"message": "Inventory update failed"}
                
                context.logger.error("Motia Update Center Inventory Workflow Failed", {
                    "partnerId": partner_id,
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except Exception as error:
        context.logger.error("Motia Update Center Inventory Workflow Error", {
            "error": str(error),
            "partnerId": partner_id,
            "traceId": context.trace_id
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Update center inventory workflow failed",
                "error": "Internal server error"
            }
        }