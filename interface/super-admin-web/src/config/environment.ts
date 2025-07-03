// Minimal process env typing to avoid needing @types/node
declare const process: { env: { NEXT_PUBLIC_API_BASE_URL?: string } };

interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'staging' | 'production';
}

const getApiBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (apiUrl) {
    console.log('✅ NEXT_PUBLIC_API_BASE_URL:', apiUrl);
    return apiUrl;
  }
  console.error('❌ NEXT_PUBLIC_API_BASE_URL is not defined. Falling back to http://localhost:3001');
  return 'http://localhost:3001';
};

const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const apiUrl = getApiBaseUrl();
  if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) return 'development';
  if (apiUrl.includes('staging') || apiUrl.includes('dev')) return 'staging';
  return 'production';
};

export const config: AppConfig = {
  apiBaseUrl: getApiBaseUrl(),
  environment: getEnvironment(),
};

console.log('[ENV] API Base URL:', config.apiBaseUrl, '| env:', config.environment);