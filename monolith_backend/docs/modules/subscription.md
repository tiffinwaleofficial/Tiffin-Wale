# Subscription Module Documentation

## Overview
The Subscription module manages meal subscription plans and user subscriptions in the TiffinMate platform. It enables customers to subscribe to recurring meal deliveries with various frequencies, durations, and customization options.

## Core Features
- **Subscription Plan Management**: Create, update, and manage subscription plans
- **User Subscription Management**: Track customer subscriptions
- **Subscription Lifecycle**: Handle subscription creation, modification, cancellation, pausing, and resumption
- **Payment Frequency Options**: Support for different payment frequencies
- **Customization Options**: Allow users to customize their meal preferences

## Module Structure
```
subscription/
├── subscription.module.ts           # Module definition
├── subscription.controller.ts       # Subscription API endpoints
├── subscription.service.ts          # Subscription business logic
├── subscription-plan.controller.ts  # Subscription plan API endpoints
├── subscription-plan.service.ts     # Subscription plan business logic
├── schemas/                         # Database schemas
│   ├── subscription.schema.ts       # Subscription schema
│   └── subscription-plan.schema.ts  # Subscription plan schema
└── dto/                             # Data transfer objects
    ├── create-subscription.dto.ts   # Subscription creation validation
    ├── update-subscription.dto.ts   # Subscription update validation
    ├── create-subscription-plan.dto.ts # Plan creation validation
    └── update-subscription-plan.dto.ts # Plan update validation
```

## APIs

### Get All Subscription Plans
- **Endpoint**: `GET /api/subscription-plans`
- **Description**: Retrieves all subscription plans
- **Auth Required**: No
- **Response**: Array of subscription plans
- **Status**: Implemented ✅

### Get Active Subscription Plans
- **Endpoint**: `GET /api/subscription-plans/active`
- **Description**: Retrieves only active subscription plans
- **Auth Required**: No
- **Response**: Array of active subscription plans
- **Status**: Implemented ✅

### Get Subscription Plan by ID
- **Endpoint**: `GET /api/subscription-plans/:id`
- **Description**: Retrieves details of a specific subscription plan
- **Auth Required**: No
- **Parameters**: ID of the subscription plan
- **Response**: Subscription plan object
- **Status**: Implemented ✅

### Create Subscription Plan
- **Endpoint**: `POST /api/subscription-plans`
- **Description**: Creates a new subscription plan
- **Auth Required**: Yes (JWT)
- **Roles Required**: ADMIN, SUPER_ADMIN
- **Request Body**: Subscription plan details
- **Response**: Created subscription plan object
- **Status**: Implemented ✅

### Update Subscription Plan
- **Endpoint**: `PATCH /api/subscription-plans/:id`
- **Description**: Updates an existing subscription plan
- **Auth Required**: Yes (JWT)
- **Roles Required**: ADMIN, SUPER_ADMIN
- **Parameters**: ID of the subscription plan
- **Request Body**: Fields to update
- **Response**: Updated subscription plan object
- **Status**: Implemented ✅

### Delete Subscription Plan
- **Endpoint**: `DELETE /api/subscription-plans/:id`
- **Description**: Deletes a subscription plan
- **Auth Required**: Yes (JWT)
- **Roles Required**: ADMIN, SUPER_ADMIN
- **Parameters**: ID of the subscription plan
- **Response**: Success message
- **Status**: Implemented ✅

### Get All Subscriptions
- **Endpoint**: `GET /api/subscriptions`
- **Description**: Retrieves all subscriptions
- **Auth Required**: Yes (JWT)
- **Roles Required**: ADMIN, SUPER_ADMIN
- **Response**: Array of subscriptions
- **Status**: Implemented ✅

### Get Subscription by ID
- **Endpoint**: `GET /api/subscriptions/:id`
- **Description**: Retrieves details of a specific subscription
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the subscription
- **Response**: Subscription object
- **Status**: Implemented ✅

### Get Customer Subscriptions
- **Endpoint**: `GET /api/subscriptions/customer/:customerId`
- **Description**: Retrieves all subscriptions for a specific customer
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the customer
- **Response**: Array of subscriptions
- **Status**: Implemented ✅

### Create Subscription
- **Endpoint**: `POST /api/subscriptions`
- **Description**: Creates a new subscription
- **Auth Required**: Yes (JWT)
- **Request Body**: Subscription details
- **Response**: Created subscription object
- **Status**: Implemented ✅

