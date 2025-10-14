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
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

// Step 3: Business Profile
export interface BusinessProfileData {
  businessName: string;
  businessType: 'restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef';
  description: string;
  establishedYear: string;
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
    fssaiDocument: string;
    gstDocument: string;
    panDocument: string;
    bankDocument: string;
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
}

interface OnboardingStore {
  // Form data
  formData: OnboardingFormData;
  
  // Progress tracking
  currentStep: number;
  totalSteps: number;
  
  // Validation
  errors: Record<string, string>;
  
  // Submission state
  isSubmitting: boolean;
  submissionError: string | null;
  
  // Actions
  updateFormData: (step: keyof OnboardingFormData, data: any) => void;
  setCurrentStep: (step: number) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  validateStep: (step: number) => boolean;
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

      validateStep: (step: number) => {
        const { formData } = get();
        // Basic validation - can be expanded
        switch (step) {
          case 1:
            return !!(formData.step1?.firstName && formData.step1?.lastName && formData.step1?.email && formData.step1?.phoneNumber);
          case 2:
            return !!(formData.step2?.password && formData.step2?.confirmPassword && formData.step2?.agreeToTerms);
          case 3:
            return !!(formData.step3?.businessName && formData.step3?.businessType && formData.step3?.description);
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