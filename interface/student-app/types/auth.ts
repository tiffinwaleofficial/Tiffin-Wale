export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerProfile extends UserProfile {
  addresses: Address[];
  defaultAddress?: Address;
  preferences?: {
    dietaryRestrictions?: string[];
    allergies?: string[];
    spiceLevel?: 'mild' | 'medium' | 'spicy';
  };
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: CustomerProfile;
  roles: UserRole[];
  expiresIn: number;
  tokenType: string;
}

export interface AuthError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
} 