// Environment configuration for TiffinWale Official Web App

// Global variable injected by Vite at build time
declare const __API_BASE_URL__: string;

interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
}

// Function to read API URL from environment variables
const getApiBaseUrl = (): string => {
  console.log('🔍 Reading .env file...');
  
  // Use the global variable injected by Vite from our .env file
  const envApiUrl = __API_BASE_URL__;
  
  if (envApiUrl && envApiUrl !== 'http://localhost:3001') {
    console.log('📁 Current API_BASE_URL from .env:', envApiUrl);
    return envApiUrl;
  }

  // If we have localhost, check if it was set explicitly or is a fallback
  if (envApiUrl === 'http://localhost:3001') {
    console.log('📁 Current API_BASE_URL from .env:', envApiUrl);
    return envApiUrl;
  }

  // Fallback to production URL if something went wrong
  console.error('❌ API_BASE_URL not properly loaded!');
  console.warn('⚠️ Falling back to production API URL');
  return 'https://api.tiffin-wale.com';
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

// Export the configuration
export const config: AppConfig = {
  apiBaseUrl: getApiBaseUrl(),
  environment: getEnvironment(),
};

// Log the configuration for debugging
console.log('🔧 Environment Configuration:');
console.log('  API Base URL:', config.apiBaseUrl);
console.log('  Environment:', config.environment);
console.log('  Source: .env file via Vite config');

export default config; 