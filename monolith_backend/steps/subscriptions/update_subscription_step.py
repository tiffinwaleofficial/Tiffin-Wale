from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import httpx

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def delete_cache(self, key):
        return True
    async def set_cache(self, key, value, category=None):
        return True

redis_service = SimpleRedisService()

class UpdateSubscriptionRequest(BaseModel):
    status: Optional[str] = None
    autoRenew: Optional[bool] = None
    paymentFrequency: Optional[str] = None
    customizations: Optional[List[str]] = None
    endDate: Optional[str] = None

config = {
    "type": "api",
    "name": "UpdateSubscription",
    "description": "TiffinWale update subscription workflow - modify subscription settings and status",
    "flows": ["tiffinwale-subscriptions"],
    "method": "PATCH",
    "path": "/subscriptions/{subscriptionId}",
    "bodySchema": UpdateSubscriptionRequest.model_json_schema(),
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "_id": {"type": "string"},
                "customer": {"type": "string"},
                "plan": {"type": "string"},
                "status": {"type": "string"},
                "autoRenew": {"type": "boolean"},
                "endDate": {"type": "string"}
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
        "subscription.updated",
        "subscription.status.changed",
        "subscription.cache.invalidated",
        "subscription.renewal.changed"
    ]
}

async def handler(req, context):
    """
    Motia Update Subscription Workflow - Connects to NestJS Backend
    Pure workflow orchestrator for subscription updates and status changes
    """
    try:
        body = req.get("body", {})
        params = req.get("params", {})
        headers = req.get("headers", {})
        
        subscription_id = params.get("subscriptionId")
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Update Subscription Workflow Started", {
            "subscriptionId": subscription_id,
            "updateFields": list(body.keys()),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        if not subscription_id:
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Subscription ID is required",
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

        # Step 1: Forward subscription update to NestJS backend (real business logic)
        nestjs_subscription_url = f"http://localhost:3001/api/subscriptions/{subscription_id}"
        
        request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.patch(
                nestjs_subscription_url,
                json=body,
                headers=request_headers
            )
            
            context.logger.info("NestJS Update Subscription Backend Response", {
                "status_code": response.status_code,
                "subscriptionId": subscription_id,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                # Step 2: Extract real subscription data from NestJS
                updated_subscription = response.json()
                
                # Step 3: Invalidate subscription caches
                subscription_cache_key = f"motia:subscription:{subscription_id}"
                await redis_service.delete_cache(subscription_cache_key)
                
                # Invalidate user's subscription cache
                customer_id = updated_subscription.get("customer")
                if customer_id:
                    user_subscription_key = f"motia:user_subscription:{customer_id}"
                    await redis_service.delete_cache(user_subscription_key)
                
                # Step 4: Cache updated subscription
                await redis_service.set_cache(subscription_cache_key, updated_subscription, category="subscription")
                if customer_id:
                    await redis_service.set_cache(user_subscription_key, updated_subscription, category="subscription")
                
                # Step 5: Emit workflow events for downstream processing
                await context.emit({
                    "topic": "subscription.updated",
                    "data": {
                        "subscriptionId": subscription_id,
                        "customerId": customer_id,
                        "updatedFields": list(body.keys()),
                        "newStatus": updated_subscription.get("status"),
                        "autoRenew": updated_subscription.get("autoRenew"),
                        "endDate": updated_subscription.get("endDate"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                # Emit cache invalidation event
                await context.emit({
                    "topic": "subscription.cache.invalidated",
                    "data": {
                        "subscriptionId": subscription_id,
                        "customerId": customer_id,
                        "reason": "subscription_updated",
                        "updatedFields": list(body.keys()),
                        "timestamp": datetime.now().isoformat()
                    }
                })

                # Emit status change event if status was updated
                if "status" in body:
                    await context.emit({
                        "topic": "subscription.status.changed",
                        "data": {
                            "subscriptionId": subscription_id,
                            "customerId": customer_id,
                            "oldStatus": "unknown",  # Would need to get from cache in real implementation
                            "newStatus": updated_subscription.get("status"),
                            "timestamp": datetime.now().isoformat()
                        }
                    })

                # Emit renewal change event if autoRenew was updated
                if "autoRenew" in body:
                    await context.emit({
                        "topic": "subscription.renewal.changed",
                        "data": {
                            "subscriptionId": subscription_id,
                            "customerId": customer_id,
                            "autoRenew": updated_subscription.get("autoRenew"),
                            "timestamp": datetime.now().isoformat()
                        }
                    })

                context.logger.info("Motia Update Subscription Workflow Completed Successfully", {
                    "subscriptionId": subscription_id,
                    "customerId": customer_id,
                    "updatedFields": list(body.keys()),
                    "newStatus": updated_subscription.get("status"),
                    "traceId": context.trace_id
                })

                # Step 6: Return the exact NestJS response (no modification)
                return {
                    "status": 200,
                    "body": updated_subscription
                }
                
            else:
                # Step 7: Handle subscription update failure
                error_response = response.json() if response.content else {"message": "Subscription update failed"}
                
                await context.emit({
                    "topic": "subscription.update.failed",
                    "data": {
                        "subscriptionId": subscription_id,
                        "attemptedFields": list(body.keys()),
                        "reason": "backend_validation_failed",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Update Subscription Workflow Failed", {
                    "subscriptionId": subscription_id,
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
        context.logger.error("NestJS Update Subscription Backend Timeout", {
            "subscriptionId": subscription_id,
            "attemptedFields": list(body.keys()),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "subscription.update.failed",
            "data": {
                "subscriptionId": subscription_id,
                "attemptedFields": list(body.keys()),
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Subscription update service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Update Subscription Workflow Error", {
            "error": str(error),
            "subscriptionId": subscription_id,
            "attemptedFields": list(body.keys()),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "subscription.update.failed",
            "data": {
                "subscriptionId": subscription_id,
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
                "message": "Update subscription workflow failed",
                "error": "Internal server error"
            }
        }
