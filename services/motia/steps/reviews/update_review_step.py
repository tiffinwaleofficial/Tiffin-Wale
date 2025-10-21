from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

class UpdateReviewRequest(BaseModel):
    rating: Optional[int] = None  # 1-5
    comment: Optional[str] = None
    images: Optional[List[str]] = None

config = {
    "type": "api",
    "name": "UpdateReview",
    "description": "TiffinWale update review workflow - connects to NestJS backend",
    "flows": ["tiffinwale-reviews"],
    "method": "PUT",
    "path": "/reviews/{reviewId}",
    "bodySchema": UpdateReviewRequest.model_json_schema(),
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "_id": {"type": "string"},
                "rating": {"type": "number"},
                "comment": {"type": "string"},
                "user": {"type": "string"}
            }
        },
        403: {
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
        "review.updated",
        "analytics.review.modified"
    ]
}

async def handler(req, context):
    """
    Motia Update Review Workflow - Connects to NestJS Backend
    """
    try:
        body = req.get("body", {})
        headers = req.get("headers", {})
        path_params = req.get("pathParams", {})
        
        review_id = path_params.get("reviewId")
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Update Review Workflow Started", {
            "reviewId": review_id,
            "hasRating": body.get("rating") is not None,
            "hasComment": body.get("comment") is not None,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        if not review_id:
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Review ID is required",
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

        # Forward to NestJS backend
        nestjs_review_url = f"http://localhost:3001/api/reviews/{review_id}"
        
        request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.put(
                nestjs_review_url,
                json=body,
                headers=request_headers
            )
            
            context.logger.info("NestJS Update Review Backend Response", {
                "status_code": response.status_code,
                "reviewId": review_id,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                review_data = response.json()
                
                # Invalidate caches
                review_cache_key = f"review:{review_id}"
                await context.state.delete("cache", review_cache_key)
                
                # Emit events
                await context.emit({
                    "topic": "review.updated",
                    "data": {
                        "reviewId": review_id,
                        "userId": review_data.get("user"),
                        "rating": review_data.get("rating"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                await context.emit({
                    "topic": "analytics.review.modified",
                    "data": {
                        "reviewId": review_id,
                        "action": "updated",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Update Review Workflow Completed Successfully", {
                    "reviewId": review_id,
                    "traceId": context.trace_id
                })

                return {
                    "status": 200,
                    "body": review_data
                }
                
            else:
                error_response = response.json() if response.content else {"message": "Update failed"}
                
                context.logger.info("Motia Update Review Workflow Failed", {
                    "reviewId": review_id,
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except Exception as error:
        context.logger.error("Motia Update Review Workflow Error", {
            "error": str(error),
            "reviewId": review_id,
            "traceId": context.trace_id
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Update review workflow failed",
                "error": "Internal server error"
            }
        }