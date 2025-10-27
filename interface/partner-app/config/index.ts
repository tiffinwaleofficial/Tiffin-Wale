/**
 * Centralized Environment Configuration
 * Single source of truth for all environment variables and configuration
 */

import { Platform } from 'react-native';

/**
 * Platform-aware API URL selection
 * Web: localhost for development
 * Mobile: Production URL or network-accessible URL
 */
const getApiBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  } else {
    // For mobile, prefer production URL or specify local network IP
    return process.env.EXPO_PUBLIC_PROD_API_BASE_URL || 
           process.env.EXPO_PUBLIC_API_BASE_URL || 
           'http://localhost:3001';
  }
};

/**
 * Centralized configuration object
 * All environment variables and settings in one place
 */
export const config = {
  // API Configuration
  api: {
    baseUrl: getApiBaseUrl(),
    timeout: 15000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // Firebase Configuration (Production - Blaze Plan with Real SMS OTP)
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCgfF7twAURbSUCcwWYSmu6i1jqEPdn91E',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'tiffin-wale-15d70.firebaseapp.com',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'tiffin-wale-15d70',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tiffin-wale-15d70.firebasestorage.app',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '375989594965',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:375989594965:web:981efda0254d50d8cf9ddc',
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-NEK8ZRXFCT',
  },

  // Cloudinary Configuration
  cloudinary: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
    apiKey: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || '',
    baseUrl: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME 
      ? `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}`
      : '',
    imageUrl: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
      ? `https://res.cloudinary.com/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
      : '',
  },

  // WebSocket Configuration
  websocket: {
    url: process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001',
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
  },

  // Pusher Configuration
  pusher: {
    key: process.env.EXPO_PUBLIC_PUSHER_KEY || '',
    cluster: process.env.EXPO_PUBLIC_PUSHER_CLUSTER || 'us2',
    enabled: !!process.env.EXPO_PUBLIC_PUSHER_KEY,
  },

  // Environment Info
  environment: (process.env.EXPO_PUBLIC_ENVIRONMENT as 'development' | 'staging' | 'production') || 'development',
  isDevelopment: __DEV__,
  isProduction: process.env.EXPO_PUBLIC_ENVIRONMENT === 'production',
  isStaging: process.env.EXPO_PUBLIC_ENVIRONMENT === 'staging',
  
  // App Info
  app: {
    name: 'TiffinWale Partner',
    version: '1.0.0',
    platform: Platform.OS,
  },

  // Feature Flags
  features: {
    enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
    enablePushNotifications: true,
    enableChat: true,
    debugMode: __DEV__,
  },

  // Storage Keys (prefixed for partner app)
  storage: {
    accessToken: '@tiffin_partner_access_token',
    refreshToken: '@tiffin_partner_refresh_token',
    userData: '@tiffin_partner_user_data',
    authState: '@tiffin_partner_auth_state',
  },
};

/**
 * Helper functions for environment checks
 */
export const isDevelopment = (): boolean => config.isDevelopment;
export const isProduction = (): boolean => config.isProduction;
export const isStaging = (): boolean => config.isStaging;

/**
 * Validate required environment variables
 */
export const validateConfig = (): { valid: boolean; missing: string[] } => {
  const requiredVars: (keyof typeof config)[] = [];
  const missing: string[] = [];

  // Check API configuration
  if (!config.api.baseUrl) {
    missing.push('API_BASE_URL');
  }

  // Check Cloudinary configuration (optional but recommended)
  if (!config.cloudinary.cloudName && config.isProduction) {
    console.warn('⚠️ Cloudinary configuration missing - image uploads will not work');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
};

// Log configuration on initialization (dev only)
if (__DEV__) {
  console.log('🔧 Partner App Configuration:');
  console.log('  - Environment:', config.environment);
  console.log('  - API Base URL:', config.api.baseUrl);
  console.log('  - Platform:', config.app.platform);
  console.log('  - Firebase Project:', config.firebase.projectId);
  
  const validation = validateConfig();
  if (!validation.valid) {
    console.warn('⚠️ Missing required configuration:', validation.missing);
  }
}

export default config;

