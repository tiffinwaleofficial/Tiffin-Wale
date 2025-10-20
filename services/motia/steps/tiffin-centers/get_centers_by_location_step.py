"""
Get Tiffin Centers by Location Step
Retrieves tiffin centers within delivery range of a given location
"""

import httpx
import json
import math
from typing import Dict, Any, List

def handler(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Get tiffin centers within delivery range of a location
    
    Expected inputs:
    - latitude: float
    - longitude: float
    - radius: float (optional, default 10km)
    - cuisineType: string (optional filter)
    - minRating: float (optional filter)
    """
    
    try:
        latitude = float(inputs.get("latitude"))
        longitude = float(inputs.get("longitude"))
        radius = float(inputs.get("radius", 10))  # Default 10km
        cuisine_type = inputs.get("cuisineType")
        min_rating = inputs.get("minRating")
        
        # Try Redis cache first
        cache_key = f"centers_location:{latitude}:{longitude}:{radius}:{cuisine_type or 'all'}:{min_rating or 'any'}"
        cached_centers = None
        
        try:
            import redis
            redis_client = redis.Redis(
                host=inputs.get("REDIS_HOST", "localhost"),
                port=int(inputs.get("REDIS_PORT", 6379)),
                decode_responses=True
            )
            cached_data = redis_client.get(cache_key)
            if cached_data:
                cached_centers = json.loads(cached_data)
        except:
            # Redis not available, continue without cache
            pass
        
        if cached_centers:
            return {
                "success": True,
                "centers": cached_centers,
                "source": "cache",
                "location": {"latitude": latitude, "longitude": longitude},
                "searchRadius": radius
            }
        
        # Call NestJS backend
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        # Build query parameters
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "radius": radius
        }
        
        if cuisine_type:
            params["cuisineType"] = cuisine_type
        if min_rating:
            params["minRating"] = min_rating
        
        with httpx.Client() as client:
            response = client.get(
                f"{backend_url}/api/tiffin-centers/nearby",
                params=params,
                timeout=30.0
            )
            
            if response.status_code == 200:
                centers_data = response.json()
                centers = centers_data.get("centers", [])
                
                # Cache the results
                try:
                    redis_client.setex(
                        cache_key,
                        300,  # 5 minutes TTL for location-based searches
                        json.dumps(centers)
                    )
                except:
                    pass
                
                return {
                    "success": True,
                    "centers": centers,
                    "source": "database",
                    "location": {"latitude": latitude, "longitude": longitude},
                    "searchRadius": radius,
                    "totalFound": len(centers),
                    "events": [
                        {
                            "name": "centers.location_searched",
                            "data": {
                                "location": {"latitude": latitude, "longitude": longitude},
                                "radius": radius,
                                "resultsCount": len(centers),
                                "filters": {
                                    "cuisineType": cuisine_type,
                                    "minRating": min_rating
                                }
                            }
                        }
                    ]
                }
            else:
                return {
                    "success": False,
                    "error": f"Failed to fetch centers: {response.text}",
                    "statusCode": response.status_code
                }
                
    except ValueError as e:
        return {
            "success": False,
            "error": f"Invalid location coordinates: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Location search failed: {str(e)}"
        }

# Step configuration
config = {
    "name": "Get Centers by Location",
    "description": "Retrieve tiffin centers within delivery range of a given location",
    "type": "api",
    "method": "GET",
    "path": "/partners/nearby",
    "emits": ["centers.location_searched"]
}
