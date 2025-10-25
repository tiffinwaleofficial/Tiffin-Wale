# Partner App State Management

## 🏪 Zustand Store Architecture

### **Store Structure Overview**
```
store/
├── authStore.ts          # Authentication & user management
├── partnerStore.ts       # Partner profile & business data
├── orderStore.ts         # Order management & tracking
├── menuStore.ts          # Menu items & categories
├── notificationStore.ts  # Notifications & alerts
├── onboardingStore.ts    # Partner onboarding flow
└── themeStore.ts         # Theme & UI preferences
```

### **Core Store Pattern**
All stores follow a consistent pattern for maintainability and predictability:

```typescript
// Base store interface
interface BaseStoreState {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: string | null;
}

interface BaseStoreActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// Store implementation pattern
export const useExampleStore = create<ExampleState & ExampleActions>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,
      
      // Actions
      fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.example.getData();
          set({ 
            data, 
            isLoading: false, 
            lastUpdated: new Date().toISOString() 
          });
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
        }
      },
      
      // ... other actions
    }),
    {
      name: 'example-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist essential data
        data: state.data,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
```

---

## 🔐 Authentication Store

### **Purpose**
Manages user authentication state, partner profile, and session management.

### **State Structure**
```typescript
interface AuthState {
  // Authentication status
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoggingOut: boolean;
  
  // User data
  user: AuthUser | null;
  partner: PartnerProfile | null;
  
  // Tokens
  token: string | null;
  refreshToken: string | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}
```

### **Key Actions**
```typescript
interface AuthActions {
  // Authentication
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phoneNumber: string, firebaseUid: string) => Promise<void>;
  register: (partnerData: CreatePartnerData) => Promise<void>;
  logout: () => Promise<void>;
  
  // Session management
  initializeAuth: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  
  // Profile management
  updatePartnerProfile: (data: Partial<PartnerProfile>) => Promise<void>;
  refreshPartnerProfile: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}
```

### **Usage Examples**
```typescript
// Login flow
const { login, isLoading, error } = useAuthStore();

const handleLogin = async (email: string, password: string) => {
  try {
    await login(email, password);
    // Navigation handled automatically
  } catch (error) {
    // Error displayed in UI
  }
};

// Profile management
const { partner, updatePartnerProfile } = useAuthStore();

const handleUpdateProfile = async (updates: Partial<PartnerProfile>) => {
  try {
    await updatePartnerProfile(updates);
    // Profile updated automatically
  } catch (error) {
    // Error handling
  }
};
```

### **Persistence Strategy**
- **Persisted**: `isAuthenticated`, `user`, `partner`, `token`, `refreshToken`
- **Not Persisted**: `isLoading`, `error`, `isInitialized`, `isLoggingOut`
- **Storage Key**: `partner-auth-storage`

---

## 🏢 Partner Store

### **Purpose**
Manages partner business data, statistics, and settings.

### **State Structure**
```typescript
interface PartnerState {
  // Partner data
  profile: PartnerProfile | null;
  stats: PartnerStats | null;
  earnings: Earnings | null;
  
  // Menu management
  menuItems: MenuItem[];
  categories: MenuCategory[];
  
  // Reviews
  reviews: Review[];
  
  // Settings
  settings: PartnerSettings | null;
  
  // UI state
  isLoading: boolean;
  isRefreshing: boolean;
  isUpdating: boolean;
  error: string | null;
  
  // Timestamps
  lastProfileUpdate: string | null;
  lastStatsUpdate: string | null;
}
```

### **Key Actions**
```typescript
interface PartnerActions {
  // Profile management
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<PartnerProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  
  // Status management
  toggleAcceptingOrders: () => Promise<void>;
  updateAcceptingStatus: (isAccepting: boolean) => Promise<void>;
  
  // Statistics
  fetchStats: () => Promise<void>;
  refreshStats: () => Promise<void>;
  
  // Menu management
  fetchMenu: () => Promise<void>;
  createMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  
  // Utility
  refreshData: () => Promise<void>;
}
```

