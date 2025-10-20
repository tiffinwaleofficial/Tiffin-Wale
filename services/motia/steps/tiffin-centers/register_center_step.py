"""
Partner Registration Step
Registers a new partner (tiffin center) using the existing NestJS backend
"""

import httpx
import json
from typing import Dict, Any

def handler(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Register a new partner using the NestJS backend /partners endpoint
    
    Expected inputs match CreatePartnerDto from backend:
    - businessName: str
    - businessType: list of strings
    - description: str
    - cuisineTypes: list of strings
    - address: dict with street, city, state, postalCode, country
    - businessHours: dict with open, close, days
    - contactEmail: str (optional)
    - contactPhone: str (optional)
    - deliveryRadius: number (optional, default 5)
    - minimumOrderAmount: number (optional, default 100)
    - deliveryFee: number (optional, default 0)
    - estimatedDeliveryTime: number (optional, default 30)
    - commissionRate: number (optional, default 20)
    """
    
    try:
        # Prepare partner data according to CreatePartnerDto
        partner_data = {
            "businessName": inputs.get("businessName"),
            "businessType": inputs.get("businessType", ["restaurant"]),
            "description": inputs.get("description"),
            "cuisineTypes": inputs.get("cuisineTypes", []),
            "address": inputs.get("address"),
            "businessHours": inputs.get("businessHours"),
            "contactEmail": inputs.get("contactEmail"),
            "contactPhone": inputs.get("contactPhone"),
            "deliveryRadius": inputs.get("deliveryRadius", 5),
            "minimumOrderAmount": inputs.get("minimumOrderAmount", 100),
            "deliveryFee": inputs.get("deliveryFee", 0),
            "estimatedDeliveryTime": inputs.get("estimatedDeliveryTime", 30),
            "commissionRate": inputs.get("commissionRate", 20),
            "isAcceptingOrders": inputs.get("isAcceptingOrders", True),
            "isFeatured": inputs.get("isFeatured", False)
        }
        
        # Call NestJS backend to register partner
        backend_url = inputs.get("BACKEND_URL", "http://localhost:3000")
        
        with httpx.Client() as client:
            response = client.post(
                f"{backend_url}/api/partners",
                json=partner_data,
                headers={"Content-Type": "application/json"},
                timeout=30.0
            )
            
            if response.status_code == 201:
                partner = response.json()
                partner_id = partner.get("_id")
                
                # Cache partner data in Redis (if available)
                try:
                    import redis
                    redis_client = redis.Redis(
                        host=inputs.get("REDIS_HOST", "localhost"),
                        port=int(inputs.get("REDIS_PORT", 6379)),
                        decode_responses=True
                    )
                    redis_client.setex(
                        f"partner:{partner_id}",
                        3600,  # 1 hour TTL
                        json.dumps(partner)
                    )
                except:
                    # Redis not available, continue without caching
                    pass
                
                return {
                    "success": True,
                    "partner": partner,
                    "partnerId": partner_id,
                    "message": "Partner registered successfully",
                    "events": [
                        {
                            "name": "partner.registered",
                            "data": {
                                "partnerId": partner_id,
                                "businessName": partner.get("businessName"),
                                "contactEmail": partner.get("contactEmail"),
                                "status": partner.get("status", "pending")
                            }
                        }
                    ]
                }
            else:
                return {
                    "success": False,
                    "error": f"Failed to register partner: {response.text}",
                    "statusCode": response.status_code
                }
                
    except Exception as e:
        return {
            "success": False,
            "error": f"Partner registration failed: {str(e)}"
        }

# Step configuration
config = {
    "name": "Register Tiffin Center",
    "description": "Register a new partner (tiffin center) using the existing NestJS backend",
    "type": "api",
    "method": "POST",
    "path": "/partners/register",
    "emits": ["partner.registered"]
}
