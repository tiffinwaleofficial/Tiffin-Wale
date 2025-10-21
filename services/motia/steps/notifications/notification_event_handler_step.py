from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

class NotificationEvent(BaseModel):
    notificationId: Optional[str] = None
    userId: Optional[str] = None
    partnerId: Optional[str] = None
    orderId: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    timestamp: str

config = {
    "type": "event",
    "name": "NotificationEventHandler",
    "description": "Handle notification events and automated notification triggers",
    "flows": ["tiffinwale-notifications"],
    "subscribes": [
        # Order-related notification triggers
        "order.created",
        "order.status.updated",
        "order.delivered",
        "order.payment.required",
        
        # User-related notification triggers
        "user.authenticated",
        "user.profile.updated",
        
        # Subscription-related notification triggers
        "subscription.created",
        "subscription.status.changed",
        "subscription.expiry.warning",
        
        # Menu-related notification triggers
        "menu.item.created",
        "menu.item.updated",
        
        # Partner-related notification triggers
        "analytics.partner.viewed",
        
        # Notification delivery events
        "notification.sent",
        "notification.delivery.success",
        "notification.delivery.failed"
    ],
    "emits": [
        "notification.auto.triggered",
        "notification.analytics.updated",
        "notification.alert.sent",
        "notification.batch.processed"
    ]
}

