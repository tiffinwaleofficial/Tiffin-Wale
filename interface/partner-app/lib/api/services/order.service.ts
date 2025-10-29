/**
 * Order API Service
 * All order-related API endpoints
 */

import { apiClient, handleApiError, retryRequest } from '../client';

/**
 * Order Interface
 */
export interface Order {
  _id?: string;
  id?: string;
  orderNumber?: string;
  partnerId: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: string;
  deliveryAddress?: any;
  deliveryTime?: string;
  estimatedDeliveryTime?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

/**
 * Order Item Interface
 */
export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  customizations?: any;
}

/**
 * Order Status Type
 */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'delivered'
  | 'cancelled'
  | 'rejected';

/**
 * Order Filter Interface
 */
export interface OrderFilter {
  status?: OrderStatus;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Orders Response Interface
 */
export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Today's Orders Response Interface
 */
export interface TodayOrdersResponse {
  orders: Order[];
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    preparing: number;
    ready: number;
    completed: number;
    cancelled: number;
  };
}

/**
 * Production Summary Interface
 */
export interface ProductionSummary {
  date: string;
  totalOrders: number;
  completionPercentage: number;
  mealBreakdown: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
  ingredientTotals: {
    rotis: number;
    sabzis: Record<string, number>;
    dal: {
      total: number;
      types: Record<string, number>;
    };
    rice: {
      total: number;
      types: Record<string, number>;
    };
    extras: Record<string, number>;
    salad: number;
    curd: number;
  };
  planBreakdown: Record<string, { count: number; orders: string[] }>;
  statusBreakdown: {
    pending: number;
    preparing: number;
    ready: number;
    outForDelivery: number;
    delivered: number;
  };
}

/**
 * Order API Methods
 */
export const orderApi = {
  /**
   * Get partner orders with pagination and filters
   */
  getMyOrders: async (
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus
  ): Promise<OrdersResponse> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<OrdersResponse>('/partners/my-orders', {
          params: { page, limit, status },
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMyOrders');
    }
  },

  /**
   * Get today's orders
   */
  getTodayOrders: async (): Promise<TodayOrdersResponse> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<TodayOrdersResponse>('/partners/my-orders/today')
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getTodayOrders');
    }
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<Order>(`/orders/${id}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getOrderById');
    }
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<Order>(`/orders/${id}/status`, { status })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updateOrderStatus');
    }
  },

  /**
   * Accept order
   */
  acceptOrder: async (
    id: string,
    data?: { estimatedTime?: number; message?: string }
  ): Promise<Order> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<Order>(`/orders/${id}/accept`, data || {})
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'acceptOrder');
    }
  },

  /**
   * Reject order
   */
  rejectOrder: async (
    id: string,
    data: { reason: string; message?: string }
  ): Promise<Order> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<Order>(`/orders/${id}/reject`, data)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'rejectOrder');
    }
  },

  /**
   * Mark order as ready
   */
  markOrderReady: async (
    id: string,
    data?: { estimatedPickupTime?: number; message?: string }
  ): Promise<Order> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<Order>(`/orders/${id}/ready`, data || {})
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'markOrderReady');
    }
  },

  /**
   * Get production summary for a date
   */
  getProductionSummary: async (date?: string): Promise<ProductionSummary> => {
    try {
      const params: any = {};
      if (date) {
        params.date = date;
      }

      const response = await retryRequest(() =>
        apiClient.get<ProductionSummary>('/partners/production-summary', { params })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getProductionSummary');
    }
  },

  /**
   * Get order details
   */
  getOrderDetails: async (orderId: string): Promise<Order> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<Order>(`/orders/${orderId}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getOrderDetails');
    }
  },
};

export default orderApi;


