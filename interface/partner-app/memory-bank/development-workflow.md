# Partner App Development Workflow

## 🚀 Development Environment Setup

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- React Native development environment
- Android Studio (for Android) or Xcode (for iOS)

### **Initial Setup**

1. **Navigate to partner app directory**
   ```bash
   cd interface/partner-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   # For local development:
   API_BASE_URL=http://127.0.0.1:3001
   
   # For remote backend:
   # API_BASE_URL=https://api.tiffin-wale.com
   ```

4. **Check environment setup**
   ```bash
   npm run check:env
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

---

## 📁 Project Architecture

### **Directory Structure**
```
interface/partner-app/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication flow
│   ├── (tabs)/            # Main app tabs
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 page
├── components/            # Reusable UI components
├── config/               # Configuration files
├── hooks/                # Custom React hooks
├── store/                # Zustand state stores
├── types/                # TypeScript type definitions
├── utils/                # Utility functions and services
└── docs/                 # Documentation
```

### **State Management Pattern**
We use **Zustand** for state management with the following pattern:

```typescript
// store/exampleStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExampleState {
  data: any[];
  loading: boolean;
  error: string | null;
  // Actions
  fetchData: () => Promise<void>;
  updateItem: (id: string, data: any) => Promise<void>;
  reset: () => void;
}

export const useExampleStore = create<ExampleState>()(
  persist(
    (set, get) => ({
      // Initial state
      data: [],
      loading: false,
      error: null,
      
      // Actions
      fetchData: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.get('/endpoint');
          set({ data: response.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      
      updateItem: async (id: string, data: any) => {
        try {
          await apiClient.put(`/endpoint/${id}`, data);
          // Update local state
          const currentData = get().data;
          const updatedData = currentData.map(item => 
            item.id === id ? { ...item, ...data } : item
          );
          set({ data: updatedData });
        } catch (error) {
          set({ error: error.message });
        }
      },
      
      reset: () => set({ data: [], loading: false, error: null }),
    }),
    {
      name: 'example-store', // Unique name for persistence
      partialize: (state) => ({ data: state.data }), // Only persist data
    }
  )
);
```

---

## 🔌 API Integration Pattern

### 1. Define Types
```typescript
// types/example.ts
export interface ExampleItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExampleRequest {
  name: string;
}
```

### 2. Add API Endpoints
```typescript
// utils/apiClient.ts
export const apiClient = {
  // ... existing methods
  
  // Example endpoints
  example: {
    getAll: () => api.get<ExampleItem[]>('/examples'),
    getById: (id: string) => api.get<ExampleItem>(`/examples/${id}`),
    create: (data: CreateExampleRequest) => api.post<ExampleItem>('/examples', data),
    update: (id: string, data: Partial<ExampleItem>) => 
      api.put<ExampleItem>(`/examples/${id}`, data),
    delete: (id: string) => api.delete(`/examples/${id}`),
  },
};
```

### 3. Create Store
```typescript
// store/exampleStore.ts
export const useExampleStore = create<ExampleState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      
      fetchItems: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.example.getAll();
          set({ items: response.data, loading: false });
        } catch (error) {
          console.error('Failed to fetch items:', error);
          set({ error: error.message, loading: false });
        }
      },
      
      // ... other actions
    }),
    { name: 'example-store' }
  )
);
```

### 4. Use in Components
```tsx
// app/example-screen.tsx
import { useEffect } from 'react';
import { useExampleStore } from '../store/exampleStore';

export default function ExampleScreen() {
  const { items, loading, error, fetchItems } = useExampleStore();
  
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <View>
      {items.map(item => (
        <ExampleCard key={item.id} item={item} />
      ))}
    </View>
  );
}
```

---

## 🔗 **NEW PARTNER API INTEGRATIONS (December 2024)**

### Ready-to-Integrate Partner APIs

The following APIs are now available and ready for frontend integration:

#### 1. **Partner Profile Management**

##### Get Current Partner Profile
```typescript
// utils/apiClient.ts - Add to partner object
getCurrentProfile: () => api.get<PartnerProfile>('/partners/user/me'),

// store/partnerStore.ts - Add action
fetchCurrentProfile: async () => {
  set({ loading: true, error: null });
  try {
    const response = await apiClient.partner.getCurrentProfile();
    set({ profile: response.data, loading: false });
  } catch (error) {
    set({ error: error.message, loading: false });
  }
},

// Usage in component
const { profile, loading, fetchCurrentProfile } = usePartnerStore();
useEffect(() => {
  fetchCurrentProfile();
}, []);
```

##### Update Partner Profile
```typescript
// utils/apiClient.ts
updateProfile: (data: Partial<PartnerProfile>) => 
  api.put<PartnerProfile>('/partners/me', data),

