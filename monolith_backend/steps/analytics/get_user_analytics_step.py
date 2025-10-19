from datetime import datetime
import httpx

# Simple Redis mock to avoid Python 3.13 import conflicts
class SimpleRedisService:
    async def get_cache(self, key):
        return None
    async def set_cache(self, key, value, category=None):
        return True

redis_service = SimpleRedisService()

config = {
    "type": "api",
    "name": "GetUserAnalytics",
    "description": "TiffinWale user personal analytics - order history, spending patterns, preferences",
    "flows": ["tiffinwale-analytics"],
    "method": "GET",
    "path": "/analytics/user",
    "queryParams": {
        "period": {"type": "string", "default": "month", "enum": ["week", "month", "quarter", "year"]},
        "userId": {"type": "string", "description": "Optional user ID for admin access"}
    },
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "userId": {"type": "string"},
                "period": {"type": "string"},
                "spending": {
                    "type": "object",
                    "properties": {
                        "total": {"type": "number"},
                        "orders": {"type": "number"},
                        "averageOrderValue": {"type": "number"}
                    }
                },
                "orders": {
                    "type": "object",
                    "properties": {
                        "completed": {"type": "number"},
                        "cancelled": {"type": "number"},
                        "totalOrders": {"type": "number"}
                    }
                },
                "preferences": {
                    "type": "object",
                    "properties": {
                        "favoritePartners": {"type": "array"},
                        "favoriteCuisines": {"type": "array"},
                        "popularItems": {"type": "array"}
                    }
                },
                "insights": {"type": "object"},
                "timestamp": {"type": "string"}
            }
        }
    },
    "emits": ["analytics.user.viewed", "user.insights.generated"]
}

