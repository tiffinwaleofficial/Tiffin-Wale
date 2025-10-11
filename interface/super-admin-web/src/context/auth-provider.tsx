'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/apiClient';

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
      // Check if we have a token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token and get user profile
      const userProfile = await api.auth.getProfile();
      
      // Check if user has admin role
      if (!userProfile.role || !['admin', 'super_admin'].includes(userProfile.role)) {
        console.warn('User does not have admin privileges');
        logout();
        return;
      }

      setUser(userProfile);
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Remove invalid token
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const authData = await api.auth.login(email, password);
      
      // Check if user has admin role
      if (!authData.user.role || !['admin', 'super_admin'].includes(authData.user.role)) {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Store token (API client will handle this automatically)
      setUser(authData.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      // Call API logout to invalidate token on server
      api.auth.logout().catch(console.error);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const authData = await api.auth.refreshToken(refreshToken);
      setUser(authData.user);
    } catch (error) {
      console.error('Token refresh failed:', error);
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
