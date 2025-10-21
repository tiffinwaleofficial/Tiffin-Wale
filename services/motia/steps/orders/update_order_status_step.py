from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

class UpdateOrderStatusRequest(BaseModel):
    status: str
    estimatedDeliveryTime: Optional[str] = None

config = {
    "type": "api",
    "name": "UpdateOrderStatus",
    "description": "TiffinWale order status update workflow - connects to NestJS backend",
    "flows": ["tiffinwale-orders"],
    "method": "PATCH",
    "path": "/orders/{orderId}/status",
    "bodySchema": UpdateOrderStatusRequest.model_json_schema(),
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "statusCode": {"type": "number"},
                "message": {"type": "string"},
                "data": {"type": "object"}
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
        "order.status.updated",
        "order.notification.send",
        "order.delivered",
        "order.cancelled"
    ]
}

async def handler(req, context):
    """
    Motia Order Status Update Workflow - Connects to NestJS Backend
    Pure workflow orchestrator for order status management
    """
    try:
        body = req.get("body", {})
        params = req.get("params", {})
        headers = req.get("headers", {})
        
        order_id = params.get("orderId")
        new_status = body.get("status")
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Order Status Update Workflow Started", {
            "orderId": order_id,
            "newStatus": new_status,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        if not order_id:
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Order ID is required",
                    "error": "Bad Request"
                }
            }

        # Step 1: Forward status update to NestJS backend (real business logic)
        nestjs_update_url = f"http://localhost:3001/api/orders/{order_id}/status"
        
        request_headers = {
            "Content-Type": "application/json"
        }
        
        # Include JWT token if provided
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.patch(
                nestjs_update_url,
                json=body,
                headers=request_headers
            )
            
            context.logger.info("NestJS Order Status Backend Response", {
                "status_code": response.status_code,
                "orderId": order_id,
                "newStatus": new_status,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                # Step 2: Extract real order data from NestJS
                update_response = response.json()
                order_data = update_response.get("data", {})
                
                # Step 3: Update order cache in Redis (performance layer)
                order_cache_key = f"order:{order_id}"
                await context.state.set("order_cache", order_cache_key, order_data)
                
                # Step 4: Emit workflow events based on status
                await context.emit({
                    "topic": "order.status.updated",
                    "data": {
                        "orderId": order_id,
                        "oldStatus": order_data.get("previousStatus"),
                        "newStatus": new_status,
                        "customerId": order_data.get("customer"),
                        "partnerId": order_data.get("businessPartner"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                # Emit specific status events
                if new_status.upper() == "DELIVERED":
                    await context.emit({
                        "topic": "order.delivered",
                        "data": {
                            "orderId": order_id,
                            "customerId": order_data.get("customer"),
                            "partnerId": order_data.get("businessPartner"),
                            "deliveredAt": datetime.now().isoformat(),
                            "totalAmount": order_data.get("totalAmount")
                        }
                    })
                elif new_status.upper() == "CANCELLED":
                    await context.emit({
                        "topic": "order.cancelled",
                        "data": {
                            "orderId": order_id,
                            "customerId": order_data.get("customer"),
                            "partnerId": order_data.get("businessPartner"),
                            "cancelledAt": datetime.now().isoformat(),
                            "reason": body.get("cancellationReason", "Not specified")
                        }
                    })

                # Emit notification event
                await context.emit({
                    "topic": "order.notification.send",
                    "data": {
                        "type": "status_update",
                        "orderId": order_id,
                        "customerId": order_data.get("customer"),
                        "partnerId": order_data.get("businessPartner"),
                        "newStatus": new_status,
                        "message": f"Order {order_id} status updated to {new_status}",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Order Status Update Workflow Completed Successfully", {
                    "orderId": order_id,
                    "newStatus": new_status,
                    "customerId": order_data.get("customer"),
                    "partnerId": order_data.get("businessPartner"),
                    "traceId": context.trace_id
                })

                # Step 5: Return the exact NestJS response (no modification)
                return {
                    "status": 200,
                    "body": update_response
                }
                
            else:
                # Step 6: Handle status update failure
                error_response = response.json() if response.content else {"message": "Status update failed"}
                
                await context.emit({
                    "topic": "order.status.update.failed",
                    "data": {
                        "orderId": order_id,
                        "attemptedStatus": new_status,
                        "reason": "backend_validation_failed",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Order Status Update Workflow Failed", {
                    "orderId": order_id,
                    "attemptedStatus": new_status,
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Order Status Backend Timeout", {
            "orderId": order_id,
            "attemptedStatus": new_status,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "order.status.update.failed",
            "data": {
                "orderId": order_id,
                "attemptedStatus": new_status,
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Order status service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Order Status Update Workflow Error", {
            "error": str(error),
            "orderId": order_id,
            "attemptedStatus": new_status,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "order.status.update.failed",
            "data": {
                "orderId": order_id,
                "attemptedStatus": new_status,
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Order status update workflow failed",
                "error": "Internal server error"
            }
        }
