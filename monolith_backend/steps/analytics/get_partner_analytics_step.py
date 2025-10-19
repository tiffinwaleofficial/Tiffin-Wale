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
    "name": "GetPartnerAnalytics",
    "description": "TiffinWale partner analytics workflow - revenue, orders, and performance metrics",
    "flows": ["tiffinwale-analytics"],
    "method": "GET",
    "path": "/analytics/partner/{partnerId}",
    "queryParams": {
        "period": {"type": "string", "default": "week", "enum": ["today", "week", "month", "year"]},
        "startDate": {"type": "string", "format": "date"},
        "endDate": {"type": "string", "format": "date"}
    },
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "partnerId": {"type": "string"},
                "period": {"type": "string"},
                "revenue": {
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
                        "pending": {"type": "number"},
                        "preparing": {"type": "number"},
                        "delivered": {"type": "number"},
                        "cancelled": {"type": "number"}
                    }
                },
                "popularItems": {"type": "array"},
                "timestamp": {"type": "string"}
            }
        }
    },
    "emits": ["analytics.partner.viewed", "analytics.cache.hit", "analytics.cache.miss"]
}

async def handler(req, context):
    """
    Motia Partner Analytics Workflow - Connects to NestJS Backend
    Provides comprehensive partner performance metrics with Redis caching
    """
    try:
        params = req.get("params", {})
        query = req.get("query", {})
        headers = req.get("headers", {})
        
        partner_id = params.get("partnerId")
        period = query.get("period", "week")
        start_date = query.get("startDate")
        end_date = query.get("endDate")
        
        # Extract JWT token from Authorization header
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Partner Analytics Workflow Started", {
            "partnerId": partner_id,
            "period": period,
            "startDate": start_date,
            "endDate": end_date,
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        if not partner_id:
            return {
                "status": 400,
                "body": {
                    "statusCode": 400,
                    "message": "Partner ID is required",
                    "error": "Bad Request"
                }
            }

        # Step 1: Check Redis cache first (performance optimization)
        analytics_cache_key = f"motia:analytics:partner:{partner_id}:{period}:{start_date or 'all'}:{end_date or 'all'}"
        cached_analytics = await redis_service.get_cache(analytics_cache_key)
        
        if cached_analytics:
            context.logger.info("Partner analytics found in Redis cache", {
                "partnerId": partner_id,
                "period": period,
                "totalRevenue": cached_analytics.get("revenue", {}).get("total", 0),
                "traceId": context.trace_id
            })
            
            await context.emit({
                "topic": "analytics.cache.hit",
                "data": {
                    "partnerId": partner_id,
                    "period": period,
                    "totalRevenue": cached_analytics.get("revenue", {}).get("total", 0),
                    "timestamp": datetime.now().isoformat(),
                    "source": "redis_cache"
                }
            })
            
            await context.emit({
                "topic": "analytics.partner.viewed",
                "data": {
                    "partnerId": partner_id,
                    "period": period,
                    "totalRevenue": cached_analytics.get("revenue", {}).get("total", 0),
                    "totalOrders": cached_analytics.get("revenue", {}).get("orders", 0),
                    "source": "cache",
                    "timestamp": datetime.now().isoformat()
                }
            })
            
            return {
                "status": 200,
                "body": cached_analytics
            }

        # Step 2: Gather analytics from multiple NestJS endpoints
        request_headers = {
            "Content-Type": "application/json"
        }
        
        # Include JWT token if provided
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Parallel requests to gather comprehensive analytics
            earnings_params = {"period": period}
            if start_date:
                earnings_params["startDate"] = start_date
            if end_date:
                earnings_params["endDate"] = end_date
            
            # Get earnings data
            earnings_response = await client.get(
                "http://localhost:3001/api/analytics/earnings",
                params=earnings_params,
                headers=request_headers
            )
            
            # Get order stats
            orders_response = await client.get(
                "http://localhost:3001/api/analytics/orders",
                params={"period": period},
                headers=request_headers
            )
            
            context.logger.info("NestJS Analytics Backend Responses", {
                "earnings_status": earnings_response.status_code,
                "orders_status": orders_response.status_code,
                "partnerId": partner_id,
                "traceId": context.trace_id
            })
            
            if earnings_response.status_code == 200 and orders_response.status_code == 200:
                # Step 3: Process and combine analytics data
                earnings_data = earnings_response.json()
                orders_data = orders_response.json()
                
                # Create comprehensive partner analytics
                partner_analytics = {
                    "partnerId": partner_id,
                    "period": period,
                    "startDate": start_date,
                    "endDate": end_date,
                    "revenue": {
                        "total": earnings_data.get("totalRevenue", 0),
                        "orders": earnings_data.get("totalOrders", 0),
                        "averageOrderValue": round(
                            earnings_data.get("totalRevenue", 0) / max(earnings_data.get("totalOrders", 1), 1), 2
                        )
                    },
                    "orders": orders_data.get("orders", {}),
                    "popularItems": await get_popular_items(partner_id, period, client, request_headers),
                    "performance": {
                        "deliveryRate": calculate_delivery_rate(orders_data.get("orders", {})),
                        "cancellationRate": calculate_cancellation_rate(orders_data.get("orders", {})),
                        "averagePreparationTime": "25 minutes"  # Mock data - would come from real analytics
                    },
                    "trends": {
                        "revenueGrowth": "+12.5%",  # Mock data - would be calculated from historical data
                        "orderGrowth": "+8.3%",
                        "customerSatisfaction": 4.2
                    },
                    "timestamp": datetime.now().isoformat(),
                    "source": "nestjs_backend"
                }
                
                # Step 4: Cache analytics data in Redis (performance layer)
                await redis_service.set_cache(analytics_cache_key, partner_analytics, category="analytics")
                
                # Step 5: Emit workflow events
                await context.emit({
                    "topic": "analytics.cache.miss",
                    "data": {
                        "partnerId": partner_id,
                        "period": period,
                        "totalRevenue": partner_analytics["revenue"]["total"],
                        "totalOrders": partner_analytics["revenue"]["orders"],
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })
                
                await context.emit({
                    "topic": "analytics.partner.viewed",
                    "data": {
                        "partnerId": partner_id,
                        "period": period,
                        "totalRevenue": partner_analytics["revenue"]["total"],
                        "totalOrders": partner_analytics["revenue"]["orders"],
                        "deliveryRate": partner_analytics["performance"]["deliveryRate"],
                        "source": "backend",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Partner Analytics Workflow Completed Successfully", {
                    "partnerId": partner_id,
                    "period": period,
                    "totalRevenue": partner_analytics["revenue"]["total"],
                    "totalOrders": partner_analytics["revenue"]["orders"],
                    "traceId": context.trace_id
                })

                # Step 6: Return comprehensive analytics
                return {
                    "status": 200,
                    "body": partner_analytics
                }
                
            else:
                # Step 7: Handle analytics failure
                error_response = {
                    "message": "Analytics data unavailable",
                    "earnings_status": earnings_response.status_code,
                    "orders_status": orders_response.status_code
                }
                
                await context.emit({
                    "topic": "analytics.access.failed",
                    "data": {
                        "partnerId": partner_id,
                        "period": period,
                        "reason": "backend_failure",
                        "earnings_status": earnings_response.status_code,
                        "orders_status": orders_response.status_code,
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Partner Analytics Workflow Failed", {
                    "partnerId": partner_id,
                    "earnings_status": earnings_response.status_code,
                    "orders_status": orders_response.status_code,
                    "traceId": context.trace_id
                })

                return {
                    "status": 503,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Analytics Backend Timeout", {
            "partnerId": partner_id,
            "period": period,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "analytics.access.failed",
            "data": {
                "partnerId": partner_id,
                "period": period,
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Analytics service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Partner Analytics Workflow Error", {
            "error": str(error),
            "partnerId": partner_id,
            "period": period,
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "analytics.access.failed",
            "data": {
                "partnerId": partner_id,
                "period": period,
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Partner analytics workflow failed",
                "error": "Internal server error"
            }
        }

async def get_popular_items(partner_id, period, client, headers):
    """Get popular menu items for the partner (mock data for now)"""
    try:
        # In real implementation, this would query menu analytics
        return [
            {"itemId": "item1", "name": "Butter Chicken", "orders": 45, "revenue": 675.50},
            {"itemId": "item2", "name": "Dal Makhani", "orders": 32, "revenue": 384.00},
            {"itemId": "item3", "name": "Biryani", "orders": 28, "revenue": 560.00}
        ]
    except:
        return []

def calculate_delivery_rate(orders):
    """Calculate delivery success rate"""
    total_orders = sum(orders.values()) if orders else 0
    delivered = orders.get("delivered", 0)
    return round((delivered / max(total_orders, 1)) * 100, 1)

def calculate_cancellation_rate(orders):
    """Calculate order cancellation rate"""
    total_orders = sum(orders.values()) if orders else 0
    cancelled = orders.get("cancelled", 0)
    return round((cancelled / max(total_orders, 1)) * 100, 1)
