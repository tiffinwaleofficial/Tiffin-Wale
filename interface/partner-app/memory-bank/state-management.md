# Tiffin-Wale Partner App - State Management

## Overview
The Partner App uses Zustand for state management with persistence middleware for offline capability. The state is organized into domain-specific stores that handle different aspects of the application.

## Store Architecture

### Store Structure
```
store/
├── authStore.ts           # Authentication and user management
├── partnerStore.ts        # Partner profile and business data
├── orderStore.ts          # Order management and tracking
└── notificationStore.ts   # Notifications and alerts
```

## Core Stores

### 1. Authentication Store (`authStore.ts`)

#### Purpose
Manages user authentication, session management, and partner profile data.

#### State Structure
```typescript
interface AuthState {
  // Authentication status
  isAuthenticated: boolean;
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

#### Key Actions
```typescript
interface AuthActions {
  // Authentication
  login: (email: string, password: string) => Promise<void>;
  register: (partnerData: CreatePartnerData) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  
  // Session management
  initializeAuth: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  clearError: () => void;
  
  // Partner profile
  updatePartnerProfile: (data: Partial<PartnerProfile>) => Promise<void>;
  refreshPartnerProfile: () => Promise<void>;
}
```

#### Usage Example
```typescript
const LoginScreen = () => {
  const { login, isLoading, error } = useAuthStore();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      // Error handled by store
    }
  };
  
  return (
    // Login form UI
  );
};
```

#### Persistence Configuration
```typescript
{
  name: 'partner-auth-storage',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    partner: state.partner,
    token: state.token,
    refreshToken: state.refreshToken,
  }),
}
```

### 2. Partner Store (`partnerStore.ts`)

#### Purpose
Manages partner business data, statistics, menu items, and settings.

#### State Structure
```typescript
interface PartnerState {
  // Partner data
  profile: PartnerProfile | null;
  stats: PartnerStats | null;
  earnings: Earnings | null;
  
  // Menu management
  menuItems: MenuItem[];
  categories: MenuCategory[];
  
  // Reviews and settings
  reviews: Review[];
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

#### Key Actions
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
  fetchCategories: () => Promise<void>;
  createMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  createCategory: (category: Omit<MenuCategory, 'id'>) => Promise<void>;
  
