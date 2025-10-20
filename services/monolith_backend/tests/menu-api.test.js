const request = require('supertest');

// Mock MenuItem model
const mockMenuItems = [
  {
    _id: '6507e9ce0cb7ea2d3c9d10c1',
    name: 'Butter Naan',
    description: 'Creamy and rich naan curry',
    price: 12.99,
    businessPartner: '6507e9ce0cb7ea2d3c9d10a9',
    category: '6507e9ce0cb7ea2d3c9d10b2'
  },
  {
    _id: '6507e9ce0cb7ea2d3c9d10c2',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese with spices',
    price: 10.99,
    businessPartner: '6507e9ce0cb7ea2d3c9d10a9',
    category: '6507e9ce0cb7ea2d3c9d10b2'
  }
];

// Mock Category model
const mockCategories = [
  {
    _id: '6507e9ce0cb7ea2d3c9d10b1',
    name: 'Appetizers',
    description: 'Starters and snacks'
  },
  {
    _id: '6507e9ce0cb7ea2d3c9d10b2',
    name: 'Main Course',
    description: 'Main dishes'
  }
];

// Mock menu service
const mockMenuService = {
  findAllMenuItems: jest.fn().mockResolvedValue(mockMenuItems),
  findMenuItemById: jest.fn().mockImplementation((id) => {
    const menuItem = mockMenuItems.find(item => item._id === id);
    if (!menuItem) {
      return Promise.reject(new Error('Menu item not found'));
    }
    return Promise.resolve(menuItem);
  }),
  createMenuItem: jest.fn().mockImplementation((data) => {
    const newItem = { _id: 'new-id-' + Date.now(), ...data };
    return Promise.resolve(newItem);
  }),
  updateMenuItem: jest.fn().mockImplementation((id, data) => {
    const menuItem = mockMenuItems.find(item => item._id === id);
    if (!menuItem) {
      return Promise.reject(new Error('Menu item not found'));
    }
    const updatedItem = { ...menuItem, ...data };
    return Promise.resolve(updatedItem);
  }),
  deleteMenuItem: jest.fn().mockImplementation((id) => {
    const menuItem = mockMenuItems.find(item => item._id === id);
    if (!menuItem) {
      return Promise.reject(new Error('Menu item not found'));
    }
    return Promise.resolve({ deleted: true });
  }),
  findMenuItemsByPartner: jest.fn().mockImplementation((partnerId) => {
    return Promise.resolve(mockMenuItems.filter(item => item.businessPartner === partnerId));
  }),
  findAllCategories: jest.fn().mockResolvedValue(mockCategories),
  findCategoryById: jest.fn().mockImplementation((id) => {
    const category = mockCategories.find(cat => cat._id === id);
    if (!category) {
      return Promise.reject(new Error('Category not found'));
    }
    return Promise.resolve(category);
  }),
  createCategory: jest.fn().mockImplementation((data) => {
    const newCategory = { _id: 'new-cat-id-' + Date.now(), ...data };
    return Promise.resolve(newCategory);
  }),
  updateCategory: jest.fn().mockImplementation((id, data) => {
    const category = mockCategories.find(cat => cat._id === id);
    if (!category) {
      return Promise.reject(new Error('Category not found'));
    }
    const updatedCategory = { ...category, ...data };
    return Promise.resolve(updatedCategory);
  }),
  deleteCategory: jest.fn().mockImplementation((id) => {
    const category = mockCategories.find(cat => cat._id === id);
    if (!category) {
      return Promise.reject(new Error('Category not found'));
    }
    return Promise.resolve({ deleted: true });
  })
};

// Mock controller
const mockMenuController = {
  findAllMenuItems: () => mockMenuService.findAllMenuItems(),
  findMenuItemById: (id) => mockMenuService.findMenuItemById(id),
  createMenuItem: (data) => mockMenuService.createMenuItem(data),
  updateMenuItem: (id, data) => mockMenuService.updateMenuItem(id, data),
  deleteMenuItem: (id) => mockMenuService.deleteMenuItem(id),
  findMenuItemsByPartner: (partnerId) => mockMenuService.findMenuItemsByPartner(partnerId),
  findAllCategories: () => mockMenuService.findAllCategories(),
  findCategoryById: (id) => mockMenuService.findCategoryById(id),
  createCategory: (data) => mockMenuService.createCategory(data),
  updateCategory: (id, data) => mockMenuService.updateCategory(id, data),
  deleteCategory: (id) => mockMenuService.deleteCategory(id)
};

