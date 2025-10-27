# 📁 Complete Folder Structure Map

**Generated:** December 2024  
**Scope:** Complete Partner App Directory Tree

---

## 📂 Detailed Directory Structure

```
partner-app/
├── 📄 Configuration Files (Root)
│   ├── app.config.ts                   # Expo app configuration
│   ├── app.yaml                        # Google Cloud deployment config
│   ├── package.json                     # Dependencies and scripts
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── babel.config.js                 # Babel transpilation config
│   ├── metro.config.js                 # Metro bundler configuration
│   ├── orval.config.ts                 # OpenAPI code generation config
│   ├── vercel.json                     # Vercel deployment configuration
│   ├── bun.lock                        # Bun lock file
│   ├── index.html                      # Web entry HTML
│   └── custom-fonts.css                # Custom font imports
│
├── 📱 app/                             # Expo Router Application (MAIN)
│   ├── _layout.tsx                    # Root layout wrapper
│   ├── index.tsx                       # Entry point
│   ├── +not-found.tsx                 # 404 error page
│   │
│   ├── 🔐 (auth)/                      # Authentication Flow
│   │   ├── _layout.tsx                # Auth layout
│   │   ├── login.tsx                  # Email/phone login screen
│   │   ├── phone-input.tsx            # Phone number input
│   │   └── otp-verification.tsx      # OTP verification
│   │
│   ├── 🏠 (tabs)/                      # Main App Tabs (Authenticated)
│   │   ├── _layout.tsx                # Tab layout with bottom bar
│   │   ├── index.tsx                   # Dashboard tab
│   │   ├── dashboard.tsx              # Dashboard screen
│   │   ├── orders.tsx                 # Orders listing
│   │   ├── menu.tsx                    # Menu management
│   │   ├── earnings.tsx               # Earnings/analytics
│   │   ├── notifications.tsx          # Notifications
│   │   ├── profile.tsx                # Partner profile
│   │   ├── profile/
│   │   │   ├── bank-account.tsx       # Bank account management
│   │   │   ├── business-profile.tsx    # Business profile editor
│   │   │   ├── chat.tsx               # Customer chat
│   │   │   ├── help.tsx               # Help center
│   │   │   ├── privacy.tsx            # Privacy policy
│   │   │   └── terms.tsx              # Terms of service
│   │
│   └── 🆕 onboarding/                  # Partner Onboarding Flow
│       ├── welcome.tsx                 # Welcome screen
│       ├── account-setup.tsx          # Personal account setup
│       ├── business-profile.tsx       # Business information
│       ├── cuisine-services.tsx       # Cuisine & services
│       ├── documents.tsx              # Document upload
│       ├── images-branding.tsx        # Logo & branding
│       ├── location-hours.tsx         # Location & hours
│       ├── payment-setup.tsx         # Payment information
│       ├── review-submit.tsx          # Review & submit
│       └── success.tsx                # Onboarding success
│
├── 🌐 api/                             # API Integration Layer
│   ├── index.ts                        # API exports
│   ├── README.md                       # API integration guide
│   ├── custom-instance.ts              # Custom Axios instance
│   ├── custom-instance-fetch.ts        # Fetch-based instance
│   ├── EXAMPLE_USAGE.tsx               # Usage examples
│   │
│   ├── generated/                     # Auto-generated from OpenAPI
│   │   └── api.ts                     # Complete API client
│   │
│   └── hooks/                         # React Query hooks
│       └── useApi.ts                  # API hook wrapper
│
├── 🔐 auth/                            # Authentication Module
│   ├── SecureTokenManager.ts          # Secure token management
│   └── types.ts                       # Auth type definitions
│
├── 🎨 components/                      # Reusable Components
│   ├── index.ts                        # Component exports
│   │
│   ├── 🔒 auth/                        # Auth Components
│   │   ├── AuthGuard.tsx              # Route protection
│   │   ├── ProtectedRoute.tsx         # Auth wrapper
│   │   └── RoleGuard.tsx              # Role-based access
│   │
│   ├── 🏢 business/                    # Business Components
│   │   ├── ChatMessage.tsx            # Chat message bubble
│   │   ├── CustomerCard.tsx            # Customer info card
│   │   ├── EarningsCard.tsx             # Earnings display card
│   │   ├── MenuItemCard.tsx            # Menu item card
│   │   ├── NotificationCard.tsx        # Notification card
│   │   ├── OrderCard.tsx               # Order card
│   │   ├── QuickAction.tsx             # Quick action button
│   │   ├── ReviewCard.tsx              # Review display card
│   │   ├── StatsCard.tsx               # Statistics card
│   │   └── StatusBadge.tsx             # Status badge
│   │
│   ├── 💬 feedback/                    # Feedback Components
│   │   ├── Alert.tsx                  # Alert notifications
│   │   ├── EmptyState.tsx              # Empty state UI
│   │   ├── ErrorState.tsx             # Error state UI
│   │   ├── Loader.tsx                  # Loading spinner
│   │   ├── Skeleton.tsx               # Loading skeleton
│   │   └── Toast.tsx                   # Toast notifications
│   │
│   ├── 📝 forms/                       # Form Components
│   │   ├── FormCheckbox.tsx           # Checkbox input
│   │   ├── FormDatePicker.tsx        # Date picker
│   │   ├── FormInput.tsx              # Text input
│   │   ├── FormRadio.tsx              # Radio button
│   │   └── FormSelect.tsx            # Select dropdown
│   │
│   ├── 📐 layout/                      # Layout Components
│   │   ├── Card.tsx                   # Card container
│   │   ├── Container.tsx               # Page container
│   │   ├── Divider.tsx                # Divider line
│   │   ├── Modal.tsx                  # Modal dialog
│   │   ├── Screen.tsx                 # Full screen wrapper
│   │   ├── ScrollView.tsx             # Scrollable container
│   │   ├── Sheet.tsx                  # Bottom sheet
│   │   └── Stack.tsx                  # Stack layout
│   │
│   ├── 🧭 navigation/                  # Navigation Components
│   │   ├── BackButton.tsx             # Back navigation
│   │   ├── Breadcrumb.tsx             # Breadcrumb trail
│   │   ├── DrawerMenu.tsx            # Drawer menu
│   │   ├── Header.tsx                 # Page header
│   │   └── TabBar.tsx                 # Tab bar
│   │
│   ├── 🆕 onboarding/                 # Onboarding Components
│   │   └── ProgressIndicator.tsx      # Progress bar
│   │
│   ├── 📜 policies/                   # Policy Components
│   │   ├── index.ts                   # Policy exports
│   │   ├── PolicyModal.tsx            # Policy modal
│   │   ├── PrivacyPolicy.tsx          # Privacy policy text
│   │   └── TermsAndConditions.tsx    # Terms text
│   │
│   ├── 🎨 ui/                          # UI Primitives
│   │   ├── Avatar.tsx                 # User avatar
│   │   ├── Badge.tsx                  # Status badge
│   │   ├── Button.tsx                 # Button component
│   │   ├── Card.tsx                   # Card component
│   │   ├── Checkbox.tsx               # Checkbox
│   │   ├── DateTimePicker.tsx         # Date/time picker
│   │   ├── Icon.tsx                   # Icon wrapper
│   │   ├── Image.tsx                  # Image component
│   │   ├── Input.tsx                  # Input field
│   │   ├── Radio.tsx                  # Radio button
│   │   ├── Switch.tsx                 # Toggle switch
│   │   ├── Text.tsx                   # Typography
│   │   └── UploadComponent.tsx        # File upload
│   │
│   ├── MenuForm.tsx                   # Menu item form
│   ├── NotificationContainer.tsx      # Notification wrapper
│   ├── CustomTabBar.tsx               # Custom tab bar
│   └── RefreshableScreen.tsx           # Pull-to-refresh
│
├── ⚙️ config/                          # Configuration
│   ├── env.ts                         # Environment variables
│   ├── environment.ts                 # Platform config
│   └── firebase.ts                    # Firebase config
│
├── 🧠 context/                         # React Context
│   └── AuthProvider.tsx               # Auth context provider
│
├── 🎣 hooks/                           # Custom Hooks
│   ├── useFrameworkReady.ts           # Framework ready hook
│   ├── usePullToRefresh.ts            # Pull refresh hook
│   ├── useRealTimeOrders.ts           # Real-time orders
│   ├── useTheme.ts                    # Theme hook
│   ├── useTranslation.ts              # i18n hook
│   └── useWebSocket.ts                # WebSocket hook
│
├── 🌍 i18n/                            # Internationalization
│   ├── config.ts                       # i18n configuration
│   └── resources/
│       ├── en/                         # English translations
│       │   ├── auth.json              # Auth translations
│       │   ├── common.json            # Common translations
│       │   ├── dashboard.json         # Dashboard translations
│       │   └── orders.json            # Orders translations
│       └── hi/                         # Hindi translations
│           ├── auth.json
│           ├── common.json
│           ├── dashboard.json
│           └── orders.json
│
├── 🔧 services/                        # Business Services
│   ├── cloudinaryUploadService.ts     # Cloudinary upload
│   ├── navigationService.ts           # Navigation utilities
│   └── phoneAuthService.ts            # Phone authentication
│
├── 💾 store/                           # Zustand State Stores
│   ├── authStore.ts                   # Authentication state
│   ├── notificationStore.ts           # Notifications state
│   ├── onboardingStore.ts             # Onboarding state
│   ├── orderStore.ts                  # Order management state
│   ├── partnerStore.ts                # Partner profile state
│   └── themeStore.ts                  # Theme state
│
├── 🎨 theme/                           # Theming System
│   ├── themeProvider.tsx              # Theme context
│   └── themes.ts                      # Theme definitions
│
├── 📝 types/                           # TypeScript Definitions
│   ├── auth.ts                        # Auth types
│   ├── index.ts                       # Type exports
│   ├── order.ts                       # Order types
│   └── partner.ts                    # Partner types
│
├── 🛠️ utils/                           # Utility Functions
│   ├── apiClient.ts                   # API client wrapper
│   ├── authService.ts                 # Auth utilities
│   ├── cloudinaryService.ts           # Cloudinary helpers
│   ├── errorHandler.ts                # Error handling
│   ├── platformUtils.ts               # Platform utilities
│   ├── tokenManager.ts                # Token utilities
│   └── websocketManager.ts            # WebSocket utilities
│
├── 📚 docs/                            # Documentation
│   ├── README.md                      # Main documentation
│   ├── Development_Guide.md           # Development guide
│   └── API_Status.md                  # API integration status
│
├── 🖼️ assets/                          # Static Assets
│   ├── fonts/                         # Custom fonts
│   └── images/
│       ├── favicon.png                # Website favicon
│       └── icon.png                   # App icon
│
├── 📜 scripts/                         # Build Scripts
│   └── check-env.ts                   # Environment checker
│
└── 📦 node_modules/                    # Dependencies (generated)
```

