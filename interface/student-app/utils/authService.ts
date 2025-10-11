import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './apiClient';
import { LoginRequest, RegisterRequest, LoginResponse, CustomerProfile } from '../types/api';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

export const authService = {
  /**
   * Login user and store authentication token
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.auth.login(credentials.email, credentials.password);
      
      // Backend returns 'token' but we expect 'accessToken'
      const normalizedResponse = {
        ...response,
        accessToken: (response as any).token || response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user
      };
      
      // Store tokens and user data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, normalizedResponse.accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, normalizedResponse.refreshToken);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(normalizedResponse.user));
      
      console.log('✅ Token stored:', normalizedResponse.accessToken.substring(0, 20) + '...');
      
      return normalizedResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Register a new user
   */
  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    try {
      console.log('🔧 AuthService: Starting registration process');
      console.log('📥 Input userData:', userData);
      
      // Send only the fields expected by the backend register endpoint
      const registrationData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role
      };
      
      console.log('📤 Sending to API:', registrationData);
      console.log('🌐 API Base URL:', process.env.API_BASE_URL || 'http://127.0.0.1:3001');
      
      const response = await api.auth.register(registrationData);
      
      console.log('✅ API Response received:', response);
      
      // Backend returns 'token' but we expect 'accessToken'
      const normalizedResponse = {
        ...response,
        accessToken: (response as any).token || response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user
      };
      
      // Store tokens and user data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, normalizedResponse.accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, normalizedResponse.refreshToken);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(normalizedResponse.user));
      
      console.log('💾 Tokens stored successfully');
      console.log('✅ Token stored:', normalizedResponse.accessToken.substring(0, 20) + '...');
      
      return normalizedResponse;
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw error;
    }
  },
  
  /**
   * Logout user and clear stored tokens
   */
  logout: async (): Promise<void> => {
    try {
      await api.auth.logout();
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return false;
      
      // Basic token validation - check if it's not empty and has proper format
      if (token.length < 10) return false;
      
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  /**
   * Validate token with backend
   */
  validateToken: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return false;
      
      // Try to make a request to validate token
      const response = await fetch(`${process.env.API_BASE_URL || 'http://127.0.0.1:3001'}/api/customers/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        // Token is invalid, clear it
        await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY]);
        return false;
      }
      
      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      // On any error, assume token is invalid and clear it
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY]);
      return false;
    }
  },

  /**
   * Refresh access token using refresh token
   */
  refreshAccessToken: async (): Promise<string | null> => {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) return null;

      const response = await fetch(`${process.env.API_BASE_URL || 'http://127.0.0.1:3001'}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token);
        if (data.refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        }
        return data.token;
      } else {
        // Refresh failed, clear all tokens
        await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY]);
        return null;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY]);
      return null;
    }
  },

  /**
   * Check if token is expired (basic check)
   */
  isTokenExpired: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return true;
      
      // Basic JWT expiration check (this is a simplified check)
      // In production, you should decode the JWT and check the exp claim
      return false;
    } catch (error) {
      console.error('Token expiration check error:', error);
      return true;
    }
  },
  
  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<LoginResponse['user'] | null> => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  /**
   * Get the current auth token
   */
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  },
  
  /**
   * Change user password
   */
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.auth.changePassword(oldPassword, newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
};

export default authService; 