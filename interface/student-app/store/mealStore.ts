import { create } from 'zustand';
import { Meal, OrderAdditional, Review } from '@/types';
import api from '@/utils/apiClient';

interface MealState {
  meals: Meal[];
  additionalOrders: OrderAdditional[];
  reviews: Review[];
  todayMeals: Meal[];
  upcomingMeals: Meal[];
  isLoading: boolean;
  error: string | null;
  
  fetchMeals: () => Promise<void>;
  fetchTodayMeals: () => Promise<void>;
  rateMeal: (mealId: string, rating: number, comment: string) => Promise<void>;
  orderAdditionalItem: (itemId: string, quantity: number) => Promise<void>;
  cancelAdditionalOrder: (orderId: string) => Promise<void>;
  skipMeal: (mealId: string, reason?: string) => Promise<void>;
}

export const useMealStore = create<MealState>((set, get) => ({
  meals: [],
  additionalOrders: [],
  reviews: [],
  todayMeals: [],
  upcomingMeals: [],
  isLoading: false,
  error: null,
  
  fetchMeals: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch meal history from real API
      const meals = await api.meals.getHistory();
      
      set({ 
        meals,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching meals:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch meals', 
        isLoading: false 
      });
    }
  },
  
  fetchTodayMeals: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch today's meals from real API
      const todayMeals = await api.meals.getToday();
      
      set({ todayMeals, isLoading: false });
    } catch (error) {
      console.error('Error fetching today\'s meals:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch today\'s meals', 
        isLoading: false 
      });
    }
  },
  
  rateMeal: async (mealId: string, rating: number, comment: string) => {
    set({ isLoading: true, error: null });
    try {
      // Submit rating to real API
      await api.meals.rateMeal(mealId, rating, comment);
      
      // Update local state to reflect the rating
      const { meals, todayMeals } = get();
      
      const updateMealRating = (meal: Meal) => {
        if (meal.id === mealId) {
          return {
            ...meal,
            userRating: rating,
            userReview: comment
          };
        }
        return meal;
      };
      
      set({ 
        meals: meals.map(updateMealRating),
        todayMeals: todayMeals.map(updateMealRating),
        isLoading: false 
      });
    } catch (error) {
      console.error('Error rating meal:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to submit review', 
        isLoading: false 
      });
    }
  },
  
  skipMeal: async (mealId: string, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Skip meal via real API
      await api.meals.skipMeal(mealId, reason);
      
      // Update local state to reflect the skip
      const { meals, todayMeals } = get();
      
      const updateMealStatus = (meal: Meal) => {
        if (meal.id === mealId) {
          return {
            ...meal,
            status: 'skipped' as const
          };
        }
        return meal;
      };
      
      set({ 
        meals: meals.map(updateMealStatus),
        todayMeals: todayMeals.map(updateMealStatus),
        isLoading: false 
      });
    } catch (error) {
      console.error('Error skipping meal:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to skip meal', 
        isLoading: false 
      });
    }
  },
  
  orderAdditionalItem: async (itemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      // Create additional order via orders API
      const orderData = {
        items: [{ itemId, quantity }],
        type: 'additional'
      };
      
      const newOrder = await api.orders.create(orderData);
      
      set(state => ({ 
        additionalOrders: [...state.additionalOrders, newOrder],
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error placing additional order:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to place order', 
        isLoading: false 
      });
    }
  },
  
  cancelAdditionalOrder: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Update order status to cancelled via API
      await api.orders.updateStatus(orderId, 'cancelled');
      
      set(state => ({ 
        additionalOrders: state.additionalOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' } 
            : order
        ),
        isLoading: false 
      }));
    } catch (error) {
      console.error('Error cancelling order:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cancel order', 
        isLoading: false 
      });
    }
  }
}));