import { 
  signInWithPhoneNumber, 
  PhoneAuthProvider, 
  signInWithCredential,
  RecaptchaVerifier,
  ConfirmationResult,
  User,
  Auth
} from 'firebase/auth';
import { auth as firebaseAuth } from '../config/firebase';
import { Platform } from 'react-native';
import { config } from '../config';

const auth = firebaseAuth;

export interface PhoneAuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface OTPVerificationResult {
  success: boolean;
  user?: User;
  error?: string;
}

class PhoneAuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private confirmationResult: ConfirmationResult | null = null;

  /**
   * Initialize reCAPTCHA verifier for web platform
   * Production mode - Real SMS OTP enabled with Firebase Blaze Plan
   */
  private initializeRecaptcha(): void {
    if (Platform.OS === 'web' && !this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          if (__DEV__) console.log('✅ reCAPTCHA verified successfully');
        },
        'expired-callback': () => {
          console.warn('⚠️ reCAPTCHA expired, please refresh');
        }
      });
    }
  }

  /**
   * Format phone number to international format
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Always treat input as 10-digit Indian mobile number and add +91 prefix
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      // If user somehow entered with country code, use as is
      return `+${cleaned}`;
    } else {
      throw new Error('Invalid phone number format');
    }
  }

  /**
   * Validate Indian phone number
   */
  private validateIndianPhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid 10-digit Indian number or 12-digit with country code
    if (cleaned.length === 10) {
      // Valid Indian mobile number starts with 6, 7, 8, or 9
      return /^[6-9]\d{9}$/.test(cleaned);
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      const number = cleaned.substring(2);
      return /^[6-9]\d{9}$/.test(number);
    }
    
    return false;
  }

  /**
   * Send OTP to phone number
   * PRODUCTION MODE: Real SMS via Firebase (Blaze Plan enabled)
   */
  async sendOTP(phoneNumber: string): Promise<PhoneAuthResult> {
    try {
      console.log('📱 PhoneAuth: Starting OTP send process...');
      console.log('📱 PhoneAuth: Platform:', Platform.OS);
      console.log('📱 PhoneAuth: Phone number received:', phoneNumber);
      
      // Validate phone number
      if (!this.validateIndianPhoneNumber(phoneNumber)) {
        console.error('❌ PhoneAuth: Invalid phone number format');
        return {
          success: false,
          error: 'Please enter a valid Indian mobile number'
        };
      }

      const formattedNumber = this.formatPhoneNumber(phoneNumber);
      console.log('📱 PhoneAuth: Formatted number:', formattedNumber);
      
      // Initialize reCAPTCHA for web platform
      if (Platform.OS === 'web') {
        console.log('🌐 PhoneAuth: Web platform detected, initializing reCAPTCHA...');
        
        // Check if container exists
        const container = document.getElementById('recaptcha-container');
        if (!container) {
          console.error('❌ PhoneAuth: recaptcha-container div not found in DOM');
          throw new Error('reCAPTCHA container not found. Please refresh the page.');
        }
        console.log('✅ PhoneAuth: reCAPTCHA container found');
        
        this.initializeRecaptcha();
        if (!this.recaptchaVerifier) {
          throw new Error('reCAPTCHA verifier not initialized. Please refresh the page.');
        }
        console.log('✅ PhoneAuth: reCAPTCHA verifier initialized');
      }
      
      console.log('📱 PhoneAuth: Calling Firebase signInWithPhoneNumber...');
      
      // Send OTP via Firebase - Works for both Web and React Native (with Blaze plan)
      if (Platform.OS === 'web') {
        this.confirmationResult = await signInWithPhoneNumber(
          auth, 
          formattedNumber, 
          this.recaptchaVerifier!
        );
      } else {
        // For React Native, use Firebase JS SDK directly
        // Note: This requires proper Firebase configuration and Blaze plan
        this.confirmationResult = await signInWithPhoneNumber(
          auth, 
          formattedNumber, 
          this.recaptchaVerifier as any // React Native handles verification differently
        );
      }

      console.log('✅ PhoneAuth: Real SMS OTP sent successfully');
      console.log('✅ PhoneAuth: Confirmation result:', this.confirmationResult);

      return {
        success: true
      };
    } catch (error: any) {
      console.error('❌ PhoneAuth: Error sending OTP:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please contact support.';
      } else if (error.code === 'auth/missing-app-credential') {
        errorMessage = 'reCAPTCHA verification failed. Please try again.';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'Security verification failed. Please refresh and try again.';
      } else if (error.message?.includes('reCAPTCHA')) {
        errorMessage = 'reCAPTCHA error. Please refresh the page and try again.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(otpCode: string): Promise<OTPVerificationResult> {
    try {
      if (!this.confirmationResult) {
        return {
          success: false,
          error: 'No verification in progress. Please request OTP first.'
        };
      }

      // Verify the code
      const result = await this.confirmationResult.confirm(otpCode);
      
      return {
        success: true,
        user: result.user
      };
    } catch (error: any) {
      console.error('❌ Partner PhoneAuth: Error verifying OTP:', error);
      
      let errorMessage = 'Invalid OTP. Please try again.';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid verification code';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'Verification code has expired. Please request a new one.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(phoneNumber: string): Promise<PhoneAuthResult> {
    // Clear previous confirmation result
    this.confirmationResult = null;
    
    // Send new OTP
    return this.sendOTP(phoneNumber);
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await auth.signOut();
      this.confirmationResult = null;
    } catch (error) {
      console.error('❌ Partner PhoneAuth: Error signing out:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Get user phone number
   */
  getUserPhoneNumber(): string | null {
    const user = auth.currentUser;
    return user?.phoneNumber || null;
  }
}

export default new PhoneAuthService();