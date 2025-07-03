import { create } from 'zustand';
import api from '@/utils/apiClient';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  pausedAt?: string;
  pauseReason?: string;
  createdAt: string;
  updatedAt: string;
}

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

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
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
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch subscription plans', 
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
      const subscriptions = await api.subscriptions.getAll();
      const activeSubscription = subscriptions.find((sub: Subscription) => sub.status === 'active') || null;
      
      set({ 
        userSubscriptions: subscriptions,
        currentSubscription: activeSubscription,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch subscriptions', 
        isLoading: false 
      });
    }
  },
  
  createSubscription: async (planId: string, paymentMethodId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const subscriptionData = {
        planId,
        paymentMethodId,
        startDate: new Date().toISOString(),
      };
      
      const newSubscription = await api.subscriptions.create(subscriptionData);
      
      set(state => ({
        userSubscriptions: [...state.userSubscriptions, newSubscription],
        currentSubscription: newSubscription,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error creating subscription:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create subscription', 
        isLoading: false 
      });
    }
  },
  
  pauseSubscription: async (subscriptionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSubscription = await api.subscriptions.pause(subscriptionId);
      
      set(state => ({
        userSubscriptions: state.userSubscriptions.map(sub => 
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
      
      set(state => ({
        userSubscriptions: state.userSubscriptions.map(sub => 
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
      
      set(state => ({
        userSubscriptions: state.userSubscriptions.map(sub => 
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