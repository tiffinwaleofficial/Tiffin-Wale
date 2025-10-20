from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def set_cache(self, key, value, category=None):
        return True
    async def increment(self, key, amount=1, ttl=None):
        return amount
    async def add_to_list(self, key, value, max_length=None):
        return True

redis_service = SimpleRedisService()

class EmailEvent(BaseModel):
    emailType: Optional[str] = None
    campaignId: Optional[str] = None
    orderId: Optional[str] = None
    userId: Optional[str] = None
    timestamp: str

config = {
    "type": "event",
    "name": "EmailEventHandler",
    "description": "Handle email events and analytics for comprehensive email tracking",
    "flows": ["tiffinwale-email"],
    "subscribes": [
        "email.order.sent",
        "email.promotional.sent", 
        "email.delivery.failed",
        "email.campaign.completed",
        "email.marketing.analytics",
        "order.created",
        "order.status.updated", 
        "order.notification.send",
        "user.authenticated",
        "user.profile.updated",
        "menu.item.created",
        "menu.item.updated",
        "analytics.partner.viewed",
        "user.contact.changed",
        "order.payment.required",
        "order.delivered",
        "subscription.created",
        "subscription.status.changed",
        "subscription.expiry.warning"
    ],
    "emits": [
        "email.auto.triggered",
        "email.analytics.updated",
        "email.alert.sent",
        "email.performance.tracked"
    ]
}

