import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/apiClient';
import { 
  PartnerStats, 
  Earnings, 
  MenuItem, 
  MenuCategory, 
  Review, 
  PartnerSettings
} from '../types/partner';
import { PartnerProfile } from '../types/auth';

interface PartnerState {
  // Partner data
  profile: PartnerProfile | null;
  stats: PartnerStats | null;
  earnings: Earnings | null;
  
  // Menu management
  menuItems: MenuItem[];
  categories: MenuCategory[];
  
  // Reviews
  reviews: Review[];
  
  // Settings
  settings: PartnerSettings | null;
  
  // UI state
  isLoading: boolean;
  isRefreshing: boolean;
  isUpdating: boolean;
  error: string | null;
  
  // Last update timestamps
  lastProfileUpdate: string | null;
  lastStatsUpdate: string | null;
}

interface PartnerActions {
  // Profile management
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<PartnerProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  
  // Status management
  toggleAcceptingOrders: () => Promise<void>;
  updateAcceptingStatus: (isAccepting: boolean) => Promise<void>;
  
  // Statistics
  fetchStats: () => Promise<void>;
  refreshStats: () => Promise<void>;
  
  // UI state management
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Data management
  clearProfile: () => void;
  clearStats: () => void;
  
  // Menu management
  fetchMenu: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  createCategory: (category: Omit<MenuCategory, 'id'>) => Promise<void>;
  
  // Reviews
  fetchReviews: () => Promise<void>;
  
  // Settings
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<PartnerSettings>) => Promise<void>;
  
  // Utility actions
  refreshData: () => Promise<void>;
}

const initialState: PartnerState = {
  profile: null,
  stats: null,
  earnings: null,
  menuItems: [],
  categories: [],
  reviews: [],
  settings: null,
  isLoading: false,
  isRefreshing: false,
  isUpdating: false,
  error: null,
  lastProfileUpdate: null,
  lastStatsUpdate: null,
};

