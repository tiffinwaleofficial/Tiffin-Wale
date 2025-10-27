# 🎯 Scope-Specific Onboarding Prompts

**Last Updated:** December 2024  
**Purpose:** Enable developers to quickly get context for specific work scopes

---

## 🚀 How to Use

1. Copy the prompt for your scope
2. Paste it into your AI assistant
3. Get instant context about that scope
4. Start working efficiently

---

## 📱 FRONTEND - React Native Development

### Onboarding Prompt
```
You are working on the FRONTEND scope of the TiffinWale Partner App.

CONTEXT:
- This is a React Native + Expo app for restaurant partners
- Uses Zustand for state management, React Query for data fetching
- File-based routing with Expo Router
- Components organized by atomic design (atoms → molecules → organisms)

KEY FILES TO READ FIRST:
1. memory-bank/05_COMPONENT_LIBRARY.md - Component reference
2. memory-bank/04_STATE_MANAGEMENT.md - Store patterns
3. memory-bank/03_ARCHITECTURE_PATTERNS.md - Architecture overview
4. components/ui/ - UI primitive components
5. store/ - State management stores

CURRENT TASKS:
- Building order management UI
- Connecting real-time updates
- Implementing image upload

TECH STACK:
- React Native 0.81.4
- Expo SDK 54
- Zustand 4.4.7
- React Query 5.90.3
- TypeScript 5.9.2

Get me started with frontend development on this project.
```

---

## 🔌 BACKEND INTEGRATION

### Onboarding Prompt
```
You are working on the BACKEND INTEGRATION scope of the TiffinWale Partner App.

CONTEXT:
- App connects to NestJS backend API
- 7 critical APIs already implemented and ready
- API client auto-generated from OpenAPI spec
- JWT authentication with automatic token refresh

KEY FILES TO READ FIRST:
1. memory-bank/02_API_ENDPOINTS.md - Complete API reference
2. utils/apiClient.ts - API client implementation
3. auth/SecureTokenManager.ts - Token management
4. api/custom-instance.ts - Custom Axios instance
5. store/authStore.ts, partnerStore.ts, orderStore.ts - API consumers

READY-TO-USE APIs:
- GET /partners/user/me - Get current profile
- PUT /partners/me - Update profile
- GET /partners/orders/me - Get orders (paginated)
- GET /partners/orders/me/today - Today's orders
- GET /partners/menu/me - Get menu
- GET /partners/stats/me - Get statistics
- PUT /partners/status/me - Toggle accepting orders

AUTHENTICATION:
- All endpoints require Bearer token
- Tokens managed by SecureTokenManager
- Auto-refresh on 401 errors
- Base URL configurable via .env

Get me started with backend integration work.
```

---

## 🎨 UI/UX DESIGN

### Onboarding Prompt
```
You are working on the UI/UX scope of the TiffinWale Partner App.

CONTEXT:
- Custom component library with 50+ components
- Atomic design pattern (atoms → molecules → organisms)
- Consistent theming system
- Responsive design for mobile + web

KEY FILES TO READ FIRST:
1. memory-bank/05_COMPONENT_LIBRARY.md - Complete component reference
2. components/ui/ - UI primitive components
3. theme/themes.ts - Theme definitions
4. components/feedback/ - Loading/error states
5. app.config.ts - App configuration

COMPONENT TYPES:
- Auth components (ProtectedRoute, AuthGuard)
- Business components (OrderCard, MenuItemCard, StatsCard)
- Feedback components (Loader, ErrorState, EmptyState, Toast)
- Form components (FormInput, FormCheckbox, FormSelect)
- Layout components (Screen, Container, Card, Modal, Sheet)
- Navigation components (Header, BackButton, TabBar)
- UI primitives (Button, Text, Input, Avatar, Badge, Icon)

DESIGN TOKENS:
- Primary color: #FF9B42
- Background: #FFFAF0
- Text: #333333
- Font: Poppins (Regular, Medium, SemiBold, Bold)

Get me started with UI/UX design work.
```

---

## 🧪 TESTING & QUALITY ASSURANCE

