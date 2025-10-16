import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Step 1: Personal Information
export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

// Alias for backward compatibility
export type WelcomeData = PersonalInfoData;

// Step 2: Account Setup
export interface AccountSetupData {
  password: string;
  confirmPassword: string;
}

// Step 3: Business Profile
export interface BusinessProfileData {
  businessName: string;
  businessType: ('restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef')[];
  description: string;
  establishedDate: string; // ISO date string (YYYY-MM-DD)
}

// Step 4: Location & Hours
export interface LocationHoursData {
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  businessHours: {
    open: string;
    close: string;
    days: string[];
  };
  deliveryRadius: number;
}

// Step 5: Cuisine & Services
export interface CuisineServicesData {
  cuisineTypes: string[];
  isVegetarian: boolean;
  hasDelivery: boolean;
  hasPickup: boolean;
  acceptsCash: boolean;
  acceptsCard: boolean;
  minimumOrderAmount: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
}

// Step 6: Images & Branding
export interface ImagesBrandingData {
  logoUrl: string;
  bannerUrl: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

// Step 7: Documents
export interface DocumentsData {
  fssaiLicense: string;
  gstNumber: string;
  panNumber: string;
  licenseNumber: string;
  documents: {
    licenseDocuments: string[];
    certificationDocuments: string[];
    identityDocuments: string[];
    otherDocuments: string[];
  };
}

// Step 8: Payment Setup
export interface PaymentSetupData {
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
  upiId: string;
  commissionRate: number;
}

// Complete form data
export interface OnboardingFormData {
  step1?: PersonalInfoData;
  step2?: AccountSetupData;
  step3?: BusinessProfileData;
  step4?: LocationHoursData;
  step5?: CuisineServicesData;
  step6?: ImagesBrandingData;
  step7?: DocumentsData;
  step8?: PaymentSetupData;
  // Final submission preferences
  agreeToTerms?: boolean;
  agreeToMarketing?: boolean;
}

interface OnboardingStore {
  // Form data
  formData: OnboardingFormData;
  
  // Progress tracking
  currentStep: number;
  totalSteps: number;
  
  // Validation
  errors: Record<string, string>;
  isStepValid: Record<number, boolean>;
  
  // Submission state
  isSubmitting: boolean;
  submissionError: string | null;
  
  // Actions
  updateFormData: (step: keyof OnboardingFormData, data: any) => void;
  setVerifiedPhoneNumber: (phoneNumber: string) => void;
  setCurrentStep: (step: number) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  setStepValid: (step: number, isValid: boolean) => void;
  validateStep: (step: number) => boolean;
  validateField: (field: string, value: string) => string | null;
  submitApplication: () => Promise<void>;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      formData: {},
      currentStep: 1,
      totalSteps: 9,
      errors: {},
      isStepValid: {},
      isSubmitting: false,
      submissionError: null,

      // Actions
      updateFormData: (step, data) => {
        set((state) => ({
          formData: {
            ...state.formData,
            [step]: data,
          },
        }));
      },

      setVerifiedPhoneNumber: (phoneNumber) => {
        set((state) => ({
          formData: {
            ...state.formData,
            step1: {
              ...state.formData.step1,
              firstName: state.formData.step1?.firstName || '',
              lastName: state.formData.step1?.lastName || '',
              email: state.formData.step1?.email || '',
              phoneNumber: phoneNumber,
            },
          },
        }));
      },

      setCurrentStep: (step) => {
        set({ currentStep: step });
      },

      setError: (field, error) => {
        set((state) => ({
          errors: {
            ...state.errors,
            [field]: error,
          },
        }));
      },

      clearError: (field) => {
        set((state) => {
          const newErrors = { ...state.errors };
          delete newErrors[field];
          return { errors: newErrors };
        });
      },

      clearAllErrors: () => {
        set({ errors: {} });
      },

      setStepValid: (step, isValid) => {
        set((state) => ({
          isStepValid: {
            ...state.isStepValid,
            [step]: isValid,
          },
        }));
      },

      validateField: (field, value) => {
        // Email validation
        if (field === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
          }
        }

        // Password validation
        if (field === 'password') {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          if (!passwordRegex.test(value)) {
            return 'Password must contain uppercase, lowercase, number, and special character';
          }
        }

        // Phone validation
        if (field === 'phoneNumber') {
          const phoneRegex = /^[0-9]{10,15}$/;
          if (!phoneRegex.test(value)) {
            return 'Phone number must be 10-15 digits';
          }
        }

        // Required field validation
        if (field.includes('required') && !value.trim()) {
          return 'This field is required';
        }

        return null;
      },

      validateStep: (step: number) => {
        const { formData } = get();
        // Basic validation - can be expanded
        switch (step) {
          case 1:
            return !!(formData.step1?.firstName && formData.step1?.lastName && formData.step1?.email && formData.step1?.phoneNumber);
          case 2:
            return !!(formData.step2?.password && formData.step2?.confirmPassword);
          case 3:
            return !!(formData.step3?.businessName && formData.step3?.businessType && formData.step3?.description);
          case 4:
            return !!(formData.step4?.address?.street && formData.step4?.address?.city && formData.step4?.address?.state && formData.step4?.address?.postalCode);
          case 5:
            return !!(formData.step5?.cuisineTypes && formData.step5?.cuisineTypes.length > 0);
          case 6:
            return true; // Images are optional
          case 7:
            return !!(formData.step7?.fssaiLicense && formData.step7?.gstNumber);
          case 8:
            return !!(formData.step8?.bankDetails?.accountNumber && formData.step8?.bankDetails?.ifscCode);
          case 9:
            return !!(formData.agreeToTerms); // Final step requires terms agreement
          default:
            return true;
        }
      },

      submitApplication: async () => {
        const { formData } = get();
        
        set({ isSubmitting: true, submissionError: null });

        try {
          // TODO: Implement actual API submission
          // For now, simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Simulate success
          console.log('Onboarding data submitted:', formData);
          
          set({ isSubmitting: false });
        } catch (error) {
          set({ 
            isSubmitting: false, 
            submissionError: error instanceof Error ? error.message : 'Submission failed' 
          });
        }
      },

      resetOnboarding: () => {
        set({
          formData: {},
          currentStep: 1,
          errors: {},
          isSubmitting: false,
          submissionError: null,
        });
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);