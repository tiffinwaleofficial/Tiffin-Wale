from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

class CenterEvent(BaseModel):
    partnerId: Optional[str] = None
    businessName: Optional[str] = None
    businessType: Optional[List[str]] = None
    city: Optional[str] = None
    state: Optional[str] = None
    cuisineTypes: Optional[List[str]] = None
    operationalStatus: Optional[str] = None
    inventoryItemCount: Optional[int] = None
    orderId: Optional[str] = None
    orderStatus: Optional[str] = None
    action: Optional[str] = None
    timestamp: Optional[str] = None
    source: Optional[str] = None

config = {
    "type": "event",
    "name": "CenterEventHandler",
    "description": "TiffinWale tiffin center event handler - processes center-related events for analytics and notifications",
    "flows": ["tiffinwale-tiffin-centers"],
    "subscribes": [
        "partner.registered",
        "tiffin.center.created",
        "partner.status.changed",
        "inventory.updated",
        "order.assigned.to.partner",
        "analytics.partner.registered",
        "analytics.partner.accessed",
        "analytics.inventory.tracked",
        "partner.performance.tracked"
    ],
    "emits": [
        "notification.partner.registered",
        "email.partner.welcome",
        "analytics.center.processed",
        "partner.metrics.updated"
    ],
    "input": CenterEvent.model_json_schema()
}