### Onboarding Prompt
```
You are working on the TESTING scope of the TiffinWale Partner App.

CONTEXT:
- React Native + Expo app with TypeScript
- Zustand stores for state management
- Custom hooks for business logic
- No tests currently implemented (pending)

KEY FILES TO READ FIRST:
1. memory-bank/06_PROGRESS_TRACKING.md - Current status
2. store/authStore.ts, partnerStore.ts, orderStore.ts - Stores to test
3. utils/apiClient.ts - API client to mock
4. components/ - Components to test
5. memory-bank/04_STATE_MANAGEMENT.md - Store patterns

TESTING REQUIREMENTS:
- Unit tests for stores (Zustand)
- Component tests (React Testing Library)
- Integration tests for API flows
- E2E tests for critical user flows

FOCUS AREAS:
1. Authentication flow (login, logout, token refresh)
2. Order management (CRUD operations)
3. Partner profile updates
4. Real-time WebSocket updates
5. Form validation

PRIORITY:
- High: Store unit tests
- High: Critical component tests
- Medium: Integration tests
- Low: E2E tests

Get me started with testing implementation.
```

---

## 🚀 DEVOPS & DEPLOYMENT

### Onboarding Prompt
```
You are working on the DEVOPS scope of the TiffinWale Partner App.

CONTEXT:
- Expo managed workflow
- Deployments to multiple platforms (iOS, Android, Web)
- Uses Bun as package manager
- Environment-based configuration

KEY FILES TO READ FIRST:
1. app.config.ts - Expo configuration
2. vercel.json - Web deployment config
3. config/environment.ts - Environment setup
4. package.json - Scripts and dependencies
5. memory-bank/00_PROJECT_OVERVIEW.md - Project overview

DEPLOYMENT TARGETS:
- Web: Vercel (configured)
- Android: Play Store (pending setup)
- iOS: App Store (pending setup)

ENVIRONMENT VARIABLES:
- API_BASE_URL (development: localhost:3001)
- CLOUDINARY_* (image upload)
- Firebase (authentication)

SETUP SCRIPTS:
- bun run dev - Start development server
- bun run api:generate - Generate API client
- bun run check:env - Validate environment
- bun run build:web - Build for web
- bun run deploy:vercel - Deploy to Vercel

CURRENT STATUS:
- ✅ Web deployment configured
- ⏳ CI/CD pipeline pending
- ⏳ Mobile app builds pending

Get me started with DevOps/deployment work.
```

---

## 📊 DATABASE & DATA MODELS

### Onboarding Prompt
```
You are working on the DATABASE scope of the TiffinWale Partner App.

CONTEXT:
- Frontend TypeScript definitions mirror backend models
- PostgreSQL database with NestJS backend
- Type-safe data models throughout app

KEY FILES TO READ FIRST:
1. types/auth.ts - Auth type definitions
2. types/partner.ts - Partner and business types
3. types/order.ts - Order data models
4. memory-bank/02_API_ENDPOINTS.md - API data structures
5. store/ stores for data usage patterns

DATA MODELS:
- AuthUser (id, email, role, firstName, lastName)
- PartnerProfile (business info, location, hours, stats)
- Order (id, items, customer, status, timestamps)
- MenuItem (name, price, category, availability)
- MenuCategory, Review, Earnings, Notification

KEY ENTITIES:
- users - Authentication
- partners - Business profiles
- orders - Order management
- menu_items - Menu catalog
- reviews - Customer reviews
- notifications - System notifications

CURRENT FOCUS:
- Optimize queries for order listing
- Implement real-time updates
- Add analytics aggregations

Get me started with database-related frontend work.
```

---

## 🔄 REAL-TIME FEATURES

