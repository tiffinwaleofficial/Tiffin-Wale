"""
Review Event Handler Step
Handles events related to reviews and ratings
"""

import httpx
import json
from typing import Dict, Any
from datetime import datetime

def handler(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle review related events
    
    Subscribes to events:
    - review.created
    - review.updated
    - review.helpful_marked
    """
    
    try:
        event_name = inputs.get("eventName")
        event_data = inputs.get("eventData", {})
        
        if event_name == "review.created":
            return handle_review_created(inputs, event_data)
        elif event_name == "review.updated":
            return handle_review_updated(inputs, event_data)
        elif event_name == "review.helpful_marked":
            return handle_review_helpful(inputs, event_data)
        else:
            return {
                "success": False,
                "error": f"Unknown event: {event_name}"
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": f"Event handling failed: {str(e)}"
        }

def handle_review_created(inputs: Dict[str, Any], event_data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle new review creation"""
    try:
        review_id = event_data.get("reviewId")
        restaurant_id = event_data.get("restaurantId")
        item_id = event_data.get("itemId")
        user_id = event_data.get("userId")
        rating = event_data.get("rating")
        review_type = event_data.get("type", "restaurant")
        
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        # Update partner/restaurant average rating
        if restaurant_id:
            try:
                # This would typically be handled by the backend automatically
                # but we can trigger analytics events
                analytics_data = {
                    "event": "review_created",
                    "reviewId": review_id,
                    "restaurantId": restaurant_id,
                    "userId": user_id,
                    "rating": rating,
                    "type": review_type,
                    "timestamp": datetime.now().isoformat()
                }
                
                with httpx.Client() as client:
                    client.post(
                        f"{backend_url}/api/analytics/events",
                        json=analytics_data,
                        timeout=5.0
                    )
            except:
                pass  # Analytics failure shouldn't break the flow
        
        # Send notification to restaurant owner (if restaurant review)
        if restaurant_id and review_type == "restaurant":
            try:
                notification_data = {
                    "type": "new_review",
                    "recipientType": "partner",
                    "recipientId": restaurant_id,
                    "title": "New Review Received",
                    "message": f"You received a {rating}-star review",
                    "data": {
                        "reviewId": review_id,
                        "rating": rating,
                        "type": "restaurant_review"
                    }
                }
                
                with httpx.Client() as client:
                    client.post(
                        f"{backend_url}/api/notifications/send",
                        json=notification_data,
                        timeout=10.0
                    )
            except:
                pass  # Notification failure shouldn't break the flow
        
        # Update Redis cache statistics
        try:
            import redis
            redis_client = redis.Redis(
                host=inputs.get("REDIS_HOST", "localhost"),
                port=int(inputs.get("REDIS_PORT", 6379)),
                decode_responses=True
            )
            
            # Update review count
            if restaurant_id:
                redis_client.incr(f"restaurant_review_count:{restaurant_id}")
                redis_client.expire(f"restaurant_review_count:{restaurant_id}", 3600)
            
            if item_id:
                redis_client.incr(f"menu_item_review_count:{item_id}")
                redis_client.expire(f"menu_item_review_count:{item_id}", 3600)
                
        except:
            pass
        
        return {
            "success": True,
            "action": "review_created_processed",
            "reviewId": review_id,
            "type": review_type,
            "events": [
                {
                    "name": "review.analytics.updated",
                    "data": {
                        "reviewId": review_id,
                        "restaurantId": restaurant_id,
                        "itemId": item_id,
                        "rating": rating
                    }
                }
            ]
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to handle review creation: {str(e)}"
        }

def handle_review_updated(inputs: Dict[str, Any], event_data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle review updates"""
    try:
        review_id = event_data.get("reviewId")
        restaurant_id = event_data.get("restaurantId")
        menu_item_id = event_data.get("menuItemId")
        user_id = event_data.get("userId")
        rating = event_data.get("rating")
        
        # Log analytics event
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        analytics_data = {
            "event": "review_updated",
            "reviewId": review_id,
            "restaurantId": restaurant_id,
            "menuItemId": menu_item_id,
            "userId": user_id,
            "rating": rating,
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            with httpx.Client() as client:
                client.post(
                    f"{backend_url}/api/analytics/events",
                    json=analytics_data,
                    timeout=5.0
                )
        except:
            pass
        
        # Invalidate related caches
        try:
            import redis
            redis_client = redis.Redis(
                host=inputs.get("REDIS_HOST", "localhost"),
                port=int(inputs.get("REDIS_PORT", 6379)),
                decode_responses=True
            )
            
            if restaurant_id:
                redis_client.delete(f"restaurant_reviews:{restaurant_id}")
            if menu_item_id:
                redis_client.delete(f"menu_item_reviews:{menu_item_id}")
                
        except:
            pass
        
        return {
            "success": True,
            "action": "review_updated_processed",
            "reviewId": review_id
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to handle review update: {str(e)}"
        }

def handle_review_helpful(inputs: Dict[str, Any], event_data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle review marked as helpful"""
    try:
        review_id = event_data.get("reviewId")
        user_id = event_data.get("userId")
        
        # Log analytics event
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        analytics_data = {
            "event": "review_marked_helpful",
            "reviewId": review_id,
            "userId": user_id,
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            with httpx.Client() as client:
                client.post(
                    f"{backend_url}/api/analytics/events",
                    json=analytics_data,
                    timeout=5.0
                )
        except:
            pass
        
        return {
            "success": True,
            "action": "review_helpful_processed",
            "reviewId": review_id
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to handle review helpful: {str(e)}"
        }

# Step configuration
config = {
    "name": "Review Event Handler",
    "description": "Handle events related to reviews and ratings",
    "type": "event",
    "subscribes": [
        "review.created",
        "review.updated",
        "review.helpful_marked"
    ],
    "emits": [
        "review.analytics.updated"
    ]
}
