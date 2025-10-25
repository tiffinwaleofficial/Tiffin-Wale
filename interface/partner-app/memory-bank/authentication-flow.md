# Partner App Authentication Flow

## 🔐 Authentication Architecture

### **Overview**
The Partner App uses a JWT-based authentication system with automatic token refresh, secure storage, and role-based access control specifically designed for restaurant partners.

### **Authentication Flow Diagram**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Login Screen  │───▶│  Auth Service   │───▶│  Backend API    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Auth Store     │◀───│ Token Manager   │◀───│ JWT Response    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ Protected Route │    │ Secure Storage  │
└─────────────────┘    └─────────────────┘
```

---

## 🏗️ Authentication Components

### **1. Auth Service (`utils/authService.ts`)**
Central service handling all authentication operations:

```typescript
class AuthService {
  // Login with email/password
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Store tokens securely
    await this.storeTokens(
      response.data.accessToken,
      response.data.refreshToken
    );
    
    // Store user data
    await this.storeUserData(response.data.user);
    
    return response.data;
  }
  
  // Phone number login with Firebase
  async loginWithPhone(phoneNumber: string, firebaseUid: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login-phone', {
      phoneNumber,
      firebaseUid,
    });
    
    await this.storeTokens(
      response.data.accessToken,
      response.data.refreshToken
    );
    
    return response.data;
  }
  
  // Partner registration
  async register(partnerData: CreatePartnerData): Promise<LoginResponse> {
    const response = await apiClient.post('/partners', partnerData);
    
    await this.storeTokens(
      response.data.accessToken,
      response.data.refreshToken
    );
    
    return response.data;
  }
  
  // Token validation
  async validateToken(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) return false;
      
      const response = await apiClient.get('/auth/validate');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
  
  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await this.clearStoredData();
    }
  }
}
```

### **2. Token Manager (`utils/tokenManager.ts`)**
Handles secure token storage and automatic refresh:

```typescript
class TokenManager {
  private static instance: TokenManager;
  
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }
  
  // Store tokens securely
  async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.multiSet([
      ['partner_auth_token', accessToken],
      ['partner_refresh_token', refreshToken],
    ]);
  }
  
  // Get access token
  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem('partner_auth_token');
  }
  
  // Get refresh token
  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem('partner_refresh_token');
  }
  
  // Check if tokens exist
  async hasTokens(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const refreshToken = await this.getRefreshToken();
    return !!(accessToken && refreshToken);
  }
  
  // Refresh access token
  async refreshToken(): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    await this.storeTokens(
      response.data.accessToken,
      response.data.refreshToken
    );
  }
  
  // Clear all tokens
  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([
      'partner_auth_token',
      'partner_refresh_token',
    ]);
  }
}
```

### **3. Auth Store (`store/authStore.ts`)**
Zustand store managing authentication state:

```typescript
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      partner: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      isInitialized: false,
      
      // Initialize authentication
      initializeAuth: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const isAuthenticated = await authService.isAuthenticated();
          
          if (isAuthenticated) {
            const storedUser = await authService.getCurrentUser();
            const isValidWithBackend = await authService.validateToken();
            
            if (isValidWithBackend && storedUser) {
              set({ 
                user: storedUser, 
                isAuthenticated: true, 
                isLoading: false,
                isInitialized: true,
              });
              return;
            } else {
              await authService.logout();
            }
          }
          
          set({ 
            user: null,
            isAuthenticated: false, 
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          set({ 
            user: null,
            isAuthenticated: false, 
            isLoading: false,
            isInitialized: true,
            error: error.message,
          });
        }
      },
      
      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          
          set({ 
            user: response.user,
            partner: response.partner || null,
            token: response.accessToken || response.token,
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false 
          });
          throw error;
        }
      },
      
      // Logout action
      logout: async () => {
        set({ isLoggingOut: true, isLoading: true });
        
        try {
          await authService.logout();
          await tokenManager.clearTokens();
          
          set({ 
            user: null,
            partner: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false, 
            isLoading: false,
            isLoggingOut: false 
          });
        } catch (error) {
          // Even if logout API fails, clear local state
          await tokenManager.clearTokens();
          set({ 
            user: null,
            partner: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: error.message, 
            isLoading: false,
            isLoggingOut: false 
          });
        }
      },
      
      // ... other actions
    }),
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
  )
);
```

---

## 🛡️ Protected Routes & Guards

### **1. Protected Route Component**
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
  const { isAuthenticated, user, isLoading, isInitialized } = useAuthStore();
  
  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }
  
  // Check authentication
  if (!isAuthenticated) {
    return fallback;
  }
  
  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <UnauthorizedScreen />;
  }
  
  return <>{children}</>;
}
```

