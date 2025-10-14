# Tiffin-Wale Partner App - Development Guide

## Prerequisites

### Required Software
- **Node.js**: >= 18.0.0
- **npm/yarn/bun**: Latest version
- **Expo CLI**: Latest version
- **Git**: Latest version
- **VS Code**: Recommended IDE
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)

### Installation Commands
```bash
# Install Node.js dependencies
npm install

# Install Expo CLI globally
npm install -g @expo/cli

# Install project dependencies
npm install
# or
yarn install
# or
bun install
```

## Environment Setup

### Environment Variables
Create a `.env` file in the root directory:
```env
# API Configuration
API_BASE_URL=http://localhost:3001/api
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Environment
NODE_ENV=development
EXPO_PUBLIC_ENVIRONMENT=development

# Optional: Expo configuration
EXPO_PUBLIC_APP_NAME=TiffinWale Partner
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Configuration Files

#### `app.config.ts`
```typescript
import 'dotenv/config';

export default {
  expo: {
    name: "TiffinWale Partner",
    slug: "tiffinwale-partner",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "tiffinwale-partner",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/favicon.png",
      name: "TiffinWale Partner - Restaurant Management",
      shortName: "TiffinWale Partner",
      description: "TiffinWale Partner App - Manage your restaurant",
      lang: "en",
      scope: "/",
      themeColor: "#FF9B42",
      backgroundColor: "#FFFAF0"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser"
    ],
    experiments: {
      typedRoutes: true
    },
    android: {
      package: "com.tiffinwale_official.tiffinwalepartner"
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
    }
  }
};
```

## Development Commands

### Basic Commands
```bash
# Start development server
npm run dev
# or
yarn dev
# or
bun run dev

# Start with specific options
npm run start:tunnel    # Start with tunnel
npm run start:lan       # Start with LAN
npm run start:localhost # Start with localhost only

# Clear cache
npm run clear-cache
```

### Build Commands
```bash
# Build for web
npm run build:web

# Build for Google Cloud
npm run build:gcloud

# Export for web
npm run export:web
```

### Deployment Commands
```bash
# Deploy to Google Cloud
npm run deploy:gcloud

# Check environment
npm run check:env
```

### Linting and Formatting
```bash
# Run linter
npm run lint

# Format code (if configured)
npm run format
```

## Project Structure

### Directory Layout
```
partner-app/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   └── +not-found.tsx     # 404 page
├── components/            # Reusable UI components
├── store/                 # Zustand state management
├── utils/                 # API client and utilities
├── types/                 # TypeScript type definitions
├── config/                # Environment configuration
├── assets/                # Images, fonts, icons
├── hooks/                 # Custom React hooks
├── scripts/               # Build and deployment scripts
├── docs/                  # Documentation
├── memory-bank/           # Project memory bank
├── package.json           # Dependencies and scripts
├── app.config.ts          # Expo configuration
├── tsconfig.json          # TypeScript configuration
├── babel.config.js        # Babel configuration
├── metro.config.js        # Metro bundler configuration
└── .env                   # Environment variables
```

### Key Files
- `app/_layout.tsx`: Root layout with providers
- `app/(tabs)/_layout.tsx`: Tab navigation layout
- `utils/apiClient.ts`: API client configuration
- `store/authStore.ts`: Authentication state management
- `config/environment.ts`: Environment configuration

## Development Workflow

### 1. Setup Development Environment
```bash
# Clone repository
git clone <repository-url>
cd partner-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### 2. Development Process
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ... edit files ...

# Test changes
npm run lint
npm run check:env

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push changes
git push origin feature/new-feature
```

### 3. Testing
```bash
# Run tests (if configured)
npm test

