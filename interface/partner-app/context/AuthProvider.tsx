import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import NavigationService from '../services/navigationService';

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: any | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state by checking stored token
    initializeAuth();

    // Listen for navigation events from API interceptors
    const handleNavigation = (data: { route: string; replace: boolean }) => {
      // Use setTimeout to ensure the component is mounted
      setTimeout(() => {
        if (data.replace) {
          router.replace(data.route);
        } else {
          router.push(data.route);
        }
      }, 0);
    };

    NavigationService.on('navigate', handleNavigation);

    return () => {
      NavigationService.off('navigate', handleNavigation);
    };
  }, [router]);

  const initializeAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Auth initialization error:', error);
    } finally {
      setIsInitialized(true);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      console.log('Login attempt:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser = { email, name: 'Partner Name', id: '1' };
      const mockToken = 'mock_jwt_token';
      
      // Store auth data
      await AsyncStorage.setItem('auth_token', mockToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));
      
      setIsAuthenticated(true);
      setUser(mockUser);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      console.log('Registration attempt:', userData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser = { ...userData, id: '1' };
      const mockToken = 'mock_jwt_token';
      
      // Store auth data
      await AsyncStorage.setItem('auth_token', mockToken);
      await AsyncStorage.setItem('user_data', JSON.stringify(mockUser));
      
      setIsAuthenticated(true);
      setUser(mockUser);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear stored auth data
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      setError('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
      }
      // TODO: Validate token with backend
    } catch (error) {
      console.log('Auth check error:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isInitialized,
    isLoading,
    user,
    error,
    login,
    register,
    logout,
    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