// store/partnerStore.ts
updateProfile: async (updates: Partial<PartnerProfile>) => {
  set({ loading: true, error: null });
  try {
    const response = await apiClient.partner.updateProfile(updates);
    set({ profile: response.data, loading: false });
  } catch (error) {
    set({ error: error.message, loading: false });
  }
},
```

#### 2. **Order Management**

##### Get Partner Orders with Pagination
```typescript
// utils/apiClient.ts
getMyOrders: (params?: { page?: number; limit?: number; status?: string }) =>
  api.get<OrderListResponse>('/partners/orders/me', { params }),

// store/orderStore.ts
fetchMyOrders: async (page = 1, limit = 10, status?: string) => {
  set({ loading: true, error: null });
  try {
    const response = await apiClient.order.getMyOrders({ page, limit, status });
    set({ 
      orders: response.data.orders,
      total: response.data.total,
      currentPage: page,
      loading: false 
    });
  } catch (error) {
    set({ error: error.message, loading: false });
  }
},
```

##### Get Today's Orders
```typescript
// utils/apiClient.ts
getTodayOrders: () => api.get<TodayOrdersResponse>('/partners/orders/me/today'),

// store/orderStore.ts
fetchTodayOrders: async () => {
  try {
    const response = await apiClient.order.getTodayOrders();
    set({ todayOrders: response.data });
  } catch (error) {
    console.error('Failed to fetch today orders:', error);
  }
},
```

#### 3. **Menu Management**

```typescript
// utils/apiClient.ts
getMyMenu: () => api.get<MenuResponse>('/partners/menu/me'),

// store/menuStore.ts
fetchMyMenu: async () => {
  set({ loading: true, error: null });
  try {
    const response = await apiClient.menu.getMyMenu();
    set({ 
      menuItems: response.data.menuItems,
      categories: response.data.categories,
      loading: false 
    });
  } catch (error) {
    set({ error: error.message, loading: false });
  }
},
```

#### 4. **Business Statistics**

```typescript
// utils/apiClient.ts
getMyStats: () => api.get<PartnerStats>('/partners/stats/me'),

// store/analyticsStore.ts
fetchStats: async () => {
  set({ loading: true, error: null });
  try {
    const response = await apiClient.analytics.getMyStats();
    set({ stats: response.data, loading: false });
  } catch (error) {
    set({ error: error.message, loading: false });
  }
},
```

#### 5. **Status Control**

```typescript
// utils/apiClient.ts
updateAcceptingStatus: (isAcceptingOrders: boolean) =>
  api.put<PartnerProfile>('/partners/status/me', { isAcceptingOrders }),

// store/partnerStore.ts
toggleAcceptingOrders: async (isAccepting: boolean) => {
  try {
    const response = await apiClient.partner.updateAcceptingStatus(isAccepting);
    set({ profile: response.data });
  } catch (error) {
    set({ error: error.message });
    throw error; // Re-throw for UI feedback
  }
},
```

### Complete Integration Example

Here's how to integrate the dashboard screen with real APIs:

```tsx
// app/(tabs)/index.tsx - Dashboard Screen
import { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { usePartnerStore } from '../store/partnerStore';
import { useOrderStore } from '../store/orderStore';
import { useAnalyticsStore } from '../store/analyticsStore';

export default function DashboardScreen() {
  const { profile, fetchCurrentProfile } = usePartnerStore();
  const { todayOrders, fetchTodayOrders } = useOrderStore();
  const { stats, fetchStats, loading: statsLoading } = useAnalyticsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  const loadDashboardData = async () => {
    try {
      await Promise.all([
        fetchCurrentProfile(),
        fetchTodayOrders(), 
        fetchStats()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };
  
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ padding: 16 }}>
        {/* Welcome Section */}
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
          Welcome, {profile?.businessName || 'Partner'}!
        </Text>
        
        {/* Status Toggle */}
        <StatusToggle 
          isAccepting={profile?.isAcceptingOrders || false}
          onToggle={toggleAcceptingOrders}
        />
        
        {/* Today's Stats */}
        <TodayStatsCard orders={todayOrders} />
        
        {/* Business Analytics */}
        {!statsLoading && stats && (
          <BusinessStatsCard stats={stats} />
        )}
        
        {/* Recent Orders */}
        <RecentOrdersList orders={todayOrders?.todayOrders || []} />
      </View>
    </ScrollView>
  );
}
```

### Type Definitions for New APIs

Add these types to your `types/` directory:

```typescript
// types/partner.ts
export interface PartnerProfile {
  id: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  description: string;
  cuisineTypes: string[];
  address: Address;
  businessHours: BusinessHours;
  logoUrl?: string;
  bannerUrl?: string;
  isAcceptingOrders: boolean;
  isFeatured: boolean;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// types/order.ts
export interface TodayOrdersResponse {
  todayOrders: Order[];
  todayStats: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  };
}

// types/analytics.ts
export interface PartnerStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageRating: number;
  totalReviews: number;
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  dailyRevenue: number;
  topSellingItems: Array<{
    itemName: string;
    orderCount: number;
    revenue: number;
  }>;
}
```

### 5. Add Error Handling
```tsx
// components/ErrorBoundary.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

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
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Something went wrong!
          </Text>
          <Button
            title="Try Again"
            onPress={() => this.setState({ hasError: false })}
          />
        </View>
      );
    }
    
    return this.props.children;
  }
}
```

---

## 🎨 UI Development Guidelines

### Component Structure
```tsx
// components/ExampleCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExampleItem } from '../types/example';

