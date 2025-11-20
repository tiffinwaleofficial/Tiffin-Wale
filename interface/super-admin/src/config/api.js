import axios from 'axios';
import { generateIdempotencyKey } from '@/utils/idempotency';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Request deduplication map: tracks active requests by idempotency key
const activeRequests = new Map();

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // 1s, 2s, 4s

export const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and idempotency key
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Request deduplication for ALL methods (prevents duplicate in-flight requests)
    const method = config.method?.toUpperCase() || 'GET';
    const requestKey = `${method}:${config.url}:${JSON.stringify(config.data || {})}`;
    
    if (activeRequests.has(requestKey)) {
      // Cancel this NEW duplicate request - another identical request is already in flight
      const cancelTokenSource = axios.CancelToken.source();
      cancelTokenSource.cancel('Duplicate request cancelled - another identical request is already in progress');
      config.cancelToken = cancelTokenSource.token;
      return config; // Return early, request will be cancelled
    }
    
    // Create new cancel token for this request
    const cancelTokenSource = axios.CancelToken.source();
    activeRequests.set(requestKey, cancelTokenSource);
    config.cancelToken = cancelTokenSource.token;
    
    // Add idempotency key to ALL requests
    const idempotencyKey = generateIdempotencyKey();
    config.headers['Idempotency-Key'] = idempotencyKey;
    
    // Store metadata for cleanup
    config.metadata = {
      requestKey,
      idempotencyKey,
    };

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and cleanup
apiClient.interceptors.response.use(
  (response) => {
    // Clean up active request tracking on success
    if (response.config?.metadata?.requestKey) {
      activeRequests.delete(response.config.metadata.requestKey);
    }
    return response;
  },
  async (error) => {
    const config = error.config;

    // Clean up active request tracking
    if (config?.metadata?.requestKey) {
      activeRequests.delete(config.metadata.requestKey);
    }

    // Handle cancelled requests (duplicate requests)
    if (axios.isCancel(error)) {
      console.log('[Idempotency] Request was cancelled:', error.message);
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      // Only redirect if not already on login page to prevent loops
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Retry logic with exponential backoff
    if (config && !config.__retryCount) {
      config.__retryCount = 0;
    }

    // Only retry on network errors or 5xx errors
    const shouldRetry =
      !error.response || // Network error
      (error.response.status >= 500 && error.response.status < 600); // Server error

    if (shouldRetry && config && config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      const delay = RETRY_DELAYS[config.__retryCount - 1] || 4000;

      console.log(
        `[Retry] Attempting retry ${config.__retryCount}/${MAX_RETRIES} after ${delay}ms for:`,
        config.url
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Retry the request
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

export default apiClient;