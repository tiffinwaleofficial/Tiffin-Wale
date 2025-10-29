'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { authControllerLogin, authControllerLogout, userControllerGetProfile } from '@tiffinwale/sdk';

// Helper to get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper to set token in localStorage
const setToken = (token: string, refreshToken?: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }
};

// Helper to clear auth data
const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

type User = {
  id: string;
  email: string;
  username?: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if we have a JWT token in localStorage
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token by fetching user profile
      const { data: userProfile, error } = await userControllerGetProfile();
      
      if (error || !userProfile) {
        console.warn('Failed to get user profile, token may be invalid');
        clearAuth();
        setLoading(false);
        return;
      }

      // Check if user has admin or super_admin role
      const userData = userProfile as any;
      if (!userData?.role || !['admin', 'super_admin'].includes(userData.role)) {
        console.warn('User does not have admin privileges');
        clearAuth();
        setLoading(false);
        return;
      }

      setUser(userData as User);
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data: authData, error } = await authControllerLogin({ 
        body: { email, password } 
      });
      
      if (error || !authData) {
        throw new Error(error ? 'Invalid email or password' : 'Login failed');
      }

      // Parse the response
      const auth = authData as any;
      
      // Check if user has admin or super_admin role
      if (!auth?.user?.role || !['admin', 'super_admin'].includes(auth.user.role)) {
        throw new Error('Access denied. Admin or Super Admin privileges required.');
      }

      // Store JWT tokens in localStorage
      if (auth.token) {
        setToken(auth.token, auth.refreshToken);
        
        // Also store user data for quick access
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(auth.user));
        }
      } else {
        throw new Error('No authentication token received from server');
      }

      setUser(auth.user as User);
    } catch (error: any) {
      console.error('Login failed:', error);
      clearAuth();
      throw error;
    }
  };

  const logout = () => {
    try {
      // Call API logout to invalidate token on server
      authControllerLogout().catch(console.error);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      clearAuth();
      setUser(null);
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      // For now, just logout and require re-login
      // TODO: Implement when backend has refresh endpoint
      logout();
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuth();
      logout();
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
