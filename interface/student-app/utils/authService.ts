import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './apiClient';
import { LoginRequest, RegisterRequest } from '../types/api';
import { LoginResponse } from '../types/auth';

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
      
      // Store tokens and user data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
      
      return response;
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
      // Convert RegisterRequest to CustomerProfile format
      const customerData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phoneNumber,
        addresses: [],
        preferences: {
          dietaryRestrictions: [],
          allergies: [],
          spiceLevel: 'medium' as const
        }
      };
      
      const response = await api.auth.register(customerData);
      
      // Store tokens and user data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
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
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
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