async def handler(req, context):
    """
    Motia Email Event Handler - Automated Email Triggers & Analytics
    Handles automatic email triggers and comprehensive email analytics
    """
    try:
        event_data = req.get("data", {})
        event_topic = req.get("topic", "")
        
        email_type = event_data.get("emailType")
        campaign_id = event_data.get("campaignId")
        order_id = event_data.get("orderId")
        user_id = event_data.get("userId")
        
        context.logger.info("Motia Email Event Handler Started", {
            "eventTopic": event_topic,
            "emailType": email_type,
            "campaignId": campaign_id,
            "orderId": order_id,
            "userId": user_id,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Step 1: Handle different email event types
        if event_topic == "email.order.sent":
            await handle_order_email_sent(event_data, context)
        elif event_topic == "email.promotional.sent":
            await handle_promotional_email_sent(event_data, context)
        elif event_topic == "email.delivery.failed":
            await handle_email_delivery_failed(event_data, context)
        elif event_topic == "email.campaign.completed":
            await handle_campaign_completed(event_data, context)
        elif event_topic == "email.marketing.analytics":
            await handle_marketing_analytics(event_data, context)
        elif event_topic == "order.created":
            await handle_order_created_trigger(event_data, context)
        elif event_topic == "order.status.updated":
            await handle_order_status_trigger(event_data, context)
        elif event_topic == "order.notification.send":
            await handle_order_notification_trigger(event_data, context)
        elif event_topic == "user.authenticated":
            await handle_user_authenticated_trigger(event_data, context)
        elif event_topic == "user.profile.updated":
            await handle_user_profile_updated_trigger(event_data, context)
        elif event_topic == "menu.item.created":
            await handle_menu_item_created_trigger(event_data, context)
        elif event_topic == "analytics.partner.viewed":
            await handle_partner_analytics_trigger(event_data, context)
        elif event_topic == "menu.item.updated":
            await handle_menu_item_updated_trigger(event_data, context)
        elif event_topic == "user.contact.changed":
            await handle_user_contact_changed_trigger(event_data, context)
        elif event_topic == "order.payment.required":
            await handle_payment_required_trigger(event_data, context)
        elif event_topic == "order.delivered":
            await handle_order_delivered_trigger(event_data, context)
        elif event_topic == "subscription.created":
            await handle_subscription_created_trigger(event_data, context)
        elif event_topic == "subscription.status.changed":
            await handle_subscription_status_trigger(event_data, context)
        elif event_topic == "subscription.expiry.warning":
            await handle_subscription_expiry_trigger(event_data, context)

        # Step 2: Update global email analytics
        await update_global_email_metrics(event_topic, event_data, context)

        # Step 3: Check for email performance alerts
        await check_email_performance_alerts(event_topic, event_data, context)

        context.logger.info("Motia Email Event Handler Completed Successfully", {
            "eventTopic": event_topic,
            "emailType": email_type,
            "traceId": context.trace_id
        })

    except Exception as error:
        context.logger.error("Motia Email Event Handler Error", {
            "error": str(error),
            "eventTopic": event_topic,
            "emailType": event_data.get("emailType"),
            "traceId": context.trace_id
        })

async def handle_order_email_sent(event_data, context):
    """Handle order email sent events"""
    order_id = event_data.get("orderId")
    email_type = event_data.get("emailType")
    user_id = event_data.get("userId")
    
    # Track order email timeline
    order_email_timeline_key = f"motia:email:order_timeline:{order_id}"
    email_event = {
        "emailType": email_type,
        "sentAt": event_data.get("sentAt"),
        "emailId": event_data.get("emailId"),
        "status": "sent"
    }
    await redis_service.add_to_list(order_email_timeline_key, email_event, max_length=20)
    
    # Track user email engagement
    user_email_engagement_key = f"motia:email:user_engagement:{user_id}"
    await redis_service.increment(user_email_engagement_key, 1, ttl=604800)  # 7 days
    
    await context.emit({
        "topic": "email.analytics.updated",
        "data": {
            "type": "order_email",
            "orderId": order_id,
            "emailType": email_type,
            "userId": user_id,
            "status": "sent",
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Order email sent tracked", {
        "orderId": order_id,
        "emailType": email_type,
        "userId": user_id,
        "traceId": context.trace_id
    })

async def handle_promotional_email_sent(event_data, context):
    """Handle promotional email sent events"""
    campaign_id = event_data.get("campaignId")
    email_type = event_data.get("emailType")
    emails_sent = event_data.get("emailsSent", 0)
    emails_failed = event_data.get("emailsFailed", 0)
    
    # Track campaign performance
    campaign_performance_key = f"motia:email:campaign_performance:{campaign_id}"
    performance_data = {
        "emailType": email_type,
        "sent": emails_sent,
        "failed": emails_failed,
        "successRate": round((emails_sent / (emails_sent + emails_failed)) * 100, 2) if (emails_sent + emails_failed) > 0 else 0,
        "timestamp": datetime.now().isoformat()
    }
    await redis_service.set_cache(campaign_performance_key, performance_data, category="email")
    
    # Track promotional email trends
    promo_trend_key = f"motia:email:promotional_trends:{email_type}"
    await redis_service.increment(promo_trend_key, emails_sent, ttl=2592000)  # 30 days
    
    await context.emit({
        "topic": "email.performance.tracked",
        "data": {
            "type": "promotional_campaign",
            "campaignId": campaign_id,
            "emailType": email_type,
            "performance": performance_data,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Promotional email campaign tracked", {
        "campaignId": campaign_id,
        "emailType": email_type,
        "emailsSent": emails_sent,
        "traceId": context.trace_id
    })

async def handle_email_delivery_failed(event_data, context):
    """Handle email delivery failure events"""
    email_type = event_data.get("emailType")
    reason = event_data.get("reason", "unknown")
    order_id = event_data.get("orderId")
    user_id = event_data.get("userId")
    
    # Track email failures
    failure_key = f"motia:email:failures:{email_type}"
    await redis_service.increment(failure_key, 1, ttl=86400)
    
    # Track failure reasons
    failure_reason_key = f"motia:email:failure_reasons:{reason}"
    await redis_service.increment(failure_reason_key, 1, ttl=86400)
    
    # Log failed email for retry mechanism
    if order_id:
        failed_order_email_key = f"motia:email:failed_orders:{order_id}"
        failure_log = {
            "emailType": email_type,
            "reason": reason,
            "failedAt": datetime.now().isoformat(),
            "retryCount": 0
        }
        await redis_service.set_cache(failed_order_email_key, failure_log, category="email")
    
    await context.emit({
        "topic": "email.alert.sent",
        "data": {
            "alertType": "email_delivery_failure",
            "emailType": email_type,
            "reason": reason,
            "orderId": order_id,
            "userId": user_id,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Email delivery failure tracked", {
        "emailType": email_type,
        "reason": reason,
        "orderId": order_id,
        "traceId": context.trace_id
    })

async def handle_campaign_completed(event_data, context):
    """Handle campaign completion events"""
    campaign_id = event_data.get("campaignId")
    success_rate = event_data.get("successRate", 0)
    total_recipients = event_data.get("totalRecipients", 0)
    
    # Store campaign results
    campaign_results_key = f"motia:email:campaign_results:{campaign_id}"
    results = {
        "successRate": success_rate,
        "totalRecipients": total_recipients,
        "completedAt": datetime.now().isoformat(),
        "status": "completed"
    }
    await redis_service.set_cache(campaign_results_key, results, category="email")
    
    # Track campaign success metrics
    if success_rate >= 95:
        high_success_key = "motia:email:high_success_campaigns"
        await redis_service.increment(high_success_key, 1, ttl=2592000)  # 30 days
    elif success_rate < 80:
        low_success_key = "motia:email:low_success_campaigns"
        await redis_service.increment(low_success_key, 1, ttl=2592000)
    
    context.logger.info("Campaign completion tracked", {
        "campaignId": campaign_id,
        "successRate": success_rate,
        "totalRecipients": total_recipients,
        "traceId": context.trace_id
    })

async def handle_marketing_analytics(event_data, context):
    """Handle marketing analytics events"""
    campaign_id = event_data.get("campaignId")
    metrics = event_data.get("metrics", {})
    
    # Store marketing metrics
    marketing_metrics_key = f"motia:email:marketing_metrics:{campaign_id}"
    await redis_service.set_cache(marketing_metrics_key, metrics, category="analytics")
    
    # Update global marketing performance
    global_marketing_key = "motia:email:global_marketing_performance"
    await redis_service.increment(f"{global_marketing_key}:sent", metrics.get("sent", 0), ttl=2592000)
    await redis_service.increment(f"{global_marketing_key}:failed", metrics.get("failed", 0), ttl=2592000)
    
    context.logger.info("Marketing analytics tracked", {
        "campaignId": campaign_id,
        "metrics": metrics,
        "traceId": context.trace_id
    })

async def handle_order_created_trigger(event_data, context):
    """Handle automatic email trigger when order is created"""
    order_id = event_data.get("orderId")
    customer_id = event_data.get("customerId")
    
    # Trigger order confirmation email automatically
    await context.emit({
        "topic": "email.auto.triggered",
        "data": {
            "triggerType": "order_confirmation",
            "orderId": order_id,
            "customerId": customer_id,
            "emailType": "confirmation",
            "autoTriggered": True,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Order confirmation email auto-triggered", {
        "orderId": order_id,
        "customerId": customer_id,
        "traceId": context.trace_id
    })

async def handle_order_status_trigger(event_data, context):
    """Handle automatic email trigger when order status changes"""
    order_id = event_data.get("orderId")
    new_status = event_data.get("newStatus")
    customer_id = event_data.get("customerId")
    
    # Map order status to email types
    status_email_map = {
        "preparing": "preparing",
        "ready": "ready",
        "delivered": "delivered",
        "cancelled": "cancelled"
    }
    
    email_type = status_email_map.get(new_status)
    if email_type:
        await context.emit({
            "topic": "email.auto.triggered",
            "data": {
                "triggerType": "order_status_update",
                "orderId": order_id,
                "customerId": customer_id,
                "emailType": email_type,
                "orderStatus": new_status,
                "autoTriggered": True,
                "timestamp": datetime.now().isoformat()
            }
        })
        
        context.logger.info("Order status email auto-triggered", {
            "orderId": order_id,
            "newStatus": new_status,
            "emailType": email_type,
            "traceId": context.trace_id
        })

async def handle_order_notification_trigger(event_data, context):
    """Handle order notification trigger from your NestJS backend"""
    import httpx
    
    notification_type = event_data.get("type")  # "order_confirmation", "order_preparing", etc.
    order_id = event_data.get("orderId")
    customer_id = event_data.get("customerId")
    partner_id = event_data.get("partnerId")
    
    # Map notification types to email types
    email_type_map = {
        "order_confirmation": "confirmation",
        "order_preparing": "preparing", 
        "order_ready": "ready",
        "order_delivered": "delivered",
        "order_cancelled": "cancelled"
    }
    
    email_type = email_type_map.get(notification_type, "confirmation")
    
    try:
        # Step 1: Get order details from NestJS backend
        async with httpx.AsyncClient(timeout=10.0) as client:
            order_response = await client.get(f"http://localhost:3001/api/orders/{order_id}")
            
            if order_response.status_code == 200:
                order_data = order_response.json()
                
                # Step 2: Get customer details
                customer_response = await client.get(f"http://localhost:3001/api/users/{customer_id}")
                customer_data = customer_response.json() if customer_response.status_code == 200 else {}
                
                # Step 3: Trigger NestJS email service directly
                email_payload = {
                    "to": customer_data.get("email", ""),
                    "template": f"order-{email_type}",
                    "data": {
                        "order": {
                            "orderNumber": order_data.get("_id"),
                            "items": order_data.get("items", []),
                            "totalAmount": order_data.get("totalAmount", 0),
                            "deliveryAddress": order_data.get("deliveryAddress", ""),
                            "scheduledDeliveryTime": order_data.get("scheduledDeliveryTime", "")
                        },
                        "customer": {
                            "name": f"{customer_data.get('firstName', '')} {customer_data.get('lastName', '')}".strip() or "Valued Customer",
                            "email": customer_data.get("email", "")
                        }
                    },
                    "senderType": "order"
                }
                
                # Step 4: Send email via NestJS email service
                email_response = await client.post(
                    "http://localhost:3001/api/email/send",
                    json=email_payload,
                    headers={"Content-Type": "application/json"}
                )
                
                if email_response.status_code == 201:
                    await context.emit({
                        "topic": "email.order.sent",
                        "data": {
                            "orderId": order_id,
                            "userId": customer_id,
                            "email": customer_data.get("email"),
                            "emailType": email_type,
                            "emailId": email_response.json().get("emailId", "unknown"),
                            "sentAt": datetime.now().isoformat(),
                            "source": "nestjs_email_service"
                        }
                    })
                    
                    context.logger.info("Order email triggered successfully via NestJS", {
                        "orderId": order_id,
                        "emailType": email_type,
                        "customerEmail": customer_data.get("email"),
                        "traceId": context.trace_id
                    })
                else:
                    await context.emit({
                        "topic": "email.delivery.failed",
                        "data": {
                            "orderId": order_id,
                            "userId": customer_id,
                            "emailType": email_type,
                            "reason": "nestjs_email_service_failed",
                            "timestamp": datetime.now().isoformat()
                        }
                    })
                    
    except Exception as error:
        context.logger.error("Failed to trigger order email via NestJS", {
            "error": str(error),
            "orderId": order_id,
            "emailType": email_type,
            "traceId": context.trace_id
        })

async def handle_user_authenticated_trigger(event_data, context):
    """Handle welcome email trigger when user first authenticates (new user)"""
    import httpx
    
    user_id = event_data.get("userId")
    email = event_data.get("email")
    
    # Check if this is a new user (first login) by checking user creation date
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            user_response = await client.get(f"http://localhost:3001/api/users/{user_id}")
            
            if user_response.status_code == 200:
                user_data = user_response.json()
                
                # Check if user was created recently (within last 24 hours) - indicates new user
                from datetime import datetime, timedelta
                created_at = datetime.fromisoformat(user_data.get("createdAt", "").replace("Z", "+00:00"))
                if datetime.now().replace(tzinfo=created_at.tzinfo) - created_at < timedelta(hours=24):
                    
                    # Trigger welcome email via NestJS
                    email_payload = {
                        "to": email,
                        "template": "welcome",
                        "data": {
                            "customer": {
                                "name": f"{user_data.get('firstName', '')} {user_data.get('lastName', '')}".strip() or "Valued Customer",
                                "email": email
                            },
                            "appName": "Tiffin-Wale",
                            "appUrl": "https://tiffin-wale.com"
                        },
                        "senderType": "welcome"
                    }
                    
                    email_response = await client.post(
                        "http://localhost:3001/api/email/send",
                        json=email_payload,
                        headers={"Content-Type": "application/json"}
                    )
                    
                    if email_response.status_code == 201:
                        context.logger.info("Welcome email sent to new user via NestJS", {
                            "userId": user_id,
                            "email": email,
                            "traceId": context.trace_id
                        })
                        
    except Exception as error:
        context.logger.error("Failed to send welcome email via NestJS", {
            "error": str(error),
            "userId": user_id,
            "email": email,
            "traceId": context.trace_id
        })

async def handle_user_profile_updated_trigger(event_data, context):
    """Handle profile update confirmation email if email was changed"""
    import httpx
    
    user_id = event_data.get("userId")
    updated_fields = event_data.get("updatedFields", [])
    
    # Only send email if email address was updated (security notification)
    if "email" in updated_fields:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                user_response = await client.get(f"http://localhost:3001/api/users/{user_id}")
                
                if user_response.status_code == 200:
                    user_data = user_response.json()
                    
                    # Send email change notification via NestJS
                    email_payload = {
                        "to": user_data.get("email"),
                        "template": "email-verification",  # Reuse verification template
                        "data": {
                            "user": {
                                "name": f"{user_data.get('firstName', '')} {user_data.get('lastName', '')}".strip() or "Valued Customer",
                                "email": user_data.get("email")
                            },
                            "message": "Your email address has been updated successfully.",
                            "appName": "Tiffin-Wale"
                        },
                        "senderType": "verification"
                    }
                    
                    await client.post(
                        "http://localhost:3001/api/email/send",
                        json=email_payload,
                        headers={"Content-Type": "application/json"}
                    )
                    
                    context.logger.info("Email change notification sent via NestJS", {
                        "userId": user_id,
                        "newEmail": user_data.get("email"),
                        "traceId": context.trace_id
                    })
                    
        except Exception as error:
            context.logger.error("Failed to send email change notification", {
                "error": str(error),
                "userId": user_id,
                "traceId": context.trace_id
            })

async def handle_menu_item_created_trigger(event_data, context):
    """Handle new menu item notification to partner"""
    import httpx
    
    partner_id = event_data.get("partnerId")
    item_name = event_data.get("itemName")
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Get partner details
            partner_response = await client.get(f"http://localhost:3001/api/users/{partner_id}")
            
            if partner_response.status_code == 200:
                partner_data = partner_response.json()
                
                # Send menu item confirmation email via NestJS
                email_payload = {
                    "to": partner_data.get("email"),
                    "template": "new-order-notification",  # Reuse existing template
                    "data": {
                        "partner": {
                            "name": f"{partner_data.get('firstName', '')} {partner_data.get('lastName', '')}".strip() or "Partner"
                        },
                        "message": f"Your new menu item '{item_name}' has been added successfully and is now live on Tiffin-Wale!",
                        "appName": "Tiffin-Wale"
                    },
                    "senderType": "sales"
                }
                
                await client.post(
                    "http://localhost:3001/api/email/send",
                    json=email_payload,
                    headers={"Content-Type": "application/json"}
                )
                
                context.logger.info("Menu item creation notification sent via NestJS", {
                    "partnerId": partner_id,
                    "itemName": item_name,
                    "partnerEmail": partner_data.get("email"),
                    "traceId": context.trace_id
                })
                
    except Exception as error:
        context.logger.error("Failed to send menu item notification", {
            "error": str(error),
            "partnerId": partner_id,
            "itemName": item_name,
            "traceId": context.trace_id
        })

async def handle_partner_analytics_trigger(event_data, context):
    """Handle weekly analytics email to partners"""
    import httpx
    
    partner_id = event_data.get("partnerId")
    total_revenue = event_data.get("totalRevenue", 0)
    total_orders = event_data.get("totalOrders", 0)
    
    # Only send analytics email if it's a significant milestone or weekly summary
    if total_orders > 0:  # Has some activity
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Get partner details
                partner_response = await client.get(f"http://localhost:3001/api/users/{partner_id}")
                
                if partner_response.status_code == 200:
                    partner_data = partner_response.json()
                    
                    # Send earnings summary via NestJS
                    email_payload = {
                        "to": partner_data.get("email"),
                        "template": "earnings-summary",
                        "data": {
                            "partner": {
                                "name": f"{partner_data.get('firstName', '')} {partner_data.get('lastName', '')}".strip() or "Partner"
                            },
                            "earnings": {
                                "totalEarnings": total_revenue,
                                "period": "This Week",
                                "orderCount": total_orders
                            },
                            "appName": "Tiffin-Wale"
                        },
                        "senderType": "billing"
                    }
                    
                    await client.post(
                        "http://localhost:3001/api/email/send",
                        json=email_payload,
                        headers={"Content-Type": "application/json"}
                    )
                    
                    context.logger.info("Partner analytics email sent via NestJS", {
                        "partnerId": partner_id,
                        "totalRevenue": total_revenue,
                        "totalOrders": total_orders,
                        "traceId": context.trace_id
                    })
                    
        except Exception as error:
            context.logger.error("Failed to send partner analytics email", {
                "error": str(error),
                "partnerId": partner_id,
                "traceId": context.trace_id
            })

async def handle_menu_item_updated_trigger(event_data, context):
    """Handle menu item update notification to partner"""
    import httpx
    
    partner_id = event_data.get("partnerId")
    item_name = event_data.get("itemName")
    updated_fields = event_data.get("updatedFields", [])
    
    # Only send email for significant updates (price, availability)
    if "price" in updated_fields or "isAvailable" in updated_fields:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                partner_response = await client.get(f"http://localhost:3001/api/users/{partner_id}")
                
                if partner_response.status_code == 200:
                    partner_data = partner_response.json()
                    
                    update_type = "price" if "price" in updated_fields else "availability"
                    
                    email_payload = {
                        "to": partner_data.get("email"),
                        "template": "new-order-notification",  # Reuse existing template
                        "data": {
                            "partner": {
                                "name": f"{partner_data.get('firstName', '')} {partner_data.get('lastName', '')}".strip() or "Partner"
                            },
                            "message": f"Your menu item '{item_name}' {update_type} has been updated successfully.",
                            "appName": "Tiffin-Wale"
                        },
                        "senderType": "sales"
                    }
                    
                    await client.post(
                        "http://localhost:3001/api/email/send",
                        json=email_payload,
                        headers={"Content-Type": "application/json"}
                    )
                    
                    context.logger.info("Menu item update notification sent via NestJS", {
                        "partnerId": partner_id,
                        "itemName": item_name,
                        "updateType": update_type,
                        "traceId": context.trace_id
                    })
                    
        except Exception as error:
            context.logger.error("Failed to send menu item update notification", {
                "error": str(error),
                "partnerId": partner_id,
                "itemName": item_name,
                "traceId": context.trace_id
            })

async def handle_user_contact_changed_trigger(event_data, context):
    """Handle user contact change security notification"""
    import httpx
    
    user_id = event_data.get("userId")
    changed_fields = event_data.get("changedFields", [])
    
    # Send security notification for email or phone changes
    if "email" in changed_fields or "phoneNumber" in changed_fields:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                user_response = await client.get(f"http://localhost:3001/api/users/{user_id}")
                
                if user_response.status_code == 200:
                    user_data = user_response.json()
                    
                    change_type = "email address" if "email" in changed_fields else "phone number"
                    
                    email_payload = {
                        "to": user_data.get("email"),
                        "template": "email-verification",  # Reuse verification template
                        "data": {
                            "user": {
                                "name": f"{user_data.get('firstName', '')} {user_data.get('lastName', '')}".strip() or "Valued Customer",
                                "email": user_data.get("email")
                            },
                            "message": f"Your {change_type} has been updated successfully. If this wasn't you, please contact support immediately.",
                            "appName": "Tiffin-Wale"
                        },
                        "senderType": "verification"
                    }
                    
                    await client.post(
                        "http://localhost:3001/api/email/send",
                        json=email_payload,
                        headers={"Content-Type": "application/json"}
                    )
                    
                    context.logger.info("Contact change security notification sent via NestJS", {
                        "userId": user_id,
                        "changeType": change_type,
                        "traceId": context.trace_id
                    })
                    
        except Exception as error:
            context.logger.error("Failed to send contact change notification", {
                "error": str(error),
                "userId": user_id,
                "traceId": context.trace_id
            })

async def handle_payment_required_trigger(event_data, context):
    """Handle payment reminder email"""
    import httpx
    
    order_id = event_data.get("orderId")
    customer_id = event_data.get("customerId")
    amount = event_data.get("amount", 0)
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Get customer details
            customer_response = await client.get(f"http://localhost:3001/api/users/{customer_id}")
            
            if customer_response.status_code == 200:
                customer_data = customer_response.json()
                
                # Send payment reminder via NestJS
                email_payload = {
                    "to": customer_data.get("email"),
                    "template": "payment-failed",  # Reuse payment template for reminders
                    "data": {
                        "customer": {
                            "name": f"{customer_data.get('firstName', '')} {customer_data.get('lastName', '')}".strip() or "Valued Customer"
                        },
                        "payment": {
                            "amount": amount,
                            "orderNumber": order_id,
                            "dueDate": "24 hours"
                        },
                        "message": f"Payment of ₹{amount} is required for order #{order_id}. Please complete payment within 24 hours.",
                        "appName": "Tiffin-Wale"
                    },
                    "senderType": "billing"
                }
                
                await client.post(
                    "http://localhost:3001/api/email/send",
                    json=email_payload,
                    headers={"Content-Type": "application/json"}
                )
                
                context.logger.info("Payment reminder email sent via NestJS", {
                    "orderId": order_id,
                    "customerId": customer_id,
                    "amount": amount,
                    "traceId": context.trace_id
                })
                
    except Exception as error:
        context.logger.error("Failed to send payment reminder email", {
            "error": str(error),
            "orderId": order_id,
            "customerId": customer_id,
            "traceId": context.trace_id
        })

async def handle_order_delivered_trigger(event_data, context):
    """Handle order delivered confirmation and review request"""
    import httpx
    
    order_id = event_data.get("orderId")
    customer_id = event_data.get("customerId")
    partner_id = event_data.get("partnerId")
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Get customer and order details
            customer_response = await client.get(f"http://localhost:3001/api/users/{customer_id}")
            order_response = await client.get(f"http://localhost:3001/api/orders/{order_id}")
            
            if customer_response.status_code == 200 and order_response.status_code == 200:
                customer_data = customer_response.json()
                order_data = order_response.json()
                
                # Send delivery confirmation with review request via NestJS
                email_payload = {
                    "to": customer_data.get("email"),
                    "template": "order-delivered",
                    "data": {
                        "order": {
                            "orderNumber": order_id,
                            "deliveredAt": datetime.now().isoformat(),
                            "totalAmount": order_data.get("totalAmount", 0)
                        },
                        "customer": {
                            "name": f"{customer_data.get('firstName', '')} {customer_data.get('lastName', '')}".strip() or "Valued Customer"
                        },
                        "reviewLink": f"https://tiffin-wale.com/review/{order_id}",
                        "appName": "Tiffin-Wale"
                    },
                    "senderType": "feedback"  # Uses feedback@tiffin-wale.com for review requests
                }
                
                await client.post(
                    "http://localhost:3001/api/email/send",
                    json=email_payload,
                    headers={"Content-Type": "application/json"}
                )
                
                context.logger.info("Order delivered confirmation email sent via NestJS", {
                    "orderId": order_id,
                    "customerId": customer_id,
                    "customerEmail": customer_data.get("email"),
                    "traceId": context.trace_id
                })
                
    except Exception as error:
            context.logger.error("Failed to send order delivered confirmation email", {
                "error": str(error),
                "orderId": order_id,
                "customerId": customer_id,
                "traceId": context.trace_id
            })

async def handle_subscription_created_trigger(event_data, context):
    """Handle subscription creation email trigger"""
    import httpx
    
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    plan_id = event_data.get("planId")
    total_amount = event_data.get("totalAmount", 0)
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Get customer and subscription details
            customer_response = await client.get(f"http://localhost:3001/api/users/{customer_id}")
            subscription_response = await client.get(f"http://localhost:3001/api/subscriptions/{subscription_id}")
            
            if customer_response.status_code == 200 and subscription_response.status_code == 200:
                customer_data = customer_response.json()
                subscription_data = subscription_response.json()
                
                # Send subscription confirmation email via NestJS
                email_payload = {
                    "to": customer_data.get("email"),
                    "template": "subscription-created",
                    "data": {
                        "subscription": {
                            "customerName": f"{customer_data.get('firstName', '')} {customer_data.get('lastName', '')}".strip() or "Valued Customer",
                            "planName": subscription_data.get("plan", {}).get("name", "Meal Plan"),
                            "startDate": subscription_data.get("startDate"),
                            "endDate": subscription_data.get("endDate"),
                            "amount": total_amount,
                            "billingCycle": subscription_data.get("paymentFrequency", "MONTHLY")
                        },
                        "manageUrl": "https://tiffin-wale.com/subscription",
                        "appName": "Tiffin-Wale"
                    },
                    "senderType": "billing"  # Uses billing@tiffin-wale.com
                }
                
                await client.post(
                    "http://localhost:3001/api/email/send",
                    json=email_payload,
                    headers={"Content-Type": "application/json"}
                )
                
                context.logger.info("Subscription creation email sent via NestJS", {
                    "subscriptionId": subscription_id,
                    "customerId": customer_id,
                    "customerEmail": customer_data.get("email"),
                    "traceId": context.trace_id
                })
                
    except Exception as error:
        context.logger.error("Failed to send subscription creation email", {
            "error": str(error),
            "subscriptionId": subscription_id,
            "customerId": customer_id,
            "traceId": context.trace_id
        })

async def handle_subscription_status_trigger(event_data, context):
    """Handle subscription status change email trigger"""
    import httpx
    
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    new_status = event_data.get("newStatus")
    
    # Map status to email templates
    status_template_map = {
        "active": "subscription-renewed",
        "cancelled": "subscription-cancelled",
        "expired": "subscription-expiring"
    }
    
    template = status_template_map.get(new_status)
    if not template:
        return  # No email for this status change
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Get customer and subscription details
            customer_response = await client.get(f"http://localhost:3001/api/users/{customer_id}")
            subscription_response = await client.get(f"http://localhost:3001/api/subscriptions/{subscription_id}")
            
            if customer_response.status_code == 200 and subscription_response.status_code == 200:
                customer_data = customer_response.json()
                subscription_data = subscription_response.json()
                
                # Send status change email via NestJS
                email_payload = {
                    "to": customer_data.get("email"),
                    "template": template,
                    "data": {
                        "subscription": {
                            "customerName": f"{customer_data.get('firstName', '')} {customer_data.get('lastName', '')}".strip() or "Valued Customer",
                            "planName": subscription_data.get("plan", {}).get("name", "Meal Plan"),
                            "startDate": subscription_data.get("startDate"),
                            "endDate": subscription_data.get("endDate"),
                            "cancellationDate": datetime.now().isoformat() if new_status == "cancelled" else None
                        },
                        "renewUrl": "https://tiffin-wale.com/subscription/renew",
                        "reactivateUrl": "https://tiffin-wale.com/subscription/reactivate",
                        "appName": "Tiffin-Wale"
                    },
                    "senderType": "billing"  # Uses billing@tiffin-wale.com
                }
                
                await client.post(
                    "http://localhost:3001/api/email/send",
                    json=email_payload,
                    headers={"Content-Type": "application/json"}
                )
                
                context.logger.info("Subscription status change email sent via NestJS", {
                    "subscriptionId": subscription_id,
                    "customerId": customer_id,
                    "newStatus": new_status,
                    "template": template,
                    "traceId": context.trace_id
                })
                
    except Exception as error:
        context.logger.error("Failed to send subscription status change email", {
            "error": str(error),
            "subscriptionId": subscription_id,
            "newStatus": new_status,
            "traceId": context.trace_id
        })

async def handle_subscription_expiry_trigger(event_data, context):
    """Handle subscription expiry warning email trigger"""
    import httpx
    
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    days_until_expiry = event_data.get("daysUntilExpiry", 0)
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Get customer and subscription details
            customer_response = await client.get(f"http://localhost:3001/api/users/{customer_id}")
            subscription_response = await client.get(f"http://localhost:3001/api/subscriptions/{subscription_id}")
            
            if customer_response.status_code == 200 and subscription_response.status_code == 200:
                customer_data = customer_response.json()
                subscription_data = subscription_response.json()
                
                # Send expiry warning email via NestJS
                email_payload = {
                    "to": customer_data.get("email"),
                    "template": "subscription-expiring",
                    "data": {
                        "subscription": {
                            "customerName": f"{customer_data.get('firstName', '')} {customer_data.get('lastName', '')}".strip() or "Valued Customer",
                            "planName": subscription_data.get("plan", {}).get("name", "Meal Plan"),
                            "endDate": subscription_data.get("endDate"),
                            "daysLeft": days_until_expiry
                        },
                        "renewUrl": "https://tiffin-wale.com/subscription/renew",
                        "manageUrl": "https://tiffin-wale.com/subscription",
                        "appName": "Tiffin-Wale"
                    },
                    "senderType": "billing"  # Uses billing@tiffin-wale.com
                }
                
                await client.post(
                    "http://localhost:3001/api/email/send",
                    json=email_payload,
                    headers={"Content-Type": "application/json"}
                )
                
                context.logger.info("Subscription expiry warning email sent via NestJS", {
                    "subscriptionId": subscription_id,
                    "customerId": customer_id,
                    "daysUntilExpiry": days_until_expiry,
                    "traceId": context.trace_id
                })
                
    except Exception as error:
        context.logger.error("Failed to send subscription expiry warning email", {
            "error": str(error),
            "subscriptionId": subscription_id,
            "daysUntilExpiry": days_until_expiry,
            "traceId": context.trace_id
        })

async def update_global_email_metrics(event_topic, event_data, context):
    """Update global email metrics"""
    # Track email activity
    email_activity_key = "motia:email:global_activity"
    await redis_service.increment(email_activity_key, 1, ttl=86400)
    
    # Track event types
    event_type_key = f"motia:email:event_types:{event_topic}"
    await redis_service.increment(event_type_key, 1, ttl=86400)

async def check_email_performance_alerts(event_topic, event_data, context):
    """Check for email performance alerts"""
    # Alert on high failure rate
    if event_topic == "email.delivery.failed":
        # Check if failure rate is too high (this would need real implementation)
        failure_rate = 15  # Mock - would calculate from Redis data
        if failure_rate > 10:  # More than 10% failure rate
            await context.emit({
                "topic": "email.alert.sent",
                "data": {
                    "alertType": "high_failure_rate",
                    "failureRate": failure_rate,
                    "threshold": 10,
                    "message": f"Email failure rate is {failure_rate}%, exceeding 10% threshold",
                    "timestamp": datetime.now().isoformat()
                }
            })
    
    # Alert on low campaign success rate
    if event_topic == "email.campaign.completed":
        success_rate = event_data.get("successRate", 0)
        if success_rate < 80:  # Less than 80% success rate
            await context.emit({
                "topic": "email.alert.sent",
                "data": {
                    "alertType": "low_campaign_success",
                    "campaignId": event_data.get("campaignId"),
                    "successRate": success_rate,
                    "threshold": 80,
                    "message": f"Campaign success rate is {success_rate}%, below 80% threshold",
                    "timestamp": datetime.now().isoformat()
                }
            })
