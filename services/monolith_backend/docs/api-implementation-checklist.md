# TiffinWale API Implementation Checklist

*Last Updated: July 22, 2023*

This document tracks the implementation status of all APIs required for the TiffinWale Student App.

## Status Indicators
- ✅ **Implemented**: API is fully implemented and tested
- 🔄 **In Progress**: API implementation is currently underway
- ❌ **Missing**: API needs to be implemented

## 1. Authentication & User APIs

| API | Endpoint | Status | Priority | Notes |
|-----|----------|--------|----------|-------|
| User Registration | `POST /auth/register` | ✅ Implemented | - | - |
| User Login | `POST /auth/login` | ✅ Implemented | - | - |
| Change Password | `POST /auth/change-password` | ✅ Implemented | - | - |
| Password Reset Request | `POST /auth/reset-password` | ❌ Missing | High | Sends reset token via email |
| Password Reset Verification | `POST /auth/verify-reset` | ❌ Missing | High | Verifies token and sets new password |

## 2. User Profile APIs

| API | Endpoint | Status | Priority | Notes |
|-----|----------|--------|----------|-------|
| Get User by ID | `GET /users/:id` | ✅ Implemented | - | - |
| Update User | `PATCH /users/:id` | ✅ Implemented | Medium | Needs permission update - currently admin-only |
| Get Customer Profile | `GET /customers/user/:userId` | ✅ Implemented | - | - |
| Update Customer Profile | `PATCH /customers/:id` | ✅ Implemented | - | - |
| Get User Preferences | `GET /users/:id/preferences` | ❌ Missing | High | Dietary restrictions and meal preferences |
| Update User Preferences | `PATCH /users/:id/preferences` | ❌ Missing | High | Set dietary restrictions and meal preferences |

## 3. Meal & Menu APIs

| API | Endpoint | Status | Priority | Notes |
|-----|----------|--------|----------|-------|
| Get Menu Items | `GET /menu` | ✅ Implemented | - | - |
| Get Menu Categories | `GET /menu/categories` | ✅ Implemented | - | - |
| Get Menu Item by ID | `GET /menu/:id` | ✅ Implemented | - | - |
| Today's Meals | `GET /meals/today` | ✅ Implemented | Critical | For student dashboard |
| Meal History | `GET /meals/history` | ✅ Implemented | Medium | Past meals for a customer |
| Skip Meal | `PATCH /meals/:id/skip` | ✅ Implemented | Low | Allow customer to skip a scheduled meal |
| Get Meal Details | `GET /meals/:id` | ✅ Implemented | Medium | Get details for a specific meal |
| Rate Meal | `POST /meals/:id/rate` | ✅ Implemented | Medium | Alternative to order review |

## 4. Subscription Plans APIs

| API | Endpoint | Status | Priority | Notes |
|-----|----------|--------|----------|-------|
| Get Customer Subscriptions | `GET /customers/:id/subscriptions` | ✅ Implemented | - | - |
| List Available Plans | `GET /subscriptions/plans` | ❌ Missing | Critical | Show subscription options |
| Get Plan Details | `GET /subscriptions/plans/:id` | ❌ Missing | Critical | Get details of a specific plan |
| Subscribe to Plan | `POST /subscriptions/subscribe` | ❌ Missing | Critical | Create new subscription |
| Get Current Subscription | `GET /subscriptions/current` | ❌ Missing | Critical | Get active subscription |
| Modify Subscription | `PATCH /subscriptions/:id` | ❌ Missing | High | Change subscription details |
| Cancel Subscription | `POST /subscriptions/:id/cancel` | ❌ Missing | High | Cancel active subscription |
| Subscription History | `GET /subscriptions/history` | ❌ Missing | Low | Past subscriptions |

## 5. Orders & Tracking APIs

| API | Endpoint | Status | Priority | Notes |
|-----|----------|--------|----------|-------|
| Create Order | `POST /orders` | ✅ Implemented | - | - |
| Get Order by ID | `GET /orders/:id` | ✅ Implemented | - | - |
| Get Customer Orders | `GET /orders/customer/:customerId` | ✅ Implemented | - | - |
| Update Order Status | `PATCH /orders/:id/status` | ✅ Implemented | - | Partner/Admin only |
| Real-time Order Tracking | WebSocket | ❌ Missing | High | Needs WebSocket implementation |
| Modify Order (Customer) | `PATCH /orders/:id/modify` | ❌ Missing | Low | Allow customers to modify orders |