### **Usage Examples**
```typescript
// Dashboard data loading
const { 
  profile, 
  stats, 
  fetchProfile, 
  fetchStats, 
  isLoading 
} = usePartnerStore();

useEffect(() => {
  const loadDashboardData = async () => {
    await Promise.all([
      fetchProfile(),
      fetchStats()
    ]);
  };
  
  loadDashboardData();
}, []);

// Status toggle
const { toggleAcceptingOrders, isUpdating } = usePartnerStore();

const handleToggleStatus = async () => {
  try {
    await toggleAcceptingOrders();
    // Status updated automatically
  } catch (error) {
    // Error handling
  }
};
```

### **Persistence Strategy**
- **Persisted**: `profile`, `stats`, `menuItems`, `categories`, `reviews`, `settings`
- **Not Persisted**: `isLoading`, `isRefreshing`, `isUpdating`, `error`
- **Storage Key**: `partner-profile-storage`

---

## 📦 Order Store

### **Purpose**
Manages order data, tracking, and status updates.

### **State Structure**
```typescript
interface OrderState {
  // Order data
  orders: Order[];
  todayOrders: Order[];
  currentOrder: Order | null;
  stats: OrderStats | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  
  // Filters
  activeFilter: OrderFilter;
  
  // UI state
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Today's statistics
  todayStats: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  } | null;
}
```

### **Key Actions**
```typescript
interface OrderActions {
  // Data fetching
  fetchOrders: (page?: number, filters?: OrderFilter) => Promise<void>;
  fetchTodayOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  
  // Order management
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  markOrderReady: (orderId: string) => Promise<void>;
  startPreparingOrder: (orderId: string) => Promise<void>;
  
  // Filters and pagination
  setFilter: (filter: Partial<OrderFilter>) => void;
  clearFilters: () => void;
  loadNextPage: () => Promise<void>;
  loadPrevPage: () => Promise<void>;
}
```

### **Usage Examples**
```typescript
// Orders list with pagination
const { 
  orders, 
  isLoading, 
  hasNextPage, 
  fetchOrders, 
  loadNextPage 
} = useOrderStore();

useEffect(() => {
  fetchOrders(1);
}, []);

const handleLoadMore = () => {
  if (hasNextPage && !isLoading) {
    loadNextPage();
  }
};

// Order status updates
const { updateOrderStatus } = useOrderStore();

const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
  try {
    await updateOrderStatus(orderId, status);
    // Order updated automatically in all lists
  } catch (error) {
    // Error handling
  }
};
```

### **Persistence Strategy**
- **Persisted**: `orders`, `todayOrders`, `currentPage`, `totalOrders`, `activeFilter`, `stats`
- **Not Persisted**: `isLoading`, `isRefreshing`, `error`, `currentOrder`
- **Storage Key**: `partner-order-storage`

---

## 🍽️ Menu Store

### **Purpose**
Manages menu items, categories, and availability.

### **State Structure**
```typescript
interface MenuState {
  // Menu data
  menuItems: MenuItem[];
  categories: MenuCategory[];
  
  // UI state
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
  
  // Filters
  activeCategory: string | null;
  searchQuery: string;
}
```

### **Key Actions**
```typescript
interface MenuActions {
  // Data fetching
  fetchMenu: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  
  // Menu item management
  createMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  
  // Category management
  createCategory: (category: Omit<MenuCategory, 'id'>) => Promise<void>;
  
  // Filters
  setActiveCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}
```

### **Usage Examples**
```typescript
// Menu management
const { 
  menuItems, 
  categories, 
  fetchMenu, 
  createMenuItem, 
  isLoading 
} = useMenuStore();

useEffect(() => {
  fetchMenu();
}, []);

const handleCreateItem = async (itemData: CreateMenuItemData) => {
  try {
    await createMenuItem(itemData);
    // Item added to list automatically
  } catch (error) {
    // Error handling
  }
};

// Filtered menu items
const { activeCategory, setActiveCategory } = useMenuStore();

const filteredItems = menuItems.filter(item => 
  !activeCategory || item.category === activeCategory
);
```

