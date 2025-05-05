import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { LoginResponse, AuthError, CustomerProfile } from '../types/auth';

// Get API base URL from environment variables or use default
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://127.0.0.1:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding authentication token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error adding auth token to request:', error);
      return config;
    }
  },
  (error: AxiosError): Promise<never> => Promise.reject(error)
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<never> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear token and redirect to login
      await AsyncStorage.removeItem('auth_token');
      
      // Implement navigation to login if needed
      // This would need to be handled in the component using the API client
    }
    
    return Promise.reject(error);
  }
);

// Common API methods
const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>('/api/auth/login', {
        email,
        password,
      });
      return response.data;
    },
    register: async (userData: Omit<CustomerProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>('/auth/register', userData);
      return response.data;
    },
    refreshToken: async (refreshToken: string): Promise<Pick<LoginResponse, 'token' | 'refreshToken' | 'expiresIn'>> => {
      const response = await apiClient.post('/auth/refresh-token', { refreshToken });
      return response.data;
    },
    logout: async (): Promise<void> => {
      await apiClient.post('/auth/logout');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
    },
    forgotPassword: async (email: string): Promise<{ message: string }> => {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    },
    resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    },
    changePassword: async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
      const response = await apiClient.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      return response.data;
    },
  },
  
  // User endpoints
  user: {
    getProfile: async () => {
      const response = await apiClient.get('/users/profile');
      return response.data;
    },
    updateProfile: async (data: Record<string, any>) => {
      const response = await apiClient.patch('/users/profile', data);
      return response.data;
    },
  },
  
  // Menu endpoints
  menu: {
    getAll: async () => {
      const response = await apiClient.get('/menu');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/menu/${id}`);
      return response.data;
    },
    getByPartner: async (partnerId: string) => {
      const response = await apiClient.get(`/menu/partner/${partnerId}`);
      return response.data;
    },
  },
  
  // Order endpoints
  orders: {
    create: async (orderData: Record<string, any>) => {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    },
    getAll: async () => {
      const response = await apiClient.get('/orders');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    },
    getByCustomer: async () => {
      const response = await apiClient.get('/orders/customer');
      return response.data;
    },
    updateStatus: async (id: string, status: string) => {
      const response = await apiClient.patch(`/orders/${id}/status`, { status });
      return response.data;
    },
  },
  
  // Customer endpoints
  customer: {
    getProfile: async () => {
      const response = await apiClient.get('/customers/profile');
      return response.data;
    },
    updateProfile: async (data: Record<string, any>) => {
      const response = await apiClient.patch('/customers/profile', data);
      return response.data;
    },
    getAddresses: async () => {
      const response = await apiClient.get('/customers/addresses');
      return response.data;
    },
    addAddress: async (address: Record<string, any>) => {
      const response = await apiClient.post('/customers/addresses', address);
      return response.data;
    },
    updateAddress: async (id: string, address: Record<string, any>) => {
      const response = await apiClient.patch(`/customers/addresses/${id}`, address);
      return response.data;
    },
    deleteAddress: async (id: string) => {
      const response = await apiClient.delete(`/customers/addresses/${id}`);
      return response.data;
    },
  },
  
  // Subscription endpoints
  subscriptions: {
    getAll: async () => {
      const response = await apiClient.get('/subscriptions');
      return response.data;
    },
    getActive: async () => {
      const response = await apiClient.get('/subscriptions/active');
      return response.data;
    },
    create: async (data: Record<string, any>) => {
      const response = await apiClient.post('/subscriptions', data);
      return response.data;
    },
    cancel: async (id: string) => {
      const response = await apiClient.post(`/subscriptions/${id}/cancel`);
      return response.data;
    },
  },
};

export default api; 