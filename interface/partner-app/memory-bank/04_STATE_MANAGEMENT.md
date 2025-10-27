# 💾 State Management Guide

**Last Updated:** December 2024  
**Pattern:** Zustand with AsyncStorage persistence  
**Total Stores:** 6 stores managing different domains

---

## 📊 Store Overview

| Store | File | Purpose | Persistent |
|-------|------|---------|------------|
| **authStore** | `store/authStore.ts` | Authentication state | ✅ Yes |
| **partnerStore** | `store/partnerStore.ts` | Partner profile & stats | ✅ Yes |
| **orderStore** | `store/orderStore.ts` | Order management | ✅ Yes |
| **notificationStore** | `store/notificationStore.ts` | Notifications | ✅ Yes |
| **onboardingStore** | `store/onboardingStore.ts` | Onboarding flow | ✅ Yes |
| **themeStore** | `store/themeStore.ts` | Theme preferences | ✅ Yes |

---

## 🔐 AuthStore - Authentication State

### Purpose
Manages user authentication, partner profile, and session data.

### State Structure
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  partner: PartnerProfile | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  isLoggingOut: boolean;
}
```

### Key Actions
```typescript
login(email, password)           // Email/password login
loginWithPhone(phone, firebaseUid) // Phone login
register(partnerData)             // Register new partner
logout()                          // Logout user
checkUserExists(phoneNumber)     // Check if user exists
updatePartnerProfile(data)        // Update partner profile
fetchUserProfile()                // Fetch current profile
initializeAuth()                  // Initialize auth on app start
refreshAuthToken()                // Refresh access token
```

### Usage Example
```typescript
import { useAuthStore } from '@/store/authStore';

function ProfileScreen() {
  const { user, partner, isLoading, login, logout } = useAuthStore();
  
  const handleLogout = async () => {
    await logout();
    // Navigate to login
  };
  
  return (
    <View>
      <Text>{partner?.businessName}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
```

---

## 👤 PartnerStore - Partner Profile & Stats

### Purpose
Manages partner profile data, statistics, menu, reviews, and settings.

### State Structure
```typescript
interface PartnerState {
  profile: PartnerProfile | null;
  stats: PartnerStats | null;
  earnings: Earnings | null;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  reviews: Review[];
  settings: PartnerSettings | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isUpdating: boolean;
  error: string | null;
}
```

### Key Actions
```typescript
fetchProfile()                 // Get current profile
updateProfile(data)           // Update profile
refreshProfile()              // Refresh profile data
toggleAcceptingOrders()       // Toggle order acceptance
fetchStats()                  // Get business statistics
refreshStats()                // Refresh statistics
fetchMenu()                   // Get menu items
fetchCategories()             // Get categories
createMenuItem(item)          // Create menu item
updateMenuItem(id, item)      // Update menu item
deleteMenuItem(id)           // Delete menu item
```

### Usage Example
```typescript
import { usePartnerStore } from '@/store/partnerStore';

function DashboardScreen() {
  const { 
    profile, 
    stats, 
    isLoading, 
    fetchProfile, 
    fetchStats,
    toggleAcceptingOrders 
  } = usePartnerStore();
  
  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);
  
  return (
    <View>
      <Text>Welcome, {profile?.businessName}</Text>
      <Text>Total Orders: {stats?.totalOrders}</Text>
      <Switch 
        value={profile?.isAcceptingOrders} 
        onToggle={toggleAcceptingOrders}
      />
    </View>
  );
}
```

---

## 📦 OrderStore - Order Management

### Purpose
Manages order data, filtering, pagination, and order actions.

### State Structure
```typescript
interface OrderState {
  orders: Order[];
  todayOrders: Order[];
  currentOrder: Order | null;
  stats: OrderStats | null;
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  activeFilter: OrderFilter;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  todayStats: OrderStats | null;
}
```

### Key Actions
```typescript
fetchOrders(page, filters)        // Get orders with pagination
fetchTodayOrders()                // Get today's orders
fetchOrderById(id)                // Get order details
fetchOrderStats()                 // Get order statistics
updateOrderStatus(id, status)    // Update order status
acceptOrder(id, data)             // Accept order
rejectOrder(id, reason, message)  // Reject order
markOrderReady(id, data)          // Mark order ready
setFilter(filter)                 // Apply filters
loadNextPage()                    // Load next page
loadPrevPage()                    // Load previous page
```

### Usage Example
```typescript
import { useOrderStore } from '@/store/orderStore';

function OrdersScreen() {
  const { 
    orders, 
    isLoading, 
    fetchOrders, 
    acceptOrder,
    setFilter 
  } = useOrderStore();
  
  useEffect(() => {
    fetchOrders(1, { status: 'pending' });
  }, []);
  
  const handleAccept = async (orderId: string) => {
    await acceptOrder(orderId, { estimatedTime: 30 });
  };
  
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => (
        <OrderCard order={item} onAccept={handleAccept} />
      )}
    />
  );
}
```

---

## 🔔 NotificationStore - Notifications

### Purpose
Manages notification state, real-time updates, and notification actions.

### State Structure
```typescript
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}
```

### Key Actions
```typescript
fetchNotifications()          // Get notifications
markAsRead(id)              // Mark notification as read
markAllAsRead()             // Mark all as read
clearNotifications()        // Clear notifications
```

---

## 🎨 ThemeStore - Theme Management

### Purpose
Manages theme preferences and settings.

### State Structure
```typescript
interface ThemeState {
  theme: 'light' | 'dark';
  colors: ThemeColors;
}
```

### Key Actions
```typescript
setTheme(theme)              // Change theme
toggleTheme()                // Toggle light/dark
```

---

## 🔄 Persistence Strategy

### How Persistence Works
```typescript
export const usePartnerStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      // State and actions
    }),
    {
      name: 'partner-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist essential data
        profile: state.profile,
        stats: state.stats,
        // Not loading/error states
      }),
    }
  )
);
```

### Persisted vs. Non-Persisted State
✅ **Persisted:** Profile data, stats, orders, settings  
❌ **Not Persisted:** Loading states, error messages, flags

---

## 🎣 Using Stores in Components

### Basic Usage
```typescript
import { useAuthStore } from '@/store/authStore';

