# TiffinMate Monolith Backend - API Reference

## 🚀 API Overview

The TiffinMate API is a comprehensive RESTful API built with NestJS that powers a food delivery platform. It provides endpoints for authentication, order management, subscription handling, payment processing, and more.

### **Base URL**
- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/api`

### **Authentication**
All protected endpoints require JWT authentication via Bearer token:
```
Authorization: Bearer <jwt_token>
```

### **Response Format**
All API responses follow a consistent format:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2025-01-10T10:30:00.000Z"
}
```

### **Error Format**
Error responses include detailed information:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "errors": ["email must be a valid email address"]
    }
  ],
  "timestamp": "2025-01-10T10:30:00.000Z"
}
```

## 🔐 Authentication Endpoints

### **POST /auth/register**
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### **POST /auth/login**
Authenticate user and get access tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### **POST /auth/refresh-token**
Refresh expired access token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### **POST /auth/logout**
Logout user and invalidate tokens.

**Headers:** `Authorization: Bearer <token>`

### **POST /auth/change-password**
Change user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

### **POST /auth/forgot-password**
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### **POST /auth/reset-password**
Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "NewPassword123"
}
```

## 👤 User Management Endpoints

### **GET /users**
Get all users (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

### **GET /users/:id**
Get user by ID.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /users/:id**
Update user information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Updated Name",
  "lastName": "Updated Last Name",
  "phoneNumber": "+1234567890"
}
```

### **DELETE /users/:id**
Delete user account.

**Headers:** `Authorization: Bearer <token>`

## 🍽️ Menu Management Endpoints

### **GET /menu/categories**
Get all menu categories.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "category_id",
      "name": "Main Course",
      "description": "Main course items",
      "isActive": true
    }
  ]
}
```

### **POST /menu/categories**
Create a new menu category.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Desserts",
  "description": "Sweet treats and desserts"
}
```

### **GET /menu/categories/:id**
Get category by ID.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /menu/categories/:id**
Update menu category.

**Headers:** `Authorization: Bearer <token>`

### **DELETE /menu/categories/:id**
Delete menu category.

**Headers:** `Authorization: Bearer <token>`

### **GET /menu**
Get all menu items.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "item_id",
      "name": "Chicken Biryani",
      "description": "Spicy rice dish with chicken",
      "price": 250,
      "category": "Main Course",
      "partnerId": "partner_id",
      "isAvailable": true,
      "imageUrl": "https://example.com/image.jpg"
    }
  ]
}
```

### **POST /menu**
Create a new menu item.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Vegetable Curry",
  "description": "Mixed vegetable curry",
  "price": 180,
  "categoryId": "category_id",
  "partnerId": "partner_id",
  "imageUrl": "https://example.com/image.jpg"
}
```

### **GET /menu/:id**
Get menu item by ID.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /menu/:id**
Update menu item.

**Headers:** `Authorization: Bearer <token>`

### **DELETE /menu/:id**
Delete menu item.

**Headers:** `Authorization: Bearer <token>`

### **GET /menu/partner/:partnerId**
Get menu items by partner.

**Headers:** `Authorization: Bearer <token>`

## 🛒 Order Management Endpoints

### **POST /orders**
Create a new order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "restaurantId": "restaurant_id",
  "items": [
    {
      "menuItemId": "item_id",
      "quantity": 2,
      "customizations": ["Extra spicy", "No onions"]
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "specialInstructions": "Please deliver after 7 PM"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "_id": "order_id",
    "userId": "user_id",
    "restaurantId": "restaurant_id",
    "items": [...],
    "totalAmount": 500,
    "status": "pending",
    "createdAt": "2025-01-10T10:30:00.000Z"
  }
}
```

### **GET /orders**
Get all orders (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

### **GET /orders/:id**
Get order by ID.

**Headers:** `Authorization: Bearer <token>`

### **GET /orders/me**
Get orders for current user.

**Headers:** `Authorization: Bearer <token>`

### **GET /orders/customer/:customerId**
Get orders by customer.

**Headers:** `Authorization: Bearer <token>`

### **GET /orders/partner/:partnerId**
Get orders by business partner.

**Headers:** `Authorization: Bearer <token>`

### **GET /orders/status/:status**
Get orders by status (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

### **PATCH /orders/:id**
Update order details.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /orders/:id/status**
Update order status.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Order confirmed by restaurant"
}
```

### **PATCH /orders/:id/paid**
Mark order as paid.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "paymentMethod": "razorpay",
  "transactionId": "txn_123456789"
}
```

### **PATCH /orders/:id/review**
Add review to order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent food quality and delivery"
}
```

### **DELETE /orders/:id**
Delete order.

**Headers:** `Authorization: Bearer <token>`

## 💳 Payment Management Endpoints

### **POST /payment/methods**
Create a new payment method.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "customerId": "customer_id",
  "type": "card",
  "cardDetails": {
    "cardNumber": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2025",
    "cvv": "123"
  },
  "isDefault": true
}
```

