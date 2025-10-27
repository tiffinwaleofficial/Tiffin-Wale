import { Platform } from 'react-native';
import { config } from '../config';

export const getPlatformSpecificApiUrl = (): string => {
  return config.api.baseUrl; // Already handles platform-specific logic
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
