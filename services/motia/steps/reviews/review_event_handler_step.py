from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

class ReviewEvent(BaseModel):
    reviewId: Optional[str] = None
    restaurantId: Optional[str] = None
    menuItemId: Optional[str] = None
    userId: Optional[str] = None
    rating: Optional[int] = None
    type: Optional[str] = None
    action: Optional[str] = None
    timestamp: Optional[str] = None
    source: Optional[str] = None

config = {
    "type": "event",
    "name": "ReviewEventHandler",
    "description": "TiffinWale review event handler - processes review-related events for analytics and notifications",
    "flows": ["tiffinwale-reviews"],
    "subscribes": [
        "review.created",
        "review.updated",
        "review.helpful.marked",
        "restaurant.review.added",
        "menu.item.review.added",
        "analytics.review.tracked",
        "analytics.review.modified"
    ],
    "emits": [
        "notification.review.created",
        "email.review.notification",
        "analytics.review.processed"
    ],
    "input": ReviewEvent.model_json_schema()
}

async def handler(input_data, context):
    """
    Motia Review Event Handler - Processes review events for analytics and notifications
    """
    try:
        event = ReviewEvent(**input_data)
        
        context.logger.info("Review Event Handler Started", {
            "eventType": context.topic if hasattr(context, 'topic') else "unknown",
            "reviewId": event.reviewId,
            "restaurantId": event.restaurantId,
            "menuItemId": event.menuItemId,
            "userId": event.userId,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Handle different event types
        if hasattr(context, 'topic'):
            topic = context.topic
            
            if topic == "review.created":
                await handle_review_created(event, context)
            elif topic == "review.updated":
                await handle_review_updated(event, context)
            elif topic == "review.helpful.marked":
                await handle_review_helpful_marked(event, context)
            elif topic in ["restaurant.review.added", "menu.item.review.added"]:
                await handle_review_statistics_updated(event, context)
            elif topic in ["analytics.review.tracked", "analytics.review.modified"]:
                await handle_analytics_tracking(event, context)

        context.logger.info("Review Event Handler Completed Successfully", {
            "eventType": context.topic if hasattr(context, 'topic') else "unknown",
            "reviewId": event.reviewId,
            "traceId": context.trace_id
        })

    except Exception as error:
        context.logger.error("Review Event Handler Error", {
            "error": str(error),
            "eventData": input_data,
            "traceId": context.trace_id
        })

async def handle_review_created(event: ReviewEvent, context):
    """Handle new review creation events"""
    try:
        # Track review creation analytics
        analytics_key = f"analytics:reviews:daily:{datetime.now().strftime('%Y-%m-%d')}"
        current_count = await context.state.get("analytics_cache", analytics_key) or 0
        await context.state.set("analytics_cache", analytics_key, current_count + 1)
        
        # Track by rating
        rating_key = f"analytics:reviews:rating:{event.rating}:daily:{datetime.now().strftime('%Y-%m-%d')}"
        current_rating_count = await context.state.get("analytics_cache", rating_key) or 0
        await context.state.set("analytics_cache", rating_key, current_rating_count + 1)
        
        # Emit notification event
        await context.emit({
            "topic": "notification.review.created",
            "data": {
                "reviewId": event.reviewId,
                "userId": event.userId,
                "restaurantId": event.restaurantId,
                "menuItemId": event.menuItemId,
                "rating": event.rating,
                "type": event.type,
                "timestamp": datetime.now().isoformat()
            }
        })
        
        # Emit email notification for restaurant owner (if restaurant review)
        if event.restaurantId and event.type == "restaurant":
            await context.emit({
                "topic": "email.review.notification",
                "data": {
                    "reviewId": event.reviewId,
                    "restaurantId": event.restaurantId,
                    "rating": event.rating,
                    "type": "restaurant_review_created",
                    "timestamp": datetime.now().isoformat()
                }
            })
        
        context.logger.info("Review Created Event Processed", {
            "reviewId": event.reviewId,
            "type": event.type,
            "rating": event.rating
        })
        
    except Exception as error:
        context.logger.error("Handle Review Created Error", {
            "error": str(error),
            "reviewId": event.reviewId
        })

async def handle_review_updated(event: ReviewEvent, context):
    """Handle review update events"""
    try:
        # Track review updates
        update_key = f"analytics:reviews:updates:daily:{datetime.now().strftime('%Y-%m-%d')}"
        current_update_count = await context.state.get("analytics_cache", update_key) or 0
        await context.state.set("analytics_cache", update_key, current_update_count + 1)
        
        # Emit analytics event
        await context.emit({
            "topic": "analytics.review.processed",
            "data": {
                "reviewId": event.reviewId,
                "action": "updated",
                "userId": event.userId,
                "timestamp": datetime.now().isoformat()
            }
        })
        
        context.logger.info("Review Updated Event Processed", {
            "reviewId": event.reviewId,
            "userId": event.userId
        })
        
    except Exception as error:
        context.logger.error("Handle Review Updated Error", {
            "error": str(error),
            "reviewId": event.reviewId
        })

async def handle_review_helpful_marked(event: ReviewEvent, context):
    """Handle review helpful marking events"""
    try:
        # Track helpful marks
        helpful_key = f"analytics:reviews:helpful:daily:{datetime.now().strftime('%Y-%m-%d')}"
        current_helpful_count = await context.state.get("analytics_cache", helpful_key) or 0
        await context.state.set("analytics_cache", helpful_key, current_helpful_count + 1)
        
        context.logger.info("Review Helpful Marked Event Processed", {
            "reviewId": event.reviewId
        })
        
    except Exception as error:
        context.logger.error("Handle Review Helpful Marked Error", {
            "error": str(error),
            "reviewId": event.reviewId
        })

async def handle_review_statistics_updated(event: ReviewEvent, context):
    """Handle review statistics update events"""
    try:
        # Cache review statistics for quick access
        if event.restaurantId:
            stats_key = f"restaurant:review:stats:{event.restaurantId}"
            stats_data = {
                "lastReviewId": event.reviewId,
                "lastRating": event.rating,
                "lastUpdated": datetime.now().isoformat()
            }
            await context.state.set("review_cache", stats_key, stats_data)
        
        if event.menuItemId:
            stats_key = f"menu:item:review:stats:{event.menuItemId}"
            stats_data = {
                "lastReviewId": event.reviewId,
                "lastRating": event.rating,
                "lastUpdated": datetime.now().isoformat()
            }
            await context.state.set("review_cache", stats_key, stats_data)
        
        context.logger.info("Review Statistics Updated Event Processed", {
            "reviewId": event.reviewId,
            "restaurantId": event.restaurantId,
            "menuItemId": event.menuItemId
        })
        
    except Exception as error:
        context.logger.error("Handle Review Statistics Updated Error", {
            "error": str(error),
            "reviewId": event.reviewId
        })

async def handle_analytics_tracking(event: ReviewEvent, context):
    """Handle analytics tracking events"""
    try:
        # Store analytics data for reporting
        analytics_data = {
            "reviewId": event.reviewId,
            "userId": event.userId,
            "restaurantId": event.restaurantId,
            "menuItemId": event.menuItemId,
            "rating": event.rating,
            "type": event.type,
            "action": event.action,
            "timestamp": event.timestamp or datetime.now().isoformat(),
            "source": event.source
        }
        
        analytics_key = f"analytics:reviews:events:{event.reviewId}:{datetime.now().strftime('%Y%m%d%H%M%S')}"
        await context.state.set("analytics_cache", analytics_key, analytics_data)
        
        # Emit processed analytics event
        await context.emit({
            "topic": "analytics.review.processed",
            "data": analytics_data
        })
        
        context.logger.info("Analytics Tracking Event Processed", {
            "reviewId": event.reviewId,
            "action": event.action,
            "type": event.type
        })
        
    except Exception as error:
        context.logger.error("Handle Analytics Tracking Error", {
            "error": str(error),
            "reviewId": event.reviewId
        })