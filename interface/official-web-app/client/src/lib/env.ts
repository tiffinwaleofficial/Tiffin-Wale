/**
 * Environment variables access module
 * Hardcoded values to avoid any issues with Vite environment variable loading
 */

// Cloudinary configuration - hardcoded to match your .env file
export const CLOUDINARY = {
  CLOUD_NAME: 'dols3w27e',  // Directly hardcoded to match your .env
  API_KEY: '921455847536819', // Directly hardcoded to match your .env
  API_SECRET: 'yMhNxiV135Kr4aWf7fSYR_G_Zjc', // Only used server-side
  UPLOAD_PRESET: 'ml_default' // The most common default Cloudinary preset
};

// API configuration
export const API = {
  BASE_URL: '/api',
  BACKEND_URL: 'http://localhost:3001'
}; 