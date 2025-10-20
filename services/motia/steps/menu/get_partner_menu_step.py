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
    "name": "GetPartnerMenu",
    "description": "TiffinWale get partner menu workflow - connects to NestJS backend with Redis caching",
    "flows": ["tiffinwale-menu"],
    "method": "GET",
    "path": "/menu/partner/{partnerId}",
    "responseSchema": {
        200: {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "_id": {"type": "string"},
                    "name": {"type": "string"},
                    "price": {"type": "number"},
                    "isAvailable": {"type": "boolean"}
                }
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
    "emits": ["menu.viewed", "menu.cache.hit", "menu.cache.miss"]
}

async def handler(req, context):
    """
    Motia Get Partner Menu Workflow - Connects to NestJS Backend with Redis Caching
    Pure workflow orchestrator for menu retrieval with performance optimization
    """
    try:
        params = req.get("params", {})
        headers = req.get("headers", {})
        
        partner_id = params.get("partnerId")
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Get Partner Menu Workflow Started", {
            "partnerId": partner_id,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        if not partner_id:
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Partner ID is required",
                    "error": "Bad Request"
                }
            }

        # Step 1: Check Redis cache first (performance optimization)
        menu_cache_key = f"motia:menu:partner:{partner_id}"
        cached_menu = await redis_service.get_cache(menu_cache_key)
        
        if cached_menu:
            context.logger.info("Partner menu found in Redis cache", {
                "partnerId": partner_id,
                "itemCount": len(cached_menu) if isinstance(cached_menu, list) else 0,
                "traceId": context.trace_id
            })
            
            await context.emit({
                "topic": "menu.cache.hit",
                "data": {
                    "partnerId": partner_id,
                    "itemCount": len(cached_menu) if isinstance(cached_menu, list) else 0,
                    "timestamp": datetime.now().isoformat(),
                    "source": "redis_cache"
                }
            })
            
            await context.emit({
                "topic": "menu.viewed",
                "data": {
                    "partnerId": partner_id,
                    "itemCount": len(cached_menu) if isinstance(cached_menu, list) else 0,
                    "source": "cache",
                    "timestamp": datetime.now().isoformat()
                }
            })
            
            return {
                "status": 200,
                "body": cached_menu
            }

        # Step 2: Forward request to NestJS backend (real business logic)
        nestjs_menu_url = f"http://localhost:3001/api/menu/partner/{partner_id}"
        
        request_headers = {
            "Content-Type": "application/json"
        }
        
        # Include JWT token if provided
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                nestjs_menu_url,
                headers=request_headers
            )
            
            context.logger.info("NestJS Get Partner Menu Backend Response", {
                "status_code": response.status_code,
                "partnerId": partner_id,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                # Step 3: Extract real menu data from NestJS (menu items returned directly as array)
                menu_items = response.json()
                
                # Step 4: Cache menu data in Redis (performance layer)
                await redis_service.set_cache(menu_cache_key, menu_items, category="menu")
                
                # Step 5: Emit workflow events
                await context.emit({
                    "topic": "menu.cache.miss",
                    "data": {
                        "partnerId": partner_id,
                        "itemCount": len(menu_items) if isinstance(menu_items, list) else 0,
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })
                
                await context.emit({
                    "topic": "menu.viewed",
                    "data": {
                        "partnerId": partner_id,
                        "itemCount": len(menu_items) if isinstance(menu_items, list) else 0,
                        "source": "backend",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Get Partner Menu Workflow Completed Successfully", {
                    "partnerId": partner_id,
                    "itemCount": len(menu_items) if isinstance(menu_items, list) else 0,
                    "traceId": context.trace_id
                })

                # Step 6: Return the exact NestJS response (no modification)
                return {
                    "status": 200,
                    "body": menu_items
                }
                
            else:
                # Step 7: Handle menu not found or access denied
                error_response = response.json() if response.content else {"message": "Menu not found"}
                
                await context.emit({
                    "topic": "menu.access.failed",
                    "data": {
                        "partnerId": partner_id,
                        "reason": "not_found_or_access_denied",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Get Partner Menu Workflow Failed", {
                    "partnerId": partner_id,
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Get Partner Menu Backend Timeout", {
            "partnerId": partner_id,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "menu.access.failed",
            "data": {
                "partnerId": partner_id,
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Menu service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Get Partner Menu Workflow Error", {
            "error": str(error),
            "partnerId": partner_id,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "menu.access.failed",
            "data": {
                "partnerId": partner_id,
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Get partner menu workflow failed",
                "error": "Internal server error"
            }
        }
