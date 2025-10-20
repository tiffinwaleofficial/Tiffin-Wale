#!/usr/bin/env node

/**
 * Script for manual testing of Menu APIs
 * 
 * Usage: 
 * 1. Start the server: npm run start:dev
 * 2. Run this script: node scripts/test-menu-api-manual.js
 */

const axios = require('axios');
// In newer versions of chalk, we need to require it differently
const chalk = require('chalk');

const API_URL = 'http://localhost:3000/api';
// Mock token for testing - this is just for testing purposes
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0';
let categoryId = null;
let menuItemId = null;

const testMenuCategories = async () => {
  try {
    console.log('\n🍽️ Testing Menu Categories API');
    const axiosConfig = { headers: { Authorization: `Bearer ${authToken}` } };
    
    // Create a category
    console.log('1️⃣ Creating a new category...');
    const createResponse = await axios.post(`${API_URL}/menu/categories`, {
      name: 'Test Category',
      description: 'Category for testing',
      imageUrl: 'https://example.com/category.jpg',
      order: 1,
      tags: ['test', 'new']
    }, axiosConfig);
    
    categoryId = createResponse.data._id;
    console.log('✅ Category created:', categoryId);
    
    // Get all categories
    console.log('2️⃣ Getting all categories...');
    const getAllResponse = await axios.get(`${API_URL}/menu/categories`, axiosConfig);
    console.log(`✅ Retrieved ${getAllResponse.data.length} categories`);
    
    // Get category by ID
    console.log(`3️⃣ Getting category by ID: ${categoryId}...`);
    const getOneResponse = await axios.get(`${API_URL}/menu/categories/${categoryId}`, axiosConfig);
    console.log('✅ Category retrieved:', getOneResponse.data.name);
    
    // Update category
    console.log(`4️⃣ Updating category: ${categoryId}...`);
    const updateResponse = await axios.patch(`${API_URL}/menu/categories/${categoryId}`, {
      description: 'Updated description',
      order: 2
    }, axiosConfig);
    console.log('✅ Category updated:', updateResponse.data.description);
    
    return true;
  } catch (error) {
    console.error('❌ Category API test failed:', error.response?.data || error.message);
    return false;
  }
};

const testMenuItems = async () => {
  try {
    console.log('\n🍛 Testing Menu Items API');
    const axiosConfig = { headers: { Authorization: `Bearer ${authToken}` } };
    
    // Create a menu item
    console.log('1️⃣ Creating a new menu item...');
    const createResponse = await axios.post(`${API_URL}/menu`, {
      name: 'Test Butter Naan',
      description: 'Creamy and rich naan for testing',
      price: 12.99,
      imageUrl: 'https://example.com/test-image.jpg',
      businessPartner: '6507e9ce0cb7ea2d3c9d10a9', // Replace with actual partner ID
      category: categoryId || '6507e9ce0cb7ea2d3c9d10b2', // Use a fallback if categoryId is null
      isAvailable: true,
      tags: ['spicy', 'test'],
      allergens: ['dairy'],
      nutritionalInfo: {
        calories: 450,
        protein: 20,
        carbs: 50,
        fat: 15
      }
    }, axiosConfig);
    
    menuItemId = createResponse.data._id;
    console.log('✅ Menu item created:', menuItemId);
    
    // Get all menu items
    console.log('2️⃣ Getting all menu items...');
    const getAllResponse = await axios.get(`${API_URL}/menu`, axiosConfig);
    console.log(`✅ Retrieved ${getAllResponse.data.length} menu items`);
    
    // Get menu item by ID
    console.log(`3️⃣ Getting menu item by ID: ${menuItemId}...`);
    const getOneResponse = await axios.get(`${API_URL}/menu/${menuItemId}`, axiosConfig);
    console.log('✅ Menu item retrieved:', getOneResponse.data.name);
    
    // Update menu item
    console.log(`4️⃣ Updating menu item: ${menuItemId}...`);
    const updateResponse = await axios.patch(`${API_URL}/menu/${menuItemId}`, {
      price: 14.99,
      isAvailable: false
    }, axiosConfig);
    console.log('✅ Menu item updated:', `Price: ${updateResponse.data.price}`);
    
    return true;
  } catch (error) {
    console.error('❌ Menu Item API test failed:', error.response?.data || error.message);
    return false;
  }
};

const testCleanup = async () => {
  try {
    console.log('\n🧹 Cleanup');
    const axiosConfig = { headers: { Authorization: `Bearer ${authToken}` } };
    
    // Delete menu item
    if (menuItemId) {
      console.log(`1️⃣ Deleting menu item: ${menuItemId}...`);
      await axios.delete(`${API_URL}/menu/${menuItemId}`, axiosConfig);
      console.log('✅ Menu item deleted');
    }
    
    // Delete category
    if (categoryId) {
      console.log(`2️⃣ Deleting category: ${categoryId}...`);
      await axios.delete(`${API_URL}/menu/categories/${categoryId}`, axiosConfig);
      console.log('✅ Category deleted');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Cleanup failed:', error.response?.data || error.message);
    return false;
  }
};

// Main execution
(async () => {
  try {
    console.log('🧪 Starting Menu API manual tests...');
    
    // Test categories
    const categoryResult = await testMenuCategories();
    
    // Test menu items
    const menuItemResult = await testMenuItems();
    
    // Clean up
    await testCleanup();
    
    if (categoryResult && menuItemResult) {
      console.log('\n✅ All tests completed successfully!');
    } else {
      console.log('\n⚠️ Some tests failed, check the logs above for details.');
    }
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
  }
})(); 