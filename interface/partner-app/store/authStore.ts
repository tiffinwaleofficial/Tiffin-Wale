import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import api from '../utils/apiClient';
import { secureTokenManager } from '../auth/SecureTokenManager';
import { 
  AuthUser, 
  LoginCredentials, 
  PhoneLoginCredentials,
  LoginResponse 
} from '../auth/types';
import { PartnerProfile, CreatePartnerData } from '../types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  partner: PartnerProfile | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  isLoggingOut: boolean;
}

interface AuthActions {
  // Authentication actions
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phoneNumber: string, firebaseUid: string) => Promise<void>;
  checkUserExists: (phoneNumber: string) => Promise<boolean>;
  register: (partnerData: CreatePartnerData) => Promise<void>;
  registerWithOnboarding: (onboardingData: any) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  
  // Session management
  initializeAuth: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  clearError: () => void;
  
  // Partner profile actions
  updatePartnerProfile: (data: Partial<PartnerProfile>) => Promise<void>;
  refreshPartnerProfile: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (data: Partial<PartnerProfile>) => Promise<void>;
  
  // State setters
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setPartner: (partner: PartnerProfile | null) => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  partner: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isInitialized: false,
  isLoggingOut: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Initialize authentication using SecureTokenManager
      initializeAuth: async () => {
        if (__DEV__) console.log('🔍 Partner AuthStore: Starting authentication initialization');
        set({ isLoading: true, error: null });
        
        try {
          // Initialize SecureTokenManager
          await secureTokenManager.initialize();
          
          // Check authentication status
          const isAuthenticated = await secureTokenManager.isAuthenticated();
          if (__DEV__) console.log('🔍 Partner AuthStore: Auth status:', isAuthenticated);
          
          if (isAuthenticated) {
            // Get stored user data
            const storedUser = await secureTokenManager.getUserData();
            if (__DEV__) console.log('🔍 Partner AuthStore: Stored user:', storedUser ? 'Found' : 'Not found');
            
            if (storedUser) {
              // Check if token is expired
              const isTokenExpired = await secureTokenManager.isTokenExpired();
              if (__DEV__) console.log('🔍 Partner AuthStore: Token expired:', isTokenExpired);
              
              if (!isTokenExpired) {
                // Token is valid, set authenticated state
                if (__DEV__) console.log('✅ Partner AuthStore: Auth initialized successfully with valid user');
                set({ 
                  user: storedUser, 
                  isAuthenticated: true, 
                  isLoading: false,
                  isInitialized: true,
                  error: null
                });
                return;
              } else {
                // Try to refresh token
                try {
                  if (__DEV__) console.log('🔄 Partner AuthStore: Attempting token refresh...');
                  await secureTokenManager.refreshAccessToken();
                  
                  set({ 
                    user: storedUser, 
                    isAuthenticated: true, 
                    isLoading: false,
                    isInitialized: true,
                    error: null
                  });
                  return;
                } catch (refreshError) {
                  if (__DEV__) console.log('⚠️ Partner AuthStore: Token refresh failed, clearing auth');
                  await secureTokenManager.clearAll();
                }
              }
            } else {
              if (__DEV__) console.log('⚠️ Partner AuthStore: No stored user found, clearing auth');
              await secureTokenManager.clearAll();
            }
          }
          
          // If we reach here, user is not authenticated
          if (__DEV__) console.log('🔍 Partner AuthStore: User not authenticated, setting initial state');
          set({ 
            user: null,
            partner: null,
            isAuthenticated: false, 
            isLoading: false,
            isInitialized: true,
            error: null
          });
          
        } catch (error) {
          console.error('❌ Partner AuthStore: Auth initialization error:', error);
          set({ 
            user: null,
            partner: null,
            isAuthenticated: false, 
            isLoading: false,
            isInitialized: true,
            error: error instanceof Error ? error.message : 'Authentication initialization failed'
          });
        }
      },

      // Login with email and password
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          if (__DEV__) console.log('🔐 Partner AuthStore: Attempting login for:', email);
          
          const credentials: LoginCredentials = { email, password };
          const response: LoginResponse = await api.auth.login(credentials);
          
          // Store tokens and user data securely
          await secureTokenManager.storeTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
          
          await secureTokenManager.storeUserData(response.user);
          
          set({ 
            user: response.user,
            partner: response.partner || null,
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          if (__DEV__) console.log('✅ Partner AuthStore: Login successful');
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Login error:', error);
          const errorMessage = error.message || 'Login failed. Please try again.';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      // Login with phone number
      loginWithPhone: async (phoneNumber: string, firebaseUid: string) => {
        set({ isLoading: true, error: null });
        try {
          if (__DEV__) console.log('📱 Partner AuthStore: Attempting phone login for:', phoneNumber);
          
          const credentials: PhoneLoginCredentials = { phoneNumber, firebaseUid };
          const response: LoginResponse = await api.auth.loginWithPhone(credentials);
          
          // Store tokens and user data securely
          await secureTokenManager.storeTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
          
          await secureTokenManager.storeUserData(response.user);
          
          set({ 
            user: response.user,
            partner: response.partner || null,
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          if (__DEV__) console.log('✅ Partner AuthStore: Phone login successful');
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Phone login error:', error);
          const errorMessage = error.message || 'Phone login failed. Please try again.';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      // Check if user exists
      checkUserExists: async (phoneNumber: string): Promise<boolean> => {
        try {
          if (__DEV__) console.log('🔍 Partner AuthStore: Checking if partner exists for phone:', phoneNumber);
          return await api.auth.checkUserExists(phoneNumber);
        } catch (error) {
          console.error('❌ Partner AuthStore: Error checking user existence:', error);
          return false;
        }
      },

      // Register new partner
      register: async (partnerData: CreatePartnerData) => {
        set({ isLoading: true, error: null });
        try {
          if (__DEV__) console.log('🏪 Partner AuthStore: Attempting registration');
          
          const response: LoginResponse = await api.auth.register(partnerData);
          
          // Store tokens and user data securely
          await secureTokenManager.storeTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
          
          await secureTokenManager.storeUserData(response.user);
          
          set({ 
            user: response.user,
            partner: response.partner || null,
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          if (__DEV__) console.log('✅ Partner AuthStore: Registration successful');
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Registration error:', error);
          const errorMessage = error.message || 'Registration failed. Please try again.';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      // Register with onboarding data
      registerWithOnboarding: async (onboardingData: any) => {
        if (__DEV__) console.log('🏪 Partner AuthStore: registerWithOnboarding called');
        set({ isLoading: true, error: null });
        try {
          // Map onboarding data to registration format for partners
          const registrationData: CreatePartnerData = {
            // Personal info
            firstName: onboardingData.personalInfo?.firstName,
            lastName: onboardingData.personalInfo?.lastName,
            email: onboardingData.personalInfo?.email,
            phoneNumber: onboardingData.phoneVerification?.phoneNumber,
            password: onboardingData.personalInfo?.password,
            
            // Business info
            businessName: onboardingData.businessProfile?.businessName,
            description: onboardingData.businessProfile?.description,
            
            // Location & Hours
            address: onboardingData.locationHours?.address,
            businessHours: onboardingData.locationHours?.businessHours,
            
            // Cuisine & Services
            cuisineTypes: onboardingData.cuisineServices?.cuisineTypes || [],
            
            // Images & Branding
            logoUrl: onboardingData.imagesBranding?.logoUrl,
            bannerUrl: onboardingData.imagesBranding?.bannerUrl,
          };

          if (__DEV__) console.log('🏪 Partner AuthStore: Mapped registration data');
          
          await get().register(registrationData);
          
          if (__DEV__) console.log('✅ Partner AuthStore: Registration with onboarding successful');
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Registration with onboarding error:', error);
          const errorMessage = error.message || 'Registration failed. Please try again.';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        const currentState = get();
        
        // Prevent double logout calls
        if (currentState.isLoggingOut) {
          if (__DEV__) console.log('🚪 Partner AuthStore: Logout already in progress, skipping');
          return;
        }
        
        if (__DEV__) console.log('🚪 Partner AuthStore: Starting logout process');
        set({ isLoggingOut: true, isLoading: true, error: null });
        
        try {
          // Call logout API (this also clears tokens)
          await api.auth.logout();
          if (__DEV__) console.log('✅ Partner AuthStore: Logout completed');
          
          set({ 
            user: null,
            partner: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false, 
            isLoading: false,
            isLoggingOut: false,
            error: null
          });
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Logout error:', error);
          
          // Even if logout API fails, clear local state
          await secureTokenManager.clearAll();
          
          set({ 
            user: null,
            partner: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            isLoggingOut: false,
            error: null
          });
        }
      },

      // Change password
      changePassword: async (oldPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await api.auth.changePassword(oldPassword, newPassword);
          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Change password error:', error);
          const errorMessage = error.message || 'Failed to change password. Please try again.';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      // Refresh auth token
      refreshAuthToken: async () => {
        try {
          const newToken = await secureTokenManager.refreshAccessToken();
          if (newToken) {
            set({ token: newToken });
            if (__DEV__) console.log('✅ Partner AuthStore: Token refreshed successfully');
          }
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Token refresh error:', error);
          // If refresh fails, logout user
          await get().logout();
          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Partner profile actions
      updatePartnerProfile: async (data: Partial<PartnerProfile>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPartner = await api.partner.updateProfile(data);
          
          // Update stored user data
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...updatedPartner };
            await secureTokenManager.storeUserData(updatedUser);
            
            set({
              partner: updatedPartner,
              user: updatedUser,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Update partner profile error:', error);
          const errorMessage = error.message || 'Failed to update profile. Please try again.';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      // Refresh partner profile
      refreshPartnerProfile: async () => {
        try {
          const partner = await api.partner.getCurrentProfile();
          
          // Update stored user data
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...partner };
            await secureTokenManager.storeUserData(updatedUser);
            
            set({ partner, user: updatedUser });
          }
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Refresh partner profile error:', error);
          // Don't set error state for silent refresh
        }
      },

      // Fetch user profile
      fetchUserProfile: async () => {
        if (__DEV__) console.log('🔍 Partner AuthStore: fetchUserProfile called');
        set({ isLoading: true, error: null });
        try {
          const profileData = await api.partner.getCurrentProfile();
          if (__DEV__) console.log('✅ Partner AuthStore: Profile fetched from API');
          
          // Update stored user data
          await secureTokenManager.storeUserData(profileData as AuthUser);
          
          set({ 
            user: profileData as AuthUser, 
            partner: profileData, 
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Error in fetchUserProfile:', error);
          const errorMessage = error.message || 'Failed to fetch profile';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      // Update user profile
      updateUserProfile: async (data: Partial<PartnerProfile>) => {
        await get().updatePartnerProfile(data);
      },

      // State setters
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setUser: (user: AuthUser | null) => set({ user }),
      setPartner: (partner: PartnerProfile | null) => set({ partner }),
    }),
    {
      name: 'partner-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential data, not loading/error states
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        // Don't persist user/partner data here - SecureTokenManager handles it
        token: null, // Don't persist tokens in Zustand
        refreshToken: null, // Don't persist tokens in Zustand
      }),
    }
  )
);

// Set up auth error event listener
DeviceEventEmitter.addListener('partner_auth_error', (event) => {
  if (__DEV__) console.log('🚨 Partner AuthStore: Auth error event received:', event);
  useAuthStore.getState().logout();
});

DeviceEventEmitter.addListener('partner_auth:token-expired', () => {
  if (__DEV__) console.log('🚨 Partner AuthStore: Token expired event received');
  useAuthStore.getState().logout();
});

export default useAuthStore;