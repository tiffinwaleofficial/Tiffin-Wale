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

// Step 2: Business Profile
export interface BusinessProfileData {
  businessName: string;
  businessType: ('restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef')[];
  description: string;
  establishedDate: string; // ISO date string (YYYY-MM-DD)
}

// Step 3: Location & Hours
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

// Step 4: Cuisine & Services
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

// Step 5: Images & Branding
export interface ImagesBrandingData {
  logoUrl: string;
  bannerUrl: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

// Step 6: Documents
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

// Step 7: Payment Setup
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
  step2?: BusinessProfileData;
  step3?: LocationHoursData;
  step4?: CuisineServicesData;
  step5?: ImagesBrandingData;
  step6?: DocumentsData;
  step7?: PaymentSetupData;
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
  navigationHistory: number[]; // Track which steps user has visited
  
  // Firebase authentication
  firebaseUid: string | null;
  verifiedPhoneNumber: string | null;
  
  // Validation
  errors: Record<string, string>;
  isStepValid: Record<number, boolean>;
  
  // Submission state
  isSubmitting: boolean;
  submissionError: string | null;
  
  // Actions
  updateFormData: (step: keyof OnboardingFormData, data: any) => void;
  setVerifiedPhoneNumber: (phoneNumber: string, firebaseUid: string) => void;
  setCurrentStep: (step: number) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
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
      currentStep: 1, // Start from step 1 (Personal Info, after phone verification)
      totalSteps: 8, // Removed account-setup step (password not needed with OTP login)
      navigationHistory: [1], // Track navigation starting from step 1
      firebaseUid: null,
      verifiedPhoneNumber: null,
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

      setVerifiedPhoneNumber: (phoneNumber, firebaseUid) => {
        set((state) => ({
          verifiedPhoneNumber: phoneNumber,
          firebaseUid: firebaseUid,
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
          isStepValid: {
            ...state.isStepValid,
            1: true, // Phone is verified
          },
        }));
      },

      setCurrentStep: (step) => {
        set((state) => {
          const history = [...state.navigationHistory];
          // Add to history if not already the last step
          if (history[history.length - 1] !== step) {
            history.push(step);
          }
          return {
            currentStep: step,
            navigationHistory: history,
          };
        });
      },

      goToPreviousStep: () => {
        set((state) => {
          const history = [...state.navigationHistory];
          if (history.length > 1) {
            history.pop(); // Remove current step
            const previousStep = history[history.length - 1];
            return {
              currentStep: previousStep,
              navigationHistory: history,
            };
          }
          return state;
        });
      },

      goToNextStep: () => {
        const { currentStep, totalSteps } = get();
        if (currentStep < totalSteps) {
          get().setCurrentStep(currentStep + 1);
        }
      },

      canGoBack: () => {
        const { navigationHistory } = get();
        return navigationHistory.length > 1;
      },

      canGoForward: () => {
        const { currentStep, totalSteps, isStepValid } = get();
        return currentStep < totalSteps && isStepValid[currentStep];
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
            return !!(formData.step2?.businessName && formData.step2?.businessType && formData.step2?.description);
          case 3:
            return !!(formData.step3?.address?.street && formData.step3?.address?.city && formData.step3?.address?.state && formData.step3?.address?.postalCode);
          case 4:
            return !!(formData.step4?.cuisineTypes && formData.step4?.cuisineTypes.length > 0);
          case 5:
            return true; // Images are optional
          case 6:
            return !!(formData.step6?.fssaiLicense && formData.step6?.gstNumber);
          case 7:
            return !!(formData.step7?.bankDetails?.accountNumber && formData.step7?.bankDetails?.ifscCode);
          case 8:
            return !!(formData.agreeToTerms); // Final step requires terms agreement
          default:
            return true;
        }
      },

      submitApplication: async () => {
        const { formData } = get();
        
        set({ isSubmitting: true, submissionError: null });

        try {
          // Import auth store dynamically to avoid circular dependency
          const { useAuthStore } = await import('./authStore');
          const { registerPartner } = useAuthStore.getState();
          
          // Map ALL onboarding data to registration format - comprehensive mapping
          const registrationData = {
            // Step 1: Personal Info
            firstName: formData.step1?.firstName || '',
            lastName: formData.step1?.lastName || '',
            email: formData.step1?.email || '',
            phoneNumber: formData.step1?.phoneNumber || '',
            
            // Step 2: Business Profile
            businessName: formData.step2?.businessName || '',
            businessType: formData.step2?.businessType || [],
            description: formData.step2?.description || '',
            establishedDate: formData.step2?.establishedDate,
            
            // Step 3: Location & Hours
            address: formData.step3?.address ?
              `${formData.step3.address.street}, ${formData.step3.address.city}, ${formData.step3.address.state} ${formData.step3.address.postalCode}` 
              : undefined,
            city: formData.step3?.address?.city,
            state: formData.step3?.address?.state,
            pincode: formData.step3?.address?.postalCode,
            country: formData.step3?.address?.country || 'India',
            businessHours: formData.step3?.businessHours,
            deliveryRadius: formData.step3?.deliveryRadius,
            
            // Step 4: Cuisine & Services
            cuisineTypes: formData.step4?.cuisineTypes || [],
            isVegetarian: formData.step4?.isVegetarian,
            hasDelivery: formData.step4?.hasDelivery,
            hasPickup: formData.step4?.hasPickup,
            acceptsCash: formData.step4?.acceptsCash,
            acceptsCard: formData.step4?.acceptsCard,
            minimumOrderAmount: formData.step4?.minimumOrderAmount,
            deliveryFee: formData.step4?.deliveryFee,
            estimatedDeliveryTime: formData.step4?.estimatedDeliveryTime,
            
            // Step 5: Images & Branding
            logoUrl: formData.step5?.logoUrl,
            bannerUrl: formData.step5?.bannerUrl,
            images: [formData.step5?.logoUrl, formData.step5?.bannerUrl].filter(Boolean) as string[],
            socialMedia: formData.step5?.socialMedia,
            
            // Step 6: Documents
            fssaiLicense: formData.step6?.fssaiLicense,
            gstNumber: formData.step6?.gstNumber,
            panNumber: formData.step6?.panNumber,
            licenseNumber: formData.step6?.licenseNumber,
            documents: formData.step6?.documents,
            
            // Step 7: Payment Setup
            bankDetails: formData.step7?.bankDetails,
            upiId: formData.step7?.upiId,
            commissionRate: formData.step7?.commissionRate,
            
            // Step 8: Final Preferences
            agreeToTerms: formData.agreeToTerms,
            agreeToMarketing: formData.agreeToMarketing,
          };

          // Call auth store registration (auto-login after success)
          await registerPartner(registrationData);
          
          if (__DEV__) console.log('✅ Onboarding: Registration successful with complete data');
          
          set({ isSubmitting: false });
          
          // Clear onboarding data after successful registration
          get().resetOnboarding();
        } catch (error: any) {
          console.error('❌ Onboarding: Registration failed:', error);
          set({ 
            isSubmitting: false, 
            submissionError: error instanceof Error ? error.message : 'Registration failed. Please try again.' 
          });
          throw error;
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