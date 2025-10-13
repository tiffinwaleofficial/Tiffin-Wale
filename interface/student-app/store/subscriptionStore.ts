import { create } from 'zustand';
import { Subscription, Plan } from '@/types';
import api from '@/utils/apiClient';
import { getErrorMessage } from '@/utils/errorHandler';

interface SubscriptionState {
  // Data
  currentSubscription: Subscription | null;
  allSubscriptions: Subscription[];
  availablePlans: Plan[];
  
  // Loading states
  isLoading: boolean;
  isLoadingPlans: boolean;
  error: string | null;
  
  // Cache management
  lastFetched: Date | null;
  lastPlansFetched: Date | null;
  
  // Actions
  fetchCurrentSubscription: (forceRefresh?: boolean) => Promise<void>;
  fetchAllSubscriptions: (forceRefresh?: boolean) => Promise<void>;
  fetchAvailablePlans: (forceRefresh?: boolean) => Promise<void>;
  createSubscription: (planId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string, reason: string) => Promise<void>;
  pauseSubscription: (subscriptionId: string) => Promise<void>;
  resumeSubscription: (subscriptionId: string) => Promise<void>;
  refreshSubscriptionData: () => Promise<void>;
  clearError: () => void;
}

const CACHE_DURATION = 1 * 60 * 1000; // 1 minute (reduced for better freshness)

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  // Initial state
  currentSubscription: null,
  allSubscriptions: [],
  availablePlans: [],
  isLoading: false,
  isLoadingPlans: false,
  error: null,
  lastFetched: null,
  lastPlansFetched: null,

  fetchCurrentSubscription: async (forceRefresh = false) => {
    const { lastFetched, isLoading } = get();
    
    // Check cache validity
    if (!forceRefresh && lastFetched && isLoading) {
      console.log('🔄 SubscriptionStore: Already fetching current subscription');
      return;
    }
    
    if (!forceRefresh && lastFetched && Date.now() - lastFetched.getTime() < CACHE_DURATION) {
      console.log('📦 SubscriptionStore: Using cached current subscription');
      return;
    }

    set({ isLoading: true, error: null });
    try {
      console.log('🔔 SubscriptionStore: Fetching current subscription...');
      
      const currentSubscription = await api.subscriptions.getCurrent();
      console.log('✅ SubscriptionStore: Current subscription fetched:', currentSubscription);
      
      set({ 
        currentSubscription,
        isLoading: false,
        lastFetched: new Date(),
      });
    } catch (error) {
      console.error('❌ SubscriptionStore: Error fetching current subscription:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoading: false 
      });
    }
  },

  fetchAllSubscriptions: async (forceRefresh = false) => {
    const { lastFetched, isLoading } = get();
    
    // Check cache validity
    if (!forceRefresh && lastFetched && isLoading) {
      console.log('🔄 SubscriptionStore: Already fetching all subscriptions');
      return;
    }
    
    if (!forceRefresh && lastFetched && Date.now() - lastFetched.getTime() < CACHE_DURATION) {
      console.log('📦 SubscriptionStore: Using cached all subscriptions');
      return;
    }

    set({ isLoading: true, error: null });
    try {
      console.log('🔔 SubscriptionStore: Fetching all subscriptions...');
      
      const allSubscriptions = await api.subscriptions.getAll();
      console.log('✅ SubscriptionStore: All subscriptions fetched:', allSubscriptions);
      
      // Find current active subscription from all subscriptions
      const currentSubscription = allSubscriptions.find(
        (sub: Subscription) => sub.status === 'active' || sub.status === 'pending'
      ) || null;
      
      set({ 
        allSubscriptions,
        currentSubscription,
        isLoading: false,
        lastFetched: new Date(),
      });
    } catch (error) {
      console.error('❌ SubscriptionStore: Error fetching all subscriptions:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoading: false 
      });
    }
  },

  fetchAvailablePlans: async (forceRefresh = false) => {
    const { lastPlansFetched, isLoadingPlans } = get();
    
    // Check cache validity
    if (!forceRefresh && lastPlansFetched && isLoadingPlans) {
      console.log('🔄 SubscriptionStore: Already fetching available plans');
      return;
    }
    
    if (!forceRefresh && lastPlansFetched && Date.now() - lastPlansFetched.getTime() < CACHE_DURATION) {
      console.log('📦 SubscriptionStore: Using cached available plans');
      return;
    }

    set({ isLoadingPlans: true, error: null });
    try {
      console.log('🔔 SubscriptionStore: Fetching available plans...');
      
      // Use the existing subscription plan API
      const availablePlans = await api.subscriptionPlans.getAll();
      console.log('✅ SubscriptionStore: Available plans fetched:', availablePlans);
      
      set({ 
        availablePlans,
        isLoadingPlans: false,
        lastPlansFetched: new Date(),
      });
    } catch (error) {
      console.error('❌ SubscriptionStore: Error fetching available plans:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoadingPlans: false 
      });
    }
  },

  createSubscription: async (planId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔔 SubscriptionStore: Creating subscription for plan:', planId);
      
      const newSubscription = await api.subscriptions.create(planId);
      console.log('✅ SubscriptionStore: Subscription created:', newSubscription);
      
      // Refresh data after creation
      await get().refreshSubscriptionData();
    } catch (error) {
      console.error('❌ SubscriptionStore: Error creating subscription:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoading: false 
      });
      throw error; // Re-throw for UI handling
    }
  },

  cancelSubscription: async (subscriptionId: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔔 SubscriptionStore: Cancelling subscription:', subscriptionId);
      
      await api.subscriptions.cancel(subscriptionId, reason);
      console.log('✅ SubscriptionStore: Subscription cancelled');
      
      // Refresh data after cancellation
      await get().refreshSubscriptionData();
    } catch (error) {
      console.error('❌ SubscriptionStore: Error cancelling subscription:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoading: false 
      });
    }
  },

  pauseSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔔 SubscriptionStore: Pausing subscription:', subscriptionId);
      
      await api.subscriptions.pause(subscriptionId);
      console.log('✅ SubscriptionStore: Subscription paused');
      
      // Refresh data after pausing
      await get().refreshSubscriptionData();
    } catch (error) {
      console.error('❌ SubscriptionStore: Error pausing subscription:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoading: false 
      });
    }
  },

  resumeSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔔 SubscriptionStore: Resuming subscription:', subscriptionId);
      
      await api.subscriptions.resume(subscriptionId);
      console.log('✅ SubscriptionStore: Subscription resumed');
      
      // Refresh data after resuming
      await get().refreshSubscriptionData();
    } catch (error) {
      console.error('❌ SubscriptionStore: Error resuming subscription:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoading: false 
      });
    }
  },

  refreshSubscriptionData: async () => {
    console.log('🔄 SubscriptionStore: Refreshing all subscription data...');
    
    // Force refresh all data
    await Promise.all([
      get().fetchCurrentSubscription(true),
      get().fetchAllSubscriptions(true),
      get().fetchAvailablePlans(true),
    ]);
    
    console.log('✅ SubscriptionStore: All subscription data refreshed');
  },

  clearError: () => set({ error: null }),

  // Legacy methods for backward compatibility
  fetchUserSubscriptions: async () => {
    console.log('⚠️ SubscriptionStore: fetchUserSubscriptions is deprecated, use fetchAllSubscriptions');
    return get().fetchAllSubscriptions();
  },

  fetchPlans: async () => {
    console.log('⚠️ SubscriptionStore: fetchPlans is deprecated, use fetchAvailablePlans');
    return get().fetchAvailablePlans();
  },

  fetchActivePlans: async () => {
    console.log('⚠️ SubscriptionStore: fetchActivePlans is deprecated, use fetchAvailablePlans');
    return get().fetchAvailablePlans();
  },
}));