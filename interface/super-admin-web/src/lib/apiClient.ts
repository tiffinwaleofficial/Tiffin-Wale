import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '../config/environment';

// Get API base URL from our environment configuration
const API_BASE_URL = config.apiBaseUrl;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Longer timeout for admin operations
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Token management utilities
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_auth_token');
  }
  return null;
};

const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_auth_token', token);
  }
};

const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
  }
};

// Request interceptor for adding authentication token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<never> => Promise.reject(error)
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<never> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear tokens and redirect to login
      removeAuthToken();
      
      // If we're not on the login page, redirect there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      console.error('Access denied: Insufficient permissions');
      // Could show a toast notification here
    }
    
    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Server error occurred');
      // Could show a toast notification here
    }
    
    return Promise.reject(error);
  }
);

// Enhanced API methods for Super Admin
const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string): Promise<any> => {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });
      
      if (response.data.token) {
        setAuthToken(response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('admin_refresh_token', response.data.refreshToken);
        }
        if (response.data.user) {
          localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    },
    
    logout: async (): Promise<void> => {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        // Even if API call fails, clear local storage
        console.warn('Logout API call failed, but clearing local storage');
      }
      removeAuthToken();
    },
    
    getCurrentUser: (): any | null => {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('admin_user');
        return userStr ? JSON.parse(userStr) : null;
      }
      return null;
    },
    
    isAuthenticated: (): boolean => {
      return !!getAuthToken();
    },
  },

  // Admin Dashboard endpoints
  dashboard: {
    getStats: async (): Promise<any> => {
      const response = await apiClient.get('/admin/dashboard/stats');
      return response.data;
    },
    
    getActivities: async (limit = 10): Promise<any> => {
      const response = await apiClient.get(`/admin/dashboard/activities?limit=${limit}`);
      return response.data;
    },
  },

  // Admin Orders management
  orders: {
    getAll: async (page = 1, limit = 10, filters: any = {}): Promise<any> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });
      const response = await apiClient.get(`/admin/orders?${params}`);
      return response.data;
    },
    
    updateStatus: async (orderId: string, status: string, reason?: string): Promise<any> => {
      const response = await apiClient.patch(`/admin/orders/${orderId}/status`, {
        status,
        reason,
      });
      return response.data;
    },
  },

  // Admin Partners management
  partners: {
    getAll: async (page = 1, limit = 10, filters: any = {}): Promise<any> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });
      const response = await apiClient.get(`/admin/partners?${params}`);
      return response.data;
    },
    
    updateStatus: async (partnerId: string, status: string, reason?: string): Promise<any> => {
      const response = await apiClient.patch(`/admin/partners/${partnerId}/status`, {
        status,
        reason,
      });
      return response.data;
    },
  },

  // Admin Customers management
  customers: {
    getAll: async (page = 1, limit = 10, filters: any = {}): Promise<any> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });
      const response = await apiClient.get(`/admin/customers?${params}`);
      return response.data;
    },
  },

  // Admin Subscriptions management
  subscriptions: {
    getAll: async (page = 1, limit = 10, filters: any = {}): Promise<any> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });
      const response = await apiClient.get(`/admin/subscriptions?${params}`);
      return response.data;
    },
    
    // For dashboard subscription distribution
    getActive: async (): Promise<any> => {
      const response = await apiClient.get('/subscriptions/active');
      return response.data;
    },
  },

  // Analytics endpoints
  analytics: {
    getRevenue: async (period = 'month', startDate?: string, endDate?: string): Promise<any> => {
      const params = new URLSearchParams({ period });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await apiClient.get(`/admin/revenue?${params}`);
      return response.data;
    },
    
    getRevenueHistory: async (months = 6): Promise<any> => {
      const response = await apiClient.get(`/analytics/revenue-history?months=${months}`);
      return response.data;
    },
    
    getEarnings: async (period = 'month'): Promise<any> => {
      const response = await apiClient.get(`/analytics/earnings?period=${period}`);
      return response.data;
    },
  },

  // Support management
  support: {
    getTickets: async (page = 1, limit = 10, filters: any = {}): Promise<any> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });
      const response = await apiClient.get(`/admin/support/tickets?${params}`);
      return response.data;
    },
    
    updateTicket: async (ticketId: string, updates: any): Promise<any> => {
      const response = await apiClient.patch(`/admin/support/tickets/${ticketId}`, updates);
      return response.data;
    },
  },

  // Generic HTTP methods for backward compatibility
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },
  
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },
  
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },
  
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },
  
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

export default api;