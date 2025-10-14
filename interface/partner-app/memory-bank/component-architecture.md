# Tiffin-Wale Partner App - Component Architecture

## Overview
The Partner App follows a modular component architecture using React Native with Expo Router for navigation. The app is organized into logical sections with reusable components and consistent design patterns.

## App Structure

### File-Based Routing (Expo Router)
```
app/
├── _layout.tsx                 # Root layout with providers
├── (auth)/                    # Authentication group
│   ├── _layout.tsx           # Auth layout
│   ├── login.tsx             # Login screen
│   └── signup.tsx            # Registration screen
├── (tabs)/                    # Main tab navigation
│   ├── _layout.tsx           # Tab layout with bottom tabs
│   ├── index.tsx             # Dashboard (default tab)
│   ├── dashboard.tsx         # Dashboard screen
│   ├── orders.tsx            # Orders management
│   ├── earnings.tsx          # Earnings and analytics
│   ├── notifications.tsx     # Notifications
│   ├── home.tsx              # Home screen
│   └── profile/              # Profile sub-screens
│       ├── bank-account.tsx  # Bank account management
│       ├── business-profile.tsx # Business profile
│       ├── chat.tsx          # Customer chat
│       ├── help.tsx          # Help and support
│       ├── privacy.tsx       # Privacy settings
│       └── terms.tsx         # Terms and conditions
└── +not-found.tsx            # 404 page
```

## Core Components

### 1. Authentication Components

#### Login Screen (`app/(auth)/login.tsx`)
**Purpose**: Partner authentication
**Features**:
- Email/password login form
- Form validation with error handling
- Loading states and error messages
- Navigation to registration
- Remember me functionality

**Key Elements**:
- Email input field
- Password input field
- Login button with loading state
- Error message display
- Navigation links

#### Registration Screen (`app/(auth)/signup.tsx`)
**Purpose**: Partner account creation
**Features**:
- Business information form
- Address and contact details
- Form validation
- Terms and conditions acceptance
- Navigation to login

### 2. Dashboard Components

#### Dashboard Screen (`app/(tabs)/dashboard.tsx`)
**Purpose**: Main business overview
**Features**:
- Today's earnings display
- Order statistics cards
- Recent orders list
- Accepting orders toggle
- Quick action buttons
- Real-time data updates

**Key Elements**:
- Header with greeting and notifications
- Earnings card with revenue display
- Statistics cards (pending, active, completed orders)
- Recent orders list with status badges
- Quick actions (manage menu, earnings, support)
- Accepting orders status toggle

#### Orders Screen (`app/(tabs)/orders.tsx`)
**Purpose**: Order management interface
**Features**:
- Order list with filtering
- Status-based filtering tabs
- Meal type filtering
- Order status updates
- Search and sort functionality

**Key Elements**:
- Filter tabs (All, Active, Pending, etc.)
- Meal type tabs (Breakfast, Lunch, Dinner)
- Order cards with customer info
- Status badges and action buttons
- Search and filter controls

### 3. Profile Components

#### Business Profile (`app/(tabs)/profile/business-profile.tsx`)
**Purpose**: Business information management
**Features**:
- Business details form
- Operating hours configuration
- Cuisine type selection
- Location and contact info
- Profile image upload

#### Bank Account (`app/(tabs)/profile/bank-account.tsx`)
**Purpose**: Payment and payout management
**Features**:
- Bank account details form
- Payout history
- Payment method management
- Earnings summary

### 4. Reusable Components

#### Custom Components (`components/`)
```
components/
├── CustomTabBar.tsx          # Custom tab bar component
├── BackButton.tsx            # Navigation back button
├── ProfileAvatar.tsx         # User profile avatar
└── [Other reusable components]
```

## Navigation Architecture

### Tab Navigation Structure
```typescript
// Main tabs configuration
const tabs = [
  {
    name: 'dashboard',
    title: 'Dashboard',
    icon: 'home',
    component: DashboardScreen
  },
  {
    name: 'orders',
    title: 'Orders',
    icon: 'clipboard-list',
    component: OrdersScreen
  },
  {
    name: 'earnings',
    title: 'Earnings',
    icon: 'dollar-sign',
    component: EarningsScreen
  },
  {
    name: 'notifications',
    title: 'Notifications',
    icon: 'bell',
    component: NotificationsScreen
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: 'user',
    component: ProfileScreen
  }
];
```

### Navigation Patterns
- **Stack Navigation**: For auth flow and profile sub-screens
- **Tab Navigation**: For main app sections
- **Modal Navigation**: For forms and detailed views
- **Deep Linking**: For external navigation and notifications

