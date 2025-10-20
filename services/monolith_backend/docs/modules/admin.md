# Admin Module Documentation

## Overview
The Admin module provides system administrators with comprehensive dashboard functionalities, analytics, and system management capabilities in the TiffinMate platform. It enables monitoring of platform performance, user management, and system configuration.

## Features
- System-wide statistics and analytics
- User growth and activity monitoring
- Order and revenue performance tracking
- Partner performance evaluation
- System settings management

## API Endpoints

### 1. Get system statistics
- **Endpoint**: `GET /api/admin/stats`
- **Description**: Retrieves comprehensive system-wide statistics
- **Access Control**: Restricted to ADMIN and SUPER_ADMIN roles only
- **Query Parameters**: None
- **Response**: Object containing various system statistics
- **Status Codes**:
  - 200: Statistics successfully returned
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions

### 2. Get user statistics
- **Endpoint**: `GET /api/admin/users/stats`
- **Description**: Retrieves detailed user growth and activity metrics
- **Access Control**: Restricted to ADMIN and SUPER_ADMIN roles only
- **Query Parameters**: None
- **Response**: Object containing user-related statistics
- **Status Codes**:
  - 200: User statistics successfully returned
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions

### 3. Get order statistics
- **Endpoint**: `GET /api/admin/orders/stats`
- **Description**: Retrieves comprehensive order metrics and performance data
- **Access Control**: Restricted to ADMIN and SUPER_ADMIN roles only
- **Query Parameters**: None
- **Response**: Object containing order-related statistics
- **Status Codes**:
  - 200: Order statistics successfully returned
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions

### 4. Get partner statistics
- **Endpoint**: `GET /api/admin/partners/stats`
- **Description**: Retrieves business partner performance metrics
- **Access Control**: Restricted to ADMIN and SUPER_ADMIN roles only
- **Query Parameters**: None
- **Response**: Object containing partner-related statistics
- **Status Codes**:
  - 200: Partner statistics successfully returned
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions

### 5. Get revenue reports
- **Endpoint**: `GET /api/admin/revenue`
- **Description**: Retrieves detailed revenue analytics and financial data
- **Access Control**: Restricted to ADMIN and SUPER_ADMIN roles only
- **Query Parameters**:
  - period: Time period for revenue analysis (optional, default: 'month')
  - startDate: Start date for custom period (optional)
  - endDate: End date for custom period (optional)
- **Response**: Object containing revenue statistics and trends
- **Status Codes**:
  - 200: Revenue data successfully returned
  - 400: Bad request - invalid date range
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions

### 6. Update system settings
- **Endpoint**: `POST /api/admin/settings`
- **Description**: Updates system-wide configuration settings
- **Access Control**: Restricted to ADMIN and SUPER_ADMIN roles only
- **Request Body**: Object containing settings to update
- **Response**: Object with the updated settings
- **Status Codes**:
  - 200: Settings successfully updated
  - 400: Bad request - invalid settings format
  - 401: Unauthorized - missing or invalid token
  - 403: Forbidden - insufficient permissions

## Data Models

### System Statistics Response
```typescript
interface SystemStatsResponse {
  totalUsers: number;          // Total registered users
  activeUsers: number;         // Active users in last 30 days
  totalOrders: number;         // Total orders placed
  pendingOrders: number;       // Orders awaiting processing
  totalRevenue: number;        // Total platform revenue
  totalPartners: number;       // Total registered partners
  activePartners: number;      // Active partners in last 30 days
  totalMenuItems: number;      // Total menu items across all partners
  recentActivity: Activity[];  // Recent platform activity
  userGrowth: GrowthMetric[];  // User growth over time
  orderGrowth: GrowthMetric[]; // Order growth over time
  revenueGrowth: GrowthMetric[]; // Revenue growth over time
}
```

