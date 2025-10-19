/**
 * Enhanced Partner App Authentication Service
 * Handles phone-based authentication, token management, and user session
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenManager } from './tokenManager';
import { config } from '../config/environment';
import { AuthUser, PartnerProfile, LoginResponse } from '../types/auth';

// Storage keys for legacy compatibility
const TOKEN_KEY = 'partner_auth_token';
const REFRESH_TOKEN_KEY = 'partner_refresh_token';
const USER_KEY = 'partner_user_data';
const PARTNER_KEY = 'partner_profile_data';

interface LoginCredentials {
  email: string;
  password: string;
}

interface PhoneLoginData {
  phoneNumber: string;
  firebaseUid: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Login with email and password (legacy support)
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      if (__DEV__) console.log('🔐 Partner AuthService: Email login attempt');
      
      const response = await fetch(`${config.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store tokens using TokenManager
      await tokenManager.storeTokens(data.accessToken || data.token, data.refreshToken);
      await tokenManager.storeUserData(data.user);
      
      // Legacy storage for compatibility
      await this.saveAuthSession(
        data.accessToken || data.token,
        data.refreshToken,
        data.user,
        data.partner
      );
      
      if (__DEV__) console.log('✅ Partner AuthService: Email login successful');
      return data;
    } catch (error) {
      console.error('❌ Partner AuthService: Email login error:', error);
      throw error;
    }
  }

  /**
   * Login with phone number (Firebase UID)
   */
  async loginWithPhone(phoneNumber: string, firebaseUid: string): Promise<LoginResponse> {
    try {
      if (__DEV__) console.log('📱 Partner AuthService: Phone login attempt for:', phoneNumber);
      
      const response = await fetch(`${config.apiBaseUrl}/api/auth/login-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber, 
          firebaseUid,
          role: 'business' // Specify partner role
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Phone login failed');
      }

      const data = await response.json();
      
      // Handle both token formats
      const accessToken = data.token || data.accessToken;
      
      if (!accessToken) {
        throw new Error('No access token received from server');
      }
      
      // Store tokens using TokenManager
      await tokenManager.storeTokens(accessToken, data.refreshToken);
      await tokenManager.storeUserData(data.user);
      
      // Legacy storage for compatibility
      await this.saveAuthSession(
        accessToken,
        data.refreshToken,
        data.user,
        data.partner
      );
      
      if (__DEV__) console.log('✅ Partner AuthService: Phone login successful');
      return {
        ...data,
        token: accessToken,
        accessToken: accessToken,
      };
    } catch (error) {
      console.error('❌ Partner AuthService: Phone login error:', error);
      throw error;
    }
  }

  /**
   * Check if user exists by phone number with role
   */
  async checkUserExists(phoneNumber: string): Promise<boolean> {
    try {
      if (__DEV__) console.log('🔍 Partner AuthService: Checking if partner exists for phone:', phoneNumber);
      
      const response = await fetch(`${config.apiBaseUrl}/api/auth/check-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber,
          role: 'business' // Check specifically for partner role
        }),
      });

      if (!response.ok) {
        if (__DEV__) console.log('⚠️ Partner AuthService: Check phone API failed, assuming new user');
        return false;
      }

      const data = await response.json();
      const exists = data.exists || false;
      
      if (__DEV__) console.log(`🔍 Partner AuthService: Partner ${exists ? 'exists' : 'does not exist'} for phone:`, phoneNumber);
      return exists;
    } catch (error) {
      console.error('❌ Partner AuthService: Error checking partner existence:', error);
      return false; // Default to new user if check fails
    }
  }

  /**
   * Register new partner
   */
  async register(partnerData: any): Promise<LoginResponse> {
    try {
      if (__DEV__) console.log('🏪 Partner AuthService: Registration attempt');
      
      const response = await fetch(`${config.apiBaseUrl}/api/auth/register-partner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...partnerData,
          role: 'business', // Ensure partner role
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Handle both token formats
      const accessToken = data.token || data.accessToken;
      
      // Store tokens using TokenManager
      await tokenManager.storeTokens(accessToken, data.refreshToken);
      await tokenManager.storeUserData(data.user);
      
      // Legacy storage for compatibility
      await this.saveAuthSession(
        accessToken,
        data.refreshToken,
        data.user,
        data.partner
      );
      
      if (__DEV__) console.log('✅ Partner AuthService: Registration successful');
      return {
        ...data,
        token: accessToken,
        accessToken: accessToken,
      };
    } catch (error) {
      console.error('❌ Partner AuthService: Registration error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      if (__DEV__) console.log('🔄 Partner AuthService: Refreshing token');
      
      const response = await fetch(`${config.apiBaseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (__DEV__) console.log('✅ Partner AuthService: Token refreshed successfully');
      return {
        accessToken: data.accessToken || data.token,
        refreshToken: data.refreshToken || refreshToken,
      };
    } catch (error) {
      console.error('❌ Partner AuthService: Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      if (__DEV__) console.log('🚪 Partner AuthService: Logout attempt');
      
      // Try to call logout API
      try {
        const token = await tokenManager.getAccessToken();
        if (token) {
          await fetch(`${config.apiBaseUrl}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (apiError) {
        // Logout should succeed even if API fails
        console.warn('⚠️ Partner AuthService: Logout API call failed, but proceeding with local cleanup:', apiError);
      }
      
      // Clear all tokens and data
      await tokenManager.clearTokens();
      await this.clearAuthSession();
      
      if (__DEV__) console.log('✅ Partner AuthService: Logout completed');
    } catch (error) {
      console.error('❌ Partner AuthService: Logout error:', error);
      // Even if logout fails, clear local state
      await tokenManager.clearTokens();
      await this.clearAuthSession();
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      return await tokenManager.isAuthenticated();
    } catch (error) {
      console.error('❌ Partner AuthService: Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Validate token with backend
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = await tokenManager.getAccessToken();
      if (!token) return false;

      const response = await fetch(`${config.apiBaseUrl}/api/auth/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Partner AuthService: Token validation error:', error);
      return false;
    }
  }

  /**
   * Get current user from storage
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      return await tokenManager.getUserData();
    } catch (error) {
      console.error('❌ Partner AuthService: Error getting current user:', error);
      return null;
    }
  }

  /**
   * Update stored user data
   */
  async updateStoredUser(userData: AuthUser): Promise<void> {
    try {
      await tokenManager.storeUserData(userData);
    } catch (error) {
      console.error('❌ Partner AuthService: Error updating stored user:', error);
    }
  }

  /**
   * Get current token
   */
  async getToken(): Promise<string | null> {
    try {
      return await tokenManager.getAccessToken();
    } catch (error) {
      console.error('❌ Partner AuthService: Error getting token:', error);
      return null;
    }
  }

  // Legacy methods for compatibility with existing code
  
  /**
   * Save authentication session (legacy)
   */
  async saveAuthSession(
    token: string,
    refreshToken: string | undefined,
    user: AuthUser,
    partner?: PartnerProfile
  ): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, token),
        refreshToken ? AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken) : Promise.resolve(),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
        partner ? AsyncStorage.setItem(PARTNER_KEY, JSON.stringify(partner)) : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('❌ Partner AuthService: Error saving auth session:', error);
    }
  }

  /**
   * Get authentication session (legacy)
   */
  async getAuthSession(): Promise<{
    token: string | null;
    refreshToken: string | null;
    user: AuthUser | null;
    partner: PartnerProfile | null;
  }> {
    try {
      const [token, refreshToken, userData, partnerData] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
        AsyncStorage.getItem(PARTNER_KEY),
      ]);

      return {
        token,
        refreshToken,
        user: userData ? JSON.parse(userData) : null,
        partner: partnerData ? JSON.parse(partnerData) : null,
      };
    } catch (error) {
      console.error('❌ Partner AuthService: Error getting auth session:', error);
      return { token: null, refreshToken: null, user: null, partner: null };
    }
  }

  /**
   * Clear authentication session (legacy)
   */
  async clearAuthSession(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
        AsyncStorage.removeItem(PARTNER_KEY),
      ]);
    } catch (error) {
      console.error('❌ Partner AuthService: Error clearing auth session:', error);
    }
  }

  /**
   * Token validation (basic JWT check)
   */
  isTokenExpired(token: string): boolean {
    try {
      const validation = tokenManager.validateToken(token);
      return validation.isExpired;
    } catch (error) {
      console.error('❌ Partner AuthService: Error checking token expiration:', error);
      return true; // Assume expired if we can't parse
    }
  }

  /**
   * Get token payload
   */
  getTokenPayload(token: string): any {
    try {
      return tokenManager.decodeToken(token);
    } catch (error) {
      console.error('❌ Partner AuthService: Error parsing token payload:', error);
      return null;
    }
  }

  // Legacy static methods for compatibility
  static async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  static async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }

  static async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  static async saveUser(user: AuthUser): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static async getUser(): Promise<AuthUser | null> {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static async savePartner(partner: PartnerProfile): Promise<void> {
    await AsyncStorage.setItem(PARTNER_KEY, JSON.stringify(partner));
  }

  static async getPartner(): Promise<PartnerProfile | null> {
    const partnerData = await AsyncStorage.getItem(PARTNER_KEY);
    return partnerData ? JSON.parse(partnerData) : null;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default AuthService;