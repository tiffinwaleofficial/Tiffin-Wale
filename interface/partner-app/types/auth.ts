export interface LoginResponse {
  token: string;
  accessToken?: string; // Alternative token field name
  refreshToken?: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  partner?: PartnerProfile;
}

export interface PartnerProfile extends AuthUser {
  businessName: string;
  description: string;
  cuisineTypes: string[];
  address: Address;
  businessHours: BusinessHours;
  logoUrl?: string;
  bannerUrl?: string;
  isAcceptingOrders: boolean;
  isFeatured: boolean;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface BusinessHours {
  open: string; // "09:00"
  close: string; // "21:00"
  days: string[]; // ["Monday", "Tuesday", ...]
}

export interface CreatePartnerData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  businessName: string;
  phoneNumber: string;
  description: string;
  cuisineTypes: string[];
  address: Address;
  businessHours: BusinessHours;
  logoUrl?: string;
  bannerUrl?: string;
  isAcceptingOrders?: boolean;
  isFeatured?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  partner: PartnerProfile | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  isLoggingOut: boolean;
} 