### **GET /payment/methods/customer/:customerId**
Get payment methods for customer.

**Headers:** `Authorization: Bearer <token>`

### **GET /payment/methods/:id**
Get payment method by ID.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /payment/methods/:id**
Update payment method.

**Headers:** `Authorization: Bearer <token>`

### **DELETE /payment/methods/:id**
Delete payment method.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /payment/methods/:id/set-default**
Set payment method as default.

**Headers:** `Authorization: Bearer <token>`

## 📋 Subscription Management Endpoints

### **POST /subscriptions**
Create a new subscription.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "customerId": "customer_id",
  "planId": "plan_id",
  "restaurantId": "restaurant_id",
  "startDate": "2025-01-15",
  "endDate": "2025-02-15",
  "deliverySchedule": {
    "days": ["monday", "wednesday", "friday"],
    "time": "19:00"
  }
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Subscription created successfully",
  "data": {
    "_id": "subscription_id",
    "customerId": "customer_id",
    "planId": "plan_id",
    "status": "active",
    "startDate": "2025-01-15",
    "endDate": "2025-02-15"
  }
}
```

### **GET /subscriptions**
Get all subscriptions.

**Headers:** `Authorization: Bearer <token>`

### **GET /subscriptions/:id**
Get subscription by ID.

**Headers:** `Authorization: Bearer <token>`

### **GET /subscriptions/customer/:customerId**
Get subscriptions for customer.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /subscriptions/:id**
Update subscription.

**Headers:** `Authorization: Bearer <token>`

### **DELETE /subscriptions/:id**
Delete subscription.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /subscriptions/:id/cancel**
Cancel subscription.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `reason`: Cancellation reason

### **PATCH /subscriptions/:id/pause**
Pause subscription.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /subscriptions/:id/resume**
Resume paused subscription.

**Headers:** `Authorization: Bearer <token>`

## 🍽️ Meal Management Endpoints

### **GET /meals**
Get all meals.

**Headers:** `Authorization: Bearer <token>`

### **POST /meals**
Create a new meal.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Lunch Special",
  "description": "Daily lunch special",
  "items": ["item_id_1", "item_id_2"],
  "price": 200,
  "partnerId": "partner_id",
  "availableDate": "2025-01-15"
}
```

### **GET /meals/:id**
Get meal by ID.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /meals/:id**
Update meal.

**Headers:** `Authorization: Bearer <token>`

### **DELETE /meals/:id**
Delete meal.

**Headers:** `Authorization: Bearer <token>`

## 👥 Customer Management Endpoints

### **GET /customers**
Get all customers.

**Headers:** `Authorization: Bearer <admin_token>`

### **GET /customers/:id**
Get customer by ID.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /customers/:id**
Update customer information.

**Headers:** `Authorization: Bearer <token>`

### **POST /customers/:id/delivery-addresses**
Add delivery address.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "street": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "landmark": "Near Metro Station",
  "isDefault": true
}
```

### **PATCH /customers/:id/delivery-addresses/:addressId**
Update delivery address.

**Headers:** `Authorization: Bearer <token>`

### **DELETE /customers/:id/delivery-addresses/:addressId**
Delete delivery address.

**Headers:** `Authorization: Bearer <token>`

## 🏢 Partner Management Endpoints

### **GET /partners**
Get all business partners.

**Headers:** `Authorization: Bearer <admin_token>`

### **POST /partners**
Create new business partner.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Spice Kitchen",
  "email": "contact@spicekitchen.com",
  "phoneNumber": "+1234567890",
  "address": {
    "street": "456 Food Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400002"
  },
  "cuisineType": "Indian",
  "isActive": true
}
```

### **GET /partners/:id**
Get partner by ID.

**Headers:** `Authorization: Bearer <token>`

### **PATCH /partners/:id**
Update partner information.

**Headers:** `Authorization: Bearer <token>`

### **DELETE /partners/:id**
Delete partner.

**Headers:** `Authorization: Bearer <admin_token>`

## 🔔 Notification Endpoints

### **GET /notifications**
Get notifications for current user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "notification_id",
      "title": "Order Confirmed",
      "message": "Your order #12345 has been confirmed",
      "type": "order_update",
      "isRead": false,
      "createdAt": "2025-01-10T10:30:00.000Z"
    }
  ]
}
```

### **POST /notifications**
Create notification (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "userId": "user_id",
  "title": "Special Offer",
  "message": "Get 20% off on your next order",
  "type": "promotion"
}
```

