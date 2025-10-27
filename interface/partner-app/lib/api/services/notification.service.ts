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
  getMyNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<Notification[]>('/notifications/me')
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
      await retryRequest(() =>
        apiClient.patch('/notifications/me/read-all')
      );
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

