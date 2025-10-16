import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Environment configuration
interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
  emailVerification?: {
    emailableApiKey?: string;
  };
}

// Function to determine environment
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  // Check if we're in development mode
  if (__DEV__) {
    return 'development';
  }
  
  // Check environment variables
  const nodeEnv = process.env.NODE_ENV as string | undefined;
  const expoEnv = process.env.EXPO_PUBLIC_APP_ENV as string | undefined;
  
  if (nodeEnv === 'production' || expoEnv === 'production') {
    return 'production';
  }
  
  if (nodeEnv === 'staging' || expoEnv === 'staging') {
    return 'staging';
  }
  
  // Default to development
  return 'development';
};

// Function to get environment-specific API URL
const getApiBaseUrl = (): string => {
  const environment = getEnvironment();
  
  if (environment === 'development') {
    // Platform-specific API URLs for development
    if (Platform.OS === 'web') {
      // Web: Use localhost
      const localUrl = 'http://localhost:3001';
      console.log('🌐 Web Development - Using localhost:', localUrl);
      return localUrl;
    } else {
      // Mobile (Android/iOS): Use production backend
      const prodUrl = process.env.EXPO_PUBLIC_PROD_API_BASE_URL || 'https://api-tiffin-wale.vercel.app';
      console.log('📱 Mobile Development - Using production backend:', prodUrl);
      return prodUrl;
    }
  } else {
    // For staging/production, always use remote backend
    const prodUrl = process.env.EXPO_PUBLIC_PROD_API_BASE_URL || 'https://api-tiffin-wale.vercel.app';
    console.log('🌐 Production mode - Using remote backend:', prodUrl);
    return prodUrl;
  }
};

export const config: AppConfig = {
  apiBaseUrl: getApiBaseUrl(),
  environment: getEnvironment(),
  emailVerification: {
    emailableApiKey: process.env.EXPO_PUBLIC_EMAILABLE_API_KEY,
  },
};

// Log the configuration for debugging
console.log('🔧 Environment Configuration:');
console.log('  API Base URL:', config.apiBaseUrl);
console.log('  Environment:', config.environment);
console.log('  Source: .env file via Expo config');

export default config; 