### **PATCH /notifications/:id/read**
Mark notification as read.

**Headers:** `Authorization: Bearer <token>`

### **DELETE /notifications/:id**
Delete notification.

**Headers:** `Authorization: Bearer <token>`

## 📊 Analytics Endpoints

### **GET /analytics/earnings**
Get earnings analytics.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `period`: Time period (today, week, month, year)
- `startDate`: Start date (optional)
- `endDate`: End date (optional)

### **GET /analytics/orders**
Get order analytics.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `period`: Time period (today, week, month, year)

### **GET /analytics/revenue-history**
Get revenue history data.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `months`: Number of months (default: 6)

## 🏢 Corporate Endpoints

### **POST /corporate/quote**
Submit corporate quote request.

**Request Body:**
```json
{
  "companyName": "Tech Corp",
  "contactPerson": "John Doe",
  "email": "john@techcorp.com",
  "phoneNumber": "+1234567890",
  "employeeCount": 100,
  "requirements": "Daily lunch for 100 employees",
  "budget": 50000
}
```

### **GET /corporate/quotes**
Get corporate quote requests (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status
- `search`: Search term
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort order (default: desc)

## 🎯 Landing Page Endpoints

### **GET /landing/stats**
Get landing page statistics.

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "totalUsers": 1000,
    "totalOrders": 5000,
    "totalPartners": 50,
    "averageRating": 4.5
  }
}
```

### **GET /landing/testimonials**
Get customer testimonials.

### **POST /landing/contact**
Submit contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "message": "I would like to know more about your services"
}
```

## 📝 Feedback Endpoints

### **POST /feedback**
Submit feedback.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "orderId": "order_id",
  "rating": 5,
  "comment": "Excellent service and food quality",
  "category": "food_quality"
}
```

### **GET /feedback**
Get feedback (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

### **GET /feedback/order/:orderId**
Get feedback for specific order.

**Headers:** `Authorization: Bearer <token>`

## 🎫 Support Endpoints

### **POST /support/ticket**
Create support ticket.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "subject": "Order Issue",
  "message": "My order was delivered late",
  "category": "delivery"
}
```

### **GET /support/tickets**
Get user's support tickets.

**Headers:** `Authorization: Bearer <token>`

## 📤 Upload Endpoints

### **POST /upload/image**
Upload image file.

**Headers:** `Authorization: Bearer <token>`

**Request:** Multipart form data with image file

**Response:**
```json
{
  "statusCode": 200,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://example.com/uploads/image.jpg",
    "filename": "image.jpg",
    "size": 1024000
  }
}
```

## 🔧 System Endpoints

### **GET /ping**
Health check endpoint.

**Response:**
```json
{
  "statusCode": 200,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2025-01-10T10:30:00.000Z",
    "uptime": 3600
  }
}
```

### **GET /version**
Get application version information.

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "version": "1.0.0",
    "buildDate": "2025-01-10T10:30:00.000Z",
    "environment": "production"
  }
}
```

## 🛡️ Admin Endpoints

### **GET /admin/stats**
Get system statistics (Super Admin only).

**Headers:** `Authorization: Bearer <super_admin_token>`

### **GET /admin/users**
Get user statistics.

**Headers:** `Authorization: Bearer <admin_token>`

### **GET /admin/orders**
Get order statistics.

**Headers:** `Authorization: Bearer <admin_token>`

### **GET /admin/revenue**
Get revenue statistics.

**Headers:** `Authorization: Bearer <admin_token>`

### **GET /admin/partners**
Get partner statistics.

**Headers:** `Authorization: Bearer <admin_token>`

## 📋 Seeder Endpoints

### **POST /seeder/run**
Run database seeder (Development only).

**Headers:** `Authorization: Bearer <admin_token>`

### **POST /seeder/reset**
Reset database with seed data (Development only).

**Headers:** `Authorization: Bearer <admin_token>`

## 🔍 WebSocket Events

### **Connection**
Connect to WebSocket for real-time updates:
```javascript
const socket = io('ws://localhost:3001');
```

### **Events**
- `order.status.changed`: Order status updates
- `notification.new`: New notifications
- `subscription.updated`: Subscription changes
- `payment.completed`: Payment confirmations

## 📚 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## 🔒 Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per minute
- **Upload endpoints**: 10 requests per minute
- **Admin endpoints**: 200 requests per minute

## 📖 Swagger Documentation

Interactive API documentation is available at:
- **Development**: `http://localhost:3001/api-docs`
- **Production**: `https://your-domain.com/api-docs`

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Total Endpoints**: 150+







