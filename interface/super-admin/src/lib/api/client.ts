import axios from 'axios';
import { client as generatedClient } from './generated/client.gen';

// Configure the base URL - MUST point to backend API, not Next.js!
const API_BASE_URL = 'http://localhost:3001'; // HARDCODED for now

console.log('🔧 API Client initialized with Base URL:', API_BASE_URL);

// Create custom axios instance
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

// Set the custom axios instance on the generated client
generatedClient.setConfig({
  axios: axiosInstance,
  baseURL: API_BASE_URL,
});

export const client = generatedClient;
export default client;

