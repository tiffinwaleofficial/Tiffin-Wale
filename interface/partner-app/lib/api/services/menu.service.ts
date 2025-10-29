/**
 * Menu API Service
 * All menu and category management endpoints
 */

import { apiClient, handleApiError, retryRequest } from '../client';

export interface MenuItem {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  categoryId?: string;
  category?: string;
  partnerId?: string;
  menu?: string; // Menu ID this item belongs to
  imageUrl?: string;
  images?: string[]; // Multiple images for menu item
  isAvailable: boolean;
  preparationTime?: number;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuCategory {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Menu API Methods
 */
export const menuApi = {
  /**
   * Get current partner's menu
   */
  getMyMenu: async (): Promise<MenuItem[]> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<MenuItem[]>('/partners/my-menu')
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMyMenu');
    }
  },

  /**
   * Get all categories
   */
  getCategories: async (): Promise<MenuCategory[]> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<MenuCategory[]>('/menu/categories')
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getCategories');
    }
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: string): Promise<MenuCategory> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<MenuCategory>(`/menu/categories/${id}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getCategoryById');
    }
  },

  /**
   * Get menu items by partner
   */
  getMenuItemsByPartner: async (partnerId: string): Promise<MenuItem[]> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<MenuItem[]>(`/menu/partner/${partnerId}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMenuItemsByPartner');
    }
  },

  /**
   * Get all menu items (Admin/Public endpoint - Partners should use getMyMenu instead)
   * @deprecated For partners, use getMyMenu() instead
   */
  getAllMenuItems: async (): Promise<MenuItem[]> => {
    try {
      // This requires admin authentication - partners should not use this
      // Keeping for backward compatibility but partners should use getMyMenu
      const response = await retryRequest(() =>
        apiClient.get<MenuItem[]>('/menu')
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getAllMenuItems');
    }
  },

  /**
   * Get menu item by ID
   */
  getMenuItemById: async (id: string): Promise<MenuItem> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<MenuItem>(`/menu/${id}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMenuItemById');
    }
  },

  /**
   * Create menu item
   * Note: businessPartner is auto-set from JWT, don't send it
   */
  createMenuItem: async (item: Omit<MenuItem, 'id' | '_id' | 'businessPartner'>): Promise<MenuItem> => {
    try {
      // Remove businessPartner if provided, backend will set it
      const { businessPartner, ...itemData } = item as any;
      const response = await retryRequest(() =>
        apiClient.post<MenuItem>('/menu', itemData)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'createMenuItem');
    }
  },

  /**
   * Update menu item
   */
  updateMenuItem: async (id: string, item: Partial<MenuItem>): Promise<MenuItem> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<MenuItem>(`/menu/${id}`, item)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updateMenuItem');
    }
  },

  /**
   * Delete menu item
   */
  deleteMenuItem: async (id: string): Promise<void> => {
    try {
      await retryRequest(() =>
        apiClient.delete(`/menu/${id}`)
      );
    } catch (error) {
      return handleApiError(error, 'deleteMenuItem');
    }
  },

  /**
   * Create category
   */
  createCategory: async (category: Omit<MenuCategory, 'id' | '_id'>): Promise<MenuCategory> => {
    try {
      const response = await retryRequest(() =>
        apiClient.post<MenuCategory>('/menu/categories', category)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'createCategory');
    }
  },

  /**
   * Update category
   */
  updateCategory: async (id: string, category: Partial<MenuCategory>): Promise<MenuCategory> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<MenuCategory>(`/menu/categories/${id}`, category)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updateCategory');
    }
  },

  /**
   * Delete category
   */
  deleteCategory: async (id: string): Promise<void> => {
    try {
      await retryRequest(() =>
        apiClient.delete(`/menu/categories/${id}`)
      );
    } catch (error) {
      return handleApiError(error, 'deleteCategory');
    }
  },

  /**
   * Menu Management (Multiple Menus)
   */
  
  /**
   * Get current partner's menus
   */
  getMyMenus: async (): Promise<Menu[]> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<Menu[]>('/menu/menus')
      );
      return response.data || [];
    } catch (error) {
      return handleApiError(error, 'getMyMenus');
    }
  },

  /**
   * Get menu by ID with items
   */
  getMenuById: async (id: string): Promise<Menu> => {
    try {
      const response = await retryRequest(() =>
        apiClient.get<Menu>(`/menu/menus/${id}`)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'getMenuById');
    }
  },

  /**
   * Create a new menu
   */
  createMenu: async (menu: Omit<Menu, 'id' | '_id'>): Promise<Menu> => {
    try {
      const response = await retryRequest(() =>
        apiClient.post<Menu>('/menu/menus', menu)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'createMenu');
    }
  },

  /**
   * Update menu
   */
  updateMenu: async (id: string, menu: Partial<Menu>): Promise<Menu> => {
    try {
      const response = await retryRequest(() =>
        apiClient.patch<Menu>(`/menu/menus/${id}`, menu)
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'updateMenu');
    }
  },

  /**
   * Delete menu
   */
  deleteMenu: async (id: string): Promise<void> => {
    try {
      await retryRequest(() =>
        apiClient.delete(`/menu/menus/${id}`)
      );
    } catch (error) {
      return handleApiError(error, 'deleteMenu');
    }
  },
};

export interface Menu {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  restaurant?: string;
  images?: string[];
  isActive: boolean;
  availableFrom?: string;
  availableTo?: string;
  items?: MenuItem[]; // Items belonging to this menu, filtered by partner
  createdAt?: string;
  updatedAt?: string;
}

export default menuApi;