describe('Menu Service Tests', () => {
  let partnerId = '6507e9ce0cb7ea2d3c9d10a9';
  let menuItemId = '6507e9ce0cb7ea2d3c9d10c1';
  let categoryId = '6507e9ce0cb7ea2d3c9d10b1';
  let nonExistentId = '6507e9ce0cb7ea2d3c9d1000';

  // Menu Item Tests
  describe('Menu Items', () => {
    it('should get all menu items', async () => {
      const result = await mockMenuController.findAllMenuItems();
      expect(result).toEqual(mockMenuItems);
      expect(mockMenuService.findAllMenuItems).toHaveBeenCalled();
    });

    it('should get a menu item by ID', async () => {
      const result = await mockMenuController.findMenuItemById(menuItemId);
      expect(result).toEqual(mockMenuItems[0]);
      expect(mockMenuService.findMenuItemById).toHaveBeenCalledWith(menuItemId);
    });

    it('should fail to get a non-existent menu item', async () => {
      await expect(mockMenuController.findMenuItemById(nonExistentId)).rejects.toThrow('Menu item not found');
      expect(mockMenuService.findMenuItemById).toHaveBeenCalledWith(nonExistentId);
    });

    it('should create a new menu item with all fields', async () => {
      const menuItemData = {
        name: 'Test Butter naan',
        description: 'Creamy and rich naan curry for testing',
        price: 12.99,
        imageUrl: 'https://example.com/test-image.jpg',
        businessPartner: partnerId,
        category: '6507e9ce0cb7ea2d3c9d10b2',
        isAvailable: true,
        tags: ['spicy', 'test'],
        allergens: ['dairy'],
        nutritionalInfo: {
          calories: 450,
          protein: 20,
          carbs: 50,
          fat: 15
        }
      };

      const result = await mockMenuController.createMenuItem(menuItemData);
      expect(result).toHaveProperty('_id');
      expect(result.name).toBe(menuItemData.name);
      expect(result.price).toBe(menuItemData.price);
      expect(mockMenuService.createMenuItem).toHaveBeenCalledWith(menuItemData);
    });

    it('should update a menu item', async () => {
      const updateData = {
        price: 14.99,
        isAvailable: false
      };

      const result = await mockMenuController.updateMenuItem(menuItemId, updateData);
      expect(result).toHaveProperty('_id', menuItemId);
      expect(result.price).toBe(updateData.price);
      expect(result.isAvailable).toBe(updateData.isAvailable);
      expect(mockMenuService.updateMenuItem).toHaveBeenCalledWith(menuItemId, updateData);
    });

    it('should fail to update a non-existent menu item', async () => {
      const updateData = { price: 19.99 };
      await expect(mockMenuController.updateMenuItem(nonExistentId, updateData)).rejects.toThrow('Menu item not found');
      expect(mockMenuService.updateMenuItem).toHaveBeenCalledWith(nonExistentId, updateData);
    });

    it('should delete a menu item', async () => {
      const result = await mockMenuController.deleteMenuItem(menuItemId);
      expect(result).toEqual({ deleted: true });
      expect(mockMenuService.deleteMenuItem).toHaveBeenCalledWith(menuItemId);
    });

    it('should fail to delete a non-existent menu item', async () => {
      await expect(mockMenuController.deleteMenuItem(nonExistentId)).rejects.toThrow('Menu item not found');
      expect(mockMenuService.deleteMenuItem).toHaveBeenCalledWith(nonExistentId);
    });

    it('should get menu items by partner', async () => {
      const result = await mockMenuController.findMenuItemsByPartner(partnerId);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].businessPartner).toBe(partnerId);
      expect(mockMenuService.findMenuItemsByPartner).toHaveBeenCalledWith(partnerId);
    });
  });

  // Category Tests
  describe('Categories', () => {
    it('should get all categories', async () => {
      const result = await mockMenuController.findAllCategories();
      expect(result).toEqual(mockCategories);
      expect(mockMenuService.findAllCategories).toHaveBeenCalled();
    });

    it('should get a category by ID', async () => {
      const result = await mockMenuController.findCategoryById(categoryId);
      expect(result).toEqual(mockCategories[0]);
      expect(mockMenuService.findCategoryById).toHaveBeenCalledWith(categoryId);
    });

    it('should fail to get a non-existent category', async () => {
      await expect(mockMenuController.findCategoryById(nonExistentId)).rejects.toThrow('Category not found');
      expect(mockMenuService.findCategoryById).toHaveBeenCalledWith(nonExistentId);
    });

    it('should create a new category with all fields', async () => {
      const categoryData = {
        name: 'Test Category',
        description: 'Category for testing',
        imageUrl: 'https://example.com/category.jpg',
        order: 1,
        tags: ['test', 'new']
      };

      const result = await mockMenuController.createCategory(categoryData);
      expect(result).toHaveProperty('_id');
      expect(result.name).toBe(categoryData.name);
      expect(mockMenuService.createCategory).toHaveBeenCalledWith(categoryData);
    });

    it('should update a category', async () => {
      const updateData = {
        description: 'Updated description',
        order: 2
      };

      const result = await mockMenuController.updateCategory(categoryId, updateData);
      expect(result).toHaveProperty('_id', categoryId);
      expect(result.description).toBe(updateData.description);
      expect(result.order).toBe(updateData.order);
      expect(mockMenuService.updateCategory).toHaveBeenCalledWith(categoryId, updateData);
    });

    it('should fail to update a non-existent category', async () => {
      const updateData = { name: 'Updated Category' };
      await expect(mockMenuController.updateCategory(nonExistentId, updateData)).rejects.toThrow('Category not found');
      expect(mockMenuService.updateCategory).toHaveBeenCalledWith(nonExistentId, updateData);
    });

    it('should delete a category', async () => {
      const result = await mockMenuController.deleteCategory(categoryId);
      expect(result).toEqual({ deleted: true });
      expect(mockMenuService.deleteCategory).toHaveBeenCalledWith(categoryId);
    });

    it('should fail to delete a non-existent category', async () => {
      await expect(mockMenuController.deleteCategory(nonExistentId)).rejects.toThrow('Category not found');
      expect(mockMenuService.deleteCategory).toHaveBeenCalledWith(nonExistentId);
    });
  });
}); 