"""
Update Tiffin Center Inventory Step
Updates daily inventory and meal availability for a tiffin center
"""

import httpx
import json
from typing import Dict, Any
from datetime import datetime

def handler(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update tiffin center inventory and meal availability
    
    Expected inputs:
    - centerId: string
    - date: string (YYYY-MM-DD, optional - defaults to today)
    - inventory: array of meal items with quantities
    - operationalStatus: string (open/closed/limited)
    """
    
    try:
        center_id = inputs.get("centerId")
        if not center_id:
            return {
                "success": False,
                "error": "Center ID is required"
            }
        
        # Default to today's date if not provided
        inventory_date = inputs.get("date", datetime.now().strftime("%Y-%m-%d"))
        inventory_items = inputs.get("inventory", [])
        operational_status = inputs.get("operationalStatus", "open")
        
        # Prepare inventory data
        inventory_data = {
            "centerId": center_id,
            "date": inventory_date,
            "inventory": inventory_items,
            "operationalStatus": operational_status,
            "lastUpdated": datetime.now().isoformat()
        }
        
        # Call NestJS backend to update inventory
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        with httpx.Client() as client:
            response = client.patch(
                f"{backend_url}/api/tiffin-centers/{center_id}/inventory",
                json=inventory_data,
                headers={"Content-Type": "application/json"},
                timeout=30.0
            )
            
            if response.status_code == 200:
                updated_inventory = response.json()
                
                # Update cache
                try:
                    import redis
                    redis_client = redis.Redis(
                        host=inputs.get("REDIS_HOST", "localhost"),
                        port=int(inputs.get("REDIS_PORT", 6379)),
                        decode_responses=True
                    )
                    
                    # Cache inventory data
                    cache_key = f"center_inventory:{center_id}:{inventory_date}"
                    redis_client.setex(
                        cache_key,
                        1800,  # 30 minutes TTL
                        json.dumps(updated_inventory)
                    )
                    
                    # Update center availability status
                    availability_key = f"center_availability:{center_id}"
                    availability_data = {
                        "status": operational_status,
                        "lastUpdated": datetime.now().isoformat(),
                        "totalItems": len(inventory_items),
                        "availableItems": len([item for item in inventory_items if item.get("quantity", 0) > 0])
                    }
                    redis_client.setex(
                        availability_key,
                        3600,  # 1 hour TTL
                        json.dumps(availability_data)
                    )
                    
                except:
                    # Redis not available, continue without caching
                    pass
                
                # Calculate total available meals
                total_available = sum(item.get("quantity", 0) for item in inventory_items)
                
                return {
                    "success": True,
                    "inventory": updated_inventory,
                    "centerId": center_id,
                    "date": inventory_date,
                    "totalAvailable": total_available,
                    "operationalStatus": operational_status,
                    "message": "Inventory updated successfully",
                    "events": [
                        {
                            "name": "center.inventory.updated",
                            "data": {
                                "centerId": center_id,
                                "date": inventory_date,
                                "totalAvailable": total_available,
                                "operationalStatus": operational_status,
                                "itemsCount": len(inventory_items)
                            }
                        }
                    ]
                }
            else:
                return {
                    "success": False,
                    "error": f"Failed to update inventory: {response.text}",
                    "statusCode": response.status_code
                }
                
    except Exception as e:
        return {
            "success": False,
            "error": f"Inventory update failed: {str(e)}"
        }

# Step configuration
config = {
    "name": "Update Center Inventory",
    "description": "Update daily inventory and meal availability for a tiffin center",
    "type": "api",
    "method": "PATCH",
    "path": "/partners/{centerId}/inventory",
    "emits": ["center.inventory.updated"]
}