# Test on different platforms
npm run start:android  # Android emulator
npm run start:ios      # iOS simulator
npm run start:web      # Web browser
```

## API Integration

### Backend Setup
Ensure the backend is running:
```bash
# In monolith_backend directory
npm run start:dev
```

### API Client Configuration
```typescript
// utils/apiClient.ts
import axios from 'axios';
import { config } from '../config/environment';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add authentication interceptor
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('partner_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Testing API Integration
```bash
# Test API connection
npm run check:env

# Test specific endpoints
# Use Postman or similar tool to test API endpoints
```

## State Management

### Store Setup
```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State and actions
    }),
    {
      name: 'partner-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Using Stores in Components
```typescript
// In component
import { useAuthStore } from '../store/authStore';

const MyComponent = () => {
  const { user, login, isLoading } = useAuthStore();
  
  // Component logic
};
```

## UI Development

### Component Structure
```typescript
// components/MyComponent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### Screen Structure
```typescript
// app/(tabs)/dashboard.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function DashboardScreen() {
  const { user, fetchProfile } = useAuthStore();
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text>Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

## Navigation

### Expo Router Setup
```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

### Tab Navigation
```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders' }} />
      <Tabs.Screen name="earnings" options={{ title: 'Earnings' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

### Navigation Usage
```typescript
import { useRouter } from 'expo-router';

const MyComponent = () => {
  const router = useRouter();
  
  const handleNavigate = () => {
    router.push('/orders');
  };
  
  return (
    // Component JSX
  );
};
```

## Styling

### Design System
```typescript
// styles/theme.ts
export const colors = {
  primary: '#FF9F43',
  secondary: '#FFFAF0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#9CA3AF',
  },
};

export const fonts = {
  primary: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

### Component Styling
```typescript
import { StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../styles/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: spacing.md,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
});
```

## Testing

### Unit Testing Setup
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native

# Create jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

### Component Testing
```typescript
// __tests__/components/MyComponent.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MyComponent } from '../../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

### Store Testing
```typescript
// __tests__/store/authStore.test.ts
import { useAuthStore } from '../../store/authStore';

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  });
  
  it('should login successfully', async () => {
    const { login } = useAuthStore.getState();
    await login('test@example.com', 'password');
    
    const { isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
  });
});
```

## Debugging

### Development Tools
```bash
# Start with debugging
npm run start:debug

# Use React Native Debugger
# Install React Native Debugger from GitHub releases
```

### Console Logging
```typescript
// Use console.log for debugging
console.log('Debug info:', data);

// Use console.error for errors
console.error('Error occurred:', error);
```

### Network Debugging
```typescript
// Enable network logging in apiClient
apiClient.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);
```

## Performance Optimization

### Bundle Optimization
```bash
# Analyze bundle size
npx expo export --platform web --dump-assetmap

# Optimize images
# Use WebP format for images
# Compress images before adding to assets
```

### Code Splitting
```typescript
// Lazy load components
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

const MyScreen = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
};
```

### Memory Management
```typescript
// Clean up subscriptions
useEffect(() => {
  const subscription = someService.subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## Deployment

### Build Process
```bash
# Build for production
npm run build:gcloud

# Deploy to Google Cloud
npm run deploy:gcloud
```

### Environment Configuration
```typescript
// config/environment.ts
export const config = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
};
```

### Production Checklist
- [ ] Update environment variables
- [ ] Test on real devices
- [ ] Optimize bundle size
- [ ] Test API integration
- [ ] Verify authentication flow
- [ ] Test offline functionality
- [ ] Check performance metrics

## Troubleshooting

### Common Issues

#### Metro Bundler Issues
```bash
# Clear Metro cache
npx expo start --clear

# Reset Metro cache
npx expo start --reset-cache
```

#### Android Build Issues
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Rebuild
npx expo run:android
```

#### iOS Build Issues
```bash
# Clean iOS build
cd ios && xcodebuild clean && cd ..

# Rebuild
npx expo run:ios
```

#### API Connection Issues
```bash
# Check API server
curl http://localhost:3001/api/health

# Check environment variables
npm run check:env
```

### Debugging Steps
1. Check console logs for errors
2. Verify environment variables
3. Test API endpoints directly
4. Clear app cache and restart
5. Check network connectivity
6. Verify authentication tokens

## Best Practices

### Code Organization
- Use consistent file naming conventions
- Organize components by feature
- Keep components small and focused
- Use TypeScript for type safety
- Implement proper error handling

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize images and assets
- Use lazy loading where appropriate
- Monitor bundle size

### Security
- Never commit sensitive data
- Use environment variables for configuration
- Implement proper authentication
- Validate all user inputs
- Use HTTPS in production

### Testing
- Write unit tests for utilities
- Test component rendering
- Test store actions and state
- Implement integration tests
- Test on real devices

---

*This development guide provides comprehensive instructions for setting up, developing, and deploying the Tiffin-Wale Partner App.*