async def handler(req, context):
    """
    Motia Notification Event Handler - Automated Notification Management
    Handles business events and triggers appropriate push notifications
    """
    try:
        event_data = req.get("data", {})
        event_topic = req.get("topic", "")
        
        user_id = event_data.get("userId") or event_data.get("customerId")
        partner_id = event_data.get("partnerId")
        order_id = event_data.get("orderId")
        subscription_id = event_data.get("subscriptionId")
        
        context.logger.info("Motia Notification Event Handler Started", {
            "eventTopic": event_topic,
            "userId": user_id,
            "partnerId": partner_id,
            "orderId": order_id,
            "subscriptionId": subscription_id,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Step 1: Handle different business event types
        if event_topic == "order.created":
            await handle_order_created_notification(event_data, context)
        elif event_topic == "order.status.updated":
            await handle_order_status_notification(event_data, context)
        elif event_topic == "order.delivered":
            await handle_order_delivered_notification(event_data, context)
        elif event_topic == "order.payment.required":
            await handle_payment_required_notification(event_data, context)
        elif event_topic == "user.authenticated":
            await handle_user_login_notification(event_data, context)
        elif event_topic == "subscription.created":
            await handle_subscription_created_notification(event_data, context)
        elif event_topic == "subscription.expiry.warning":
            await handle_subscription_expiry_notification(event_data, context)
        elif event_topic == "menu.item.created":
            await handle_new_menu_item_notification(event_data, context)
        elif event_topic == "analytics.partner.viewed":
            await handle_partner_analytics_notification(event_data, context)
        elif event_topic == "notification.sent":
            await handle_notification_sent_analytics(event_data, context)
        elif event_topic == "notification.delivery.failed":
            await handle_notification_failure_analytics(event_data, context)

        # Step 2: Update global notification analytics
        await update_global_notification_metrics(event_topic, event_data, context)

        # Step 3: Check for notification performance alerts
        await check_notification_alerts(event_topic, event_data, context)

        context.logger.info("Motia Notification Event Handler Completed Successfully", {
            "eventTopic": event_topic,
            "userId": user_id,
            "partnerId": partner_id,
            "traceId": context.trace_id
        })

    except Exception as error:
        context.logger.error("Motia Notification Event Handler Error", {
            "error": str(error),
            "eventTopic": event_topic,
            "userId": event_data.get("userId"),
            "traceId": context.trace_id
        })

async def handle_order_created_notification(event_data, context):
    """Send order confirmation notification to customer"""
    order_id = event_data.get("orderId")
    customer_id = event_data.get("customerId")
    partner_id = event_data.get("partnerId")
    total_amount = event_data.get("totalAmount", 0)
    
    if not all([order_id, customer_id]):
        return
    
    try:
        # Send push notification via NestJS enhanced service
        notification_payload = {
            "title": "🎉 Order Confirmed!",
            "message": f"Your order #{order_id[:8]} has been confirmed. Total: ₹{total_amount}",
            "type": "push",
            "variant": "success",
            "category": "order",
            "userId": customer_id,
            "orderId": order_id,
            "data": {
                "orderId": order_id,
                "partnerId": partner_id,
                "totalAmount": total_amount,
                "clickAction": f"/orders/{order_id}",
                "imageUrl": "https://tiffin-wale.com/images/order-confirmed.png"
            }
        }
        
        await send_notification_via_nestjs(notification_payload, context)
        
        # Also notify partner about new order
        if partner_id:
            partner_notification = {
                "title": "📋 New Order Received!",
                "message": f"New order #{order_id[:8]} - ₹{total_amount}. Start preparing!",
                "type": "push",
                "variant": "info",
                "category": "order",
                "partnerId": partner_id,
                "orderId": order_id,
                "data": {
                    "orderId": order_id,
                    "customerId": customer_id,
                    "totalAmount": total_amount,
                    "clickAction": f"/partner/orders/{order_id}"
                }
            }
            
            await send_notification_via_nestjs(partner_notification, context)
        
        context.logger.info("Order created notifications sent", {
            "orderId": order_id,
            "customerId": customer_id,
            "partnerId": partner_id,
            "traceId": context.trace_id
        })
        
    except Exception as error:
        context.logger.error("Failed to send order created notification", {
            "error": str(error),
            "orderId": order_id,
            "traceId": context.trace_id
        })

async def handle_order_status_notification(event_data, context):
    """Send order status update notifications"""
    order_id = event_data.get("orderId")
    customer_id = event_data.get("customerId")
    new_status = event_data.get("newStatus")
    
    if not all([order_id, customer_id, new_status]):
        return
    
    # Map status to notification content
    status_notifications = {
        "preparing": {
            "title": "👨‍🍳 Order Being Prepared",
            "message": f"Your order #{order_id[:8]} is being prepared with love!",
            "variant": "info"
        },
        "ready": {
            "title": "✅ Order Ready!",
            "message": f"Your order #{order_id[:8]} is ready for pickup/delivery!",
            "variant": "success"
        },
        "out_for_delivery": {
            "title": "🚚 Out for Delivery",
            "message": f"Your order #{order_id[:8]} is on its way to you!",
            "variant": "info"
        },
        "delivered": {
            "title": "🎉 Order Delivered!",
            "message": f"Your order #{order_id[:8]} has been delivered. Enjoy your meal!",
            "variant": "success"
        },
        "cancelled": {
            "title": "❌ Order Cancelled",
            "message": f"Your order #{order_id[:8]} has been cancelled. Refund will be processed.",
            "variant": "warning"
        }
    }
    
    notification_config = status_notifications.get(new_status)
    if not notification_config:
        return
    
    try:
        notification_payload = {
            "title": notification_config["title"],
            "message": notification_config["message"],
            "type": "push",
            "variant": notification_config["variant"],
            "category": "order",
            "userId": customer_id,
            "orderId": order_id,
            "data": {
                "orderId": order_id,
                "status": new_status,
                "clickAction": f"/orders/{order_id}"
            }
        }
        
        await send_notification_via_nestjs(notification_payload, context)
        
        context.logger.info("Order status notification sent", {
            "orderId": order_id,
            "customerId": customer_id,
            "newStatus": new_status,
            "traceId": context.trace_id
        })
        
    except Exception as error:
        context.logger.error("Failed to send order status notification", {
            "error": str(error),
            "orderId": order_id,
            "newStatus": new_status,
            "traceId": context.trace_id
        })

async def handle_subscription_created_notification(event_data, context):
    """Send subscription confirmation notification"""
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    plan_id = event_data.get("planId")
    total_amount = event_data.get("totalAmount", 0)
    
    if not all([subscription_id, customer_id]):
        return
    
    try:
        notification_payload = {
            "title": "🎊 Subscription Activated!",
            "message": f"Your meal plan subscription is now active. Enjoy fresh meals daily!",
            "type": "push",
            "variant": "success",
            "category": "subscription",
            "userId": customer_id,
            "data": {
                "subscriptionId": subscription_id,
                "planId": plan_id,
                "totalAmount": total_amount,
                "clickAction": "/subscription"
            }
        }
        
        await send_notification_via_nestjs(notification_payload, context)
        
        context.logger.info("Subscription created notification sent", {
            "subscriptionId": subscription_id,
            "customerId": customer_id,
            "traceId": context.trace_id
        })
        
    except Exception as error:
        context.logger.error("Failed to send subscription created notification", {
            "error": str(error),
            "subscriptionId": subscription_id,
            "traceId": context.trace_id
        })

async def handle_subscription_expiry_notification(event_data, context):
    """Send subscription expiry warning notification"""
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    days_until_expiry = event_data.get("daysUntilExpiry", 0)
    
    if not all([subscription_id, customer_id]):
        return
    
    try:
        notification_payload = {
            "title": "⏰ Subscription Expiring Soon",
            "message": f"Your meal plan expires in {days_until_expiry} days. Renew now to continue enjoying fresh meals!",
            "type": "push",
            "variant": "warning",
            "category": "subscription",
            "userId": customer_id,
            "data": {
                "subscriptionId": subscription_id,
                "daysUntilExpiry": days_until_expiry,
                "clickAction": "/subscription/renew"
            }
        }
        
        await send_notification_via_nestjs(notification_payload, context)
        
        context.logger.info("Subscription expiry notification sent", {
            "subscriptionId": subscription_id,
            "customerId": customer_id,
            "daysUntilExpiry": days_until_expiry,
            "traceId": context.trace_id
        })
        
    except Exception as error:
        context.logger.error("Failed to send subscription expiry notification", {
            "error": str(error),
            "subscriptionId": subscription_id,
            "traceId": context.trace_id
        })

async def handle_new_menu_item_notification(event_data, context):
    """Send new menu item notification to subscribed users"""
    menu_item_id = event_data.get("menuItemId")
    partner_id = event_data.get("partnerId")
    item_name = event_data.get("itemName", "New Item")
    
    if not all([menu_item_id, partner_id]):
        return
    
    try:
        # Send topic notification to users who follow this partner
        topic_notification = {
            "title": "🍽️ New Menu Item Available!",
            "message": f"Try the new {item_name} from your favorite restaurant!",
            "data": {
                "menuItemId": menu_item_id,
                "partnerId": partner_id,
                "itemName": item_name,
                "clickAction": f"/menu/{partner_id}"
            }
        }
        
        # Send to partner followers topic
        await send_topic_notification_via_nestjs(f"partner_{partner_id}_followers", topic_notification, context)
        
        context.logger.info("New menu item notification sent", {
            "menuItemId": menu_item_id,
            "partnerId": partner_id,
            "itemName": item_name,
            "traceId": context.trace_id
        })
        
    except Exception as error:
        context.logger.error("Failed to send new menu item notification", {
            "error": str(error),
            "menuItemId": menu_item_id,
            "traceId": context.trace_id
        })

async def handle_notification_sent_analytics(event_data, context):
    """Track successful notification delivery analytics"""
    category = event_data.get("category", "unknown")
    total_sent = event_data.get("totalSent", 0)
    delivery_stats = event_data.get("deliveryStats", {})
    
    # Track notification success metrics
    success_daily_key = f"notifications:success:daily:{datetime.now().strftime('%Y-%m-%d')}"
    current_daily_count = await context.state.get("notification_cache", success_daily_key) or 0
    await context.state.set("notification_cache", success_daily_key, current_daily_count + total_sent)
    
    success_category_key = f"notifications:success:category:{category}"
    current_category_count = await context.state.get("notification_cache", success_category_key) or 0
    await context.state.set("notification_cache", success_category_key, current_category_count + total_sent)
    
    # Track platform-specific metrics
    expo_sent = delivery_stats.get("expo", {}).get("sent", 0)
    firebase_sent = delivery_stats.get("firebase", {}).get("sent", 0)
    
    if expo_sent > 0:
        expo_success_key = "notifications:platform:expo:success"
        current_expo_count = await context.state.get("notification_cache", expo_success_key) or 0
        await context.state.set("notification_cache", expo_success_key, current_expo_count + expo_sent)
    if firebase_sent > 0:
        firebase_success_key = "notifications:platform:firebase:success"
        current_firebase_count = await context.state.get("notification_cache", firebase_success_key) or 0
        await context.state.set("notification_cache", firebase_success_key, current_firebase_count + firebase_sent)
    
    context.logger.info("Notification success analytics tracked", {
        "category": category,
        "totalSent": total_sent,
        "expoSent": expo_sent,
        "firebaseSent": firebase_sent,
        "traceId": context.trace_id
    })

async def handle_notification_failure_analytics(event_data, context):
    """Track failed notification delivery analytics"""
    category = event_data.get("category", "unknown")
    reason = event_data.get("reason", "unknown")
    
    # Track notification failure metrics
    failure_daily_key = f"notifications:failure:daily:{datetime.now().strftime('%Y-%m-%d')}"
    current_failure_daily_count = await context.state.get("notification_cache", failure_daily_key) or 0
    await context.state.set("notification_cache", failure_daily_key, current_failure_daily_count + 1)
    
    failure_category_key = f"notifications:failure:category:{category}"
    current_failure_category_count = await context.state.get("notification_cache", failure_category_key) or 0
    await context.state.set("notification_cache", failure_category_key, current_failure_category_count + 1)
    
    failure_reason_key = f"notifications:failure:reason:{reason}"
    current_failure_reason_count = await context.state.get("notification_cache", failure_reason_key) or 0
    await context.state.set("notification_cache", failure_reason_key, current_failure_reason_count + 1)
    
    context.logger.info("Notification failure analytics tracked", {
        "category": category,
        "reason": reason,
        "traceId": context.trace_id
    })

async def send_notification_via_nestjs(payload, context):
    """Helper to send notification via NestJS enhanced service"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "http://localhost:3001/api/notifications/send-enhanced",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 201:
                context.logger.info("Notification sent successfully via NestJS", {
                    "title": payload.get("title"),
                    "category": payload.get("category"),
                    "userId": payload.get("userId"),
                    "traceId": context.trace_id
                })
            else:
                context.logger.error("Failed to send notification via NestJS", {
                    "status_code": response.status_code,
                    "title": payload.get("title"),
                    "traceId": context.trace_id
                })
                
    except Exception as error:
        context.logger.error("Error sending notification via NestJS", {
            "error": str(error),
            "title": payload.get("title"),
            "traceId": context.trace_id
        })

async def send_topic_notification_via_nestjs(topic, payload, context):
    """Helper to send topic notification via NestJS Firebase service"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "http://localhost:3001/api/notifications/send-topic",
                json={
                    "topic": topic,
                    "notification": payload
                },
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 201:
                context.logger.info("Topic notification sent successfully via NestJS", {
                    "topic": topic,
                    "title": payload.get("title"),
                    "traceId": context.trace_id
                })
            else:
                context.logger.error("Failed to send topic notification via NestJS", {
                    "status_code": response.status_code,
                    "topic": topic,
                    "traceId": context.trace_id
                })
                
    except Exception as error:
        context.logger.error("Error sending topic notification via NestJS", {
            "error": str(error),
            "topic": topic,
            "traceId": context.trace_id
        })

async def update_global_notification_metrics(event_topic, event_data, context):
    """Update global notification metrics"""
    # Track notification activity
    notification_activity_key = "analytics:notification_activity"
    current_activity_count = await context.state.get("notification_cache", notification_activity_key) or 0
    await context.state.set("notification_cache", notification_activity_key, current_activity_count + 1)
    
    # Track event types
    event_type_key = f"analytics:notification_events:{event_topic}"
    current_event_type_count = await context.state.get("notification_cache", event_type_key) or 0
    await context.state.set("notification_cache", event_type_key, current_event_type_count + 1)

async def check_notification_alerts(event_topic, event_data, context):
    """Check for notification performance alerts"""
    # Example: Check for high failure rates
    if event_topic == "notification.delivery.failed":
        failure_count_key = f"notifications:failure:daily:{datetime.now().strftime('%Y-%m-%d')}"
        failure_count = await context.state.get("notification_cache", failure_count_key) or 0
        
        # Alert if failure rate is high (example: >100 failures per day)
        if failure_count > 100:
            await context.emit({
                "topic": "notification.alert.sent",
                "data": {
                    "alertType": "high_failure_rate",
                    "failureCount": failure_count,
                    "date": datetime.now().strftime('%Y-%m-%d'),
                    "timestamp": datetime.now().isoformat()
                }
            })
            
            context.logger.warn("High notification failure rate detected", {
                "failureCount": failure_count,
                "traceId": context.trace_id
            })
