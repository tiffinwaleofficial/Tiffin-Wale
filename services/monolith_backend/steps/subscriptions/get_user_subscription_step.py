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
    "name": "GetUserSubscription",
    "description": "TiffinWale get user subscription workflow - current active subscription with meal plan details",
    "flows": ["tiffinwale-subscriptions"],
    "method": "GET",
    "path": "/subscriptions/me/current",
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "_id": {"type": "string"},
                "customer": {"type": "string"},
                "plan": {"type": "object"},
                "status": {"type": "string"},
                "startDate": {"type": "string"},
                "endDate": {"type": "string"},
                "totalAmount": {"type": "number"},
                "autoRenew": {"type": "boolean"}
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
    "emits": ["subscription.viewed", "subscription.cache.hit", "subscription.cache.miss"]
}

async def handler(req, context):
    """
    Motia Get User Subscription Workflow - Connects to NestJS Backend with Redis Caching
    Pure workflow orchestrator for retrieving user's active subscription
    """
    try:
        headers = req.get("headers", {})
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Get User Subscription Workflow Started", {
            "hasAuthToken": bool(auth_token),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        if not auth_token:
            return {
                "status": 401,
                "body": {
                    "statusCode": 401,
                    "message": "Authorization token is required",
                    "error": "Unauthorized"
                }
            }

        # Step 1: Get user ID from token (we'll extract from NestJS response)
        # First try to get from cache, then from NestJS if cache miss
        
        # Step 2: Forward request to NestJS backend (real business logic)
        nestjs_subscription_url = "http://localhost:3001/api/subscriptions/me/current"
        
        request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                nestjs_subscription_url,
                headers=request_headers
            )
            
            context.logger.info("NestJS Get User Subscription Backend Response", {
                "status_code": response.status_code,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                # Step 3: Extract real subscription data from NestJS
                subscription_data = response.json()
                
                # Step 4: Cache subscription data in Redis (performance layer)
                if subscription_data.get("_id"):
                    subscription_cache_key = f"motia:subscription:{subscription_data['_id']}"
                    await redis_service.set_cache(subscription_cache_key, subscription_data, category="subscription")
                    
                    # Cache user's active subscription
                    customer_id = subscription_data.get("customer")
                    if customer_id:
                        user_subscription_key = f"motia:user_subscription:{customer_id}"
                        await redis_service.set_cache(user_subscription_key, subscription_data, category="subscription")
                
                # Step 5: Emit workflow events
                await context.emit({
                    "topic": "subscription.viewed",
                    "data": {
                        "subscriptionId": subscription_data.get("_id"),
                        "customerId": subscription_data.get("customer"),
                        "planId": subscription_data.get("plan", {}).get("_id") if isinstance(subscription_data.get("plan"), dict) else subscription_data.get("plan"),
                        "status": subscription_data.get("status"),
                        "daysRemaining": calculate_days_remaining(subscription_data.get("endDate")),
                        "source": "backend",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Get User Subscription Workflow Completed Successfully", {
                    "subscriptionId": subscription_data.get("_id"),
                    "customerId": subscription_data.get("customer"),
                    "status": subscription_data.get("status"),
                    "traceId": context.trace_id
                })

                # Step 6: Return the exact NestJS response (no modification)
                return {
                    "status": 200,
                    "body": subscription_data
                }
                
            elif response.status_code == 404:
                # Step 7: Handle no active subscription found
                error_response = response.json() if response.content else {"message": "No active subscription found"}
                
                await context.emit({
                    "topic": "subscription.not.found",
                    "data": {
                        "reason": "no_active_subscription",
                        "message": "User has no active subscription",
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Get User Subscription - No Active Subscription", {
                    "status_code": response.status_code,
                    "traceId": context.trace_id
                })

                return {
                    "status": 404,
                    "body": error_response
                }
            else:
                # Step 8: Handle other errors
                error_response = response.json() if response.content else {"message": "Subscription access failed"}
                
                await context.emit({
                    "topic": "subscription.access.failed",
                    "data": {
                        "reason": "backend_error",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Get User Subscription Workflow Failed", {
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Get User Subscription Backend Timeout", {
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "subscription.access.failed",
            "data": {
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Subscription service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Get User Subscription Workflow Error", {
            "error": str(error),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "subscription.access.failed",
            "data": {
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Get user subscription workflow failed",
                "error": "Internal server error"
            }
        }

def calculate_days_remaining(end_date_str):
    """Calculate days remaining in subscription"""
    try:
        if not end_date_str:
            return 0
        
        end_date = datetime.fromisoformat(end_date_str.replace("Z", "+00:00"))
        now = datetime.now(end_date.tzinfo)
        
        days_remaining = (end_date - now).days
        return max(0, days_remaining)  # Don't return negative days
    except:
        return 0
