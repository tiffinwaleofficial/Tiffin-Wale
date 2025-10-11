import { create } from 'zustand';
import { RegisterRequest, CustomerProfile } from '@/types/api';
import { authService } from '@/utils/authService';
import api from '@/utils/apiClient';
import { getErrorMessage, isNetworkError, isAuthError } from '@/utils/errorHandler';

interface AuthState {
  user: CustomerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (data: Partial<CustomerProfile>) => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set: any) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,

  initializeAuth: async () => {
    console.log('🔍 AuthStore: Starting authentication initialization');
    set({ isLoading: true, error: null });
    
    try {
      // First check if we have a valid token locally
      const isAuthenticated = await authService.isAuthenticated();
      console.log('🔍 AuthStore: Local auth check result:', isAuthenticated);
      
      if (isAuthenticated) {
        // Get user from storage first
        const storedUser = await authService.getCurrentUser();
        console.log('🔍 AuthStore: Stored user:', storedUser ? 'Found' : 'Not found');
        
        if (storedUser) {
          // Validate token with backend
          console.log('🔍 AuthStore: Validating token with backend...');
          const isValidWithBackend = await authService.validateToken();
          console.log('🔍 AuthStore: Backend validation result:', isValidWithBackend);
          
          if (isValidWithBackend) {
            console.log('✅ AuthStore: Auth initialized successfully with valid user');
            set({ 
              user: storedUser, 
              isAuthenticated: true, 
              isLoading: false,
              isInitialized: true,
              error: null
            });
            return;
          } else {
            console.log('⚠️ AuthStore: Token invalid with backend, clearing auth');
            await authService.logout();
          }
        } else {
          console.log('⚠️ AuthStore: No stored user found, clearing auth');
          await authService.logout();
        }
      }
      
      // If we reach here, user is not authenticated
      console.log('🔍 AuthStore: User not authenticated, setting initial state');
      set({ 
        user: null,
        isAuthenticated: false, 
        isLoading: false,
        isInitialized: true,
        error: null
      });
      
    } catch (error) {
      console.error('❌ AuthStore: Auth initialization error:', error);
      const errorMessage = getErrorMessage(error);
      set({ 
        user: null,
        isAuthenticated: false, 
        isLoading: false,
        isInitialized: true,
        error: errorMessage
      });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      set({ 
        user: response.user,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
    }
  },

  register: async (userData: RegisterRequest) => {
    console.log('🏪 AuthStore: register function called with:', userData);
    set({ isLoading: true, error: null });
    try {
      console.log('🏪 AuthStore: Calling authService.register');
      const response = await authService.register(userData);
      console.log('✅ AuthStore: authService.register completed successfully');
      set({ 
        user: response.user,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      console.error('❌ AuthStore: Registration error:', error);
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
    }
  },

  fetchUserProfile: async () => {
    console.log('🔍 AuthStore: fetchUserProfile called');
    set({ isLoading: true, error: null });
    try {
      console.log('📱 AuthStore: Fetching user profile from API...');
      
      // Try to fetch from API first
      try {
        const profileData = await api.customer.getProfile();
        console.log('✅ AuthStore: Profile fetched from API:', profileData);
        
        // Update local storage with fresh data
        await authService.updateStoredUser(profileData);
        
        set({ user: profileData, isLoading: false });
        return;
      } catch (apiError) {
        console.log('⚠️ AuthStore: API fetch failed, falling back to stored user');
        console.error('API Error:', apiError);
        
        // Fallback to stored user if API fails
        const storedUser = await authService.getCurrentUser();
        console.log('👤 AuthStore: Stored user:', storedUser);
        
        if (storedUser) {
          console.log('✅ AuthStore: Using stored user data');
          set({ user: storedUser, isLoading: false });
        } else {
          console.log('❌ AuthStore: No user found in storage either');
          set({ 
            error: 'User profile not found', 
            isLoading: false 
          });
        }
      }
    } catch (error) {
      console.error('❌ AuthStore: Error in fetchUserProfile:', error);
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
    }
  },

  updateUserProfile: async (data: Partial<CustomerProfile>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await api.customer.updateProfile(data);
      set({ user: updatedUser, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile.', 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));