---

## 🔔 Notification Store

### **Purpose**
Manages notifications, alerts, and real-time updates.

### **State Structure**
```typescript
interface NotificationState {
  // Notification data
  notifications: Notification[];
  unreadCount: number;
  
  // Settings
  settings: NotificationSettings;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}
```

### **Key Actions**
```typescript
interface NotificationActions {
  // Data fetching
  fetchNotifications: () => Promise<void>;
  
  // Notification management
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  
  // Settings
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  
  // Real-time updates
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}
```

---

## 🚀 Onboarding Store

### **Purpose**
Manages the partner onboarding flow and form data.

### **State Structure**
```typescript
interface OnboardingState {
  // Current step
  currentStep: number;
  totalSteps: number;
  
  // Form data
  personalInfo: PersonalInfo | null;
  businessProfile: BusinessProfile | null;
  locationHours: LocationHours | null;
  cuisineServices: CuisineServices | null;
  imagesBranding: ImagesBranding | null;
  documents: Documents | null;
  paymentSetup: PaymentSetup | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}
```

### **Key Actions**
```typescript
interface OnboardingActions {
  // Step management
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  
  // Data management
  updateStepData: (step: string, data: any) => void;
  clearOnboardingData: () => void;
  
  // Submission
  submitOnboarding: () => Promise<void>;
}
```

---

## 🎨 Theme Store

### **Purpose**
Manages theme preferences and UI customization.

### **State Structure**
```typescript
interface ThemeState {
  // Theme settings
  isDarkMode: boolean;
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  
  // UI preferences
  animationsEnabled: boolean;
  hapticFeedback: boolean;
}
```

### **Key Actions**
```typescript
interface ThemeActions {
  // Theme management
  toggleDarkMode: () => void;
  setPrimaryColor: (color: string) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  
  // Preferences
  toggleAnimations: () => void;
  toggleHapticFeedback: () => void;
  
  // Reset
  resetToDefaults: () => void;
}
```

---

## 🔄 State Management Patterns

### **Pattern 1: Optimistic Updates**
```typescript
// Update UI immediately, rollback on error
updateOrderStatus: async (orderId: string, status: OrderStatus) => {
  const { orders } = get();
  
  // Optimistic update
  const optimisticOrders = orders.map(order => 
    order.id === orderId ? { ...order, status } : order
  );
  set({ orders: optimisticOrders });
  
  try {
    const updatedOrder = await api.orders.updateStatus(orderId, status);
    // Confirm update
    set({
      orders: orders.map(order => 
        order.id === orderId ? updatedOrder : order
      )
    });
  } catch (error) {
    // Rollback on error
    set({ orders: get().orders });
    throw error;
  }
},
```

### **Pattern 2: Batch Operations**
```typescript
// Load multiple related data sources
refreshData: async () => {
  set({ isRefreshing: true });
  try {
    await Promise.all([
      get().fetchProfile(),
      get().fetchStats(),
      get().fetchMenu(),
      get().fetchOrders(),
    ]);
  } finally {
    set({ isRefreshing: false });
  }
},
```

### **Pattern 3: Conditional Loading**
```typescript
// Only load data if not already loaded or stale
fetchProfile: async () => {
  const { profile, lastProfileUpdate } = get();
  
  // Skip if recently updated
  if (profile && lastProfileUpdate) {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (new Date(lastProfileUpdate) > fiveMinutesAgo) {
      return;
    }
  }
  
  set({ isLoading: true, error: null });
  // ... fetch logic
},
```

