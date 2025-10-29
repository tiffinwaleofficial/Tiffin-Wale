import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config';
import NavigationService from '../services/navigationService';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Use TokenManager to get the access token
      const { tokenManager } = await import('../lib/auth/TokenManager');
      const token = await tokenManager.getAccessToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Use TokenManager to refresh token
        const { tokenManager } = await import('../lib/auth/TokenManager');
        const newToken = await tokenManager.refreshAccessToken();
        
        if (newToken) {
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and logout
        const { tokenManager } = await import('../lib/auth/TokenManager');
        await tokenManager.clearAll();
        
        // Navigate to login screen
        if (NavigationService) {
          NavigationService.navigateToLogin();
        }
        console.warn('Token refresh failed, redirecting to login');
      }
    }
    
    return Promise.reject(error);
  }
);

// Custom instance for Orval
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();
  
  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }: AxiosResponse<T>) => data);
  
  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };
  
  return promise;
};

export default customInstance;


