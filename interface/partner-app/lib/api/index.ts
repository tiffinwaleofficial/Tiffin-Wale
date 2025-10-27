/**
 * Unified API Export
 * Single entry point for all API services
 */

import { authApi } from './services/auth.service';
import { partnerApi } from './services/partner.service';
import { orderApi } from './services/order.service';
import { notificationApi } from './services/notification.service';
import { menuApi } from './services/menu.service';
import { reviewApi } from './services/review.service';
import { analyticsApi } from './services/analytics.service';
import { uploadApi } from './services/upload.service';

/**
 * Unified API Object
 * Use this for all API calls throughout the app
 * 
 * @example
 * ```typescript
 * import { api } from '@/lib/api';
 * 
 * // Auth
 * await api.auth.loginWithPhone(phone, uid);
 * 
 * // Partner
 * const profile = await api.partner.getCurrentProfile();
 * 
 * // Orders
 * const orders = await api.orders.getMyOrders();
 * 
 * // Notifications
 * const notifications = await api.notifications.getMyNotifications();
 * 
 * // Menu
 * const menu = await api.menu.getMyMenu();
 * 
 * // Reviews
 * const reviews = await api.reviews.getMyReviews();
 * 
 * // Analytics
 * const earnings = await api.analytics.getEarnings('today');
 * 
 * // Upload
 * const result = await api.upload.uploadImage(file, 'menu');
 * ```
 */
export const api = {
  auth: authApi,
  partner: partnerApi,
  orders: orderApi,
  notifications: notificationApi,
  menu: menuApi,
  reviews: reviewApi,
  analytics: analyticsApi,
  upload: uploadApi,
};

// Export individual services for direct access if needed
export { authApi } from './services/auth.service';
export { partnerApi } from './services/partner.service';
export { orderApi } from './services/order.service';
export { notificationApi } from './services/notification.service';
export { menuApi } from './services/menu.service';
export { reviewApi } from './services/review.service';
export { analyticsApi } from './services/analytics.service';
export { uploadApi } from './services/upload.service';

// Export types
export type {
  RegisterPartnerData,
  LoginResponse,
  TokenRefreshResponse,
} from './services/auth.service';

export type {
  PartnerProfile,
  PartnerStats,
} from './services/partner.service';

export type {
  Order,
  OrderItem,
  OrderStatus,
  OrderFilter,
  OrdersResponse,
  TodayOrdersResponse,
} from './services/order.service';

export type {
  Notification,
} from './services/notification.service';

export type {
  MenuItem,
  MenuCategory,
} from './services/menu.service';

export type {
  Review,
  ReviewResponse,
} from './services/review.service';

export type {
  EarningsData,
  OrderAnalytics,
  RevenueHistory,
} from './services/analytics.service';

export type {
  UploadResponse,
  UploadType,
} from './services/upload.service';

// Export client utilities
export { apiClient, handleApiError, retryRequest, isNetworkError, isAuthError, isServerError } from './client';

export default api;

