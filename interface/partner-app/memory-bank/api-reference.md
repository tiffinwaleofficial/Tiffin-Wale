# Tiffin-Wale Partner App - API Reference

## Overview
This document provides a comprehensive reference for all backend API endpoints that the Partner App integrates with. The backend is built using NestJS and provides RESTful APIs with JWT authentication.

## Base Configuration
- **Base URL**: `http://localhost:3001/api` (development)
- **Production URL**: `https://api.tiffin-wale.com/api`
- **Authentication**: Bearer JWT tokens
- **Content-Type**: `application/json`
- **Timeout**: 15 seconds

## Authentication Endpoints

### POST /auth/login
**Purpose**: Partner login
**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "token": "string",
  "refreshToken": "string",
  "user": {
    "_id": "string",
    "email": "string",
    "role": "partner"
  },
  "partner": {
    "_id": "string",
    "businessName": "string",
    "isAcceptingOrders": boolean
  }
}
```

### POST /auth/register
**Purpose**: Partner registration
**Request Body**:
```json
{
  "email": "string",
  "password": "string",
  "businessName": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  }
}
```

### POST /auth/change-password
**Purpose**: Change partner password
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

## Partner Management Endpoints

### GET /partners/user/me
**Purpose**: Get current partner profile
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "_id": "string",
  "businessName": "string",
  "description": "string",
  "cuisine": ["string"],
  "location": {
    "address": "string",
    "coordinates": [number, number]
  },
  "menu": ["string"],
  "rating": number,
  "isActive": boolean,
  "isAcceptingOrders": boolean,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### PUT /partners/me
**Purpose**: Update partner profile
**Headers**: `Authorization: Bearer <token>`
**Request Body**: Partial partner profile object

### PUT /partners/status/me
**Purpose**: Update accepting orders status
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "isAcceptingOrders": boolean
}
```

### GET /partners/stats/me
**Purpose**: Get partner statistics
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
{
  "totalOrders": number,
  "completedOrders": number,
  "pendingOrders": number,
  "totalRevenue": number,
  "todayRevenue": number,
  "averageRating": number,
  "totalReviews": number
}
```

## Order Management Endpoints

### GET /partners/orders/me
**Purpose**: Get partner's orders with pagination
**Headers**: `Authorization: Bearer <token>`
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: string (optional filter)
**Response**:
```json
{
  "orders": [
    {
      "_id": "string",
      "customerId": "string",
      "partnerId": "string",
      "items": [
        {
          "menuItemId": "string",
          "name": "string",
          "price": number,
          "quantity": number
        }
      ],
      "status": "pending|confirmed|preparing|ready|delivered|cancelled",
      "totalAmount": number,
      "deliveryAddress": {
        "street": "string",
        "city": "string",
        "coordinates": [number, number]
      },
      "deliveryTime": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### GET /partners/orders/me/today
**Purpose**: Get today's orders for partner
**Headers**: `Authorization: Bearer <token>`
**Response**: Array of today's orders

### GET /orders/:id
**Purpose**: Get specific order details
**Headers**: `Authorization: Bearer <token>`
**Response**: Complete order object

### PATCH /orders/:id/status
**Purpose**: Update order status
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "status": "confirmed|preparing|ready|delivered|cancelled"
}
```

## Menu Management Endpoints

### GET /partners/menu/me
**Purpose**: Get partner's menu items
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": number,
    "category": "string",
    "image": "string",
    "isAvailable": boolean,
    "preparationTime": number,
    "ingredients": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### POST /menu
**Purpose**: Create new menu item
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "category": "string",
  "image": "string",
  "isAvailable": boolean,
  "preparationTime": number,
  "ingredients": ["string"]
}
```

### PATCH /menu/:id
**Purpose**: Update menu item
**Headers**: `Authorization: Bearer <token>`
**Request Body**: Partial menu item object

### DELETE /menu/:id
**Purpose**: Delete menu item
**Headers**: `Authorization: Bearer <token>`

### GET /menu/categories
**Purpose**: Get all menu categories
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "isActive": boolean
  }
]
```

### POST /menu/categories
**Purpose**: Create new menu category
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "name": "string",
  "description": "string"
}
```

## Meal Management Endpoints

### GET /meals/partner/me
**Purpose**: Get partner's meals
**Headers**: `Authorization: Bearer <token>`
**Query Parameters**:
- `date`: string (optional, format: YYYY-MM-DD)
**Response**: Array of meal objects

### POST /meals
**Purpose**: Create new meal
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "menuItemId": "string",
  "date": "string",
  "availableQuantity": number,
  "preparationTime": "string"
}
```

### PATCH /meals/:id/status
**Purpose**: Update meal status
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "status": "available|preparing|ready|sold_out"
}
```

## Analytics Endpoints

### GET /analytics/earnings
**Purpose**: Get earnings analytics
**Headers**: `Authorization: Bearer <token>`
**Query Parameters**:
- `period`: "today|week|month|custom"
- `startDate`: string (for custom period)
- `endDate`: string (for custom period)
**Response**:
```json
{
  "totalEarnings": number,
  "periodEarnings": number,
  "orderCount": number,
  "averageOrderValue": number,
  "growth": {
    "percentage": number,
    "trend": "up|down|stable"
  }
}
```

