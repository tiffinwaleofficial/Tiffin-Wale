# 📊 Vercel Analytics Setup for TiffinWale Backend

## ✅ What's Been Implemented

### 1. **Server-Side Analytics Integration**
- Added `@vercel/analytics/server` integration to both `main.ts` and `api/index.ts`
- Analytics automatically initialize in production environment
- Graceful error handling if analytics fail to load

### 2. **Custom Analytics Middleware**
- Created `AnalyticsMiddleware` to track API endpoint usage
- Tracks the following metrics for each API request:
  - Endpoint path
  - HTTP method
  - Response status code
  - Request duration (ms)
  - User agent
  - Timestamp

### 3. **Production-Only Tracking**
- Analytics only activate when `NODE_ENV=production`
- No performance impact on development environment
- Silent failure mode - won't break API if analytics fail

## 🔧 Configuration Files Updated

### `src/main.ts`
```typescript
import { inject } from "@vercel/analytics/server";

// Initialize Vercel Analytics for production
if (process.env.NODE_ENV === "production") {
  try {
    inject();
    logger.log("Vercel Analytics initialized");
  } catch (error) {
    logger.warn("Failed to initialize Vercel Analytics:", error.message);
  }
}
```

### `api/index.ts` (Vercel Serverless)
```typescript
import { inject } from "@vercel/analytics/server";

// Initialize Vercel Analytics for production
try {
  inject();
  logger.log('Vercel Analytics initialized');
} catch (error) {
  logger.warn('Failed to initialize Vercel Analytics:', error.message);
}
```

### `src/common/middleware/analytics.middleware.ts`
- Custom middleware for detailed API tracking
- Tracks request duration, status codes, and endpoints
- Uses `track()` function from Vercel Analytics

### `src/app.module.ts`
```typescript
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply analytics middleware to all API routes
    consumer
      .apply(AnalyticsMiddleware)
      .forRoutes('*');
  }
}
```

### `vercel.json`
```json
{
  "env": {
    "NODE_ENV": "production",
    "VERCEL_ANALYTICS_ID": "@vercel_analytics_id"
  }
}
```

## 📈 Analytics Data Collected

### **Automatic Vercel Analytics**
- Page views (for API documentation)
- User sessions
- Geographic data
- Performance metrics

### **Custom API Analytics**
- API endpoint usage patterns
- Response times per endpoint
- Error rates by endpoint
- User agent distribution
- Request volume over time

## 🚀 Deployment Instructions

### 1. **Environment Variables**
Set up in Vercel Dashboard:
```bash
NODE_ENV=production
VERCEL_ANALYTICS_ID=your_analytics_id_here
```

### 2. **Deploy Backend**
```bash
cd monolith_backend
vercel --prod
```

### 3. **Verify Analytics**
- Check Vercel Dashboard for analytics data
- Monitor API logs for "Vercel Analytics initialized" message
- View custom event tracking in Vercel Analytics

## 📊 Viewing Analytics Data

### **Vercel Dashboard**
1. Go to your Vercel project dashboard
2. Click on "Analytics" tab
3. View real-time and historical data

### **Custom Events**
- Look for `api_request` events in the analytics dashboard
- Filter by endpoint, method, or status code
- Monitor API performance and usage patterns

## 🔍 Monitoring & Debugging

### **Log Messages**
- ✅ `"Vercel Analytics initialized"` - Success
- ⚠️ `"Failed to initialize Vercel Analytics"` - Check configuration
- 📊 Custom tracking events logged to console in development

### **Health Check**
- Visit your API root endpoint: `https://your-api.vercel.app/`
- Should return status with analytics confirmation

## 🎯 Benefits

1. **Performance Monitoring**: Track API response times
2. **Usage Analytics**: Understand which endpoints are most used
3. **Error Tracking**: Monitor API error rates
4. **Geographic Insights**: See where requests come from
5. **User Behavior**: Understand API usage patterns

## 🔧 Troubleshooting

### Common Issues:
1. **Analytics not showing**: Check `NODE_ENV=production`
2. **Custom events missing**: Verify middleware is applied
3. **Performance impact**: Analytics run asynchronously, minimal impact

### Debug Commands:
```bash
# Check environment
echo $NODE_ENV

# View logs
vercel logs your-deployment-url

# Test API
curl https://your-api.vercel.app/api/health
```

Your backend now has comprehensive analytics tracking for both system performance and API usage patterns! 📊
