/**
 * Enterprise Token Manager
 * Centralized, secure token management with automatic refresh and validation
 * 
 * Features:
 * - Platform-aware secure storage (SecureStore for mobile, AsyncStorage for web)
 * - Automatic token refresh before expiry
 * - Token validation and expiry checks
 * - Memory caching for performance
 * - Thread-safe refresh (prevents concurrent refresh calls)
 * - Comprehensive logging for debugging
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { config } from '../../config';

/**
 * JWT Token Payload Interface
 */
interface JWTPayload {
  sub: string; // user ID
  email?: string;
  phoneNumber?: string;
  role: 'customer' | 'business' | 'admin';
  iat: number; // issued at timestamp
  exp: number; // expires at timestamp
}

/**
 * Token Validation Result
 */
interface TokenValidation {
  isValid: boolean;
  isExpired: boolean;
  expiresIn: number; // seconds until expiry
  payload?: JWTPayload;
}

/**
 * User Data Interface
 */
interface UserData {
  id: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

/**
 * Enterprise Token Manager Class
 */
class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null; // Memory cache
  private refreshPromise: Promise<string | null> | null = null; // Prevent concurrent refreshes
  private isInitialized = false;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Platform-aware secure storage - SET
   */
  private async setSecureItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }

  /**
   * Platform-aware secure storage - GET
   */
  private async getSecureItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }

  /**
   * Platform-aware secure storage - DELETE
   */
  private async deleteSecureItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }

  /**
   * Initialize token manager (load tokens from storage)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.accessToken = await this.getSecureItem(config.storage.accessToken);
      this.isInitialized = true;
      
      if (__DEV__) {
        console.log('🔐 TokenManager: Initialized', Platform.OS === 'web' ? '(AsyncStorage)' : '(SecureStore)');
        console.log('🔐 TokenManager: Token exists:', !!this.accessToken);
      }
    } catch (error) {
      console.error('❌ TokenManager: Initialization failed:', error);
      this.isInitialized = true; // Mark as initialized even if failed
    }
  }

  /**
   * Store authentication tokens securely
   */
  async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      if (!accessToken || !refreshToken) {
        throw new Error('Invalid tokens: both access and refresh tokens required');
      }

      // Store in memory for quick access
      this.accessToken = accessToken;

      // Store in secure storage for persistence
      await Promise.all([
        this.setSecureItem(config.storage.accessToken, accessToken),
        this.setSecureItem(config.storage.refreshToken, refreshToken),
      ]);

      // Store auth state metadata
      const validation = this.validateToken(accessToken);
      const authState = {
        isAuthenticated: true,
        lastLoginTime: new Date().toISOString(),
        tokenExpiryTime: validation.payload?.exp 
          ? new Date(validation.payload.exp * 1000).toISOString() 
          : null,
      };
      
      await this.setSecureItem(config.storage.authState, JSON.stringify(authState));

      if (__DEV__) {
        console.log('🔐 TokenManager: Tokens stored successfully');
        console.log('🔐 TokenManager: Token expires in:', validation.expiresIn, 'seconds');
      }
    } catch (error) {
      console.error('❌ TokenManager: Failed to store tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Get access token with automatic validation and refresh
   */
  async getAccessToken(): Promise<string | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Return from memory if available
    if (this.accessToken) {
      const validation = this.validateToken(this.accessToken);
      
      // Token is valid and not expiring soon
      if (validation.isValid && validation.expiresIn > 300) { // 5 minutes buffer
        return this.accessToken;
      }

      // Token is expiring soon, attempt refresh
      if (validation.isValid && validation.expiresIn > 0) {
        if (__DEV__) console.log('🔐 TokenManager: Token expiring soon, refreshing...');
        const refreshedToken = await this.refreshAccessToken();
        return refreshedToken || this.accessToken; // Return original if refresh fails
      }

      // Token is expired
      if (__DEV__) console.log('🔐 TokenManager: Token expired');
      await this.clearAll();
      return null;
    }

    // Try to load from storage
    try {
      this.accessToken = await this.getSecureItem(config.storage.accessToken);
      
      if (this.accessToken) {
        const validation = this.validateToken(this.accessToken);
        if (validation.isValid) {
          return this.accessToken;
        } else {
          await this.clearAll();
          return null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ TokenManager: Failed to get access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token from secure storage
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await this.getSecureItem(config.storage.refreshToken);
    } catch (error) {
      console.error('❌ TokenManager: Failed to get refresh token:', error);
      return null;
    }
  }

  /**
   * Validate JWT token without network call
   */
  validateToken(token: string): TokenValidation {
    try {
      if (!token || typeof token !== 'string') {
        return { isValid: false, isExpired: true, expiresIn: 0 };
      }

      // Decode JWT payload
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { isValid: false, isExpired: true, expiresIn: 0 };
      }

      const payload: JWTPayload = JSON.parse(atob(parts[1]));
      
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp <= now;
      const expiresIn = Math.max(0, payload.exp - now);

      return {
        isValid: !isExpired,
        isExpired,
        expiresIn,
        payload,
      };
    } catch (error) {
      console.error('❌ TokenManager: Token validation failed:', error);
      return { isValid: false, isExpired: true, expiresIn: 0 };
    }
  }

  /**
   * Refresh access token using refresh token
   * Thread-safe: prevents multiple concurrent refresh attempts
   */
  async refreshAccessToken(): Promise<string | null> {
    // Prevent concurrent refresh attempts
    if (this.refreshPromise) {
      if (__DEV__) console.log('🔐 TokenManager: Refresh already in progress, waiting...');
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh operation
   */
  private async performTokenRefresh(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      
      if (!refreshToken) {
        if (__DEV__) console.log('🔐 TokenManager: No refresh token available');
        return null;
      }

      // Validate refresh token
      const validation = this.validateToken(refreshToken);
      if (!validation.isValid) {
        if (__DEV__) console.log('🔐 TokenManager: Refresh token is invalid or expired');
        await this.clearAll();
        return null;
      }

      // Import API service dynamically to avoid circular dependency
      const { authApi } = await import('../api/services/auth.service');
      
      // Call refresh endpoint
      const response = await authApi.refreshToken(refreshToken);
      
      if (response.accessToken) {
        // Store new tokens
        await this.storeTokens(
          response.accessToken,
          response.refreshToken || refreshToken
        );
        
        if (__DEV__) console.log('✅ TokenManager: Token refreshed successfully');
        return response.accessToken;
      }

      return null;
    } catch (error) {
      console.error('❌ TokenManager: Token refresh failed:', error);
      await this.clearAll();
      return null;
    }
  }

  /**
   * Store user data securely
   */
  async storeUserData(userData: UserData): Promise<void> {
    try {
      await this.setSecureItem(config.storage.userData, JSON.stringify(userData));
      if (__DEV__) console.log('🔐 TokenManager: User data stored');
    } catch (error) {
      console.error('❌ TokenManager: Failed to store user data:', error);
    }
  }

  /**
   * Get stored user data
   */
  async getUserData(): Promise<UserData | null> {
    try {
      const data = await this.getSecureItem(config.storage.userData);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ TokenManager: Failed to get user data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null;
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
        this.deleteSecureItem(config.storage.accessToken),
        this.deleteSecureItem(config.storage.refreshToken),
        this.deleteSecureItem(config.storage.userData),
        this.deleteSecureItem(config.storage.authState),
      ]);
      
      if (__DEV__) console.log('🔐 TokenManager: All data cleared');
    } catch (error) {
      console.error('❌ TokenManager: Failed to clear data:', error);
    }
  }

  /**
   * Get token info for debugging
   */
  async getTokenInfo(): Promise<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    isValid: boolean;
    expiresIn: number;
    payload?: JWTPayload;
  }> {
    try {
      const accessToken = await this.getSecureItem(config.storage.accessToken);
      const refreshToken = await this.getSecureItem(config.storage.refreshToken);
      
      if (!accessToken) {
        return {
          hasAccessToken: false,
          hasRefreshToken: !!refreshToken,
          isValid: false,
          expiresIn: 0,
        };
      }

      const validation = this.validateToken(accessToken);
      
      return {
        hasAccessToken: true,
        hasRefreshToken: !!refreshToken,
        isValid: validation.isValid,
        expiresIn: validation.expiresIn,
        payload: validation.payload,
      };
    } catch (error) {
      console.error('❌ TokenManager: Failed to get token info:', error);
      return {
        hasAccessToken: false,
        hasRefreshToken: false,
        isValid: false,
        expiresIn: 0,
      };
    }
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();

// Export types
export type { JWTPayload, TokenValidation, UserData };

