"""
Update Review Step
Updates an existing review using the NestJS backend
"""

import httpx
import json
from typing import Dict, Any

def handler(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update an existing review using the NestJS backend
    
    Expected inputs:
    - reviewId: str
    - rating: number (1-5, optional)
    - comment: str (optional)
    - images: list of strings (optional)
    - authToken: str (JWT token)
    """
    
    try:
        review_id = inputs.get("reviewId")
        if not review_id:
            return {
                "success": False,
                "error": "Review ID is required"
            }
        
        # Prepare update data
        update_data = {}
        
        if inputs.get("rating") is not None:
            rating = inputs.get("rating")
            if rating < 1 or rating > 5:
                return {
                    "success": False,
                    "error": "Rating must be between 1 and 5"
                }
            update_data["rating"] = rating
        
        if inputs.get("comment") is not None:
            update_data["comment"] = inputs.get("comment")
        
        if inputs.get("images") is not None:
            update_data["images"] = inputs.get("images")
        
        if not update_data:
            return {
                "success": False,
                "error": "At least one field must be provided for update"
            }
        
        # Get authentication token
        auth_token = inputs.get("authToken")
        if not auth_token:
            return {
                "success": False,
                "error": "Authentication token is required"
            }
        
        # Call NestJS backend to update review
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        with httpx.Client() as client:
            response = client.put(
                f"{backend_url}/api/reviews/{review_id}",
                json=update_data,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {auth_token}"
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                updated_review = response.json()
                
                # Update cache
                try:
                    import redis
                    redis_client = redis.Redis(
                        host=inputs.get("REDIS_HOST", "localhost"),
                        port=int(inputs.get("REDIS_PORT", 6379)),
                        decode_responses=True
                    )
                    
                    # Update individual review cache
                    redis_client.setex(
                        f"review:{review_id}",
                        1800,  # 30 minutes TTL
                        json.dumps(updated_review)
                    )
                    
                    # Invalidate related caches
                    restaurant_id = updated_review.get("restaurant")
                    menu_item_id = updated_review.get("menuItem")
                    
                    if restaurant_id:
                        redis_client.delete(f"restaurant_reviews:{restaurant_id}")
                    if menu_item_id:
                        redis_client.delete(f"menu_item_reviews:{menu_item_id}")
                    
                except:
                    # Redis not available, continue without caching
                    pass
                
                return {
                    "success": True,
                    "review": updated_review,
                    "reviewId": review_id,
                    "message": "Review updated successfully",
                    "events": [
                        {
                            "name": "review.updated",
                            "data": {
                                "reviewId": review_id,
                                "userId": updated_review.get("user"),
                                "rating": updated_review.get("rating"),
                                "restaurantId": updated_review.get("restaurant"),
                                "menuItemId": updated_review.get("menuItem")
                            }
                        }
                    ]
                }
            else:
                return {
                    "success": False,
                    "error": f"Failed to update review: {response.text}",
                    "statusCode": response.status_code
                }
                
    except Exception as e:
        return {
            "success": False,
            "error": f"Review update failed: {str(e)}"
        }

# Step configuration
config = {
    "name": "Update Review",
    "description": "Update an existing review",
    "type": "api",
    "method": "PUT",
    "path": "/reviews/{reviewId}",
    "emits": ["review.updated"]
}
