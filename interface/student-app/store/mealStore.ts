import { create } from 'zustand';
import { Meal, MenuItem, OrderAdditional, Review } from '@/types';

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
}

// Sample data
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Poha with Jalebi',
    description: 'Traditional Indori breakfast with sweet jalebi',
    price: 60,
    image: 'https://images.pexels.com/photos/14705131/pexels-photo-14705131.jpeg',
    category: 'breakfast',
    tags: ['traditional', 'local favorite'],
    isVegetarian: true,
    rating: 4.5,
    reviewCount: 120,
    availableToday: true,
    restaurantId: 'rest1'
  },
  {
    id: '2',
    name: 'Paneer Butter Masala with Roti',
    description: 'Creamy paneer curry with butter and spices served with fresh rotis',
    price: 180,
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    category: 'lunch',
    tags: ['north indian', 'popular'],
    isVegetarian: true,
    rating: 4.7,
    reviewCount: 89,
    availableToday: true,
    restaurantId: 'rest2'
  },
  {
    id: '3',
    name: 'Dal Tadka with Rice',
    description: 'Tempered lentils with aromatic spices served with steamed rice',
    price: 120,
    image: 'https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg',
    category: 'dinner',
    tags: ['comfort food', 'healthy'],
    isVegetarian: true,
    rating: 4.3,
    reviewCount: 65,
    availableToday: true,
    restaurantId: 'rest3'
  }
];

// Today's date
const today = new Date().toISOString().split('T')[0];

// Mock data for meals
const mockMeals: Meal[] = [
  {
    id: 'meal1',
    type: 'breakfast',
    date: today,
    menu: [mockMenuItems[0]],
    status: 'delivered',
    restaurantId: 'rest1',
    restaurantName: 'Indori Delights'
  },
  {
    id: 'meal2',
    type: 'lunch',
    date: today,
    menu: [mockMenuItems[1]],
    status: 'preparing',
    restaurantId: 'rest2',
    restaurantName: 'Spice Garden'
  },
  {
    id: 'meal3',
    type: 'dinner',
    date: today,
    menu: [mockMenuItems[2]],
    status: 'scheduled',
    restaurantId: 'rest3',
    restaurantName: 'Homely Meals'
  }
];

// Mock additional orders
const mockAdditionalOrders: OrderAdditional[] = [
  {
    id: 'add1',
    items: [
      {
        itemId: '4',
        name: 'Cold Coffee',
        price: 80,
        quantity: 1
      }
    ],
    total: 80,
    date: today,
    status: 'confirmed',
    paymentStatus: 'pending'
  }
];

export const useMealStore = create<MealState>((set) => ({
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
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({ 
        meals: mockMeals, 
        additionalOrders: mockAdditionalOrders,
        isLoading: false 
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch meals', isLoading: false });
    }
  },
  
  fetchTodayMeals: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const today = new Date().toISOString().split('T')[0];
      const todayMeals = mockMeals.filter(meal => meal.date === today);
      
      set({ todayMeals, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch today\'s meals', isLoading: false });
    }
  },
  
  rateMeal: async (mealId: string, rating: number, comment: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReview: Review = {
        id: `review-${Date.now()}`,
        mealId,
        restaurantId: mockMeals.find(m => m.id === mealId)?.restaurantId || '',
        rating,
        comment,
        date: new Date().toISOString(),
        userName: 'You'
      };
      
      set(state => ({ 
        reviews: [...state.reviews, newReview],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to submit review', isLoading: false });
    }
  },
  
  orderAdditionalItem: async (itemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the item from mock data
      const item = mockMenuItems.find(item => item.id === itemId);
      
      if (!item) {
        throw new Error('Item not found');
      }
      
      const newOrder: OrderAdditional = {
        id: `order-${Date.now()}`,
        items: [
          {
            itemId,
            name: item.name,
            price: item.price,
            quantity
          }
        ],
        total: item.price * quantity,
        date: new Date().toISOString(),
        status: 'confirmed',
        paymentStatus: 'pending'
      };
      
      set(state => ({ 
        additionalOrders: [...state.additionalOrders, newOrder],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to place order', isLoading: false });
    }
  },
  
  cancelAdditionalOrder: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({ 
        additionalOrders: state.additionalOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' } 
            : order
        ),
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to cancel order', isLoading: false });
    }
  }
}));