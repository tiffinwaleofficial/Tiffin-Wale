"""
Tiffin Center Analytics Step
Retrieves performance analytics for tiffin centers
"""

import httpx
import json
from typing import Dict, Any
from datetime import datetime, timedelta

def handler(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Get analytics data for tiffin centers
    
    Expected inputs:
    - centerId: string (optional - if not provided, gets all centers)
    - period: string (today, week, month, quarter, year)
    - startDate: string (optional, YYYY-MM-DD)
    - endDate: string (optional, YYYY-MM-DD)
    - metrics: array of strings (orders, revenue, ratings, inventory)
    """
    
    try:
        center_id = inputs.get("centerId")
        period = inputs.get("period", "week")
        start_date = inputs.get("startDate")
        end_date = inputs.get("endDate")
        metrics = inputs.get("metrics", ["orders", "revenue", "ratings"])
        
        # Build cache key
        cache_key = f"center_analytics:{center_id or 'all'}:{period}:{start_date or 'auto'}:{end_date or 'auto'}:{':'.join(sorted(metrics))}"
        
        # Try Redis cache first
        try:
            import redis
            redis_client = redis.Redis(
                host=inputs.get("REDIS_HOST", "localhost"),
                port=int(inputs.get("REDIS_PORT", 6379)),
                decode_responses=True
            )
            cached_data = redis_client.get(cache_key)
            if cached_data:
                cached_analytics = json.loads(cached_data)
                return {
                    "success": True,
                    "analytics": cached_analytics,
                    "source": "cache",
                    "centerId": center_id,
                    "period": period
                }
        except:
            # Redis not available, continue without cache
            pass
        
        # Call NestJS backend
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        # Build query parameters
        params = {
            "period": period,
            "metrics": ",".join(metrics)
        }
        
        if start_date:
            params["startDate"] = start_date
        if end_date:
            params["endDate"] = end_date
        
        # Determine endpoint based on whether centerId is provided
        if center_id:
            endpoint = f"{backend_url}/api/tiffin-centers/{center_id}/analytics"
        else:
            endpoint = f"{backend_url}/api/tiffin-centers/analytics"
        
        with httpx.Client() as client:
            response = client.get(
                endpoint,
                params=params,
                timeout=30.0
            )
            
            if response.status_code == 200:
                analytics_data = response.json()
                
                # Cache the results
                try:
                    # Different TTL based on period
                    ttl_map = {
                        "today": 300,    # 5 minutes
                        "week": 900,     # 15 minutes
                        "month": 1800,   # 30 minutes
                        "quarter": 3600, # 1 hour
                        "year": 7200     # 2 hours
                    }
                    ttl = ttl_map.get(period, 900)
                    
                    redis_client.setex(cache_key, ttl, json.dumps(analytics_data))
                except:
                    pass
                
                return {
                    "success": True,
                    "analytics": analytics_data,
                    "source": "database",
                    "centerId": center_id,
                    "period": period,
                    "metrics": metrics,
                    "events": [
                        {
                            "name": "center.analytics.retrieved",
                            "data": {
                                "centerId": center_id,
                                "period": period,
                                "metrics": metrics,
                                "timestamp": datetime.now().isoformat()
                            }
                        }
                    ]
                }
            else:
                return {
                    "success": False,
                    "error": f"Failed to fetch analytics: {response.text}",
                    "statusCode": response.status_code
                }
                
    except Exception as e:
        return {
            "success": False,
            "error": f"Analytics retrieval failed: {str(e)}"
        }

# Step configuration
config = {
    "name": "Center Analytics",
    "description": "Retrieve performance analytics for tiffin centers",
    "type": "api",
    "method": "GET",
    "path": "/partners/analytics",
    "emits": ["center.analytics.retrieved"]
}