async def handler(input_data, context):
    """
    Motia Tiffin Center Event Handler - Processes center events for analytics and notifications
    """
    try:
        event = CenterEvent(**input_data)
        
        context.logger.info("Center Event Handler Started", {
            "eventType": context.topic if hasattr(context, 'topic') else "unknown",
            "partnerId": event.partnerId,
            "businessName": event.businessName,
            "city": event.city,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Handle different event types
        if hasattr(context, 'topic'):
            topic = context.topic
            
            if topic == "partner.registered":
                await handle_partner_registered(event, context)
            elif topic == "tiffin.center.created":
                await handle_center_created(event, context)
            elif topic == "partner.status.changed":
                await handle_status_changed(event, context)
            elif topic == "inventory.updated":
                await handle_inventory_updated(event, context)
            elif topic == "order.assigned.to.partner":
                await handle_order_assigned(event, context)
            elif topic in ["analytics.partner.registered", "analytics.partner.accessed", "analytics.inventory.tracked"]:
                await handle_analytics_tracking(event, context)
            elif topic == "partner.performance.tracked":
                await handle_performance_tracking(event, context)

        context.logger.info("Center Event Handler Completed Successfully", {
            "eventType": context.topic if hasattr(context, 'topic') else "unknown",
            "partnerId": event.partnerId,
            "traceId": context.trace_id
        })

    except Exception as error:
        context.logger.error("Center Event Handler Error", {
            "error": str(error),
            "eventData": input_data,
            "traceId": context.trace_id
        })

async def handle_partner_registered(event: CenterEvent, context):
    """Handle new partner registration events"""
    try:
        # Track partner registration analytics
        registration_key = f"analytics:partners:registrations:daily:{datetime.now().strftime('%Y-%m-%d')}"
        current_count = await context.state.get("analytics_cache", registration_key) or 0
        await context.state.set("analytics_cache", registration_key, current_count + 1)
        
        # Track by city
        if event.city:
            city_key = f"analytics:partners:city:{event.city.lower()}:daily:{datetime.now().strftime('%Y-%m-%d')}"
            current_city_count = await context.state.get("analytics_cache", city_key) or 0
            await context.state.set("analytics_cache", city_key, current_city_count + 1)
        
        # Track by business type
        if event.businessType:
            for business_type in event.businessType:
                type_key = f"analytics:partners:type:{business_type.lower()}:daily:{datetime.now().strftime('%Y-%m-%d')}"
                current_type_count = await context.state.get("analytics_cache", type_key) or 0
                await context.state.set("analytics_cache", type_key, current_type_count + 1)
        
        # Emit notification event
        await context.emit({
            "topic": "notification.partner.registered",
            "data": {
                "partnerId": event.partnerId,
                "businessName": event.businessName,
                "city": event.city,
                "businessType": event.businessType,
                "timestamp": datetime.now().isoformat()
            }
        })
        
        # Emit welcome email event
        await context.emit({
            "topic": "email.partner.welcome",
            "data": {
                "partnerId": event.partnerId,
                "businessName": event.businessName,
                "emailType": "partner_welcome",
                "timestamp": datetime.now().isoformat()
            }
        })
        
        context.logger.info("Partner Registered Event Processed", {
            "partnerId": event.partnerId,
            "businessName": event.businessName,
            "city": event.city
        })
        
    except Exception as error:
        context.logger.error("Handle Partner Registered Error", {
            "error": str(error),
            "partnerId": event.partnerId
        })

async def handle_center_created(event: CenterEvent, context):
    """Handle tiffin center creation events"""
    try:
        # Cache center creation data
        center_data = {
            "partnerId": event.partnerId,
            "businessName": event.businessName,
            "city": event.city,
            "state": event.state,
            "cuisineTypes": event.cuisineTypes,
            "createdAt": datetime.now().isoformat()
        }
        
        center_cache_key = f"center:created:{event.partnerId}"
        await context.state.set("tiffin_center_cache", center_cache_key, center_data)
        
        # Emit analytics event
        await context.emit({
            "topic": "analytics.center.processed",
            "data": {
                "partnerId": event.partnerId,
                "action": "center_created",
                "city": event.city,
                "cuisineTypes": event.cuisineTypes,
                "timestamp": datetime.now().isoformat()
            }
        })
        
        context.logger.info("Center Created Event Processed", {
            "partnerId": event.partnerId,
            "businessName": event.businessName,
            "city": event.city
        })
        
    except Exception as error:
        context.logger.error("Handle Center Created Error", {
            "error": str(error),
            "partnerId": event.partnerId
        })

async def handle_status_changed(event: CenterEvent, context):
    """Handle partner status change events"""
    try:
        # Track status changes
        status_key = f"analytics:partners:status:changes:daily:{datetime.now().strftime('%Y-%m-%d')}"
        current_status_count = await context.state.get("analytics_cache", status_key) or 0
        await context.state.set("analytics_cache", status_key, current_status_count + 1)
        
        # Track by status type
        if event.operationalStatus:
            status_type_key = f"analytics:partners:status:{event.operationalStatus}:daily:{datetime.now().strftime('%Y-%m-%d')}"
            current_status_type_count = await context.state.get("analytics_cache", status_type_key) or 0
            await context.state.set("analytics_cache", status_type_key, current_status_type_count + 1)
        
        context.logger.info("Partner Status Changed Event Processed", {
            "partnerId": event.partnerId,
            "operationalStatus": event.operationalStatus
        })
        
    except Exception as error:
        context.logger.error("Handle Status Changed Error", {
            "error": str(error),
            "partnerId": event.partnerId
        })

async def handle_inventory_updated(event: CenterEvent, context):
    """Handle inventory update events"""
    try:
        # Track inventory updates
        inventory_key = f"analytics:inventory:updates:daily:{datetime.now().strftime('%Y-%m-%d')}"
        current_inventory_count = await context.state.get("analytics_cache", inventory_key) or 0
        await context.state.set("analytics_cache", inventory_key, current_inventory_count + 1)
        
        # Track by partner
        partner_inventory_key = f"analytics:partner:{event.partnerId}:inventory:updates:daily:{datetime.now().strftime('%Y-%m-%d')}"
        current_partner_inventory_count = await context.state.get("analytics_cache", partner_inventory_key) or 0
        await context.state.set("analytics_cache", partner_inventory_key, current_partner_inventory_count + 1)
        
        # Emit metrics update
        await context.emit({
            "topic": "partner.metrics.updated",
            "data": {
                "partnerId": event.partnerId,
                "metricType": "inventory_update",
                "itemCount": event.inventoryItemCount,
                "timestamp": datetime.now().isoformat()
            }
        })
        
        context.logger.info("Inventory Updated Event Processed", {
            "partnerId": event.partnerId,
            "inventoryItemCount": event.inventoryItemCount
        })
        
    except Exception as error:
        context.logger.error("Handle Inventory Updated Error", {
            "error": str(error),
            "partnerId": event.partnerId
        })

async def handle_order_assigned(event: CenterEvent, context):
    """Handle order assignment events"""
    try:
        # Track order assignments
        assignment_key = f"analytics:orders:assignments:daily:{datetime.now().strftime('%Y-%m-%d')}"
        current_assignment_count = await context.state.get("analytics_cache", assignment_key) or 0
        await context.state.set("analytics_cache", assignment_key, current_assignment_count + 1)
        
        # Track by partner
        partner_assignment_key = f"analytics:partner:{event.partnerId}:orders:daily:{datetime.now().strftime('%Y-%m-%d')}"
        current_partner_assignment_count = await context.state.get("analytics_cache", partner_assignment_key) or 0
        await context.state.set("analytics_cache", partner_assignment_key, current_partner_assignment_count + 1)
        
        context.logger.info("Order Assigned Event Processed", {
            "partnerId": event.partnerId,
            "orderId": event.orderId
        })
        
    except Exception as error:
        context.logger.error("Handle Order Assigned Error", {
            "error": str(error),
            "partnerId": event.partnerId,
            "orderId": event.orderId
        })

async def handle_analytics_tracking(event: CenterEvent, context):
    """Handle analytics tracking events"""
    try:
        # Store analytics data for reporting
        analytics_data = {
            "partnerId": event.partnerId,
            "action": event.action,
            "city": event.city,
            "businessType": event.businessType,
            "timestamp": event.timestamp or datetime.now().isoformat(),
            "source": event.source
        }
        
        analytics_key = f"analytics:centers:events:{event.partnerId}:{datetime.now().strftime('%Y%m%d%H%M%S')}"
        await context.state.set("analytics_cache", analytics_key, analytics_data)
        
        # Emit processed analytics event
        await context.emit({
            "topic": "analytics.center.processed",
            "data": analytics_data
        })
        
        context.logger.info("Analytics Tracking Event Processed", {
            "partnerId": event.partnerId,
            "action": event.action
        })
        
    except Exception as error:
        context.logger.error("Handle Analytics Tracking Error", {
            "error": str(error),
            "partnerId": event.partnerId
        })

async def handle_performance_tracking(event: CenterEvent, context):
    """Handle performance tracking events"""
    try:
        # Cache performance metrics
        performance_data = {
            "partnerId": event.partnerId,
            "timestamp": event.timestamp or datetime.now().isoformat(),
            "source": event.source
        }
        
        performance_key = f"partner:performance:{event.partnerId}:latest"
        await context.state.set("analytics_cache", performance_key, performance_data)
        
        # Emit metrics update
        await context.emit({
            "topic": "partner.metrics.updated",
            "data": {
                "partnerId": event.partnerId,
                "metricType": "performance_tracking",
                "timestamp": datetime.now().isoformat()
            }
        })
        
        context.logger.info("Performance Tracking Event Processed", {
            "partnerId": event.partnerId
        })
        
    except Exception as error:
        context.logger.error("Handle Performance Tracking Error", {
            "error": str(error),
            "partnerId": event.partnerId
        })