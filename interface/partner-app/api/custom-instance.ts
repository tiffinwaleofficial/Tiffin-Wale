import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';
import NavigationService from '../services/navigationService';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('partner_auth_token');
      
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
        // Try to refresh token
        const refreshToken = await AsyncStorage.getItem('partner_refresh_token');
        
        if (refreshToken) {
          // Make refresh request
          const refreshResponse = await axios.post(`${ENV.API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
          
          // Store new tokens
          await AsyncStorage.setItem('partner_auth_token', accessToken);
          if (newRefreshToken) {
            await AsyncStorage.setItem('partner_refresh_token', newRefreshToken);
          }
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and logout
        await AsyncStorage.removeItem('partner_auth_token');
        await AsyncStorage.removeItem('partner_refresh_token');
        await AsyncStorage.removeItem('user_data');
        
        // Navigate to login screen
        NavigationService.navigateToLogin();
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


