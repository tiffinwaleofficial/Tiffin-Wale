from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

config = {
    "type": "api",
    "name": "GetRestaurantReviews",
    "description": "TiffinWale get restaurant reviews workflow - connects to NestJS backend with Redis caching",
    "flows": ["tiffinwale-reviews"],
    "method": "GET",
    "path": "/reviews/restaurant/{restaurantId}",
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "reviews": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "_id": {"type": "string"},
                            "rating": {"type": "number"},
                            "comment": {"type": "string"},
                            "user": {"type": "string"},
                            "createdAt": {"type": "string"}
                        }
                    }
                },
                "statistics": {
                    "type": "object",
                    "properties": {
                        "averageRating": {"type": "number"},
                        "totalReviews": {"type": "number"},
                        "ratingDistribution": {"type": "object"}
                    }
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
    "emits": [
        "restaurant.reviews.viewed",
        "analytics.reviews.accessed"
    ]
}

async def handler(req, context):
    """
    Motia Get Restaurant Reviews Workflow - Connects to NestJS Backend
    Pure workflow orchestrator with Redis caching for performance
    """
    try:
        path_params = req.get("pathParams", {})
        restaurant_id = path_params.get("restaurantId")
        
        context.logger.info("Motia Get Restaurant Reviews Workflow Started", {
            "restaurantId": restaurant_id,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Validate required fields
        if not restaurant_id:
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Restaurant ID is required",
                    "error": "Bad Request"
                }
            }

        # Step 1: Try to get from cache first using Motia's state
        reviews_cache_key = f"reviews:restaurant:{restaurant_id}"
        cached_reviews = await context.state.get("cache", reviews_cache_key)
        
        if cached_reviews:
            context.logger.info("Restaurant Reviews Cache Hit", {
                "restaurantId": restaurant_id,
                "reviewCount": len(cached_reviews.get("reviews", [])),
                "traceId": context.trace_id
            })
            
            # Emit analytics event for cache hit
            await context.emit({
                "topic": "restaurant.reviews.viewed",
                "data": {
                    "restaurantId": restaurant_id,
                    "reviewCount": len(cached_reviews.get("reviews", [])),
                    "source": "cache",
                    "timestamp": datetime.now().isoformat()
                }
            })
            
            return {
                "status": 200,
                "body": cached_reviews
            }

        # Step 2: Cache miss - Forward request to NestJS backend (real business logic)
        nestjs_reviews_url = f"http://localhost:3001/api/reviews/restaurant/{restaurant_id}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(nestjs_reviews_url)
            
            context.logger.info("NestJS Get Restaurant Reviews Backend Response", {
                "status_code": response.status_code,
                "restaurantId": restaurant_id,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                # Step 3: Extract real reviews data from NestJS
                reviews_data = response.json()
                
                # Step 4: Cache the reviews data using Motia's state
                await context.state.set("cache", reviews_cache_key, reviews_data)
                
                # Step 5: Emit workflow events for downstream processing
                await context.emit({
                    "topic": "restaurant.reviews.viewed",
                    "data": {
                        "restaurantId": restaurant_id,
                        "reviewCount": len(reviews_data.get("reviews", [])),
                        "averageRating": reviews_data.get("statistics", {}).get("averageRating"),
                        "source": "nestjs_backend",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                await context.emit({
                    "topic": "analytics.reviews.accessed",
                    "data": {
                        "restaurantId": restaurant_id,
                        "reviewCount": len(reviews_data.get("reviews", [])),
                        "accessType": "restaurant_reviews",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Get Restaurant Reviews Workflow Completed Successfully", {
                    "restaurantId": restaurant_id,
                    "reviewCount": len(reviews_data.get("reviews", [])),
                    "averageRating": reviews_data.get("statistics", {}).get("averageRating"),
                    "traceId": context.trace_id
                })

                # Step 6: Return the exact NestJS response (no modification)
                return {
                    "status": 200,
                    "body": reviews_data
                }
                
            elif response.status_code == 404:
                # Restaurant not found or no reviews
                error_response = response.json() if response.content else {"message": "Restaurant not found"}
                
                context.logger.info("Restaurant Reviews Not Found", {
                    "restaurantId": restaurant_id,
                    "traceId": context.trace_id
                })

                return {
                    "status": 404,
                    "body": error_response
                }
            else:
                # Other error from backend
                error_response = response.json() if response.content else {"message": "Failed to get reviews"}
                
                context.logger.error("NestJS Get Restaurant Reviews Backend Error", {
                    "restaurantId": restaurant_id,
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Get Restaurant Reviews Backend Timeout", {
            "restaurantId": restaurant_id,
            "traceId": context.trace_id
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Reviews service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Get Restaurant Reviews Workflow Error", {
            "error": str(error),
            "restaurantId": restaurant_id,
            "traceId": context.trace_id
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Get restaurant reviews workflow failed",
                "error": "Internal server error"
            }
        }