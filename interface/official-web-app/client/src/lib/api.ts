// API utility functions for TiffinWale

// Base URL for API requests
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.tiffin-wale.com/api'
  : '/api';

// For direct calls to the backend (if needed)
const BACKEND_URL = {
  production: 'https://api.tiffinwale.com',
  development: 'http://localhost:3001'
};

// Check if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Log environment and configuration
console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);
console.log(`API requests will be sent to ${API_BASE_URL}`);

// WebSocket connection
let socket: WebSocket | null = null;
let socketReconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Types
export type ContactFormData = {
  name: string;
  email: string;
  message: string;
  phoneNumber?: string;
  subject?: string;
};

export type CorporateQuoteData = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeeCount: string;
  requirements?: string;
};

export type TestimonialFormData = {
  name: string;
  email: string;
  profession?: string;
  rating: number;
  testimonial: string;
  imageUrl?: string;
};

export type FeedbackFormData = {
  email: string;
  type: 'suggestion' | 'complaint' | 'question' | 'other';
  feedback: string;
  rating?: number;
};

export type ApiResponse = {
  success: boolean;
  message?: string;
  errors?: any[];
};

// WebSocket connection manager
export const connectWebSocket = (
  onMessage?: (data: any) => void,
  onConnect?: () => void,
  onDisconnect?: () => void
): void => {
  // First check if WebSocket is supported
  if (typeof WebSocket === 'undefined') {
    console.warn('WebSocket is not supported in this browser');
    return;
  }
  
  // Don't reconnect if already connected or connecting
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;
    
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    
    // Create the WebSocket connection
    socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connected successfully');
      socketReconnectAttempts = 0;
      if (onConnect) onConnect();
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        if (onMessage) onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    socket.onclose = (event) => {
      console.log(`WebSocket disconnected (code: ${event.code}, reason: ${event.reason})`);
      if (onDisconnect) onDisconnect();
      
      // Don't attempt to reconnect if the connection was closed cleanly
      if (event.wasClean) {
        console.log('WebSocket closed cleanly, not attempting to reconnect');
        return;
      }
      
      // Attempt to reconnect with backoff
      if (socketReconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        socketReconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, socketReconnectAttempts), 30000);
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${socketReconnectAttempts})`);
        
        setTimeout(() => {
          connectWebSocket(onMessage, onConnect, onDisconnect);
        }, delay);
      } else {
        console.log('Maximum reconnection attempts reached, giving up');
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket connection error:', error);
      // The onclose handler will be called after this for reconnection
    };
  } catch (error) {
    console.error('Error initializing WebSocket connection:', error);
  }
};

export const disconnectWebSocket = (): void => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

// API request helper function
const apiRequest = async <T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any,
  useBackend: boolean = false
): Promise<T> => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    const options: RequestInit = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) }),
      credentials: isProduction ? 'include' : 'same-origin',
      mode: isProduction ? 'cors' : 'same-origin'
    };
    
    // Format the URL properly ensuring no double slashes
    // Remove any leading slash from endpoint since we'll add it properly
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    
    // Use the appropriate URL based on environment
    const url = `${API_BASE_URL}/${formattedEndpoint}`;
    
    console.log(`Sending ${method} request to: ${url}`);
    
    const response = await fetch(url, options);
    
    // Check if response is empty
    const text = await response.text();
    const result = text ? JSON.parse(text) : {};
    
    if (!response.ok) {
      throw new Error(result.message || `Server responded with ${response.status}: ${response.statusText}`);
    }
    
    return result as T;
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    throw error;
  }
};

// Contact form submission
export const submitContactForm = async (
  formData: ContactFormData
): Promise<ApiResponse> => {
  try {
    console.log('Submitting contact form:', formData);
    return await apiRequest<ApiResponse>('contact', 'POST', formData);
  } catch (error) {
    console.error('Contact form submission failed:', error);
    throw error;
  }
};

// Corporate quote request submission
export const submitCorporateQuote = async (
  formData: CorporateQuoteData
): Promise<ApiResponse> => {
  try {
    console.log('Submitting corporate quote request:', formData);
    return await apiRequest<ApiResponse>('corporate/quote', 'POST', formData);
  } catch (error) {
    console.error('Corporate quote submission failed:', error);
    throw error;
  }
};

// Testimonial submission
export const submitTestimonial = async (
  formData: TestimonialFormData
): Promise<ApiResponse> => {
  try {
    console.log('Submitting testimonial:', formData);
    return await apiRequest<ApiResponse>('testimonials', 'POST', formData);
  } catch (error) {
    console.error('Testimonial submission failed:', error);
    throw error;
  }
};

// Feedback submission
export const submitFeedback = async (
  formData: FeedbackFormData
): Promise<ApiResponse> => {
  try {
    // Convert frontend feedback format to backend format
    const backendFormData = {
      type: formData.type,
      subject: 'Website Feedback',
      message: formData.feedback,
      category: 'app',
      rating: formData.rating,
      deviceInfo: {
        platform: 'web',
        browser: navigator.userAgent,
        device: navigator.platform === 'Win32' ? 'desktop' : navigator.platform,
        os: navigator.platform
      }
    };
    
    console.log('Submitting feedback:', backendFormData);
    return await apiRequest<ApiResponse>('feedback', 'POST', backendFormData);
  } catch (error) {
    console.error('Feedback submission failed:', error);
    throw error;
  }
};

// Get testimonials
export const getTestimonials = async (limit: number = 6, featured: boolean = false): Promise<any[]> => {
  try {
    // Try to fetch from the backend first
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('featured', featured.toString());
    
    const result = await apiRequest<any[]>(`/testimonials/public?${params.toString()}`, 'GET', undefined, true);
    return result;
  } catch (error) {
    console.warn('Backend API unavailable, falling back to local endpoint');
    // Fall back to local endpoint or mock data
    return apiRequest<any[]>('/testimonials', 'GET');
  }
};

// Check API health
export const checkApiHealth = async (): Promise<{status: string; message: string}> => {
  return apiRequest<{status: string; message: string}>('/ping');
};

// Check backend health
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    // Format the URL properly to check the root health endpoint
    const url = `${API_BASE_URL}/ping`;
    console.log(`Checking backend health at: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'include'
    });
    
    if (response.ok) {
      console.log('Backend server is reachable');
      return true;
    } else {
      console.warn('Backend server returned an error:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Backend server is not reachable:', error);
    return false;
  }
};

// Utility function to log the API configuration
export const logApiConfig = () => {
  console.log('API Configuration:');
  console.log('- API_BASE_URL:', API_BASE_URL);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- Environment:', isProduction ? 'Production' : 'Development');
  
  // Check backend connectivity
  checkBackendHealth().then(isReachable => {
    console.log('- Backend reachable:', isReachable);
  });
};