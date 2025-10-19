import React, { createContext, useContext, useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { authService } from '../utils/authService';
import { AuthUser, PartnerProfile, CreatePartnerData } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phoneNumber: string, firebaseUid: string) => Promise<void>;
  checkUserExists: (phoneNumber: string) => Promise<boolean>;
  register: (userData: CreatePartnerData) => Promise<void>;
  registerWithOnboarding: (onboardingData: any) => Promise<void>;
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
      if (__DEV__) console.log('🔍 Partner AuthProvider: Initializing authentication');
      authStore.initializeAuth();
    }
  }, [authStore.isInitialized, authStore.initializeAuth]);

  // Listen for token expiration events
  useEffect(() => {
    let isHandlingTokenExpired = false;
    
    const handleTokenExpired = async () => {
      // Prevent multiple simultaneous token expiration handling
      if (isHandlingTokenExpired) {
        if (__DEV__) console.log('🚨 Partner AuthProvider: Token expiration already being handled, skipping');
        return;
      }
      
      if (__DEV__) console.log('🚨 Partner AuthProvider: Token expired event received');
      isHandlingTokenExpired = true;
      
      try {
        // Only logout if user is currently authenticated
        if (authStore.isAuthenticated && !authStore.isLoggingOut) {
          await authStore.logout();
        } else {
          if (__DEV__) console.log('🚨 Partner AuthProvider: User already logged out or logout in progress');
        }
      } catch (error) {
        console.error('❌ Partner AuthProvider: Error handling token expiration:', error);
      } finally {
        isHandlingTokenExpired = false;
      }
    };

    // Add event listener for token expiration
    const subscription = DeviceEventEmitter.addListener('partner_auth:token-expired', handleTokenExpired);
    
    return () => {
      subscription.remove();
      isHandlingTokenExpired = false;
    };
  }, [authStore.isAuthenticated, authStore.isLoggingOut, authStore.logout]);

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
    loginWithPhone: authStore.loginWithPhone,
    checkUserExists: authStore.checkUserExists,
    register: authStore.register,
    registerWithOnboarding: authStore.registerWithOnboarding,
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
