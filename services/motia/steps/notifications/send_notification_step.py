from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

class SendNotificationRequest(BaseModel):
    title: str
    message: str
    type: Optional[str] = "push"
    variant: Optional[str] = "info"
    category: Optional[str] = "system"
    userId: Optional[str] = None
    partnerId: Optional[str] = None
    orderId: Optional[str] = None
    data: Optional[Dict[str, Any]] = {}
    scheduledFor: Optional[str] = None
    channels: Optional[List[str]] = ["push"]
    templateKey: Optional[str] = None
    templateVariables: Optional[Dict[str, Any]] = {}

config = {
    "type": "api",
    "name": "SendNotification",
    "description": "TiffinWale send enhanced notification workflow - dual Expo + Firebase delivery",
    "flows": ["tiffinwale-notifications"],
    "method": "POST",
    "path": "/notifications/send",
    "bodySchema": SendNotificationRequest.model_json_schema(),
    "responseSchema": {
        201: {
            "type": "object",
            "properties": {
                "success": {"type": "boolean"},
                "notificationId": {"type": "string"},
                "deliveryStats": {
                    "type": "object",
                    "properties": {
                        "expo": {
                            "type": "object",
                            "properties": {
                                "sent": {"type": "number"},
                                "failed": {"type": "number"}
                            }
                        },
                        "firebase": {
                            "type": "object",
                            "properties": {
                                "sent": {"type": "number"},
                                "failed": {"type": "number"}
                            }
                        }
                    }
                }
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
        "notification.sent",
        "notification.delivery.success",
        "notification.delivery.failed",
        "notification.analytics.updated"
    ]
}

async def handler(req, context):
    """
    Motia Send Notification Workflow - Enhanced Dual Delivery System
    Pure workflow orchestrator for sending notifications via Expo + Firebase
    """
    try:
        body = req.get("body", {})
        headers = req.get("headers", {})
        
        title = body.get("title", "")
        message = body.get("message", "")
        notification_type = body.get("type", "push")
        variant = body.get("variant", "info")
        category = body.get("category", "system")
        user_id = body.get("userId")
        partner_id = body.get("partnerId")
        order_id = body.get("orderId")
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Send Notification Workflow Started", {
            "title": title,
            "category": category,
            "variant": variant,
            "userId": user_id,
            "partnerId": partner_id,
            "orderId": order_id,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Validate required fields
        if not all([title, message]):
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Missing required fields: title, message",
                    "error": "Bad Request"
                }
            }

        # Step 1: Forward notification to NestJS enhanced notification service
        nestjs_notification_url = "http://localhost:3001/api/notifications/send-enhanced"
        
        request_headers = {
            "Content-Type": "application/json"
        }
        
        # Include JWT token if provided
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        # Prepare notification payload for NestJS
        notification_payload = {
            "title": title,
            "message": message,
            "type": notification_type,
            "variant": variant,
            "category": category,
            "userId": user_id,
            "partnerId": partner_id,
            "orderId": order_id,
            "data": body.get("data", {}),
            "scheduledFor": body.get("scheduledFor"),
            "channels": body.get("channels", ["push"]),
            "templateKey": body.get("templateKey"),
            "templateVariables": body.get("templateVariables", {})
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                nestjs_notification_url,
                json=notification_payload,
                headers=request_headers
            )
            
            context.logger.info("NestJS Enhanced Notification Backend Response", {
                "status_code": response.status_code,
                "title": title,
                "category": category,
                "userId": user_id,
                "traceId": context.trace_id
            })
            
            if response.status_code == 201:
                # Step 2: Extract real notification delivery data from NestJS
                notification_result = response.json()
                
                delivery_stats = notification_result.get("deliveryStats", {
                    "expo": {"sent": 0, "failed": 0},
                    "firebase": {"sent": 0, "failed": 0}
                })
                
                notification_id = notification_result.get("notificationId", "unknown")
                
                # Step 3: Cache notification delivery stats (performance layer)
                notification_cache_key = f"notification:{notification_id}"
                await context.state.set("notification_cache", notification_cache_key, notification_result)
                
                # Cache user notification count
                if user_id:
                    user_notification_count_key = f"user_notifications_count:{user_id}"
                    current_count = await context.state.get("notification_cache", user_notification_count_key) or 0
                    await context.state.set("notification_cache", user_notification_count_key, current_count + 1)
                
                # Step 4: Emit workflow events for downstream processing
                total_sent = delivery_stats["expo"]["sent"] + delivery_stats["firebase"]["sent"]
                total_failed = delivery_stats["expo"]["failed"] + delivery_stats["firebase"]["failed"]
                
                if total_sent > 0:
                    await context.emit({
                        "topic": "notification.sent",
                        "data": {
                            "notificationId": notification_id,
                            "title": title,
                            "category": category,
                            "userId": user_id,
                            "partnerId": partner_id,
                            "orderId": order_id,
                            "deliveryStats": delivery_stats,
                            "totalSent": total_sent,
                            "totalFailed": total_failed,
                            "timestamp": datetime.now().isoformat(),
                            "source": "nestjs_enhanced_notification"
                        }
                    })

                    await context.emit({
                        "topic": "notification.delivery.success",
                        "data": {
                            "notificationId": notification_id,
                            "title": title,
                            "category": category,
                            "userId": user_id,
                            "deliveryMethod": "dual_expo_firebase",
                            "expoSent": delivery_stats["expo"]["sent"],
                            "firebaseSent": delivery_stats["firebase"]["sent"],
                            "timestamp": datetime.now().isoformat()
                        }
                    })
                else:
                    await context.emit({
                        "topic": "notification.delivery.failed",
                        "data": {
                            "notificationId": notification_id,
                            "title": title,
                            "category": category,
                            "userId": user_id,
                            "reason": "no_devices_reached",
                            "deliveryStats": delivery_stats,
                            "timestamp": datetime.now().isoformat()
                        }
                    })

                # Emit analytics update event
                await context.emit({
                    "topic": "notification.analytics.updated",
                    "data": {
                        "category": category,
                        "variant": variant,
                        "platform": "dual_expo_firebase",
                        "sent": total_sent,
                        "failed": total_failed,
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Send Notification Workflow Completed Successfully", {
                    "notificationId": notification_id,
                    "title": title,
                    "category": category,
                    "totalSent": total_sent,
                    "totalFailed": total_failed,
                    "expoSent": delivery_stats["expo"]["sent"],
                    "firebaseSent": delivery_stats["firebase"]["sent"],
                    "traceId": context.trace_id
                })

                # Step 5: Return the exact NestJS response (no modification)
                return {
                    "status": 201,
                    "body": notification_result
                }
                
            else:
                # Step 6: Handle notification sending failure
                error_response = response.json() if response.content else {"message": "Notification sending failed"}
                
                await context.emit({
                    "topic": "notification.delivery.failed",
                    "data": {
                        "title": title,
                        "category": category,
                        "userId": user_id,
                        "reason": "backend_service_failed",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_enhanced_notification"
                    }
                })

                context.logger.info("Motia Send Notification Workflow Failed", {
                    "title": title,
                    "category": category,
                    "userId": user_id,
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Enhanced Notification Backend Timeout", {
            "title": title,
            "category": category,
            "userId": user_id,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "notification.delivery.failed",
            "data": {
                "title": title,
                "category": category,
                "userId": user_id,
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Notification service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Send Notification Workflow Error", {
            "error": str(error),
            "title": title,
            "category": category,
            "userId": user_id,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "notification.delivery.failed",
            "data": {
                "title": title,
                "category": category,
                "userId": user_id,
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Send notification workflow failed",
                "error": "Internal server error"
            }
        }
