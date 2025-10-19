import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import api from '../utils/apiClient';
import { authService } from '../utils/authService';
import { tokenManager } from '../utils/tokenManager';
import { AuthState, AuthUser, PartnerProfile, CreatePartnerData, LoginResponse } from '../types/auth';

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

      // Initialize authentication
      initializeAuth: async () => {
        if (__DEV__) console.log('🔍 Partner AuthStore: Starting authentication initialization');
        set({ isLoading: true, error: null });
        
        try {
          // Debug: Check what's in storage
          const token = await authService.getToken();
          const user = await authService.getCurrentUser();
          if (__DEV__) console.log('🔍 Partner AuthStore: Storage check:', { 
            hasToken: !!token, 
            tokenLength: token?.length || 0,
            hasUser: !!user,
            userId: user?.id 
          });
          
          // First check if we have a valid token locally
          const isAuthenticated = await authService.isAuthenticated();
          if (__DEV__) console.log('🔍 Partner AuthStore: Local auth check result:', isAuthenticated);
          
          if (isAuthenticated) {
            // Get user from storage first
            const storedUser = await authService.getCurrentUser();
            if (__DEV__) console.log('🔍 Partner AuthStore: Stored user:', storedUser ? 'Found' : 'Not found');
            
            if (storedUser) {
              // Validate token with backend
              if (__DEV__) console.log('🔍 Partner AuthStore: Validating token with backend...');
              const isValidWithBackend = await authService.validateToken();
              if (__DEV__) console.log('🔍 Partner AuthStore: Backend validation result:', isValidWithBackend);
              
              if (isValidWithBackend) {
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
                if (__DEV__) console.log('⚠️ Partner AuthStore: Token invalid with backend, clearing auth');
                await authService.logout();
              }
            } else {
              if (__DEV__) console.log('⚠️ Partner AuthStore: No stored user found, clearing auth');
              await authService.logout();
            }
          }
          
          // If we reach here, user is not authenticated
          if (__DEV__) console.log('🔍 Partner AuthStore: User not authenticated, setting initial state');
          set({ 
            user: null,
            isAuthenticated: false, 
            isLoading: false,
            isInitialized: true,
            error: null
          });
          
        } catch (error) {
          console.error('❌ Partner AuthStore: Auth initialization error:', error);
          set({ 
            user: null,
            isAuthenticated: false, 
            isLoading: false,
            isInitialized: true,
            error: error instanceof Error ? error.message : 'Authentication initialization failed'
          });
        }
      },

      // Authentication actions
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
          
          if (__DEV__) console.log('✅ Partner AuthStore: Login successful, tokens stored securely');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      loginWithPhone: async (phoneNumber: string, firebaseUid: string) => {
        set({ isLoading: true, error: null });
        try {
          if (__DEV__) console.log('📱 Partner AuthStore: Attempting phone login for:', phoneNumber);
          
          const response = await authService.loginWithPhone(phoneNumber, firebaseUid);
          
          set({ 
            user: response.user,
            partner: response.partner || null,
            token: response.accessToken || response.token,
            isAuthenticated: true,
            isLoading: false 
          });
          
          if (__DEV__) console.log('✅ Partner AuthStore: Phone login successful');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Phone login failed. Please try again.';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      checkUserExists: async (phoneNumber: string): Promise<boolean> => {
        try {
          if (__DEV__) console.log('🔍 Partner AuthStore: Checking if partner exists for phone:', phoneNumber);
          return await authService.checkUserExists(phoneNumber);
        } catch (error) {
          console.error('❌ Partner AuthStore: Error checking user existence:', error);
          return false;
        }
      },

      register: async (partnerData: CreatePartnerData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(partnerData);
          
          set({ 
            user: response.user,
            partner: response.partner || null,
            token: response.accessToken || response.token,
            isAuthenticated: true,
            isLoading: false 
          });
          
          if (__DEV__) console.log('✅ Partner AuthStore: Registration successful');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      registerWithOnboarding: async (onboardingData: any) => {
        if (__DEV__) console.log('🏪 Partner AuthStore: registerWithOnboarding called with:', onboardingData);
        set({ isLoading: true, error: null });
        try {
          // Map onboarding data to registration format for partners
          const registrationData = {
            // Personal info
            firstName: onboardingData.personalInfo?.firstName,
            lastName: onboardingData.personalInfo?.lastName,
            email: onboardingData.personalInfo?.email,
            phoneNumber: onboardingData.phoneVerification?.phoneNumber,
            
            // Business info
            businessName: onboardingData.businessProfile?.businessName,
            description: onboardingData.businessProfile?.description,
            establishedDate: onboardingData.businessProfile?.establishedDate,
            
            // Location & Hours
            address: onboardingData.locationHours?.address,
            businessHours: onboardingData.locationHours?.businessHours,
            deliveryRadius: onboardingData.locationHours?.deliveryRadius || 5,
            
            // Cuisine & Services
            cuisineTypes: onboardingData.cuisineServices?.cuisineTypes || [],
            isVegetarian: onboardingData.cuisineServices?.isVegetarian || false,
            hasDelivery: onboardingData.cuisineServices?.hasDelivery !== false,
            hasPickup: onboardingData.cuisineServices?.hasPickup !== false,
            acceptsCash: onboardingData.cuisineServices?.acceptsCash !== false,
            acceptsCard: onboardingData.cuisineServices?.acceptsCard !== false,
            minimumOrderAmount: onboardingData.cuisineServices?.minimumOrderAmount || 100,
            deliveryFee: onboardingData.cuisineServices?.deliveryFee || 0,
            estimatedDeliveryTime: onboardingData.cuisineServices?.estimatedDeliveryTime || 30,
            
            // Images & Branding
            logoUrl: onboardingData.imagesBranding?.logoUrl,
            bannerUrl: onboardingData.imagesBranding?.bannerUrl,
            socialMedia: onboardingData.imagesBranding?.socialMedia,
            
            // Documents
            gstNumber: onboardingData.documents?.gstNumber,
            licenseNumber: onboardingData.documents?.licenseNumber,
            documents: onboardingData.documents?.documents || {},
            
            // Payment Setup
            commissionRate: onboardingData.paymentSetup?.commissionRate || 20,
            
            // Role
            role: 'business' as const,
          };

          if (__DEV__) console.log('🏪 Partner AuthStore: Mapped registration data:', registrationData);
          
          const response = await authService.register(registrationData);
          
          set({ 
            user: response.user,
            partner: response.partner || null,
            token: response.accessToken || response.token,
            isAuthenticated: true,
            isLoading: false 
          });
          
          if (__DEV__) console.log('✅ Partner AuthStore: Registration with onboarding successful');
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Registration with onboarding error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

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
          await authService.logout();
          if (__DEV__) console.log('✅ Partner AuthStore: Logout API call completed');
          
          // Clear all tokens using TokenManager
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
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Logout error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Logout failed';
          
          // Even if logout API fails, clear local state and tokens
          await tokenManager.clearTokens();
          
          set({ 
            user: null,
            partner: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: errorMessage, 
            isLoading: false,
            isLoggingOut: false 
          });
        }
      },

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
          const errorMessage = error.response?.data?.message || error.message || 'Failed to change password. Please try again.';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      refreshAuthToken: async () => {
        try {
          const refreshToken = await tokenManager.getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await authService.refreshToken(refreshToken);
          await tokenManager.storeTokens(response.accessToken, response.refreshToken);
          
          set({
            token: response.accessToken,
            refreshToken: response.refreshToken,
          });
          
          if (__DEV__) console.log('✅ Partner AuthStore: Token refreshed successfully');
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Token refresh error:', error);
          // If refresh fails, logout user
          await get().logout();
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      // Partner profile actions
      updatePartnerProfile: async (data: Partial<PartnerProfile>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedPartner = await api.partner.updateProfile(data);
          
          // Update local storage
          await authService.updateStoredUser(updatedPartner as AuthUser);
          
          set({
            partner: updatedPartner,
            user: updatedPartner as AuthUser, // Update user as well since they're the same for partners
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Update partner profile error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile. Please try again.';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      refreshPartnerProfile: async () => {
        try {
          const partner = await api.partner.getCurrentProfile();
          
          // Update local storage
          await authService.updateStoredUser(partner as AuthUser);
          
          set({ partner, user: partner as AuthUser });
        } catch (error: any) {
          console.error('❌ Partner AuthStore: Refresh partner profile error:', error);
          // Don't set error state for silent refresh
        }
      },

      fetchUserProfile: async () => {
        if (__DEV__) console.log('🔍 Partner AuthStore: fetchUserProfile called');
        set({ isLoading: true, error: null });
        try {
          if (__DEV__) console.log('📱 Partner AuthStore: Fetching partner profile from API...');
          
          // Try to fetch from API first
          try {
            const profileData = await api.partner.getCurrentProfile();
            if (__DEV__) console.log('✅ Partner AuthStore: Profile fetched from API:', profileData);
            
            // Update local storage with fresh data
            await authService.updateStoredUser(profileData as AuthUser);
            
            set({ user: profileData as AuthUser, partner: profileData, isLoading: false });
            return;
          } catch (apiError) {
            if (__DEV__) console.log('⚠️ Partner AuthStore: API fetch failed, falling back to stored user');
            console.error('API Error:', apiError);
            
            // Fallback to stored user if API fails
            const storedUser = await authService.getCurrentUser();
            if (__DEV__) console.log('👤 Partner AuthStore: Stored user:', storedUser);
            
            if (storedUser) {
              if (__DEV__) console.log('✅ Partner AuthStore: Using stored user data');
              set({ user: storedUser, partner: storedUser as PartnerProfile, isLoading: false });
            } else {
              if (__DEV__) console.log('❌ Partner AuthStore: No user found in storage either');
              set({ 
                error: 'Partner profile not found', 
                isLoading: false 
              });
            }
          }
        } catch (error) {
          console.error('❌ Partner AuthStore: Error in fetchUserProfile:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
        }
      },

      updateUserProfile: async (data: Partial<PartnerProfile>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await api.partner.updateProfile(data);
          set({ user: updatedUser as AuthUser, partner: updatedUser, isLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
        }
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
        user: state.user,
        partner: state.partner,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore; 