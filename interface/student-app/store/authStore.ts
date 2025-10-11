import { create } from 'zustand';
import { RegisterRequest, CustomerProfile } from '@/types/api';
import { authService } from '@/utils/authService';
import api from '@/utils/apiClient';

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        const userProfile = await api.customer.getProfile();
        set({ 
          user: userProfile, 
          isAuthenticated: true, 
          isLoading: false,
          isInitialized: true 
        });
      } else {
        set({ 
          isAuthenticated: false, 
          isLoading: false,
          isInitialized: true 
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        isAuthenticated: false, 
        isLoading: false,
        isInitialized: true 
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
      set({ 
        error: error instanceof Error ? error.message : 'Login failed. Please try again.', 
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
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed. Please try again.', 
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
      set({ 
        error: error instanceof Error ? error.message : 'Logout failed. Please try again.', 
        isLoading: false 
      });
    }
  },

  fetchUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const userProfile = await api.customer.getProfile();
      set({ user: userProfile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile.', 
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