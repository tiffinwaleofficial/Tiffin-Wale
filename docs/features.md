# TiffinWale Student App - Features

This document outlines the key features of the TiffinWale Student App, including their implementation status and core functionality.

## Feature Status Legend
- [x] Complete
- [~] In Progress
- [ ] Planned

## Core Features

### 1. [x] Authentication System

The app implements a complete authentication flow with the following components:

- User registration with email/password
- Login with email/password
- Password recovery (via email)
- Session management using secure tokens
- Protected routes for authenticated users

**Implementation**: `app/(auth)/login.tsx`, `app/(auth)/signup.tsx`, and `store/authStore.ts`

### 2. [x] Subscription Management

The subscription system allows users to:

- View available meal plans with pricing and details
- Subscribe to daily/weekly/monthly meal plans
- Manage active subscriptions (extend, pause, cancel)
- See subscription expiry and renewal dates

**Implementation**: `app/(tabs)/plans.tsx` and `app/subscription-checkout.tsx`

### 3. [x] Dashboard

The home dashboard shows:

- Today's meals with status (upcoming, ready, delivered)
- Current subscription status and expiry
- Quick actions to skip meals or add special requests
- Notifications for meal updates

**Implementation**: `app/(tabs)/index.tsx`, `components/ActiveSubscriptionDashboard.tsx`, and `components/NoSubscriptionDashboard.tsx`

### 4. [~] Meal Tracking

Real-time tracking of meals with:

- Current status (preparing, ready for pickup, on the way, delivered)
- Estimated time of arrival
- Delivery person details
- Restaurant/kitchen information

**Implementation**: `app/(tabs)/track.tsx`

### 5. [x] Order History

Displays the history of:

- Past meals received
- Additional one-time orders
- Cancelled or skipped meals
- Order details and receipt access

**Implementation**: `app/(tabs)/orders.tsx`, `components/MealHistoryCard.tsx`, and `components/AdditionalOrderCard.tsx`

### 6. [~] Ratings & Reviews

Allows users to:

- Rate meals after delivery
- Leave detailed feedback
- View their past ratings and reviews
- See average ratings for meal providers

**Implementation**: Partial implementation in `app/(tabs)/orders.tsx`

### 7. [ ] Notifications

Planned notification system for:

- Meal status updates
- Subscription expiry reminders
- Special offers and promotions
- App updates and new features

**Implementation**: Not yet implemented. Planned to use Expo Notifications.

### 8. [x] User Profile Management

User profile features:

- View and edit personal information
- Update delivery address
- Manage payment methods
- Set dietary preferences and restrictions

**Implementation**: `app/(tabs)/profile.tsx` and `app/profile.tsx`

### 9. [x] Support System

Customer support features:

- FAQ section for common questions
- Direct contact support form
- Issue reporting with image upload
- Order-specific support requests

**Implementation**: `app/help-support.tsx` and `app/faq.tsx`

### 10. [ ] Referral & Promotions

Planned referral system:

- Generate and share referral codes
- Track referral status
- Apply promotion codes to subscriptions
- View available offers and discounts

**Implementation**: Not yet implemented

## Additional Features

### 11. [~] Additional One-time Orders

Allows subscribers to:

- Order extra meals beyond their subscription
- Add special items to their regular delivery
- Place one-time orders for special occasions

**Implementation**: Partially implemented in `app/(tabs)/orders.tsx` and `components/AdditionalOrderCard.tsx`

### 12. [ ] Dietary Preferences

Planned feature to:

- Set dietary restrictions (vegetarian, vegan, etc.)
- Specify allergen information
- Customize meal preferences
- Receive personalized meal recommendations

**Implementation**: Not yet implemented

### 13. [ ] Payment Integration

Planned integration with:

- Multiple payment gateways (Razorpay/Stripe)
- Subscription billing management
- Receipt generation
- Payment history

**Implementation**: Basic UI implemented in `app/subscription-checkout.tsx`, but actual payment processing is not yet connected

## Development Roadmap

The following features are prioritized for upcoming development:

1. Complete the Meal Tracking system with real-time updates
2. Implement Notifications for delivery status and reminders
3. Integrate Payment gateway for subscription processing
4. Develop the Referral & Promotions system
5. Implement Dietary Preferences and meal customization
6. Add advanced analytics for user meal preferences and feedback 