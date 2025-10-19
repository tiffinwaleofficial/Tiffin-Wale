from datetime import datetime
import httpx

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def get_cache(self, key):
        return None
    async def set_cache(self, key, value, category=None):
        return True

redis_service = SimpleRedisService()

config = {
    "type": "api",
    "name": "GetOrder",
    "description": "TiffinWale get order details workflow - connects to NestJS backend",
    "flows": ["tiffinwale-orders"],
    "method": "GET",
    "path": "/orders/{orderId}",
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
    "emits": ["order.viewed", "order.cache.hit", "order.cache.miss"]
}

async def handler(req, context):
    """
    Motia Get Order Workflow - Connects to NestJS Backend with Redis Caching
    Pure workflow orchestrator for order retrieval with performance optimization
    """
    try:
        params = req.get("params", {})
        headers = req.get("headers", {})
        
        order_id = params.get("orderId")
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Get Order Workflow Started", {
            "orderId": order_id,
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

        # Step 1: Check Redis cache first (performance optimization)
        order_cache_key = f"motia:order:{order_id}"
        cached_order = await redis_service.get_cache(order_cache_key)
        
        if cached_order:
            context.logger.info("Order found in Redis cache", {
                "orderId": order_id,
                "traceId": context.trace_id
            })
            
            await context.emit({
                "topic": "order.cache.hit",
                "data": {
                    "orderId": order_id,
                    "timestamp": datetime.now().isoformat(),
                    "source": "redis_cache"
                }
            })
            
            await context.emit({
                "topic": "order.viewed",
                "data": {
                    "orderId": order_id,
                    "customerId": cached_order.get("customer"),
                    "partnerId": cached_order.get("businessPartner"),
                    "source": "cache",
                    "timestamp": datetime.now().isoformat()
                }
            })
            
            return {
                "status": 200,
                "body": {
                    "statusCode": 200,
                    "message": "Order retrieved successfully",
                    "data": cached_order,
                    "source": "cache"
                }
            }

        # Step 2: Forward request to NestJS backend (real business logic)
        nestjs_order_url = f"http://localhost:3001/api/orders/{order_id}"
        
        request_headers = {
            "Content-Type": "application/json"
        }
        
        # Include JWT token if provided
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                nestjs_order_url,
                headers=request_headers
            )
            
            context.logger.info("NestJS Get Order Backend Response", {
                "status_code": response.status_code,
                "orderId": order_id,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                # Step 3: Extract real order data from NestJS (order is returned directly)
                order_data = response.json()
                
                # Step 4: Cache order data in Redis (performance layer)
                await redis_service.set_cache(order_cache_key, order_data, category="order")
                
                # Step 5: Emit workflow events
                await context.emit({
                    "topic": "order.cache.miss",
                    "data": {
                        "orderId": order_id,
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })
                
                await context.emit({
                    "topic": "order.viewed",
                    "data": {
                        "orderId": order_id,
                        "customerId": order_data.get("customer"),
                        "partnerId": order_data.get("businessPartner"),
                        "status": order_data.get("status"),
                        "totalAmount": order_data.get("totalAmount"),
                        "source": "backend",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Get Order Workflow Completed Successfully", {
                    "orderId": order_id,
                    "customerId": order_data.get("customer"),
                    "partnerId": order_data.get("businessPartner"),
                    "status": order_data.get("status"),
                    "traceId": context.trace_id
                })

                # Step 6: Return the exact NestJS response (no modification)
                return {
                    "status": 200,
                    "body": order_data
                }
                
            else:
                # Step 7: Handle order not found or access denied
                error_response = response.json() if response.content else {"message": "Order not found"}
                
                await context.emit({
                    "topic": "order.access.failed",
                    "data": {
                        "orderId": order_id,
                        "reason": "not_found_or_access_denied",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Get Order Workflow Failed", {
                    "orderId": order_id,
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Get Order Backend Timeout", {
            "orderId": order_id,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "order.access.failed",
            "data": {
                "orderId": order_id,
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
        context.logger.error("Motia Get Order Workflow Error", {
            "error": str(error),
            "orderId": order_id,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "order.access.failed",
            "data": {
                "orderId": order_id,
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Get order workflow failed",
                "error": "Internal server error"
            }
        }
