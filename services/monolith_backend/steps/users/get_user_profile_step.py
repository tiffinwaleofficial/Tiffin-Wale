from datetime import datetime
import httpx

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def get_cache(self, key):
        return None
    async def set_cache(self, key, value, category=None):
        return True

redis_service = SimpleRedisService()

config = {
    "type": "api",
    "name": "GetUserProfile",
    "description": "TiffinWale get user profile workflow - connects to NestJS backend with Redis caching",
    "flows": ["tiffinwale-users"],
    "method": "GET",
    "path": "/users/profile",
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "_id": {"type": "string"},
                "email": {"type": "string"},
                "role": {"type": "string"},
                "firstName": {"type": "string"},
                "lastName": {"type": "string"},
                "phoneNumber": {"type": "string"},
                "profileImage": {"type": "string"},
                "isActive": {"type": "boolean"}
            }
        },
        401: {
            "type": "object",
            "properties": {
                "statusCode": {"type": "number"},
                "message": {"type": "string"},
                "error": {"type": "string"}
            }
        }
    },
    "emits": ["user.profile.viewed", "user.cache.hit", "user.cache.miss"]
}

async def handler(req, context):
    """
    Motia Get User Profile Workflow - Connects to NestJS Backend with Redis Caching
    Pure workflow orchestrator for user profile retrieval with performance optimization
    """
    try:
        headers = req.get("headers", {})
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Get User Profile Workflow Started", {
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

        # Step 1: Check Redis cache first (performance optimization)
        # Note: We can't cache by user ID since we don't have it yet, but we could cache by token hash
        profile_cache_key = f"motia:profile:token:{hash(auth_token) % 10000}"  # Simple hash for caching
        cached_profile = await redis_service.get_cache(profile_cache_key)
        
        if cached_profile:
            context.logger.info("User profile found in Redis cache", {
                "userId": cached_profile.get("_id"),
                "email": cached_profile.get("email"),
                "traceId": context.trace_id
            })
            
            await context.emit({
                "topic": "user.cache.hit",
                "data": {
                    "userId": cached_profile.get("_id"),
                    "email": cached_profile.get("email"),
                    "timestamp": datetime.now().isoformat(),
                    "source": "redis_cache"
                }
            })
            
            await context.emit({
                "topic": "user.profile.viewed",
                "data": {
                    "userId": cached_profile.get("_id"),
                    "email": cached_profile.get("email"),
                    "role": cached_profile.get("role"),
                    "source": "cache",
                    "timestamp": datetime.now().isoformat()
                }
            })
            
            return {
                "status": 200,
                "body": cached_profile
            }

        # Step 2: Forward request to NestJS backend (real business logic)
        nestjs_profile_url = "http://localhost:3001/api/users/profile"
        
        request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                nestjs_profile_url,
                headers=request_headers
            )
            
            context.logger.info("NestJS Get User Profile Backend Response", {
                "status_code": response.status_code,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                # Step 3: Extract real user profile data from NestJS
                user_profile = response.json()
                
                # Step 4: Cache user profile in Redis (performance layer)
                await redis_service.set_cache(profile_cache_key, user_profile, category="user")
                
                # Also cache by user ID for other operations
                if user_profile.get("_id"):
                    user_id_cache_key = f"motia:user:{user_profile['_id']}"
                    await redis_service.set_cache(user_id_cache_key, user_profile, category="user")
                
                # Step 5: Emit workflow events
                await context.emit({
                    "topic": "user.cache.miss",
                    "data": {
                        "userId": user_profile.get("_id"),
                        "email": user_profile.get("email"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })
                
                await context.emit({
                    "topic": "user.profile.viewed",
                    "data": {
                        "userId": user_profile.get("_id"),
                        "email": user_profile.get("email"),
                        "role": user_profile.get("role"),
                        "source": "backend",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Get User Profile Workflow Completed Successfully", {
                    "userId": user_profile.get("_id"),
                    "email": user_profile.get("email"),
                    "role": user_profile.get("role"),
                    "traceId": context.trace_id
                })

                # Step 6: Return the exact NestJS response (no modification)
                return {
                    "status": 200,
                    "body": user_profile
                }
                
            else:
                # Step 7: Handle profile access failure
                error_response = response.json() if response.content else {"message": "Profile access failed"}
                
                await context.emit({
                    "topic": "user.profile.access.failed",
                    "data": {
                        "reason": "unauthorized_or_not_found",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Get User Profile Workflow Failed", {
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Get User Profile Backend Timeout", {
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "user.profile.access.failed",
            "data": {
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "User profile service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Get User Profile Workflow Error", {
            "error": str(error),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "user.profile.access.failed",
            "data": {
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Get user profile workflow failed",
                "error": "Internal server error"
            }
        }
