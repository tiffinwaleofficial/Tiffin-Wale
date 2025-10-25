// API utility functions for TiffinWale
import { config } from '../../../config/environment';

// Get API base URL from our environment configuration
const API_BASE_URL = config.apiBaseUrl;

// Check if we're in a production environment
const isProduction = config.environment === 'production';

// Log environment and configuration
console.log(`Running in ${config.environment} mode`);
console.log(`API requests will be sent to ${API_BASE_URL}`);

// WebSocket connection
let socket: WebSocket | null = null;
let socketReconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Enhanced Types with File Upload Support
export type ContactFormData = {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: string[]; // Cloudinary URLs
};

export type CorporateQuoteData = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeeCount: string;
  requirements?: string;
  documents?: string[]; // Cloudinary URLs for proposals, company profiles, etc.
};

export type TestimonialFormData = {
  name: string;
  email: string;
  profession?: string;
  rating: number;
  testimonial: string;
  imageUrl?: string; // For backward compatibility
  imageUrls?: string[]; // New field for multiple images
};

export type FeedbackFormData = {
  name?: string;
  email: string;
  type: 'suggestion' | 'complaint' | 'question' | 'compliment' | 'other';
  feedback: string;
  rating?: number;
  attachments?: string[]; // Cloudinary URLs for screenshots, documents, etc.
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
  console.log('- Environment:', config.environment);
  console.log('- Source: .env file via Vite config');
  
  // Check backend connectivity
  checkBackendHealth().then(isReachable => {
    console.log('- Backend reachable:', isReachable);
  });
};

// ============================================================
// MARKETPLACE APIs - Partners, Plans, Reviews
// ============================================================

export type Partner = {
  _id: string;
  businessName: string;
  ownerName: string;
  description?: string;
  cuisineType: string[];
  rating: number;
  totalReviews: number;
  city: string;
  address: string;
  phone: string;
  email: string;
  imageUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  deliveryAreas?: string[];
  operatingHours?: any;
};

export type SubscriptionPlan = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // 'daily', 'weekly', 'monthly', 'quarterly', 'annual'
  meals: {
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
  };
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
  discount?: number;
};

export type Review = {
  _id: string;
  userId?: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  restaurantId?: string;
  menuItemId?: string;
  createdAt: string;
  helpful: number;
  isVerified?: boolean;
};

export type PartnerFilters = {
  cuisineType?: string;
  rating?: number;
  city?: string;
};

export type PlatformStats = {
  totalPartners: number;
  totalSubscriptions: number;
  totalCustomers: number;
  totalCities: number;
  avgRating: number;
};

// Get all partners/tiffin centers
export const getPartners = async (filters?: PartnerFilters): Promise<Partner[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.cuisineType) params.append('cuisineType', filters.cuisineType);
    if (filters?.rating) params.append('rating', filters.rating.toString());
    if (filters?.city) params.append('city', filters.city);
    
    const queryString = params.toString();
    const endpoint = queryString ? `partners?${queryString}` : 'partners';
    
    console.log('Fetching partners:', endpoint);
    return await apiRequest<Partner[]>(endpoint, 'GET');
  } catch (error) {
    console.error('Failed to fetch partners:', error);
    throw error;
  }
};

// Get a specific partner by ID
export const getPartner = async (id: string): Promise<Partner> => {
  try {
    console.log('Fetching partner:', id);
    return await apiRequest<Partner>(`partners/${id}`, 'GET');
  } catch (error) {
    console.error('Failed to fetch partner:', error);
    throw error;
  }
};

// Get partner menu
export const getPartnerMenu = async (partnerId: string): Promise<any[]> => {
  try {
    console.log('Fetching partner menu:', partnerId);
    return await apiRequest<any[]>(`partners/${partnerId}/menu`, 'GET');
  } catch (error) {
    console.error('Failed to fetch partner menu:', error);
    throw error;
  }
};

// Get partner subscription plans
export const getPartnerPlans = async (partnerId: string): Promise<SubscriptionPlan[]> => {
  try {
    console.log('Fetching partner plans:', partnerId);
    return await apiRequest<SubscriptionPlan[]>(`partners/${partnerId}/plans`, 'GET');
  } catch (error) {
    console.error('Failed to fetch partner plans:', error);
    throw error;
  }
};

// Get partner reviews
export const getPartnerReviews = async (partnerId: string): Promise<Review[]> => {
  try {
    console.log('Fetching partner reviews:', partnerId);
    return await apiRequest<Review[]>(`partners/${partnerId}/reviews`, 'GET');
  } catch (error) {
    console.error('Failed to fetch partner reviews:', error);
    throw error;
  }
};

// Get partner statistics
export const getPartnerStats = async (partnerId: string): Promise<any> => {
  try {
    console.log('Fetching partner stats:', partnerId);
    return await apiRequest<any>(`partners/${partnerId}/stats`, 'GET');
  } catch (error) {
    console.error('Failed to fetch partner stats:', error);
    throw error;
  }
};

// Get all subscription plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    console.log('Fetching subscription plans');
    return await apiRequest<SubscriptionPlan[]>('subscription-plans', 'GET');
  } catch (error) {
    console.error('Failed to fetch subscription plans:', error);
    throw error;
  }
};

// Get active subscription plans only
export const getActiveSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    console.log('Fetching active subscription plans');
    return await apiRequest<SubscriptionPlan[]>('subscription-plans/active', 'GET');
  } catch (error) {
    console.error('Failed to fetch active subscription plans:', error);
    throw error;
  }
};

// Get a specific subscription plan
export const getSubscriptionPlan = async (id: string): Promise<SubscriptionPlan> => {
  try {
    console.log('Fetching subscription plan:', id);
    return await apiRequest<SubscriptionPlan>(`subscription-plans/${id}`, 'GET');
  } catch (error) {
    console.error('Failed to fetch subscription plan:', error);
    throw error;
  }
};

// Get restaurant reviews
export const getRestaurantReviews = async (restaurantId: string): Promise<Review[]> => {
  try {
    console.log('Fetching restaurant reviews:', restaurantId);
    return await apiRequest<Review[]>(`reviews/restaurant/${restaurantId}`, 'GET');
  } catch (error) {
    console.error('Failed to fetch restaurant reviews:', error);
    throw error;
  }
};

// Get menu item reviews
export const getMenuItemReviews = async (itemId: string): Promise<Review[]> => {
  try {
    console.log('Fetching menu item reviews:', itemId);
    return await apiRequest<Review[]>(`reviews/menu-item/${itemId}`, 'GET');
  } catch (error) {
    console.error('Failed to fetch menu item reviews:', error);
    throw error;
  }
};

// Subscribe to newsletter
export const subscribeToNewsletter = async (email: string): Promise<ApiResponse> => {
  try {
    console.log('Subscribing to newsletter:', email);
    return await apiRequest<ApiResponse>('subscribe', 'POST', { email });
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    throw error;
  }
};

// Get platform statistics (for homepage stats)
export const getPlatformStats = async (): Promise<PlatformStats> => {
  try {
    console.log('Fetching platform statistics');
    // This endpoint might need to be created in backend or we can aggregate from other endpoints
    return await apiRequest<PlatformStats>('stats/platform', 'GET');
  } catch (error) {
    console.warn('Failed to fetch platform stats from backend, using default values:', error);
    // Return default/fallback stats if backend endpoint doesn't exist yet
    return {
      totalPartners: 100,
      totalSubscriptions: 5000,
      totalCustomers: 10000,
      totalCities: 50,
      avgRating: 4.6
    };
  }
};