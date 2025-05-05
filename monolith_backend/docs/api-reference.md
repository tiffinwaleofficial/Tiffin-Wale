# TiffinWale Backend API Reference

This document provides a comprehensive overview of all APIs available in the TiffinWale monolith backend.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Menu Management](#menu-management)
- [Orders](#orders)
- [Customers](#customers)
- [Partners](#partners)
- [Payments](#payments)
- [Feedback](#feedback)
- [Notifications](#notifications)
- [Marketing](#marketing)
- [System](#system)

## Authentication

Base URL: `/auth`

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/super-admin/register` | Register a super admin (development only) | Public |
| POST | `/auth/login` | User login | Public |
| POST | `/auth/change-password` | Change user password | JWT Token |

### Details

- **Register**: Creates a new user account with the provided email, password, and profile information.
- **Login**: Authenticates a user and returns a JWT token for accessing protected endpoints.
- **Change Password**: Allows authenticated users to update their password.

## Users

Base URL: `/users`

| Method | Endpoint | Description | Authentication | Roles |
|--------|----------|-------------|----------------|-------|
| POST | `/users` | Create a new user | JWT Token | Admin, Super Admin |
| GET | `/users` | Get all users | JWT Token | Admin, Super Admin |
| GET | `/users/:id` | Get user by ID | JWT Token | Any |
| PATCH | `/users/:id` | Update a user | JWT Token | Admin, Super Admin |
| DELETE | `/users/:id` | Delete a user | JWT Token | Admin, Super Admin |

### Details

- User management APIs for administrative purposes.
- Regular users can only access their own profile information.
- Admin users can access and manage all user accounts.

## Menu Management

Base URL: `/menu`

| Method | Endpoint | Description | Authentication | Roles |
|--------|----------|-------------|----------------|-------|
| GET | `/menu` | Get all menu items | JWT Token | Any |
| POST | `/menu` | Create a new menu item | JWT Token | Partner, Admin |
| GET | `/menu/:id` | Get menu item by ID | JWT Token | Any |
| PATCH | `/menu/:id` | Update a menu item | JWT Token | Partner, Admin |
| DELETE | `/menu/:id` | Delete a menu item | JWT Token | Partner, Admin |
| GET | `/menu/partner/:partnerId` | Get menu items by partner | JWT Token | Any |
| GET | `/menu/categories` | Get all categories | JWT Token | Any |
| POST | `/menu/categories` | Create a new category | JWT Token | Admin |
| GET | `/menu/categories/:id` | Get category by ID | JWT Token | Any |
| PATCH | `/menu/categories/:id` | Update a category | JWT Token | Admin |
| DELETE | `/menu/categories/:id` | Delete a category | JWT Token | Admin |

### Details

- Menu management APIs allow partners to create, update, and delete their menu items.
- Categories are managed by admin users to maintain consistency.
- Menu items can be filtered by partner for easier browsing.

## Orders

Base URL: `/orders`

| Method | Endpoint | Description | Authentication | Roles |
|--------|----------|-------------|----------------|-------|
| POST | `/orders` | Create a new order | JWT Token | Customer |
| GET | `/orders` | Get all orders | JWT Token | Admin, Super Admin |
| GET | `/orders/:id` | Get order by ID | JWT Token | Any |
| PATCH | `/orders/:id` | Update an order | JWT Token | Any |
| DELETE | `/orders/:id` | Delete an order | JWT Token | Admin |
| GET | `/orders/status/:status` | Get orders by status | JWT Token | Admin |
| GET | `/orders/customer/:customerId` | Get orders by customer | JWT Token | Customer, Admin |
| GET | `/orders/partner/:partnerId` | Get orders by partner | JWT Token | Partner, Admin |
| PATCH | `/orders/:id/status` | Update order status | JWT Token | Partner, Admin |
| PATCH | `/orders/:id/paid` | Mark order as paid | JWT Token | Admin |
| PATCH | `/orders/:id/review` | Add review to an order | JWT Token | Customer |

### Details

- Order management system to track customer orders from creation to delivery.
- Supports different order statuses: pending, confirmed, preparing, ready, delivering, delivered, canceled.
- Allows customers to review their orders after delivery.
- Partners can update the status of orders assigned to them.

## Customers

Base URL: `/customers`

| Method | Endpoint | Description | Authentication | Roles |
|--------|----------|-------------|----------------|-------|
| POST | `/customers` | Create a new customer profile | JWT Token | Any |
| GET | `/customers` | Get all customers | JWT Token | Admin, Super Admin |
| GET | `/customers/:id` | Get customer by ID | JWT Token | Any |
| PATCH | `/customers/:id` | Update customer profile | JWT Token | Customer, Admin |
| GET | `/customers/user/:userId` | Get customer by user ID | JWT Token | Any |
| GET | `/customers/:id/orders` | Get customer orders | JWT Token | Customer, Admin |
| GET | `/customers/:id/subscriptions` | Get customer subscriptions | JWT Token | Customer, Admin |

### Details

- Customer profile management for storing delivery addresses, preferences, and order history.
- Links customer profiles to user accounts.
- Tracks customer order history and subscription details.

## Partners

Base URL: `/partners`

| Method | Endpoint | Description | Authentication | Roles |
|--------|----------|-------------|----------------|-------|
| POST | `/partners` | Register a new partner | JWT Token | Admin, Super Admin |
| GET | `/partners` | Get all partners | JWT Token | Admin |
| GET | `/partners/:id` | Get partner by ID | JWT Token | Any |
| PATCH | `/partners/:id` | Update partner profile | JWT Token | Partner, Admin |
| DELETE | `/partners/:id` | Delete a partner | JWT Token | Admin |
| GET | `/partners/:id/menu` | Get partner menu | JWT Token | Any |
| GET | `/partners/:id/orders` | Get partner orders | JWT Token | Partner, Admin |
| PATCH | `/partners/:id/status` | Update partner status | JWT Token | Admin |

### Details

- Partner management for food providers (restaurants, home chefs, etc.).
- Partners can manage their menu items and track orders assigned to them.
- Admin can approve or suspend partner accounts.

## Payments

Base URL: `/payments`

| Method | Endpoint | Description | Authentication | Roles |
|--------|----------|-------------|----------------|-------|
| POST | `/payments/create-intent` | Create payment intent | JWT Token | Customer |
| GET | `/payments/history` | Get payment history | JWT Token | Customer, Admin |
| GET | `/payments/:id` | Get payment details | JWT Token | Customer, Admin |
| GET | `/payments/order/:orderId` | Get payment for order | JWT Token | Customer, Admin |
| POST | `/payments/verify/:paymentId` | Verify payment | JWT Token | Admin |
| GET | `/payments/dashboard` | Get payment statistics | JWT Token | Admin |

### Details

- Payment processing integration for orders and subscriptions.
- Supports multiple payment methods including cards and UPI.
- Provides payment verification and status updates.
- Admin dashboard for financial reporting.

## Feedback

Base URL: `/feedback`

| Method | Endpoint | Description | Authentication | Roles |
|--------|----------|-------------|----------------|-------|
| POST | `/feedback` | Submit feedback | JWT Token | Any |
| GET | `/feedback` | Get all feedback | JWT Token | Admin |
| GET | `/feedback/:id` | Get feedback by ID | JWT Token | Admin |
| PATCH | `/feedback/:id/response` | Add response to feedback | JWT Token | Admin |
| GET | `/feedback/user/:userId` | Get user feedback | JWT Token | Customer, Admin |
| GET | `/feedback/partner/:partnerId` | Get partner feedback | JWT Token | Partner, Admin |

### Details

- Feedback system for collecting user opinions about the service.
- Allows customers to rate their experience.
- Partners can view feedback related to their service.
- Admin can respond to feedback and track overall satisfaction.

## Notifications

Base URL: `/notifications`

| Method | Endpoint | Description | Authentication | Roles |
|--------|----------|-------------|----------------|-------|
| POST | `/notifications` | Create notification | JWT Token | Admin |
| GET | `/notifications` | Get all notifications | JWT Token | Admin |
| GET | `/notifications/user/:userId` | Get user notifications | JWT Token | Any |
| PATCH | `/notifications/:id/read` | Mark notification as read | JWT Token | Any |
| DELETE | `/notifications/:id` | Delete notification | JWT Token | Admin |
| POST | `/notifications/broadcast` | Broadcast notification to all users | JWT Token | Admin |

### Details

- Notification system for order updates, promotions, and system announcements.
- Supports push notifications for mobile users.
- In-app notification center for tracking messages.
- Admin can broadcast important announcements to all users.

## Marketing

Base URL: `/marketing`

| Method | Endpoint | Description | Authentication | Roles |
|--------|----------|-------------|----------------|-------|
| POST | `/marketing/promotions` | Create promotion | JWT Token | Admin |
| GET | `/marketing/promotions` | Get all promotions | JWT Token | Admin |
| GET | `/marketing/promotions/active` | Get active promotions | JWT Token | Any |
| PATCH | `/marketing/promotions/:id` | Update promotion | JWT Token | Admin |
| DELETE | `/marketing/promotions/:id` | Delete promotion | JWT Token | Admin |
| POST | `/marketing/referrals` | Create referral code | JWT Token | Customer |
| GET | `/marketing/referrals/user/:userId` | Get user referrals | JWT Token | Customer, Admin |
| POST | `/marketing/apply-promotion` | Apply promotion code | JWT Token | Customer |

### Details

- Marketing tools for creating and managing promotions.
- Referral system to incentivize user acquisition.
- Promotion code validation and application.
- Analytics to track marketing campaign effectiveness.

## System

Base URL: `/system`

| Method | Endpoint | Description | Authentication | Roles |
|--------|----------|-------------|----------------|-------|
| GET | `/system/health` | Check system health | Public | - |
| GET | `/system/config` | Get system configuration | JWT Token | Admin, Super Admin |
| PATCH | `/system/config` | Update system configuration | JWT Token | Super Admin |
| GET | `/system/stats` | Get system statistics | JWT Token | Admin, Super Admin |
| POST | `/system/backup` | Trigger system backup | JWT Token | Super Admin |

### Details

- System health monitoring and maintenance APIs.
- Configuration management for global system settings.
- Statistical data for dashboard displays.
- Backup and recovery functionality for data protection. 