# EMERGENT AI PROMPT: TiffinWale Student App - Complete Mobile App Development

## 🎯 PROJECT OVERVIEW

You are building a **complete, production-ready mobile application** for **TiffinWale** - a food subscription service platform for students and bachelors. This app will be compiled to native iOS and Android using **CapacitorJS framework**.

**CRITICAL REQUIREMENT**: This must be a **full mobile app** that can be compiled to iOS and Android using CapacitorJS. Use React Native, Flutter, or web-based framework (React/Vue) that works seamlessly with CapacitorJS.

---

## 🚨 CRITICAL DEVELOPMENT PHASE - DUMMY DATA FIRST

**MANDATORY FIRST STEP**: Before any API integration, you **MUST** create the entire app with **dummy/mock data** so we can visually see and test the complete app interface. 

**Requirements for Dummy Data Phase**:
- Create comprehensive mock data for ALL screens and features
- Ensure all screens are fully functional visually
- All navigation flows work with dummy data
- All UI components render with realistic sample data
- We need to see the COMPLETE app visually before API integration
- Mock data should be realistic and cover all edge cases (empty states, loading states, etc.)

**Only after visual approval**, proceed with API integration.

---

## 📱 MOBILE APP FRAMEWORK REQUIREMENT

**Framework**: **CapacitorJS** for native mobile compilation
- The app must be built using a framework compatible with CapacitorJS
- Recommended: React (with React Router), Vue.js, or plain HTML/CSS/JS
- Must use CapacitorJS plugins for native features (camera, notifications, etc.)
- Must structure project for easy CapacitorJS compilation
- Include CapacitorJS configuration files

**Native Features Required**:
- Push notifications (Capacitor Push Notifications plugin)
- Camera access (for profile images)
- Location services (for delivery addresses)
- File system access (for image uploads)
- Native status bar styling
- Safe area handling for notches

---

## 🎨 DESIGN REQUIREMENTS

### Visual Aesthetic:
- **Modern & Premium**: Contemporary design following 2024+ design trends
- **Visually Striking**: Use modern color palettes (NOT just orange/cream)
- **Food-Appropriate**: Warm, inviting colors that make food look appetizing
- **Next-Level UI**: Glassmorphism, micro-interactions, modern typography
- **Student-Friendly**: Clean, intuitive, not overwhelming

### Design Freedom:
- Choose modern color palettes (gradients, sophisticated combinations)
- Design premium components (buttons, cards, inputs)
- Create innovative layouts
- Add delightful animations
- Use contemporary iconography

---

## 📱 APP STRUCTURE

### Bottom Tab Navigation (5 tabs):
1. **Home** - Dashboard with stats, today's meals, quick actions
2. **Orders** - Order history (Today/Upcoming/Past tabs)
3. **Track** - Real-time order tracking with progress timeline
4. **Plans** - Subscription plans and partner selection
5. **Profile** - User profile, settings, subscription details

---

## 📄 SCREEN REQUIREMENTS

### 🔐 ONBOARDING FLOW

#### Welcome Screen
- App name: "TiffinWale"
- Subtitle: "Delicious meals for bachelors"
- Welcome message
- Benefits list (4 items with icons)
- Stats section
- "Get Started" button
- Terms & Privacy links

#### Phone Verification Screen
- Title: "Phone Verification"
- Subtitle explaining process
- Phone number input (10-digit Indian format)
- Country code (+91)
- "Send OTP" button
- Login link for existing users

#### OTP Verification Screen
- Title: "OTP Verification"
- Instructions
- 6-digit OTP input (individual boxes or single field)
- "Verify OTP" button
- Resend OTP link with timer

#### Personal Information Screen
- Title: "Personal Information"
- Form fields: First Name, Last Name, Date of Birth, Gender
- "Continue" button
- Back button

#### Food Preferences Screen
- Title: "Food Preferences"
- Preference options: Vegetarian, Non-Vegetarian, Vegan, No Spice
- Allergies input
- Dietary Restrictions input
- "Continue" button
- "Skip for now" option

#### Delivery Location Screen
- Title: "Delivery Location"
- Address form fields (Address, City, State, Pincode, Landmark)
- Map integration or location picker
- "Complete Setup" button
- "Skip for now" option

---

### 🏠 MAIN APP TABS

