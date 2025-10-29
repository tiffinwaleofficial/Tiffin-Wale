import axios from 'axios';
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
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('📡 API Request:', config.method?.toUpperCase(), fullUrl);
    
    // Add JWT token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 JWT token added');
      } else {
        console.log('⚠️ No JWT token in localStorage');
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url);
    
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
// This is the KEY fix - pass axios instance when creating the client!
export const client = createClient(createConfig({
  axios: axiosInstance,
  baseURL: API_BASE_URL,
}));

export default client;

