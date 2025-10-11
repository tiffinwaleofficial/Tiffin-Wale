import { create } from 'zustand';
import { Restaurant, MenuItem } from '@/types';
import api from '@/utils/apiClient';

interface RestaurantState {
  restaurants: Restaurant[];
  featuredRestaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  currentRestaurantMenu: MenuItem[] | null;
  isLoading: boolean;
  error: string | null;
  
  fetchRestaurants: () => Promise<void>;
  fetchFeaturedRestaurants: () => Promise<void>;
  fetchRestaurantById: (id: string) => Promise<void>;
  fetchMenuForRestaurant: (partnerId: string) => Promise<void>;
  searchRestaurants: (query: string) => Promise<void>;
  filterRestaurants: (cuisineType?: string, rating?: number) => Promise<void>;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  featuredRestaurants: [],
  currentRestaurant: null,
  currentRestaurantMenu: null,
  isLoading: false,
  error: null,
  
  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch restaurants from real API
      const restaurants = await api.partners.getAll();
      
      set({ 
        restaurants,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch restaurants', 
        isLoading: false 
      });
    }
  },
  
  fetchFeaturedRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch all restaurants and select featured ones
      const allRestaurants = await api.partners.getAll();
      
      // Select top restaurants by rating as featured
      const featured = [...allRestaurants]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 2);
      
      set({ 
        featuredRestaurants: featured,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching featured restaurants:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch featured restaurants', 
        isLoading: false 
      });
    }
  },
  
  fetchRestaurantById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch restaurant details from real API
      const restaurant = await api.partners.getById(id);
      
      set({ 
        currentRestaurant: restaurant,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch restaurant', 
        isLoading: false 
      });
    }
  },
  
  fetchMenuForRestaurant: async (partnerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const menu = await api.menu.getByPartner(partnerId);
      set({
        currentRestaurantMenu: menu,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching menu for restaurant:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch menu',
        isLoading: false,
      });
    }
  },
  
  searchRestaurants: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch all restaurants and filter locally
      // In a real implementation, you might want to add a search endpoint to the backend
      const allRestaurants = await api.partners.getAll();
      
      const normalizedQuery = query.toLowerCase();
      
      const results = allRestaurants.filter((restaurant: Restaurant) => 
        restaurant.name?.toLowerCase().includes(normalizedQuery) ||
        restaurant.cuisineType?.some((cuisine: string) => cuisine.toLowerCase().includes(normalizedQuery)) ||
        restaurant.address?.toLowerCase().includes(normalizedQuery)
      );
      
      set({ 
        restaurants: results,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error searching restaurants:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search restaurants', 
        isLoading: false 
      });
    }
  },
  
  filterRestaurants: async (cuisineType?: string, rating?: number) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch all restaurants and filter locally
      const allRestaurants = await api.partners.getAll();
      
      let results = [...allRestaurants];
      
      if (cuisineType) {
        results = results.filter(restaurant => 
          restaurant.cuisineType?.some((cuisine: string) => 
            cuisine.toLowerCase() === cuisineType.toLowerCase()
          )
        );
      }
      
      if (rating) {
        results = results.filter(restaurant => (restaurant.rating || 0) >= rating);
      }
      
      set({ 
        restaurants: results,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error filtering restaurants:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to filter restaurants', 
        isLoading: false 
      });
    }
  }
}));
