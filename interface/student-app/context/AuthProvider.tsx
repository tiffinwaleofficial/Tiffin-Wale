import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import authService from '@/utils/authService';
import { CustomerProfile } from '@/types/auth';
import { RegisterRequest } from '@/types/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: CustomerProfile | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authStore = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Initialize authentication on mount
  useEffect(() => {
    if (!authStore.isInitialized) {
      console.log('🔍 AuthProvider: Initializing authentication');
      authStore.initializeAuth();
    }
  }, [authStore.isInitialized]);

  // Listen for token expiration events
  useEffect(() => {
    const handleTokenExpired = () => {
      console.log('🚨 AuthProvider: Token expired event received');
      authStore.logout();
    };

    // Add event listener for token expiration
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:token-expired', handleTokenExpired);
      
      return () => {
        window.removeEventListener('auth:token-expired', handleTokenExpired);
      };
    }
  }, [authStore]);

  // Periodically check authentication status (reduced frequency)
  useEffect(() => {
    if (authStore.isAuthenticated && !isCheckingAuth) {
      const checkAuthInterval = setInterval(async () => {
        console.log('🔍 AuthProvider: Periodic auth check');
        setIsCheckingAuth(true);
        try {
          // Only check with backend if local token seems valid
          const isLocallyValid = await authService.isAuthenticated();
          if (!isLocallyValid) {
            console.log('🔍 AuthProvider: Local token invalid, logging out');
            await authStore.logout();
            return;
          }
          
          // Check with backend less frequently
          const isValid = await authService.validateToken();
          if (!isValid) {
            console.log('🔍 AuthProvider: Backend validation failed, logging out');
            await authStore.logout();
          } else {
            console.log('✅ AuthProvider: Periodic auth check passed');
          }
        } catch (error) {
          console.error('❌ AuthProvider: Auth check failed:', error);
          // Don't logout on network errors
          if (error instanceof Error && !error.message.includes('network')) {
            await authStore.logout();
          }
        } finally {
          setIsCheckingAuth(false);
        }
      }, 10 * 60 * 1000); // Check every 10 minutes (reduced frequency)

      return () => clearInterval(checkAuthInterval);
    }
  }, [authStore.isAuthenticated, isCheckingAuth, authStore]);

  const checkAuth = async () => {
    if (authStore.isAuthenticated) {
      const isValid = await authService.validateToken();
      if (!isValid) {
        await authStore.logout();
      }
    }
  };

  const value: AuthContextType = {
    isAuthenticated: authStore.isAuthenticated,
    isInitialized: authStore.isInitialized,
    isLoading: authStore.isLoading || isCheckingAuth,
    user: authStore.user,
    error: authStore.error,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    clearError: authStore.clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