### **2. Auth Guard Hook**
```typescript
// hooks/useAuthGuard.ts
export function useAuthGuard(requiredRole?: string) {
  const { isAuthenticated, user, isLoading, isInitialized } = useAuthStore();
  
  const isAuthorized = useMemo(() => {
    if (!isInitialized || isLoading) return 'loading';
    if (!isAuthenticated) return 'unauthenticated';
    if (requiredRole && user?.role !== requiredRole) return 'unauthorized';
    return 'authorized';
  }, [isAuthenticated, user, isLoading, isInitialized, requiredRole]);
  
  return {
    isAuthorized,
    isLoading: !isInitialized || isLoading,
    user,
  };
}
```

### **3. Role Guard Component**
```typescript
// components/auth/RoleGuard.tsx
interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = <UnauthorizedScreen />
}: RoleGuardProps) {
  const { user } = useAuthStore();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }
  
  return <>{children}</>;
}
```

---

## 📱 Login Flow Implementation

### **1. Login Screen**
```typescript
// app/(auth)/login.tsx
export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const handleLogin = async () => {
    try {
      await login(formData.email, formData.password);
      // Navigation handled automatically by ProtectedRoute
    } catch (error) {
      // Error displayed in UI
    }
  };
  
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Partner Login</Text>
        
        <Input
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Input
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
          secureTextEntry
        />
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Button
          title="Login"
          onPress={handleLogin}
          loading={isLoading}
          disabled={!formData.email || !formData.password}
        />
        
        <TouchableOpacity onPress={() => router.push('/phone-input')}>
          <Text style={styles.linkText}>Login with Phone Number</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
```

### **2. Phone Login Flow**
```typescript
// app/(auth)/phone-input.tsx
export default function PhoneInputScreen() {
  const { loginWithPhone, checkUserExists, isLoading } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const handlePhoneSubmit = async () => {
    try {
      const userExists = await checkUserExists(phoneNumber);
      
      if (userExists) {
        // Navigate to OTP verification
        router.push({
          pathname: '/otp-verification',
          params: { phoneNumber }
        });
      } else {
        // Navigate to registration
        router.push({
          pathname: '/signup',
          params: { phoneNumber }
        });
      }
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Enter Phone Number</Text>
        
        <Input
          label="Phone Number"
          placeholder="+91 9876543210"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        
        <Button
          title="Continue"
          onPress={handlePhoneSubmit}
          loading={isLoading}
          disabled={!phoneNumber}
        />
      </View>
    </Screen>
  );
}
```

### **3. OTP Verification**
```typescript
// app/(auth)/otp-verification.tsx
export default function OTPVerificationScreen() {
  const { loginWithPhone, isLoading } = useAuthStore();
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  
  const handleOTPSubmit = async () => {
    try {
      // Verify OTP with Firebase
      const credential = await confirmOTP(otp);
      
      // Login with Firebase UID
      await loginWithPhone(phoneNumber as string, credential.user.uid);
      
      // Navigation handled automatically
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the OTP sent to {phoneNumber}
        </Text>
        
        <Input
          label="OTP"
          placeholder="123456"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
        />
        
        <Button
          title="Verify"
          onPress={handleOTPSubmit}
          loading={isLoading}
          disabled={otp.length !== 6}
        />
      </View>
    </Screen>
  );
}
```

---

## 🔄 Automatic Token Refresh

