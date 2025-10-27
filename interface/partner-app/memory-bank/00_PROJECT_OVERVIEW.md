# 🏢 TiffinWale Partner App - Project Overview

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Status:** Active Development

---

## 📋 Executive Summary

The **TiffinWale Partner App** is a comprehensive restaurant management platform built using **React Native + Expo** for mobile (iOS, Android) and web platforms. It empowers restaurant partners to manage orders, menus, profiles, earnings, and customer interactions through an intuitive interface.

---

## 🎯 Project Goals

### Primary Objectives
- Enable restaurant partners to manage orders in real-time
- Provide comprehensive business analytics and insights
- Streamline menu management and updates
- Facilitate direct customer communication
- Monitor earnings and revenue metrics

### Key Features
- ✅ **Authentication System** - Secure phone/email login with JWT tokens
- ✅ **Dashboard Analytics** - Real-time order and revenue statistics
- ✅ **Order Management** - View, accept, reject, and track order status
- ✅ **Menu Management** - CRUD operations for menu items and categories
- ✅ **Profile Management** - Update business information, hours, branding
- ✅ **Status Control** - Toggle accepting new orders on/off
- 🚧 **Earnings Tracking** - Revenue analytics and payout management
- 🚧 **Notifications** - Real-time order and system notifications
- 🚧 **Customer Chat** - Direct communication with customers

---

## 🏗️ Technology Stack

### Frontend
- **Framework:** React Native 0.81.4
- **Routing:** Expo Router (file-based routing)
- **State Management:** Zustand 4.4.7
- **Data Fetching:** React Query (@tanstack/react-query 5.90.3)
- **UI Components:** Custom components + Lucide React Native
- **Forms:** React Native Form controls
- **Internationalization:** i18next + react-i18next
- **Navigation:** React Navigation 7.x

### Backend Integration
- **API Client:** Axios with custom interceptors
- **API Generation:** swagger-typescript-api (OpenAPI)
- **Base URL:** Configurable via `.env` (default: `http://localhost:3001`)

### Security & Auth
- **Token Management:** SecureTokenManager (expo-secure-store)
- **JWT Authentication:** Bearer token-based
- **Token Refresh:** Automatic with SecureTokenManager
- **Platform-Specific Storage:** SecureStore (mobile) + AsyncStorage (web)

### Cloud Services
- **Image Upload:** Cloudinary
- **Real-time:** WebSocket (Socket.IO) + Firebase
- **Push Notifications:** Expo Notifications
- **Analytics:** Vercel Analytics (web only)

### Development Tools
- **Package Manager:** Bun 1.0.0
- **Language:** TypeScript 5.9.2
- **Bundler:** Metro (Expo)
- **Testing:** Jest (to be implemented)
- **Linting:** ESLint
- **Formatter:** Prettier

---

## 📂 High-Level Folder Structure

```
partner-app/
├── app/                        # Expo Router app screens
│   ├── (auth)/                # Authentication screens
│   ├── (tabs)/                # Main app tabs
│   ├── onboarding/            # Partner onboarding flow
│   └── _layout.tsx             # Root layout
├── api/                       # API integration layer
│   ├── generated/             # Auto-generated API client
│   ├── custom-instance.ts     # Custom Axios instance
│   └── hooks/                 # React Query hooks
├── auth/                      # Authentication logic
│   └── SecureTokenManager.ts  # Secure token management
├── components/                 # Reusable UI components
│   ├── auth/                  # Auth-related components
│   ├── business/              # Business-specific components
│   ├── feedback/              # Loading/Error/Empty states
│   ├── forms/                  # Form components
│   ├── layout/                 # Layout components
│   ├── ui/                     # UI primitives
│   └── navigation/             # Navigation components
├── config/                     # Configuration files
│   ├── env.ts                  # Environment variables
│   ├── environment.ts          # Platform-aware config
│   └── firebase.ts             # Firebase setup
├── context/                    # React Context providers
│   └── AuthProvider.tsx        # Auth context
├── hooks/                      # Custom React hooks
├── i18n/                       # Internationalization
│   ├── config.ts               # i18n configuration
│   └── resources/              # Translation files
├── services/                   # Business logic services
│   ├── cloudinaryUploadService.ts
│   ├── navigationService.ts
│   └── phoneAuthService.ts
├── store/                      # Zustand stores
│   ├── authStore.ts           # Auth state
│   ├── partnerStore.ts         # Partner profile
│   ├── orderStore.ts           # Order management
│   ├── onboardingStore.ts      # Onboarding state
│   └── notificationStore.ts    # Notifications
├── theme/                      # Theming system
│   ├── themeProvider.tsx
│   └── themes.ts
├── types/                      # TypeScript definitions
│   ├── auth.ts                 # Auth types
│   ├── partner.ts              # Partner types
│   └── order.ts                # Order types
├── utils/                      # Utility functions
│   ├── apiClient.ts            # API client
│   ├── authService.ts          # Auth utilities
│   ├── cloudinaryService.ts    # Cloudinary helpers
│   └── websocketManager.ts     # WebSocket manager
└── docs/                       # Documentation
    ├── README.md
    ├── Development_Guide.md
    └── API_Status.md
```

