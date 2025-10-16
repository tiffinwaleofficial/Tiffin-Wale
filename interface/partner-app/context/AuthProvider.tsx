import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import NavigationService from '../services/navigationService';
import { useLogin, useRegister, useRegisterPartner, useGetProfile } from '../api/hooks/useApi';
import { ENV, API_ENDPOINTS } from '../config/env';

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: any | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phoneNumber: string, firebaseUid: string) => Promise<void>;
  checkUserExists: (phoneNumber: string) => Promise<boolean>;
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

  // API hooks
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const registerPartnerMutation = useRegisterPartner();
  const profileQuery = useGetProfile({ enabled: false });

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
      const token = await AsyncStorage.getItem('partner_auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
        
        // Optionally verify token with backend
        // profileQuery.refetch();
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
      console.log('Login attempt:', email);
      
      // Use real API call
      const response = await loginMutation.mutateAsync({ email, password });
      
      // Store tokens (assuming the API returns tokens)
      if (response.accessToken) {
        await AsyncStorage.setItem('partner_auth_token', response.accessToken);
      }
      if (response.refreshToken) {
        await AsyncStorage.setItem('partner_refresh_token', response.refreshToken);
      }
      
      // Store user data
      if (response.user) {
        await AsyncStorage.setItem('user_data', JSON.stringify(response.user));
        setUser(response.user);
      }
      
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Partner registration attempt:', userData);
      
      // Map all onboarding data to comprehensive partner registration format
      const registrationData = {
        // Step 1: Personal Info
        email: userData.step1?.email,
        firstName: userData.step1?.firstName,
        lastName: userData.step1?.lastName,
        phoneNumber: userData.step1?.phoneNumber,
        
        // Step 2: Account
        password: userData.step2?.password,
        role: 'business' as const, // Partners are always business role
        
        // Step 3: Business Profile
        businessName: userData.step3?.businessName,
        description: userData.step3?.description,
        establishedDate: userData.step3?.establishedDate,
        
        // Step 4: Location & Hours
        address: userData.step4?.address,
        businessHours: userData.step4?.businessHours,
        deliveryRadius: userData.step4?.deliveryRadius || 5,
        
        // Step 5: Cuisine & Services
        cuisineTypes: userData.step5?.cuisineTypes || [],
        isVegetarian: userData.step5?.isVegetarian || false,
        hasDelivery: userData.step5?.hasDelivery !== false, // Default true
        hasPickup: userData.step5?.hasPickup !== false, // Default true
        acceptsCash: userData.step5?.acceptsCash !== false, // Default true
        acceptsCard: userData.step5?.acceptsCard !== false, // Default true
        minimumOrderAmount: userData.step5?.minimumOrderAmount || 100,
        deliveryFee: userData.step5?.deliveryFee || 0,
        estimatedDeliveryTime: userData.step5?.estimatedDeliveryTime || 30,
        
        // Step 6: Images & Branding
        logoUrl: userData.step6?.logoUrl,
        bannerUrl: userData.step6?.bannerUrl,
        socialMedia: userData.step6?.socialMedia,
        
        // Step 7: Documents
        gstNumber: userData.step7?.gstNumber,
        licenseNumber: userData.step7?.licenseNumber,
        documents: userData.step7?.documents || {},
        
        // Step 8: Payment Setup
        commissionRate: userData.step8?.commissionRate || 20,
        
        // Marketing preference
        agreeToMarketing: userData.agreeToMarketing || false,
      };
      
      console.log('Mapped registration data:', registrationData);
      
      // Use partner registration API call
      const response = await registerPartnerMutation.mutateAsync(registrationData);
      
      // Store tokens if returned
      if (response.accessToken) {
        await AsyncStorage.setItem('partner_auth_token', response.accessToken);
      }
      if (response.refreshToken) {
        await AsyncStorage.setItem('partner_refresh_token', response.refreshToken);
      }
      
      // Store user data
      if (response.user) {
        await AsyncStorage.setItem('user_data', JSON.stringify(response.user));
        setUser(response.user);
      }
      
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear stored auth data
      await AsyncStorage.removeItem('partner_auth_token');
      await AsyncStorage.removeItem('partner_refresh_token');
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

  const checkUserExists = async (phoneNumber: string): Promise<boolean> => {
    try {
      // TODO: Create API endpoint to check if user exists by phone number
      // For now, return false (new user) - will be implemented in backend
      const response = await fetch(`${ENV.API_BASE_URL}${API_ENDPOINTS.AUTH.CHECK_PHONE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      
      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false; // Default to new user if check fails
    }
  };

  const loginWithPhone = async (phoneNumber: string, firebaseUid: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Create API endpoint for phone-based login
      // This will verify the Firebase UID and return user data with tokens
      const response = await fetch(`${ENV.API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN_PHONE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, firebaseUid }),
      });

      if (!response.ok) {
        throw new Error('Phone login failed');
      }

      const data = await response.json();
      
      // Store tokens
      if (data.accessToken) {
        await AsyncStorage.setItem('partner_auth_token', data.accessToken);
      }
      if (data.refreshToken) {
        await AsyncStorage.setItem('partner_refresh_token', data.refreshToken);
      }
      
      // Store user data
      if (data.user) {
        await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
        setUser(data.user);
      }
      
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Phone login error:', err);
      setError(err.message || 'Phone login failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isInitialized,
    isLoading,
    user,
    error,
    login,
    loginWithPhone,
    checkUserExists,
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
