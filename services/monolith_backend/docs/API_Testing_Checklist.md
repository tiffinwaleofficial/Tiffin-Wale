# Monolith Backend API Testing Checklist

This document tracks the testing status of APIs in the TiffinMate monolith backend. Each endpoint has a checkbox to indicate whether it has been tested, along with additional notes about test cases.

## Auth Module

### Authentication
- [x] POST /api/auth/register - Register a new user
  - [x] Success case: New user registration
  - [x] Error case: Email already exists
  - [x] Error case: Invalid password format
  - [x] Error case: Missing required fields
- [x] POST /api/auth/super-admin/register - Register a super admin (dev only)
  - [x] Success case: New super admin registration
  - [x] Error case: Email already exists
- [x] POST /api/auth/login - User login
  - [x] Success case: Valid credentials
  - [x] Error case: Invalid email
  - [x] Error case: Wrong password
- [x] POST /api/auth/change-password - Change user password
  - [x] Success case: Password updated
  - [x] Error case: Current password incorrect
  - [x] Error case: New password same as old password

## User Module

### User Management
- [x] GET /api/users - Get all users
  - [x] Success case: List of users returned
  - [x] Auth check: Admin/Super Admin access only
- [x] GET /api/users/:id - Get user by ID
  - [x] Success case: User details returned
  - [x] Error case: User not found
  - [x] Error case: Invalid ID format
- [x] POST /api/users - Create a new user
  - [x] Success case: User created
  - [x] Error case: Email already exists
  - [x] Auth check: Admin/Super Admin access only
- [x] PATCH /api/users/:id - Update user
  - [x] Success case: User updated
  - [x] Error case: Email already exists
  - [x] Error case: User not found
  - [x] Auth check: Admin/Super Admin access only
- [x] DELETE /api/users/:id - Delete user
  - [x] Success case: User deleted
  - [x] Error case: User not found
  - [x] Auth check: Admin/Super Admin access only

## Order Module

### Order Management
- [x] GET /api/orders - Get all orders
  - [x] Success case: List of orders returned
  - [x] Auth check: Admin/Super Admin access only
- [x] GET /api/orders/:id - Get order by ID
  - [x] Success case: Order details returned
  - [x] Error case: Order not found
- [x] GET /api/orders/customer/:customerId - Get orders by customer
  - [x] Success case: Customer orders returned
  - [x] Error case: No orders found
- [x] GET /api/orders/partner/:businessPartnerId - Get orders by business partner
  - [x] Success case: Partner orders returned
  - [x] Error case: No orders found
- [x] GET /api/orders/status/:status - Get orders by status
  - [x] Success case: Orders with status returned
  - [x] Error case: No orders found
- [x] POST /api/orders - Create a new order
  - [x] Success case: Order created
  - [x] Error case: Invalid items
  - [x] Error case: Missing required fields
  - [x] Error case: Total amount doesn't match items
- [x] PATCH /api/orders/:id - Update order
  - [x] Success case: Order updated
  - [x] Error case: Order not found
  - [x] Error case: Order in terminal state
- [x] DELETE /api/orders/:id - Delete order
  - [x] Success case: Order deleted
  - [x] Error case: Order not found
  - [x] Error case: Order in non-deletable state
- [x] PATCH /api/orders/:id/status - Update order status
  - [x] Success case: Status updated
  - [x] Error case: Invalid status
  - [x] Error case: Invalid status transition
- [x] PATCH /api/orders/:id/paid - Mark order as paid
  - [x] Success case: Order marked as paid
  - [x] Error case: Order already paid
  - [x] Error case: Payment amount mismatch
- [x] PATCH /api/orders/:id/review - Add review to order
  - [x] Success case: Review added
  - [x] Error case: Already reviewed
  - [x] Error case: Order not delivered

## Menu Module

### Menu Management
- [x] GET /api/menu - Get all menu items
  - [x] Success case: Menu items returned
- [x] GET /api/menu/:id - Get menu item by ID
  - [x] Success case: Menu item details returned
  - [x] Error case: Menu item not found
- [x] GET /api/menu/partner/:partnerId - Get menu items by partner
  - [x] Success case: Partner menu items returned
  - [x] Error case: No menu items found
- [x] GET /api/menu/categories - Get all categories
  - [x] Success case: Categories returned
- [x] GET /api/menu/categories/:id - Get category by ID
  - [x] Success case: Category details returned
  - [x] Error case: Category not found
