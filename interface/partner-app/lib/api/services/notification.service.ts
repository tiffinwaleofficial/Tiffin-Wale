/**
 * Notification Service
 * All notification-related API endpoints
 */

import { apiClient, handleApiError, retryRequest } from '../client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order_status' | 'general' | 'promotion' | 'system';
  isRead: boolean;
  data?: any;
  createdAt: string;
}

/**
 * Notification API Methods
 */
export const notificationApi = {
  /**
   * Get my notifications
   */
  getMyNotifications: async (page: number = 1, limit: number = 50): Promise<Notification[]> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<Notification[]>('/notifications/history', {
          params: { page, limit },
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMyNotifications');
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id: string): Promise<void> => {
    try {
      await retryRequest(() =>
        apiClient.patch(`/notifications/${id}/read`)
      );
    } catch (error) {
      return handleApiError(error, 'markAsRead');
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<void> => {
    try {
      // Backend doesn't have bulk mark-as-read, so we'll mark pending ones individually
      const pending = await retryRequest(() =>
        apiClient.get<Notification[]>('/notifications/pending')
      );
      if (Array.isArray(pending.data) && pending.data.length > 0) {
        await Promise.all(
          pending.data.map((notif: Notification) =>
            retryRequest(() =>
              apiClient.patch(`/notifications/${notif.id}/read`)
            )
          )
        );
      }
    } catch (error) {
      return handleApiError(error, 'markAllAsRead');
    }
  },

  /**
   * Delete notification
   */
  deleteNotification: async (id: string): Promise<void> => {
    try {
      await retryRequest(() =>
        apiClient.delete(`/notifications/${id}`)
      );
    } catch (error) {
      return handleApiError(error, 'deleteNotification');
    }
  },
};

export default notificationApi;