## State Management Integration

### Component-State Connection
```typescript
// Example: Dashboard component with stores
const DashboardScreen = () => {
  const { user, partner, isAuthenticated } = useAuthStore();
  const { todayOrders, todayStats, fetchTodayOrders } = useOrderStore();
  const { profile, stats, fetchProfile, fetchStats } = usePartnerStore();
  
  // Component logic and UI
};
```

### Data Flow Pattern
1. **Component Mount**: Fetch initial data from stores
2. **User Interaction**: Trigger store actions
3. **Store Update**: Update local state and API calls
4. **UI Update**: Re-render with new data
5. **Persistence**: Save to AsyncStorage

## UI Design System

### Color Palette
```typescript
const colors = {
  primary: '#FF9F43',        // Orange - main brand color
  secondary: '#FFFAF0',      // Cream - background
  success: '#10B981',        // Green - success states
  warning: '#F59E0B',        // Yellow - warning states
  error: '#EF4444',          // Red - error states
  info: '#3B82F6',           // Blue - info states
  text: {
    primary: '#333333',      // Dark text
    secondary: '#666666',    // Medium text
    light: '#9CA3AF',        // Light text
  },
  background: {
    primary: '#FFFFFF',      // White backgrounds
    secondary: '#FEF6E9',    // Cream backgrounds
    card: '#FFFFFF',         // Card backgrounds
  }
};
```

### Typography
```typescript
const fonts = {
  primary: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  }
};
```

### Spacing System
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

## Component Patterns

### 1. Screen Component Pattern
```typescript
const ScreenComponent = () => {
  // Hooks
  const router = useRouter();
  const [state, setState] = useState();
  
  // Store hooks
  const { data, loading, error, fetchData } = useStore();
  
  // Effects
  useEffect(() => {
    fetchData();
  }, []);
  
  // Handlers
  const handleAction = async () => {
    // Action logic
  };
  
  // Render
  return (
    <ScrollView style={styles.container}>
      {/* Screen content */}
    </ScrollView>
  );
};
```

### 2. Card Component Pattern
```typescript
const CardComponent = ({ data, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{data.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(data.status).bg }]}>
          <Text style={[styles.statusText, { color: getStatusColor(data.status).text }]}>
            {data.status}
          </Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        {/* Card content */}
      </View>
    </TouchableOpacity>
  );
};
```

### 3. Form Component Pattern
```typescript
const FormComponent = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors(error.errors);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.form}>
      {/* Form fields */}
      <TouchableOpacity 
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

## Responsive Design

### Screen Size Handling
```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const isTablet = width >= 768;
const isSmallScreen = width < 375;

// Responsive styles
const styles = StyleSheet.create({
  container: {
    padding: isTablet ? 24 : 16,
  },
  card: {
    width: isTablet ? '48%' : '100%',
  }
});
```

### Orientation Handling
```typescript
const useOrientation = () => {
  const [orientation, setOrientation] = useState('portrait');
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(window.width > window.height ? 'landscape' : 'portrait');
    });
    
    return () => subscription?.remove();
  }, []);
  
  return orientation;
};
```

## Performance Optimization

### Component Optimization
- **React.memo**: For pure components
- **useMemo**: For expensive calculations
- **useCallback**: For event handlers
- **Lazy loading**: For heavy components

### List Optimization
```typescript
// FlatList optimization
<FlatList
  data={orders}
  renderItem={renderOrderCard}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

## Accessibility

### Accessibility Features
```typescript
// Accessible components
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Accept order"
  accessibilityHint="Double tap to accept this order"
  accessibilityRole="button"
>
  <Text>Accept Order</Text>
</TouchableOpacity>
```

### Screen Reader Support
- Proper accessibility labels
- Semantic roles
- Focus management
- VoiceOver/TalkBack compatibility

## Testing Strategy

### Component Testing
```typescript
// Example test
describe('OrderCard', () => {
  it('renders order information correctly', () => {
    const order = mockOrder();
    render(<OrderCard order={order} />);
    
    expect(screen.getByText(order.customerName)).toBeInTheDocument();
    expect(screen.getByText(order.status)).toBeInTheDocument();
  });
});
```

### Integration Testing
- Screen navigation testing
- Store integration testing
- API integration testing
- User flow testing

## Error Handling

### Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

### Error Display Patterns
- Toast notifications for temporary errors
- Inline error messages for form validation
- Error screens for critical failures
- Retry mechanisms for network errors

---

*This component architecture provides a solid foundation for the Partner App with consistent patterns, reusable components, and scalable structure.*




