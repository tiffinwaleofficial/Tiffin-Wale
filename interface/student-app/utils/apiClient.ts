import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse, CustomerProfile } from '../types/auth';
import { DeliveryAddress } from '../types/api';
import { config } from '../config/environment';

// API data types
interface OrderCreateData {
  items: Array<{ itemId: string; quantity: number }>;
  type?: string;
  deliveryAddress?: DeliveryAddress;
}

interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  city?: string;
  college?: string;
  branch?: string;
}

interface SubscriptionCreateData {
  planId: string;
  startDate?: string;
  paymentMethodId?: string;
}

// Get API base URL from our environment configuration
const API_BASE_URL = config.apiBaseUrl;

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
      const response = await apiClient.post<LoginResponse>('/auth/login', {
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
    updateProfile: async (data: UserProfileUpdate) => {
      const response = await apiClient.patch('/users/profile', data);
      return response.data;
    },
  },
  
  // Meals endpoints - NEW
  meals: {
    getToday: async () => {
      const response = await apiClient.get('/meals/today');
      return response.data;
    },
    getHistory: async () => {
      const response = await apiClient.get('/meals/history');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/meals/${id}`);
      return response.data;
    },
    updateStatus: async (id: string, status: string) => {
      const response = await apiClient.patch(`/meals/${id}/status`, { status });
      return response.data;
    },
    skipMeal: async (id: string, reason?: string) => {
      const response = await apiClient.patch(`/meals/${id}/skip`, { reason });
      return response.data;
    },
    rateMeal: async (id: string, rating: number, review?: string) => {
      const response = await apiClient.post(`/meals/${id}/rate`, { rating, review });
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
    getCategories: async () => {
      const response = await apiClient.get('/menu/categories');
      return response.data;
    },
  },

  // Partners/Restaurants endpoints - NEW
  partners: {
    getAll: async () => {
      const response = await apiClient.get('/partners');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/partners/${id}`);
      return response.data;
    },
    getMenu: async (id: string) => {
      const response = await apiClient.get(`/partners/${id}/menu`);
      return response.data;
    },
    getReviews: async (id: string) => {
      const response = await apiClient.get(`/partners/${id}/reviews`);
      return response.data;
    },
    getStats: async (id: string) => {
      const response = await apiClient.get(`/partners/${id}/stats`);
      return response.data;
    },
  },
  
  // Order endpoints
  orders: {
    create: async (orderData: OrderCreateData) => {
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
    addReview: async (id: string, rating: number, comment: string) => {
      const response = await apiClient.patch(`/orders/${id}/review`, { rating, comment });
      return response.data;
    },
  },
  
  // Enhanced Customer endpoints
  customer: {
    getProfile: async () => {
      const response = await apiClient.get('/customers/profile');
      return response.data;
    },
    updateProfile: async (data: UserProfileUpdate) => {
      const response = await apiClient.patch('/customers/profile', data);
      return response.data;
    },
    getAddresses: async () => {
      const response = await apiClient.get('/customers/addresses');
      return response.data;
    },
    addAddress: async (address: DeliveryAddress) => {
      const response = await apiClient.post('/customers/addresses', address);
      return response.data;
    },
    updateAddress: async (id: string, address: Partial<DeliveryAddress>) => {
      const response = await apiClient.patch(`/customers/addresses/${id}`, address);
      return response.data;
    },
    deleteAddress: async (id: string) => {
      const response = await apiClient.delete(`/customers/addresses/${id}`);
      return response.data;
    },
    getOrders: async () => {
      const response = await apiClient.get('/customers/orders');
      return response.data;
    },
    getSubscriptions: async () => {
      const response = await apiClient.get('/customers/subscriptions');
      return response.data;
    },
  },

  // Subscription Plans endpoints - NEW
  subscriptionPlans: {
    getAll: async () => {
      const response = await apiClient.get('/subscription-plans');
      return response.data;
    },
    getActive: async () => {
      const response = await apiClient.get('/subscription-plans/active');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await apiClient.get(`/subscription-plans/${id}`);
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
    getByCustomer: async (customerId: string) => {
      const response = await apiClient.get(`/subscriptions/customer/${customerId}`);
      return response.data;
    },
    create: async (data: SubscriptionCreateData) => {
      const response = await apiClient.post('/subscriptions', data);
      return response.data;
    },
    cancel: async (id: string) => {
      const response = await apiClient.patch(`/subscriptions/${id}/cancel`);
      return response.data;
    },
    pause: async (id: string) => {
      const response = await apiClient.patch(`/subscriptions/${id}/pause`);
      return response.data;
    },
    resume: async (id: string) => {
      const response = await apiClient.patch(`/subscriptions/${id}/resume`);
      return response.data;
    },
  },

  // Notifications endpoints - NEW
  notifications: {
    getUserNotifications: async (userId: string) => {
      const response = await apiClient.get(`/notifications/user/${userId}`);
      return response.data;
    },
    markAsRead: async (id: string) => {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      return response.data;
    },
    getOrderStatusUpdates: (orderId: string) => {
      // Server-Sent Events endpoint for real-time updates
      return new EventSource(`${API_BASE_URL}/notifications/orders/${orderId}/status`);
    },
  },

  // Feedback endpoints - NEW
  feedback: {
    submit: async (feedbackData: {
      type: string;
      subject: string;
      message: string;
      category?: string;
      rating?: number;
    }) => {
      const response = await apiClient.post('/feedback', feedbackData);
      return response.data;
    },
  },

  // Marketing endpoints - NEW
  marketing: {
    createReferral: async () => {
      const response = await apiClient.post('/referrals');
      return response.data;
    },
    getUserReferrals: async (userId: string) => {
      const response = await apiClient.get(`/referrals/user/${userId}`);
      return response.data;
    },
    getActivePromotions: async () => {
      const response = await apiClient.get('/marketing/promotions/active');
      return response.data;
    },
    applyPromotion: async (code: string) => {
      const response = await apiClient.post('/marketing/apply-promotion', { code });
      return response.data;
    },
  },

  // System endpoints - NEW
  system: {
    healthCheck: async () => {
      const response = await apiClient.get('/ping');
      return response.data;
    },
    getVersion: async () => {
      const response = await apiClient.get('/version');
      return response.data;
    },
  },
};

export default api; 