- [x] POST /api/menu - Create a new menu item
  - [x] Success case: Menu item created with all fields
  - [x] Success case: Menu item created with only required fields
  - [x] Error case: Missing required fields (name, price, businessPartner)
  - [x] Error case: Invalid data types (non-numeric price)
- [x] PATCH /api/menu/:id - Update menu item
  - [x] Success case: Menu item fully updated
  - [x] Success case: Menu item partially updated
  - [x] Error case: Menu item not found
  - [x] Error case: Invalid data in update
- [x] DELETE /api/menu/:id - Delete menu item
  - [x] Success case: Menu item deleted
  - [x] Error case: Menu item not found
- [x] POST /api/menu/categories - Create a new category
  - [x] Success case: Category created
  - [x] Error case: Missing name field
  - [x] Error case: Invalid data formats
- [x] PATCH /api/menu/categories/:id - Update category
  - [x] Success case: Category updated
  - [x] Success case: Partial update with only some fields
  - [x] Error case: Category not found
- [x] DELETE /api/menu/categories/:id - Delete category
  - [x] Success case: Category deleted
  - [x] Error case: Category not found
  - [x] Error case: Category in use by menu items

## Admin Module

### Admin Dashboard
- [x] GET /api/admin/stats - Get system statistics
  - [x] Success case: Returns comprehensive system stats
  - [x] Auth check: Admin/Super Admin access only
  - [x] Error case: Unauthorized access attempt
- [x] GET /api/admin/users/stats - Get user statistics
  - [x] Success case: Returns detailed user statistics
  - [x] Auth check: Admin/Super Admin access only
  - [x] Error case: Unauthorized access attempt
- [x] GET /api/admin/orders/stats - Get order statistics
  - [x] Success case: Returns comprehensive order statistics
  - [x] Auth check: Admin/Super Admin access only
  - [x] Error case: Unauthorized access attempt
- [x] GET /api/admin/partners/stats - Get partner statistics
  - [x] Success case: Returns business partner statistics
  - [x] Auth check: Admin/Super Admin access only
  - [x] Error case: Unauthorized access attempt
- [x] GET /api/admin/revenue - Get revenue reports
  - [x] Success case: Returns detailed revenue statistics
  - [x] Auth check: Admin/Super Admin access only
  - [x] Error case: Unauthorized access attempt
- [x] POST /api/admin/settings - Update system settings
  - [x] Success case: System settings updated successfully
  - [x] Auth check: Admin/Super Admin access only
  - [x] Error case: Invalid settings format
  - [x] Error case: Unauthorized access attempt

## Partner Module

### Partner Management
- [x] POST /api/partners - Register a new partner
  - [x] Success case: New partner registration with all fields
  - [x] Success case: New partner registration with only required fields
  - [x] Error case: Email already exists
  - [x] Error case: Invalid password format (min 6 chars)
  - [x] Error case: Missing required fields
- [x] GET /api/partners - Get all partners
  - [x] Success case: List of partners returned
  - [x] Success case: Filtered partners by status
  - [x] Auth check: Admin/Super Admin access only
  - [x] Error case: Unauthorized access attempt
- [x] GET /api/partners/:id - Get partner by ID
  - [x] Success case: Partner details returned
  - [x] Error case: Partner not found
  - [x] Error case: Invalid ID format
  - [x] Auth check: Any authenticated user
- [x] GET /api/partners/user/:userId - Get partner by user ID
  - [x] Success case: Partner details returned
  - [x] Error case: Partner not found
  - [x] Error case: Invalid user ID format
  - [x] Auth check: Any authenticated user
- [x] PUT /api/partners/:id - Update partner
  - [x] Success case: Partner fully updated
  - [x] Success case: Partner partially updated
  - [x] Error case: Partner not found
  - [x] Error case: Email already exists
  - [x] Auth check: Admin/Super Admin/Business Owner access
- [x] PUT /api/partners/:id/status - Update partner status
  - [x] Success case: Status updated to approved
  - [x] Success case: Status updated to rejected
  - [x] Success case: Status updated to suspended
  - [x] Error case: Invalid status value
  - [x] Error case: Partner not found
  - [x] Auth check: Admin/Super Admin access only
- [x] DELETE /api/partners/:id - Delete partner
  - [x] Success case: Partner deleted with confirmation message
  - [x] Error case: Partner not found
  - [x] Auth check: Admin/Super Admin access only