---

## 🎨 Architecture Patterns

### 1. **State Management Pattern**
Uses **Zustand** with persistence middleware:
- Auth state managed by `authStore`
- Business data in scoped stores (`partnerStore`, `orderStore`)
- Persistent storage via AsyncStorage
- Secure token management via SecureTokenManager

### 2. **API Integration Pattern**
Layered approach:
- **Base Layer:** Custom Axios instance with interceptors (`utils/apiClient.ts`)
- **Generated Layer:** Auto-generated API client from OpenAPI spec
- **Store Layer:** Zustand stores wrapping API calls
- **Component Layer:** React hooks consuming store data

### 3. **Authentication Flow**
1. User submits credentials (phone/email)
2. API returns JWT tokens (access + refresh)
3. Tokens stored securely via SecureTokenManager
4. Token attached to all subsequent API requests
5. Automatic refresh on 401 errors
6. Auto-logout on refresh failure

### 4. **Routing Strategy**
File-based routing with Expo Router:
- `(auth)/` - Unauthenticated routes
- `(tabs)/` - Authenticated main app
- `onboarding/` - Partner registration flow
- Protected routes via `ProtectedRoute` component

---

## 🔧 Environment Setup

### Required Environment Variables
```bash
# API Configuration
API_BASE_URL=http://localhost:3001        # Local development
API_BASE_URL=https://api.tiffin-wale.com    # Production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
CLOUDINARY_UPLOAD_PRESET=your_preset

# Firebase (optional)
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
```

### Setup Commands
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Generate API client from backend
bun run api:generate

# Check environment
bun run check:env
```

---

## 🚀 Development Workflow

### Local Development
1. **Backend must be running** on `http://localhost:3001`
2. **Generate API client** from backend Swagger spec
3. **Start Expo dev server** with `bun run dev`
4. **Test on device/emulator** using Expo Go or development build

### API Integration Process
1. Backend creates new endpoint
2. Update `api-docs.json` (copy from backend)
3. Run `bun run api:generate` to regenerate client
4. Add types to appropriate store
5. Consume in UI components

---

## 📊 Current Implementation Status

### ✅ Implemented Features
- Authentication system (phone + email)
- Dashboard with statistics
- Order listing and filtering
- Partner profile management
- Menu management UI (CRUD ready)
- Status toggle (accepting orders)
- Real-time WebSocket integration
- Secure token management

### 🚧 In Progress
- Order actions (accept/reject/mark ready)
- Image upload functionality
- Advanced analytics
- Notifications system

### 📋 Planned Features
- Customer chat integration
- Payout management
- Support ticket system
- Advanced reporting

---

## 🔗 Related Documentation

- [Development Guide](./01_DEVELOPMENT_GUIDE.md)
- [API Integration Status](./02_API_STATUS.md)
- [Architecture Patterns](./03_ARCHITECTURE_PATTERNS.md)
- [State Management](./04_STATE_MANAGEMENT.md)
- [Component Library](./05_COMPONENT_LIBRARY.md)
- [Progress Tracking](./06_PROGRESS_TRACKING.md)

---

## 👥 Team

**Product:** TiffinWale Platform  
**Repository:** Tiffin-Wale/interface/partner-app  
**Package Manager:** Bun 1.0.0  
**Node Version:** 18+

---

## 📝 Notes

- All API endpoints require JWT Bearer token authentication
- Backend runs on NestJS with PostgreSQL database
- API documentation available via Swagger at `/api-docs-json`
- Frontend uses TypeScript for type safety
- Components follow atomic design principles