#### Home Tab - Dashboard
**Header** (when no subscription):
- Personalized greeting: "Hi, [Name]!"
- Location display
- Notification bell with badge count

**Active Subscription View**:
- Time-based greeting
- Current date
- Stats cards (2x2 grid): Days Left, Meals Left, Average Rating, Total Orders
- Today's Meals section with meal cards
- Upcoming Meals section
- Quick action buttons

**No Subscription View**:
- Large food image/illustration
- "No Active Subscription" message
- "Browse Plans" button
- Today's Meals empty state
- Quick actions section

#### Orders Tab
- Title: "Order History"
- Tab navigation: Today / Upcoming / Past
- Order cards for each tab
- Empty states for each tab
- Pull-to-refresh

#### Track Tab
- Order summary card
- Progress timeline (6 steps)
- Delivery details card
- Partner contact card
- Order items breakdown
- Empty state

#### Plans Tab
- Title: "Subscription Plans"
- Active subscription section (if applicable)
- Explore Tiffin Centers section
- Available plans list
- Plan detail modal
- Empty states

#### Profile Tab
- Profile header with image
- Subscription section
- Menu options (Account, Addresses, Payment, Settings, Language)
- Support section
- Logout button

---

### 🔄 ADDITIONAL SCREENS

- Checkout Screen
- Checkout Success Screen
- Account Information Screen
- Delivery Addresses Screen
- Payment Methods Screen
- Help & Support Screen
- Rate Meal Screen
- Subscription Details Screen

---

## 🔌 API INTEGRATION REQUIREMENTS

**IMPORTANT**: All API endpoints use base URL: `/api` (configured via environment variables)

### 🔐 Authentication Module (`/api/auth`)

**Endpoints**:
- `POST /api/auth/login` - User login (email, password)
- `POST /api/auth/register` - User registration (email, password, firstName, lastName, phone)
- `POST /api/auth/refresh-token` - Refresh JWT token (refreshToken)
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Reset password request (email)
- `POST /api/auth/reset-password` - Reset password (token, password)
- `POST /api/auth/change-password` - Change password (currentPassword, newPassword)
- `POST /api/auth/verify-email` - Verify email (token)
- `GET /api/auth/me` - Get current user

**Response Format**: `{ accessToken, refreshToken, user }` for auth endpoints

---

### 🍽️ Meals Module (`/api/meals`)

**Endpoints**:
- `GET /api/meals/today` - Get today's meals
- `GET /api/meals/history` - Get meal history (?page=1&limit=10)
- `GET /api/meals/:id` - Get specific meal details
- `POST /api/meals/:id/rate` - Rate a meal (rating, comment)
- `POST /api/meals/:id/skip` - Skip a meal (reason)
- `GET /api/meals/upcoming` - Get upcoming meals
- `GET /api/meals/ratings` - Get user's ratings

**Response Format**: `{ meals[] }` or `{ meals[], total, page }` for paginated

---

### 🏪 Partners/Restaurants Module (`/api/partners`)

**Endpoints**:
- `GET /api/partners` - Get all partners (?search=&category=)
- `GET /api/partners/:id` - Get partner details
- `GET /api/partners/:id/menu` - Get partner menu
- `GET /api/partners/:id/reviews` - Get partner reviews
- `POST /api/partners/:id/reviews` - Add partner review (rating, comment)
- `GET /api/partners/featured` - Get featured partners
- `GET /api/partners/nearby` - Get nearby partners (?lat=&lng=&radius=)

**Response Format**: `{ partners[] }` or `{ partner }` for single

---

### 📦 Orders Module (`/api/orders`)

**Endpoints**:
- `GET /api/orders` - Get all orders (?status=&page=1)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order (items[], partnerId, deliveryAddress)
- `PUT /api/orders/:id/cancel` - Cancel order (reason)
- `GET /api/orders/:id/status` - Get order status
- `GET /api/orders/customer/:customerId` - Get customer orders
- `POST /api/orders/:id/feedback` - Order feedback (rating, comment)
- `GET /api/orders/me/today` - Today's orders (customer-specific)
- `GET /api/orders/me/upcoming` - Upcoming orders (customer-specific)
- `GET /api/orders/me/past` - Past orders (customer-specific)
- `PATCH /api/orders/:id/rate` - Rate an order

