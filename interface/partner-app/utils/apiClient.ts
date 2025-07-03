import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/environment';

// Import types
import { LoginResponse, PartnerProfile, CreatePartnerData } from '../types/auth';
import { Order, OrderStatusUpdate } from '../types/order';
import { MenuItem, MenuCategory } from '../types/partner';

// Get API base URL from our environment configuration
const API_BASE_URL = config.apiBaseUrl;

const apiClient = axios.create({
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
      const token = await AsyncStorage.getItem('partner_auth_token');
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
      await AsyncStorage.removeItem('partner_auth_token');
      await AsyncStorage.removeItem('partner_refresh_token');
      
      // This would need to be handled in the component using the API client
    }
    
    return Promise.reject(error);
  }
);

// Common API methods for Partner App
const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      return response.data;
    },
    register: async (partnerData: CreatePartnerData): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>('/partners', partnerData);
      return response.data;
    },
    changePassword: async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
      const response = await apiClient.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      return response.data;
    },
    logout: async (): Promise<void> => {
      await AsyncStorage.removeItem('partner_auth_token');
      await AsyncStorage.removeItem('partner_refresh_token');
    },
  },

  // Partner Profile endpoints
  partner: {
    getCurrentProfile: async (): Promise<PartnerProfile> => {
      const response = await apiClient.get('/partners/user/me');
      return response.data;
    },
    updateProfile: async (data: Partial<PartnerProfile>): Promise<PartnerProfile> => {
      const response = await apiClient.put('/partners/me', data);
      return response.data;
    },
    getById: async (id: string): Promise<PartnerProfile> => {
      const response = await apiClient.get(`/partners/${id}`);
      return response.data;
    },
    updateAcceptingStatus: async (isAcceptingOrders: boolean): Promise<PartnerProfile> => {
      const response = await apiClient.put('/partners/status/me', { isAcceptingOrders });
      return response.data;
    },
    getStats: async (): Promise<any> => {
      const response = await apiClient.get('/partners/stats/me');
      return response.data;
    },
  },

  // Orders endpoints
  orders: {
    getMyOrders: async (page = 1, limit = 10, status?: string): Promise<{ orders: Order[]; total: number; page: number; limit: number }> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });
      const response = await apiClient.get(`/partners/orders/me?${params}`);
      return response.data;
    },
    getOrderById: async (id: string): Promise<Order> => {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    },
    updateOrderStatus: async (id: string, status: string): Promise<Order> => {
      const response = await apiClient.patch(`/orders/${id}/status`, { status });
      return response.data;
    },
    getTodayOrders: async (): Promise<any> => {
      const response = await apiClient.get('/partners/orders/me/today');
      return response.data;
    },
  },

  // Menu Management endpoints
  menu: {
    getMyMenu: async (): Promise<any> => {
      const response = await apiClient.get('/partners/menu/me');
      return response.data;
    },
    createMenuItem: async (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> => {
      const response = await apiClient.post('/menu', item);
      return response.data;
    },
    updateMenuItem: async (id: string, item: Partial<MenuItem>): Promise<MenuItem> => {
      const response = await apiClient.patch(`/menu/${id}`, item);
      return response.data;
    },
    deleteMenuItem: async (id: string): Promise<void> => {
      await apiClient.delete(`/menu/${id}`);
    },
    getCategories: async (): Promise<MenuCategory[]> => {
      const response = await apiClient.get('/menu/categories');
      return response.data;
    },
    createCategory: async (category: Omit<MenuCategory, 'id'>): Promise<MenuCategory> => {
      const response = await apiClient.post('/menu/categories', category);
      return response.data;
    },
  },

  // Meals endpoints
  meals: {
    getMyMeals: async (date?: string): Promise<any[]> => {
      const params = date ? `?date=${date}` : '';
      const response = await apiClient.get(`/meals/partner/me${params}`); // We'll need this endpoint
      return response.data;
    },
    createMeal: async (meal: any): Promise<any> => {
      const response = await apiClient.post('/meals', meal);
      return response.data;
    },
    updateMealStatus: async (id: string, status: string): Promise<any> => {
      const response = await apiClient.patch(`/meals/${id}/status`, { status });
      return response.data;
    },
  },

  // Analytics/Earnings endpoints
  analytics: {
    getEarnings: async (period: 'today' | 'week' | 'month' | 'custom', startDate?: string, endDate?: string): Promise<any> => {
      const params = new URLSearchParams({ period });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await apiClient.get(`/analytics/earnings?${params}`); // We'll need this endpoint
      return response.data;
    },
    getOrderStats: async (period: string): Promise<any> => {
      const response = await apiClient.get(`/analytics/orders?period=${period}`); // We'll need this endpoint
      return response.data;
    },
    getRevenueHistory: async (months: number = 6): Promise<any> => {
      const response = await apiClient.get(`/analytics/revenue-history?months=${months}`); // We'll need this endpoint
      return response.data;
    },
  },

  // Reviews endpoints
  reviews: {
    getMyReviews: async (page = 1, limit = 10): Promise<any> => {
      const response = await apiClient.get(`/partners/me/reviews?page=${page}&limit=${limit}`); // We'll need this endpoint
      return response.data;
    },
  },

  // Notifications endpoints
  notifications: {
    getMyNotifications: async (): Promise<any[]> => {
      const response = await apiClient.get('/notifications/partner/me'); // We'll need this endpoint
      return response.data;
    },
    markAsRead: async (id: string): Promise<void> => {
      await apiClient.patch(`/notifications/${id}/read`); // We'll need this endpoint
    },
    markAllAsRead: async (): Promise<void> => {
      await apiClient.patch('/notifications/partner/me/read-all'); // We'll need this endpoint
    },
  },

  // File Upload endpoints (for Cloudinary)
  upload: {
    uploadImage: async (file: any, type: 'profile' | 'menu' | 'banner'): Promise<{ url: string; public_id: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await apiClient.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // We'll need this endpoint
      return response.data;
    },
    deleteImage: async (publicId: string): Promise<void> => {
      await apiClient.delete(`/upload/image/${publicId}`); // We'll need this endpoint
    },
  },

  // Support/Help endpoints
  support: {
    createTicket: async (subject: string, message: string, category: string): Promise<any> => {
      const response = await apiClient.post('/support/tickets', {
        subject,
        message,
        category,
      }); // We'll need this endpoint
      return response.data;
    },
    getMyTickets: async (): Promise<any[]> => {
      const response = await apiClient.get('/support/tickets/me'); // We'll need this endpoint
      return response.data;
    },
  },
};

export default api; 