  // Reviews and settings
  fetchReviews: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<PartnerSettings>) => Promise<void>;
  
  // Utility
  refreshData: () => Promise<void>;
}
```

#### Usage Example
```typescript
const DashboardScreen = () => {
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
  
  const handleToggleOrders = async () => {
    try {
      await toggleAcceptingOrders();
      // Show success message
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    // Dashboard UI
  );
};
```

### 3. Order Store (`orderStore.ts`)

#### Purpose
Manages order data, status updates, and order-related statistics.

#### State Structure
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

#### Key Actions
```typescript
interface OrderActions {
  // Data fetching
  fetchOrders: (page?: number, filters?: OrderFilter) => Promise<void>;
  fetchTodayOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  fetchOrderStats: () => Promise<void>;
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

#### Usage Example
```typescript
const OrdersScreen = () => {
  const { 
    orders, 
    todayOrders, 
    isLoading, 
    activeFilter,
    fetchOrders,
    updateOrderStatus,
    setFilter 
  } = useOrderStore();
  
  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };
  
  const handleFilterChange = (filter: Partial<OrderFilter>) => {
    setFilter(filter);
  };
  
  return (
    // Orders UI
  );
};
```

### 4. Notification Store (`notificationStore.ts`)

#### Purpose
Manages notifications, alerts, and real-time updates.

#### State Structure
```typescript
interface NotificationState {
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Settings
  settings: NotificationSettings;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}
```

## Data Flow Patterns

### 1. Initial Data Loading
```typescript
const DashboardScreen = () => {
  const { fetchProfile, fetchStats } = usePartnerStore();
  const { fetchTodayOrders } = useOrderStore();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProfile(),
          fetchStats(),
          fetchTodayOrders(),
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Component render
};
```

### 2. Real-time Updates
```typescript
// WebSocket integration for real-time updates
const useRealTimeUpdates = () => {
  const { updateOrderStatus } = useOrderStore();
  const { fetchTodayOrders } = useOrderStore();
  
  useEffect(() => {
    const socket = io(config.apiBaseUrl);
    
    socket.on('order:status-updated', (order) => {
      updateOrderStatus(order.id, order.status);
    });
    
    socket.on('order:new', () => {
      fetchTodayOrders();
    });
    
    return () => socket.disconnect();
  }, []);
};
```

### 3. Optimistic Updates
```typescript
const updateOrderStatusOptimistic = async (orderId: string, status: OrderStatus) => {
  // Update local state immediately
  set((state) => ({
    orders: state.orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    ),
  }));
  
  try {
    // Make API call
    await api.orders.updateOrderStatus(orderId, status);
  } catch (error) {
    // Revert on error
    set((state) => ({
      orders: state.orders.map(order =>
        order.id === orderId ? { ...order, status: order.previousStatus } : order
      ),
    }));
    throw error;
  }
};
```

## Error Handling

### Store-Level Error Handling
```typescript
const fetchProfile = async () => {
  try {
    set({ isLoading: true, error: null });
    
    const profile = await api.partner.getCurrentProfile();
    
    set({
      profile,
      isLoading: false,
      error: null,
    });
  } catch (error: any) {
    console.error('Failed to fetch partner profile:', error);
    set({
      isLoading: false,
      error: error.response?.data?.message || 'Failed to fetch profile',
    });
  }
};
```

### Component-Level Error Handling
```typescript
const ProfileScreen = () => {
  const { profile, error, fetchProfile } = usePartnerStore();
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchProfile}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Normal render
};
```

## Persistence Strategy

### Selective Persistence
```typescript
// Only persist essential data, not UI state
partialize: (state) => ({
  // Auth data
  isAuthenticated: state.isAuthenticated,
  user: state.user,
  partner: state.partner,
  token: state.token,
  refreshToken: state.refreshToken,
  
  // Partner data
  profile: state.profile,
  stats: state.stats,
  menuItems: state.menuItems,
  categories: state.categories,
  
  // Order data
  orders: state.orders,
  todayOrders: state.todayOrders,
  activeFilter: state.activeFilter,
  
  // Exclude UI state
  // isLoading, error, isRefreshing, etc.
})
```

### Data Hydration
```typescript
const initializeAuth = async () => {
  try {
    set({ isLoading: true });
    
    const session = await AuthService.getAuthSession();
    
    if (session.token && session.user) {
      if (AuthService.isTokenExpired(session.token)) {
        // Handle token refresh
        await refreshAuthToken();
        return;
      }
      
      set({
        isAuthenticated: true,
        user: session.user,
        partner: session.partner,
        token: session.token,
        refreshToken: session.refreshToken,
        isLoading: false,
      });
    } else {
      set({ ...initialState, isLoading: false });
    }
  } catch (error) {
    console.error('Initialize auth error:', error);
    set({ ...initialState, isLoading: false });
  }
};
```

## Performance Optimization

### Memoization
```typescript
// Memoize expensive calculations
const useOrderStats = () => {
  const { orders } = useOrderStore();
  
  return useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      completed: orders.filter(o => o.status === 'DELIVERED').length,
    };
  }, [orders]);
};
```

### Selective Subscriptions
```typescript
// Only subscribe to specific parts of the store
const useOrderCount = () => {
  return useOrderStore(state => state.orders.length);
};

const useOrderStats = () => {
  return useOrderStore(state => ({
    total: state.orders.length,
    pending: state.orders.filter(o => o.status === 'PENDING').length,
  }));
};
```

## Testing Strategy

### Store Testing
```typescript
describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState(initialState);
  });
  
  it('should login successfully', async () => {
    const { login } = useAuthStore.getState();
    
    await login('test@example.com', 'password');
    
    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(user).toBeDefined();
  });
});
```

### Integration Testing
```typescript
describe('Dashboard Integration', () => {
  it('should load dashboard data', async () => {
    render(<DashboardScreen />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Today\'s Earnings')).toBeInTheDocument();
    });
  });
});
```

## Best Practices

### 1. Store Organization
- Keep stores focused on specific domains
- Use consistent naming conventions
- Implement proper TypeScript types
- Handle loading and error states consistently

### 2. Data Fetching
- Implement proper error handling
- Use loading states for better UX
- Implement retry mechanisms
- Cache data appropriately

### 3. State Updates
- Use immutable updates
- Implement optimistic updates where appropriate
- Handle concurrent updates properly
- Validate data before updating state

### 4. Performance
- Use selective subscriptions
- Implement proper memoization
- Avoid unnecessary re-renders
- Optimize for mobile performance

---

*This state management architecture provides a robust, scalable, and maintainable solution for the Partner App's data needs.*




