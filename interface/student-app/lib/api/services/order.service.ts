/**
 * Order API Service
 * All order-related API endpoints
 */

import { apiClient, handleApiError, retryRequest } from '../client';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface Order {
  _id: string;
  customer: string | {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  businessPartner: string | {
    _id: string;
    businessName: string;
    logoUrl?: string;
    phoneNumber?: string;
  };
  subscription?: string;
  subscriptionPlan?: string | {
    _id: string;
    name: string;
    imageUrl?: string;
  };
  status: OrderStatus;
  orderDate: string;
  deliveryDate: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  mealType?: 'breakfast' | 'lunch' | 'dinner';
  deliverySlot?: 'morning' | 'afternoon' | 'evening';
  deliveryTimeRange?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  specialInstructions?: string;
  rating?: number;
  review?: string;
  preparedAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  businessPartner: string;
  subscriptionPlan?: string;
  deliveryDate: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  mealType?: 'breakfast' | 'lunch' | 'dinner';
  deliverySlot?: 'morning' | 'afternoon' | 'evening';
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod?: string;
  specialInstructions?: string;
}

export const orderApi = {
  /**
   * Get all orders for current user
   */
  getMyOrders: async (status?: OrderStatus): Promise<Order[]> => {
    try {
      const params: any = {};
      if (status) params.status = status;
      
      const response = await retryRequest(() =>
        apiClient.get<Order[]>('/orders/customer/my-orders', { params })
      );
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'getMyOrders');
    }
  },

  /**
   * Get today's orders (client-side filtered)
   */
  getTodaysOrders: async (): Promise<Order[]> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<Order[]>('/orders/customer/my-orders')
      );
      
      // Filter for today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return response.data.filter((order) => {
        const deliveryDate = new Date(order.deliveryDate);
        return deliveryDate >= today && deliveryDate < tomorrow;
      });
    } catch (error: any) {
      return handleApiError(error, 'getTodaysOrders');
    }
  },

  /**
   * Get upcoming orders (client-side filtered)
   */
  getUpcomingOrders: async (): Promise<Order[]> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<Order[]>('/orders/customer/my-orders')
      );
      
      // Filter for future orders (after today)
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return response.data.filter((order) => {
        const deliveryDate = new Date(order.deliveryDate);
        return deliveryDate >= tomorrow;
      }).sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());
    } catch (error: any) {
      return handleApiError(error, 'getUpcomingOrders');
    }
  },

  /**
   * Get past orders (client-side filtered and paginated)
   */
  getPastOrders: async (page = 1, limit = 10): Promise<{ orders: Order[]; total: number }> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<Order[]>('/orders/customer/my-orders')
      );
      
      // Filter for past orders (before today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const pastOrders = response.data.filter((order) => {
        const deliveryDate = new Date(order.deliveryDate);
        return deliveryDate < today || order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED;
      }).sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime());
      
      // Client-side pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        orders: pastOrders.slice(startIndex, endIndex),
        total: pastOrders.length,
      };
    } catch (error: any) {
      return handleApiError(error, 'getPastOrders');
    }
  },

  /**
   * Get order by ID
   */
  getOrderById: async (orderId: string): Promise<Order> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<Order>(`/orders/${orderId}`)
      );
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'getOrderById');
    }
  },

  /**
   * Create a new order (one-time meal)
   */
  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    try {
      const response = await retryRequest(() =>
        apiClient.post<Order>('/orders', data)
      );
      console.log('✅ Order created successfully');
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'createOrder');
    }
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (orderId: string, reason?: string): Promise<Order> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<Order>(`/orders/${orderId}/cancel`, {
          cancellationReason: reason,
        })
      );
      console.log('✅ Order cancelled');
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'cancelOrder');
    }
  },

  /**
   * Rate and review an order
   */
  rateOrder: async (orderId: string, rating: number, review?: string): Promise<Order> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<Order>(`/orders/${orderId}/rate`, {
          rating,
          review,
        })
      );
      console.log('✅ Order rated successfully');
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'rateOrder');
    }
  },

  /**
   * Track order real-time status
   */
  trackOrder: async (orderId: string): Promise<Order> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<Order>(`/orders/${orderId}/track`)
      );
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'trackOrder');
    }
  },
};

