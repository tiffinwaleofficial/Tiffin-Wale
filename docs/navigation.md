# TiffinWale Student App - Navigation Structure

## Navigation Overview

The TiffinWale Student App uses Expo Router for file-based navigation, combined with React Navigation for tab-based navigation in the main app area. The navigation structure is organized into three main sections:

1. **Entry Flow**: Initial app loading and routing
2. **Authentication Flow**: Login, registration, and onboarding
3. **Main App Flow**: Tab-based navigation for authenticated users

## App Flow Diagram

```
┌─ Entry Point (index.tsx)
│
├─ Authentication Flow (/(auth)/)
│  ├─ Welcome / Onboarding (welcome.tsx)
│  ├─ Login (login.tsx)
│  └─ Signup (signup.tsx)
│
├─ Main Application (/(tabs)/)
│  ├─ Dashboard (index.tsx)
│  ├─ Plans (plans.tsx)
│  ├─ Order Tracking (track.tsx)
│  ├─ Order History (orders.tsx)
│  └─ Profile (profile.tsx)
│
└─ Standalone Screens
   ├─ Profile Details (profile.tsx - root level)
   ├─ Help & Support (help-support.tsx)
   ├─ FAQ (faq.tsx)
   ├─ Subscription Checkout (subscription-checkout.tsx)
   └─ Not Found (+not-found.tsx)
```

## Navigation Flows Explained

### 1. Initial Entry

When the app launches, it first checks for an authenticated user:
- If no authenticated user, redirects to the welcome/onboarding screen
- If authenticated user exists, redirects to the main dashboard

This logic is handled in the root `index.tsx` file, which acts as a router to either the authentication flow or the main application tabs.

### 2. Authentication Flow

The authentication flow is contained within the `(auth)` group:

- **Welcome Screen** (`welcome.tsx`): Initial landing screen with app introduction and options to login or signup
- **Login Screen** (`login.tsx`): Email/password authentication form for returning users
- **Signup Screen** (`signup.tsx`): Registration form for new users

After successful authentication, users are redirected to the main dashboard.

### 3. Main Application Navigation

The main application uses a bottom tab navigation system defined in `(tabs)/_layout.tsx`:

- **Dashboard Tab** (`index.tsx`): Home screen displaying today's meals and subscription status
- **Plans Tab** (`plans.tsx`): Available subscription plans with options to subscribe or modify
- **Track Tab** (`track.tsx`): Live tracking of meal preparation and delivery
- **Orders Tab** (`orders.tsx`): History of past meals and additional orders
- **Profile Tab** (`profile.tsx`): User profile and account settings

### 4. Standalone Screens

Several screens exist outside the tab navigation for specific workflows:

- **Profile Details** (`profile.tsx` at root level): Extended profile editing
- **Help & Support** (`help-support.tsx`): Customer support interface
- **FAQ** (`faq.tsx`): Frequently asked questions
- **Subscription Checkout** (`subscription-checkout.tsx`): Payment and confirmation flow for subscriptions
- **Not Found** (`+not-found.tsx`): 404 error screen for invalid routes

## Navigation Implementation

The app uses a combination of:

1. **Expo Router File-Based Routing**:
   - Directory structure defines navigation hierarchy
   - Named files create routes (`index.tsx`, `profile.tsx`, etc.)
   - Special files like `_layout.tsx` define layout wrappers

2. **React Navigation Components**:
   - `Stack` component for screen transitions
   - `Tabs` component for bottom tab navigation

### Navigation Configuration

The root layout in `app/_layout.tsx` configures the Stack navigation:

```tsx
<Stack screenOptions={{ 
  headerShown: false,
  contentStyle: { backgroundColor: '#FFFAF0' }
}}>
  <Stack.Screen name="index" options={{ animation: 'fade' }} />
  <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
  <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
  <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
</Stack>
```

The tab navigation in `app/(tabs)/_layout.tsx` configures the bottom tabs with specific icons and options for each route. 