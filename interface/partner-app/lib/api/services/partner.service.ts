/**
 * Partner API Service
 * All partner-related API endpoints
 */

import { apiClient, handleApiError, retryRequest } from '../client';

/**
 * Address Interface
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Bank Account Interface
 */
export interface BankAccount {
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  branchName?: string;
  accountType?: string;
  upiId?: string;
  panNumber?: string;
  gstNumber?: string;
}

/**
 * Partner Profile Interface
 */
/**
 * Notification Preferences Interface
 */
export interface NotificationPreferences {
  pushEnabled?: boolean;
  orders?: boolean;
  payments?: boolean;
  reminders?: boolean;
  updates?: boolean;
  marketing?: boolean;
}

export interface PartnerProfile {
  _id?: string;
  id?: string;
  userId: string;
  businessName: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  address?: Address;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  cuisineTypes?: string[];
  serviceType?: string[];
  logoUrl?: string;
  bannerUrl?: string;
  images?: string[];
  businessHours?: any;
  isAcceptingOrders?: boolean;
  status?: string;
  rating?: number;
  totalOrders?: number;
  deliveryRadius?: number;
  bankAccount?: BankAccount;
  notificationPreferences?: NotificationPreferences;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

/**
 * Partner Statistics Interface
 */
export interface PartnerStats {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
}

/**
 * Menu Item Interface
 */
export interface MenuItem {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  isVegetarian?: boolean;
  isActive?: boolean;
  partnerId?: string;
  [key: string]: any;
}

/**
 * Partner API Methods
 */
export const partnerApi = {
  /**
   * Get current partner profile
   */
  getCurrentProfile: async (): Promise<PartnerProfile> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<PartnerProfile>('/partners/profile')
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getCurrentProfile');
    }
  },

  /**
   * Update current partner profile
   */
  updateProfile: async (data: Partial<PartnerProfile>): Promise<PartnerProfile> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<PartnerProfile>('/partners/profile', data)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updateProfile');
    }
  },

  /**
   * Get partner by ID
   */
  getById: async (id: string): Promise<PartnerProfile> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<PartnerProfile>(`/partners/${id}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPartnerById');
    }
  },

  /**
   * Update accepting orders status
   */
  updateAcceptingStatus: async (isAcceptingOrders: boolean): Promise<PartnerProfile> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<PartnerProfile>('/partners/my-status', {
          isAcceptingOrders,
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updateAcceptingStatus');
    }
  },

  /**
   * Get partner statistics
   */
  getStats: async (): Promise<PartnerStats> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<PartnerStats>('/partners/my-stats')
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPartnerStats');
    }
  },

  /**
   * Get partner menu
   */
  getMenu: async (): Promise<MenuItem[]> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<MenuItem[]>('/partners/my-menu')
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPartnerMenu');
    }
  },

  /**
   * Get partner reviews
   */
  getReviews: async (
    page: number = 1,
    limit: number = 10
  ): Promise<{
    reviews: any[];
    total: number;
    page: number;
    limit: number;
  }> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get('/partners/my-reviews', {
          params: { page, limit },
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPartnerReviews');
    }
  },

  /**
   * Update notification preferences
   */
  updateNotificationPreferences: async (
    preferences: Partial<NotificationPreferences>
  ): Promise<{ success: boolean; preferences: NotificationPreferences }> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch('/partners/notification-preferences', preferences)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updateNotificationPreferences');
    }
  },
};

export default partnerApi;

