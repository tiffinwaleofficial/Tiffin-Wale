from pydantic import BaseModel
from typing import Optional, List
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

class UserActivityEvent(BaseModel):
    userId: str
    email: Optional[str] = None
    role: Optional[str] = None
    timestamp: str

config = {
    "type": "event",
    "name": "UserActivityHandler",
    "description": "Handle user activity events and analytics tracking",
    "flows": ["tiffinwale-users"],
    "subscribes": [
        "user.profile.viewed",
        "user.profile.updated",
        "user.contact.changed",
        "user.cache.hit",
        "user.cache.miss"
    ],
    "emits": [
        "user.analytics.tracked",
        "user.activity.logged",
        "user.engagement.updated"
    ]
}

async def handler(req, context):
    """
    Motia User Activity Handler - Manages user activity tracking and analytics
    Pure workflow orchestrator for user engagement analytics
    """
    try:
        event_data = req.get("data", {})
        event_topic = req.get("topic", "")
        
        user_id = event_data.get("userId")
        email = event_data.get("email")
        role = event_data.get("role")
        source = event_data.get("source", "unknown")
        
        context.logger.info("Motia User Activity Handler Started", {
            "eventTopic": event_topic,
            "userId": user_id,
            "email": email,
            "role": role,
            "source": source,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Step 1: Handle different event types
        if event_topic == "user.profile.viewed":
            await handle_profile_viewed(event_data, context)
        elif event_topic == "user.profile.updated":
            await handle_profile_updated(event_data, context)
        elif event_topic == "user.contact.changed":
            await handle_contact_changed(event_data, context)
        elif event_topic == "user.cache.hit":
            await handle_cache_performance(event_data, context, "hit")
        elif event_topic == "user.cache.miss":
            await handle_cache_performance(event_data, context, "miss")

        # Step 2: Track general user activity
        if user_id:
            await track_user_activity(user_id, event_topic, event_data, context)

        # Step 3: Update user engagement metrics
        await update_engagement_metrics(user_id, event_topic, event_data, context)

        context.logger.info("Motia User Activity Handler Completed Successfully", {
            "eventTopic": event_topic,
            "userId": user_id,
            "email": email,
            "traceId": context.trace_id
        })

    except Exception as error:
        context.logger.error("Motia User Activity Handler Error", {
            "error": str(error),
            "eventTopic": event_topic,
            "userId": event_data.get("userId"),
            "traceId": context.trace_id
        })

async def handle_profile_viewed(event_data, context):
    """Handle user profile view events"""
    user_id = event_data.get("userId")
    viewed_by = event_data.get("viewedBy", "system")
    source = event_data.get("source", "unknown")
    
    # Track profile views for analytics
    profile_views_key = f"motia:analytics:profile_views:{user_id}"
    await redis_service.increment(profile_views_key, 1, ttl=86400)  # 24 hours
    
    # Track daily profile views
    today = datetime.now().strftime("%Y-%m-%d")
    daily_views_key = f"motia:analytics:daily_profile_views:{today}"
    await redis_service.increment(daily_views_key, 1, ttl=86400)
    
    await context.emit({
        "topic": "user.analytics.tracked",
        "data": {
            "userId": user_id,
            "metric": "profile_viewed",
            "value": 1,
            "source": source,
            "viewedBy": viewed_by,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Profile view tracked", {
        "userId": user_id,
        "viewedBy": viewed_by,
        "source": source,
        "traceId": context.trace_id
    })

async def handle_profile_updated(event_data, context):
    """Handle user profile update events"""
    user_id = event_data.get("userId")
    updated_fields = event_data.get("updatedFields", [])
    
    # Track profile updates
    profile_updates_key = f"motia:analytics:profile_updates:{user_id}"
    await redis_service.increment(profile_updates_key, 1, ttl=86400)
    
    # Track which fields are most commonly updated
    for field in updated_fields:
        field_update_key = f"motia:analytics:field_updates:{field}"
        await redis_service.increment(field_update_key, 1, ttl=604800)  # 7 days
    
    await context.emit({
        "topic": "user.analytics.tracked",
        "data": {
            "userId": user_id,
            "metric": "profile_updated",
            "value": len(updated_fields),
            "updatedFields": updated_fields,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Profile update tracked", {
        "userId": user_id,
        "updatedFields": updated_fields,
        "traceId": context.trace_id
    })

async def handle_contact_changed(event_data, context):
    """Handle user contact information changes"""
    user_id = event_data.get("userId")
    changed_fields = event_data.get("changedFields", [])
    
    # Track contact changes (important for security/verification)
    contact_changes_key = f"motia:analytics:contact_changes:{user_id}"
    await redis_service.increment(contact_changes_key, 1, ttl=2592000)  # 30 days
    
    # Log contact changes for security audit
    contact_change_log = {
        "userId": user_id,
        "changedFields": changed_fields,
        "timestamp": datetime.now().isoformat(),
        "email": event_data.get("email"),
        "phoneNumber": event_data.get("phoneNumber")
    }
    
    contact_log_key = f"motia:security:contact_changes:{user_id}"
    await redis_service.add_to_list(contact_log_key, contact_change_log, max_length=50)
    
    await context.emit({
        "topic": "user.analytics.tracked",
        "data": {
            "userId": user_id,
            "metric": "contact_changed",
            "value": len(changed_fields),
            "changedFields": changed_fields,
            "securityRelevant": True,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Contact change tracked", {
        "userId": user_id,
        "changedFields": changed_fields,
        "traceId": context.trace_id
    })

async def handle_cache_performance(event_data, context, cache_result):
    """Handle cache performance tracking"""
    user_id = event_data.get("userId")
    
    # Track cache performance
    cache_metric_key = f"motia:analytics:cache_{cache_result}:users"
    await redis_service.increment(cache_metric_key, 1, ttl=3600)  # 1 hour
    
    # Track per-user cache performance
    if user_id:
        user_cache_key = f"motia:analytics:user_cache_{cache_result}:{user_id}"
        await redis_service.increment(user_cache_key, 1, ttl=86400)  # 24 hours
    
    await context.emit({
        "topic": "user.analytics.tracked",
        "data": {
            "userId": user_id,
            "metric": f"cache_{cache_result}",
            "value": 1,
            "service": "user_service",
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Cache performance tracked", {
        "userId": user_id,
        "cacheResult": cache_result,
        "traceId": context.trace_id
    })

async def track_user_activity(user_id, event_topic, event_data, context):
    """Track general user activity"""
    if not user_id:
        return
    
    # Track user activity timeline
    activity_log = {
        "event": event_topic,
        "timestamp": datetime.now().isoformat(),
        "data": {
            "source": event_data.get("source"),
            "role": event_data.get("role")
        }
    }
    
    activity_key = f"motia:activity:user:{user_id}"
    await redis_service.add_to_list(activity_key, activity_log, max_length=100)
    
    # Track daily active users
    today = datetime.now().strftime("%Y-%m-%d")
    daily_active_key = f"motia:analytics:daily_active_users:{today}"
    await redis_service.increment(daily_active_key, 1, ttl=86400)
    
    await context.emit({
        "topic": "user.activity.logged",
        "data": {
            "userId": user_id,
            "event": event_topic,
            "timestamp": datetime.now().isoformat()
        }
    })

async def update_engagement_metrics(user_id, event_topic, event_data, context):
    """Update user engagement metrics"""
    if not user_id:
        return
    
    # Calculate engagement score based on activity type
    engagement_scores = {
        "user.profile.viewed": 1,
        "user.profile.updated": 5,
        "user.contact.changed": 3
    }
    
    score = engagement_scores.get(event_topic, 0)
    
    if score > 0:
        # Update user engagement score
        engagement_key = f"motia:engagement:user:{user_id}"
        await redis_service.increment(engagement_key, score, ttl=604800)  # 7 days
        
        await context.emit({
            "topic": "user.engagement.updated",
            "data": {
                "userId": user_id,
                "engagementScore": score,
                "event": event_topic,
                "timestamp": datetime.now().isoformat()
            }
        })
        
        context.logger.info("User engagement updated", {
            "userId": user_id,
            "engagementScore": score,
            "event": event_topic,
            "traceId": context.trace_id
        })