function Component() {
  const { user, isLoading } = useAuthStore();
  // Component logic
}
```

### Selectors for Performance
```typescript
// Only re-render when profile changes
const profile = usePartnerStore(state => state.profile);

// Select multiple values
const { profile, stats } = usePartnerStore(
  state => ({ profile: state.profile, stats: state.stats })
);
```

### Actions Without Re-renders
```typescript
// Don't subscribe to state changes
const login = useAuthStore.getState().login;

// Call action
await login('email', 'password');
```

---

## 🔀 Store Dependencies

### Auth → Partner Flow
```typescript
// On login, fetch partner data
login: async () => {
  // ... login logic
  await usePartnerStore.getState().fetchProfile();
}
```

### Order Updates → Partner Stats
```typescript
// When order status changes, refresh partner stats
updateOrderStatus: async () => {
  // ... update order
  await usePartnerStore.getState().refreshStats();
}
```

---

## 📊 Store Data Flow

### Initialization Flow
```
App Start
  ↓
useAuthStore.initializeAuth()
  ↓
Check SecureTokenManager
  ↓
If tokens exist → setAuthenticated(true)
  ↓
Fetch partner profile
  ↓
Ready to render authenticated screens
```

### Update Flow
```
User Action
  ↓
Component calls store action
  ↓
Store makes API call
  ↓
API returns data
  ↓
Store updates state
  ↓
Component re-renders with new data
```

---

## 🛠️ Adding New Store

### Step 1: Create Store File
```typescript
// store/newStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NewState {
  data: any[];
  isLoading: boolean;
  fetchData: () => Promise<void>;
}

export const useNewStore = create<NewState>()(
  persist(
    (set) => ({
      data: [],
      isLoading: false,
      fetchData: async () => {
        set({ isLoading: true });
        const data = await api.getData();
        set({ data, isLoading: false });
      },
    }),
    { name: 'new-storage' }
  )
);
```

### Step 2: Export from Index
```typescript
// store/index.ts
export { useNewStore } from './newStore';
```

### Step 3: Use in Components
```typescript
import { useNewStore } from '@/store';

function Component() {
  const { data, fetchData } = useNewStore();
  // ...
}
```

---

## 🚨 Common Patterns

### Loading Pattern
```typescript
const fetchData = async () => {
  set({ isLoading: true, error: null });
  try {
    const data = await api.getData();
    set({ data, isLoading: false });
  } catch (error) {
    set({ error: error.message, isLoading: false });
  }
};
```

### Refresh Pattern
```typescript
const refreshData = async () => {
  set({ isRefreshing: true });
  try {
    await fetchData();
  } finally {
    set({ isRefreshing: false });
  }
};
```

### Optimistic Update Pattern
```typescript
const updateItem = async (id, data) => {
  // Update UI immediately
  set(state => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, ...data } : item
    )
  }));
  
  try {
    // Sync with server
    await api.updateItem(id, data);
  } catch (error) {
    // Revert on failure
    fetchData();
  }
};
```

---

## 🔗 Related Files

- Auth Store: `store/authStore.ts`
- Partner Store: `store/partnerStore.ts`
- Order Store: `store/orderStore.ts`
- Secure Token Manager: `auth/SecureTokenManager.ts`
- API Client: `utils/apiClient.ts`

