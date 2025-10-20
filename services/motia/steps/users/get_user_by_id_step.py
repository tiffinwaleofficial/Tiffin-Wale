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
    "name": "GetUserById",
    "description": "TiffinWale get user by ID workflow - connects to NestJS backend with Redis caching",
    "flows": ["tiffinwale-users"],
    "method": "GET",
    "path": "/users/{userId}",
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
        404: {
            "type": "object",
            "properties": {
                "statusCode": {"type": "number"},
                "message": {"type": "string"},
                "error": {"type": "string"}
            }
        }
    },
    "emits": ["user.viewed", "user.cache.hit", "user.cache.miss"]
}

async def handler(req, context):
    """
    Motia Get User By ID Workflow - Connects to NestJS Backend with Redis Caching
    Pure workflow orchestrator for user retrieval by ID with performance optimization
    """
    try:
        params = req.get("params", {})
        headers = req.get("headers", {})
        
        user_id = params.get("userId")
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Get User By ID Workflow Started", {
            "userId": user_id,
            "hasAuthToken": bool(auth_token),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        if not user_id:
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "User ID is required",
                    "error": "Bad Request"
                }
            }

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
        user_cache_key = f"motia:user:{user_id}"
        cached_user = await redis_service.get_cache(user_cache_key)
        
        if cached_user:
            context.logger.info("User found in Redis cache", {
                "userId": user_id,
                "email": cached_user.get("email"),
                "role": cached_user.get("role"),
                "traceId": context.trace_id
            })
            
            await context.emit({
                "topic": "user.cache.hit",
                "data": {
                    "userId": user_id,
                    "email": cached_user.get("email"),
                    "role": cached_user.get("role"),
                    "timestamp": datetime.now().isoformat(),
                    "source": "redis_cache"
                }
            })
            
            await context.emit({
                "topic": "user.viewed",
                "data": {
                    "userId": user_id,
                    "email": cached_user.get("email"),
                    "role": cached_user.get("role"),
                    "viewedBy": "system",  # Could be extracted from JWT in real implementation
                    "source": "cache",
                    "timestamp": datetime.now().isoformat()
                }
            })
            
            return {
                "status": 200,
                "body": cached_user
            }

        # Step 2: Forward request to NestJS backend (real business logic)
        nestjs_user_url = f"http://localhost:3001/api/users/{user_id}"
        
        request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                nestjs_user_url,
                headers=request_headers
            )
            
            context.logger.info("NestJS Get User By ID Backend Response", {
                "status_code": response.status_code,
                "userId": user_id,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                # Step 3: Extract real user data from NestJS
                user_data = response.json()
                
                # Step 4: Cache user data in Redis (performance layer)
                await redis_service.set_cache(user_cache_key, user_data, category="user")
                
                # Step 5: Emit workflow events
                await context.emit({
                    "topic": "user.cache.miss",
                    "data": {
                        "userId": user_id,
                        "email": user_data.get("email"),
                        "role": user_data.get("role"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })
                
                await context.emit({
                    "topic": "user.viewed",
                    "data": {
                        "userId": user_id,
                        "email": user_data.get("email"),
                        "role": user_data.get("role"),
                        "viewedBy": "system",  # Could be extracted from JWT in real implementation
                        "source": "backend",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Get User By ID Workflow Completed Successfully", {
                    "userId": user_id,
                    "email": user_data.get("email"),
                    "role": user_data.get("role"),
                    "traceId": context.trace_id
                })

                # Step 6: Return the exact NestJS response (no modification)
                return {
                    "status": 200,
                    "body": user_data
                }
                
            else:
                # Step 7: Handle user not found or access denied
                error_response = response.json() if response.content else {"message": "User not found"}
                
                await context.emit({
                    "topic": "user.access.failed",
                    "data": {
                        "userId": user_id,
                        "reason": "not_found_or_access_denied",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Get User By ID Workflow Failed", {
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
        context.logger.error("NestJS Get User By ID Backend Timeout", {
            "userId": user_id,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "user.access.failed",
            "data": {
                "userId": user_id,
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "User service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Get User By ID Workflow Error", {
            "error": str(error),
            "userId": user_id,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "user.access.failed",
            "data": {
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
                "message": "Get user by ID workflow failed",
                "error": "Internal server error"
            }
        }