### Update Subscription
- **Endpoint**: `PATCH /api/subscriptions/:id`
- **Description**: Updates an existing subscription
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the subscription
- **Request Body**: Fields to update
- **Response**: Updated subscription object
- **Status**: Implemented ✅

### Delete Subscription
- **Endpoint**: `DELETE /api/subscriptions/:id`
- **Description**: Deletes a subscription
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the subscription
- **Response**: Success message
- **Status**: Implemented ✅

### Cancel Subscription
- **Endpoint**: `PATCH /api/subscriptions/:id/cancel`
- **Description**: Cancels an active subscription
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the subscription
- **Query Parameters**: reason - Reason for cancellation
- **Response**: Updated subscription object
- **Status**: Implemented ✅

### Pause Subscription
- **Endpoint**: `PATCH /api/subscriptions/:id/pause`
- **Description**: Temporarily pauses an active subscription
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the subscription
- **Response**: Updated subscription object
- **Status**: Implemented ✅

### Resume Subscription
- **Endpoint**: `PATCH /api/subscriptions/:id/resume`
- **Description**: Resumes a paused subscription
- **Auth Required**: Yes (JWT)
- **Parameters**: ID of the subscription
- **Response**: Updated subscription object
- **Status**: Implemented ✅

## Data Models

### SubscriptionPlan Schema
```typescript
enum DurationType {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

enum MealFrequency {
  DAILY = "daily",
  WEEKDAYS = "weekdays",
  WEEKENDS = "weekends",
  CUSTOM = "custom",
}

interface SubscriptionPlan {
  name: string;                 // Name of the subscription plan
  description: string;          // Description
  price: number;                // Base price
  discountedPrice?: number;     // Discounted price (if applicable)
  durationValue: number;        // Duration quantity
  durationType: DurationType;   // Duration unit (day, week, month, year)
  mealFrequency: MealFrequency; // Frequency of meals
  mealsPerDay: number;          // Number of meals per day
  deliveryFee?: number;         // Delivery fee
  features?: string[];          // Additional features
  imageUrl?: string;            // Plan image
  maxPauseCount?: number;       // Maximum allowed pauses
  maxSkipCount?: number;        // Maximum allowed skips
  maxCustomizationsPerDay?: number; // Maximum customizations per day
  termsAndConditions?: string;  // Terms and conditions
  isActive: boolean;            // Whether the plan is active
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last update timestamp
}
```

### Subscription Schema
```typescript
enum SubscriptionStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  PENDING = "pending",
}

enum PaymentFrequency {
  ONETIME = "onetime",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
}

interface Subscription {
  customer: User;                  // Reference to customer
  plan: SubscriptionPlan;          // Reference to subscription plan
  status: SubscriptionStatus;      // Current status
  startDate: Date;                 // Start date
  endDate: Date;                   // End date
  cancelledAt?: Date;              // Cancellation date
  cancellationReason?: string;     // Reason for cancellation
  autoRenew: boolean;              // Whether to auto-renew
  paymentFrequency: PaymentFrequency; // Payment frequency
  totalAmount: number;             // Total amount to pay
  discountAmount?: number;         // Discount amount
  paymentId?: string;              // Payment reference ID
  isPaid: boolean;                 // Payment status
  customizations?: string[];       // Meal customizations
  lastRenewalDate?: Date;          // Last renewal date
  nextRenewalDate?: Date;          // Next renewal date
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

## Dependencies
- Mongoose Module
- User Module (for customer association)
- Auth Module (for JWT authentication)

## Usage Examples

### Finding Active Subscription Plans
```typescript
// In a service
const activePlans = await this.subscriptionPlanModel.find({ isActive: true }).exec();
```

### Getting Customer's Active Subscriptions
```typescript
// In a service
const activeSubscriptions = await this.subscriptionModel.find({ 
  customer: customerId,
  status: SubscriptionStatus.ACTIVE 
}).populate('plan').exec();
```

### Cancelling a Subscription
```typescript
// In a service
const subscription = await this.subscriptionModel.findById(id).exec();
subscription.status = SubscriptionStatus.CANCELLED;
subscription.cancelledAt = new Date();
subscription.cancellationReason = reason;
subscription.autoRenew = false;
return subscription.save();
```

## Future Enhancements
- Renewal notification system
- Promotional discounts for subscriptions
- Group/family subscription plans
- Subscription analytics and reporting
- Flexible delivery scheduling options
- Skip or modify individual meals within a subscription
- Gift subscriptions
- Loyalty rewards for long-term subscribers
- Multi-tier subscription plans
- Subscription spending reports for customers 