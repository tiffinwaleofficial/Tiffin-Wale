import { create } from 'zustand';
import { api } from '../lib/api';
import type { Notification } from '../lib/api/services/notification.service';
import { NotificationType } from '../types/partner';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearError: () => void;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const useNotificationStore = create<NotificationState & NotificationActions>()((set, get) => ({
  ...initialState,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const notifications = await api.notifications.getMyNotifications();
      const unreadCount = notifications.filter(n => !n.isRead).length;
      
      set({
        notifications,
        unreadCount,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Fetch notifications error:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch notifications',
      });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification =>
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      );
      
      const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
      
      set({
        notifications: updatedNotifications,
        unreadCount,
      });
    } catch (error: any) {
      console.error('Mark notification as read error:', error);
      set({
        error: error.response?.data?.message || 'Failed to mark notification as read',
      });
    }
  },

  markAllAsRead: async () => {
    try {
      await api.notifications.markAllAsRead();
      
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true,
      }));
      
      set({
        notifications: updatedNotifications,
        unreadCount: 0,
      });
    } catch (error: any) {
      console.error('Mark all notifications as read error:', error);
      set({
        error: error.response?.data?.message || 'Failed to mark all notifications as read',
      });
    }
  },

  addNotification: (notification: Notification) => {
    const { notifications, unreadCount } = get();
    set({
      notifications: [notification, ...notifications],
      unreadCount: notification.isRead ? unreadCount : unreadCount + 1,
    });
  },

  removeNotification: (id: string) => {
    const { notifications } = get();
    const notificationToRemove = notifications.find(n => n.id === id);
    const updatedNotifications = notifications.filter(n => n.id !== id);
    
    set({
      notifications: updatedNotifications,
      unreadCount: notificationToRemove && !notificationToRemove.isRead 
        ? get().unreadCount - 1 
        : get().unreadCount,
    });
  },

  clearError: () => set({ error: null }),
}));

export default useNotificationStore; 