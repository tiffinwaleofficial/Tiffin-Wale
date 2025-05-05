import { create } from 'zustand';
import { Restaurant, MenuItem, Review } from '@/types';

interface RestaurantState {
  restaurants: Restaurant[];
  featuredRestaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  
  fetchRestaurants: () => Promise<void>;
  fetchFeaturedRestaurants: () => Promise<void>;
  fetchRestaurantById: (id: string) => Promise<void>;
  searchRestaurants: (query: string) => Promise<void>;
  filterRestaurants: (cuisineType?: string, rating?: number) => Promise<void>;
}

// Sample data for restaurants
const mockRestaurants: Restaurant[] = [
  {
    id: 'rest1',
    name: 'Indori Delights',
    address: '56, Vijay Nagar, Indore',
    cuisineType: ['North Indian'],
    rating: 4.5,
    reviewCount: 120,
    image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg',
    distance: '2.3 km',
    featuredDish: 'Poha Jalebi'
  },
  {
    id: 'rest2',
    name: 'Spice Garden',
    address: '12, Palasia, Indore',
    cuisineType: ['North Indian'],
    rating: 4.7,
    reviewCount: 89,
    image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
    distance: '3.5 km',
    featuredDish: 'Paneer Butter Masala'
  },
  {
    id: 'rest3',
    name: 'Homely Meals',
    address: '45, LIG Colony, Indore',
    cuisineType: ['Home Food'],
    rating: 4.3,
    reviewCount: 65,
    image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg',
    distance: '1.8 km',
    featuredDish: 'Dal Tadka'
  },
  {
    id: 'rest4',
    name: 'South Spice',
    address: '78, New Palasia, Indore',
    cuisineType: ['South Indian'],
    rating: 4.2,
    reviewCount: 110,
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
    distance: '4.1 km',
    featuredDish: 'Masala Dosa'
  },
  {
    id: 'rest5',
    name: 'Healthy Bites',
    address: '23, Scheme 54, Indore',
    cuisineType: ['Healthy', 'Continental'],
    rating: 4.0,
    reviewCount: 45,
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    distance: '5.2 km',
    featuredDish: 'Protein Bowl'
  }
];

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  featuredRestaurants: [],
  currentRestaurant: null,
  isLoading: false,
  error: null,
  
  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({ 
        restaurants: mockRestaurants,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch restaurants', 
        isLoading: false 
      });
    }
  },
  
  fetchFeaturedRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Select top 2 restaurants by rating as featured
      const featured = [...mockRestaurants]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 2);
      
      set({ 
        featuredRestaurants: featured,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch featured restaurants', 
        isLoading: false 
      });
    }
  },
  
  fetchRestaurantById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const restaurant = mockRestaurants.find(r => r.id === id);
      
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      
      set({ 
        currentRestaurant: restaurant,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch restaurant', 
        isLoading: false 
      });
    }
  },
  
  searchRestaurants: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const normalizedQuery = query.toLowerCase();
      
      const results = mockRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(normalizedQuery) ||
        restaurant.cuisineType.some(cuisine => cuisine.toLowerCase().includes(normalizedQuery)) ||
        (restaurant.featuredDish && restaurant.featuredDish.toLowerCase().includes(normalizedQuery))
      );
      
      set({ 
        restaurants: results,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search restaurants', 
        isLoading: false 
      });
    }
  },
  
  filterRestaurants: async (cuisineType?: string, rating?: number) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let results = [...mockRestaurants];
      
      if (cuisineType) {
        results = results.filter(restaurant => 
          restaurant.cuisineType.some(cuisine => 
            cuisine.toLowerCase() === cuisineType.toLowerCase()
          )
        );
      }
      
      if (rating) {
        results = results.filter(restaurant => restaurant.rating >= rating);
      }
      
      set({ 
        restaurants: results,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to filter restaurants', 
        isLoading: false 
      });
    }
  }
}));
