from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import httpx

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def set_cache(self, key, value, category=None):
        return True

redis_service = SimpleRedisService()

class OrderNotificationEvent(BaseModel):
    type: str
    orderId: str
    customerId: str
    partnerId: str
    message: str
    newStatus: Optional[str] = None
    timestamp: str

config = {
    "type": "event",
    "name": "OrderNotificationHandler",
    "description": "Handle order notification events and send to NestJS notification service",
    "flows": ["tiffinwale-orders"],
    "subscribes": ["order.notification.send"],
    "emits": ["notification.email.sent", "notification.push.sent", "notification.failed"]
}

async def handler(req, context):
    """
    Motia Order Notification Handler - Connects to NestJS Notification Service
    Pure workflow orchestrator for order notifications
    """
    try:
        event_data = req.get("data", {})
        
        context.logger.info("Motia Order Notification Handler Started", {
            "type": event_data.get("type"),
            "orderId": event_data.get("orderId"),
            "customerId": event_data.get("customerId"),
            "partnerId": event_data.get("partnerId"),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Step 1: Prepare notification data for NestJS backend
        notification_type = event_data.get("type", "order_update")
        order_id = event_data.get("orderId")
        customer_id = event_data.get("customerId")
        partner_id = event_data.get("partnerId")
        message = event_data.get("message", "Order update")
        
        # Step 2: Send customer notification via NestJS
        if customer_id:
            customer_notification_payload = {
                "userId": customer_id,
                "type": notification_type,
                "title": f"Order Update - {order_id}",
                "message": message,
                "data": {
                    "orderId": order_id,
                    "status": event_data.get("newStatus"),
                    "timestamp": event_data.get("timestamp")
                }
            }
            
            await send_notification_to_nestjs(
                customer_notification_payload, 
                "customer", 
                context
            )

        # Step 3: Send partner notification via NestJS
        if partner_id:
            partner_notification_payload = {
                "userId": partner_id,
                "type": notification_type,
                "title": f"Order Update - {order_id}",
                "message": message,
                "data": {
                    "orderId": order_id,
                    "customerId": customer_id,
                    "status": event_data.get("newStatus"),
                    "timestamp": event_data.get("timestamp")
                }
            }
            
            await send_notification_to_nestjs(
                partner_notification_payload, 
                "partner", 
                context
            )

        # Step 4: Cache notification history
        notification_cache_key = f"motia:notification:{order_id}:{datetime.now().timestamp()}"
        await redis_service.set_cache(notification_cache_key, {
            "type": notification_type,
            "orderId": order_id,
            "customerId": customer_id,
            "partnerId": partner_id,
            "message": message,
            "sentAt": datetime.now().isoformat()
        }, category="notification")

        context.logger.info("Motia Order Notification Handler Completed Successfully", {
            "orderId": order_id,
            "customerId": customer_id,
            "partnerId": partner_id,
            "notificationType": notification_type,
            "traceId": context.trace_id
        })

    except Exception as error:
        context.logger.error("Motia Order Notification Handler Error", {
            "error": str(error),
            "orderId": event_data.get("orderId"),
            "customerId": event_data.get("customerId"),
            "partnerId": event_data.get("partnerId"),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "notification.failed",
            "data": {
                "orderId": event_data.get("orderId"),
                "customerId": event_data.get("customerId"),
                "partnerId": event_data.get("partnerId"),
                "reason": "handler_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

async def send_notification_to_nestjs(payload, recipient_type, context):
    """
    Send notification to NestJS notification service
    """
    try:
        # Forward to NestJS notification service
        nestjs_notification_url = "http://localhost:3001/api/notifications/send"
        
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                nestjs_notification_url,
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                await context.emit({
                    "topic": "notification.email.sent" if recipient_type == "customer" else "notification.push.sent",
                    "data": {
                        "userId": payload.get("userId"),
                        "orderId": payload.get("data", {}).get("orderId"),
                        "type": payload.get("type"),
                        "recipientType": recipient_type,
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })
                
                context.logger.info("Notification sent successfully via NestJS", {
                    "userId": payload.get("userId"),
                    "orderId": payload.get("data", {}).get("orderId"),
                    "recipientType": recipient_type,
                    "traceId": context.trace_id
                })
            else:
                await context.emit({
                    "topic": "notification.failed",
                    "data": {
                        "userId": payload.get("userId"),
                        "orderId": payload.get("data", {}).get("orderId"),
                        "recipientType": recipient_type,
                        "reason": "nestjs_service_error",
                        "status_code": response.status_code,
                        "timestamp": datetime.now().isoformat()
                    }
                })
                
                context.logger.error("Notification failed via NestJS", {
                    "userId": payload.get("userId"),
                    "orderId": payload.get("data", {}).get("orderId"),
                    "recipientType": recipient_type,
                    "status_code": response.status_code,
                    "traceId": context.trace_id
                })
                
    except Exception as e:
        await context.emit({
            "topic": "notification.failed",
            "data": {
                "userId": payload.get("userId"),
                "orderId": payload.get("data", {}).get("orderId"),
                "recipientType": recipient_type,
                "reason": "connection_error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
        })
        
        context.logger.error("Notification connection error", {
            "error": str(e),
            "userId": payload.get("userId"),
            "recipientType": recipient_type,
            "traceId": context.trace_id
        })