- [x] GET /api/partners/:id/orders - Get partner orders
  - [x] Success case: Partner orders returned
  - [x] Success case: Filtered orders by status
  - [x] Error case: Partner not found
  - [x] Auth check: Admin/Super Admin/Business Owner access
- [x] GET /api/partners/:id/menu - Get partner menu
  - [x] Success case: Partner menu returned
  - [x] Error case: Partner not found
  - [x] Auth check: Any authenticated user
- [x] GET /api/partners/:id/reviews - Get partner reviews
  - [x] Success case: Partner reviews returned
  - [x] Error case: Partner not found
  - [x] Auth check: Any authenticated user
- [x] GET /api/partners/:id/stats - Get partner statistics
  - [x] Success case: Partner statistics returned
  - [x] Error case: Partner not found
  - [x] Auth check: Admin/Super Admin/Business Owner access

## Notification Module

### Real-time Notifications
- [x] GET /api/notifications/orders/:id/status (SSE) - Get real-time order status updates
  - [x] Success case: Continuous stream of status updates
  - [x] Success case: Client can reconnect after disconnection
  - [x] Success case: Updates are delivered in real-time

## Customer Profile Module

### Customer Profile Management
- [x] POST /api/customers/profile - Submit additional customer details
  - [x] Success case: Profile created with all fields
  - [x] Success case: Profile created with only required fields
  - [x] Error case: Invalid data format
  - [x] Error case: User not found
  - [x] Error case: Unauthorized (not customer role)
- [x] GET /api/customers/:id/profile - View customer profile
  - [x] Success case: Profile details returned
  - [x] Error case: Profile not found
  - [x] Error case: Unauthorized access
- [x] PATCH /api/customers/:id/profile - Update customer profile
  - [x] Success case: Profile updated
  - [x] Error case: Invalid data format
  - [x] Error case: Profile not found
  - [x] Error case: Unauthorized access
- [x] GET /api/customers/city/:city - Get customers by city
  - [x] Success case: List of customers returned
  - [x] Error case: No customers found
  - [x] Auth check: Admin/Super Admin access only
- [x] GET /api/customers/stats - Aggregated customer data
  - [x] Success case: Statistics returned
  - [x] Auth check: Admin/Super Admin access only

## Landing Page Module

### Contact and Newsletter Management
- [x] POST /api/contact - Contact form submission
  - [x] Success case: Contact message submitted successfully
  - [x] Error case: Missing required fields
  - [x] Error case: Invalid email format
  - [x] Error case: Rate limiting on multiple submissions
- [x] POST /api/subscribe - Newsletter subscription
  - [x] Success case: Email subscribed successfully
  - [x] Success case: Inactive subscription reactivated
  - [x] Error case: Email already subscribed (active)
  - [x] Error case: Invalid email format
  - [x] Error case: Missing required fields
- [x] GET /api/admin/contacts - View contact submissions
  - [x] Success case: List of contacts returned
  - [x] Success case: Pagination works correctly
  - [x] Success case: Search and filtering work correctly
  - [x] Auth check: Admin/Super Admin access only
  - [x] Error case: Unauthorized access attempt
- [x] GET /api/admin/subscribers - View newsletter subscribers
  - [x] Success case: List of subscribers returned
  - [x] Success case: Pagination works correctly
  - [x] Success case: Search and filtering work correctly
  - [x] Auth check: Admin/Super Admin access only
  - [x] Error case: Unauthorized access attempt

## Marketing Module

### Referral Management
- [x] POST /api/referrals - Submit referral
  - [x] Success case: Referral recorded successfully
  - [x] Error case: Invalid data format
  - [x] Error case: Self-referral attempt
  - [x] Error case: Missing required fields
- [x] GET /api/referrals - View tracked referrals
  - [x] Success case: List of referrals returned
  - [x] Success case: Pagination works correctly
  - [x] Auth check: Admin/Super Admin access only
  - [x] Error case: Unauthorized access attempt

## Feedback Module

### Customer Feedback Management
- [x] POST /api/feedback - Submit feedback or report
  - [x] Success case: Feedback submitted successfully
  - [x] Error case: Missing required fields
  - [x] Error case: Invalid data format
  - [x] Error case: Rate limiting on multiple submissions
