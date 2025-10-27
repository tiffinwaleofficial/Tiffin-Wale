/**
 * Authentication Store
 * Centralized authentication state management with Zustand
 * 
 * Features:
 * - Phone-based authentication with Firebase
 * - Automatic token management
 * - Session persistence
 * - Profile management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import { api } from '../lib/api';
import { tokenManager } from '../lib/auth/TokenManager';
import type { RegisterPartnerData, LoginResponse } from '../lib/api';

/**
 * User Data Interface
 */
interface User {
  id: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

/**
 * Partner Profile Interface
 */
interface Partner {
  _id?: string;
  id?: string;
  userId: string;
  businessName: string;
  description?: string;
  phoneNumber?: string;
  address?: string;
  isAcceptingOrders?: boolean;
  [key: string]: any;
}

/**
 * Authentication State
 */
interface AuthState {
  // Core state
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: User | null;
  partner: Partner | null;
  error: string | null;
}

/**
 * Authentication Actions
 */
interface AuthActions {
  // Initialization
  initialize: () => Promise<void>;
  
  // Phone authentication flow
  checkUserExists: (phoneNumber: string) => Promise<boolean>;
  loginWithPhone: (phoneNumber: string, firebaseUid: string) => Promise<void>;
  registerPartner: (data: RegisterPartnerData) => Promise<void>;
  
