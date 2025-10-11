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
      authStore.initializeAuth();
    }
  }, [authStore.isInitialized]);

  // Periodically check authentication status
  useEffect(() => {
    if (authStore.isAuthenticated && !isCheckingAuth) {
      const checkAuthInterval = setInterval(async () => {
        setIsCheckingAuth(true);
        try {
          const isValid = await authService.validateToken();
          if (!isValid) {
            await authStore.logout();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          await authStore.logout();
        } finally {
          setIsCheckingAuth(false);
        }
      }, 5 * 60 * 1000); // Check every 5 minutes

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
