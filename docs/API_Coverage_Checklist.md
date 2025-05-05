# API Coverage Checklist

This document tracks all existing and planned APIs for the TiffinMate platform, grouped by service/module. Each API is marked with a checkbox to track implementation progress.

## Auth Module

### Authentication
- [x] POST /api/auth/register - Register a new user
- [x] POST /api/auth/login - User login
- [x] POST /api/auth/change-password - Change user password

## User Module

### User Management
- [x] GET /api/users - Get all users
- [x] GET /api/users/:id - Get user by ID
- [x] POST /api/users - Create a new user
- [x] PATCH /api/users/:id - Update user
- [x] DELETE /api/users/:id - Delete user

## Order Module

### Order Management
- [x] POST /api/orders - Create a new order
- [x] GET /api/orders - Get all orders
- [x] GET /api/orders/:id - Get order by ID
- [x] PATCH /api/orders/:id - Update order
- [x] DELETE /api/orders/:id - Delete order
- [x] PATCH /api/orders/:id/status - Update order status
- [x] PATCH /api/orders/:id/paid - Mark order as paid
- [x] PATCH /api/orders/:id/review - Add review to order
- [x] GET /api/orders/customer/:customerId - Get orders by customer
- [x] GET /api/orders/partner/:businessPartnerId - Get orders by business partner
- [x] GET /api/orders/status/:status - Get orders by status

## Menu Module

### Menu Management
- [x] POST /api/menu - Create a new menu item
- [x] GET /api/menu - Get all menu items
- [x] GET /api/menu/:id - Get menu item by ID
- [x] PATCH /api/menu/:id - Update menu item
- [x] DELETE /api/menu/:id - Delete menu item
- [x] GET /api/menu/partner/:partnerId - Get menu items by partner
- [x] POST /api/menu/categories - Create a new category
- [x] GET /api/menu/categories - Get all categories
- [x] GET /api/menu/categories/:id - Get category by ID
- [x] PATCH /api/menu/categories/:id - Update category
- [x] DELETE /api/menu/categories/:id - Delete category

## Admin Module

### Admin Dashboard
- [x] GET /api/admin/stats - Get system statistics
- [x] GET /api/admin/users/stats - Get user statistics
- [x] GET /api/admin/orders/stats - Get order statistics
- [x] GET /api/admin/partners/stats - Get partner statistics
- [x] GET /api/admin/revenue - Get revenue reports
- [x] POST /api/admin/settings - Update system settings

## Partner Module

### Partner Management
- [x] POST /api/partners - Register a new partner
- [x] GET /api/partners - Get all partners
- [x] GET /api/partners/:id - Get partner by ID
- [x] GET /api/partners/user/:userId - Get partner by user ID
- [x] PUT /api/partners/:id - Update partner
- [x] DELETE /api/partners/:id - Delete partner
- [x] GET /api/partners/:id/orders - Get partner orders
- [x] GET /api/partners/:id/menu - Get partner menu
- [x] GET /api/partners/:id/reviews - Get partner reviews
- [x] GET /api/partners/:id/stats - Get partner statistics
- [x] PUT /api/partners/:id/status - Update partner status

## Payment Module

### Payment Management
- [x] POST /api/payment/methods - Create a new payment method
- [x] GET /api/payment/methods - Get all payment methods for a customer
- [x] GET /api/payment/methods/:id - Get a specific payment method
- [x] PUT /api/payment/methods/:id - Update a payment method
- [x] DELETE /api/payment/methods/:id - Delete a payment method
- [x] PUT /api/payment/methods/:id/default - Set a payment method as default
- [x] POST /api/payment/process - Process a payment
- [x] GET /api/payment/transactions - Get payment transactions
- [x] GET /api/payment/transactions/:id - Get payment transaction details
- [x] POST /api/payment/razorpay/create-order - Create a payment order
- [x] POST /api/payment/razorpay/verify - Verify a Razorpay payment
- [x] POST /api/webhook/razorpay - Handle Razorpay webhook events

## Notification Module

### Notification Management
- [x] POST /api/notifications - Create a new notification
- [x] GET /api/notifications - Get all notifications
- [x] GET /api/notifications/:id - Get notification by ID
- [x] PATCH /api/notifications/:id/read - Mark notification as read
- [x] DELETE /api/notifications/:id - Delete notification
- [x] GET /api/notifications/user/:userId - Get user notifications
- [x] POST /api/notifications/subscribe - Subscribe to notifications
- [x] POST /api/notifications/unsubscribe - Unsubscribe from notifications

### Real-time Events
- [x] WebSocket /api/notifications - Real-time notification events
- [x] GET /api/notifications/orders/:id/status - Order status updates (SSE)

## Customer Profile Module

### Customer Profile Management
- [x] POST /api/customers/profile - Submit additional customer details
- [x] GET /api/customers/:id/profile - View customer profile
- [x] PATCH /api/customers/:id/profile - Update customer profile
- [x] GET /api/customers/city/:city - Get customers by city
- [x] GET /api/customers/stats - Aggregated customer data

## Landing Page Module

### Contact and Newsletter Management
- [x] POST /api/contact - Contact form submission
- [x] POST /api/subscribe - Newsletter subscription
- [x] GET /api/admin/contacts - View contact submissions
- [x] GET /api/admin/subscribers - View newsletter subscribers

## Marketing Module

### Referral Management
- [x] POST /api/referrals - Submit referral
- [x] GET /api/referrals - View tracked referrals

## Feedback Module

### Customer Feedback Management
- [x] POST /api/feedback - Submit feedback or report
- [x] GET /api/admin/feedback - View customer feedback

## System Utilities Module

### Health and Monitoring
- [x] GET /api/ping - Server health check
- [x] GET /api/version - App version information

## Subscription Module

### Subscription Plans
- [x] GET /api/subscription-plans - Get all subscription plans
- [x] GET /api/subscription-plans/active - Get all active subscription plans
- [x] GET /api/subscription-plans/:id - Get subscription plan by ID
- [x] POST /api/subscription-plans - Create a new subscription plan
- [x] PATCH /api/subscription-plans/:id - Update subscription plan
- [x] DELETE /api/subscription-plans/:id - Delete subscription plan

### Subscriptions
- [x] GET /api/subscriptions - Get all subscriptions
- [x] GET /api/subscriptions/:id - Get subscription by ID
- [x] GET /api/subscriptions/customer/:customerId - Get customer subscriptions
- [x] POST /api/subscriptions - Create a new subscription
- [x] PATCH /api/subscriptions/:id - Update subscription
- [x] DELETE /api/subscriptions/:id - Delete subscription
- [x] PATCH /api/subscriptions/:id/cancel - Cancel subscription
- [x] PATCH /api/subscriptions/:id/pause - Pause subscription
- [x] PATCH /api/subscriptions/:id/resume - Resume subscription

## Implementation Status Summary

- **Total APIs**: 104
- **Implemented APIs**: 104
- **Implementation Progress**: 100%

## Latest Updates

### July 20, 2023
- Successfully implemented all Payment Module APIs with Razorpay integration
- Added payment method management with default selection
- Implemented payment transaction tracking and webhook handling

### June 10, 2023
- Successfully implemented all Subscription Module APIs
- Added subscription plan management functionality
- Implemented subscription lifecycle operations (create, pause, resume, cancel) 