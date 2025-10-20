"""
Tiffin Center Event Handler Step
Handles events related to tiffin center operations
"""

import httpx
import json
from typing import Dict, Any
from datetime import datetime

def handler(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle tiffin center related events
    
    Subscribes to events:
    - center.registered
    - center.inventory.updated
    - center.status.changed
    - order.assigned_to_center
    """
    
    try:
        event_name = inputs.get("eventName")
        event_data = inputs.get("eventData", {})
        
        if event_name == "center.registered":
            return handle_center_registered(inputs, event_data)
        elif event_name == "center.inventory.updated":
            return handle_inventory_updated(inputs, event_data)
        elif event_name == "center.status.changed":
            return handle_status_changed(inputs, event_data)
        elif event_name == "order.assigned_to_center":
            return handle_order_assigned(inputs, event_data)
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

def handle_center_registered(inputs: Dict[str, Any], event_data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle new center registration"""
    try:
        center_id = event_data.get("centerId")
        center_name = event_data.get("centerName")
        owner_email = event_data.get("ownerEmail")
        
        # Send welcome email to center owner
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        email_data = {
            "to": owner_email,
            "template": "center_welcome",
            "data": {
                "centerName": center_name,
                "centerId": center_id,
                "verificationRequired": True
            },
            "sender": "partnerships@tiffinwale.com"
        }
        
        with httpx.Client() as client:
            client.post(
                f"{backend_url}/api/email/send",
                json=email_data,
                timeout=10.0
            )
        
        # Log analytics event
        analytics_data = {
            "event": "center_registered",
            "centerId": center_id,
            "timestamp": datetime.now().isoformat(),
            "metadata": {
                "centerName": center_name,
                "status": "pending_verification"
            }
        }
        
        try:
            client.post(
                f"{backend_url}/api/analytics/events",
                json=analytics_data,
                timeout=5.0
            )
        except:
            pass  # Analytics failure shouldn't break the flow
        
        return {
            "success": True,
            "action": "center_registered_processed",
            "centerId": center_id,
            "emailSent": True,
            "events": [
                {
                    "name": "center.welcome_email.sent",
                    "data": {
                        "centerId": center_id,
                        "email": owner_email
                    }
                }
            ]
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to handle center registration: {str(e)}"
        }

def handle_inventory_updated(inputs: Dict[str, Any], event_data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle inventory updates"""
    try:
        center_id = event_data.get("centerId")
        total_available = event_data.get("totalAvailable", 0)
        operational_status = event_data.get("operationalStatus")
        
        # Update Redis cache for quick availability checks
        try:
            import redis
            redis_client = redis.Redis(
                host=inputs.get("REDIS_HOST", "localhost"),
                port=int(inputs.get("REDIS_PORT", 6379)),
                decode_responses=True
            )
            
            # Update center availability in cache
            availability_data = {
                "centerId": center_id,
                "totalAvailable": total_available,
                "status": operational_status,
                "lastUpdated": datetime.now().isoformat()
            }
            
            redis_client.setex(
                f"center_quick_availability:{center_id}",
                1800,  # 30 minutes
                json.dumps(availability_data)
            )
            
            # If inventory is low, trigger alert
            if total_available < 10 and operational_status == "open":
                redis_client.lpush(
                    "center_low_inventory_alerts",
                    json.dumps({
                        "centerId": center_id,
                        "totalAvailable": total_available,
                        "timestamp": datetime.now().isoformat()
                    })
                )
                
        except:
            pass  # Redis failure shouldn't break the flow
        
        # Notify nearby customers if inventory is updated
        events_to_emit = []
        
        if total_available > 0 and operational_status == "open":
            events_to_emit.append({
                "name": "center.inventory.available",
                "data": {
                    "centerId": center_id,
                    "totalAvailable": total_available
                }
            })
        elif total_available == 0:
            events_to_emit.append({
                "name": "center.inventory.depleted",
                "data": {
                    "centerId": center_id,
                    "status": operational_status
                }
            })
        
        return {
            "success": True,
            "action": "inventory_updated_processed",
            "centerId": center_id,
            "totalAvailable": total_available,
            "events": events_to_emit
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to handle inventory update: {str(e)}"
        }

def handle_status_changed(inputs: Dict[str, Any], event_data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle center status changes"""
    try:
        center_id = event_data.get("centerId")
        new_status = event_data.get("newStatus")
        old_status = event_data.get("oldStatus")
        
        # Log status change for analytics
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        analytics_data = {
            "event": "center_status_changed",
            "centerId": center_id,
            "timestamp": datetime.now().isoformat(),
            "metadata": {
                "newStatus": new_status,
                "oldStatus": old_status
            }
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
            "action": "status_change_processed",
            "centerId": center_id,
            "newStatus": new_status
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to handle status change: {str(e)}"
        }

def handle_order_assigned(inputs: Dict[str, Any], event_data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle order assignment to center"""
    try:
        center_id = event_data.get("centerId")
        order_id = event_data.get("orderId")
        estimated_prep_time = event_data.get("estimatedPrepTime", 30)
        
        # Update center workload in cache
        try:
            import redis
            redis_client = redis.Redis(
                host=inputs.get("REDIS_HOST", "localhost"),
                port=int(inputs.get("REDIS_PORT", 6379)),
                decode_responses=True
            )
            
            # Increment active orders count
            redis_client.incr(f"center_active_orders:{center_id}")
            redis_client.expire(f"center_active_orders:{center_id}", 3600)
            
            # Add to preparation queue
            queue_item = {
                "orderId": order_id,
                "centerId": center_id,
                "assignedAt": datetime.now().isoformat(),
                "estimatedPrepTime": estimated_prep_time
            }
            
            redis_client.lpush(
                f"center_prep_queue:{center_id}",
                json.dumps(queue_item)
            )
            
        except:
            pass
        
        return {
            "success": True,
            "action": "order_assignment_processed",
            "centerId": center_id,
            "orderId": order_id,
            "events": [
                {
                    "name": "center.order.queued",
                    "data": {
                        "centerId": center_id,
                        "orderId": order_id,
                        "estimatedPrepTime": estimated_prep_time
                    }
                }
            ]
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to handle order assignment: {str(e)}"
        }

# Step configuration
config = {
    "name": "Center Event Handler",
    "description": "Handle events related to tiffin center operations",
    "type": "event",
    "subscribes": [
        "partner.registered",
        "center.inventory.updated", 
        "center.status.changed",
        "order.assigned_to_center"
    ],
    "emits": [
        "center.welcome_email.sent",
        "center.inventory.available",
        "center.inventory.depleted",
        "center.order.queued"
    ]
}