### User Statistics Response
```typescript
interface UserStatsResponse {
  totalUsers: number;          // Total registered users
  activeUsers: number;         // Active users in last 30 days
  usersByRole: {               // User count by role
    [role: string]: number;
  };
  userGrowth: {                // User growth by time period
    daily: GrowthMetric[];
    weekly: GrowthMetric[];
    monthly: GrowthMetric[];
  };
  retention: {                 // User retention metrics
    day7: number;              // 7-day retention rate
    day30: number;             // 30-day retention rate
    day90: number;             // 90-day retention rate
  };
  topUsers: {                  // Top users by order volume
    id: string;
    name: string;
    email: string;
    orderCount: number;
    totalSpent: number;
  }[];
}
```

### Order Statistics Response
```typescript
interface OrderStatsResponse {
  totalOrders: number;         // Total orders placed
  totalRevenue: number;        // Total revenue from orders
  averageOrderValue: number;   // Average order value
  ordersByStatus: {            // Order count by status
    [status: string]: number;
  };
  orderGrowth: {               // Order growth by time period
    daily: GrowthMetric[];
    weekly: GrowthMetric[];
    monthly: GrowthMetric[];
  };
  peakHours: {                 // Peak ordering hours
    hour: number;
    count: number;
  }[];
  topSellingItems: {           // Top selling menu items
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
}
```

### Partner Statistics Response
```typescript
interface PartnerStatsResponse {
  totalPartners: number;       // Total registered partners
  activePartners: number;      // Active partners in last 30 days
  partnersByStatus: {          // Partner count by status
    [status: string]: number;
  };
  topPartners: {               // Top performing partners
    id: string;
    businessName: string;
    orderCount: number;
    revenue: number;
    averageRating: number;
  }[];
  partnerGrowth: {             // Partner growth by time period
    daily: GrowthMetric[];
    weekly: GrowthMetric[];
    monthly: GrowthMetric[];
  };
  cuisineBreakdown: {          // Orders by cuisine type
    cuisineType: string;
    orderCount: number;
    percentage: number;
  }[];
}
```

### Revenue Response
```typescript
interface RevenueResponse {
  totalRevenue: number;        // Total platform revenue
  periodRevenue: number;       // Revenue for selected period
  previousPeriodRevenue: number; // Revenue for previous period
  growth: number;              // Growth percentage
  averageOrderValue: number;   // Average order value
  revenueByPartner: {          // Revenue breakdown by partner
    partnerId: string;
    businessName: string;
    revenue: number;
    percentage: number;
  }[];
  revenueByDay: {              // Daily revenue breakdown
    date: string;
    revenue: number;
    orderCount: number;
  }[];
  projectedRevenue: number;    // Projected revenue for next period
}
```

### System Settings Request
```typescript
interface SystemSettingsRequest {
  commissionRate?: number;     // Partner commission rate
  deliveryFee?: number;        // Base delivery fee
  serviceFee?: number;         // Service fee percentage
  taxRate?: number;            // Tax rate
  minimumOrderAmount?: number; // Minimum order amount
  maintenanceMode?: boolean;   // System maintenance mode
  featureFlags?: {             // Feature flag toggles
    [featureName: string]: boolean;
  };
}
```

## Role-Based Access Control
- All admin module endpoints are restricted to users with ADMIN or SUPER_ADMIN roles
- SUPER_ADMIN has additional capabilities for system-critical settings
- Regular users and partners cannot access any admin endpoints

## Usage Examples

### Retrieving System Statistics
Admins can access the system dashboard statistics to get a comprehensive overview of the platform's performance:

```
GET /api/admin/stats
Authorization: Bearer {jwt_token}
```

### Updating System Settings
Admins can modify system-wide configuration settings:

```
POST /api/admin/settings
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "commissionRate": 15,
  "deliveryFee": 5.99,
  "serviceFee": 7.5,
  "minimumOrderAmount": 15,
  "maintenanceMode": false
}
```

## Implementation Details
- All statistics endpoints use aggregation pipelines for efficient data processing
- Caching is implemented for frequently accessed statistics to reduce database load
- Data is refreshed periodically to ensure near real-time reporting
- Date-based metrics support various time periods (daily, weekly, monthly, custom) 