### **Pattern 4: Error Recovery**
```typescript
// Automatic retry with exponential backoff
fetchData: async (retryCount = 0) => {
  try {
    const data = await api.getData();
    set({ data, error: null });
  } catch (error) {
    if (retryCount < 3) {
      // Retry with exponential backoff
      setTimeout(() => {
        get().fetchData(retryCount + 1);
      }, Math.pow(2, retryCount) * 1000);
    } else {
      set({ error: error.message });
    }
  }
},
```

---

## 🧪 Testing Store Logic

### **Unit Testing Stores**
```typescript
// __tests__/store/partnerStore.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { usePartnerStore } from '../../store/partnerStore';

describe('PartnerStore', () => {
  beforeEach(() => {
    usePartnerStore.getState().reset();
  });
  
  it('should fetch profile successfully', async () => {
    const { result } = renderHook(() => usePartnerStore());
    
    await act(async () => {
      await result.current.fetchProfile();
    });
    
    expect(result.current.profile).toBeDefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('should handle fetch profile error', async () => {
    // Mock API error
    jest.spyOn(api.partner, 'getCurrentProfile').mockRejectedValue(
      new Error('Network error')
    );
    
    const { result } = renderHook(() => usePartnerStore());
    
    await act(async () => {
      await result.current.fetchProfile();
    });
    
    expect(result.current.profile).toBeNull();
    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
  });
});
```

### **Integration Testing**
```typescript
// __tests__/integration/authFlow.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../app/(auth)/login';

describe('Authentication Flow', () => {
  it('should login and update auth state', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password');
    fireEvent.press(getByText('Login'));
    
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });
});
```

---

## 📊 Performance Optimization

### **Selective Subscriptions**
```typescript
// Only subscribe to specific state slices
const profile = usePartnerStore(state => state.profile);
const isLoading = usePartnerStore(state => state.isLoading);

// Instead of subscribing to entire store
const { profile, isLoading } = usePartnerStore();
```

### **Memoized Selectors**
```typescript
// Create memoized selectors for complex computations
const selectFilteredOrders = useMemo(
  () => (state: OrderState) => {
    return state.orders.filter(order => 
      order.status === state.activeFilter.status
    );
  },
  []
);

const filteredOrders = useOrderStore(selectFilteredOrders);
```

### **Debounced Updates**
```typescript
// Debounce frequent updates
const debouncedUpdateProfile = useMemo(
  () => debounce((data: Partial<PartnerProfile>) => {
    updateProfile(data);
  }, 500),
  [updateProfile]
);
```

---

## 🔒 Security Considerations

### **Sensitive Data Handling**
```typescript
// Don't persist sensitive data
partialize: (state) => ({
  // Safe to persist
  profile: {
    ...state.profile,
    // Remove sensitive fields
    password: undefined,
    ssn: undefined,
  },
  // Don't persist tokens in partner store
  token: undefined,
  refreshToken: undefined,
}),
```

### **Token Management**
```typescript
// Use secure storage for tokens
const storeTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync('access_token', accessToken);
  await SecureStore.setItemAsync('refresh_token', refreshToken);
};
```

---

## 📝 Best Practices

### **Store Design**
1. **Single Responsibility**: Each store should manage one domain
2. **Immutable Updates**: Always return new state objects
3. **Error Boundaries**: Handle errors gracefully
4. **Loading States**: Provide clear loading indicators
5. **Persistence Strategy**: Only persist essential data

### **Action Design**
1. **Async Actions**: Use async/await for API calls
2. **Error Handling**: Always handle and store errors
3. **Optimistic Updates**: Update UI immediately when appropriate
4. **Batch Operations**: Group related operations
5. **Conditional Loading**: Avoid unnecessary API calls

### **State Structure**
1. **Normalized Data**: Keep related data normalized
2. **Computed Properties**: Use selectors for derived state
3. **Timestamps**: Track when data was last updated
4. **Filters**: Store filter state separately
5. **UI State**: Keep UI state minimal and focused

---

*Last Updated: December 2024*
*Status: State Management Documented*
*Next Review: When new stores are added*
