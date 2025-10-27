/**
 * Analytics API Service
 * All analytics and reporting endpoints
 */

import { apiClient, handleApiError, retryRequest } from '../client';

export interface EarningsData {
  period: string;
  totalEarnings: number;
  totalOrders: number;
  averageOrderValue: number;
  commission: number;
  netEarnings: number;
  breakdown?: Array<{
    date: string;
    earnings: number;
    orders: number;
  }>;
}

export interface OrderAnalytics {
  period: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  ordersByStatus: {
    [key: string]: number;
  };
  trend?: Array<{
    date: string;
    orders: number;
  }>;
}

export interface RevenueHistory {
  months: number;
  data: Array<{
    month: string;
    revenue: number;
    orders: number;
    averageOrderValue: number;
  }>;
  totalRevenue: number;
  totalOrders: number;
}

/**
 * Analytics API Methods
 */
export const analyticsApi = {
  /**
   * Get earnings analytics
   */
  getEarnings: async (
    period: string = 'today',
    startDate?: string,
    endDate?: string
  ): Promise<EarningsData> => {
    try {
      const params: any = { period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await retryRequest(() =>
        apiClient.get<EarningsData>('/analytics/earnings', { params })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getEarnings');
    }
  },

  /**
   * Get order analytics
   */
  getOrderAnalytics: async (period: string = 'week'): Promise<OrderAnalytics> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<OrderAnalytics>('/analytics/orders', {
          params: { period },
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getOrderAnalytics');
    }
  },

  /**
   * Get revenue history
   */
  getRevenueHistory: async (months: number = 6): Promise<RevenueHistory> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<RevenueHistory>('/analytics/revenue-history', {
          params: { months },
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getRevenueHistory');
    }
  },
};

export default analyticsApi;

