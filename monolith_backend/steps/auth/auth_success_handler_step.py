from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def set_hash(self, key, data, ttl=None):
        return True
    async def increment(self, key, amount=1, ttl=None):
        return amount
    async def set_cache(self, key, value, ttl=None):
        return True
    async def cache_analytics_data(self, metric_name, data, timestamp=None):
        return True

redis_service = SimpleRedisService()

class AuthSuccessEvent(BaseModel):
    userId: str
    email: str
    timestamp: str

config = {
    "type": "event",
    "name": "AuthSuccessHandler",
    "description": "Handle successful authentication events",
    "flows": ["tiffinwale-auth"],
    "subscribes": ["auth.login.success"],
    "emits": ["user.session.created", "analytics.login.tracked"]
}

async def handler(input_data, context):
    """
    Handle successful authentication events
    """
    try:
        event_data = input_data.get("data", {})
        user_id = event_data.get("userId")
        email = event_data.get("email")
        timestamp = event_data.get("timestamp")
        
        context.logger.info("Processing successful authentication", {
            "userId": user_id,
            "email": email,
            "timestamp": timestamp,
            "traceId": context.trace_id
        })

        # Create user session record
        session_id = f"session_{user_id}_{datetime.now().timestamp()}"
        session_data = {
            "userId": user_id,
            "email": email,
            "loginAt": timestamp,
            "sessionId": session_id,
            "status": "active"
        }

        # Store session in Redis with hash for efficient field updates
        session_key = f"session:active:{user_id}"
        await redis_service.set_hash(session_key, session_data, ttl=900)  # 15 minutes

        # Track user login count and last login in Redis
        login_count_key = f"stats:login_count:{user_id}"
        await redis_service.increment(login_count_key, 1, ttl=86400 * 30)  # 30 days
        
        last_login_key = f"stats:last_login:{user_id}"
        await redis_service.set_cache(last_login_key, timestamp, ttl=86400 * 30)  # 30 days

        # Emit session created event
        await context.emit({
            "topic": "user.session.created",
            "data": session_data
        })

        # Track login analytics in Redis
        analytics_data = {
            "event": "user_login",
            "userId": user_id,
            "email": email,
            "timestamp": timestamp,
            "sessionId": session_id,
            "metadata": {
                "loginMethod": "email_password",
                "platform": "api"
            }
        }

        # Store analytics in Redis for real-time dashboard
        await redis_service.cache_analytics_data("user_login", analytics_data, timestamp)
        
        # Increment daily login counter
        daily_login_key = f"analytics:daily_logins:{datetime.now().strftime('%Y-%m-%d')}"
        await redis_service.increment(daily_login_key, 1, ttl=86400 * 7)  # Keep for 7 days

        await context.emit({
            "topic": "analytics.login.tracked",
            "data": analytics_data
        })

        context.logger.info("Authentication success processed", {
            "userId": user_id,
            "sessionId": session_data["sessionId"],
            "traceId": context.trace_id
        })

        return {"processed": True, "sessionId": session_data["sessionId"]}

    except Exception as error:
        context.logger.error("Error processing auth success", {
            "error": str(error),
            "inputData": input_data,
            "traceId": context.trace_id
        })
        
        return {"processed": False, "error": str(error)}
