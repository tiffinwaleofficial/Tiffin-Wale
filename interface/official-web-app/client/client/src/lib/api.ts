// API utility functions for TiffinWale

// Base URL for API requests
const API_BASE_URL = '/api';

// WebSocket connection
let socket: WebSocket | null = null;
let socketReconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Types
export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type TestimonialFormData = {
  name: string;
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

export type Testimonial = {
  id: string;
  name: string;
  profession?: string;
  rating: number;
  testimonial: string;
  imageUrl?: string;
  isApproved: boolean;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
};

export type TestimonialsResponse = {
  testimonials: Testimonial[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  message?: string;
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
  data?: any
): Promise<T> => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const options: RequestInit = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) }),
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'An error occurred');
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
  return apiRequest<ApiResponse>('/contact', 'POST', formData);
};

// Testimonial submission
export const submitTestimonial = async (
  formData: TestimonialFormData
): Promise<ApiResponse> => {
  return apiRequest<ApiResponse>('/testimonial', 'POST', formData);
};

// Feedback submission
export const submitFeedback = async (
  formData: FeedbackFormData
): Promise<ApiResponse> => {
  return apiRequest<ApiResponse>('/feedback', 'POST', formData);
};

// Check API health
export const checkApiHealth = async (): Promise<{status: string; message: string}> => {
  return apiRequest<{status: string; message: string}>('/health');
};

// Get approved testimonials
export const getTestimonials = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<TestimonialsResponse> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder
  }).toString();
  
  return apiRequest<TestimonialsResponse>(`/testimonials?${queryParams}`);
};