import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/apiClient';
import { Order, OrderStatus, OrdersResponse, OrderFilter, OrderStats } from '../types/order';

interface OrderState {
  // Order data
  orders: Order[];
  todayOrders: Order[];
  currentOrder: Order | null;
  stats: OrderStats | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  
  // Filters
  activeFilter: OrderFilter;
  
  // UI State
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Today's statistics
  todayStats: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  } | null;
}

interface OrderActions {
  // Data fetching
  fetchOrders: (page?: number, filters?: OrderFilter) => Promise<void>;
  fetchTodayOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  fetchOrderStats: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  
  // Order management
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  markOrderReady: (orderId: string) => Promise<void>;
  startPreparingOrder: (orderId: string) => Promise<void>;
  
  // Filters and pagination
  setFilter: (filter: Partial<OrderFilter>) => void;
  clearFilters: () => void;
  loadNextPage: () => Promise<void>;
  loadPrevPage: () => Promise<void>;
  
  // UI State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearCurrentOrder: () => void;
}

const initialState: OrderState = {
  orders: [],
  todayOrders: [],
  currentOrder: null,
  stats: null,
  currentPage: 1,
  totalPages: 1,
  totalOrders: 0,
  hasNextPage: false,
  hasPrevPage: false,
  activeFilter: {},
  isLoading: false,
  isRefreshing: false,
  error: null,
  todayStats: null,
};

export const useOrderStore = create<OrderState & OrderActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Data fetching
      fetchOrders: async (page = 1, filters = {}) => {
        try {
          set({ isLoading: page === 1, error: null });
          
          const mergedFilters = { ...get().activeFilter, ...filters };
          const response = await api.orders.getMyOrders(page, 10, mergedFilters.status);
          
          set({
            orders: page === 1 ? response.orders : [...get().orders, ...response.orders],
            currentPage: response.page,
            totalPages: Math.ceil(response.total / response.limit),
            totalOrders: response.total,
            hasNextPage: response.page < Math.ceil(response.total / response.limit),
            hasPrevPage: response.page > 1,
            activeFilter: mergedFilters,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Fetch orders error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch orders',
          });
        }
      },

      fetchTodayOrders: async () => {
        try {
          const orders = await api.orders.getTodayOrders();
          set({ todayOrders: orders });
        } catch (error: any) {
          console.error('Fetch today orders error:', error);
          // Don't set error for background fetches
        }
      },

      fetchOrderById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const order = await api.orders.getOrderById(id);
          set({
            currentOrder: order,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Fetch order by ID error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch order details',
          });
        }
      },

      fetchOrderStats: async () => {
        try {
          // Note: We'll need to implement this endpoint
          // For now, calculate stats from existing orders
          const { orders, todayOrders } = get();
          
          const stats: OrderStats = {
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === 'PENDING').length,
            inProgressOrders: orders.filter(o => ['CONFIRMED', 'PREPARING'].includes(o.status)).length,
            completedOrders: orders.filter(o => o.status === 'DELIVERED').length,
            cancelledOrders: orders.filter(o => o.status === 'CANCELLED').length,
            todayOrders: todayOrders.length,
            thisWeekOrders: 0, // Will be calculated from API
            thisMonthOrders: 0, // Will be calculated from API
          };
          
          set({ stats });
        } catch (error: any) {
          console.error('Fetch order stats error:', error);
        }
      },

      refreshOrders: async () => {
        try {
          set({ isRefreshing: true });
          await get().fetchOrders(1, get().activeFilter);
          await get().fetchTodayOrders();
          await get().fetchOrderStats();
          set({ isRefreshing: false });
        } catch (error) {
          set({ isRefreshing: false });
        }
      },

      // Order management
      updateOrderStatus: async (orderId: string, status: OrderStatus) => {
        try {
          const updatedOrder = await api.orders.updateOrderStatus(orderId, status);
          
          // Update order in state
          const { orders, todayOrders, currentOrder } = get();
          
          set({
            orders: orders.map(order => 
              order.id === orderId ? updatedOrder : order
            ),
            todayOrders: todayOrders.map(order => 
              order.id === orderId ? updatedOrder : order
            ),
            currentOrder: currentOrder?.id === orderId ? updatedOrder : currentOrder,
          });
          
          // Refresh stats
          await get().fetchOrderStats();
        } catch (error: any) {
          console.error('Update order status error:', error);
          set({
            error: error.response?.data?.message || 'Failed to update order status',
          });
          throw error;
        }
      },

      markOrderReady: async (orderId: string) => {
        await get().updateOrderStatus(orderId, 'READY');
      },

      startPreparingOrder: async (orderId: string) => {
        await get().updateOrderStatus(orderId, 'PREPARING');
      },

      // Filters and pagination
      setFilter: (filter: Partial<OrderFilter>) => {
        const newFilter = { ...get().activeFilter, ...filter };
        set({ activeFilter: newFilter });
        // Auto-refresh with new filter
        get().fetchOrders(1, newFilter);
      },

      clearFilters: () => {
        set({ activeFilter: {} });
        get().fetchOrders(1, {});
      },

      loadNextPage: async () => {
        const { currentPage, hasNextPage, isLoading } = get();
        if (hasNextPage && !isLoading) {
          await get().fetchOrders(currentPage + 1);
        }
      },

      loadPrevPage: async () => {
        const { currentPage, hasPrevPage, isLoading } = get();
        if (hasPrevPage && !isLoading && currentPage > 1) {
          await get().fetchOrders(currentPage - 1);
        }
      },

      // UI State management
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      clearCurrentOrder: () => set({ currentOrder: null }),
    }),
    {
      name: 'partner-order-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential data, not loading/error states
      partialize: (state) => ({
        orders: state.orders,
        todayOrders: state.todayOrders,
        currentPage: state.currentPage,
        totalOrders: state.totalOrders,
        activeFilter: state.activeFilter,
        stats: state.stats,
        todayStats: state.todayStats,
      }),
    }
  )
);

export default useOrderStore; 