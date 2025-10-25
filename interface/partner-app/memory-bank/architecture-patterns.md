# Partner App Architecture Patterns

## 🏗️ Overall Architecture

### **Architectural Pattern: Layered Architecture with Clean Separation**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Screens   │ │ Components  │ │ Navigation  │ │ Layout  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LAYER                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │   Stores    │ │   Hooks     │ │  Services   │ │ Utils   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │ API Client  │ │Token Manager│ │Auth Service │ │Storage  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Core Design Patterns

### **Pattern 1: Store-Based State Management**

**Intent**: Centralized state management with persistence and type safety.

**Implementation**:
```typescript
// store/partnerStore.ts
export const usePartnerStore = create<PartnerState & PartnerActions>()(
  persist(
    (set, get) => ({
      // State
      profile: null,
      isLoading: false,
      error: null,
      
      // Actions
      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const profile = await api.partner.getCurrentProfile();
          set({ profile, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    {
      name: 'partner-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        // Only persist essential data
      }),
    }
  )
);
```

**When to Use**:
- Managing complex application state
- Need for persistence across app sessions
- Type-safe state management

**When NOT to Use**:
- Simple local component state
- One-time data fetching without persistence

**Associated Risks**:
- Over-engineering for simple state
- Memory leaks if not properly cleaned up

---

### **Pattern 2: API Client with Interceptors**

**Intent**: Centralized API communication with automatic token management and error handling.

**Implementation**:
```typescript
// utils/apiClient.ts
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request interceptor for auth
apiClient.interceptors.request.use(
  async (config) => {
    const token = await tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await tokenManager.refreshToken();
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);
```

**When to Use**:
- All API communications
- Need for automatic token refresh
- Consistent error handling

**When NOT to Use**:
- Direct external API calls without authentication
- One-off API calls that don't need interceptors

**Associated Risks**:
- Infinite loops if refresh logic fails
- Performance impact with many interceptors

---

### **Pattern 3: Component Composition with Props Interface**

**Intent**: Reusable UI components with clear interfaces and composition patterns.

**Implementation**:
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], styles[size]]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? <ActivityIndicator /> : icon}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
```

**When to Use**:
- Reusable UI elements
- Consistent design system
- Complex component behavior

**When NOT to Use**:
- One-off components
- Simple text displays
- Components with no reusability

**Associated Risks**:
- Over-abstraction for simple components
- Props interface becoming too complex

---

### **Pattern 4: Protected Route Pattern**

**Intent**: Route protection based on authentication state and user roles.

**Implementation**:
```typescript
// components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'business',
  fallback = <LoginScreen />
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return fallback;
  }
  
  return <>{children}</>;
}
```

**When to Use**:
- Protecting sensitive screens
- Role-based access control
- Authentication-dependent features

**When NOT to Use**:
- Public screens
- Simple conditional rendering
- Performance-critical routes

**Associated Risks**:
- Authentication loops
- Performance impact with frequent checks

---

### **Pattern 5: Error Boundary Pattern**

**Intent**: Graceful error handling and recovery for React components.

**Implementation**:
```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

**When to Use**:
- Wrapping major app sections
- Critical component boundaries
- Production error handling

**When NOT to Use**:
- Every small component
- Development-only error handling
- Performance-critical sections

**Associated Risks**:
- Masking important errors
- Performance overhead
- Complex error recovery logic

---

## 🔄 Data Flow Patterns

### **Pattern 6: Unidirectional Data Flow**

**Intent**: Predictable data flow from stores to components with clear update paths.

**Flow**:
```
User Action → Component → Store Action → API Call → Store Update → Component Re-render
```

**Implementation**:
```typescript
// Component
const { profile, updateProfile, isLoading } = usePartnerStore();

const handleUpdateProfile = async (data: Partial<PartnerProfile>) => {
  try {
    await updateProfile(data);
    // Store automatically updates, component re-renders
  } catch (error) {
    // Error handled by store, displayed in component
  }
};
```

**When to Use**:
- All state updates
- Complex data transformations
- Consistent error handling

**When NOT to Use**:
- Direct state mutations
- Bypassing store for simple updates

**Associated Risks**:
- Over-engineering simple updates
- Performance issues with frequent updates

---

### **Pattern 7: Optimistic Updates**

**Intent**: Immediate UI updates with rollback capability for better UX.

**Implementation**:
```typescript
// store/orderStore.ts
updateOrderStatus: async (orderId: string, status: OrderStatus) => {
  const { orders } = get();
  
  // Optimistic update
  const optimisticOrder = orders.find(o => o.id === orderId);
  if (optimisticOrder) {
    set({
      orders: orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    });
  }
  
  try {
    const updatedOrder = await api.orders.updateOrderStatus(orderId, status);
    // Confirm update
    set({
      orders: orders.map(order => 
        order.id === orderId ? updatedOrder : order
      )
    });
  } catch (error) {
    // Rollback on error
    set({ orders: get().orders }); // Restore original state
    throw error;
  }
},
```