### GET /analytics/orders
**Purpose**: Get order analytics
**Headers**: `Authorization: Bearer <token>`
**Query Parameters**:
- `period`: string
**Response**:
```json
{
  "totalOrders": number,
  "completedOrders": number,
  "cancelledOrders": number,
  "averageCompletionTime": number,
  "statusBreakdown": {
    "pending": number,
    "confirmed": number,
    "preparing": number,
    "ready": number,
    "delivered": number
  }
}
```

### GET /analytics/revenue-history
**Purpose**: Get revenue history
**Headers**: `Authorization: Bearer <token>`
**Query Parameters**:
- `months`: number (default: 6)
**Response**:
```json
{
  "monthlyData": [
    {
      "month": "string",
      "revenue": number,
      "orders": number
    }
  ]
}
```

## Review Management Endpoints

### GET /partners/me/reviews
**Purpose**: Get partner's reviews
**Headers**: `Authorization: Bearer <token>`
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
**Response**:
```json
{
  "reviews": [
    {
      "_id": "string",
      "customerId": "string",
      "partnerId": "string",
      "orderId": "string",
      "rating": number,
      "comment": "string",
      "createdAt": "string"
    }
  ],
  "total": number,
  "averageRating": number
}
```

## Notification Endpoints

### GET /notifications/partner/me
**Purpose**: Get partner's notifications
**Headers**: `Authorization: Bearer <token>`
**Response**:
```json
[
  {
    "_id": "string",
    "title": "string",
    "message": "string",
    "type": "order|payment|review|system",
    "isRead": boolean,
    "createdAt": "string"
  }
]
```

### PATCH /notifications/:id/read
**Purpose**: Mark notification as read
**Headers**: `Authorization: Bearer <token>`

### PATCH /notifications/partner/me/read-all
**Purpose**: Mark all notifications as read
**Headers**: `Authorization: Bearer <token>`

## File Upload Endpoints

### POST /upload/image
**Purpose**: Upload image (profile, menu, banner)
**Headers**: `Authorization: Bearer <token>`
**Content-Type**: `multipart/form-data`
**Request Body**:
- `file`: File
- `type`: "profile|menu|banner"
**Response**:
```json
{
  "url": "string",
  "public_id": "string"
}
```

### DELETE /upload/image/:publicId
**Purpose**: Delete uploaded image
**Headers**: `Authorization: Bearer <token>`

## Support Endpoints

### POST /support/tickets
**Purpose**: Create support ticket
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "subject": "string",
  "message": "string",
  "category": "technical|billing|general"
}
```

### GET /support/tickets/me
**Purpose**: Get partner's support tickets
**Headers**: `Authorization: Bearer <token>`
**Response**: Array of support ticket objects

## Chat Endpoints

### POST /chat/conversations
**Purpose**: Create conversation with customer
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "customerId": "string",
  "orderId": "string"
}
```

### GET /chat/conversations
**Purpose**: Get partner's conversations
**Headers**: `Authorization: Bearer <token>`
**Response**: Array of conversation objects

### POST /chat/messages
**Purpose**: Send message
**Headers**: `Authorization: Bearer <token>`
**Request Body**:
```json
{
  "conversationId": "string",
  "message": "string"
}
```

### GET /chat/conversations/:id/messages
**Purpose**: Get conversation messages
**Headers**: `Authorization: Bearer <token>`
**Response**: Array of message objects

## Error Handling

### Standard Error Response
```json
{
  "statusCode": number,
  "message": "string",
  "error": "string",
  "timestamp": "string",
  "path": "string"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Authentication Flow

### Token Management
1. **Login**: Receive access token and refresh token
2. **API Requests**: Include `Authorization: Bearer <token>` header
3. **Token Expiry**: Handle 401 responses and refresh tokens
4. **Logout**: Clear tokens and redirect to login

### Token Refresh (Planned)
```typescript
// POST /auth/refresh-token
{
  "refreshToken": "string"
}
```

## Rate Limiting
- **General APIs**: 100 requests per minute
- **Authentication**: 5 requests per minute
- **File Upload**: 10 requests per minute

## WebSocket Events (Real-time)

### Order Events
- `order:new` - New order received
- `order:status-updated` - Order status changed
- `order:cancelled` - Order cancelled

### Chat Events
- `chat:message` - New message received
- `chat:typing` - User typing indicator

### Notification Events
- `notification:new` - New notification received

## API Client Implementation

### Axios Configuration
```typescript
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
```

### Request Interceptor
```typescript
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('partner_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiry
      await AsyncStorage.removeItem('partner_auth_token');
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

## Testing Endpoints

### Development Environment
- **Base URL**: `http://localhost:3001/api`
- **Swagger UI**: `http://localhost:3001/api-docs`
- **Test Data**: Available via seeder endpoints

### Production Environment
- **Base URL**: `https://api.tiffin-wale.com/api`
- **Swagger UI**: `https://api.tiffin-wale.com/api-docs`
- **SSL**: Required for all requests

---

*This API reference is maintained alongside the backend development. For the most up-to-date information, refer to the Swagger documentation at `/api-docs`.*




