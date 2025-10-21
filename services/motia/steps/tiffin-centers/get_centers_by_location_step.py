from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

config = {
    "type": "api",
    "name": "GetCentersByLocation",
    "description": "TiffinWale get tiffin centers by location workflow - connects to NestJS backend with Redis caching",
    "flows": ["tiffinwale-tiffin-centers"],
    "method": "GET",
    "path": "/partners/location",
    "queryParams": [
        {"name": "city", "description": "Filter by city"},
        {"name": "cuisineType", "description": "Filter by cuisine type"},
        {"name": "rating", "description": "Filter by minimum rating"}
    ],
    "responseSchema": {
        200: {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "_id": {"type": "string"},
                    "businessName": {"type": "string"},
                    "cuisineTypes": {"type": "array", "items": {"type": "string"}},
                    "address": {"type": "object"},
                    "averageRating": {"type": "number"},
                    "totalReviews": {"type": "number"},
                    "isAcceptingOrders": {"type": "boolean"}
                }
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
        "partners.location.searched",
        "analytics.location.query"
    ]
}

async def handler(req, context):
    """
    Motia Get Tiffin Centers by Location Workflow - Connects to NestJS Backend
    """
    try:
        query_params = req.get("queryParams", {})
        
        city = query_params.get("city")
        cuisine_type = query_params.get("cuisineType")
        rating = query_params.get("rating")
        
        context.logger.info("Motia Get Centers by Location Workflow Started", {
            "city": city,
            "cuisineType": cuisine_type,
            "rating": rating,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Build cache key based on filters
        cache_key_parts = ["partners:location"]
        if city:
            cache_key_parts.append(f"city:{city.lower()}")
        if cuisine_type:
            cache_key_parts.append(f"cuisine:{cuisine_type.lower()}")
        if rating:
            cache_key_parts.append(f"rating:{rating}")
        
        partners_cache_key = ":".join(cache_key_parts)
        
        # Try to get from cache first
        cached_partners = await context.state.get("tiffin_center_cache", partners_cache_key)
        
        if cached_partners:
            context.logger.info("Partners Location Cache Hit", {
                "city": city,
                "partnerCount": len(cached_partners) if isinstance(cached_partners, list) else 0,
                "traceId": context.trace_id
            })
            
            # Emit analytics event for cache hit
            await context.emit({
                "topic": "partners.location.searched",
                "data": {
                    "city": city,
                    "cuisineType": cuisine_type,
                    "rating": rating,
                    "resultCount": len(cached_partners) if isinstance(cached_partners, list) else 0,
                    "source": "cache",
                    "timestamp": datetime.now().isoformat()
                }
            })
            
            return {
                "status": 200,
                "body": cached_partners
            }

        # Cache miss - Forward request to NestJS backend
        nestjs_partners_url = "http://localhost:3001/api/partners"
        
        # Build query parameters
        params = {}
        if city:
            params["city"] = city
        if cuisine_type:
            params["cuisineType"] = cuisine_type
        if rating:
            params["rating"] = rating
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(nestjs_partners_url, params=params)
            
            context.logger.info("NestJS Get Partners Backend Response", {
                "status_code": response.status_code,
                "city": city,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                partners_data = response.json()
                
                # Cache the partners data
                await context.state.set("tiffin_center_cache", partners_cache_key, partners_data)
                
                # Emit workflow events
                await context.emit({
                    "topic": "partners.location.searched",
                    "data": {
                        "city": city,
                        "cuisineType": cuisine_type,
                        "rating": rating,
                        "resultCount": len(partners_data) if isinstance(partners_data, list) else 0,
                        "source": "nestjs_backend",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                await context.emit({
                    "topic": "analytics.location.query",
                    "data": {
                        "city": city,
                        "cuisineType": cuisine_type,
                        "rating": rating,
                        "resultCount": len(partners_data) if isinstance(partners_data, list) else 0,
                        "queryType": "location_search",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Get Centers by Location Workflow Completed Successfully", {
                    "city": city,
                    "resultCount": len(partners_data) if isinstance(partners_data, list) else 0,
                    "traceId": context.trace_id
                })

                return {
                    "status": 200,
                    "body": partners_data
                }
                
            else:
                error_response = response.json() if response.content else {"message": "Failed to get partners"}
                
                context.logger.error("NestJS Get Partners Backend Error", {
                    "city": city,
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Get Partners Backend Timeout", {
            "city": city,
            "traceId": context.trace_id
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Partners service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Get Centers by Location Workflow Error", {
            "error": str(error),
            "city": city,
            "traceId": context.trace_id
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Get centers by location workflow failed",
                "error": "Internal server error"
            }
        }