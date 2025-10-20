from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AuthFailureEvent(BaseModel):
    email: str
    reason: str
    timestamp: str
    error: Optional[str] = None

config = {
    "type": "event",
    "name": "AuthFailureHandler",
    "description": "Handle failed authentication events",
    "flows": ["tiffinwale-auth"],
    "subscribes": ["auth.login.failed"],
    "emits": ["security.login.attempt.failed", "analytics.login.failed"]
}

async def handler(input_data, context):
    """
    Handle failed authentication events
    """
    try:
        event_data = input_data.get("data", {})
        email = event_data.get("email")
        reason = event_data.get("reason")
        timestamp = event_data.get("timestamp")
        error = event_data.get("error")
        
        context.logger.info("Processing failed authentication", {
            "email": email,
            "reason": reason,
            "timestamp": timestamp,
            "traceId": context.trace_id
        })

        # Track failed login attempts for security monitoring
        security_data = {
            "event": "failed_login_attempt",
            "email": email,
            "reason": reason,
            "timestamp": timestamp,
            "ip_address": "unknown",  # In real implementation, get from request
            "user_agent": "unknown"   # In real implementation, get from request
        }

        # In real implementation, save to security log
        # await context.db.collection('security_logs').insert_one(security_data)

        # Emit security alert if needed
        await context.emit({
            "topic": "security.login.attempt.failed",
            "data": security_data
        })

        # Track analytics for failed logins
        analytics_data = {
            "event": "login_failed",
            "email": email,
            "reason": reason,
            "timestamp": timestamp,
            "metadata": {
                "error": error,
                "loginMethod": "email_password"
            }
        }

        await context.emit({
            "topic": "analytics.login.failed",
            "data": analytics_data
        })

        # Check for brute force attempts (simplified logic)
        # In real implementation, implement rate limiting and account lockout
        if reason in ["invalid_password", "user_not_found"]:
            context.logger.warn("Potential security threat", {
                "email": email,
                "reason": reason,
                "timestamp": timestamp,
                "traceId": context.trace_id
            })

        context.logger.info("Authentication failure processed", {
            "email": email,
            "reason": reason,
            "traceId": context.trace_id
        })

        return {"processed": True, "securityLogged": True}

    except Exception as error:
        context.logger.error("Error processing auth failure", {
            "error": str(error),
            "inputData": input_data,
            "traceId": context.trace_id
        })
        
        return {"processed": False, "error": str(error)}