  // Session management
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Initial State
 */
const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  user: null,
  partner: null,
  error: null,
};

/**
 * Auth Store
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Initialize authentication on app start
       * Check stored tokens and restore session
       */
      initialize: async () => {
        if (get().isInitialized) return;
        
        if (__DEV__) console.log('🔍 AuthStore: Initializing authentication...');
        set({ isLoading: true });

        try {
          // Initialize token manager
          await tokenManager.initialize();
          
          // Check if user is authenticated
          const isAuthenticated = await tokenManager.isAuthenticated();
          
          if (isAuthenticated) {
            if (__DEV__) console.log('✅ AuthStore: Valid session found');
            
            // Get stored user data
            const userData = await tokenManager.getUserData();
            
            if (userData) {
              // Fetch fresh profile from API
              try {
                const profile = await api.partner.getCurrentProfile();
                
                set({
                  isAuthenticated: true,
                  isInitialized: true,
                  isLoading: false,
                  user: userData,
                  partner: profile,
                  error: null,
                });
                
                if (__DEV__) console.log('✅ AuthStore: Session restored successfully');
              } catch (error) {
                // If profile fetch fails, clear session
                console.error('❌ AuthStore: Failed to fetch profile, clearing session');
                await tokenManager.clearAll();
                
                set({
                  isAuthenticated: false,
                  isInitialized: true,
                  isLoading: false,
                  user: null,
                  partner: null,
                  error: null,
                });
              }
            } else {
              // No user data, clear tokens
              await tokenManager.clearAll();
              set({
                isAuthenticated: false,
                isInitialized: true,
                isLoading: false,
                error: null,
              });
            }
          } else {
            // Not authenticated
            if (__DEV__) console.log('🔍 AuthStore: No valid session found');
            set({
              isAuthenticated: false,
              isInitialized: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          console.error('❌ AuthStore: Initialization failed:', error);
          set({
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
            error: 'Failed to initialize authentication',
          });
        }
      },

      /**
       * Check if user exists by phone number
       */
      checkUserExists: async (phoneNumber: string): Promise<boolean> => {
        try {
          if (__DEV__) console.log('🔍 AuthStore: Checking if user exists as partner:', phoneNumber);
          
          const response = await api.auth.checkPhone(phoneNumber);
          const exists = response.exists || false;
          
          if (__DEV__) console.log('🔍 AuthStore: Partner user exists:', exists);
          
          // If user doesn't exist as partner but has a message, it means they exist with different role
          if (!exists && response.message) {
            if (__DEV__) console.log('🔍 AuthStore: Role mismatch:', response.message);
            // Store the role mismatch message for UI display
            set({ error: response.message });
          }
          
          return exists;
        } catch (error: any) {
          console.error('❌ AuthStore: Error checking user existence:', error);
          // Handle role-specific error messages
          if (error.message && error.message.includes('registered as a')) {
            set({ error: error.message });
          }
          return false;
        }
      },

      /**
       * Login with phone number and Firebase UID
       */
      loginWithPhone: async (phoneNumber: string, firebaseUid: string): Promise<void> => {
        set({ isLoading: true, error: null });
        
        try {
          if (__DEV__) console.log('🔐 AuthStore: Logging in with phone:', phoneNumber);
          
          // Call login API
          const response: LoginResponse = await api.auth.loginWithPhone(phoneNumber, firebaseUid);
          
          // Store tokens securely
          await tokenManager.storeTokens(response.accessToken, response.refreshToken);
          
          // Store user data
          await tokenManager.storeUserData(response.user);
          
          // Update state
          set({
            isAuthenticated: true,
            isLoading: false,
            user: response.user,
            partner: response.partner || null,
            error: null,
          });
          
          if (__DEV__) console.log('✅ AuthStore: Login successful');
        } catch (error: any) {
          console.error('❌ AuthStore: Login failed:', error);
          let errorMessage = error.message || 'Login failed. Please try again.';
          
          // Handle role-specific error messages
          if (error.message && error.message.includes('registered as a')) {
            errorMessage = error.message;
          } else if (error.message && error.message.includes('correct app')) {
            errorMessage = error.message;
          }
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          
          throw error;
        }
      },

      /**
       * Register new partner with onboarding data
       */
      registerPartner: async (data: RegisterPartnerData): Promise<void> => {
        set({ isLoading: true, error: null });
        
        try {
          if (__DEV__) console.log('🏪 AuthStore: Registering partner...');
          
          // Call registration API
          const response: LoginResponse = await api.auth.registerPartner(data);
          
          // Store tokens securely (auto-login after registration)
          await tokenManager.storeTokens(response.accessToken, response.refreshToken);
          
          // Store user data
          await tokenManager.storeUserData(response.user);
          
          // Update state
          set({
            isAuthenticated: true,
            isLoading: false,
            user: response.user,
            partner: response.partner || null,
            error: null,
          });
          
          if (__DEV__) console.log('✅ AuthStore: Registration successful');
        } catch (error: any) {
          console.error('❌ AuthStore: Registration failed:', error);
          const errorMessage = error.message || 'Registration failed. Please try again.';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          
          throw error;
        }
      },

      /**
       * Logout user
       */
      logout: async (): Promise<void> => {
        if (__DEV__) console.log('🚪 AuthStore: Logging out...');
        set({ isLoading: true });
        
        try {
          // Call logout API (best effort)
          try {
            await api.auth.logout();
          } catch (error) {
            if (__DEV__) console.warn('⚠️ AuthStore: Logout API failed, continuing...');
          }
          
          // Clear tokens and user data
          await tokenManager.clearAll();
          
          // Reset state
          set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            partner: null,
            error: null,
          });
          
          if (__DEV__) console.log('✅ AuthStore: Logout successful');
        } catch (error) {
          console.error('❌ AuthStore: Logout error:', error);
          
          // Force logout even if error
          await tokenManager.clearAll();
          set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            partner: null,
            error: null,
          });
        }
      },

      /**
       * Refresh partner profile from API
       */
      refreshProfile: async (): Promise<void> => {
        try {
          if (__DEV__) console.log('🔄 AuthStore: Refreshing profile...');
          
          const profile = await api.partner.getCurrentProfile();
          
          // Update user data
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...profile };
            await tokenManager.storeUserData(updatedUser);
          }
          
          set({ partner: profile });
          
          if (__DEV__) console.log('✅ AuthStore: Profile refreshed');
        } catch (error) {
          console.error('❌ AuthStore: Profile refresh failed:', error);
        }
      },

      /**
       * Set loading state
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * Set error
       */
      setError: (error: string | null) => {
        set({ error });
      },

      /**
       * Clear error
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'partner-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential data
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        // Don't persist user/partner/tokens here - TokenManager handles secure storage
      }),
    }
  )
);

/**
 * Listen for session expiry events
 */
DeviceEventEmitter.addListener('auth:session-expired', () => {
  if (__DEV__) console.log('🚨 AuthStore: Session expired event received');
  useAuthStore.getState().logout();
});

export default useAuthStore;
