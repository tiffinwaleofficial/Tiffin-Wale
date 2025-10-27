/**
 * Partner API Service
 * All partner-related API endpoints
 */

import { apiClient, handleApiError, retryRequest } from '../client';

/**
 * Partner Profile Interface
 */
export interface PartnerProfile {
  _id?: string;
  id?: string;
  userId: string;
  businessName: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
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
        apiClient.get<PartnerProfile>('/partners/me')
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
        apiClient.patch<PartnerProfile>('/partners/me', data)
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
        apiClient.patch<PartnerProfile>('/partners/status/me', {
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
        apiClient.get<PartnerStats>('/partners/stats/me')
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
        apiClient.get<MenuItem[]>('/partners/menu/me')
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
        apiClient.get('/partners/reviews/me', {
          params: { page, limit },
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPartnerReviews');
    }
  },
};

export default partnerApi;

