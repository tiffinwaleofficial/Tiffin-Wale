import { create } from 'zustand';
import { Meal } from '@/types';
import api from '@/utils/apiClient';
import { getErrorMessage } from '@/utils/errorHandler';

interface MealState {
  // Data
  todayMeals: Meal[];
  upcomingMeals: Meal[];
  mealHistory: Meal[];
  
  // Loading states
  isLoading: boolean;
  isLoadingToday: boolean;
  isLoadingUpcoming: boolean;
  isLoadingHistory: boolean;
  error: string | null;
  
  // Cache management
  lastFetched: Date | null;
  lastTodayFetched: Date | null;
  lastUpcomingFetched: Date | null;
  lastHistoryFetched: Date | null;
  
  // Actions with smart caching
  fetchTodayMeals: (forceRefresh?: boolean) => Promise<void>;
  fetchUpcomingMeals: (forceRefresh?: boolean) => Promise<void>;
  fetchMealHistory: (forceRefresh?: boolean) => Promise<void>;
  refreshAllMealData: () => Promise<void>;
  
  // Meal actions
  rateMeal: (mealId: string, rating: number, comment?: string) => Promise<void>;
  skipMeal: (mealId: string, reason?: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const TODAY_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for today's meals (more frequent updates)

export const useMealStore = create<MealState>((set, get) => ({
  // Initial state
  todayMeals: [],
  upcomingMeals: [],
  mealHistory: [],
  isLoading: false,
  isLoadingToday: false,
  isLoadingUpcoming: false,
  isLoadingHistory: false,
  error: null,
  lastFetched: null,
  lastTodayFetched: null,
  lastUpcomingFetched: null,
  lastHistoryFetched: null,

  fetchTodayMeals: async (forceRefresh = false) => {
    const { lastTodayFetched, isLoadingToday } = get();
    
    // Check cache validity
    if (!forceRefresh && lastTodayFetched && isLoadingToday) {
      console.log('🔄 MealStore: Already fetching today\'s meals');
      return;
    }
    
    if (!forceRefresh && lastTodayFetched && Date.now() - lastTodayFetched.getTime() < TODAY_CACHE_DURATION) {
      console.log('📦 MealStore: Using cached today\'s meals');
      return;
    }

    set({ isLoadingToday: true, isLoading: true, error: null });
    try {
      console.log('🔔 MealStore: Fetching today\'s meals...');
      
      const todayMeals = await api.meals.getToday();
      console.log('✅ MealStore: Today\'s meals fetched:', todayMeals);
      
      set({ 
        todayMeals,
        isLoadingToday: false,
        isLoading: false,
        lastTodayFetched: new Date(),
      });
    } catch (error) {
      console.error('❌ MealStore: Error fetching today\'s meals:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoadingToday: false,
        isLoading: false,
      });
    }
  },

  fetchUpcomingMeals: async (forceRefresh = false) => {
    const { lastUpcomingFetched, isLoadingUpcoming } = get();
    
    // Check cache validity
    if (!forceRefresh && lastUpcomingFetched && isLoadingUpcoming) {
      console.log('🔄 MealStore: Already fetching upcoming meals');
      return;
    }
    
    if (!forceRefresh && lastUpcomingFetched && Date.now() - lastUpcomingFetched.getTime() < CACHE_DURATION) {
      console.log('📦 MealStore: Using cached upcoming meals');
      return;
    }

    set({ isLoadingUpcoming: true, isLoading: true, error: null });
    try {
      console.log('🔔 MealStore: Fetching upcoming meals...');
      
      const upcomingMeals = await api.meals.getUpcoming();
      console.log('✅ MealStore: Upcoming meals fetched:', upcomingMeals);
      
      set({ 
        upcomingMeals,
        isLoadingUpcoming: false,
        isLoading: false,
        lastUpcomingFetched: new Date(),
      });
    } catch (error) {
      console.error('❌ MealStore: Error fetching upcoming meals:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoadingUpcoming: false,
        isLoading: false,
      });
    }
  },

  fetchMealHistory: async (forceRefresh = false) => {
    const { lastHistoryFetched, isLoadingHistory } = get();
    
    // Check cache validity
    if (!forceRefresh && lastHistoryFetched && isLoadingHistory) {
      console.log('🔄 MealStore: Already fetching meal history');
      return;
    }
    
    if (!forceRefresh && lastHistoryFetched && Date.now() - lastHistoryFetched.getTime() < CACHE_DURATION) {
      console.log('📦 MealStore: Using cached meal history');
      return;
    }

    set({ isLoadingHistory: true, isLoading: true, error: null });
    try {
      console.log('🔔 MealStore: Fetching meal history...');
      
      const mealHistory = await api.meals.getHistory();
      console.log('✅ MealStore: Meal history fetched:', mealHistory);
      
      set({ 
        mealHistory,
        isLoadingHistory: false,
        isLoading: false,
        lastHistoryFetched: new Date(),
      });
    } catch (error) {
      console.error('❌ MealStore: Error fetching meal history:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoadingHistory: false,
        isLoading: false,
      });
    }
  },

  refreshAllMealData: async () => {
    console.log('🔄 MealStore: Refreshing all meal data...');
    
    // Force refresh all data
    await Promise.all([
      get().fetchTodayMeals(true),
      get().fetchUpcomingMeals(true),
      get().fetchMealHistory(true),
    ]);
    
    console.log('✅ MealStore: All meal data refreshed');
  },

  rateMeal: async (mealId: string, rating: number, comment?: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔔 MealStore: Rating meal:', mealId, 'with rating:', rating);
      
      await api.meals.rateMeal(mealId, rating, comment);
      console.log('✅ MealStore: Meal rated successfully');
      
      // Update local state to reflect the rating
      const { todayMeals, upcomingMeals, mealHistory } = get();
      
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
        todayMeals: todayMeals.map(updateMealRating),
        upcomingMeals: upcomingMeals.map(updateMealRating),
        mealHistory: mealHistory.map(updateMealRating),
        isLoading: false
      });
    } catch (error) {
      console.error('❌ MealStore: Error rating meal:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoading: false 
      });
      throw error; // Re-throw for UI handling
    }
  },

  skipMeal: async (mealId: string, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔔 MealStore: Skipping meal:', mealId, 'with reason:', reason);
      
      await api.meals.skipMeal(mealId, reason);
      console.log('✅ MealStore: Meal skipped successfully');
      
      // Update local state to reflect the skip
      const { todayMeals, upcomingMeals, mealHistory } = get();
      
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
        todayMeals: todayMeals.map(updateMealStatus),
        upcomingMeals: upcomingMeals.map(updateMealStatus),
        mealHistory: mealHistory.map(updateMealStatus),
        isLoading: false
      });
    } catch (error) {
      console.error('❌ MealStore: Error skipping meal:', error);
      set({ 
        error: getErrorMessage(error), 
        isLoading: false 
      });
      throw error; // Re-throw for UI handling
    }
  },

  clearError: () => set({ error: null }),

  // Legacy methods for backward compatibility
  fetchMeals: async () => {
    console.log('⚠️ MealStore: fetchMeals is deprecated, use fetchMealHistory');
    return get().fetchMealHistory();
  },
}));