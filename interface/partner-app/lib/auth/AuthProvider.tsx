/**
 * Authentication Provider
 * Simple wrapper around auth store to initialize authentication on app start
 */

import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Provider Component
 * Wraps the app and initializes authentication on mount
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize);
  
  useEffect(() => {
    // Initialize authentication when app starts
    initialize();
  }, [initialize]);
  
  return <>{children}</>;
}

/**
 * Hook to access authentication state and actions
 * Direct access to the auth store
 */
export function useAuthContext() {
  return useAuthStore();
}

export default AuthProvider;

