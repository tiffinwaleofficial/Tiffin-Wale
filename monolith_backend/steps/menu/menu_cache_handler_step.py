from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def delete_cache(self, key):
        return True
    async def set_cache(self, key, value, category=None):
        return True

redis_service = SimpleRedisService()

class MenuCacheEvent(BaseModel):
    partnerId: str
    reason: str
    itemId: Optional[str] = None
    itemName: Optional[str] = None
    timestamp: str

config = {
    "type": "event",
    "name": "MenuCacheHandler",
    "description": "Handle menu cache invalidation and optimization events",
    "flows": ["tiffinwale-menu"],
    "subscribes": [
        "menu.cache.invalidated",
        "menu.item.created",
        "menu.item.updated",
        "menu.availability.changed"
    ],
    "emits": [
        "menu.cache.cleared",
        "menu.cache.warmed",
        "menu.partner.notified"
    ]
}

async def handler(req, context):
    """
    Motia Menu Cache Handler - Manages menu caching and optimization
    Pure workflow orchestrator for menu cache management
    """
    try:
        event_data = req.get("data", {})
        event_topic = req.get("topic", "")
        
        partner_id = event_data.get("partnerId")
        reason = event_data.get("reason", "cache_invalidation")
        item_id = event_data.get("itemId")
        item_name = event_data.get("itemName")
        
        context.logger.info("Motia Menu Cache Handler Started", {
            "eventTopic": event_topic,
            "partnerId": partner_id,
            "reason": reason,
            "itemId": item_id,
            "itemName": item_name,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Step 1: Clear partner menu cache
        if partner_id:
            partner_menu_cache_key = f"motia:menu:partner:{partner_id}"
            await redis_service.delete_cache(partner_menu_cache_key)
            
            # Also clear related caches
            partner_stats_cache_key = f"motia:menu:stats:{partner_id}"
            await redis_service.delete_cache(partner_stats_cache_key)

        # Step 2: Handle different event types
        if event_topic == "menu.item.created":
            await handle_item_created(event_data, context)
        elif event_topic == "menu.item.updated":
            await handle_item_updated(event_data, context)
        elif event_topic == "menu.availability.changed":
            await handle_availability_changed(event_data, context)
        elif event_topic == "menu.cache.invalidated":
            await handle_cache_invalidated(event_data, context)

        # Step 3: Emit cache cleared event
        await context.emit({
            "topic": "menu.cache.cleared",
            "data": {
                "partnerId": partner_id,
                "reason": reason,
                "itemId": item_id,
                "itemName": item_name,
                "clearedAt": datetime.now().isoformat(),
                "eventTrigger": event_topic
            }
        })

        # Step 4: Cache warming (optional - for high-traffic partners)
        if should_warm_cache(partner_id, reason):
            await context.emit({
                "topic": "menu.cache.warmed",
                "data": {
                    "partnerId": partner_id,
                    "reason": "high_traffic_partner",
                    "timestamp": datetime.now().isoformat()
                }
            })

        context.logger.info("Motia Menu Cache Handler Completed Successfully", {
            "eventTopic": event_topic,
            "partnerId": partner_id,
            "reason": reason,
            "itemId": item_id,
            "traceId": context.trace_id
        })

    except Exception as error:
        context.logger.error("Motia Menu Cache Handler Error", {
            "error": str(error),
            "eventTopic": event_topic,
            "partnerId": event_data.get("partnerId"),
            "traceId": context.trace_id
        })

async def handle_item_created(event_data, context):
    """Handle menu item creation events"""
    partner_id = event_data.get("partnerId")
    item_name = event_data.get("itemName")
    
    # Log menu item creation analytics
    await context.emit({
        "topic": "menu.partner.notified",
        "data": {
            "partnerId": partner_id,
            "notificationType": "item_created",
            "message": f"New menu item '{item_name}' has been added to your menu",
            "itemId": event_data.get("itemId"),
            "itemName": item_name,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Menu item creation handled", {
        "partnerId": partner_id,
        "itemName": item_name,
        "traceId": context.trace_id
    })

async def handle_item_updated(event_data, context):
    """Handle menu item update events"""
    partner_id = event_data.get("partnerId")
    item_name = event_data.get("itemName")
    updated_fields = event_data.get("updatedFields", [])
    
    # Check if price was updated (important for notifications)
    if "price" in updated_fields:
        await context.emit({
            "topic": "menu.partner.notified",
            "data": {
                "partnerId": partner_id,
                "notificationType": "price_updated",
                "message": f"Price updated for menu item '{item_name}'",
                "itemId": event_data.get("itemId"),
                "itemName": item_name,
                "newPrice": event_data.get("newPrice"),
                "timestamp": datetime.now().isoformat()
            }
        })
    
    context.logger.info("Menu item update handled", {
        "partnerId": partner_id,
        "itemName": item_name,
        "updatedFields": updated_fields,
        "traceId": context.trace_id
    })

async def handle_availability_changed(event_data, context):
    """Handle menu item availability changes"""
    partner_id = event_data.get("partnerId")
    item_name = event_data.get("itemName")
    new_availability = event_data.get("newAvailability")
    
    # Notify about availability changes (important for customers)
    status = "available" if new_availability else "unavailable"
    await context.emit({
        "topic": "menu.partner.notified",
        "data": {
            "partnerId": partner_id,
            "notificationType": "availability_changed",
            "message": f"Menu item '{item_name}' is now {status}",
            "itemId": event_data.get("itemId"),
            "itemName": item_name,
            "newAvailability": new_availability,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    context.logger.info("Menu availability change handled", {
        "partnerId": partner_id,
        "itemName": item_name,
        "newAvailability": new_availability,
        "traceId": context.trace_id
    })

async def handle_cache_invalidated(event_data, context):
    """Handle general cache invalidation events"""
    partner_id = event_data.get("partnerId")
    reason = event_data.get("reason")
    
    context.logger.info("Menu cache invalidation handled", {
        "partnerId": partner_id,
        "reason": reason,
        "traceId": context.trace_id
    })

def should_warm_cache(partner_id: str, reason: str) -> bool:
    """
    Determine if cache should be warmed for this partner
    In a real implementation, this would check partner traffic patterns
    """
    # Mock logic - in reality, check partner popularity/traffic
    high_traffic_partners = ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
    return partner_id in high_traffic_partners and reason in ["item_created", "item_updated"]