**When to Use**:
- User-initiated actions
- Network-dependent operations
- Improving perceived performance

**When NOT to Use**:
- Critical data integrity requirements
- Complex state dependencies
- Operations that must be atomic

**Associated Risks**:
- Data inconsistency
- Complex rollback logic
- Race conditions

---

## 🎨 UI/UX Patterns

### **Pattern 8: Loading States Pattern**

**Intent**: Consistent loading indicators and skeleton screens for better UX.

**Implementation**:
```typescript
// components/feedback/Loader.tsx
interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export function Loader({ size = 'medium', color = '#FF9B42', text }: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

// Usage in components
const { orders, isLoading } = useOrderStore();

if (isLoading) {
  return <Loader text="Loading orders..." />;
}
```

**When to Use**:
- All async operations
- Data fetching
- Long-running processes

**When NOT to Use**:
- Instant operations
- Background processes
- Over-frequent loading states

**Associated Risks**:
- Loading state fatigue
- Performance impact
- Inconsistent UX

---

### **Pattern 9: Empty State Pattern**

**Intent**: Meaningful empty states that guide user actions.

**Implementation**:
```typescript
// components/feedback/EmptyState.tsx
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {action && (
        <Button title={action.label} onPress={action.onPress} />
      )}
    </View>
  );
}
```

**When to Use**:
- Empty lists and collections
- First-time user experiences
- Error recovery states

**When NOT to Use**:
- Loading states
- Temporary empty states
- Complex error states

**Associated Risks**:
- Generic empty states
- Missing user guidance
- Poor conversion rates

---

## 🔧 Utility Patterns

### **Pattern 10: Custom Hooks Pattern**

**Intent**: Reusable logic extraction with clean component interfaces.

**Implementation**:
```typescript
// hooks/useApi.ts
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, dependencies);
  
  useEffect(() => {
    execute();
  }, [execute]);
  
  return { data, loading, error, refetch: execute };
}
```

**When to Use**:
- Reusable logic across components
- Complex state management
- API integration patterns

**When NOT to Use**:
- Simple one-off logic
- Component-specific behavior
- Performance-critical operations

**Associated Risks**:
- Over-abstraction
- Dependency management complexity
- Testing complexity

---

## 📊 Performance Patterns

### **Pattern 11: Memoization Pattern**

**Intent**: Optimize re-renders and expensive calculations.

**Implementation**:
```typescript
// Component with memoization
const OrderCard = React.memo(({ order, onUpdate }: OrderCardProps) => {
  const handleStatusUpdate = useCallback(
    (status: OrderStatus) => {
      onUpdate(order.id, status);
    },
    [order.id, onUpdate]
  );
  
  const formattedDate = useMemo(
    () => formatDate(order.createdAt),
    [order.createdAt]
  );
  
  return (
    <View>
      <Text>{order.customerName}</Text>
      <Text>{formattedDate}</Text>
      <Button onPress={() => handleStatusUpdate('READY')} />
    </View>
  );
});
```

**When to Use**:
- Expensive calculations
- Frequent re-renders
- Complex component trees

**When NOT to Use**:
- Simple components
- Infrequent updates
- Premature optimization

**Associated Risks**:
- Memory overhead
- Stale closures
- Over-optimization

---

## 🔒 Security Patterns

### **Pattern 12: Token Management Pattern**

**Intent**: Secure token storage and automatic refresh.

**Implementation**:
```typescript
// utils/tokenManager.ts
class TokenManager {
  private static instance: TokenManager;
  
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }
  
  async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.multiSet([
      ['partner_auth_token', accessToken],
      ['partner_refresh_token', refreshToken],
    ]);
  }
  
  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem('partner_auth_token');
  }
  
  async refreshToken(): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    await this.storeTokens(response.data.accessToken, response.data.refreshToken);
  }
}
```

**When to Use**:
- All authentication flows
- Token-based API calls
- Secure data storage

**When NOT to Use**:
- Public API calls
- Session-based authentication
- Temporary data storage

**Associated Risks**:
- Token leakage
- Refresh loops
- Storage security

---

## 📝 Documentation Standards

### **Pattern Documentation Template**

Each pattern must include:
1. **Name**: Clear, descriptive pattern name
2. **Intent**: Purpose and use case
3. **Implementation**: Code example with context
4. **When to Use**: Specific scenarios
5. **When NOT to Use**: Anti-patterns and alternatives
6. **Associated Risks**: Potential issues and mitigation
7. **Examples**: Real-world usage in the codebase

---

*Last Updated: December 2024*
*Status: Core Patterns Documented*
*Next Review: When new patterns emerge*
