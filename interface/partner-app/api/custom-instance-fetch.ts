import AsyncStorage from '@react-native-async-storage/async-storage';
import { envConfig } from '../config/env';

// Custom fetch-based client for React Native/Expo compatibility
export const customInstance = async <T = any>(
  config: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    data?: any;
    params?: Record<string, string>;
  }
): Promise<T> => {
  try {
    // Get auth token
    const token = await AsyncStorage.getItem('partner_auth_token');
    
    // Build URL with query parameters
    let url = config.url;
    if (config.params) {
      const searchParams = new URLSearchParams(config.params);
      url += `?${searchParams.toString()}`;
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Make the request
    const response = await fetch(url, {
      method: config.method,
      headers,
      body: config.data ? JSON.stringify(config.data) : undefined,
    });

    // Handle response
    if (!response.ok) {
      // Handle 401 Unauthorized errors
      if (response.status === 401) {
        // Clear tokens and handle logout
        await AsyncStorage.removeItem('partner_auth_token');
        await AsyncStorage.removeItem('partner_refresh_token');
        // TODO: Dispatch logout action or navigate to login
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text() as T;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// For Orval compatibility
export const customInstanceFn = customInstance;

