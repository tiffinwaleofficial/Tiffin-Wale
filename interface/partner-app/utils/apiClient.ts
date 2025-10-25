import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { DeviceEventEmitter } from 'react-native';
import { secureTokenManager } from '../auth/SecureTokenManager';
import { config } from '../config/environment';
import {
  LoginResponse,
  LoginCredentials,
  PhoneLoginCredentials,
  TokenRefreshRequest,
  TokenRefreshResponse,
} from '../auth/types';
import {
  PartnerProfile,
  CreatePartnerData,
  PartnerStats,
  MenuItem,
  MenuCategory,
  Order,
  OrderStatusUpdate,
} from '../types';

// Get API base URL from our environment configuration
const API_BASE_URL = config.apiBaseUrl;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Longer timeout for partner operations
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding authentication token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      // Skip auth for login/register endpoints
      if (config.url?.includes('/auth/login') || 
          config.url?.includes('/auth/register') || 
          config.url?.includes('/auth/check-phone') ||
          config.url?.includes('/auth/refresh')) {
        if (__DEV__) console.log('🔓 Partner API: Skipping auth for public endpoint:', config.url);
        return config;
      }

      // Use SecureTokenManager for secure token management (handles refresh automatically)
      const token = await secureTokenManager.getAccessToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        if (__DEV__) console.log('🔐 Partner API: Adding auth token to request:', config.url);
      } else {
        if (__DEV__) console.warn('⚠️ Partner API: No valid token available for request:', config.url);
        
        // Check if user should be authenticated
        const hasTokens = await secureTokenManager.hasTokens();
        if (!hasTokens) {
          if (__DEV__) console.log('🚨 Partner API: User not authenticated, request may fail');
        }
      }
    } catch (error) {
      console.error('❌ Partner API: Error in request interceptor:', error);
    }
    
    return config;
  },
  (error: AxiosError): Promise<never> => {
    console.error('❌ Partner API: Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<never> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Skip interceptor for logout calls to prevent infinite loops
    if (originalRequest.url?.includes('/auth/logout')) {
      if (__DEV__) console.log('🚪 Partner API: Skipping interceptor for logout call');
      return Promise.reject(error);
    }
    
    // Handle 401 Unauthorized (token expired) using SecureTokenManager
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (__DEV__) console.log('🚨 Partner API: 401 Unauthorized error for:', originalRequest.url);
      if (__DEV__) console.log('🔍 Partner API: Error response:', error.response.data);
      
      originalRequest._retry = true;
      
      try {
        if (__DEV__) console.log('🔄 Partner API: Attempting to refresh token...');
        
        // Use SecureTokenManager to handle token refresh
        const refreshToken = await secureTokenManager.getRefreshToken();
        if (!refreshToken) {
          if (__DEV__) console.log('🔐 Partner API: No refresh token available');
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint directly
        const refreshResponse = await apiClient.post('/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        
        // Store new tokens
        await secureTokenManager.storeTokens({
          accessToken,
          refreshToken: newRefreshToken || refreshToken
        });
        
        if (accessToken) {
          if (__DEV__) console.log('✅ Partner API: Token refreshed successfully');
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } else {
          if (__DEV__) console.log('❌ Partner API: Token refresh failed');
          
          // Clear all tokens and emit auth error
          await secureTokenManager.clearAll();
          
          // Emit logout event for the app to handle
          DeviceEventEmitter.emit('partner_auth_error', {
            type: 'token_refresh_failed',
            message: 'Session expired. Please login again.'
          });
        }
        
      } catch (refreshError) {
        console.error('❌ Partner API: Token refresh failed:', refreshError);
        
        // If refresh failed, clear all tokens and user data
        console.log('🧹 Partner API: Clearing all auth tokens due to failed refresh');
        try {
          await secureTokenManager.clearAll();
          
          // Emit a custom event to notify the app about auth failure
          DeviceEventEmitter.emit('partner_auth:token-expired');
        } catch (clearError) {
          console.error('❌ Partner API: Error clearing tokens:', clearError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Enhanced error handling utility
const handleApiError = (error: any, context: string) => {
  if (__DEV__) console.error(`❌ Partner API Error (${context}):`, error);
  
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.statusText || 'Server error';
    throw new Error(message);
  } else if (error.request) {
    // Request was made but no response received
    throw new Error('Network error. Please check your connection.');
  } else {
    // Something else happened
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Retry mechanism with exponential backoff
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      if (__DEV__) console.log(`🔄 Partner API: Retry attempt ${attempt} in ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Common API methods for Partner App
const api = {
  // Auth endpoints
  auth: {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      try {
        const response = await retryRequest(() => 
          apiClient.post<LoginResponse>('/auth/login', credentials)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'login');
        throw error;
      }
    },

    loginWithPhone: async (credentials: PhoneLoginCredentials): Promise<LoginResponse> => {
      try {
        const response = await retryRequest(() =>
          apiClient.post<LoginResponse>('/auth/login-phone', credentials)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'loginWithPhone');
        throw error;
      }
    },

    register: async (partnerData: CreatePartnerData): Promise<LoginResponse> => {
      try {
        const response = await retryRequest(() =>
          apiClient.post<LoginResponse>('/partners', partnerData)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'register');
        throw error;
      }
    },

    refreshToken: async (request: TokenRefreshRequest): Promise<TokenRefreshResponse> => {
      try {
        const response = await apiClient.post<TokenRefreshResponse>('/auth/refresh', request);
        return response.data;
      } catch (error) {
        handleApiError(error, 'refreshToken');
        throw error;
      }
    },

    changePassword: async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
      try {
        const response = await retryRequest(() =>
          apiClient.post('/auth/change-password', { oldPassword, newPassword })
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'changePassword');
        throw error;
      }
    },

    logout: async (): Promise<void> => {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        // Don't throw on logout errors, just log them
        console.warn('⚠️ Partner API: Logout API error (continuing anyway):', error);
      } finally {
        // Always clear local tokens
        await secureTokenManager.clearAll();
      }
    },

    checkUserExists: async (phoneNumber: string): Promise<boolean> => {
      try {
        const response = await retryRequest(() =>
          apiClient.post('/auth/check-phone', { phoneNumber })
        );
        return response.data.exists;
      } catch (error) {
        handleApiError(error, 'checkUserExists');
        throw error;
      }
    },
  },

  // Partner Profile endpoints
  partner: {
    getCurrentProfile: async (): Promise<PartnerProfile> => {
      try {
        const response = await retryRequest(() =>
          apiClient.get<PartnerProfile>('/partners/user/me')
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getCurrentProfile');
        throw error;
      }
    },

    updateProfile: async (data: Partial<PartnerProfile>): Promise<PartnerProfile> => {
      try {
        const response = await retryRequest(() =>
          apiClient.put<PartnerProfile>('/partners/me', data)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'updateProfile');
        throw error;
      }
    },

    getById: async (id: string): Promise<PartnerProfile> => {
      try {
        const response = await retryRequest(() =>
          apiClient.get<PartnerProfile>(`/partners/${id}`)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getById');
        throw error;
      }
    },

    updateAcceptingStatus: async (isAcceptingOrders: boolean): Promise<PartnerProfile> => {
      try {
        const response = await retryRequest(() =>
          apiClient.put<PartnerProfile>('/partners/status/me', { isAcceptingOrders })
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'updateAcceptingStatus');
        throw error;
      }
    },

    getStats: async (): Promise<PartnerStats> => {
      try {
        const response = await retryRequest(() =>
          apiClient.get<PartnerStats>('/partners/stats/me')
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getStats');
        throw error;
      }
    },
  },

  // Orders endpoints
  orders: {
    getMyOrders: async (
      page = 1, 
      limit = 10, 
      status?: string
    ): Promise<{ orders: Order[]; total: number; page: number; limit: number }> => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(status && { status }),
        });
        const response = await retryRequest(() =>
          apiClient.get(`/partners/orders/me?${params}`)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getMyOrders');
        throw error;
      }
    },

    getTodayOrders: async (): Promise<any> => {
      try {
        const response = await retryRequest(() =>
          apiClient.get('/partners/orders/me/today')
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getTodayOrders');
        throw error;
      }
    },

    getOrderById: async (id: string): Promise<Order> => {
      try {
        const response = await retryRequest(() =>
          apiClient.get<Order>(`/orders/${id}`)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getOrderById');
        throw error;
      }
    },

    updateOrderStatus: async (id: string, status: string): Promise<Order> => {
      try {
        const response = await retryRequest(() =>
          apiClient.patch<Order>(`/orders/${id}/status`, { status })
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'updateOrderStatus');
        throw error;
      }
    },

    acceptOrder: async (id: string, data?: { estimatedTime?: number; message?: string }): Promise<Order> => {
      try {
        const response = await retryRequest(() =>
          apiClient.patch<Order>(`/orders/${id}/accept`, data || {})
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'acceptOrder');
        throw error;
      }
    },

    rejectOrder: async (id: string, data: { reason: string; message?: string }): Promise<Order> => {
      try {
        const response = await retryRequest(() =>
          apiClient.patch<Order>(`/orders/${id}/reject`, data)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'rejectOrder');
        throw error;
      }
    },

    markOrderReady: async (id: string, data?: { estimatedPickupTime?: number; message?: string }): Promise<Order> => {
      try {
        const response = await retryRequest(() =>
          apiClient.patch<Order>(`/orders/${id}/ready`, data || {})
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'markOrderReady');
        throw error;
      }
    },
  },

  // Menu Management endpoints
  menu: {
    getMyMenu: async (): Promise<any> => {
      try {
        const response = await retryRequest(() =>
          apiClient.get('/partners/menu/me')
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getMyMenu');
        throw error;
      }
    },

    createMenuItem: async (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> => {
      try {
        const response = await retryRequest(() =>
          apiClient.post<MenuItem>('/menu', item)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'createMenuItem');
        throw error;
      }
    },

    updateMenuItem: async (id: string, item: Partial<MenuItem>): Promise<MenuItem> => {
      try {
        const response = await retryRequest(() =>
          apiClient.patch<MenuItem>(`/menu/${id}`, item)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'updateMenuItem');
        throw error;
      }
    },

    deleteMenuItem: async (id: string): Promise<void> => {
      try {
        await retryRequest(() =>
          apiClient.delete(`/menu/${id}`)
        );
      } catch (error) {
        handleApiError(error, 'deleteMenuItem');
        throw error;
      }
    },

    getCategories: async (): Promise<MenuCategory[]> => {
      try {
        const response = await retryRequest(() =>
          apiClient.get<MenuCategory[]>('/menu/categories')
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getCategories');
        throw error;
      }
    },

    createCategory: async (category: Omit<MenuCategory, 'id'>): Promise<MenuCategory> => {
      try {
        const response = await retryRequest(() =>
          apiClient.post<MenuCategory>('/menu/categories', category)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'createCategory');
        throw error;
      }
    },
  },

  // Analytics/Earnings endpoints
  analytics: {
    getEarnings: async (
      period: 'today' | 'week' | 'month' | 'custom', 
      startDate?: string, 
      endDate?: string
    ): Promise<any> => {
      try {
        const params = new URLSearchParams({ period });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const response = await retryRequest(() =>
          apiClient.get(`/analytics/earnings?${params}`)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getEarnings');
        throw error;
      }
    },

    getOrderStats: async (period: string): Promise<any> => {
      try {
        const response = await retryRequest(() =>
          apiClient.get(`/analytics/orders?period=${period}`)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getOrderStats');
        throw error;
      }
    },

    getRevenueHistory: async (months: number = 6): Promise<any> => {
      try {
        const response = await retryRequest(() =>
          apiClient.get(`/analytics/revenue-history?months=${months}`)
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getRevenueHistory');
        throw error;
      }
    },

    getDashboardData: async (): Promise<any> => {
      try {
        const response = await retryRequest(() =>
          apiClient.get('/analytics/dashboard')
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'getDashboardData');
        throw error;
      }
    },
  },

  // File Upload endpoints (for Cloudinary)
  upload: {
    uploadImage: async (
      file: any, 
      type: 'profile' | 'menu' | 'banner'
    ): Promise<{ url: string; public_id: string }> => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        
        const response = await retryRequest(() =>
          apiClient.post('/upload/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        );
        return response.data;
      } catch (error) {
        handleApiError(error, 'uploadImage');
        throw error;
      }
    },

    deleteImage: async (publicId: string): Promise<void> => {
      try {
        await retryRequest(() =>
          apiClient.delete(`/upload/image/${publicId}`)
        );
      } catch (error) {
        handleApiError(error, 'deleteImage');
        throw error;
      }
    },
  },

  // Health check
  health: {
    check: async (): Promise<{ status: string; timestamp: string }> => {
      try {
        const response = await apiClient.get('/health');
        return response.data;
      } catch (error) {
        handleApiError(error, 'healthCheck');
        throw error;
      }
    },
  },
};

export default api;
export { apiClient, handleApiError, retryRequest };