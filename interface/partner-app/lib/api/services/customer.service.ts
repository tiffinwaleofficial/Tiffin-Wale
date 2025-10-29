/**
 * Customer API Service
 * Endpoints for managing partner's customers
 */

import { apiClient, handleApiError, retryRequest } from '../client';
import type { Customer } from '../../../components/CustomerCard';

export interface CustomerProfileDetail extends Customer {
  subscription: {
    status: string;
    startDate: string;
    endDate: string;
    autoRenew: boolean;
    paymentFrequency: string;
    nextRenewalDate?: string;
  };
  orders: any[]; // Last 10 orders
}

export interface CustomerOrdersResponse {
  orders: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export const customerApi = {
  /**
   * Get all customers subscribed to current partner
   */
  getMyCustomers: async (status?: 'active' | 'paused' | 'cancelled'): Promise<Customer[]> => {
    try {
      const params: any = {};
      if (status) {
        params.status = status;
      }

      const response = await retryRequest(() =>
        apiClient.get<Customer[]>('/partners/my-customers', { params })
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch customers');
      return [];
    }
  },

  /**
   * Get specific customer profile
   */
  getCustomerProfile: async (customerId: string): Promise<CustomerProfileDetail> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<CustomerProfileDetail>(`/partners/customers/${customerId}`)
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch customer profile');
      throw error;
    }
  },

  /**
   * Get customer order history
   */
  getCustomerOrders: async (
    customerId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<CustomerOrdersResponse> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<CustomerOrdersResponse>(`/partners/customers/${customerId}/orders`, {
          params: { page, limit },
        })
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch customer orders');
      throw error;
    }
  },

  /**
   * Get customer subscription details
   */
  getCustomerSubscription: async (customerId: string): Promise<any> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get(`/partners/customers/${customerId}/subscription`)
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch customer subscription');
      throw error;
    }
  },
};

export default customerApi;

