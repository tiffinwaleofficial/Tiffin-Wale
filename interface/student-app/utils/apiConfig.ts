/**
 * API Configuration Utility
 * Handles different base URLs for different platforms
 */

import { Platform } from 'react-native';

export const getApiBaseUrl = (): string => {
  // Use environment variable if set
  if (process.env.API_BASE_URL) {
    console.log('🌐 Using environment variable API_BASE_URL:', process.env.API_BASE_URL);
    return process.env.API_BASE_URL;
  }
  
  console.log('🔍 Platform.OS detected:', Platform.OS);
  
  // Use React Native Platform detection for better accuracy
  if (Platform.OS === 'android') {
    console.log('📱 Android detected, using 10.0.2.2:3001');
    return 'http://10.0.2.2:3001'; // Android emulator/device host
  }
  
  if (Platform.OS === 'ios') {
    console.log('📱 iOS detected, using 127.0.0.1:3001');
    return 'http://127.0.0.1:3001'; // iOS simulator can use localhost
  }
  
  // For web platform, try localhost first
  if (Platform.OS === 'web') {
    console.log('🌐 Web detected, using 127.0.0.1:3001');
    return 'http://127.0.0.1:3001';
  }
  
  // Check user agent as fallback for web
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    console.log('🔍 Checking user agent:', navigator.userAgent);
    if (navigator.userAgent.includes('Android')) {
      console.log('📱 Android user agent detected, using 10.0.2.2:3001');
      return 'http://10.0.2.2:3001';
    }
    if (navigator.userAgent.includes('iPhone')) {
      console.log('📱 iPhone user agent detected, using 127.0.0.1:3001');
      return 'http://127.0.0.1:3001';
    }
  }
  
  // Default to localhost for web/other platforms
  console.log('🌐 Using default localhost:3001');
  return 'http://localhost:3001'; // Changed from 127.0.0.1 to localhost
};

export const API_BASE_URL = getApiBaseUrl();

// Log the API URL for debugging
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔍 Platform:', Platform.OS);
