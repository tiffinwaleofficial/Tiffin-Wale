import { Platform } from 'react-native';
import { ENV } from '../config/env';

export const getPlatformSpecificApiUrl = (): string => {
  // For web, use localhost
  if (Platform.OS === 'web') {
    return ENV.API_BASE_URL || 'http://localhost:3001';
  }
  
  // For mobile (Android/iOS), use production URL
  return ENV.PROD_API_BASE_URL || ENV.API_BASE_URL || 'http://localhost:3001';
};

export const isWebPlatform = (): boolean => {
  return Platform.OS === 'web';
};

export const isMobilePlatform = (): boolean => {
  return Platform.OS === 'android' || Platform.OS === 'ios';
};

export const getPlatformName = (): string => {
  return Platform.OS;
};

export const getApiConfig = () => {
  const baseURL = getPlatformSpecificApiUrl();
  
  return {
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
