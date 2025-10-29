/**
 * Review API Service
 * All review-related endpoints
 */

import { apiClient, handleApiError, retryRequest } from '../client';

export interface Review {
  id?: string;
  _id?: string;
  userId: string;
  restaurantId?: string;
  menuItemId?: string;
  rating: number;
  comment: string;
  isVerifiedPurchase?: boolean;
  isHelpful?: number;
  partnerResponse?: string;
  partnerResponseDate?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

export interface ReviewResponse {
  reviews: Review[];
  total?: number;
  page?: number;
  limit?: number;
  averageRating?: number;
}

/**
 * Review API Methods
 */
export const reviewApi = {
  /**
   * Get current partner's reviews
   */
  getMyReviews: async (page: number = 1, limit: number = 10): Promise<ReviewResponse> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<ReviewResponse>('/partners/my-reviews', {
          params: { page, limit },
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMyReviews');
    }
  },

  /**
   * Get reviews for a specific partner/restaurant
   */
  getPartnerReviews: async (partnerId: string): Promise<ReviewResponse> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<ReviewResponse>(`/reviews/restaurant/${partnerId}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPartnerReviews');
    }
  },

  /**
   * Get reviews for a specific menu item
   */
  getMenuItemReviews: async (menuItemId: string): Promise<ReviewResponse> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<ReviewResponse>(`/reviews/menu-item/${menuItemId}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMenuItemReviews');
    }
  },

  /**
   * Create review for restaurant
   */
  createRestaurantReview: async (
    restaurantId: string,
    data: { rating: number; comment: string }
  ): Promise<Review> => {
    try {
      const response = await retryRequest(() =>
        apiClient.post<Review>(`/reviews/restaurant/${restaurantId}`, data)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'createRestaurantReview');
    }
  },

  /**
   * Create review for menu item
   */
  createMenuItemReview: async (
    menuItemId: string,
    data: { rating: number; comment: string }
  ): Promise<Review> => {
    try {
      const response = await retryRequest(() =>
        apiClient.post<Review>(`/reviews/menu-item/${menuItemId}`, data)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'createMenuItemReview');
    }
  },

  /**
   * Reply to a review (partner only)
   */
  replyToReview: async (reviewId: string, response: string): Promise<Review> => {
    try {
      const result = await retryRequest(() =>
        apiClient.post<Review>(`/reviews/${reviewId}/reply`, { response })
      );
      return result.data;
    } catch (error) {
      return handleApiError(error, 'replyToReview');
    }
  },

  /**
   * Respond to a review (deprecated - use replyToReview)
   */
  respondToReview: async (
    reviewId: string,
    response: { partnerResponse: string }
  ): Promise<Review> => {
    return reviewApi.replyToReview(reviewId, response.partnerResponse);
  },

  /**
   * Mark review as helpful
   */
  markHelpful: async (reviewId: string): Promise<Review> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<Review>(`/reviews/${reviewId}/helpful`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'markHelpful');
    }
  },

  /**
   * Delete review
   */
  deleteReview: async (reviewId: string): Promise<void> => {
    try {
      await retryRequest(() =>
        apiClient.delete(`/reviews/${reviewId}`)
      );
    } catch (error) {
      return handleApiError(error, 'deleteReview');
    }
  },
};

export default reviewApi;