interface ExampleCardProps {
  item: ExampleItem;
  onPress?: () => void;
}

export function ExampleCard({ item, onPress }: ExampleCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      {/* ... other content */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF6E9',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
});
```

### Design System
```typescript
// constants/theme.ts
export const theme = {
  colors: {
    primary: '#FF9F43',
    secondary: '#FEF6E9',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      light: '#9CA3AF',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};
```

---

## 🔄 Screen Integration Workflow

### 1. Analyze Current Screen
- Review existing mock data usage
- Identify required API endpoints
- Check available UI components

### 2. Update Types
- Add/update TypeScript interfaces
- Ensure type safety across the app

### 3. Integrate Store
- Import relevant store hooks
- Replace mock data with store state
- Add loading and error states

### 4. Handle Side Effects
```tsx
// Example screen integration
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';

export default function OrdersScreen() {
  const { user } = useAuthStore();
  const { orders, loading, error, fetchOrders } = useOrderStore();
  
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);
  
  // ... rest of component
}
```

### 5. Add Error Handling
```tsx
// components/ErrorBoundary.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

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
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Something went wrong!
          </Text>
          <Button
            title="Try Again"
            onPress={() => this.setState({ hasError: false })}
          />
        </View>
      );
    }
    
    return this.props.children;
  }
}
```

---

## 🧪 Testing Guidelines

### Unit Testing
```typescript
// __tests__/store/authStore.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthStore } from '../../store/authStore';

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
  });
  
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
```

### Component Testing
```typescript
// __tests__/components/ExampleCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ExampleCard } from '../../components/ExampleCard';

const mockItem = {
  id: '1',
  name: 'Test Item',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
};

describe('ExampleCard', () => {
  it('renders item name correctly', () => {
    const { getByText } = render(<ExampleCard item={mockItem} />);
    expect(getByText('Test Item')).toBeTruthy();
  });
  
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ExampleCard item={mockItem} onPress={onPress} />
    );
    
    fireEvent.press(getByTestId('example-card'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

---

## 🔧 Development Commands

```bash
# Development
npm run dev                 # Start development server
npm run dev:ios            # Start iOS development
npm run dev:android        # Start Android development

# Environment
npm run check:env          # Check environment configuration

# Building
npm run build              # Build for production
npm run export             # Export static files

# Testing
npm test                   # Run tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run type-check         # TypeScript type checking
```

---

## 📱 Platform-Specific Notes

### iOS Development
- Ensure Xcode is installed and up to date
- iOS Simulator or physical device required
- Test on different screen sizes (iPhone SE, iPhone 14 Pro, iPad)

### Android Development
- Android Studio with SDK installed
- Android emulator or physical device
- Test on different screen densities and Android versions

### Web Development
- Works with Expo Router web support
- Responsive design considerations
- Browser compatibility testing

---

## 🚀 Deployment Guide

### Development Deployment
```bash
# Export for web
npm run export

# Deploy to Expo
npx expo publish
```

### Production Deployment
```bash
# Build for app stores
npx expo build:ios
npx expo build:android

# Web deployment
npm run build:web
```

---

## 📝 Code Review Checklist

### Before Submitting PR
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Tests added/updated for new functionality
- [ ] Error handling implemented
- [ ] Loading states included
- [ ] Responsive design tested
- [ ] Performance considerations reviewed
- [ ] Documentation updated

### Code Quality Standards
- Use TypeScript for all new code
- Follow established naming conventions
- Add JSDoc comments for complex functions
- Keep components small and focused
- Implement proper error boundaries
- Use consistent styling patterns
- Add appropriate tests

---

## 🔗 Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Documentation](https://tanstack.com/query)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Last Updated: December 2024*
*For questions or issues, refer to the team documentation or create an issue.*