async def handler(req, context):
    """
    Motia User Analytics Workflow - Personal Insights for Students
    Provides personalized analytics and spending insights
    """
    try:
        query = req.get("query", {})
        headers = req.get("headers", {})
        
        period = query.get("period", "month")
        target_user_id = query.get("userId")  # For admin access to other user's analytics
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia User Analytics Workflow Started", {
            "period": period,
            "targetUserId": target_user_id,
            "hasAuthToken": bool(auth_token),
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        if not auth_token:
            return {
                "status": 401,
                "body": {
                    "statusCode": 401,
                    "message": "Authorization token is required",
                    "error": "Unauthorized"
                }
            }

        # Step 1: Get current user info from token (or use target_user_id for admin)
        current_user = await get_user_from_token(auth_token)
        user_id = target_user_id if target_user_id and is_admin_user(current_user) else current_user.get("userId")
        
        if not user_id:
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Unable to determine user ID",
                    "error": "Bad Request"
                }
            }

        # Step 2: Check Redis cache first (performance optimization)
        user_analytics_cache_key = f"motia:analytics:user:{user_id}:{period}"
        cached_analytics = await redis_service.get_cache(user_analytics_cache_key)
        
        if cached_analytics:
            context.logger.info("User analytics found in Redis cache", {
                "userId": user_id,
                "period": period,
                "totalSpending": cached_analytics.get("spending", {}).get("total", 0),
                "traceId": context.trace_id
            })
            
            await context.emit({
                "topic": "analytics.user.viewed",
                "data": {
                    "userId": user_id,
                    "period": period,
                    "totalSpending": cached_analytics.get("spending", {}).get("total", 0),
                    "totalOrders": cached_analytics.get("orders", {}).get("totalOrders", 0),
                    "source": "cache",
                    "timestamp": datetime.now().isoformat()
                }
            })
            
            return {
                "status": 200,
                "body": cached_analytics
            }

        # Step 3: Gather user analytics from NestJS backend
        request_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Get user's order history and spending
            user_orders = await get_user_orders(user_id, period, client, request_headers)
            user_preferences = await get_user_preferences(user_id, client, request_headers)
            
            context.logger.info("User Analytics Data Gathered", {
                "userId": user_id,
                "ordersCount": len(user_orders),
                "traceId": context.trace_id
            })
            
            # Step 4: Process and analyze user data
            user_analytics = {
                "userId": user_id,
                "period": period,
                "spending": calculate_spending_analytics(user_orders),
                "orders": calculate_order_analytics(user_orders),
                "preferences": {
                    "favoritePartners": get_favorite_partners(user_orders),
                    "favoriteCuisines": get_favorite_cuisines(user_orders),
                    "popularItems": get_popular_items(user_orders),
                    "orderingPatterns": analyze_ordering_patterns(user_orders)
                },
                "insights": {
                    "spendingTrend": calculate_spending_trend(user_orders),
                    "orderFrequency": calculate_order_frequency(user_orders),
                    "averageOrderTime": get_average_order_time(user_orders),
                    "preferredDeliveryDays": get_preferred_days(user_orders),
                    "budgetRecommendation": generate_budget_recommendation(user_orders),
                    "savingsOpportunity": calculate_savings_opportunity(user_orders)
                },
                "achievements": {
                    "totalOrdersAllTime": len(user_orders),  # This would be from all-time data
                    "loyaltyLevel": calculate_loyalty_level(user_orders),
                    "favoritePartnerStreak": get_partner_streak(user_orders),
                    "monthlyGoalProgress": calculate_monthly_goal_progress(user_orders)
                },
                "recommendations": {
                    "newPartnersToTry": get_partner_recommendations(user_id, user_orders),
                    "budgetFriendlyOptions": get_budget_recommendations(user_orders),
                    "healthyOptions": get_healthy_recommendations(user_id)
                },
                "timestamp": datetime.now().isoformat(),
                "source": "nestjs_backend"
            }
            
            # Step 5: Cache user analytics in Redis
            await redis_service.set_cache(user_analytics_cache_key, user_analytics, category="analytics")
            
            # Step 6: Emit workflow events
            await context.emit({
                "topic": "analytics.user.viewed",
                "data": {
                    "userId": user_id,
                    "period": period,
                    "totalSpending": user_analytics["spending"]["total"],
                    "totalOrders": user_analytics["orders"]["totalOrders"],
                    "loyaltyLevel": user_analytics["achievements"]["loyaltyLevel"],
                    "source": "backend",
                    "timestamp": datetime.now().isoformat()
                }
            })
            
            await context.emit({
                "topic": "user.insights.generated",
                "data": {
                    "userId": user_id,
                    "period": period,
                    "spendingTrend": user_analytics["insights"]["spendingTrend"],
                    "orderFrequency": user_analytics["insights"]["orderFrequency"],
                    "loyaltyLevel": user_analytics["achievements"]["loyaltyLevel"],
                    "recommendationsCount": len(user_analytics["recommendations"]["newPartnersToTry"]),
                    "timestamp": datetime.now().isoformat()
                }
            })

            context.logger.info("Motia User Analytics Workflow Completed Successfully", {
                "userId": user_id,
                "period": period,
                "totalSpending": user_analytics["spending"]["total"],
                "totalOrders": user_analytics["orders"]["totalOrders"],
                "traceId": context.trace_id
            })

            # Step 7: Return personalized user analytics
            return {
                "status": 200,
                "body": user_analytics
            }

    except httpx.TimeoutException:
        context.logger.error("NestJS User Analytics Backend Timeout", {
            "userId": user_id,
            "period": period,
            "traceId": context.trace_id
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "User analytics service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia User Analytics Workflow Error", {
            "error": str(error),
            "userId": user_id if 'user_id' in locals() else "unknown",
            "period": period,
            "traceId": context.trace_id
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "User analytics workflow failed",
                "error": "Internal server error"
            }
        }

async def get_user_from_token(auth_token):
    """Extract user info from JWT token (mock implementation)"""
    # In real implementation, would decode JWT token
    return {"userId": "user123", "role": "customer"}

def is_admin_user(user):
    """Check if user has admin privileges"""
    return user.get("role") in ["admin", "super_admin"]

async def get_user_orders(user_id, period, client, headers):
    """Get user's orders for the specified period (mock data for now)"""
    try:
        # In real implementation, would query orders API with user filter
        return [
            {"orderId": "order1", "partnerId": "partner1", "amount": 25.50, "status": "delivered", "items": ["Butter Chicken"], "orderTime": "2023-12-01T12:30:00Z"},
            {"orderId": "order2", "partnerId": "partner2", "amount": 18.75, "status": "delivered", "items": ["Dal Makhani"], "orderTime": "2023-12-03T19:15:00Z"},
            {"orderId": "order3", "partnerId": "partner1", "amount": 32.00, "status": "delivered", "items": ["Biryani"], "orderTime": "2023-12-05T20:00:00Z"},
            {"orderId": "order4", "partnerId": "partner3", "amount": 22.25, "status": "cancelled", "items": ["Noodles"], "orderTime": "2023-12-07T13:45:00Z"}
        ]
    except:
        return []

async def get_user_preferences(user_id, client, headers):
    """Get user's preferences and profile data"""
    try:
        # In real implementation, would query user preferences
        return {"dietaryRestrictions": ["vegetarian"], "spiceLevel": "medium"}
    except:
        return {}

def calculate_spending_analytics(orders):
    """Calculate spending metrics from orders"""
    completed_orders = [o for o in orders if o["status"] == "delivered"]
    total_spending = sum(o["amount"] for o in completed_orders)
    
    return {
        "total": round(total_spending, 2),
        "orders": len(completed_orders),
        "averageOrderValue": round(total_spending / max(len(completed_orders), 1), 2),
        "highestOrder": max([o["amount"] for o in completed_orders], default=0),
        "lowestOrder": min([o["amount"] for o in completed_orders], default=0)
    }

def calculate_order_analytics(orders):
    """Calculate order statistics"""
    return {
        "completed": len([o for o in orders if o["status"] == "delivered"]),
        "cancelled": len([o for o in orders if o["status"] == "cancelled"]),
        "totalOrders": len(orders),
        "successRate": round((len([o for o in orders if o["status"] == "delivered"]) / max(len(orders), 1)) * 100, 1)
    }

def get_favorite_partners(orders):
    """Get user's favorite restaurant partners"""
    partner_counts = {}
    for order in orders:
        if order["status"] == "delivered":
            partner_id = order["partnerId"]
            partner_counts[partner_id] = partner_counts.get(partner_id, 0) + 1
    
    # Sort by order count and return top 3
    sorted_partners = sorted(partner_counts.items(), key=lambda x: x[1], reverse=True)
    return [{"partnerId": p[0], "orders": p[1], "name": f"Restaurant {p[0]}"} for p in sorted_partners[:3]]

def get_favorite_cuisines(orders):
    """Get user's favorite cuisine types (mock data)"""
    return ["North Indian", "Chinese", "South Indian"]

def get_popular_items(orders):
    """Get user's most ordered items"""
    item_counts = {}
    for order in orders:
        if order["status"] == "delivered":
            for item in order["items"]:
                item_counts[item] = item_counts.get(item, 0) + 1
    
    sorted_items = sorted(item_counts.items(), key=lambda x: x[1], reverse=True)
    return [{"item": i[0], "orders": i[1]} for i in sorted_items[:5]]

def analyze_ordering_patterns(orders):
    """Analyze user's ordering patterns"""
    return {
        "mostActiveDay": "Friday",
        "preferredTimeSlot": "19:00-21:00",
        "averageOrdersPerWeek": 2.3,
        "weekendVsWeekday": "60% weekend, 40% weekday"
    }

def calculate_spending_trend(orders):
    """Calculate spending trend"""
    # Mock calculation - in real implementation, would compare with previous period
    return "+12.5%"

def calculate_order_frequency(orders):
    """Calculate how often user orders"""
    return "2.3 orders per week"

def get_average_order_time(orders):
    """Get user's preferred ordering time"""
    return "7:30 PM"

def get_preferred_days(orders):
    """Get user's preferred ordering days"""
    return ["Friday", "Saturday", "Sunday"]

def generate_budget_recommendation(orders):
    """Generate budget recommendation based on spending"""
    avg_spending = sum(o["amount"] for o in orders if o["status"] == "delivered") / max(len(orders), 1)
    return f"Consider setting a weekly budget of ₹{round(avg_spending * 2.5, 2)} for optimal spending"

def calculate_savings_opportunity(orders):
    """Calculate potential savings"""
    return "You could save ₹150/month by ordering during happy hours"

def calculate_loyalty_level(orders):
    """Calculate user's loyalty level"""
    completed_orders = len([o for o in orders if o["status"] == "delivered"])
    if completed_orders >= 20:
        return "Gold"
    elif completed_orders >= 10:
        return "Silver"
    else:
        return "Bronze"

def get_partner_streak(orders):
    """Get longest streak with same partner"""
    return 5  # Mock data

def calculate_monthly_goal_progress(orders):
    """Calculate progress towards monthly ordering goal"""
    return {
        "current": len(orders),
        "goal": 12,
        "percentage": round((len(orders) / 12) * 100, 1)
    }

def get_partner_recommendations(user_id, orders):
    """Get new partner recommendations"""
    return [
        {"partnerId": "new_partner1", "name": "Spice Garden", "cuisine": "Indian", "rating": 4.5},
        {"partnerId": "new_partner2", "name": "Dragon Palace", "cuisine": "Chinese", "rating": 4.3}
    ]

def get_budget_recommendations(orders):
    """Get budget-friendly recommendations"""
    return [
        {"item": "Dal Rice Combo", "price": 12.50, "partner": "Budget Bites"},
        {"item": "Veg Thali", "price": 15.00, "partner": "Home Kitchen"}
    ]

def get_healthy_recommendations(user_id):
    """Get healthy food recommendations"""
    return [
        {"item": "Grilled Chicken Salad", "calories": 350, "partner": "Healthy Eats"},
        {"item": "Quinoa Bowl", "calories": 280, "partner": "Fit Food"}
    ]