**Response Format**: `{ orders[], total }` or `{ order }` for single

---

### 📅 Subscription Module (`/api/subscriptions`)

**Endpoints**:
- `GET /api/subscription-plans` - Get all plans
- `GET /api/subscription-plans/active` - Get active plans only
- `GET /api/subscription-plans/:id` - Get plan details
- `GET /api/subscriptions` - Get user subscriptions
- `GET /api/subscriptions/me/current` - Get current active subscription
- `GET /api/subscriptions/me/all` - Get all user subscriptions
- `POST /api/subscriptions` - Create subscription (planId, startDate)
- `PUT /api/subscriptions/:id` - Update subscription (modifications)
- `PUT /api/subscriptions/:id/pause` - Pause subscription (pauseUntil, reason)
- `PUT /api/subscriptions/:id/resume` - Resume subscription
- `DELETE /api/subscriptions/:id` - Cancel subscription (reason)
- `GET /api/subscriptions/:id/meals` - Get subscription meals

**Response Format**: `{ plans[] }` or `{ subscriptions[] }` or `{ subscription }`

---

### 🔔 Notifications Module (`/api/notifications`)

**Endpoints**:
- `GET /api/notifications/user/:userId` - Get user notifications (?page=1&unread=true)
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread count
- `GET /api/notifications/stream` - SSE stream for real-time notifications
- `POST /api/notifications/preferences` - Update notification preferences

**Response Format**: `{ notifications[] }` or `{ count }` for count

**Real-time**: Use Server-Sent Events (SSE) for live notifications

---

### 👤 Customer Profile Module (`/api/customers`)

**Endpoints**:
- `GET /api/customers/profile` - Get user profile
- `PUT /api/customers/profile` - Update profile (firstName, lastName, phone, etc.)
- `GET /api/customers/addresses` - Get all addresses
- `POST /api/customers/addresses` - Add new address (address details)
- `PUT /api/customers/addresses/:id` - Update address (address details)
- `DELETE /api/customers/addresses/:id` - Delete address
- `PUT /api/customers/addresses/:id/default` - Set default address

**Response Format**: `{ profile }` or `{ addresses[] }` or `{ address }`

---

### 💬 Feedback Module (`/api/feedback`)

**Endpoints**:
- `POST /api/feedback` - Submit feedback (type, subject, message, rating)
- `GET /api/feedback/user` - Get user feedback history
- `GET /api/feedback/:id` - Get feedback details
- `PUT /api/feedback/:id/response` - Admin response (for support tickets)

**Response Format**: `{ feedback[] }` or `{ feedback }`

---

### 🍽️ Menu Module (`/api/menu`)

**Endpoints**:
- `GET /api/menu` - Get all menu items (?category=&partner=)
- `GET /api/menu/:id` - Get menu item details
- `GET /api/menu/categories` - Get menu categories
- `GET /api/menu/partner/:partnerId` - Get partner menu
- `GET /api/menu/featured` - Get featured items
- `GET /api/menu/search` - Search menu items (?q=query)

**Response Format**: `{ items[] }` or `{ item }` or `{ categories[] }`

---

### 🎯 Marketing Module (`/api/marketing`)

**Endpoints**:
- `GET /api/marketing/promotions/active` - Get active promotions
- `GET /api/marketing/banners` - Get marketing banners
- `POST /api/referrals` - Create referral (referredEmail)
- `GET /api/referrals/user` - Get user referrals
- `GET /api/marketing/coupons/user` - Get user coupons
- `POST /api/marketing/newsletter/subscribe` - Newsletter signup (email)

**Response Format**: `{ promotions[] }` or `{ referrals[] }` or `{ coupons[] }`

---

### 💳 Payment Module (`/api/payments`)

**Endpoints**:
- `POST /api/payments/create-intent` - Create payment intent (amount, currency)
- `GET /api/payments/methods` - Get saved payment methods
- `POST /api/payments/methods` - Add payment method (method details)
- `DELETE /api/payments/methods/:id` - Remove payment method
- `GET /api/payments/history` - Get payment history

**Response Format**: `{ clientSecret }` for intent, `{ methods[] }` for methods, `{ payments[] }` for history

---

### 📍 Landing Module (`/api/landing`)

