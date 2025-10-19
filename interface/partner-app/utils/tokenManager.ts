/**
 * TiffinWale Partner App Token Management System
 * Centralized, secure token management with automatic refresh and validation
 * 
 * Features:
 * - Secure token storage with AsyncStorage
 * - Automatic token refresh before expiry
 * - Token validation and cleanup
 * - Centralized token access across the app
 * - Integration with Zustand auth store
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

// Storage keys (partner-specific)
const STORAGE_KEYS = {
  ACCESS_TOKEN: '@tiffin_wale_partner_access_token',
  REFRESH_TOKEN: '@tiffin_wale_partner_refresh_token',
  USER_DATA: '@tiffin_wale_partner_user_data',
  TOKEN_EXPIRY: '@tiffin_wale_partner_token_expiry',
} as const;

// JWT payload interface
interface JWTPayload {
  sub: string; // user ID
  email: string;
  userType: 'student' | 'partner' | 'admin';
  role: 'customer' | 'business' | 'admin';
  iat: number; // issued at
  exp: number; // expires at
}

// Token validation result
interface TokenValidationResult {
  isValid: boolean;
  isExpired: boolean;
  expiresIn: number; // seconds until expiry
  payload?: JWTPayload;
}

class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<string | null> | null = null;

  private constructor() {}

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Store tokens securely
   */
  async storeTokens(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      // Validate access token
      if (!accessToken || typeof accessToken !== 'string') {
        throw new Error('Invalid access token: must be a non-empty string');
      }

      const promises = [
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
      ];

      if (refreshToken) {
        promises.push(AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken));
      }

      // Store token expiry for quick checks
      const payload = this.decodeToken(accessToken);
      if (payload) {
        promises.push(
          AsyncStorage.setItem(
            STORAGE_KEYS.TOKEN_EXPIRY, 
            payload.exp.toString()
          )
        );
      }

      await Promise.all(promises);
      if (__DEV__) console.log('🔐 Partner tokens stored securely');
    } catch (error) {
      console.error('❌ Error storing partner tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Get access token with automatic validation
   */
  async getAccessToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      
      if (!token) {
        if (__DEV__) console.log('🔐 No partner access token found');
        return null;
      }

      // Validate token
      const validation = this.validateToken(token);
      
      if (!validation.isValid) {
        if (__DEV__) console.log('🔐 Invalid partner access token, clearing storage');
        await this.clearTokens();
        return null;
      }

      // Check if token is about to expire (within 5 minutes)
      if (validation.expiresIn < 300) {
        if (__DEV__) console.log('🔐 Partner access token expiring soon, attempting refresh');
        const refreshedToken = await this.refreshAccessToken();
        return refreshedToken || token; // Return original if refresh fails
      }

      return token;
    } catch (error) {
      console.error('❌ Error getting partner access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('❌ Error getting partner refresh token:', error);
      return null;
    }
  }

  /**
   * Validate token without network call
   */
  validateToken(token: string): TokenValidationResult {
    try {
      const payload = this.decodeToken(token);
      
      if (!payload) {
        return { isValid: false, isExpired: true, expiresIn: 0 };
      }

      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp <= now;
      const expiresIn = payload.exp - now;

      return {
        isValid: !isExpired,
        isExpired,
        expiresIn: Math.max(0, expiresIn),
        payload,
      };
    } catch (error) {
      console.error('❌ Error validating partner token:', error);
      return { isValid: false, isExpired: true, expiresIn: 0 };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    
    return result;
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      
      if (!refreshToken) {
        if (__DEV__) console.log('🔐 No partner refresh token available');
        return null;
      }

      // Validate refresh token
      const validation = this.validateToken(refreshToken);
      if (!validation.isValid) {
        if (__DEV__) console.log('🔐 Partner refresh token is invalid or expired');
        await this.clearTokens();
        return null;
      }

      // Import auth service dynamically to avoid circular dependency
      const { authService } = await import('./authService');
      
      // Call refresh endpoint
      const response = await authService.refreshToken(refreshToken);
      
      // Store new tokens
      await this.storeTokens(response.accessToken, response.refreshToken);
      
      if (__DEV__) console.log('✅ Partner access token refreshed successfully');
      return response.accessToken;
    } catch (error) {
      console.error('❌ Error refreshing partner token:', error);
      
      // Clear tokens on refresh failure
      await this.clearTokens();
      return null;
    }
  }

  /**
   * Clear all stored tokens
   */
  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY),
      ]);
      
      if (__DEV__) console.log('🔐 All partner tokens cleared');
    } catch (error) {
      console.error('❌ Error clearing partner tokens:', error);
    }
  }

  /**
   * Store user data
   */
  async storeUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA, 
        JSON.stringify(userData)
      );
      if (__DEV__) console.log('👤 Partner user data stored');
    } catch (error) {
      console.error('❌ Error storing partner user data:', error);
    }
  }

  /**
   * Get stored user data
   */
  async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Error getting partner user data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated with valid token
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null;
  }

  /**
   * Check if we have any tokens stored
   */
  async hasTokens(): Promise<boolean> {
    try {
      const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      return !!accessToken;
    } catch (error) {
      console.error('❌ Error checking if partner has tokens:', error);
      return false;
    }
  }

  /**
   * Get token payload without validation
   */
  decodeToken(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.error('❌ Error decoding partner token:', error);
      return null;
    }
  }

  /**
   * Get user ID from current token
   */
  async getUserId(): Promise<string | null> {
    try {
      const token = await this.getAccessToken();
      if (!token) return null;

      const payload = this.decodeToken(token);
      return payload?.sub || null;
    } catch (error) {
      console.error('❌ Error getting partner user ID:', error);
      return null;
    }
  }

  /**
   * Get user type from current token
   */
  async getUserType(): Promise<'student' | 'partner' | 'admin' | null> {
    try {
      const token = await this.getAccessToken();
      if (!token) return null;

      const payload = this.decodeToken(token);
      return payload?.userType || null;
    } catch (error) {
      console.error('❌ Error getting partner user type:', error);
      return null;
    }
  }

  /**
   * Check if token needs refresh (within 10 minutes of expiry)
   */
  async needsRefresh(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) return false;

      const validation = this.validateToken(token);
      return validation.isValid && validation.expiresIn < 600; // 10 minutes
    } catch (error) {
      console.error('❌ Error checking partner token refresh need:', error);
      return false;
    }
  }

  /**
   * Get token expiry time
   */
  async getTokenExpiry(): Promise<Date | null> {
    try {
      const expiryString = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      if (!expiryString) return null;

      const expiryTimestamp = parseInt(expiryString, 10);
      return new Date(expiryTimestamp * 1000);
    } catch (error) {
      console.error('❌ Error getting partner token expiry:', error);
      return null;
    }
  }

  /**
   * Debug: Get all token information
   */
  async getTokenInfo(): Promise<{
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    isValid: boolean;
    expiresIn: number;
    payload?: JWTPayload;
  }> {
    try {
      const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
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
      console.error('❌ Error getting partner token info:', error);
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
export type { JWTPayload, TokenValidationResult };
