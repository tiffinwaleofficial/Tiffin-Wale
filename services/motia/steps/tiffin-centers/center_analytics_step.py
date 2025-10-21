from datetime import datetime
import httpx

# Using Motia's built-in state management - no external Redis imports needed

config = {
    "type": "api",
    "name": "GetCenterAnalytics",
    "description": "TiffinWale get tiffin center analytics workflow - connects to NestJS backend with Redis caching",
    "flows": ["tiffinwale-tiffin-centers"],
    "method": "GET",
    "path": "/partners/{partnerId}/analytics",
    "queryParams": [
        {"name": "period", "description": "Time period for analytics (today, week, month, year)"},
        {"name": "startDate", "description": "Start date for custom date range (YYYY-MM-DD format)"},
        {"name": "endDate", "description": "End date for custom date range (YYYY-MM-DD format)"}
    ],
    "responseSchema": {
        200: {
            "type": "object",
            "properties": {
                "partnerId": {"type": "string"},
                "period": {"type": "string"},
                "orderMetrics": {
                    "type": "object",
                    "properties": {
                        "totalOrders": {"type": "number"},
                        "completedOrders": {"type": "number"},
                        "cancelledOrders": {"type": "number"},
                        "averageOrderValue": {"type": "number"}
                    }
                },
                "revenueMetrics": {
                    "type": "object",
                    "properties": {
                        "totalRevenue": {"type": "number"},
                        "netRevenue": {"type": "number"},
                        "commissionPaid": {"type": "number"}
                    }
                },
                "performanceMetrics": {
                    "type": "object",
                    "properties": {
                        "averageRating": {"type": "number"},
                        "totalReviews": {"type": "number"},
                        "averageDeliveryTime": {"type": "number"}
                    }
                }
            }
        },
        404: {
            "type": "object",
            "properties": {
                "statusCode": {"type": "number"},
                "message": {"type": "string"},
                "error": {"type": "string"}
            }
        }
    },
    "emits": [
        "analytics.partner.accessed",
        "partner.performance.tracked"
    ]
}

async def handler(req, context):
    """
    Motia Get Tiffin Center Analytics Workflow - Connects to NestJS Backend
    """
    try:
        path_params = req.get("pathParams", {})
        query_params = req.get("queryParams", {})
        headers = req.get("headers", {})
        
        partner_id = path_params.get("partnerId")
        period = query_params.get("period", "month")
        start_date = query_params.get("startDate")
        end_date = query_params.get("endDate")
        auth_token = headers.get("authorization", "").replace("Bearer ", "")
        
        context.logger.info("Motia Get Center Analytics Workflow Started", {
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

        # Build cache key based on parameters
        cache_key_parts = [f"partner:analytics:{partner_id}", period]
        if start_date:
            cache_key_parts.append(f"start:{start_date}")
        if end_date:
            cache_key_parts.append(f"end:{end_date}")
        
        analytics_cache_key = ":".join(cache_key_parts)
        
        # Try to get from cache first
        cached_analytics = await context.state.get("analytics_cache", analytics_cache_key)
        
        if cached_analytics:
            context.logger.info("Partner Analytics Cache Hit", {
                "partnerId": partner_id,
                "period": period,
                "traceId": context.trace_id
            })
            
            # Emit analytics event for cache hit
            await context.emit({
                "topic": "analytics.partner.accessed",
                "data": {
                    "partnerId": partner_id,
                    "period": period,
                    "source": "cache",
                    "timestamp": datetime.now().isoformat()
                }
            })
            
            return {
                "status": 200,
                "body": cached_analytics
            }

        # Cache miss - Forward request to NestJS backend (using partner stats endpoint)
        nestjs_stats_url = f"http://localhost:3001/api/partners/{partner_id}/stats"
        
        # Build query parameters
        params = {"period": period}
        if start_date:
            params["startDate"] = start_date
        if end_date:
            params["endDate"] = end_date
        
        request_headers = {}
        if auth_token:
            request_headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(nestjs_stats_url, params=params, headers=request_headers)
            
            context.logger.info("NestJS Get Partner Stats Backend Response", {
                "status_code": response.status_code,
                "partnerId": partner_id,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                analytics_data = response.json()
                
                # Cache the analytics data
                await context.state.set("analytics_cache", analytics_cache_key, analytics_data)
                
                # Emit workflow events
                await context.emit({
                    "topic": "analytics.partner.accessed",
                    "data": {
                        "partnerId": partner_id,
                        "period": period,
                        "source": "nestjs_backend",
                        "timestamp": datetime.now().isoformat()
                    }
                })

                await context.emit({
                    "topic": "partner.performance.tracked",
                    "data": {
                        "partnerId": partner_id,
                        "period": period,
                        "orderMetrics": analytics_data.get("orderMetrics", {}),
                        "revenueMetrics": analytics_data.get("revenueMetrics", {}),
                        "performanceMetrics": analytics_data.get("performanceMetrics", {}),
                        "timestamp": datetime.now().isoformat()
                    }
                })

                context.logger.info("Motia Get Center Analytics Workflow Completed Successfully", {
                    "partnerId": partner_id,
                    "period": period,
                    "totalOrders": analytics_data.get("orderMetrics", {}).get("totalOrders", 0),
                    "traceId": context.trace_id
                })

                return {
                    "status": 200,
                    "body": analytics_data
                }
                
            elif response.status_code == 404:
                error_response = response.json() if response.content else {"message": "Partner not found"}
                
                context.logger.info("Partner Analytics Not Found", {
                    "partnerId": partner_id,
                    "traceId": context.trace_id
                })

                return {
                    "status": 404,
                    "body": error_response
                }
            else:
                error_response = response.json() if response.content else {"message": "Failed to get analytics"}
                
                context.logger.error("NestJS Get Partner Stats Backend Error", {
                    "partnerId": partner_id,
                    "status_code": response.status_code,
                    "error": error_response.get("message"),
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Get Partner Stats Backend Timeout", {
            "partnerId": partner_id,
            "traceId": context.trace_id
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
        context.logger.error("Motia Get Center Analytics Workflow Error", {
            "error": str(error),
            "partnerId": partner_id,
            "traceId": context.trace_id
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Get center analytics workflow failed",
                "error": "Internal server error"
            }
        }