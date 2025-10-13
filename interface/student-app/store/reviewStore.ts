import { create } from 'zustand';
import api from '@/utils/apiClient';
import { Review } from '@/types';
import { getErrorMessage } from '@/utils/errorHandler';

interface ReviewState {
  restaurantReviews: Review[];
  menuItemReviews: Review[];
  isLoading: boolean;
  error: string | null;

  // Restaurant reviews
  fetchRestaurantReviews: (restaurantId: string) => Promise<void>;
  
  // Menu item reviews
  fetchMenuItemReviews: (itemId: string) => Promise<void>;
  
  // Create review
  createReview: (data: {
    rating: number;
    comment?: string;
    images?: string[];
    restaurantId?: string;
    menuItemId?: string;
  }) => Promise<void>;
  
  // Mark helpful
  markHelpful: (reviewId: string) => Promise<void>;
  
  // Clear error
  clearError: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  restaurantReviews: [],
  menuItemReviews: [],
  isLoading: false,
  error: null,

  fetchRestaurantReviews: async (restaurantId: string) => {
    set({ isLoading: true, error: null });
    try {
      const reviews = await api.reviews.getRestaurantReviews(restaurantId);
      // Map backend review format to frontend format
      const mappedReviews = reviews.map((review: any) => ({
        ...review,
        id: review._id || review.id,
        user: {
          id: review.user._id || review.user.id,
          firstName: review.user.firstName,
          lastName: review.user.lastName,
          name: review.user.firstName && review.user.lastName 
            ? `${review.user.firstName} ${review.user.lastName}`
            : review.user.name,
        },
      }));
      set({ restaurantReviews: mappedReviews, isLoading: false });
      console.log('✅ ReviewStore: Fetched restaurant reviews:', mappedReviews.length);
    } catch (error) {
      console.error('❌ ReviewStore: Error fetching restaurant reviews:', error);
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  fetchMenuItemReviews: async (itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const reviews = await api.reviews.getMenuItemReviews(itemId);
      // Map backend review format to frontend format
      const mappedReviews = reviews.map((review: any) => {
        const mappedReview = {
          ...review,
          id: review._id || review.id,
          user: {
            id: review.user._id || review.user.id,
            firstName: review.user.firstName,
            lastName: review.user.lastName,
            name: review.user.firstName && review.user.lastName 
              ? `${review.user.firstName} ${review.user.lastName}`
              : review.user.name,
          },
        };
        console.log('🔍 ReviewStore: Mapped review:', { original: review, mapped: mappedReview });
        return mappedReview;
      });
      set({ menuItemReviews: mappedReviews, isLoading: false });
      console.log('✅ ReviewStore: Fetched menu item reviews:', mappedReviews.length);
    } catch (error) {
      console.error('❌ ReviewStore: Error fetching menu item reviews:', error);
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  createReview: async (data) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔍 ReviewStore: Creating review with data:', data);
      
      // Determine the correct endpoint based on review type
      let review;
      if (data.restaurantId) {
        review = await api.reviews.createReview({
          rating: data.rating,
          comment: data.comment,
          images: data.images,
          restaurantId: data.restaurantId,
        });
      } else if (data.menuItemId) {
        review = await api.reviews.createReview({
          rating: data.rating,
          comment: data.comment,
          images: data.images,
          menuItemId: data.menuItemId,
        });
      } else {
        throw new Error('Either restaurantId or menuItemId must be provided');
      }
      
      // Map backend review format to frontend format
      const mappedReview = {
        ...review,
        id: (review as any)._id || review.id,
        user: {
          id: (review.user as any)._id || review.user.id,
          firstName: (review.user as any).firstName,
          lastName: (review.user as any).lastName,
          name: (review.user as any).firstName && (review.user as any).lastName 
            ? `${(review.user as any).firstName} ${(review.user as any).lastName}`
            : review.user.name,
        },
      };
      
      // Update local state based on review type
      if (data.restaurantId) {
        set((state) => ({
          restaurantReviews: [...state.restaurantReviews, mappedReview],
          isLoading: false,
        }));
      } else if (data.menuItemId) {
        set((state) => ({
          menuItemReviews: [...state.menuItemReviews, mappedReview],
          isLoading: false,
        }));
      }
      
      console.log('✅ ReviewStore: Created review successfully:', review);
    } catch (error) {
      console.error('❌ ReviewStore: Error creating review:', error);
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },

  markHelpful: async (reviewId: string) => {
    try {
      console.log('🔍 ReviewStore: Marking review as helpful:', reviewId);
      
      if (!reviewId || reviewId === 'undefined') {
        throw new Error('Invalid review ID provided');
      }
      
      await api.reviews.markHelpful(reviewId);
      
      // Update local state
      set((state) => ({
        restaurantReviews: state.restaurantReviews.map(review =>
          review.id === reviewId
            ? { ...review, helpfulCount: review.helpfulCount + 1 }
            : review
        ),
        menuItemReviews: state.menuItemReviews.map(review =>
          review.id === reviewId
            ? { ...review, helpfulCount: review.helpfulCount + 1 }
            : review
        ),
      }));
      
      console.log('✅ ReviewStore: Marked review as helpful:', reviewId);
    } catch (error) {
      console.error('❌ ReviewStore: Error marking review helpful:', error);
      set({ error: getErrorMessage(error) });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
