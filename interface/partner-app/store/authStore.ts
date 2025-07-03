import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/apiClient';
import AuthService from '../utils/authService';
import { AuthState, AuthUser, PartnerProfile, CreatePartnerData, LoginResponse } from '../types/auth';

interface AuthActions {
  // Authentication actions
  login: (email: string, password: string) => Promise<void>;
  register: (partnerData: CreatePartnerData) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  
  // Session management
  initializeAuth: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  clearError: () => void;
  
  // Partner profile actions
  updatePartnerProfile: (data: Partial<PartnerProfile>) => Promise<void>;
  refreshPartnerProfile: () => Promise<void>;
  
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
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Authentication actions
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response: LoginResponse = await api.auth.login(email, password);
          
          // Save authentication session
          await AuthService.saveAuthSession(
            response.token,
            response.refreshToken,
            response.user,
            response.partner
          );
          
          set({
            isAuthenticated: true,
            user: response.user,
            partner: response.partner || null,
            token: response.token,
            refreshToken: response.refreshToken || null,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Login error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Login failed. Please try again.',
            isAuthenticated: false,
            user: null,
            partner: null,
            token: null,
            refreshToken: null,
          });
          throw error;
        }
      },

      register: async (partnerData: CreatePartnerData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response: LoginResponse = await api.auth.register(partnerData);
          
          // Save authentication session
          await AuthService.saveAuthSession(
            response.token,
            response.refreshToken,
            response.user,
            response.partner
          );
          
          set({
            isAuthenticated: true,
            user: response.user,
            partner: response.partner || null,
            token: response.token,
            refreshToken: response.refreshToken || null,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Registration error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Registration failed. Please try again.',
            isAuthenticated: false,
            user: null,
            partner: null,
            token: null,
            refreshToken: null,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Call logout API
          await api.auth.logout();
          
          // Clear local storage
          await AuthService.clearAuthSession();
          
          set({
            ...initialState,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Logout error:', error);
          // Even if API call fails, clear local state
          await AuthService.clearAuthSession();
          set({
            ...initialState,
            isLoading: false,
          });
        }
      },

      changePassword: async (oldPassword: string, newPassword: string) => {
        try {
          set({ isLoading: true, error: null });
          
          await api.auth.changePassword(oldPassword, newPassword);
          
          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Change password error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to change password. Please try again.',
          });
          throw error;
        }
      },

      // Session management
      initializeAuth: async () => {
        try {
          set({ isLoading: true });
          
          const session = await AuthService.getAuthSession();
          
          if (session.token && session.user) {
            // Check if token is expired
            if (AuthService.isTokenExpired(session.token)) {
              // Try to refresh token
              if (session.refreshToken) {
                try {
                  await get().refreshAuthToken();
                  return;
                } catch (error) {
                  console.warn('Token refresh failed, clearing session');
                  await AuthService.clearAuthSession();
                  set({ ...initialState, isLoading: false });
                  return;
                }
              } else {
                // No refresh token, clear session
                await AuthService.clearAuthSession();
                set({ ...initialState, isLoading: false });
                return;
              }
            }
            
            // Token is valid, restore session
            set({
              isAuthenticated: true,
              user: session.user,
              partner: session.partner,
              token: session.token,
              refreshToken: session.refreshToken,
              isLoading: false,
              error: null,
            });
          } else {
            set({ ...initialState, isLoading: false });
          }
        } catch (error) {
          console.error('Initialize auth error:', error);
          set({ ...initialState, isLoading: false });
        }
      },

      refreshAuthToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Note: We'll need to implement this endpoint in the backend
          // For now, we'll just throw an error
          throw new Error('Token refresh not implemented yet');
          
          // TODO: Implement token refresh
          // const response = await api.auth.refreshToken(refreshToken);
          // await AuthService.saveToken(response.token);
          // if (response.refreshToken) {
          //   await AuthService.saveRefreshToken(response.refreshToken);
          // }
          // set({
          //   token: response.token,
          //   refreshToken: response.refreshToken || refreshToken,
          // });
        } catch (error: any) {
          console.error('Token refresh error:', error);
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
        try {
          set({ isLoading: true, error: null });
          
          const updatedPartner = await api.partner.updateProfile(data);
          
          // Update local storage
          await AuthService.savePartner(updatedPartner);
          
          set({
            partner: updatedPartner,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Update partner profile error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to update profile. Please try again.',
          });
          throw error;
        }
      },

      refreshPartnerProfile: async () => {
        try {
          const partner = await api.partner.getCurrentProfile();
          
          // Update local storage
          await AuthService.savePartner(partner);
          
          set({ partner });
        } catch (error: any) {
          console.error('Refresh partner profile error:', error);
          // Don't set error state for silent refresh
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