### **API Client Interceptor**
```typescript
// utils/apiClient.ts
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await tokenManager.refreshToken();
        
        // Retry original request with new token
        const newToken = await tokenManager.getAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        await authService.logout();
        DeviceEventEmitter.emit('partner_auth:token-expired');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### **Token Expiration Handling**
```typescript
// components/auth/AuthErrorHandler.tsx
export function AuthErrorHandler() {
  const { logout } = useAuthStore();
  
  useEffect(() => {
    const handleTokenExpired = () => {
      logout();
      router.replace('/login');
    };
    
    const subscription = DeviceEventEmitter.addListener(
      'partner_auth:token-expired',
      handleTokenExpired
    );
    
    return () => subscription.remove();
  }, [logout]);
  
  return null;
}
```

---

## 🔒 Security Best Practices

### **1. Secure Token Storage**
```typescript
// Use secure storage for sensitive data
import * as SecureStore from 'expo-secure-store';

const storeTokensSecurely = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync('access_token', accessToken);
  await SecureStore.setItemAsync('refresh_token', refreshToken);
};
```

### **2. Input Validation**
```typescript
// Validate inputs before sending to API
const validateLoginInput = (email: string, password: string) => {
  const errors: string[] = [];
  
  if (!email || !isValidEmail(email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  return errors;
};
```

### **3. Rate Limiting**
```typescript
// Implement rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

const checkRateLimit = (email: string) => {
  const attempts = loginAttempts.get(email);
  const now = Date.now();
  
  if (attempts) {
    const timeDiff = now - attempts.lastAttempt;
    if (timeDiff < 60000 && attempts.count >= 5) { // 5 attempts per minute
      throw new Error('Too many login attempts. Please try again later.');
    }
    
    if (timeDiff > 60000) {
      attempts.count = 0; // Reset counter after 1 minute
    }
  }
  
  loginAttempts.set(email, {
    count: (attempts?.count || 0) + 1,
    lastAttempt: now,
  });
};
```

### **4. Session Management**
```typescript
// Implement session timeout
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const checkSessionTimeout = () => {
  const lastActivity = AsyncStorage.getItem('last_activity');
  const now = Date.now();
  
  if (lastActivity && (now - parseInt(lastActivity)) > SESSION_TIMEOUT) {
    authService.logout();
  }
};

// Update last activity on user interaction
const updateLastActivity = () => {
  AsyncStorage.setItem('last_activity', Date.now().toString());
};
```

---

## 🧪 Testing Authentication

### **Unit Tests**
```typescript
// __tests__/auth/authService.test.ts
describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should login successfully', async () => {
    const mockResponse = {
      data: {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        user: { id: '1', email: 'test@example.com', role: 'business' },
      },
    };
    
    jest.spyOn(apiClient, 'post').mockResolvedValue(mockResponse);
    
    const result = await authService.login('test@example.com', 'password');
    
    expect(result.user.email).toBe('test@example.com');
    expect(result.accessToken).toBe('mock-token');
  });
  
  it('should handle login error', async () => {
    jest.spyOn(apiClient, 'post').mockRejectedValue(new Error('Invalid credentials'));
    
    await expect(authService.login('test@example.com', 'wrong-password'))
      .rejects.toThrow('Invalid credentials');
  });
});
```

### **Integration Tests**
```typescript
// __tests__/integration/authFlow.test.tsx
describe('Authentication Flow', () => {
  it('should complete login flow', async () => {
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

## 📊 Authentication Analytics

### **Login Metrics**
```typescript
// Track authentication events
const trackAuthEvent = (event: string, properties?: any) => {
  analytics.track(event, {
    ...properties,
    timestamp: new Date().toISOString(),
    platform: Platform.OS,
  });
};

// Usage in auth service
const login = async (email: string, password: string) => {
  const startTime = Date.now();
  
  try {
    const result = await authService.login(email, password);
    
    trackAuthEvent('login_success', {
      method: 'email',
      duration: Date.now() - startTime,
    });
    
    return result;
  } catch (error) {
    trackAuthEvent('login_failed', {
      method: 'email',
      error: error.message,
      duration: Date.now() - startTime,
    });
    
    throw error;
  }
};
```

---

## 🔧 Configuration

### **Environment Variables**
```typescript
// config/environment.ts
export const config = {
  // API Configuration
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
  
  // Authentication Configuration
  auth: {
    tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  
  // Firebase Configuration
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
};
```

---

*Last Updated: December 2024*
*Status: Authentication Flow Documented*
*Next Review: When security requirements change*
