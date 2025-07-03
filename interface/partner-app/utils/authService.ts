import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, PartnerProfile } from '../types/auth';

const TOKEN_KEY = 'partner_auth_token';
const REFRESH_TOKEN_KEY = 'partner_refresh_token';
const USER_KEY = 'partner_user_data';
const PARTNER_KEY = 'partner_profile_data';

export class AuthService {
  // Token management
  static async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving auth token:', error);
      throw error;
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // Refresh token management
  static async saveRefreshToken(refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw error;
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  static async removeRefreshToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing refresh token:', error);
    }
  }

  // User data management
  static async saveUser(user: AuthUser): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  static async getUser(): Promise<AuthUser | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  }

  // Partner profile management
  static async savePartner(partner: PartnerProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(PARTNER_KEY, JSON.stringify(partner));
    } catch (error) {
      console.error('Error saving partner data:', error);
      throw error;
    }
  }

  static async getPartner(): Promise<PartnerProfile | null> {
    try {
      const partnerData = await AsyncStorage.getItem(PARTNER_KEY);
      return partnerData ? JSON.parse(partnerData) : null;
    } catch (error) {
      console.error('Error getting partner data:', error);
      return null;
    }
  }

  static async removePartner(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PARTNER_KEY);
    } catch (error) {
      console.error('Error removing partner data:', error);
    }
  }

  // Complete authentication session management
  static async saveAuthSession(
    token: string,
    refreshToken: string | undefined,
    user: AuthUser,
    partner?: PartnerProfile
  ): Promise<void> {
    try {
      await Promise.all([
        this.saveToken(token),
        refreshToken ? this.saveRefreshToken(refreshToken) : Promise.resolve(),
        this.saveUser(user),
        partner ? this.savePartner(partner) : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('Error saving auth session:', error);
      throw error;
    }
  }

  static async getAuthSession(): Promise<{
    token: string | null;
    refreshToken: string | null;
    user: AuthUser | null;
    partner: PartnerProfile | null;
  }> {
    try {
      const [token, refreshToken, user, partner] = await Promise.all([
        this.getToken(),
        this.getRefreshToken(),
        this.getUser(),
        this.getPartner(),
      ]);

      return { token, refreshToken, user, partner };
    } catch (error) {
      console.error('Error getting auth session:', error);
      return { token: null, refreshToken: null, user: null, partner: null };
    }
  }

  static async clearAuthSession(): Promise<void> {
    try {
      await Promise.all([
        this.removeToken(),
        this.removeRefreshToken(),
        this.removeUser(),
        this.removePartner(),
      ]);
    } catch (error) {
      console.error('Error clearing auth session:', error);
    }
  }

  // Utility methods
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  // Token validation (basic)
  static isTokenExpired(token: string): boolean {
    try {
      // Basic JWT token expiration check
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Assume expired if we can't parse
    }
  }

  // Get token payload
  static getTokenPayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error parsing token payload:', error);
      return null;
    }
  }
}

export default AuthService; 