// Common API response format
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'customer';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Customer profile types
export interface CustomerProfile {
  id: string;
  user: string | User;
  city?: string;
  college?: string;
  branch?: string;
  graduationYear?: number;
  dietaryPreferences?: string[];
  favoriteCuisines?: string[];
  preferredPaymentMethods?: string[];
  deliveryAddresses?: DeliveryAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryAddress {
  id?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Menu types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  partnerId: string;
  isAvailable: boolean;
  isFeatured: boolean;
  preparationTime: number;
  ingredients?: string[];
  dietaryInfo?: string[];
  ratings?: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Order {
  id: string;
  customer: string | CustomerProfile;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  deliveryInstructions?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  menuItem: string | MenuItem;
  quantity: number;
  price: number;
  special_instructions?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'delivering' 
  | 'delivered' 
  | 'canceled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

// Subscription types
export interface Subscription {
  id: string;
  customer: string | CustomerProfile;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = 
  | 'active' 
  | 'canceled' 
  | 'expired' 
  | 'pending'; 