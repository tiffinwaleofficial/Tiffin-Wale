/**
 * Subscription Plan API Service
 * All subscription plan management endpoints for partners
 */

import { apiClient, handleApiError, retryRequest } from '../client';

export enum DurationType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum MealFrequency {
  DAILY = 'daily',
  WEEKDAYS = 'weekdays',
  WEEKENDS = 'weekends',
  CUSTOM = 'custom',
}

/**
 * Detailed meal specification for Indian tiffin centers
 */
export interface MealSpecification {
  rotis?: number; // Number of rotis/chapatis
  sabzis?: Array<{
    name: string;
    quantity: string; // e.g., "1 bowl", "200g"
  }>;
  dal?: {
    type: string; // e.g., "Dal Fry", "Dal Tadka"
    quantity: string;
  };
  rice?: {
    quantity: string; // e.g., "1 plate", "250g"
    type?: string; // e.g., "Plain Rice", "Jeera Rice"
  };
  extras?: Array<{
    name: string; // e.g., "Pickle", "Chutney", "Papad"
    included: boolean;
    cost?: number;
  }>;
  salad?: boolean;
  curd?: boolean;
}

/**
 * Subscription Plan Interface
 */
export interface SubscriptionPlan {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  durationValue: number;
  durationType: DurationType;
  mealFrequency: MealFrequency;
  mealsPerDay: number;
  deliveryFee?: number;
  features?: string[];
  imageUrl?: string;
  images?: string[]; // Multiple images for the plan
  maxPauseCount?: number;
  maxSkipCount?: number;
  maxCustomizationsPerDay?: number;
  termsAndConditions?: string;
  isActive: boolean;
  partner?: string; // Partner ID
  // Extended fields for detailed meal specifications
  mealSpecification?: MealSpecification;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubscriptionPlanDto {
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  durationValue: number;
  durationType: DurationType;
  mealFrequency: MealFrequency;
  mealsPerDay: number;
  deliveryFee?: number;
  features?: string[];
  imageUrl?: string;
  maxPauseCount?: number;
  maxSkipCount?: number;
  maxCustomizationsPerDay?: number;
  termsAndConditions?: string;
  isActive?: boolean;
  mealSpecification?: MealSpecification;
}

/**
 * Subscription Plan API Methods
 */
export const subscriptionPlanApi = {
  /**
   * Get current partner's subscription plans
   * Note: This uses the partner profile to get partner ID, then fetches plans
   * TODO: Backend should add /partners/my-plans endpoint for consistency
   */
  getMyPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      // First get partner ID from profile, then get plans
      const profileResponse = await retryRequest(() =>
        apiClient.get<any>('/partners/profile')
      );
      // Partner profile might have partner._id or direct _id
      const partnerId = profileResponse.data._id || profileResponse.data.id || profileResponse.data.partner?._id || profileResponse.data.partner?.id;
      
      if (!partnerId) {
        throw new Error('Partner ID not found in profile');
      }
      
      const response = await retryRequest(() =>
        apiClient.get<SubscriptionPlan[]>(`/partners/${partnerId}/plans`)
      );
      return response.data || [];
    } catch (error) {
      return handleApiError(error, 'getMyPlans');
    }
  },

  /**
   * Get subscription plan by ID
   */
  getPlanById: async (id: string): Promise<SubscriptionPlan> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<SubscriptionPlan>(`/subscription-plans/${id}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getPlanById');
    }
  },

  /**
   * Create a new subscription plan
   */
  createPlan: async (plan: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> => {
    try {
      // Get partner ID from profile
      const profileResponse = await retryRequest(() =>
        apiClient.get<any>('/partners/profile')
      );
      const partnerId = profileResponse.data._id || profileResponse.data.id || profileResponse.data.partner?._id || profileResponse.data.partner?.id;
      
      const response = await retryRequest(() =>
        apiClient.post<SubscriptionPlan>('/subscription-plans', {
          ...plan,
          partner: partnerId,
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'createPlan');
    }
  },

  /**
   * Update subscription plan
   */
  updatePlan: async (id: string, plan: Partial<CreateSubscriptionPlanDto>): Promise<SubscriptionPlan> => {
    try {
      // Backend now supports mealSpecification directly, no need to encode in features
      const response = await retryRequest(() =>
        apiClient.patch<SubscriptionPlan>(`/subscription-plans/${id}`, plan)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updatePlan');
    }
  },

  /**
   * Delete subscription plan
   */
  deletePlan: async (id: string): Promise<void> => {
    try {
      await retryRequest(() =>
        apiClient.delete(`/subscription-plans/${id}`)
      );
    } catch (error) {
      return handleApiError(error, 'deletePlan');
    }
  },

  /**
   * Parse meal specification from plan
   */
  parseMealSpecification: (plan: SubscriptionPlan): MealSpecification | null => {
    // First check if mealSpecification exists directly
    if (plan.mealSpecification) {
      return plan.mealSpecification;
    }
    
    // Try to parse from features array (backward compatibility for old plans)
    if (plan.features) {
      const mealSpecFeature = plan.features.find(f => f.startsWith('MEAL_SPEC:'));
      if (mealSpecFeature) {
        try {
          const specJson = mealSpecFeature.replace('MEAL_SPEC:', '');
          return JSON.parse(specJson);
        } catch (e) {
          console.error('Failed to parse meal specification:', e);
        }
      }
    }
    
    return null;
  },
};

export default subscriptionPlanApi;

