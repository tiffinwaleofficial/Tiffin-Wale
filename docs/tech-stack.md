# TiffinWale Student App - Technology Stack

This document outlines the core technologies, libraries, and architectural patterns used in the TiffinWale Student App.

## Core Framework

### React Native & Expo

The app is built using **React Native** (v0.76.6) with **Expo** (v52.0.33), providing:

- Cross-platform capability (iOS, Android, and Web)
- Simplified development workflow
- OTA updates capability
- Managed native modules
- Easier deployment process

### TypeScript

The entire codebase uses **TypeScript** (v5.3.3) for:

- Type safety and error prevention
- Improved developer experience with autocompletion
- Better code documentation and readability
- Easier refactoring and maintenance

## UI & Component Libraries

### Native Components

- **React Native Core Components**: View, Text, Image, etc.
- **Expo-specific UI components**: BlurView, LinearGradient, etc.

### Icons & Visuals

- **@expo/vector-icons** (v14.0.2): Comprehensive icon library
- **Lucide React Native** (v0.475.0): Modern icon set with consistent design
- **Expo Linear Gradient** (v14.0.2): For gradient backgrounds and UI elements

### Animations & Gestures

- **React Native Reanimated** (v3.16.7): Advanced animations with better performance
- **React Native Gesture Handler** (v2.23.0): Native-driven gesture handling

## Navigation

### Expo Router & React Navigation

- **Expo Router** (v4.0.17): File-based routing system
- **React Navigation** (v7.0.14): Tab and stack navigation
  - **Bottom Tabs** (v7.2.0): For the main tab navigation
  - **Native Stack**: For screen transitions

## State Management

### Zustand

The app uses **Zustand** (v4.5.2) for state management:

- Lightweight and simple API
- Minimal boilerplate compared to Redux
- Hook-based state consumption
- Easy integration with TypeScript

Key stores:
- `authStore.ts`: Authentication state
- `mealStore.ts`: Meal-related state management

## Networking & Data Fetching

Currently, the app uses mock data with simulated API calls. The architecture is designed to be easily connected to real backend services.

Future implementation will leverage:
- **Fetch API** or **Axios** for data fetching
- JWT token-based authentication
- RESTful API consumption

## App Capabilities & Device Features

- **Expo Camera** (v16.0.18): For QR code scanning and image capture
- **Expo Haptics** (v14.0.1): For tactile feedback
- **Expo Web Browser** (v14.0.2): For opening external links
- **Expo Linking** (v7.0.5): For deep linking

## Styling & Theming

- **StyleSheet API**: React Native's built-in styling system
- **Custom theming system**: Consistent colors and typography
- **Custom fonts**: Poppins font family using Expo Google Fonts

## Development & Tooling

- **Prettier** (via .prettierrc): Code formatting
- **ESLint** (via Expo Lint): Code quality and consistency
- **Expo CLI**: Development server and build tools

## Deployment & Infrastructure

- **Expo Build System**: For generating native binaries
- **Google Cloud App Engine**: For web deployment
- **Expo PWA**: For Progressive Web App capabilities

## Folder Structure Organization

The app follows a feature-based organization combined with type-based segregation:

- **Screens**: Organized by route in the `/app` directory
- **Components**: Reusable UI components in `/components`
- **State**: Centralized in `/store` using Zustand
- **Types**: Domain and utility types in `/types`
- **Utilities**: Helper functions in `/utils`

## Backend Integration Pattern

While the app currently uses mock data, it is designed to integrate with a RESTful backend:

### API Structure (Planned)

```
/api
  /auth
    - login
    - register
    - refresh-token
  /meals
    - today
    - history
    - tracking
  /subscriptions
    - plans
    - active
    - manage
  /profile
    - details
    - update
  /support
    - contact
    - faq
```

### Authentication Flow (Planned)

1. Login/signup via API endpoints
2. Store JWT token securely
3. Include token in Authorization header for authenticated requests
4. Handle token refresh for session persistence
5. Clear token on logout

## Progressive Web App Features

The app is configured as a PWA for web deployment with:

- Customized `manifest.json` generated from app.json
- Service worker for offline capability
- Responsive design for various screen sizes
- Web-optimized assets 