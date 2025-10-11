import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from './authService';
import { getWebSocketManager } from './websocketManager';
import {
  CustomerProfile,
  DeliveryAddress,
  OrderCreateData,
  LoginResponse,
  Order,
  OrderTracking,
  Menu,
  MenuCategory,
  MenuItem,
  SubscriptionPlan,
  Subscription,
  PaymentMethod,
  PaymentMethodData,
  PaymentData,
  PaymentResult,
  FeedbackData,
  Feedback,
  SupportTicketData,
  SupportTicket,
  MealCustomization,
  SubscriptionCreateData,
} from '../types/api';
import { Meal } from '../types';

interface WebSocketMessage {
  type: string;
  channel?: string;
  data?: Record<string, unknown>;
  timestamp?: number;
}

interface WebSocketCallback {
  (data: Record<string, unknown>): void;
}

// API base URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:3001';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding authentication token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<never> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const newToken = await authService.refreshAccessToken();
        if (newToken) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // If refresh failed, clear token and redirect to login
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user_data');
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
      console.log('🌐 API Client: Making POST request to /api/auth/register');
      console.log('📤 Request URL:', `${API_BASE_URL}/api/auth/register`);
      console.log('📤 Request data:', userData);
      
      try {
        const response = await apiClient.post<LoginResponse>('/api/auth/register', userData);
        console.log('✅ API Response status:', response.status);
        console.log('✅ API Response data:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ API Request failed:', error);
        if (error.response) {
          console.error('❌ Response status:', error.response.status);
          console.error('❌ Response data:', error.response.data);
        }
        throw error;
      }
    },
    changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
      await apiClient.post('/api/auth/change-password', {
        oldPassword,
        newPassword,
      });
    },
    logout: async (): Promise<void> => {
      try {
        await apiClient.post('/api/auth/logout');
      } catch (error) {
        // Logout should succeed even if API fails
        console.warn('Logout API call failed, but proceeding with local cleanup:', error);
      }
    },
    refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
      const response = await apiClient.post('/api/auth/refresh-token', { refreshToken });
      return response.data;
    },
    forgotPassword: async (email: string): Promise<void> => {
      await apiClient.post('/api/auth/forgot-password', { email });
    },
    resetPassword: async (token: string, newPassword: string): Promise<void> => {
      await apiClient.post('/api/auth/reset-password', { token, newPassword });
    },
  },
  
  // User endpoints
  user: {
    getProfile: async () => {
      const response = await apiClient.get('/users/profile');
      return response.data;
    },
    updateProfile: async (data: Partial<CustomerProfile>): Promise<CustomerProfile> => {
      const response = await apiClient.put<CustomerProfile>('/api/customers/profile', data);
      return response.data;
    },
  },
  
  // Customer endpoints
  customer: {
    getProfile: async (): Promise<CustomerProfile> => {
      const response = await apiClient.get<CustomerProfile>('/api/customers/profile');
      return response.data;
    },
    updateProfile: async (data: Partial<CustomerProfile>): Promise<CustomerProfile> => {
      const response = await apiClient.put<CustomerProfile>('/api/customers/profile', data);
      return response.data;
    },
    getAddresses: async (): Promise<DeliveryAddress[]> => {
      const response = await apiClient.get<DeliveryAddress[]>('/api/customers/addresses');
      return response.data;
    },
    addAddress: async (address: Omit<DeliveryAddress, 'id'>): Promise<DeliveryAddress> => {
      const response = await apiClient.post<DeliveryAddress>('/api/customers/addresses', address);
      return response.data;
    },
    updateAddress: async (id: string, address: Partial<DeliveryAddress>): Promise<DeliveryAddress> => {
      const response = await apiClient.put<DeliveryAddress>(`/api/customers/addresses/${id}`, address);
      return response.data;
    },
    deleteAddress: async (id: string): Promise<void> => {
      await apiClient.delete(`/api/customers/addresses/${id}`);
    },
    setDefaultAddress: async (id: string): Promise<void> => {
      await apiClient.patch(`/api/customers/addresses/${id}/default`);
    },
    // Additional methods that stores expect
    getOrders: async (): Promise<Order[]> => {
      const response = await apiClient.get<Order[]>('/api/customers/orders');
      return response.data;
    },
    getSubscriptions: async (): Promise<Subscription[]> => {
      const response = await apiClient.get<Subscription[]>('/api/customers/subscriptions');
      return response.data;
    },
  },

  // Order endpoints
  order: {
    create: async (orderData: OrderCreateData): Promise<Order> => {
      const response = await apiClient.post<Order>('/api/orders', orderData);
      return response.data;
    },
    getOrders: async (): Promise<Order[]> => {
      const response = await apiClient.get<Order[]>('/api/orders');
      return response.data;
    },
    getOrder: async (id: string): Promise<Order> => {
      const response = await apiClient.get<Order>(`/api/orders/${id}`);
      return response.data;
    },
    cancelOrder: async (id: string): Promise<void> => {
      await apiClient.patch(`/api/orders/${id}/cancel`);
    },
    trackOrder: async (id: string): Promise<OrderTracking> => {
      const response = await apiClient.get<OrderTracking>(`/api/orders/${id}/track`);
      return response.data;
    },
  },

  // Menu endpoints
  menu: {
    getMenu: async (): Promise<Menu> => {
      const response = await apiClient.get<Menu>('/api/menu');
      return response.data;
    },
    getCategories: async (): Promise<MenuCategory[]> => {
      const response = await apiClient.get<MenuCategory[]>('/api/menu/categories');
      return response.data;
    },
    getItemsByCategory: async (categoryId: string): Promise<MenuItem[]> => {
      const response = await apiClient.get<MenuItem[]>(`/api/menu/categories/${categoryId}/items`);
      return response.data;
    },
    // Additional methods that stores expect
    getAll: async (): Promise<Menu> => {
      const response = await apiClient.get<Menu>('/api/menu');
      return response.data;
    },
    getById: async (id: string): Promise<MenuItem> => {
      const response = await apiClient.get<MenuItem>(`/api/menu/${id}`);
      return response.data;
    },
    getByPartner: async (partnerId: string): Promise<Menu> => {
      const response = await apiClient.get<Menu>(`/api/menu/partner/${partnerId}`);
      return response.data;
    },
  },

  // Meal endpoints
  meal: {
    getTodayMeals: async (): Promise<Meal[]> => {
      const response = await apiClient.get<Meal[]>('/api/meals/today');
      return response.data;
    },
    getMeal: async (id: string): Promise<Meal> => {
      const response = await apiClient.get<Meal>(`/api/meals/${id}`);
      return response.data;
    },
    customizeMeal: async (id: string, customizations: MealCustomization): Promise<Meal> => {
      const response = await apiClient.post<Meal>(`/api/meals/${id}/customize`, customizations);
      return response.data;
    },
    // Additional methods that stores expect
    getHistory: async (): Promise<Meal[]> => {
      const response = await apiClient.get<Meal[]>('/api/meals/me/history');
      return response.data;
    },
    rateMeal: async (id: string, rating: number, comment?: string): Promise<void> => {
      await apiClient.post(`/api/meals/${id}/rate`, { rating, comment });
    },
    skipMeal: async (id: string, reason?: string): Promise<void> => {
      await apiClient.patch(`/api/meals/${id}/skip`, { reason });
    },
    updateStatus: async (id: string, status: string): Promise<void> => {
      await apiClient.patch(`/api/meals/${id}/status`, { status });
    },
  },

  // Legacy meals endpoint for backward compatibility
  meals: {
    getToday: async (): Promise<Meal[]> => {
      const response = await apiClient.get<Meal[]>('/api/meals/today');
      return response.data;
    },
    getHistory: async (): Promise<Meal[]> => {
      const response = await apiClient.get<Meal[]>('/api/meals/me/history');
      return response.data;
    },
    getById: async (id: string): Promise<Meal> => {
      const response = await apiClient.get<Meal>(`/api/meals/${id}`);
      return response.data;
    },
    updateStatus: async (id: string, status: string): Promise<void> => {
      await apiClient.patch(`/api/meals/${id}/status`, { status });
    },
    skipMeal: async (id: string, reason?: string): Promise<void> => {
      await apiClient.patch(`/api/meals/${id}/skip`, { reason });
    },
    rateMeal: async (id: string, rating: number, review?: string): Promise<void> => {
      await apiClient.post(`/api/meals/${id}/rate`, { rating, review });
    },
  },

  // Legacy orders endpoint for backward compatibility
  orders: {
    create: async (orderData: OrderCreateData): Promise<Order> => {
      const response = await apiClient.post<Order>('/api/orders', orderData);
      return response.data;
    },
    getAll: async (): Promise<Order[]> => {
      const response = await apiClient.get<Order[]>('/api/orders');
      return response.data;
    },
    getById: async (id: string): Promise<Order> => {
      const response = await apiClient.get<Order>(`/api/orders/${id}`);
      return response.data;
    },
    getByCustomer: async (): Promise<Order[]> => {
      const response = await apiClient.get<Order[]>('/api/orders/me');
      return response.data;
    },
    updateStatus: async (id: string, status: string): Promise<void> => {
      await apiClient.patch(`/api/orders/${id}/status`, { status });
    },
    addReview: async (id: string, rating: number, comment: string): Promise<void> => {
      await apiClient.patch(`/api/orders/${id}/review`, { rating, comment });
    },
  },

  // Legacy subscription endpoints for backward compatibility
  subscriptionPlans: {
    getAll: async (): Promise<SubscriptionPlan[]> => {
      const response = await apiClient.get<SubscriptionPlan[]>('/api/subscription-plans');
      return response.data;
    },
    getActive: async (): Promise<SubscriptionPlan[]> => {
      const response = await apiClient.get<SubscriptionPlan[]>('/api/subscription-plans/active');
      return response.data;
    },
    getById: async (id: string): Promise<SubscriptionPlan> => {
      const response = await apiClient.get<SubscriptionPlan>(`/api/subscription-plans/${id}`);
      return response.data;
    },
  },

  subscriptions: {
    getAll: async (): Promise<Subscription[]> => {
      const response = await apiClient.get<Subscription[]>('/api/subscriptions');
      return response.data;
    },
    getActive: async (): Promise<Subscription[]> => {
      const response = await apiClient.get<Subscription[]>('/api/subscriptions/active');
      return response.data;
    },
    getByCustomer: async (customerId: string): Promise<Subscription[]> => {
      const response = await apiClient.get<Subscription[]>(`/api/subscriptions/customer/${customerId}`);
      return response.data;
    },
    create: async (data: SubscriptionCreateData): Promise<Subscription> => {
      const response = await apiClient.post<Subscription>('/api/subscriptions', data);
      return response.data;
    },
    cancel: async (id: string): Promise<Subscription> => {
      const response = await apiClient.patch<Subscription>(`/api/subscriptions/${id}/cancel`);
      return response.data;
    },
    pause: async (id: string): Promise<Subscription> => {
      const response = await apiClient.patch<Subscription>(`/api/subscriptions/${id}/pause`);
      return response.data;
    },
    resume: async (id: string): Promise<Subscription> => {
      const response = await apiClient.patch<Subscription>(`/api/subscriptions/${id}/resume`);
      return response.data;
    },
  },

  // Payment endpoints
  payment: {
    getMethods: async (): Promise<PaymentMethod[]> => {
      const response = await apiClient.get<PaymentMethod[]>('/api/payments/methods');
      return response.data;
    },
    addMethod: async (methodData: PaymentMethodData): Promise<PaymentMethod> => {
      const response = await apiClient.post<PaymentMethod>('/api/payments/methods', methodData);
      return response.data;
    },
    removeMethod: async (id: string): Promise<void> => {
      await apiClient.delete(`/api/payments/methods/${id}`);
    },
    setDefaultMethod: async (id: string): Promise<void> => {
      await apiClient.patch(`/api/payments/methods/${id}/default`);
    },
    processPayment: async (paymentData: PaymentData): Promise<PaymentResult> => {
      const response = await apiClient.post<PaymentResult>('/api/payments/process', paymentData);
      return response.data;
    },
  },

  // Feedback endpoints
  feedback: {
    submit: async (feedbackData: FeedbackData): Promise<Feedback> => {
      const response = await apiClient.post<Feedback>('/api/feedback', feedbackData);
      return response.data;
    },
    getFeedback: async (): Promise<Feedback[]> => {
      const response = await apiClient.get<Feedback[]>('/api/feedback');
      return response.data;
    },
  },

  // Support endpoints
  support: {
    createTicket: async (ticketData: SupportTicketData): Promise<SupportTicket> => {
      const response = await apiClient.post<SupportTicket>('/api/support/tickets', ticketData);
      return response.data;
    },
    getTickets: async (): Promise<SupportTicket[]> => {
      const response = await apiClient.get<SupportTicket[]>('/api/support/tickets');
      return response.data;
    },
    getTicket: async (id: string): Promise<SupportTicket> => {
      const response = await apiClient.get<SupportTicket>(`/api/support/tickets/${id}`);
      return response.data;
    },
    updateTicket: async (id: string, updates: Partial<SupportTicket>): Promise<SupportTicket> => {
      const response = await apiClient.put<SupportTicket>(`/api/support/tickets/${id}`, updates);
      return response.data;
    },
  },

  // Marketing endpoints
  marketing: {
    createReferral: async (): Promise<Record<string, unknown>> => {
      const response = await apiClient.post('/api/referrals');
      return response.data;
    },
    getUserReferrals: async (userId: string): Promise<Record<string, unknown>[]> => {
      const response = await apiClient.get(`/api/referrals/user/${userId}`);
      return response.data;
    },
    getActivePromotions: async (): Promise<Record<string, unknown>[]> => {
      const response = await apiClient.get('/api/marketing/promotions/active');
      return response.data;
    },
    applyPromotion: async (code: string): Promise<Record<string, unknown>> => {
      const response = await apiClient.post('/api/marketing/apply-promotion', { code });
      return response.data;
    },
  },

  // Notifications endpoints
  notifications: {
    getUserNotifications: async (userId: string): Promise<Record<string, unknown>[]> => {
      const response = await apiClient.get(`/api/notifications/user/${userId}`);
      return response.data;
    },
    markAsRead: async (id: string): Promise<void> => {
      await apiClient.patch(`/api/notifications/${id}/read`);
    },
    getOrderStatusUpdates: (orderId: string): EventSource => {
      // Server-Sent Events endpoint for real-time updates
      return new EventSource(`${API_BASE_URL}/api/notifications/orders/${orderId}/status`);
    },
  },

  // Partners/Restaurants endpoints
  partners: {
    getAll: async (): Promise<Record<string, unknown>[]> => {
      const response = await apiClient.get('/api/partners');
      return response.data;
    },
    getById: async (id: string): Promise<Record<string, unknown>> => {
      const response = await apiClient.get(`/api/partners/${id}`);
      return response.data;
    },
    getMenu: async (id: string): Promise<Record<string, unknown>> => {
      const response = await apiClient.get(`/api/partners/${id}/menu`);
      return response.data;
    },
    getReviews: async (id: string): Promise<Record<string, unknown>[]> => {
      const response = await apiClient.get(`/api/partners/${id}/reviews`);
      return response.data;
    },
    getStats: async (id: string): Promise<Record<string, unknown>> => {
      const response = await apiClient.get(`/api/partners/${id}/stats`);
      return response.data;
    },
  },
  
  // WebSocket real-time methods
  websocket: {
    connect: async (): Promise<void> => {
      const wsManager = getWebSocketManager(API_BASE_URL);
      await wsManager.connect();
    },
    
    disconnect: (): void => {
      const wsManager = getWebSocketManager(API_BASE_URL);
      wsManager.disconnect();
    },
    
    subscribe: (channel: string, callback: WebSocketCallback): string => {
      const wsManager = getWebSocketManager(API_BASE_URL);
      return wsManager.subscribe(channel, callback);
    },
    
    unsubscribe: (subscriptionId: string): void => {
      const wsManager = getWebSocketManager(API_BASE_URL);
      wsManager.unsubscribe(subscriptionId);
    },
    
    send: (message: WebSocketMessage): void => {
      const wsManager = getWebSocketManager(API_BASE_URL);
      wsManager.send(message);
    },
    
    isConnected: (): boolean => {
      const wsManager = getWebSocketManager(API_BASE_URL);
      return wsManager.getState().isConnected;
    },
    
    getState: () => {
      const wsManager = getWebSocketManager(API_BASE_URL);
      return wsManager.getState();
    },
  },
};

export default api; 