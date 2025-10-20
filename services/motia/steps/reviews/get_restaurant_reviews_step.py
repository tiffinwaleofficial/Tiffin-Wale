"""
Get Restaurant Reviews Step
Retrieves reviews for a restaurant/partner using the NestJS backend
"""

import httpx
import json
from typing import Dict, Any

def handler(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Get restaurant reviews using the NestJS backend
    
    Expected inputs:
    - restaurantId: str (partner ID)
    """
    
    try:
        restaurant_id = inputs.get("restaurantId")
        if not restaurant_id:
            return {
                "success": False,
                "error": "Restaurant ID is required"
            }
        
        # Try Redis cache first
        cache_key = f"restaurant_reviews:{restaurant_id}"
        cached_reviews = None
        
        try:
            import redis
            redis_client = redis.Redis(
                host=inputs.get("REDIS_HOST", "localhost"),
                port=int(inputs.get("REDIS_PORT", 6379)),
                decode_responses=True
            )
            cached_data = redis_client.get(cache_key)
            if cached_data:
                cached_reviews = json.loads(cached_data)
        except:
            # Redis not available, continue without cache
            pass
        
        if cached_reviews:
            return {
                "success": True,
                "reviews": cached_reviews,
                "source": "cache",
                "restaurantId": restaurant_id,
                "totalReviews": len(cached_reviews)
            }
        
        # Call NestJS backend to get reviews
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        with httpx.Client() as client:
            response = client.get(
                f"{backend_url}/api/reviews/restaurant/{restaurant_id}",
                timeout=30.0
            )
            
            if response.status_code == 200:
                reviews_data = response.json()
                reviews = reviews_data if isinstance(reviews_data, list) else reviews_data.get("reviews", [])
                
                # Cache the results
                try:
                    redis_client.setex(
                        cache_key,
                        900,  # 15 minutes TTL for reviews
                        json.dumps(reviews)
                    )
                except:
                    pass
                
                # Calculate review statistics
                total_reviews = len(reviews)
                average_rating = 0
                rating_distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
                
                if total_reviews > 0:
                    total_rating = sum(review.get("rating", 0) for review in reviews)
                    average_rating = round(total_rating / total_reviews, 2)
                    
                    for review in reviews:
                        rating = review.get("rating", 0)
                        if 1 <= rating <= 5:
                            rating_distribution[rating] += 1
                
                return {
                    "success": True,
                    "reviews": reviews,
                    "source": "database",
                    "restaurantId": restaurant_id,
                    "totalReviews": total_reviews,
                    "averageRating": average_rating,
                    "ratingDistribution": rating_distribution,
                    "events": [
                        {
                            "name": "reviews.retrieved",
                            "data": {
                                "restaurantId": restaurant_id,
                                "totalReviews": total_reviews,
                                "averageRating": average_rating,
                                "type": "restaurant"
                            }
                        }
                    ]
                }
            else:
                return {
                    "success": False,
                    "error": f"Failed to fetch reviews: {response.text}",
                    "statusCode": response.status_code
                }
                
    except Exception as e:
        return {
            "success": False,
            "error": f"Reviews retrieval failed: {str(e)}"
        }

# Step configuration
config = {
    "name": "Get Restaurant Reviews",
    "description": "Retrieve reviews for a restaurant/partner",
    "type": "api",
    "method": "GET",
    "path": "/reviews/restaurant/{restaurantId}",
    "emits": ["reviews.retrieved"]
}
