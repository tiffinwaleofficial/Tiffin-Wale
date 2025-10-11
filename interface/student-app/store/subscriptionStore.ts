import { create } from 'zustand';
import api from '@/utils/apiClient';
import { Subscription, SubscriptionPlan } from '@/types/api';
import { getErrorMessage } from '@/utils/errorHandler';

interface SubscriptionState {
  plans: SubscriptionPlan[];
  activePlans: SubscriptionPlan[];
  userSubscriptions: Subscription[];
  currentSubscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  
  // Plan actions
  fetchPlans: () => Promise<void>;
  fetchActivePlans: () => Promise<void>;
  
  // Subscription actions
  fetchUserSubscriptions: () => Promise<void>;
  createSubscription: (planId: string, paymentMethodId?: string) => Promise<void>;
  pauseSubscription: (subscriptionId: string) => Promise<void>;
  resumeSubscription: (subscriptionId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set: any) => ({
  plans: [],
  activePlans: [],
  userSubscriptions: [],
  currentSubscription: null,
  isLoading: false,
  error: null,
  
  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const plans = await api.subscriptionPlans.getAll();
      set({ plans, isLoading: false });
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
    }
  },
  
  fetchActivePlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const activePlans = await api.subscriptionPlans.getActive();
      set({ activePlans, isLoading: false });
    } catch (error) {
      console.error('Error fetching active plans:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch active plans', 
        isLoading: false 
      });
    }
  },
  
  fetchUserSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      // Import authStore to get current user ID
      const { useAuthStore } = await import('./authStore');
      const userId = useAuthStore.getState().user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const subscriptions = await api.subscriptions.getByCustomer(userId);
      // Consider both 'active' and 'pending' subscriptions as valid
      const activeSubscription = subscriptions.find((sub: Subscription) => 
        sub.status === 'active' || sub.status === 'pending'
      ) || null;
      
      set({ 
        userSubscriptions: subscriptions,
        currentSubscription: activeSubscription,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
    }
  },
  
  createSubscription: async (planId: string, paymentMethodId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Import authStore to get current user ID
      const { useAuthStore } = await import('./authStore');
      const userId = useAuthStore.getState().user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Get the plan details to calculate end date and amount
      const plan = await api.subscriptionPlans.getById(planId);
      
      console.log('📋 Plan data received:', plan);
      
      if (!plan) {
        throw new Error('Subscription plan not found');
      }
      
      // Calculate start and end dates based on plan duration
      const startDate = new Date();
      const endDate = new Date();
      
      // Handle plan duration - use durationValue and durationType from the actual plan data
      let durationInDays = 30; // Default to 30 days
      
      if (plan.durationValue && plan.durationType) {
        if (plan.durationType === 'month') {
          durationInDays = plan.durationValue * 30;
        } else if (plan.durationType === 'day') {
          durationInDays = plan.durationValue;
        }
      } else if (plan.duration) {
        // Fallback to plan.duration if available
        durationInDays = plan.duration;
      }
      
      // Ensure we have a valid duration
      if (!durationInDays || isNaN(durationInDays) || durationInDays <= 0) {
        durationInDays = 30; // Default to 30 days
      }
      
      endDate.setDate(endDate.getDate() + durationInDays);
      
      // Validate dates before proceeding
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date calculation');
      }
      
      console.log('📅 Date calculation:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        planDuration: durationInDays,
        planDurationValue: plan.durationValue,
        planDurationType: plan.durationType,
        planDurationFallback: plan.duration,
        planData: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          discountedPrice: plan.discountedPrice
        }
      });
      
      // Prepare subscription data with all required fields
      const subscriptionData = {
        customer: userId,
        plan: planId,
        startDate: startDate,
        endDate: endDate,
        totalAmount: plan.discountedPrice || plan.price,
        autoRenew: false,
        paymentId: paymentMethodId,
        isPaid: false, // Will be set to true after payment confirmation
      };
      
      console.log('📤 Creating subscription with data:', subscriptionData);
      
      const newSubscription = await api.subscriptions.create(subscriptionData);
      
      console.log('✅ Subscription created successfully:', newSubscription);
      
      set((state: any) => ({
        userSubscriptions: [...state.userSubscriptions, newSubscription],
        currentSubscription: newSubscription,
        isLoading: false
      }));
    } catch (error) {
      console.error('❌ Error creating subscription:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create subscription', 
        isLoading: false 
      });
      throw error; // Re-throw so the UI can handle it
    }
  },
  
  pauseSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSubscription = await api.subscriptions.pause(subscriptionId);
      
      set((state: any) => ({
        userSubscriptions: state.userSubscriptions.map((sub: any) => 
          sub.id === subscriptionId ? updatedSubscription : sub
        ),
        currentSubscription: state.currentSubscription?.id === subscriptionId 
          ? updatedSubscription 
          : state.currentSubscription,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error pausing subscription:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to pause subscription', 
        isLoading: false 
      });
    }
  },
  
  resumeSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSubscription = await api.subscriptions.resume(subscriptionId);
      
      set((state: any) => ({
        userSubscriptions: state.userSubscriptions.map((sub: any) => 
          sub.id === subscriptionId ? updatedSubscription : sub
        ),
        currentSubscription: updatedSubscription,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error resuming subscription:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to resume subscription', 
        isLoading: false 
      });
    }
  },
  
  cancelSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSubscription = await api.subscriptions.cancel(subscriptionId);
      
      set((state: any) => ({
        userSubscriptions: state.userSubscriptions.map((sub: any) => 
          sub.id === subscriptionId ? updatedSubscription : sub
        ),
        currentSubscription: state.currentSubscription?.id === subscriptionId 
          ? null 
          : state.currentSubscription,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cancel subscription', 
        isLoading: false 
      });
    }
  },
})); 