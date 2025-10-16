import { create } from 'zustand';
import { Order, OrderCreateData } from '@/types/api';
import api from '@/utils/apiClient';
import { i18n } from '@/i18n/config';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: OrderCreateData) => Promise<Order | null>;
  addReview: (orderId: string, rating: number, comment: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set: any) => ({
  orders: [],
  isLoading: false,
  error: null,
  
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await api.orders.getByCustomer();
      set({ 
        orders,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ 
        error: error instanceof Error ? error.message : i18n.t('orders:failedToFetchOrders'), 
        isLoading: false 
      });
    }
  },

  createOrder: async (orderData: OrderCreateData) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await api.orders.create(orderData);
      set((state: any) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false,
      }));
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      set({
        error: error instanceof Error ? error.message : i18n.t('orders:failedToCreateOrder'),
        isLoading: false,
      });
      return null;
    }
  },

  addReview: async (orderId: string, rating: number, comment: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.orders.addReview(orderId, rating, comment);
      set({ isLoading: false });
    } catch (error) {
      console.error('Error adding review:', error);
      set({
        error: error instanceof Error ? error.message : i18n.t('orders:failedToAddReview'),
        isLoading: false,
      });
    }
  },
})); 