export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
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
  lastLoginTime?: string;
  tokenExpiryTime?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PhoneLoginCredentials {
  phoneNumber: string;
  firebaseUid: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  partner?: any; // Will be typed properly when we integrate partner types
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

