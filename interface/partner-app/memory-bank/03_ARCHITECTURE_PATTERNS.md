# 🏗️ Architectural Patterns & Design Decisions

**Last Updated:** December 2024  
**Purpose:** Document key architectural patterns and design decisions

---

## 🎯 Core Architectural Principles

### 1. **Component Composition Pattern**
- **Principle:** Build complex UI from simple, reusable components
- **Implementation:** Atomic Design (atoms → molecules → organisms)
- **Location:** All components in `components/` directory
- **Example:** `OrderCard` composed of `Avatar`, `Text`, `Badge` primitives

### 2. **State Management Pattern**
- **Principle:** Centralized state with Zustand stores
- **Implementation:** Store per domain (`authStore`, `partnerStore`, `orderStore`)
- **Persistence:** AsyncStorage for offline support
- **Example:** `store/authStore.ts` for authentication state

### 3. **API Integration Pattern**
```typescript
Layer 1: Generated API Client (api/generated/api.ts)
  ↓
Layer 2: Custom Axios Instance (api/custom-instance.ts)
  ↓
Layer 3: Store Actions (store/*Store.ts)
  ↓
Layer 4: Component Consumption (app/**/*.tsx)
```

### 4. **Authentication Pattern**
```typescript
SecureTokenManager
  ↓
Expo SecureStore / AsyncStorage
  ↓
API Request Interceptor
  ↓
Automatic Token Refresh
  ↓
Auto-logout on failure
```

---

## 🏛️ Application Architecture

### Layered Architecture
```
┌─────────────────────────────────────┐
│   Presentation Layer (app/)          │
│   - Screens & Navigation             │
│   - User Interface                   │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│   Business Logic Layer (store/)     │
│   - State Management                │
│   - Actions & Effects               │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│   API Layer (api/ + utils/)          │
│   - HTTP Client                      │
│   - Request/Response                 │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│   Backend API                        │
│   - NestJS Server                    │
│   - PostgreSQL Database              │
└─────────────────────────────────────┘
```

---

## 🔄 Data Flow Patterns

### 1. **Authentication Flow**
```typescript
User Login
  ↓
Login Screen → calls → authStore.login()
  ↓
API Call → backend/auth/login
  ↓
SecureTokenManager.storeTokens()
  ↓
Auth context updates → Protected route access granted
```

### 2. **Data Fetching Flow**
```typescript
Component Mounts
  ↓
useEffect → calls → store.fetchData()
  ↓
Store action → API Client → Backend
  ↓
Response processed → Store state updated
  ↓
Component re-renders with new data
```

### 3. **Real-time Updates Flow**
```typescript
WebSocket Connection
  ↓
Socket Events received
  ↓
Store actions update local state
  ↓
Components re-render with live data
```

---

## 🧩 Design Patterns in Use

### 1. **Provider Pattern**
**Purpose:** Provide global state/context to app
**File:** `context/AuthProvider.tsx`

```typescript
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <NotificationContainer>
      <ProtectedRoute>
        <Slot /> {/* App content */}
      </ProtectedRoute>
    </NotificationContainer>
  </AuthProvider>
</QueryClientProvider>
```

### 2. **Store Pattern (Zustand)**
**Purpose:** Global state management with persistence
**Files:** `store/*Store.ts`

```typescript
export const usePartnerStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      // State
      profile: null,
      
      // Actions
      fetchProfile: async () => {
        const data = await api.partner.getCurrentProfile();
        set({ profile: data });
      },
    }),
    { name: 'partner-storage' }
  )
);
```

### 3. **Interceptor Pattern**
**Purpose:** Automatically attach auth tokens to requests
**File:** `utils/apiClient.ts`

```typescript
apiClient.interceptors.request.use(
  async (config) => {
    const token = await secureTokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

### 4. **Retry Pattern**
**Purpose:** Automatic retry with exponential backoff
**Implementation:** `utils/apiClient.ts`

```typescript
const retryRequest = async (requestFn, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await delay(Math.pow(2, attempt) * 1000);
    }
  }
};
```

### 5. **Observer Pattern (WebSocket)**
**Purpose:** Real-time updates via WebSocket events
**File:** `utils/websocketManager.ts`

```typescript
socket.on('order_created', (order) => {
  orderStore.addOrderToStore(order);
});

