from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import httpx

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def delete_cache(self, key):
        return True
    async def set_cache(self, key, value, category=None):
        return True

redis_service = SimpleRedisService()

class UpdateUserProfileRequest(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    phoneNumber: Optional[str] = None
    profileImage: Optional[str] = None
    email: Optional[str] = None

config = {
    "type": "api",
    "name": "UpdateUserProfile",
    "description": "TiffinWale update user profile workflow - connects to NestJS backend",
    "flows": ["tiffinwale-users"],
    "method": "PATCH",
    "path": "/users/profile",
    "bodySchema": UpdateUserProfileRequest.model_json_schema(),
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "_id": {"type": "string"},
                "email": {"type": "string"},
                "firstName": {"type": "string"},
                "lastName": {"type": "string"},
                "phoneNumber": {"type": "string"},
                "profileImage": {"type": "string"}
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
        "user.profile.updated",
        "user.cache.invalidated",
        "user.contact.changed"
    ]
}

async def handler(req, context):
    """
    Motia Update User Profile Workflow - Connects to NestJS Backend
    Pure workflow orchestrator for user profile updates
    """
    try:
        body = req.get("body", {})
        headers = req.get("headers", {})
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Update User Profile Workflow Started", {
            "updateFields": list(body.keys()),
            "hasAuthToken": bool(auth_token),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        if not auth_token:
            return {
                "status": 401,
                "body": {
                    "statusCode": 401,
                    "message": "Authorization token is required",
                    "error": "Unauthorized"
                }
            }

        # Step 1: Forward profile update to NestJS backend (real business logic)
        nestjs_profile_url = "http://localhost:3001/api/users/profile"
        
        request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.patch(
                nestjs_profile_url,
                json=body,
                headers=request_headers
            )
            
            context.logger.info("NestJS Update User Profile Backend Response", {
                "status_code": response.status_code,
                "updateFields": list(body.keys()),
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                # Step 2: Extract real user profile data from NestJS
                updated_profile = response.json()
                
                # Step 3: Invalidate user profile caches
                user_id = updated_profile.get("_id")
                if user_id:
                    # Clear user ID cache
                    user_id_cache_key = f"motia:user:{user_id}"
                    await redis_service.delete_cache(user_id_cache_key)
                    
                    # Clear token-based cache (we can't know the exact token hash, but this is for future optimization)
                    profile_cache_key = f"motia:profile:token:{hash(auth_token) % 10000}"
                    await redis_service.delete_cache(profile_cache_key)
                
                # Step 4: Cache updated profile
                if user_id:
                    await redis_service.set_cache(f"motia:user:{user_id}", updated_profile, category="user")
                
                # Step 5: Emit workflow events for downstream processing
                await context.emit({
                    "topic": "user.profile.updated",
                    "data": {
                        "userId": user_id,
                        "email": updated_profile.get("email"),
                        "updatedFields": list(body.keys()),
                        "firstName": updated_profile.get("firstName"),
                        "lastName": updated_profile.get("lastName"),
                        "phoneNumber": updated_profile.get("phoneNumber"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                # Emit cache invalidation event
                await context.emit({
                    "topic": "user.cache.invalidated",
                    "data": {
                        "userId": user_id,
                        "reason": "profile_updated",
                        "updatedFields": list(body.keys()),
                        "timestamp": datetime.now().isoformat()
                    }
                })

                # Emit contact change event if phone or email was updated
                if "phoneNumber" in body or "email" in body:
                    await context.emit({
                        "topic": "user.contact.changed",
                        "data": {
                            "userId": user_id,
                            "email": updated_profile.get("email"),
                            "phoneNumber": updated_profile.get("phoneNumber"),
                            "changedFields": [field for field in ["email", "phoneNumber"] if field in body],
                            "timestamp": datetime.now().isoformat()
                        }
                    })

                context.logger.info("Motia Update User Profile Workflow Completed Successfully", {
                    "userId": user_id,
                    "email": updated_profile.get("email"),
                    "updatedFields": list(body.keys()),
                    "traceId": context.trace_id
                })

                # Step 6: Return the exact NestJS response (no modification)
                return {
                    "status": 200,
                    "body": updated_profile
                }
                
            else:
                # Step 7: Handle profile update failure
                error_response = response.json() if response.content else {"message": "Profile update failed"}
                
                await context.emit({
                    "topic": "user.profile.update.failed",
                    "data": {
                        "attemptedFields": list(body.keys()),
                        "reason": "backend_validation_failed",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Update User Profile Workflow Failed", {
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
        context.logger.error("NestJS Update User Profile Backend Timeout", {
            "attemptedFields": list(body.keys()),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "user.profile.update.failed",
            "data": {
                "attemptedFields": list(body.keys()),
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "User profile update service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Update User Profile Workflow Error", {
            "error": str(error),
            "attemptedFields": list(body.keys()),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "user.profile.update.failed",
            "data": {
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
                "message": "Update user profile workflow failed",
                "error": "Internal server error"
            }
        }
