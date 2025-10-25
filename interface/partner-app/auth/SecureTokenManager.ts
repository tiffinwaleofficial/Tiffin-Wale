import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Secure storage keys
const ACCESS_TOKEN_KEY = 'partner_secure_access_token';
const REFRESH_TOKEN_KEY = 'partner_secure_refresh_token';
const USER_DATA_KEY = 'partner_secure_user_data';
const AUTH_STATE_KEY = 'partner_secure_auth_state';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  lastLoginTime?: string;
  tokenExpiryTime?: string;
}

class SecureTokenManager {
  private accessToken: string | null = null; // Keep in memory only
  private isInitialized = false;
  private refreshPromise: Promise<void> | null = null; // Prevent concurrent refresh calls

  /**
   * Platform-aware secure storage methods
   */
  private async setSecureItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Use AsyncStorage for web (less secure but functional)
      await AsyncStorage.setItem(key, value);
    } else {
      // Use SecureStore for mobile (more secure)
      await SecureStore.setItemAsync(key, value);
    }
  }

  private async getSecureItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      // Use AsyncStorage for web
      return await AsyncStorage.getItem(key);
    } else {
      // Use SecureStore for mobile
      return await SecureStore.getItemAsync(key);
    }
  }

  private async deleteSecureItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Use AsyncStorage for web
      await AsyncStorage.removeItem(key);
    } else {
      // Use SecureStore for mobile
      await SecureStore.deleteItemAsync(key);
    }
  }

  /**
   * Initialize the token manager by loading tokens from secure storage
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load access token into memory (if exists)
      this.accessToken = await this.getSecureItem(ACCESS_TOKEN_KEY);
      this.isInitialized = true;
      if (__DEV__) console.log('🔐 Partner SecureTokenManager: Initialized successfully', Platform.OS === 'web' ? '(using AsyncStorage for web)' : '(using SecureStore)');
    } catch (error) {
      console.error('❌ Partner SecureTokenManager: Initialization failed:', error);
      this.isInitialized = true; // Mark as initialized even if failed
    }
  }

  /**
   * Store authentication tokens securely
   */
  async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      // Store access token in memory and secure storage (for persistence)
      this.accessToken = tokens.accessToken;
      await this.setSecureItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      
      // Store refresh token in secure storage only
      await this.setSecureItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      
      // Update auth state
      const authState: AuthState = {
        isAuthenticated: true,
        lastLoginTime: new Date().toISOString(),
        tokenExpiryTime: this.getTokenExpiryTime(tokens.accessToken),
      };
      await this.setSecureItem(AUTH_STATE_KEY, JSON.stringify(authState));
      
      if (__DEV__) console.log('🔐 Partner SecureTokenManager: Tokens stored successfully');
    } catch (error) {
      console.error('❌ Partner SecureTokenManager: Failed to store tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Get access token (from memory first, fallback to secure storage)
   */
  async getAccessToken(): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Return from memory if available
    if (this.accessToken) {
      return this.accessToken;
    }

    // Fallback to secure storage
    try {
      this.accessToken = await this.getSecureItem(ACCESS_TOKEN_KEY);
      return this.accessToken;
    } catch (error) {
      console.error('❌ Partner SecureTokenManager: Failed to get access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token from secure storage
   */
  async getRefreshToken(): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      return await this.getSecureItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('❌ Partner SecureTokenManager: Failed to get refresh token:', error);
      return null;
    }
  }

  /**
   * Store user data securely
   */
  async storeUserData(user: AuthUser): Promise<void> {
    try {
      await this.setSecureItem(USER_DATA_KEY, JSON.stringify(user));
      if (__DEV__) console.log('🔐 Partner SecureTokenManager: User data stored successfully');
    } catch (error) {
      console.error('❌ Partner SecureTokenManager: Failed to store user data:', error);
      throw new Error('Failed to store user data');
    }
  }

  /**
   * Get user data from secure storage
   */
  async getUserData(): Promise<AuthUser | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const userData = await this.getSecureItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Partner SecureTokenManager: Failed to get user data:', error);
      return null;
    }
  }

  /**
   * Get authentication state
   */
  async getAuthState(): Promise<AuthState | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const authState = await this.getSecureItem(AUTH_STATE_KEY);
      return authState ? JSON.parse(authState) : null;
    } catch (error) {
      console.error('❌ Partner SecureTokenManager: Failed to get auth state:', error);
      return null;
    }
  }

  /**
   * Check if tokens exist
   */
  async hasTokens(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const refreshToken = await this.getRefreshToken();
    return !!(accessToken && refreshToken);
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const authState = await this.getAuthState();
    const hasTokens = await this.hasTokens();
    return !!(authState?.isAuthenticated && hasTokens);
  }

  /**
   * Check if access token is expired
   */
  async isTokenExpired(): Promise<boolean> {
    const authState = await this.getAuthState();
    if (!authState?.tokenExpiryTime) return true;

    const expiryTime = new Date(authState.tokenExpiryTime);
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

    return now.getTime() >= (expiryTime.getTime() - bufferTime);
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    // Prevent concurrent refresh calls
    if (this.refreshPromise) {
      await this.refreshPromise;
      return this.getAccessToken();
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      await this.refreshPromise;
      return this.getAccessToken();
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // This will be implemented when we upgrade the API client
    // For now, we'll throw an error to indicate refresh is needed
    throw new Error('Token refresh endpoint not implemented yet');
  }

  /**
   * Clear all stored authentication data
   */
  async clearAll(): Promise<void> {
    try {
      // Clear memory
      this.accessToken = null;
      
      // Clear secure storage
      await Promise.all([
        this.deleteSecureItem(ACCESS_TOKEN_KEY),
        this.deleteSecureItem(REFRESH_TOKEN_KEY),
        this.deleteSecureItem(USER_DATA_KEY),
        this.deleteSecureItem(AUTH_STATE_KEY),
      ]);
      
      if (__DEV__) console.log('🔐 Partner SecureTokenManager: All data cleared successfully');
    } catch (error) {
      console.error('❌ Partner SecureTokenManager: Failed to clear data:', error);
      throw new Error('Failed to clear authentication data');
    }
  }

  /**
   * Extract token expiry time from JWT token
   */
  private getTokenExpiryTime(token: string): string | undefined {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        return new Date(payload.exp * 1000).toISOString();
      }
    } catch (error) {
      console.error('❌ Partner SecureTokenManager: Failed to parse token expiry:', error);
    }
    return undefined;
  }

  /**
   * Get token info for debugging
   */
  async getTokenInfo(): Promise<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    isExpired: boolean;
    expiryTime?: string;
  }> {
    const hasAccessToken = !!(await this.getAccessToken());
    const hasRefreshToken = !!(await this.getRefreshToken());
    const isExpired = await this.isTokenExpired();
    const authState = await this.getAuthState();

    return {
      hasAccessToken,
      hasRefreshToken,
      isExpired,
      expiryTime: authState?.tokenExpiryTime,
    };
  }
}

// Create singleton instance
export const secureTokenManager = new SecureTokenManager();

// Export for testing
export { SecureTokenManager };

