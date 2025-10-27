/**
 * Authentication API Service
 * All authentication-related API endpoints
 */

import { apiClient, handleApiError, retryRequest } from '../client';

/**
 * Register Partner Data Interface
 * Complete onboarding data structure
 */
export interface RegisterPartnerData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  
  // Step 2: Account Setup
  password?: string;
  
  // Step 3: Business Profile
  businessName: string;
  businessType?: string[];
  description?: string;
  establishedDate?: string;
  
  // Step 4: Location & Hours
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  businessHours?: {
    open: string;
    close: string;
    days: string[];
  };
  deliveryRadius?: number;
  
  // Step 5: Cuisine & Services
  cuisineTypes?: string[];
  isVegetarian?: boolean;
  hasDelivery?: boolean;
  hasPickup?: boolean;
  acceptsCash?: boolean;
  acceptsCard?: boolean;
  minimumOrderAmount?: number;
  deliveryFee?: number;
  estimatedDeliveryTime?: number;
  
  // Step 6: Images & Branding
  logoUrl?: string;
  bannerUrl?: string;
  images?: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  
  // Step 7: Documents
  fssaiLicense?: string;
  gstNumber?: string;
  panNumber?: string;
  licenseNumber?: string;
  documents?: {
    licenseDocuments?: string[];
    certificationDocuments?: string[];
    identityDocuments?: string[];
    otherDocuments?: string[];
  };
  
  // Step 8: Payment Setup
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
  upiId?: string;
  commissionRate?: number;
  
  // Step 9: Final Preferences
  agreeToTerms?: boolean;
  agreeToMarketing?: boolean;
  
  // Other
  role?: string;
}

/**
 * Login Response Interface
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email?: string;
    phoneNumber?: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  partner?: any;
}

/**
 * Token Refresh Response Interface
 */
export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Authentication API Methods
 */
export const authApi = {
  /**
   * Check if phone number exists for partner role
   * Backend expects 10 digit phone number and role
   */
  checkPhone: async (phoneNumber: string): Promise<{ exists: boolean; message?: string }> => {
    try {
      // Extract 10 digits from phone number (remove +91 prefix if present)
      const cleanPhone = phoneNumber.replace(/^\+91/, '').replace(/\D/g, '').slice(-10);
      
      if (cleanPhone.length !== 10) {
        throw new Error('Phone number must be exactly 10 digits');
      }
      
      const response = await retryRequest(() =>
        apiClient.post('/auth/check-phone', {
          phoneNumber: cleanPhone, // Send only 10 digit number
          role: 'partner', // Always check for partner role
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'checkPhone');
    }
  },

  /**
   * Login with phone number and Firebase UID for partner role
   * Backend expects 10 digit phone number and role
   */
  loginWithPhone: async (
    phoneNumber: string,
    firebaseUid: string
  ): Promise<LoginResponse> => {
    try {
      // Extract 10 digits from phone number (remove +91 prefix if present)
      const cleanPhone = phoneNumber.replace(/^\+91/, '').replace(/\D/g, '').slice(-10);
      
      if (cleanPhone.length !== 10) {
        throw new Error('Phone number must be exactly 10 digits');
      }
      
      const response = await retryRequest(() =>
        apiClient.post<LoginResponse>('/auth/login-phone', {
          phoneNumber: cleanPhone,
          firebaseUid,
          role: 'partner', // Always login as partner role
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'loginWithPhone');
    }
  },

  /**
   * Register new partner
   * Backend expects 10 digit phone number
   */
  registerPartner: async (data: RegisterPartnerData): Promise<LoginResponse> => {
    try {
      // Clean phone number if present
      const cleanData = { ...data };
      if (cleanData.phoneNumber) {
        cleanData.phoneNumber = cleanData.phoneNumber.replace(/^\+91/, '').replace(/\D/g, '').slice(-10);
        
        if (cleanData.phoneNumber.length !== 10) {
          throw new Error('Phone number must be exactly 10 digits');
        }
      }
      
      const response = await retryRequest(() =>
        apiClient.post<LoginResponse>('/auth/register-partner', {
          ...cleanData,
          role: 'partner', // Ensure partner role
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'registerPartner');
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
    try {
      const response = await apiClient.post<TokenRefreshResponse>('/auth/refresh-token', {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'refreshToken');
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Don't throw on logout errors, just log
      if (__DEV__) console.warn('⚠️ Logout API error (continuing anyway):', error);
    }
  },

  /**
   * Change password
   */
  changePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    try {
      const response = await retryRequest(() =>
        apiClient.post('/auth/change-password', {
          oldPassword,
          newPassword,
        })
      );
      return response.data;
    } catch (error) {
      return handleApiError(error, 'changePassword');
    }
  },
};

export default authApi;