**Endpoints**:
- `GET /api/landing/hero` - Get hero content
- `GET /api/landing/features` - Get features list
- `GET /api/landing/testimonials` - Get testimonials
- `GET /api/landing/stats` - Get platform stats
- `POST /api/landing/contact` - Contact form (name, email, message)
- `POST /api/landing/waitlist` - Join waitlist (email, location)

**Response Format**: Various content objects

---

### 🛠️ System Module (`/api/system`)

**Endpoints**:
- `GET /api/ping` - Health check
- `GET /api/version` - Get app version
- `GET /api/system/config` - Get system configuration

**Response Format**: `{ message, timestamp }` or `{ version, build }` or `{ config }`

---

### 👥 User Module (`/api/users`)

**Endpoints**:
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (userData)
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id/activity` - Get user activity

**Response Format**: `{ user }` or `{ activities[] }`

---

### 📝 Reviews Module (`/api/reviews`)

**Endpoints**:
- `POST /api/reviews` - Create review (restaurant, rating, comment, etc.)
- `GET /api/reviews/me` - Get user's reviews
- `GET /api/reviews/partner/:id` - Get partner reviews

**Response Format**: `{ review }` or `{ reviews[] }`

---

## 🔐 AUTHENTICATION FLOW

**Token Management**:
- All authenticated requests require `Authorization: Bearer {accessToken}` header
- Access tokens expire - use refresh token to get new access token
- Store tokens securely (use CapacitorJS SecureStorage plugin)
- Auto-refresh token on 401 responses

**Auth Flow**:
1. User logs in → Receives accessToken + refreshToken
2. Store tokens securely
3. Include accessToken in all API requests
4. On 401 error → Use refreshToken to get new accessToken
5. On refresh failure → Redirect to login

---

## 🌐 ENVIRONMENT CONFIGURATION

**Required Environment Variables**:
- `API_BASE_URL` - Backend API base URL (e.g., `http://localhost:3001` or production URL)
- `ENVIRONMENT` - `development` or `production`

**Configuration**:
- Create environment config file
- Use different URLs for dev/production
- Make API base URL easily configurable

---

## 📋 DATA STRUCTURES

### User/Profile Structure:
- `id`, `email`, `firstName`, `lastName`, `phoneNumber`
- `profileImage`, `dateOfBirth`, `gender`
- `addresses[]`, `preferences`

### Order Structure:
- `id`, `customerId`, `partnerId`, `status`
- `items[]`, `totalAmount`, `deliveryAddress`
- `deliveryTime`, `mealType`, `createdAt`

### Subscription Structure:
- `id`, `customerId`, `planId`, `status`
- `startDate`, `endDate`, `plan` (nested object)

### Partner Structure:
- `id`, `businessName`, `description`, `imageUrl`
- `rating`, `reviewCount`, `cuisineType`, `location`

### Plan Structure:
- `id`, `name`, `description`, `price`, `duration`
- `features[]`, `mealsPerDay`, `imageUrl`

---

## 🎯 FEATURES TO IMPLEMENT

### Core Features:
1. **Authentication**: Login, registration, OTP verification
2. **Onboarding**: Multi-step onboarding flow
3. **Dashboard**: Stats, meals, quick actions
4. **Order Management**: View, track, rate orders
5. **Subscription Management**: Browse, subscribe, manage plans
6. **Profile Management**: Edit profile, addresses, payment methods
7. **Real-time Tracking**: Live order status updates
8. **Notifications**: Push notifications, in-app notifications
9. **Search & Discovery**: Search partners, browse plans
10. **Support**: Help center, live chat, feedback

### Technical Features:
- Pull-to-refresh on all data screens
- Loading states with spinners
- Empty states with helpful messages
- Error handling with user-friendly messages
- Offline support (cache data, show cached when offline)
- Image optimization and lazy loading
- Smooth animations and transitions
- Form validation
- Input sanitization

---

## 🚀 DEVELOPMENT WORKFLOW

### Phase 1: Dummy Data App (MANDATORY FIRST)
1. Create complete app structure
2. Build all screens with dummy/mock data
3. Implement all navigation flows
4. Style all components
5. Test visual appearance
6. Show complete app visually

