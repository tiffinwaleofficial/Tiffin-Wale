/**
 * Environment variables access module
 * Enhanced configuration for modern Tiffin Wale official web app
 */

// Enhanced Cloudinary configuration matching student app setup
export const CLOUDINARY = {
  CLOUD_NAME: 'dols3w27e',
  API_KEY: '921455847536819',
  API_SECRET: 'yMhNxiV135Kr4aWf7FsYR_G_Zjc', // Only used server-side
  UPLOAD_PRESET: 'tiffin-wale', // Using the same preset as student app
  FOLDER_PREFIX: 'official-web-app'
};

// API configuration
export const API = {
  BASE_URL: '/api',
  BACKEND_URL: 'http://localhost:3001'
};

// App theme configuration - matching student app design
export const THEME = {
  colors: {
    primary: '#FF9B42', // Orange - matching student app
    primaryLight: '#FFB366',
    primaryDark: '#E8851E',
    background: '#FFFAF0', // Cream background
    backgroundAlt: '#FFF5E6',
    text: '#2D3748',
    textLight: '#718096',
    success: '#48BB78',
    error: '#F56565',
    warning: '#ED8936',
    info: '#4299E1'
  },
  fonts: {
    primary: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  }
}; 