## 6. Feedback & Reviews APIs

| API | Endpoint | Status | Priority | Notes |
|-----|----------|--------|----------|-------|
| Add Order Review | `PATCH /orders/:id/review` | ✅ Implemented | - | - |
| Submit Feedback | `POST /feedback` | ✅ Implemented | - | - |
| Get User Feedback | `GET /feedback/user/:userId` | ✅ Implemented | - | - |
| Get Review History | `GET /reviews/user/:userId` | ❌ Missing | Low | Consolidated review history |

## 7. Support & Help APIs

| API | Endpoint | Status | Priority | Notes |
|-----|----------|--------|----------|-------|
| Get FAQ Content | `GET /support/faq` | ❌ Missing | Critical | FAQ content management |
| Get FAQ Category | `GET /support/faq/categories` | ❌ Missing | Critical | FAQ categories |
| Submit Support Request | `POST /support/ticket` | ❌ Missing | Critical | Create support ticket |
| Get Support Ticket | `GET /support/ticket/:id` | ❌ Missing | Critical | Get ticket details |
| Get User Tickets | `GET /support/tickets/user/:userId` | ❌ Missing | Critical | Get user's support tickets |
| Update Ticket | `PATCH /support/ticket/:id` | ❌ Missing | Critical | Update ticket status or add reply |

## 8. Notifications APIs

| API | Endpoint | Status | Priority | Notes |
|-----|----------|--------|----------|-------|
| Get User Notifications | `GET /notifications/user/:userId` | ✅ Implemented | - | - |
| Mark Notification as Read | `PATCH /notifications/:id/read` | ✅ Implemented | - | - |
| Get Notification Preferences | `GET /notifications/preferences` | ❌ Missing | Medium | User notification settings |
| Update Notification Preferences | `PATCH /notifications/preferences` | ❌ Missing | Medium | Update notification settings |

## 9. Payments APIs

| API | Endpoint | Status | Priority | Notes |
|-----|----------|--------|----------|-------|
| Create Payment Intent | `POST /payments/create-intent` | ✅ Implemented | - | - |
| Get Payment History | `GET /payments/history` | ✅ Implemented | - | - |
| Save Payment Method | `POST /payments/methods` | ❌ Missing | Medium | Save payment information |
| Get Payment Methods | `GET /payments/methods` | ❌ Missing | Medium | List saved payment methods |
| Delete Payment Method | `DELETE /payments/methods/:id` | ❌ Missing | Medium | Remove saved payment method |

## Priority Implementation Tasks

1. **Critical** (Implement First):
   - ✅ Meal API - Today's meals
   - Subscription Plan APIs (listing, subscribing, managing)
   - Support/FAQ system APIs

2. **High** (Implement Second):
   - Password reset functionality
   - User preferences for dietary restrictions
   - Real-time order tracking
   - Subscription modification/cancellation

3. **Medium** (Implement Third):
   - Payment method management
   - Notification preferences
   - ✅ Meal history API
   - Permission update for User API

4. **Low** (Implement Last):
   - ✅ Skip meal functionality
   - Order modification for customer
   - Review history

## Implementation Progress

| Category | Implemented | In Progress | Missing | Total | Completion % |
|----------|-------------|-------------|---------|-------|--------------|
| Authentication | 3 | 0 | 2 | 5 | 60% |
| User Profile | 4 | 0 | 2 | 6 | 67% |
| Meal & Menu | 8 | 0 | 0 | 8 | 100% |
| Subscription Plans | 1 | 0 | 7 | 8 | 13% |
| Orders & Tracking | 4 | 0 | 2 | 6 | 67% |
| Feedback & Reviews | 3 | 0 | 1 | 4 | 75% |
| Support & Help | 0 | 0 | 6 | 6 | 0% |
| Notifications | 2 | 0 | 2 | 4 | 50% |
| Payments | 2 | 0 | 3 | 5 | 40% |
| **Total** | **27** | **0** | **25** | **52** | **52%** | 