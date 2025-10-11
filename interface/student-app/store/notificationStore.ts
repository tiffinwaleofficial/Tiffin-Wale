import { create } from 'zustand';
import api from '@/utils/apiClient';
import { useRealtimeStore } from './realtimeStore';

interface OrderUpdateData {
  orderId: string;
  status: string;
  [key: string]: unknown;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'order_update';
  read: boolean;
  date: string;
  actionLink?: string;
  orderId?: string;
  metadata?: Record<string, unknown>;
}

interface NotificationData {
  id?: string;
  title?: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error' | 'order_update';
  date?: string;
  actionLink?: string;
  orderId?: string;
  metadata?: Record<string, unknown>;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  orderStatusEventSources: Map<string, EventSource>;
  websocketSubscriptions: Map<string, string>; // orderId -> subscriptionId
  
  // Actions
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  subscribeToOrderUpdates: (orderId: string) => void;
  unsubscribeFromOrderUpdates: (orderId: string) => void;
  subscribeToWebSocketNotifications: () => void;
  unsubscribeFromWebSocketNotifications: () => void;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  orderStatusEventSources: new Map(),
  websocketSubscriptions: new Map(),
  
  fetchNotifications: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await api.notifications.getUserNotifications(userId) as unknown as Notification[];
      const unreadCount = notifications.filter((n: Notification) => !n.read).length;
      
      set({ 
        notifications,
        unreadCount,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch notifications', 
        isLoading: false 
      });
    }
  },
  
  markAsRead: async (notificationId: string) => {
    try {
      await api.notifications.markAsRead(notificationId);
      
      set(state => {
        const updatedNotifications = state.notifications.map(notification =>
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        );
        
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount
        };
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark notification as read'
      });
    }
  },
  
  markAllAsRead: async () => {
    const { notifications } = get();
    
    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(n => !n.read);
      
      await Promise.all(
        unreadNotifications.map(notification => 
          api.notifications.markAsRead(notification.id)
        )
      );
      
      set(state => ({
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true
        })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
      });
    }
  },
  
  addNotification: (notification: Notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1
    }));
  },
  
  subscribeToOrderUpdates: (orderId: string) => {
    const { orderStatusEventSources, websocketSubscriptions } = get();
    
    // Don't create duplicate subscriptions
    if (orderStatusEventSources.has(orderId) || websocketSubscriptions.has(orderId)) {
      return;
    }
    
    // Try WebSocket first, fallback to SSE
    const realtimeStore = useRealtimeStore.getState();
    if (realtimeStore.isConnected) {
      // Use WebSocket for real-time updates
      const subscriptionId = realtimeStore.subscribe(`order_${orderId}`, (data: Record<string, unknown>) => {
        const orderData = data as OrderUpdateData;
        const notification: Notification = {
          id: `order_${orderId}_${Date.now()}`,
          title: 'Order Status Update',
          message: `Your order status has been updated to: ${orderData.status}`,
          type: 'order_update',
          read: false,
          date: new Date().toISOString(),
          orderId: orderData.orderId,
          metadata: orderData
        };
        
        get().addNotification(notification);
      });
      
      websocketSubscriptions.set(orderId, subscriptionId);
      set({ websocketSubscriptions: new Map(websocketSubscriptions) });
    } else {
      // Fallback to SSE
      try {
        const eventSource = api.notifications.getOrderStatusUpdates(orderId);
        
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Create a notification for the order status update
            const notification: Notification = {
              id: `order_${orderId}_${Date.now()}`,
              title: 'Order Status Update',
              message: `Your order status has been updated to: ${data.status}`,
              type: 'order_update',
              read: false,
              date: new Date().toISOString(),
              orderId: data.orderId,
              metadata: data
            };
            
            get().addNotification(notification);
          } catch (error) {
            console.error('Error parsing SSE data:', error);
          }
        };
        
        eventSource.onerror = (error) => {
          console.error('SSE error for order', orderId, error);
          // Remove the event source on error
          get().unsubscribeFromOrderUpdates(orderId);
        };
        
        // Store the event source
        orderStatusEventSources.set(orderId, eventSource);
        set({ orderStatusEventSources: new Map(orderStatusEventSources) });
        
      } catch (error) {
        console.error('Error subscribing to order updates:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to subscribe to order updates'
        });
      }
    }
  },
  
  unsubscribeFromOrderUpdates: (orderId: string) => {
    const { orderStatusEventSources, websocketSubscriptions } = get();
    
    // Unsubscribe from WebSocket if exists
    const websocketSubscriptionId = websocketSubscriptions.get(orderId);
    if (websocketSubscriptionId) {
      const realtimeStore = useRealtimeStore.getState();
      realtimeStore.unsubscribe(websocketSubscriptionId);
      websocketSubscriptions.delete(orderId);
      set({ websocketSubscriptions: new Map(websocketSubscriptions) });
    }
    
    // Unsubscribe from SSE if exists
    const eventSource = orderStatusEventSources.get(orderId);
    if (eventSource) {
      eventSource.close();
      orderStatusEventSources.delete(orderId);
      set({ orderStatusEventSources: new Map(orderStatusEventSources) });
    }
  },
  
  subscribeToWebSocketNotifications: () => {
    const realtimeStore = useRealtimeStore.getState();
    if (!realtimeStore.isConnected) {
      console.warn('WebSocket not connected, cannot subscribe to notifications');
      return;
    }
    
    // Subscribe to general notifications
    realtimeStore.subscribe('notifications', (data: NotificationData) => {
      const notification: Notification = {
        id: data.id || `notification_${Date.now()}`,
        title: data.title || 'New Notification',
        message: data.message || '',
        type: data.type || 'info',
        read: false,
        date: data.date || new Date().toISOString(),
        actionLink: data.actionLink,
        orderId: data.orderId,
        metadata: data.metadata
      };
      
      get().addNotification(notification);
    });
  },
  
  unsubscribeFromWebSocketNotifications: () => {
    const realtimeStore = useRealtimeStore.getState();
    realtimeStore.unsubscribeChannel('notifications');
  },
  
  clearError: () => {
    set({ error: null });
  },
})); 