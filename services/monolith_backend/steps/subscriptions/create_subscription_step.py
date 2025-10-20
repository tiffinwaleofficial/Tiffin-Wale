from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import httpx

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def set_cache(self, key, value, category=None):
        return True

redis_service = SimpleRedisService()

class CreateSubscriptionRequest(BaseModel):
    customer: str
    plan: str
    startDate: str
    endDate: str
    autoRenew: Optional[bool] = False
    paymentFrequency: Optional[str] = "MONTHLY"
    totalAmount: float
    discountAmount: Optional[float] = 0
    paymentId: Optional[str] = None
    isPaid: Optional[bool] = False
    customizations: Optional[List[str]] = []

config = {
    "type": "api",
    "name": "CreateSubscription",
    "description": "TiffinWale create subscription workflow - meal plans and recurring orders",
    "flows": ["tiffinwale-subscriptions"],
    "method": "POST",
    "path": "/subscriptions",
    "bodySchema": CreateSubscriptionRequest.model_json_schema(),
    "responseSchema": {
        201: {
            "type": "object",
            "properties": {
                "_id": {"type": "string"},
                "customer": {"type": "string"},
                "plan": {"type": "string"},
                "status": {"type": "string"},
                "totalAmount": {"type": "number"},
                "startDate": {"type": "string"},
                "endDate": {"type": "string"}
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
        "subscription.created",
        "subscription.payment.required",
        "subscription.notification.send",
        "subscription.cache.updated"
    ]
}

async def handler(req, context):
    """
    Motia Create Subscription Workflow - Connects to NestJS Backend
    Pure workflow orchestrator for subscription creation with meal plan management
    """
    try:
        body = req.get("body", {})
        headers = req.get("headers", {})
        
        customer_id = body.get("customer")
        plan_id = body.get("plan")
        total_amount = body.get("totalAmount", 0)
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Create Subscription Workflow Started", {
            "customerId": customer_id,
            "planId": plan_id,
            "totalAmount": total_amount,
            "autoRenew": body.get("autoRenew", False),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Validate required fields
        if not all([customer_id, plan_id, total_amount]):
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Missing required fields: customer, plan, totalAmount",
                    "error": "Bad Request"
                }
            }

        # Step 1: Forward subscription creation to NestJS backend (real business logic)
        nestjs_subscription_url = "http://localhost:3001/api/subscriptions"
        
        request_headers = {
            "Content-Type": "application/json"
        }
        
        # Include JWT token if provided
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                nestjs_subscription_url,
                json=body,
                headers=request_headers
            )
            
            context.logger.info("NestJS Create Subscription Backend Response", {
                "status_code": response.status_code,
                "customerId": customer_id,
                "planId": plan_id,
                "traceId": context.trace_id
            })
            
            if response.status_code == 201:
                # Step 2: Extract real subscription data from NestJS
                subscription_data = response.json()
                
                # Step 3: Cache subscription data in Redis (performance layer)
                if subscription_data.get("_id"):
                    subscription_cache_key = f"motia:subscription:{subscription_data['_id']}"
                    await redis_service.set_cache(subscription_cache_key, subscription_data, category="subscription")
                    
                    # Cache user's active subscription
                    user_subscription_key = f"motia:user_subscription:{customer_id}"
                    await redis_service.set_cache(user_subscription_key, subscription_data, category="subscription")
                
                # Step 4: Emit workflow events for downstream processing
                await context.emit({
                    "topic": "subscription.created",
                    "data": {
                        "subscriptionId": subscription_data.get("_id"),
                        "customerId": subscription_data.get("customer"),
                        "planId": subscription_data.get("plan"),
                        "status": subscription_data.get("status", "pending"),
                        "totalAmount": subscription_data.get("totalAmount"),
                        "startDate": subscription_data.get("startDate"),
                        "endDate": subscription_data.get("endDate"),
                        "autoRenew": subscription_data.get("autoRenew", False),
                        "paymentFrequency": subscription_data.get("paymentFrequency", "MONTHLY"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                # Emit payment processing event if not already paid
                if not subscription_data.get("isPaid", False):
                    await context.emit({
                        "topic": "subscription.payment.required",
                        "data": {
                            "subscriptionId": subscription_data.get("_id"),
                            "customerId": subscription_data.get("customer"),
                            "amount": subscription_data.get("totalAmount"),
                            "paymentFrequency": subscription_data.get("paymentFrequency", "MONTHLY"),
                            "dueDate": subscription_data.get("startDate"),
                            "timestamp": datetime.now().isoformat()
                        }
                    })

                # Emit subscription notification event
                await context.emit({
                    "topic": "subscription.notification.send",
                    "data": {
                        "type": "subscription_created",
                        "subscriptionId": subscription_data.get("_id"),
                        "customerId": subscription_data.get("customer"),
                        "planId": subscription_data.get("plan"),
                        "message": f"Subscription {subscription_data.get('_id')} created successfully",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                # Emit cache update event
                await context.emit({
                    "topic": "subscription.cache.updated",
                    "data": {
                        "subscriptionId": subscription_data.get("_id"),
                        "customerId": subscription_data.get("customer"),
                        "action": "created",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Create Subscription Workflow Completed Successfully", {
                    "subscriptionId": subscription_data.get("_id"),
                    "customerId": subscription_data.get("customer"),
                    "planId": subscription_data.get("plan"),
                    "status": subscription_data.get("status"),
                    "totalAmount": subscription_data.get("totalAmount"),
                    "traceId": context.trace_id
                })

                # Step 5: Return the exact NestJS response (no modification)
                return {
                    "status": 201,
                    "body": subscription_data
                }
                
            else:
                # Step 6: Handle subscription creation failure
                error_response = response.json() if response.content else {"message": "Subscription creation failed"}
                
                await context.emit({
                    "topic": "subscription.creation.failed",
                    "data": {
                        "customerId": customer_id,
                        "planId": plan_id,
                        "reason": "backend_validation_failed",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Create Subscription Workflow Failed", {
                    "customerId": customer_id,
                    "planId": plan_id,
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Create Subscription Backend Timeout", {
            "customerId": customer_id,
            "planId": plan_id,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "subscription.creation.failed",
            "data": {
                "customerId": customer_id,
                "planId": plan_id,
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Subscription creation service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Create Subscription Workflow Error", {
            "error": str(error),
            "customerId": customer_id,
            "planId": plan_id,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "subscription.creation.failed",
            "data": {
                "customerId": customer_id,
                "planId": plan_id,
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Create subscription workflow failed",
                "error": "Internal server error"
            }
        }
