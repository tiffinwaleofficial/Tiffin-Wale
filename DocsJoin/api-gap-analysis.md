# TiffinWale Student App - API Gap Analysis

*Last Updated: July 20, 2023*

This document analyzes the API requirements for the TiffinWale Student App (frontend) against the available APIs in the monolith backend, identifying gaps that need to be addressed for complete integration.

## Table of Contents
1. [Authentication](#1-authentication)
2. [User Profile](#2-user-profile)
3. [Meal & Menu](#3-meal--menu)
4. [Subscription Plans](#4-subscription-plans)
5. [Orders & Tracking](#5-orders--tracking)
6. [Feedback & Reviews](#6-feedback--reviews)
7. [Support & Help](#7-support--help)
8. [Notifications](#8-notifications)
9. [Payments](#9-payments)
10. [Missing Frontend Sections](#10-missing-frontend-sections)
11. [Summary](#11-summary)

## 1. Authentication

### Required Frontend APIs:
1. User Registration
2. User Login
3. Password Recovery
4. Change Password
5. Logout

### Available Backend APIs:
| API | Endpoint | Status |
|-----|----------|--------|
| Register | POST `/auth/register` | ✅ Available |
| Login | POST `/auth/login` | ✅ Available |
| Change Password | POST `/auth/change-password` | ✅ Available |
| Password Reset | Not found | ❌ Missing |

### Gap Analysis:
- **Missing API**: Password reset/recovery functionality
- **Implementation**: Frontend uses mock authentication; needs to be connected to real backend APIs

## 2. User Profile

### Required Frontend APIs:
1. Get User Profile
2. Update User Profile
3. Get User Preferences

### Available Backend APIs:
| API | Endpoint | Status |
|-----|----------|--------|
| Get User | GET `/users/:id` | ✅ Available |
| Update User | PATCH `/users/:id` | ✅ Available (Admin only) |
| Get Customer Profile | GET `/customers/user/:userId` | ✅ Available |
| Update Customer Profile | PATCH `/customers/:id` | ✅ Available |

### Gap Analysis:
- **Permission Issue**: The update user API is restricted to admin roles. Need to modify for personal profile updates.
- **Missing API**: User preferences API for dietary restrictions and meal preferences

## 3. Meal & Menu

### Required Frontend APIs:
1. Get Today's Meals
2. Get Menu Items
3. Get Meal Categories
4. Get Meal Details
5. Get Meal History

### Available Backend APIs:
| API | Endpoint | Status |
|-----|----------|--------|
| Get Menu Items | GET `/menu` | ✅ Available |
| Get Menu Categories | GET `/menu/categories` | ✅ Available |
| Get Menu Item by ID | GET `/menu/:id` | ✅ Available |
| Get Today's Meals | Not found | ❌ Missing |
| Get Meal History | Not found | ❌ Missing |

### Gap Analysis:
- **Missing APIs**: 
  - Today's scheduled meals for a customer
  - Meal history for a customer
- **Implementation**: Frontend currently uses mock data for meals; need actual API endpoints

## 4. Subscription Plans

### Required Frontend APIs:
1. Get Available Subscription Plans
2. Subscribe to a Plan
3. Get Current Subscription
4. Modify/Cancel Subscription
5. Subscription History

### Available Backend APIs:
| API | Endpoint | Status |
|-----|----------|--------|
| Get Subscription Plans | GET `/subscription-plans` | ✅ Available |
| Get Active Plans | GET `/subscription-plans/active` | ✅ Available |
| Get Plan by ID | GET `/subscription-plans/:id` | ✅ Available |
| Create Subscription | POST `/subscriptions` | ✅ Available |
| Get Customer Subscriptions | GET `/subscriptions/customer/:customerId` | ✅ Available |
| Get Subscription | GET `/subscriptions/:id` | ✅ Available |
| Update Subscription | PATCH `/subscriptions/:id` | ✅ Available |
| Cancel Subscription | PATCH `/subscriptions/:id/cancel` | ✅ Available |
| Pause Subscription | PATCH `/subscriptions/:id/pause` | ✅ Available |
| Resume Subscription | PATCH `/subscriptions/:id/resume` | ✅ Available |

### Gap Analysis:
- **Implementation**: The backend APIs for subscription management are now fully implemented
- **Integration**: Frontend needs to be connected to these APIs replacing mock data

## 5. Orders & Tracking

### Required Frontend APIs:
1. Get Current Orders
2. Track Order Status
3. Order History
4. Cancel/Modify Order

### Available Backend APIs:
| API | Endpoint | Status |
|-----|----------|--------|
| Create Order | POST `/orders` | ✅ Available |
| Get Order by ID | GET `/orders/:id` | ✅ Available |
| Get Customer Orders | GET `/orders/customer/:customerId` | ✅ Available |
| Update Order Status | PATCH `/orders/:id/status` | ✅ Available (Partner/Admin only) |

### Gap Analysis:
- **Missing APIs**:
  - Real-time order tracking
  - Order modification for customer
- **Implementation**: Need to develop real-time tracking capabilities, possibly with WebSockets

## 6. Feedback & Reviews

### Required Frontend APIs:
1. Submit Meal Review
2. Get User Reviews
3. Submit App Feedback

### Available Backend APIs:
| API | Endpoint | Status |
|-----|----------|--------|
| Add Order Review | PATCH `/orders/:id/review` | ✅ Available |
| Submit Feedback | POST `/feedback` | ✅ Available |
| Get User Feedback | GET `/feedback/user/:userId` | ✅ Available |

### Gap Analysis:
- **Implementation**: Frontend review submission needs to be connected to the actual API

## 7. Support & Help

### Required Frontend APIs:
1. Get FAQ Content
2. Submit Support Request
3. Get Support Ticket Status

### Available Backend APIs:
| API | Endpoint | Status |
|-----|----------|--------|
| Support/FAQ related APIs | Not found | ❌ Missing |

### Gap Analysis:
- **Missing APIs**:
  - FAQs content management
  - Support ticket system
  - Support request submission
- **Implementation**: The help-support.tsx frontend implementation needs backend APIs

## 8. Notifications

### Required Frontend APIs:
1. Get User Notifications
2. Mark Notification as Read
3. Enable/Disable Notification Types

### Available Backend APIs:
| API | Endpoint | Status |
|-----|----------|--------|
| Get User Notifications | GET `/notifications/user/:userId` | ✅ Available |
| Mark Notification as Read | PATCH `/notifications/:id/read` | ✅ Available |
| Notification Settings | Not found | ❌ Missing |

### Gap Analysis:
- **Missing API**: User notification preferences/settings
- **Implementation**: Frontend currently doesn't implement notification functionality

## 9. Payments

### Required Frontend APIs:
1. Process Subscription Payment
2. Payment History
3. Save/Manage Payment Methods

### Available Backend APIs:
| API | Endpoint | Status |
|-----|----------|--------|
| Get Payment Methods | GET `/payment/methods` | ✅ Available |
| Create Payment Method | POST `/payment/methods` | ✅ Available |
| Update Payment Method | PUT `/payment/methods/:id` | ✅ Available |
| Delete Payment Method | DELETE `/payment/methods/:id` | ✅ Available |
| Set Default Payment Method | PUT `/payment/methods/:id/default` | ✅ Available |
| Process Payment | POST `/payment/process` | ✅ Available |
| Get Payment Transactions | GET `/payment/transactions` | ✅ Available |
| Get Transaction Details | GET `/payment/transactions/:id` | ✅ Available |
| Create Razorpay Order | POST `/payment/razorpay/create-order` | ✅ Available |
| Verify Payment | POST `/payment/razorpay/verify` | ✅ Available |

### Gap Analysis:
- **Implementation**: The backend APIs for payment processing are now fully implemented
- **Integration**: Frontend checkout flow needs integration with these payment APIs

## 10. Missing Frontend Sections

Based on the backend capabilities, these features could be added to the frontend:

1. **Referral System**: The backend has referral APIs, but the frontend doesn't have this feature
2. **Promotional Offers**: Backend supports promotions, but frontend lacks this section
3. **Partner/Restaurant Profiles**: Backend has partner data, but frontend doesn't show partner details

## 11. Summary

### API Status Summary

| Category | Required APIs | Available APIs | Missing APIs | Completion % |
|----------|--------------|----------------|--------------|--------------|
| Authentication | 5 | 3 | 2 | 60% |
| User Profile | 3 | 4 | 0 | 100% |
| Meal & Menu | 5 | 3 | 2 | 60% |
| Subscription Plans | 5 | 10 | 0 | 100% |
| Orders & Tracking | 4 | 4 | 0 | 100% |
| Feedback & Reviews | 3 | 3 | 0 | 100% |
| Support & Help | 3 | 0 | 3 | 0% |
| Notifications | 3 | 2 | 1 | 67% |
| Payments | 3 | 10 | 0 | 100% |
| **Total** | **34** | **39** | **8** | **76%** |

### Priority Implementation Tasks

1. **Critical**:
   - Today's meals API
   - Support/FAQ system APIs

2. **High**:
   - Password reset functionality
   - Real-time order tracking
   - User meal preferences

3. **Medium**:
   - Notification preferences
   - Referral system frontend implementation

4. **Low**:
   - Promotional offers frontend
   - Partner/Restaurant profile pages 