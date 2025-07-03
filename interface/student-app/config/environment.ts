import Constants from 'expo-constants';

// Environment configuration
interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
}

// Function to read API URL from .env through Expo config
const getApiBaseUrl = (): string => {
  // First priority: Read from Expo config (which reads from .env via app.config.ts)
  const envApiUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  
  if (envApiUrl) {
    console.log('✅ API URL loaded from .env file:', envApiUrl);
    return envApiUrl;
  }
  
  // If no .env file or variable found, throw an error to force user to set it up
  console.error('❌ API_BASE_URL not found in .env file!');
  console.error('Please add API_BASE_URL to your .env file with one of these options:');
  console.error('  For local development: API_BASE_URL=http://127.0.0.1:3001');
  console.error('  For production: API_BASE_URL=https://api.tiffin-wale.com');
  
  // Don't fall back to localhost - force user to configure .env properly
  throw new Error('API_BASE_URL must be configured in .env file. Please check your .env file.');
};

const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const apiUrl = getApiBaseUrl();
  
  if (apiUrl.includes('127.0.0.1') || apiUrl.includes('localhost')) {
    return 'development';
  }
  
  if (apiUrl.includes('staging') || apiUrl.includes('dev')) {
    return 'staging';
  }
  
  return 'production';
};

export const config: AppConfig = {
  apiBaseUrl: getApiBaseUrl(),
  environment: getEnvironment(),
};

// Log the configuration for debugging
console.log('🔧 Environment Configuration:');
console.log('  API Base URL:', config.apiBaseUrl);
console.log('  Environment:', config.environment);
console.log('  Source: .env file via Expo config');

export default config; 