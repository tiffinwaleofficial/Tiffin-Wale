import { create } from 'zustand';
import { Meal, OrderAdditional, Review } from '@/types';
import api from '@/utils/apiClient';

interface MealState {
  meals: Meal[];
  todayMeals: Meal[];
  isLoading: boolean;
  error: string | null;
  fetchMeals: () => Promise<void>;
  fetchTodayMeals: () => Promise<void>;
  rateMeal: (mealId: string, rating: number, comment: string) => Promise<void>;
  skipMeal: (mealId: string, reason?: string) => Promise<void>;
}

export const useMealStore = create<MealState>((set, get) => ({
  meals: [],
  todayMeals: [],
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
      await api.meals.skipMeal(mealId, reason);
      // You might want to update the local state here as well
      set({ isLoading: false });
    } catch (error) {
      console.error('Error skipping meal:', error);
      set({
        error: 'Failed to skip meal',
        isLoading: false,
      });
    }
  },
}));