### Onboarding Prompt
```
You are working on the REAL-TIME scope of the TiffinWale Partner App.

CONTEXT:
- WebSocket integration for real-time updates
- Socket.IO client implemented
- Stores support real-time state updates
- Automatic reconnection handling

KEY FILES TO READ FIRST:
1. utils/websocketManager.ts - WebSocket client
2. hooks/useWebSocket.ts - WebSocket hook
3. store/orderStore.ts - Real-time order updates
4. memory-bank/03_ARCHITECTURE_PATTERNS.md - Patterns
5. memory-bank/04_STATE_MANAGEMENT.md - Store patterns

REAL-TIME EVENTS:
- order_created - New order received
- order_updated - Order status changed
- order_cancelled - Order cancelled
- notification - New notification

IMPLEMENTATION:
- Automatic reconnection on disconnect
- Store updates on WebSocket events
- UI updates on state changes
- Error handling and retry logic

GET STARTED:
1. Review useWebSocket hook
2. Check orderStore real-time updates
3. Test WebSocket connection
4. Implement new event handlers

Get me started with real-time feature development.
```

---

## 🔔 NOTIFICATIONS SYSTEM

### Onboarding Prompt
```
You are working on the NOTIFICATIONS scope of the TiffinWale Partner App.

CONTEXT:
- Multi-channel notifications (push, in-app, SMS)
- Expo Notifications for push
- Store for notification management
- Real-time WebSocket integration

KEY FILES TO READ FIRST:
1. store/notificationStore.ts - Notification state
2. components/NotificationContainer.tsx - Wrapper
3. components/business/NotificationCard.tsx - UI
4. utils/websocketManager.ts - Real-time updates
5. memory-bank/04_STATE_MANAGEMENT.md - Store patterns

NOTIFICATION TYPES:
- NEW_ORDER - Order received
- ORDER_CANCELLED - Order cancelled
- PAYMENT_RECEIVED - Payment notification
- REVIEW_RECEIVED - New review
- PROFILE_UPDATE - Profile changes
- SYSTEM_ANNOUNCEMENT - System messages

IMPLEMENTATION STATUS:
- ✅ Store created
- ✅ UI components ready
- ⏳ Backend API pending
- ⏳ Push notifications setup

GET STARTED:
1. Review notificationStore
2. Check NotificationCard component
3. Implement backend integration
4. Add push notification setup

Get me started with notifications development.
```

---

## 💡 QUICK REFERENCE

### By Task Type

**Creating a new screen:**
1. Copy template from `app/(tabs)/dashboard.tsx`
2. Add route to `app/(tabs)/`
3. Import necessary stores
4. Use components from library
5. Handle loading/error states

**Integrating a new API:**
1. Check `memory-bank/02_API_ENDPOINTS.md` for endpoint
2. Add to `utils/apiClient.ts`
3. Create store actions in appropriate store
4. Use in components

**Adding a new component:**
1. Create in `components/` appropriate subdirectory
2. Follow atomic design pattern
3. Add to `components/index.ts`
4. Use in screens

**Working with stores:**
1. Read `memory-bank/04_STATE_MANAGEMENT.md`
2. Check existing stores for patterns
3. Add state + actions
4. Use in components with hooks

---

## 🎯 Universal Context Prompt

**Use this when starting ANY work on this project:**

```
I'm working on the TiffinWale Partner App, a React Native + Expo restaurant management platform.

Quick context:
- React Native + Expo + TypeScript
- Zustand for state, React Query for data
- Expo Router file-based routing
- Components: components/ directory
- Stores: store/ directory
- API: utils/apiClient.ts
- Types: types/ directory

Key files to know:
- memory-bank/ - Complete project documentation
- app/ - Application screens (file-based routing)
- store/ - State management (Zustand)
- components/ - Reusable components
- utils/ - Utilities and API client

Current focus: [YOUR SCOPE HERE]

Help me understand what I need to know for this scope and get started.
```

---

## 🔗 Navigation

- [Full Project Overview](./00_PROJECT_OVERVIEW.md)
- [Complete Folder Structure](./01_FOLDER_STRUCTURE.md)
- [API Endpoints](./02_API_ENDPOINTS.md)
- [Architecture Patterns](./03_ARCHITECTURE_PATTERNS.md)
- [State Management](./04_STATE_MANAGEMENT.md)
- [Component Library](./05_COMPONENT_LIBRARY.md)
- [Progress Tracking](./06_PROGRESS_TRACKING.md)

