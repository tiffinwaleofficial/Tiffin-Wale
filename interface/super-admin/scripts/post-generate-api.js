/**
 * Post-generation script to ensure API client uses correct backend URL
 * 
 * This runs after `openapi-ts` generates the client code to ensure:
 * 1. Our custom client.ts is used (with proper axios config)
 * 2. All imports point to our configured client
 * 
 * Run: node scripts/post-generate-api.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Post-processing API client...');

// Ensure client.ts exists and is properly configured
const clientPath = path.join(__dirname, '../src/lib/api/client.ts');
const clientExists = fs.existsSync(clientPath);

if (!clientExists) {
  console.error('❌ client.ts not found! Creating default...');
  
  const defaultClientContent = `import axios from 'axios';
import { createClient, createConfig } from './generated/client';

// Configure the base URL from environment variable
// This allows switching between local and production without code changes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3001';

console.log('🔧 API Client Configuration:');
console.log('   - Environment:', process.env.NODE_ENV || 'development');
console.log('   - Base URL:', API_BASE_URL);
console.log('   - Source:', process.env.NEXT_PUBLIC_API_BASE_URL ? '.env file' : 'fallback (hardcoded)');
if (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1')) {
  console.log('   - Mode: LOCAL DEVELOPMENT');
} else {
  console.log('   - Mode: PRODUCTION');
}

// Create custom axios instance with our baseURL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Log and add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const fullUrl = \`\${config.baseURL}\${config.url}\`;
    console.log('📡 API Request:', config.method?.toUpperCase(), fullUrl);
    
    // Add JWT token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = \`Bearer \${token}\`;
        console.log('🔑 JWT token added');
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// CREATE OUR OWN CLIENT with the configured axios instance
export const client = createClient(createConfig({
  axios: axiosInstance,
  baseURL: API_BASE_URL,
}));

export default client;
`;
  
  fs.writeFileSync(clientPath, defaultClientContent);
  console.log('✅ Created client.ts');
}

// Ensure index.ts exists and properly wraps SDK functions
const indexPath = path.join(__dirname, '../src/lib/api/index.ts');
const indexExists = fs.existsSync(indexPath);

if (!indexExists) {
  console.error('❌ index.ts not found! Creating default...');
  
  const defaultIndexContent = `/**
 * Centralized API exports with configured client
 * 
 * ALWAYS import from @/lib/api (NOT @tiffinwale/sdk!)
 * 
 * This file is auto-maintained by scripts/post-generate-api.js
 */

import { client as configuredClient } from './client';
import * as sdkFunctions from './generated/sdk.gen';

// Export the configured client
export { client as apiClient, default as client } from './client';

// Re-export ALL auto-generated React Query hooks
export * from './generated/@tanstack/react-query.gen';

// Re-export all generated types
export type * from './generated/types.gen';

// Wrapper to inject our configured client into SDK functions
const withClient = <TFunc extends (...args: any[]) => any>(fn: TFunc) => {
  return (options?: Parameters<TFunc>[0]) => {
    return fn({ ...options, client: configuredClient } as Parameters<TFunc>[0]);
  };
};

// Export ALL SDK functions with our configured client
// Note: Add new SDK functions here as needed
export const authControllerLogin = withClient(sdkFunctions.authControllerLogin);
export const authControllerLogout = withClient(sdkFunctions.authControllerLogout);
export const authControllerRegisterSuperAdmin = withClient(sdkFunctions.authControllerRegisterSuperAdmin);
export const authControllerRefresh = withClient(sdkFunctions.authControllerRefresh);
export const authControllerChangePassword = withClient(sdkFunctions.authControllerChangePassword);
export const userControllerGetProfile = withClient(sdkFunctions.userControllerGetProfile);

// Super Admin Controllers
export const superAdminControllerGetDashboardStats = withClient(sdkFunctions.superAdminControllerGetDashboardStats);
export const superAdminControllerGetDashboardActivities = withClient(sdkFunctions.superAdminControllerGetDashboardActivities);
export const superAdminControllerGetRevenueHistory = withClient(sdkFunctions.superAdminControllerGetRevenueHistory);
export const superAdminControllerGetActiveSubscriptions = withClient(sdkFunctions.superAdminControllerGetActiveSubscriptions);
export const superAdminControllerGetAllOrders = withClient(sdkFunctions.superAdminControllerGetAllOrders);
export const superAdminControllerGetAllPartners = withClient(sdkFunctions.superAdminControllerGetAllPartners);
export const superAdminControllerGetAllCustomers = withClient(sdkFunctions.superAdminControllerGetAllCustomers);
export const superAdminControllerGetAllSubscriptions = withClient(sdkFunctions.superAdminControllerGetAllSubscriptions);
export const superAdminControllerUpdateOrderStatus = withClient(sdkFunctions.superAdminControllerUpdateOrderStatus);
export const superAdminControllerUpdatePartnerStatus = withClient(sdkFunctions.superAdminControllerUpdatePartnerStatus);
export const superAdminControllerUpdateSubscriptionStatus = withClient(sdkFunctions.superAdminControllerUpdateSubscriptionStatus);
`;
  
  fs.writeFileSync(indexPath, defaultIndexContent);
  console.log('✅ Created index.ts');
}

console.log('✅ Post-processing complete!');
console.log('');
console.log('📝 Remember:');
console.log('   - ALWAYS import from @/lib/api (NOT @tiffinwale/sdk!)');
console.log('   - Backend URL: http://127.0.0.1:3001');
console.log('   - Next.js URL: http://localhost:9002');
console.log('');