export const usePartnerStore = create<PartnerState & PartnerActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Fetch current partner profile
      fetchProfile: async () => {
        try {
          set({ isLoading: true, error: null });

          const profile = await api.partner.getCurrentProfile();
          
          set({
            profile,
            isLoading: false,
            error: null,
            lastProfileUpdate: new Date().toISOString(),
          });
        } catch (error: any) {
          console.error('Failed to fetch partner profile:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch profile',
          });
        }
      },

      // Update partner profile
      updateProfile: async (data: Partial<PartnerProfile>) => {
        try {
          set({ isUpdating: true, error: null });

          const updatedProfile = await api.partner.updateProfile(data);
          
          set({
            profile: updatedProfile,
            isUpdating: false,
            error: null,
            lastProfileUpdate: new Date().toISOString(),
          });
        } catch (error: any) {
          console.error('Failed to update partner profile:', error);
          set({
            isUpdating: false,
            error: error.response?.data?.message || 'Failed to update profile',
          });
          throw error;
        }
      },

      // Refresh profile
      refreshProfile: async () => {
        set({ isRefreshing: true });
        try {
          await get().fetchProfile();
        } finally {
          set({ isRefreshing: false });
        }
      },

      // Toggle accepting orders status
      toggleAcceptingOrders: async () => {
        const currentProfile = get().profile;
        if (!currentProfile) return;

        const newStatus = !currentProfile.isAcceptingOrders;
        await get().updateAcceptingStatus(newStatus);
      },

      // Update accepting orders status
      updateAcceptingStatus: async (isAccepting: boolean) => {
        try {
          set({ isUpdating: true, error: null });

          const updatedProfile = await api.partner.updateAcceptingStatus(isAccepting);
          
          set({
            profile: updatedProfile,
            isUpdating: false,
            error: null,
            lastProfileUpdate: new Date().toISOString(),
          });
        } catch (error: any) {
          console.error('Failed to update accepting status:', error);
          set({
            isUpdating: false,
            error: error.response?.data?.message || 'Failed to update status',
          });
          throw error;
        }
      },

      // Fetch partner statistics
      fetchStats: async () => {
        try {
          set({ isLoading: true, error: null });

          const stats = await api.partner.getStats();
          
          set({
            stats,
            isLoading: false,
            error: null,
            lastStatsUpdate: new Date().toISOString(),
          });
        } catch (error: any) {
          console.error('Failed to fetch partner stats:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch statistics',
          });
        }
      },

      // Refresh statistics
      refreshStats: async () => {
        set({ isRefreshing: true });
        try {
          await get().fetchStats();
        } finally {
          set({ isRefreshing: false });
        }
      },

      // UI state management
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setRefreshing: (refreshing: boolean) => set({ isRefreshing: refreshing }),
      setUpdating: (updating: boolean) => set({ isUpdating: updating }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),

      // Data management
      clearProfile: () => set({ 
        profile: null, 
        lastProfileUpdate: null 
      }),
      clearStats: () => set({ 
        stats: null, 
        lastStatsUpdate: null 
      }),

      // Menu management
      fetchMenu: async () => {
        try {
          const menuItems = await api.menu.getMyMenu();
          set({ menuItems });
        } catch (error: any) {
          console.error('Fetch menu error:', error);
          set({
            error: error.response?.data?.message || 'Failed to fetch menu items',
          });
        }
      },

      fetchCategories: async () => {
        try {
          const categories = await api.menu.getCategories();
          set({ categories });
        } catch (error: any) {
          console.error('Fetch categories error:', error);
          set({
            error: error.response?.data?.message || 'Failed to fetch categories',
          });
        }
      },

      createMenuItem: async (item) => {
        try {
          set({ isLoading: true, error: null });
          
          const newItem = await api.menu.createMenuItem(item);
          set({
            menuItems: [...get().menuItems, newItem],
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Create menu item error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to create menu item',
          });
          throw error;
        }
      },

      updateMenuItem: async (id, item) => {
        try {
          set({ isLoading: true, error: null });
          
          const updatedItem = await api.menu.updateMenuItem(id, item);
          set({
            menuItems: get().menuItems.map(menuItem =>
              menuItem.id === id ? updatedItem : menuItem
            ),
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Update menu item error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to update menu item',
          });
          throw error;
        }
      },

      deleteMenuItem: async (id) => {
        try {
          set({ isLoading: true, error: null });
          
          await api.menu.deleteMenuItem(id);
          set({
            menuItems: get().menuItems.filter(item => item.id !== id),
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Delete menu item error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to delete menu item',
          });
          throw error;
        }
      },

      createCategory: async (category) => {
        try {
          set({ isLoading: true, error: null });
          
          const newCategory = await api.menu.createCategory(category);
          set({
            categories: [...get().categories, newCategory],
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Create category error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to create category',
          });
          throw error;
        }
      },

      // Reviews
      fetchReviews: async () => {
        try {
          const reviewsData = await api.reviews.getMyReviews();
          set({ reviews: reviewsData.reviews || [] });
        } catch (error: any) {
          console.error('Fetch reviews error:', error);
          set({
            error: error.response?.data?.message || 'Failed to fetch reviews',
          });
        }
      },

      // Settings
      fetchSettings: async () => {
        try {
          // Note: We'll need to implement this endpoint
          // For now, use default settings
          const defaultSettings: PartnerSettings = {
            isAcceptingOrders: true,
            autoAcceptOrders: false,
            preparationTimeBuffer: 5,
            maxOrdersPerHour: 10,
            deliveryRadius: 5,
            minimumOrderValue: 100,
            notifications: {
              newOrders: true,
              orderUpdates: true,
              payments: true,
              reviews: true,
              marketing: false,
            },
            businessHours: {
              monday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
              tuesday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
              wednesday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
              thursday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
              friday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
              saturday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
              sunday: { isOpen: false, openTime: '09:00', closeTime: '21:00' },
            },
          };
          
          set({ settings: defaultSettings });
        } catch (error: any) {
          console.error('Fetch settings error:', error);
          set({
            error: error.response?.data?.message || 'Failed to fetch settings',
          });
        }
      },

      updateSettings: async (newSettings) => {
        try {
          set({ isLoading: true, error: null });
          
          // Note: We'll need to implement this endpoint
          // For now, just update local state
          const currentSettings = get().settings;
          if (currentSettings) {
            const updatedSettings = { ...currentSettings, ...newSettings };
            set({
              settings: updatedSettings,
              isLoading: false,
              error: null,
            });
          }
        } catch (error: any) {
          console.error('Update settings error:', error);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to update settings',
          });
          throw error;
        }
      },

      // Utility actions
      refreshData: async () => {
        try {
          set({ isRefreshing: true });
          
          await Promise.all([
            get().fetchStats(),
            get().fetchMenu(),
            get().fetchCategories(),
            get().fetchReviews(),
            get().fetchSettings(),
          ]);
          
          set({ isRefreshing: false });
        } catch (error) {
          set({ isRefreshing: false });
        }
      },
    }),
    {
      name: 'partner-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential data, not loading/error states
      partialize: (state) => ({
        profile: state.profile,
        stats: state.stats,
        earnings: state.earnings,
        menuItems: state.menuItems,
        categories: state.categories,
        reviews: state.reviews,
        settings: state.settings,
        lastProfileUpdate: state.lastProfileUpdate,
        lastStatsUpdate: state.lastStatsUpdate,
      }),
    }
  )
);

export default usePartnerStore; 