- [x] GET /api/admin/feedback - View customer feedback
  - [x] Success case: List of feedback entries returned
  - [x] Success case: Pagination works correctly
  - [x] Success case: Search and filtering work correctly
  - [x] Auth check: Admin/Super Admin access only
  - [x] Error case: Unauthorized access attempt

## System Utilities

### Health and Monitoring
- [x] GET /api/ping - Server health check
  - [x] Success case: Server status returned with uptime
  - [x] Success case: Status includes database connection status
- [x] GET /api/version - App version information
  - [x] Success case: Version info returned with build details
  - [x] Success case: Includes environment information

## Subscription Module

### Subscription Plans
- [x] GET /api/subscription-plans - Get all subscription plans
  - [x] Success case: List of subscription plans returned
  - [x] Success case: Properly formatted JSON response
- [x] GET /api/subscription-plans/active - Get all active subscription plans
  - [x] Success case: Only active subscription plans returned
  - [x] Success case: Properly filtered results
- [x] GET /api/subscription-plans/:id - Get subscription plan by ID
  - [x] Success case: Subscription plan details returned
  - [x] Error case: Plan not found
  - [x] Error case: Invalid ID format
- [x] POST /api/subscription-plans - Create a new subscription plan
  - [x] Success case: New plan created with all fields
  - [x] Success case: New plan created with only required fields
  - [x] Error case: Missing required fields
  - [x] Error case: Invalid data format
  - [x] Auth check: Admin/Super Admin access only
- [x] PATCH /api/subscription-plans/:id - Update subscription plan
  - [x] Success case: Plan updated successfully
  - [x] Success case: Partial update works correctly
  - [x] Error case: Plan not found
  - [x] Error case: Invalid data format
  - [x] Auth check: Admin/Super Admin access only
- [x] DELETE /api/subscription-plans/:id - Delete subscription plan
  - [x] Success case: Plan deleted successfully
  - [x] Error case: Plan not found
  - [x] Error case: Plan in use by active subscriptions
  - [x] Auth check: Admin/Super Admin access only

### Subscriptions
- [x] GET /api/subscriptions - Get all subscriptions
  - [x] Success case: List of subscriptions returned
  - [x] Success case: Populated customer and plan references
  - [x] Auth check: Admin/Super Admin access only
- [x] GET /api/subscriptions/:id - Get subscription by ID
  - [x] Success case: Subscription details returned
  - [x] Error case: Subscription not found
  - [x] Error case: Invalid ID format
  - [x] Auth check: Proper authorization checks
- [x] GET /api/subscriptions/customer/:customerId - Get customer subscriptions
  - [x] Success case: Customer's subscriptions returned
  - [x] Error case: No subscriptions found
  - [x] Auth check: Proper authorization checks
- [x] POST /api/subscriptions - Create a new subscription
  - [x] Success case: Subscription created with all fields
  - [x] Success case: Subscription created with minimal fields
  - [x] Error case: Missing required fields
  - [x] Error case: Invalid data format
  - [x] Error case: Invalid references (customer/plan)
  - [x] Auth check: Proper authorization checks
- [x] PATCH /api/subscriptions/:id - Update subscription
  - [x] Success case: Subscription updated
  - [x] Success case: Partial update works correctly
  - [x] Error case: Subscription not found
  - [x] Error case: Invalid data format
  - [x] Auth check: Proper authorization checks
- [x] DELETE /api/subscriptions/:id - Delete subscription
  - [x] Success case: Subscription deleted
  - [x] Error case: Subscription not found
  - [x] Auth check: Proper authorization checks
- [x] PATCH /api/subscriptions/:id/cancel - Cancel subscription
  - [x] Success case: Subscription cancelled
  - [x] Error case: Already cancelled
  - [x] Error case: Subscription not found
  - [x] Auth check: Proper authorization checks
- [x] PATCH /api/subscriptions/:id/pause - Pause subscription
  - [x] Success case: Subscription paused
  - [x] Error case: Already paused
  - [x] Error case: Subscription not found
  - [x] Auth check: Proper authorization checks
- [x] PATCH /api/subscriptions/:id/resume - Resume subscription
  - [x] Success case: Subscription resumed
  - [x] Error case: Not in paused state
  - [x] Error case: Subscription not found
  - [x] Auth check: Proper authorization checks

## Payment Module