### Phase 2: API Integration
1. Set up API client with base URL configuration
2. Implement authentication flow
3. Integrate all API endpoints
4. Replace dummy data with real API calls
5. Handle loading/error states
6. Implement token refresh logic

### Phase 3: Native Features
1. Set up CapacitorJS configuration
2. Integrate Capacitor plugins (camera, notifications, etc.)
3. Test on iOS/Android devices
4. Handle native permissions
5. Optimize for mobile performance

### Phase 4: Polish & Testing
1. Test all flows end-to-end
2. Fix bugs and edge cases
3. Optimize performance
4. Test on multiple devices
5. Final visual polish

---

## 📦 CAPACITORJS SETUP REQUIREMENTS

**Must Include**:
- `capacitor.config.ts` or `capacitor.config.json` configuration
- Capacitor plugins setup:
  - `@capacitor/push-notifications` - For push notifications
  - `@capacitor/camera` - For profile image uploads
  - `@capacitor/geolocation` - For location services
  - `@capacitor/filesystem` - For file operations
  - `@capacitor/status-bar` - For status bar styling
  - `@capacitor/app` - For app lifecycle
  - `@capacitor/network` - For network status

**Native Build Configuration**:
- iOS: Configure `Info.plist` permissions
- Android: Configure `AndroidManifest.xml` permissions
- Handle safe areas for notches
- Configure splash screens
- Set app icons

---

## 🎨 UI/UX REQUIREMENTS

### States to Handle:
- **Loading**: Show spinners, skeleton screens
- **Empty**: Show helpful empty states with CTAs
- **Error**: Show user-friendly error messages with retry options
- **Success**: Show success messages/animations
- **Offline**: Show offline indicator, use cached data

### Interactions:
- Pull-to-refresh on scrollable lists
- Smooth page transitions
- Loading indicators on actions
- Toast notifications for feedback
- Modal dialogs for confirmations
- Bottom sheets for actions

### Accessibility:
- Proper contrast ratios
- Readable font sizes
- Touch target sizes (minimum 44x44px)
- Screen reader support
- Keyboard navigation

---

## 📱 RESPONSIVE DESIGN

- Mobile-first approach
- Support various screen sizes
- Handle portrait/landscape orientation
- Safe area handling (notches, status bars)
- Keyboard avoiding views for forms
- Bottom tab navigation stays fixed

---

## 🔄 REAL-TIME FEATURES

### WebSocket/SSE Integration:
- Real-time order status updates
- Live notifications
- Subscription status changes
- Partner availability updates

**Implementation**:
- Use Server-Sent Events (SSE) for notifications
- Use WebSocket for order tracking
- Handle connection drops and reconnection
- Show connection status indicator

---

## ✅ DELIVERABLES

### Must Deliver:
1. ✅ Complete app structure with all screens
2. ✅ Beautiful, modern UI design
3. ✅ All navigation flows working
4. ✅ Dummy data implementation (first phase)
5. ✅ API integration setup (second phase)
6. ✅ CapacitorJS configuration
7. ✅ Native plugins integration
8. ✅ Environment configuration
9. ✅ Error handling throughout
10. ✅ Loading/empty states
11. ✅ Responsive design
12. ✅ Documentation

---

## 🚨 CRITICAL REMINDERS

1. **NO CODE IN PROMPT**: Focus on requirements, structure, and details - NOT code implementation
2. **DUMMY DATA FIRST**: Must create complete app with mock data before API integration
3. **CAPACITORJS**: Must be structured for CapacitorJS compilation to iOS/Android
4. **VISUAL FIRST**: We need to see and approve the complete app visually before proceeding
5. **MODERN DESIGN**: Use contemporary, beautiful design - not generic orange/cream
6. **PRODUCTION READY**: Build for production, not just demo

---

## 📝 FINAL NOTES

This is a **complete, production-ready mobile application** that will be deployed to iOS and Android app stores. Focus on:
- **Quality**: Professional, polished code and design
- **User Experience**: Smooth, intuitive, delightful
- **Performance**: Fast, optimized, responsive
- **Maintainability**: Clean structure, well-organized
- **Scalability**: Easy to extend and modify

**Remember**: First create the beautiful visual app with dummy data so we can see the complete design. Then integrate APIs. Build something we'll be proud to ship to users.

---

**Let's build something amazing! 🚀**
