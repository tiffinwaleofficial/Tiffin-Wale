from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import httpx
import os

# Using Motia's built-in state management - no external Redis imports needed

class OrderItemRequest(BaseModel):
    mealId: str
    quantity: int
    price: float
    specialInstructions: Optional[str] = None

class CreateOrderRequest(BaseModel):
    customer: str
    businessPartner: str
    items: List[OrderItemRequest]
    totalAmount: float
    deliveryAddress: str
    deliveryInstructions: Optional[str] = None
    scheduledDeliveryTime: Optional[str] = None

config = {
    "type": "api",
    "name": "CreateOrder",
    "description": "TiffinWale order creation workflow - connects to NestJS backend",
    "flows": ["tiffinwale-orders"],
    "method": "POST",
    "path": "/orders",
    "bodySchema": CreateOrderRequest.model_json_schema(),
    "responseSchema": {
        201: {
            "type": "object",
            "properties": {
                "statusCode": {"type": "number"},
                "message": {"type": "string"},
                "data": {"type": "object"}
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
        "order.created", 
        "order.payment.required", 
        "order.notification.send",
        "order.inventory.check"
    ]
}

async def handler(req, context):
    """
    Motia Order Creation Workflow - Connects to NestJS Backend
    Pure workflow orchestrator for order processing
    """
    try:
        body = req.get("body", {})
        headers = req.get("headers", {})
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Order Workflow Started", {
            "customerId": body.get("customer"),
            "partnerId": body.get("businessPartner"),
            "itemCount": len(body.get("items", [])),
            "totalAmount": body.get("totalAmount"),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Step 1: Forward order creation to NestJS backend (real business logic)
        nestjs_order_url = "http://localhost:3001/api/orders"
        
        request_headers = {
            "Content-Type": "application/json"
        }
        
        # Include JWT token if provided
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                nestjs_order_url,
                json=body,
                headers=request_headers
            )
            
            context.logger.info("NestJS Order Backend Response", {
                "status_code": response.status_code,
                "customerId": body.get("customer"),
                "partnerId": body.get("businessPartner"),
                "traceId": context.trace_id
            })
            
            if response.status_code == 201:
                # Step 2: Extract real order data from NestJS (order is returned directly, not wrapped)
                order_data = response.json()
                
                # Step 3: Cache successful order in Redis (performance layer)
                if order_data.get("_id"):
                    order_cache_key = f"order:{order_data['_id']}"
                    await context.state.set("order_cache", order_cache_key, order_data)
                
                # Step 4: Emit workflow events for downstream processing
                await context.emit({
                    "topic": "order.created",
                    "data": {
                        "orderId": order_data.get("_id"),
                        "customerId": order_data.get("customer"),
                        "partnerId": order_data.get("businessPartner"),
                        "totalAmount": order_data.get("totalAmount"),
                        "status": order_data.get("status", "pending"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                # Emit payment processing event
                await context.emit({
                    "topic": "order.payment.required",
                    "data": {
                        "orderId": order_data.get("_id"),
                        "customerId": order_data.get("customer"),
                        "amount": order_data.get("totalAmount"),
                        "paymentMethod": order_data.get("paymentMethod", "pending"),
                        "timestamp": datetime.now().isoformat()
                    }
                })

                # Emit notification events
                await context.emit({
                    "topic": "order.notification.send",
                    "data": {
                        "type": "order_confirmation",
                        "orderId": order_data.get("_id"),
                        "customerId": order_data.get("customer"),
                        "partnerId": order_data.get("businessPartner"),
                        "message": f"Order {order_data.get('_id')} created successfully",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                # Emit inventory check event
                await context.emit({
                    "topic": "order.inventory.check",
                    "data": {
                        "orderId": order_data.get("_id"),
                        "partnerId": order_data.get("businessPartner"),
                        "items": [
                            {
                                "mealId": item.get("mealId"),
                                "quantity": item.get("quantity")
                            } for item in order_data.get("items", [])
                        ],
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Order Workflow Completed Successfully", {
                    "orderId": order_data.get("_id"),
                    "customerId": order_data.get("customer"),
                    "partnerId": order_data.get("businessPartner"),
                    "totalAmount": order_data.get("totalAmount"),
                    "traceId": context.trace_id
                })

                # Step 5: Return the exact NestJS response (no modification)
                return {
                    "status": 201,
                    "body": order_data
                }
                
            else:
                # Step 6: Handle order creation failure
                error_response = response.json() if response.content else {"message": "Order creation failed"}
                
                await context.emit({
                    "topic": "order.creation.failed",
                    "data": {
                        "customerId": body.get("customer"),
                        "partnerId": body.get("businessPartner"),
                        "reason": "backend_validation_failed",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Order Workflow Failed", {
                    "customerId": body.get("customer"),
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
        context.logger.error("NestJS Order Backend Timeout", {
            "customerId": body.get("customer"),
            "partnerId": body.get("businessPartner"),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "order.creation.failed",
            "data": {
                "customerId": body.get("customer"),
                "partnerId": body.get("businessPartner"),
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Order service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Order Workflow Error", {
            "error": str(error),
            "customerId": body.get("customer"),
            "partnerId": body.get("businessPartner"),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "order.creation.failed",
            "data": {
                "customerId": body.get("customer"),
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
                "message": "Order workflow failed",
                "error": "Internal server error"
            }
        }
