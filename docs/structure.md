# TiffinWale Student App - Code Structure

## Project Overview

The TiffinWale Student App is built using React Native with Expo, utilizing TypeScript for type safety. The project follows a modern, modular architecture with file-based routing through expo-router.

## Directory Structure

```
interface/student-app/
├── app/                  # Main application screens and routing
│   ├── (auth)/           # Authentication screens (login, signup)
│   ├── (tabs)/           # Main tab navigation screens
│   └── _layout.tsx       # Root layout component
├── assets/               # Static assets (images, fonts)
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── store/                # State management (Zustand)
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Core Directories Explained

### `/app` Directory

The `/app` directory uses the Expo Router's file-based routing system:

- **`_layout.tsx`**: Root layout component that sets up fonts, theming and navigation container
- **`index.tsx`**: Entry point screen, used for initial app loading or redirect
- **`+not-found.tsx`**: 404 screen for invalid routes
- **`profile.tsx`**: User profile screen
- **`help-support.tsx`**: Help and support screen
- **`faq.tsx`**: Frequently asked questions screen
- **`subscription-checkout.tsx`**: Checkout flow for subscription plans

#### `/app/(auth)` Directory

Contains authentication-related screens:

- **`_layout.tsx`**: Layout wrapper for auth screens
- **`login.tsx`**: User login screen
- **`signup.tsx`**: User registration screen
- **`welcome.tsx`**: Initial welcome/onboarding screen

#### `/app/(tabs)` Directory

Contains the main tab navigation screens:

- **`_layout.tsx`**: Tab navigation configuration
- **`index.tsx`**: Home/dashboard screen (default tab)
- **`plans.tsx`**: Subscription plans screen
- **`orders.tsx`**: Order history and tracking
- **`profile.tsx`**: User profile management
- **`track.tsx`**: Live meal tracking screen

### `/components` Directory

Reusable UI components used across multiple screens:

- **`MealCard.tsx`**: Card component for displaying meal information
- **`NoSubscriptionDashboard.tsx`**: Dashboard view for users without active subscriptions
- **`ActiveSubscriptionDashboard.tsx`**: Dashboard view for users with active subscriptions
- **`AdditionalOrderCard.tsx`**: Component for displaying additional one-time orders
- **`MealHistoryCard.tsx`**: Component for displaying past meal history

### `/store` Directory

State management using Zustand:

- **`authStore.ts`**: Authentication state (user data, login, registration)
- **`mealStore.ts`**: Meal-related state (current meals, meal history)
- **`restaurantStore.ts`**: Restaurant-related state (empty file, appears to be planned)

### `/types` Directory

TypeScript type definitions:

- **`index.ts`**: Contains interface definitions for domain objects (User, Meal, Restaurant, etc.)
- **`env.d.ts`**: Type definitions for environment variables

### `/utils` Directory

Helper functions:

- **`dateUtils.ts`**: Date formatting and manipulation utilities
- **`mealUtils.ts`**: Meal-related utility functions

### `/hooks` Directory

Custom React hooks:

- **`useFrameworkReady.ts`**: Hook for detecting when the framework is ready

## Key Configuration Files

- **`app.json`**: Expo configuration file defining app metadata and settings
- **`package.json`**: Node.js package definition with dependencies and scripts
- **`tsconfig.json`**: TypeScript configuration
- **`app.yaml`**: Google Cloud App Engine deployment configuration
- **`.prettierrc`**: Code formatting rules

## Technology Stack Overview

The app is built using the following key technologies:

- **React Native** with **Expo**: Core framework for cross-platform mobile development
- **TypeScript**: For static typing and improved developer experience
- **Expo Router**: For declarative, file-based navigation
- **Zustand**: For lightweight state management
- **React Native Reanimated**: For fluid animations
- **Expo Vector Icons**: For UI iconography 