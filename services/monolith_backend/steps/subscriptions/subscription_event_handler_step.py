from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import httpx

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def set_cache(self, key, value, category=None):
        return True
    async def increment(self, key, amount=1, ttl=None):
        return amount
    async def add_to_list(self, key, value, max_length=None):
        return True

redis_service = SimpleRedisService()

class SubscriptionEvent(BaseModel):
    subscriptionId: Optional[str] = None
    customerId: Optional[str] = None
    planId: Optional[str] = None
    status: Optional[str] = None
    timestamp: str

config = {
    "type": "event",
    "name": "SubscriptionEventHandler",
    "description": "Handle subscription events and automated subscription management",
    "flows": ["tiffinwale-subscriptions"],
    "subscribes": [
        "subscription.created",
        "subscription.updated",
        "subscription.status.changed",
        "subscription.renewal.changed",
        "subscription.payment.required",
        "subscription.notification.send",
        "subscription.cache.invalidated"
    ],
    "emits": [
        "subscription.email.triggered",
        "subscription.analytics.updated",
        "subscription.renewal.processed",
        "subscription.expiry.warning",
        "subscription.metrics.tracked"
    ]
}

async def handler(req, context):
    """
    Motia Subscription Event Handler - Automated Subscription Management
    Handles subscription lifecycle events and triggers appropriate actions
    """
    try:
        event_data = req.get("data", {})
        event_topic = req.get("topic", "")
        
        subscription_id = event_data.get("subscriptionId")
        customer_id = event_data.get("customerId")
        plan_id = event_data.get("planId")
        status = event_data.get("status")
        
        context.logger.info("Motia Subscription Event Handler Started", {
            "eventTopic": event_topic,
            "subscriptionId": subscription_id,
            "customerId": customer_id,
            "status": status,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Step 1: Handle different subscription event types
        if event_topic == "subscription.created":
            await handle_subscription_created(event_data, context)
        elif event_topic == "subscription.updated":
            await handle_subscription_updated(event_data, context)
        elif event_topic == "subscription.status.changed":
            await handle_status_changed(event_data, context)
        elif event_topic == "subscription.renewal.changed":
            await handle_renewal_changed(event_data, context)
        elif event_topic == "subscription.payment.required":
            await handle_payment_required(event_data, context)
        elif event_topic == "subscription.notification.send":
            await handle_notification_trigger(event_data, context)
        elif event_topic == "subscription.cache.invalidated":
            await handle_cache_invalidated(event_data, context)

        # Step 2: Update subscription analytics
        await update_subscription_metrics(event_topic, event_data, context)

        # Step 3: Check for automated actions (renewals, expiry warnings)
        await check_automated_actions(event_topic, event_data, context)

        context.logger.info("Motia Subscription Event Handler Completed Successfully", {
            "eventTopic": event_topic,
            "subscriptionId": subscription_id,
            "customerId": customer_id,
            "traceId": context.trace_id
        })

    except Exception as error:
        context.logger.error("Motia Subscription Event Handler Error", {
            "error": str(error),
            "eventTopic": event_topic,
            "subscriptionId": event_data.get("subscriptionId"),
            "traceId": context.trace_id
        })

async def handle_subscription_created(event_data, context):
    """Handle subscription creation events"""
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    plan_id = event_data.get("planId")
    total_amount = event_data.get("totalAmount", 0)
    auto_renew = event_data.get("autoRenew", False)
    
    # Track subscription creation analytics
    subscription_created_key = "motia:analytics:subscriptions_created"
    await redis_service.increment(subscription_created_key, 1, ttl=86400)
    
    # Track by plan
    plan_subscriptions_key = f"motia:analytics:plan_subscriptions:{plan_id}"
    await redis_service.increment(plan_subscriptions_key, 1, ttl=2592000)  # 30 days
    
    # Track revenue
    daily_revenue_key = f"motia:analytics:subscription_revenue:{datetime.now().strftime('%Y-%m-%d')}"
    await redis_service.increment(daily_revenue_key, total_amount, ttl=86400)
    
    # Trigger subscription confirmation email
    await context.emit({
        "topic": "subscription.email.triggered",
        "data": {
            "type": "subscription_created",
            "subscriptionId": subscription_id,
            "customerId": customer_id,
            "planId": plan_id,
            "totalAmount": total_amount,
            "autoRenew": auto_renew,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    await context.emit({
        "topic": "subscription.analytics.updated",
        "data": {
            "metric": "subscription_created",
            "subscriptionId": subscription_id,
            "customerId": customer_id,
            "planId": plan_id,
            "value": total_amount,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Subscription creation handled", {
        "subscriptionId": subscription_id,
        "customerId": customer_id,
        "planId": plan_id,
        "totalAmount": total_amount,
        "traceId": context.trace_id
    })

async def handle_subscription_updated(event_data, context):
    """Handle subscription update events"""
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    updated_fields = event_data.get("updatedFields", [])
    
    # Track subscription updates
    subscription_updates_key = f"motia:analytics:subscription_updates:{subscription_id}"
    await redis_service.increment(subscription_updates_key, 1, ttl=604800)  # 7 days
    
    # Track which fields are most commonly updated
    for field in updated_fields:
        field_update_key = f"motia:analytics:subscription_field_updates:{field}"
        await redis_service.increment(field_update_key, 1, ttl=2592000)  # 30 days
    
    await context.emit({
        "topic": "subscription.analytics.updated",
        "data": {
            "metric": "subscription_updated",
            "subscriptionId": subscription_id,
            "customerId": customer_id,
            "updatedFields": updated_fields,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Subscription update handled", {
        "subscriptionId": subscription_id,
        "updatedFields": updated_fields,
        "traceId": context.trace_id
    })

async def handle_status_changed(event_data, context):
    """Handle subscription status change events"""
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    old_status = event_data.get("oldStatus")
    new_status = event_data.get("newStatus")
    
    # Track status changes
    status_change_key = f"motia:analytics:status_changes:{old_status}_to_{new_status}"
    await redis_service.increment(status_change_key, 1, ttl=2592000)  # 30 days
    
    # Handle specific status changes
    if new_status == "active":
        # Subscription activated
        await context.emit({
            "topic": "subscription.email.triggered",
            "data": {
                "type": "subscription_activated",
                "subscriptionId": subscription_id,
                "customerId": customer_id,
                "timestamp": datetime.now().isoformat()
            }
        })
    elif new_status == "cancelled":
        # Subscription cancelled
        await context.emit({
            "topic": "subscription.email.triggered",
            "data": {
                "type": "subscription_cancelled",
                "subscriptionId": subscription_id,
                "customerId": customer_id,
                "timestamp": datetime.now().isoformat()
            }
        })
    elif new_status == "expired":
        # Subscription expired
        await context.emit({
            "topic": "subscription.email.triggered",
            "data": {
                "type": "subscription_expired",
                "subscriptionId": subscription_id,
                "customerId": customer_id,
                "timestamp": datetime.now().isoformat()
            }
        })
    
    context.logger.info("Subscription status change handled", {
        "subscriptionId": subscription_id,
        "oldStatus": old_status,
        "newStatus": new_status,
        "traceId": context.trace_id
    })

async def handle_renewal_changed(event_data, context):
    """Handle subscription auto-renewal setting changes"""
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    auto_renew = event_data.get("autoRenew", False)
    
    # Track renewal setting changes
    renewal_setting_key = f"motia:analytics:renewal_settings:{'enabled' if auto_renew else 'disabled'}"
    await redis_service.increment(renewal_setting_key, 1, ttl=2592000)  # 30 days
    
    # Send confirmation email for renewal setting change
    await context.emit({
        "topic": "subscription.email.triggered",
        "data": {
            "type": "renewal_setting_changed",
            "subscriptionId": subscription_id,
            "customerId": customer_id,
            "autoRenew": auto_renew,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Subscription renewal setting change handled", {
        "subscriptionId": subscription_id,
        "autoRenew": auto_renew,
        "traceId": context.trace_id
    })

async def handle_payment_required(event_data, context):
    """Handle subscription payment required events"""
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    amount = event_data.get("amount", 0)
    due_date = event_data.get("dueDate")
    
    # Track payment requirements
    payment_required_key = "motia:analytics:subscription_payments_required"
    await redis_service.increment(payment_required_key, 1, ttl=86400)
    
    # Send payment reminder email
    await context.emit({
        "topic": "subscription.email.triggered",
        "data": {
            "type": "payment_required",
            "subscriptionId": subscription_id,
            "customerId": customer_id,
            "amount": amount,
            "dueDate": due_date,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Subscription payment required handled", {
        "subscriptionId": subscription_id,
        "amount": amount,
        "dueDate": due_date,
        "traceId": context.trace_id
    })

async def handle_notification_trigger(event_data, context):
    """Handle subscription notification triggers"""
    notification_type = event_data.get("type")
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    
    # Forward to email system via NestJS
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Get subscription and customer details
            subscription_response = await client.get(f"http://localhost:3001/api/subscriptions/{subscription_id}")
            customer_response = await client.get(f"http://localhost:3001/api/users/{customer_id}")
            
            if subscription_response.status_code == 200 and customer_response.status_code == 200:
                subscription_data = subscription_response.json()
                customer_data = customer_response.json()
                
                # Map notification type to email template
                template_map = {
                    "subscription_created": "subscription-created",
                    "subscription_activated": "subscription-renewed",  # Reuse renewal template
                    "subscription_cancelled": "subscription-cancelled",
                    "subscription_expired": "subscription-expiring",  # Reuse expiring template
                    "payment_required": "payment-failed",  # Reuse payment template
                    "renewal_setting_changed": "subscription-renewed"  # Reuse renewal template
                }
                
                template = template_map.get(notification_type, "subscription-created")
                
                # Send email via NestJS email service
                email_payload = {
                    "to": customer_data.get("email"),
                    "template": template,
                    "data": {
                        "subscription": {
                            "customerName": f"{customer_data.get('firstName', '')} {customer_data.get('lastName', '')}".strip() or "Valued Customer",
                            "planName": subscription_data.get("plan", {}).get("name", "Subscription Plan"),
                            "startDate": subscription_data.get("startDate"),
                            "endDate": subscription_data.get("endDate"),
                            "amount": subscription_data.get("totalAmount", 0),
                            "billingCycle": subscription_data.get("paymentFrequency", "MONTHLY")
                        },
                        "appName": "Tiffin-Wale"
                    },
                    "senderType": "billing"  # Uses billing@tiffin-wale.com
                }
                
                await client.post(
                    "http://localhost:3001/api/email/send",
                    json=email_payload,
                    headers={"Content-Type": "application/json"}
                )
                
                context.logger.info("Subscription notification email sent via NestJS", {
                    "subscriptionId": subscription_id,
                    "customerId": customer_id,
                    "notificationType": notification_type,
                    "template": template,
                    "traceId": context.trace_id
                })
                
    except Exception as error:
        context.logger.error("Failed to send subscription notification email", {
            "error": str(error),
            "subscriptionId": subscription_id,
            "notificationType": notification_type,
            "traceId": context.trace_id
        })

async def handle_cache_invalidated(event_data, context):
    """Handle subscription cache invalidation events"""
    subscription_id = event_data.get("subscriptionId")
    customer_id = event_data.get("customerId")
    reason = event_data.get("reason")
    
    # Track cache invalidations
    cache_invalidation_key = f"motia:analytics:subscription_cache_invalidations:{reason}"
    await redis_service.increment(cache_invalidation_key, 1, ttl=86400)
    
    context.logger.info("Subscription cache invalidation handled", {
        "subscriptionId": subscription_id,
        "customerId": customer_id,
        "reason": reason,
        "traceId": context.trace_id
    })

async def update_subscription_metrics(event_topic, event_data, context):
    """Update global subscription metrics"""
    # Track subscription activity
    subscription_activity_key = "motia:analytics:subscription_activity"
    await redis_service.increment(subscription_activity_key, 1, ttl=86400)
    
    # Track event types
    event_type_key = f"motia:analytics:subscription_events:{event_topic}"
    await redis_service.increment(event_type_key, 1, ttl=86400)
    
    # Emit metrics update
    await context.emit({
        "topic": "subscription.metrics.tracked",
        "data": {
            "eventTopic": event_topic,
            "timestamp": datetime.now().isoformat(),
            "metrics": {
                "totalSubscriptionActivity": 1,  # Would be actual count in real implementation
                "eventType": event_topic
            }
        }
    })

async def check_automated_actions(event_topic, event_data, context):
    """Check for automated subscription actions"""
    # Example: Check for expiry warnings
    if event_topic == "subscription.created" or event_topic == "subscription.updated":
        subscription_id = event_data.get("subscriptionId")
        end_date = event_data.get("endDate")
        
        if end_date:
            try:
                end_date_obj = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
                now = datetime.now(end_date_obj.tzinfo)
                days_until_expiry = (end_date_obj - now).days
                
                # Send expiry warning if subscription expires in 3 days
                if 0 < days_until_expiry <= 3:
                    await context.emit({
                        "topic": "subscription.expiry.warning",
                        "data": {
                            "subscriptionId": subscription_id,
                            "customerId": event_data.get("customerId"),
                            "daysUntilExpiry": days_until_expiry,
                            "endDate": end_date,
                            "timestamp": datetime.now().isoformat()
                        }
                    })
                    
                    context.logger.info("Subscription expiry warning triggered", {
                        "subscriptionId": subscription_id,
                        "daysUntilExpiry": days_until_expiry,
                        "traceId": context.trace_id
                    })
                    
            except Exception as error:
                context.logger.error("Failed to check subscription expiry", {
                    "error": str(error),
                    "subscriptionId": subscription_id,
                    "traceId": context.trace_id
                })
