"""
Create Restaurant Review Step
Creates a review for a restaurant/partner using the NestJS backend
"""

import httpx
import json
from typing import Dict, Any

def handler(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create a restaurant review using the NestJS backend
    
    Expected inputs match CreateReviewDto from backend:
    - restaurantId: str (partner ID)
    - rating: number (1-5)
    - comment: str (optional)
    - images: list of strings (optional)
    - userId: str (from authentication)
    """
    
    try:
        restaurant_id = inputs.get("restaurantId")
        if not restaurant_id:
            return {
                "success": False,
                "error": "Restaurant ID is required"
            }
        
        # Prepare review data according to CreateReviewDto
        review_data = {
            "rating": inputs.get("rating"),
            "comment": inputs.get("comment"),
            "images": inputs.get("images", [])
        }
        
        # Validate rating
        if not review_data["rating"] or review_data["rating"] < 1 or review_data["rating"] > 5:
            return {
                "success": False,
                "error": "Rating must be between 1 and 5"
            }
        
        # Get authentication token
        auth_token = inputs.get("authToken")
        if not auth_token:
            return {
                "success": False,
                "error": "Authentication token is required"
            }
        
        # Call NestJS backend to create review
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        with httpx.Client() as client:
            response = client.post(
                f"{backend_url}/api/reviews/restaurant/{restaurant_id}",
                json=review_data,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {auth_token}"
                },
                timeout=30.0
            )
            
            if response.status_code == 201:
                review = response.json()
                review_id = review.get("_id")
                
                # Cache review data in Redis (if available)
                try:
                    import redis
                    redis_client = redis.Redis(
                        host=inputs.get("REDIS_HOST", "localhost"),
                        port=int(inputs.get("REDIS_PORT", 6379)),
                        decode_responses=True
                    )
                    
                    # Cache individual review
                    redis_client.setex(
                        f"review:{review_id}",
                        1800,  # 30 minutes TTL
                        json.dumps(review)
                    )
                    
                    # Invalidate restaurant reviews cache
                    redis_client.delete(f"restaurant_reviews:{restaurant_id}")
                    
                except:
                    # Redis not available, continue without caching
                    pass
                
                return {
                    "success": True,
                    "review": review,
                    "reviewId": review_id,
                    "restaurantId": restaurant_id,
                    "message": "Review created successfully",
                    "events": [
                        {
                            "name": "review.created",
                            "data": {
                                "reviewId": review_id,
                                "restaurantId": restaurant_id,
                                "userId": review.get("user"),
                                "rating": review.get("rating"),
                                "type": "restaurant"
                            }
                        }
                    ]
                }
            else:
                return {
                    "success": False,
                    "error": f"Failed to create review: {response.text}",
                    "statusCode": response.status_code
                }
                
    except Exception as e:
        return {
            "success": False,
            "error": f"Review creation failed: {str(e)}"
        }

# Step configuration
config = {
    "name": "Create Restaurant Review",
    "description": "Create a review for a restaurant/partner",
    "type": "api",
    "method": "POST",
    "path": "/reviews/restaurant/{restaurantId}",
    "emits": ["review.created"]
}