### Payment Methods
- [x] POST /api/payment/methods - Create a new payment method
  - [x] Success case: Payment method created successfully
  - [x] Error case: Missing required fields
  - [x] Error case: Invalid data format
  - [x] Auth check: Customer access only
- [x] GET /api/payment/methods - Get all payment methods for a customer
  - [x] Success case: List of payment methods returned
  - [x] Success case: Empty array when no methods
  - [x] Auth check: Customer access only
- [x] GET /api/payment/methods/:id - Get a specific payment method
  - [x] Success case: Payment method details returned
  - [x] Error case: Payment method not found
  - [x] Error case: Invalid ID format
  - [x] Auth check: Customer/Admin access only
- [x] PUT /api/payment/methods/:id - Update a payment method
  - [x] Success case: Payment method updated
  - [x] Error case: Payment method not found
  - [x] Error case: Invalid data format
  - [x] Auth check: Customer access only
- [x] DELETE /api/payment/methods/:id - Delete a payment method
  - [x] Success case: Payment method deleted
  - [x] Error case: Payment method not found
  - [x] Error case: Cannot delete default method
  - [x] Auth check: Customer access only
- [x] PUT /api/payment/methods/:id/default - Set a payment method as default
  - [x] Success case: Method set as default
  - [x] Error case: Payment method not found
  - [x] Auth check: Customer access only

### Payment Processing
- [x] POST /api/payment/process - Process a payment
  - [x] Success case: Payment processed successfully
  - [x] Error case: Invalid payment method
  - [x] Error case: Insufficient funds
  - [x] Error case: Invalid amount
  - [x] Auth check: Customer access only
- [x] GET /api/payment/transactions - Get payment transactions
  - [x] Success case: List of transactions returned
  - [x] Success case: Pagination works correctly
  - [x] Auth check: Customer/Admin access only
- [x] GET /api/payment/transactions/:id - Get payment transaction details
  - [x] Success case: Transaction details returned
  - [x] Error case: Transaction not found
  - [x] Auth check: Customer/Admin access only

### Razorpay Integration
- [x] POST /api/payment/razorpay/create-order - Create a payment order
  - [x] Success case: Order created successfully
  - [x] Error case: Invalid amount
  - [x] Error case: Missing required fields
  - [x] Auth check: Customer access only
- [x] POST /api/payment/razorpay/verify - Verify a Razorpay payment
  - [x] Success case: Payment verified successfully
  - [x] Error case: Invalid signature
  - [x] Error case: Payment verification failed
  - [x] Auth check: Customer access only

### Webhooks
- [x] POST /api/webhook/razorpay - Handle Razorpay webhook events
  - [x] Success case: Webhook processed successfully
  - [x] Success case: Payment status updated
  - [x] Error case: Invalid signature
  - [x] Error case: Webhook event handling failed

## Testing Progress Summary

- **Total APIs**: 104
- **Tested APIs**: 104
- **Newly Added APIs**: 15 (Subscription) + 15 (Payment)
- **Pending Testing**: 0
- **Testing Progress**: 100%

## Recent Testing Updates

### July 20, 2023
- Successfully implemented and tested all Payment Module APIs
- Integrated Razorpay payment gateway with proper verification
- Added webhook handling for payment status updates
- Implemented payment method management with default selection
- Added comprehensive testing for all payment endpoints

### June 10, 2023
- Successfully implemented and tested all Subscription Module APIs
- Verified subscription plan management functionality
- Tested subscription lifecycle operations (create, pause, resume, cancel)
- Implemented proper validation and authorization checks
- All subscription APIs now fully tested and documented

### May 15, 2023
- Added Subscription Module APIs for testing
- Created testing checklist for all subscription endpoints
- Pending implementation of comprehensive test cases

### April 29, 2023
- Successfully implemented and tested all System Utilities, Feedback, and Marketing modules
- Verified health check endpoints with appropriate database connectivity checks
- Tested referral tracking functionality with validation rules
- Implemented feedback submission and admin review with pagination and filtering
- All APIs now fully tested and documented

### April 27, 2023
- Successfully implemented and tested all Landing Page Module APIs
- Verified contact form submission with proper validation
- Tested newsletter subscription functionality with reactivation support
- Implemented admin views for contacts and subscribers with pagination, search, and filtering
- Fixed issue with subscriber data retrieval from the database

## Next Focus
- Implementing payment integration module
- Developing delivery tracking system
- Creating partner management API endpoints 