socket.on('order_updated', (order) => {
  orderStore.updateOrderInStore(order.id, order);
});
```

---

## 🔒 Security Patterns

### 1. **Token Storage Security**
- **Mobile:** Expo SecureStore (encrypted storage)
- **Web:** AsyncStorage (localStorage equivalent)
- **Implementation:** `auth/SecureTokenManager.ts`

### 2. **Request Interception**
- All API requests automatically get auth token
- Token validation before request
- Automatic token refresh on 401

### 3. **Protected Routes**
- `ProtectedRoute` component wraps authenticated screens
- Checks authentication status
- Redirects to login if unauthenticated

```typescript
if (!isAuthenticated) {
  return <Redirect href="/(auth)/login" />;
}
```

---

## 📱 Platform-Specific Patterns

### 1. **Platform-Aware Configuration**
**File:** `config/environment.ts`

```typescript
const getApiBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3001';
  } else {
    return 'https://api.tiffin-wale.com';
  }
};
```

### 2. **Conditional Rendering**
**Pattern:** Use Platform.OS checks
**Example:** Vercel Analytics only on web

```typescript
{Platform.OS === 'web' && <Analytics />}
```

### 3. **Platform-Specific Storage**
**File:** `auth/SecureTokenManager.ts`

```typescript
if (Platform.OS === 'web') {
  await AsyncStorage.setItem(key, value);
} else {
  await SecureStore.setItemAsync(key, value);
}
```

---

## 🎨 UI/UX Patterns

### 1. **Loading States Pattern**
All async operations use loading states:
- `isLoading` for initial load
- `isRefreshing` for pull-to-refresh
- `isUpdating` for updates

### 2. **Error Handling Pattern**
```typescript
try {
  await action();
} catch (error) {
  setError(error.message);
  // Show user-friendly error UI
}
```

### 3. **Empty State Pattern**
```typescript
if (!items.length && !isLoading) {
  return <EmptyState message="No items found" />;
}
```

---

## 🧪 Testing Patterns (To Be Implemented)

### 1. **Unit Testing Pattern**
```typescript
describe('AuthStore', () => {
  it('should login successfully', async () => {
    await authStore.login('email', 'pass');
    expect(authStore.isAuthenticated).toBe(true);
  });
});
```

### 2. **Integration Testing Pattern**
```typescript
test('complete order flow', async () => {
  // Mock API
  // Test order creation
  // Test order acceptance
  // Test order completion
});
```

---

## 🔄 State Management Patterns

### 1. **Single Source of Truth**
- Each domain has one store
- Stores are the source of truth
- Components read from stores

### 2. **Normalized State**
```typescript
interface OrderState {
  orders: Order[];        // List of orders
  currentOrder: Order;   // Selected order
  stats: OrderStats;     // Computed stats
}
```

### 3. **Optimistic Updates**
```typescript
updateOrder: async (id, data) => {
  // Update UI immediately
  updateOrderInStore(id, data);
  
  try {
    // Sync with server
    await api.orders.update(id, data);
  } catch (error) {
    // Revert on failure
    revertOrderUpdate(id);
  }
}
```

---

## 📋 Code Organization Patterns

### 1. **Feature-Based Organization**
- Screens grouped by feature
- Related components in same directory
- Feature-specific stores

### 2. **Barrel Exports**
```typescript
// components/index.ts
export { OrderCard } from './business/OrderCard';
export { MenuItemCard } from './business/MenuItemCard';
```

### 3. **Path Aliases**
```typescript
// tsconfig.json
{
  "paths": {
    "@/*": ["./*"]
  }
}

// Usage
import { OrderCard } from '@/components';
```

---

## 🔧 Configuration Patterns

### 1. **Environment-Based Config**
```typescript
// Different configs for dev/staging/prod
API_BASE_URL=http://localhost:3001  // dev
API_BASE_URL=https://api.staging.com // staging
API_BASE_URL=https://api.prod.com     // prod
```

### 2. **Feature Flags**
```typescript
// Enable/disable features per environment
ENABLE_ANALYTICS=true  // production
ENABLE_ANALYTICS=false // development
```

---

## 📝 Best Practices

1. **Type Safety:** Always use TypeScript interfaces
2. **Error Boundaries:** Wrap async operations in try-catch
3. **Loading States:** Always show loading indicators
4. **Optimistic UI:** Update UI before server confirmation
5. **Error Messages:** User-friendly error messages
6. **Code Splitting:** Lazy load heavy components
7. **Memoization:** Use React.memo and useMemo
8. **Clean Code:** Follow SOLID principles

---

## 🔗 Related Documentation

- [Development Guide](./00_PROJECT_OVERVIEW.md)
- [API Endpoints](./02_API_ENDPOINTS.md)
- [State Management](./04_STATE_MANAGEMENT.md)
- [Component Library](./05_COMPONENT_LIBRARY.md)

