from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

class CreateRestaurantReviewRequest(BaseModel):
    rating: int  # 1-5
    comment: Optional[str] = None
    images: Optional[List[str]] = []

config = {
    "type": "api",
    "name": "CreateRestaurantReview",
    "description": "TiffinWale create restaurant review workflow - connects to NestJS backend",
    "flows": ["tiffinwale-reviews"],
    "method": "POST",
    "path": "/reviews/restaurant/{restaurantId}",
    "bodySchema": CreateRestaurantReviewRequest.model_json_schema(),
    "responseSchema": {
        201: {
            "type": "object",
            "properties": {
                "_id": {"type": "string"},
                "rating": {"type": "number"},
                "comment": {"type": "string"},
                "restaurantId": {"type": "string"},
                "user": {"type": "string"}
            }
        },
        400: {
            "type": "object",
            "properties": {
                "statusCode": {"type": "number"},
                "message": {"type": "string"},
                "error": {"type": "string"}
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
        "review.created",
        "restaurant.review.added",
        "analytics.review.tracked"
    ]
}

async def handler(req, context):
    """
    Motia Create Restaurant Review Workflow - Connects to NestJS Backend
    Pure workflow orchestrator for restaurant review creation
    """
    try:
        body = req.get("body", {})
        headers = req.get("headers", {})
        path_params = req.get("pathParams", {})
        
        restaurant_id = path_params.get("restaurantId")
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Create Restaurant Review Workflow Started", {
            "restaurantId": restaurant_id,
            "rating": body.get("rating"),
            "hasComment": bool(body.get("comment")),
            "imageCount": len(body.get("images", [])),
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

        if not auth_token:
            return {
                "status": 401,
                "body": {
                    "statusCode": 401,
                    "message": "Authorization token is required",
                    "error": "Unauthorized"
                }
            }

        rating = body.get("rating")
        if not rating or rating < 1 or rating > 5:
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Rating must be between 1 and 5",
                    "error": "Bad Request"
                }
            }

        # Step 1: Forward review creation to NestJS backend (real business logic)
        nestjs_review_url = f"http://localhost:3001/api/reviews/restaurant/{restaurant_id}"
        
        request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                nestjs_review_url,
                json=body,
                headers=request_headers
            )
            
            context.logger.info("NestJS Create Restaurant Review Backend Response", {
                "status_code": response.status_code,
                "restaurantId": restaurant_id,
                "rating": body.get("rating"),
                "traceId": context.trace_id
            })
            
            if response.status_code == 201:
                # Step 2: Extract real review data from NestJS
                review_data = response.json()
                
                # Step 3: Cache review data using Motia's state
                review_id = review_data.get("_id")
                if review_id:
                    review_cache_key = f"review:{review_id}"
                    await context.state.set("cache", review_cache_key, review_data)
                    
                    # Invalidate restaurant reviews cache
                    restaurant_reviews_cache_key = f"reviews:restaurant:{restaurant_id}"
                    await context.state.delete("cache", restaurant_reviews_cache_key)
                
                # Step 4: Emit workflow events for downstream processing
                await context.emit({
                    "topic": "review.created",
                    "data": {
                        "reviewId": review_id,
                        "restaurantId": restaurant_id,
                        "userId": review_data.get("user"),
                        "rating": review_data.get("rating"),
                        "type": "restaurant",
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                await context.emit({
                    "topic": "restaurant.review.added",
                    "data": {
                        "restaurantId": restaurant_id,
                        "reviewId": review_id,
                        "rating": review_data.get("rating"),
                        "reviewCount": review_data.get("reviewCount", 1),
                        "averageRating": review_data.get("averageRating"),
                        "timestamp": datetime.now().isoformat()
                    }
                })

                await context.emit({
                    "topic": "analytics.review.tracked",
                    "data": {
                        "reviewId": review_id,
                        "restaurantId": restaurant_id,
                        "rating": review_data.get("rating"),
                        "type": "restaurant",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Create Restaurant Review Workflow Completed Successfully", {
                    "reviewId": review_id,
                    "restaurantId": restaurant_id,
                    "rating": review_data.get("rating"),
                    "traceId": context.trace_id
                })

                # Step 5: Return the exact NestJS response (no modification)
                return {
                    "status": 201,
                    "body": review_data
                }
                
            else:
                # Step 6: Handle review creation failure
                error_response = response.json() if response.content else {"message": "Review creation failed"}
                
                await context.emit({
                    "topic": "review.creation.failed",
                    "data": {
                        "restaurantId": restaurant_id,
                        "rating": body.get("rating"),
                        "reason": "backend_validation_failed",
                        "status_code": response.status_code,
                        "error": error_response.get("message", "Unknown error"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Create Restaurant Review Workflow Failed", {
                    "restaurantId": restaurant_id,
                    "rating": body.get("rating"),
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Create Restaurant Review Backend Timeout", {
            "restaurantId": restaurant_id,
            "rating": body.get("rating"),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "review.creation.failed",
            "data": {
                "restaurantId": restaurant_id,
                "rating": body.get("rating"),
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Review creation service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Create Restaurant Review Workflow Error", {
            "error": str(error),
            "restaurantId": restaurant_id,
            "rating": body.get("rating"),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "review.creation.failed",
            "data": {
                "restaurantId": restaurant_id,
                "rating": body.get("rating"),
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Create restaurant review workflow failed",
                "error": "Internal server error"
            }
        }