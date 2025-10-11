# Mobile Scope Onboarding

## Quick Start for Mobile Development

### 🎯 Scope Overview
You're working on **two Expo React Native apps**:
1. **Student App** (`interface/student-app/`) - For students/bachelors ordering meals
2. **Partner App** (`interface/partner-app/`) - For food partners managing orders

Both apps use Expo Router, TypeScript, and Zustand for state management.

### 📁 Key Directories
```
interface/student-app/ (or partner-app/)
├── app/                   # Expo Router pages
│   ├── (auth)/           # Authentication screens
│   ├── (tabs)/           # Tab navigation screens
│   └── _layout.tsx       # Root layout
├── components/            # Reusable components
├── store/                 # Zustand stores
├── types/                 # TypeScript types
├── utils/                 # Utility functions
└── config/               # Environment configuration
```

### 🚀 Quick Commands
```bash
# Start development server
pnpm run mobile:dev        # Student app
pnpm run partner:dev       # Partner app

# Run on specific platforms
pnpm run mobile:android    # Android
pnpm run mobile:ios        # iOS

# Build for deployment
pnpm run mobile:build:web  # Web build
pnpm run mobile:build:gcloud # Google Cloud build
```

### 🔧 Environment Setup
```env
# Required environment variables
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001/api
EXPO_PUBLIC_ENVIRONMENT=development
```

### 📚 Key Concepts

#### Navigation Structure (Expo Router)
```typescript
// File-based routing
app/
├── (auth)/
│   ├── login.tsx
│   └── signup.tsx
├── (tabs)/
│   ├── dashboard.tsx
│   ├── orders.tsx
│   └── profile.tsx
└── _layout.tsx
```

#### Screen Pattern
```typescript
const DashboardScreen = () => {
  const { data, loading } = useQuery(GET_DASHBOARD_DATA);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView>
        {/* Screen content */}
      </ScrollView>
    </SafeAreaView>
  );
};
```

#### State Management (Zustand)
```typescript
interface OrderStore {
  orders: Order[];
  activeOrder: Order | null;
  fetchOrders: () => Promise<void>;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
}

const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  activeOrder: null,
  fetchOrders: async () => {
    // Fetch orders logic
  },
  updateOrder: (orderId, updates) => {
    // Update order logic
  },
}));
```

#### API Integration
```typescript
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 🎯 Current Priorities

#### Student App
1. **Complete Order Flow** - Meal selection, customization, checkout
2. **Payment Integration** - Payment methods, billing
3. **Real-time Tracking** - Order status updates
4. **Push Notifications** - Order updates, promotions

#### Partner App
1. **Order Management** - Order list, status updates
2. **Menu Management** - Menu editing, item management
3. **Earnings Dashboard** - Revenue tracking, analytics
4. **Customer Communication** - Chat, notifications

### 📱 Platform Considerations

#### iOS
- **Safe Area**: Use SafeAreaView for proper spacing
- **Navigation**: Follow iOS design guidelines
- **Permissions**: Camera, notifications, location
- **Performance**: Optimize for iOS devices

#### Android
- **Status Bar**: Handle status bar properly
- **Navigation**: Follow Material Design
- **Permissions**: Request permissions appropriately
- **Performance**: Optimize for Android devices

#### Web (Expo Web)
- **Responsive Design**: Adapt to different screen sizes
- **Browser Compatibility**: Test on multiple browsers
- **Performance**: Optimize bundle size
- **PWA**: Progressive Web App features

### 🎨 UI Components
- **React Native**: Core components
- **Expo Vector Icons**: Icon library
- **Lucide React Native**: Additional icons
- **Custom Components**: Tiffin-Wale specific components

### 🔍 Development Tools
- **Expo DevTools**: Development and debugging
- **React Native Debugger**: Advanced debugging
- **Flipper**: Network inspection
- **Metro Bundler**: Fast bundling

### 🧪 Testing
```bash
# Run tests (when implemented)
pnpm test

# Lint code
pnpm run mobile:lint
pnpm run partner:lint

# Type checking
npx tsc --noEmit
```

### 📝 Development Guidelines
1. **Use TypeScript** - All components should be typed
2. **Follow React Native patterns** - Platform-specific considerations
3. **Handle permissions** - Request permissions appropriately
4. **Optimize performance** - Minimize re-renders, optimize images
5. **Test on devices** - Test on physical devices, not just simulator

### 🔗 Related Scopes
- **Backend**: Consumes APIs from NestJS backend
- **Frontend**: Shares similar user flows with web app
- **Admin**: Different interface for admin users

### 🚨 Common Issues
1. **API Integration**: Check API base URL and network requests
2. **Authentication**: Verify JWT token handling and storage
3. **Navigation**: Ensure proper navigation structure
4. **Performance**: Monitor bundle size and app performance

### 📞 Quick Help
- **API Issues**: Check network tab and API documentation
- **Navigation Issues**: Verify Expo Router configuration
- **Performance Issues**: Use React Native Debugger
- **Build Issues**: Check Expo configuration and dependencies

### 🎯 Key Features to Implement

#### Student App
1. **Authentication** - Login, register, biometric auth
2. **Dashboard** - Active subscriptions, quick actions
3. **Meal Selection** - Menu browsing, customization
4. **Order Tracking** - Real-time order status
5. **Payment Methods** - Payment setup, billing
6. **Push Notifications** - Order updates, promotions

#### Partner App
1. **Authentication** - Partner login, business verification
2. **Order Management** - Order list, status updates
3. **Menu Management** - Menu editing, item management
4. **Earnings Dashboard** - Revenue tracking, analytics
5. **Customer Communication** - Chat, notifications
6. **Business Analytics** - Performance metrics, insights

### 📱 Device Testing
- **iOS Simulator**: Test iOS-specific features
- **Android Emulator**: Test Android-specific features
- **Physical Devices**: Test on real devices
- **Web Browser**: Test web version

### 🔧 Performance Optimization
- **Bundle Size**: Code splitting and lazy loading
- **Image Optimization**: Compress images, use appropriate formats
- **Memory Management**: Avoid memory leaks
- **Network Optimization**: Implement caching and offline support

### 📱 Platform-Specific Features

#### iOS Features
- **Biometric Authentication**: Face ID, Touch ID
- **Push Notifications**: APNs integration
- **Haptic Feedback**: Tactile responses
- **Share Extension**: Share content

#### Android Features
- **Biometric Authentication**: Fingerprint, face unlock
- **Push Notifications**: FCM integration
- **Haptic Feedback**: Vibration feedback
- **Share Intent**: Share content

#### Web Features
- **PWA**: Installable web app
- **Offline Support**: Service workers
- **Push Notifications**: Web push API
- **Responsive Design**: Adaptive layouts

---

**Remember**: Mobile apps are the primary interface for many users. Focus on performance, user experience, and platform-specific best practices. Test thoroughly on real devices. 