---

## 📊 Directory Statistics

| Directory | File Count | Primary Purpose |
|-----------|-----------|----------------|
| `app/` | ~20 files | Application screens & routing |
| `api/` | ~8 files | API integration & client |
| `components/` | ~50 files | Reusable UI components |
| `store/` | 6 files | State management stores |
| `types/` | 4 files | TypeScript definitions |
| `utils/` | 7 files | Utility functions |
| `config/` | 3 files | Configuration files |
| `hooks/` | 6 files | Custom React hooks |
| `services/` | 3 files | Business logic services |

**Total Files:** ~150 TypeScript/JavaScript files  
**Total Lines:** ~15,000+ lines of code

---

## 🎯 Key File Locations

### Core Application Files
- **Root Layout:** `app/_layout.tsx`
- **Entry Point:** `app/index.tsx`
- **Auth Provider:** `context/AuthProvider.tsx`
- **API Client:** `utils/apiClient.ts`

### State Management
- **Auth Store:** `store/authStore.ts`
- **Partner Store:** `store/partnerStore.ts`
- **Order Store:** `store/orderStore.ts`

### Configuration
- **App Config:** `app.config.ts`
- **Environment:** `config/environment.ts`
- **TypeScript:** `tsconfig.json`

### Routing
- **Dashboard:** `app/(tabs)/dashboard.tsx`
- **Orders:** `app/(tabs)/orders.tsx`
- **Menu:** `app/(tabs)/menu.tsx`
- **Profile:** `app/(tabs)/profile.tsx`

---

## 🔗 File Relationships

### Component → Store → API Flow
```
app/(tabs)/dashboard.tsx
  ↓ imports
store/partnerStore.ts
  ↓ calls
utils/apiClient.ts
  ↓ makes
HTTP requests to backend
```

### Authentication Flow
```
app/(auth)/login.tsx
  ↓ calls
store/authStore.ts
  ↓ uses
auth/SecureTokenManager.ts
  ↓ stores
Expo SecureStore / AsyncStorage
```

### API Generation Flow
```
Backend Swagger Spec
  ↓ generates
api/generated/api.ts
  ↓ consumed by
store/*Store.ts
  ↓ used in
app/**/*.tsx
```

---

## 📝 Notes

- All component files use TypeScript (.tsx for components, .ts for utilities)
- API client is auto-generated from OpenAPI specification
- Stores use Zustand with AsyncStorage persistence
- Components follow atomic design principles
- Routing uses Expo Router's file-based routing

