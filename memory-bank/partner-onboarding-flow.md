# 🚀 Partner Onboarding Flow - Complete Architecture

## 📊 Backend Analysis Summary

### ✅ Required Fields (Must be collected)
```typescript
// REQUIRED FIELDS from Partner Schema
- user: User (linked to User schema)
- businessName: string
- description: string  
- address: Address (street, city, state, postalCode, country)
- businessHours: BusinessHours (open, close, days[])
```

### ✅ Optional Fields (Can be set later)
```typescript
// OPTIONAL FIELDS with defaults
- cuisineTypes: string[] (default: [])
- logoUrl: string (default: "")
- bannerUrl: string (default: "")
- gstNumber: string (default: "")
- licenseNumber: string (default: "")
- establishedYear: number (default: 0)
- contactEmail: string (default: "")
- contactPhone: string (default: "")
- whatsappNumber: string (default: "")
- deliveryRadius: number (default: 5)
- minimumOrderAmount: number (default: 100)
- deliveryFee: number (default: 0)
- estimatedDeliveryTime: number (default: 30)
- commissionRate: number (default: 20)
- socialMedia: object (default: {})
- isVegetarian: boolean (default: false)
- hasDelivery: boolean (default: true)
- hasPickup: boolean (default: true)
- acceptsCash: boolean (default: true)
- acceptsCard: boolean (default: true)
```

### ❌ Missing Fields (Need to add to backend)
```typescript
// MISSING FIELDS - Need to add to Partner Schema
- businessType: string (Restaurant, Cloud Kitchen, Catering, etc.)
- fssaiLicense: string (Food Safety License - Required in India)
- panNumber: string (PAN Card - Required for GST)
- bankDetails: object (Account details for payments)
- documents: object (Uploaded documents)
- verificationStatus: string (pending, verified, rejected)
```

## 🎯 Modern 9-Step Onboarding Flow

### Phase 1: Account Creation (Steps 1-2)
1. **Welcome & Basic Info** - First name, last name, email, phone
2. **Account Setup** - Password, terms acceptance

### Phase 2: Business Information (Steps 3-6)
3. **Business Profile** - Business name, type, description, established year
4. **Location & Hours** - Address, business hours, delivery radius
5. **Cuisine & Services** - Cuisine types, services, payment methods
6. **Images & Branding** - Logo, banner, social media links

### Phase 3: Verification & Setup (Steps 7-9)
7. **Documents & Verification** - FSSAI, GST, PAN, license documents
8. **Payment Setup** - Bank details, UPI ID, commission info
9. **Review & Submit** - Review all information and submit

## 🎨 UI/UX Design Principles

### Modern App Patterns
- **Progress Indicators**: Clear step progress (1/9, 2/9, etc.)
- **Card-based Layout**: Each step in a clean card
- **Smart Defaults**: Pre-filled common values
- **Auto-save**: Save progress as user types
- **Validation**: Real-time field validation
- **Smooth Transitions**: Animated screen transitions
- **Mobile-first**: Optimized for mobile screens

### User Experience Features
- **Skip Optional Fields**: Allow skipping non-required fields
- **Save & Continue Later**: Resume from where they left off
- **Help Tooltips**: Contextual help for complex fields
- **Image Guidelines**: Clear requirements for uploads
- **Error Recovery**: Graceful error handling
- **Success Feedback**: Clear confirmation messages

## 🔧 Technical Implementation

### State Management
```typescript
interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  formData: OnboardingFormData;
  isSubmitting: boolean;
  errors: Record<string, string>;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  submitApplication: () => Promise<void>;
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
}
```

### Form Validation
```typescript
const validationSchema = {
  step1: {
    firstName: { required: true, minLength: 2 },
    lastName: { required: true, minLength: 2 },
    email: { required: true, email: true },
    phoneNumber: { required: true, pattern: /^[0-9]{10}$/ }
  },
  step2: {
    password: { required: true, minLength: 8 },
    confirmPassword: { required: true, match: 'password' },
    agreeToTerms: { required: true }
  },
  // ... more validation schemas for each step
};
```

### API Integration
```typescript
// Create user account
const createUser = async (userData: CreateUserDto) => {
  return api.authControllerRegister(userData);
};

// Create partner profile
const createPartner = async (partnerData: CreatePartnerDto) => {
  return api.partnerControllerCreate(partnerData);
};

// Upload documents
const uploadDocument = async (file: File, type: string) => {
  return api.uploadControllerUpload({ file, type });
};
```

## 📱 Detailed Screen Specifications

### Step 1: Welcome & Basic Info
```typescript
interface WelcomeData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

// UI Components:
- Welcome header with app logo
- "Join TiffinWale Partner Network" title
- Subtitle: "Start earning with your delicious food"
- Form fields: First Name, Last Name, Email, Phone
- "Continue" button
- "Already have an account? Login" link
```

### Step 2: Account Setup
```typescript
interface AccountSetupData {
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

// UI Components:
- Progress indicator (2/9)
- "Create your account" title
- Password field with strength indicator
- Confirm password field
- Terms & conditions checkbox
- Marketing emails checkbox (optional)
- "Create Account" button
- Back button
```

### Step 3: Business Profile
```typescript
interface BusinessProfileData {
  businessName: string;
  businessType: 'restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef';
  description: string;
  establishedYear: number;
}

// UI Components:
- Progress indicator (3/9)
- "Tell us about your business" title
- Business name input
- Business type selector (cards with icons)
- Description textarea (with character count)
- Established year picker
- "Continue" button
- Back button
```

### Step 4: Location & Hours
```typescript
interface LocationHoursData {
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

// UI Components:
- Progress indicator (4/9)
- "Where is your business located?" title
- Address form with auto-complete
- Map integration (optional)
- Business hours selector
- Days of operation (multi-select)
- Delivery radius slider
- "Continue" button
- Back button
```

### Step 5: Cuisine & Services
```typescript
interface CuisineServicesData {
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

// UI Components:
- Progress indicator (5/9)
- "What do you serve?" title
- Cuisine types selector (chips/tags)
- Service options (delivery/pickup)
- Payment methods (cash/card)
- Vegetarian toggle
- Minimum order amount input
- Delivery fee input
- Estimated delivery time slider
- "Continue" button
- Back button
```

### Step 6: Images & Branding
```typescript
interface ImagesBrandingData {
  logoUrl: string;
  bannerUrl: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

// UI Components:
- Progress indicator (6/9)
- "Showcase your business" title
- Logo upload (with preview)
- Banner image upload (with preview)
- Social media links (optional)
- Image guidelines/requirements
- "Continue" button
- Back button
```

### Step 7: Documents & Verification
```typescript
interface DocumentsData {
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

// UI Components:
- Progress indicator (7/9)
- "Verify your business" title
- Document upload sections
- License number inputs
- Document preview
- Upload progress indicators
- "Continue" button
- Back button
```

### Step 8: Payment Setup
```typescript
interface PaymentSetupData {
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
  upiId: string;
  commissionRate: number;
}

// UI Components:
- Progress indicator (8/9)
- "Payment setup" title
- Bank details form
- UPI ID input
- Commission rate display (read-only)
- Payment terms
- "Continue" button
- Back button
```

### Step 9: Review & Submit
```typescript
interface ReviewData {
  // All previous data combined
  // Read-only review of all information
}

// UI Components:
- Progress indicator (9/9)
- "Review your information" title
- Summary cards for each section
- Edit buttons for each section
- Terms acceptance checkbox
- "Submit Application" button
- Back button
```

## 🚀 Implementation Priority

### Week 1: Core Onboarding Flow
1. ✅ **Step 1-2**: Account creation screens
2. ✅ **Step 3-4**: Business profile and location
3. ✅ **Form validation**: Real-time validation
4. ✅ **State management**: Onboarding store

### Week 2: Advanced Features
1. ✅ **Step 5-6**: Cuisine, services, and images
2. ✅ **Step 7-8**: Documents and payment setup
3. ✅ **Step 9**: Review and submit
4. ✅ **API integration**: Backend integration

### Week 3: Polish & Testing
1. ✅ **UI/UX polish**: Animations and transitions
2. ✅ **Error handling**: Comprehensive error handling
3. ✅ **Testing**: Unit and integration tests
4. ✅ **Documentation**: User guides and API docs

## 💡 Key Benefits

### User Experience
- ✅ **Modern flow**: Step-by-step like Uber, Airbnb
- ✅ **Mobile-optimized**: Perfect for mobile screens
- ✅ **Progress tracking**: Clear progress indicators
- ✅ **Auto-save**: Never lose progress

### Business Benefits
- ✅ **Higher completion**: Reduced abandonment
- ✅ **Better data quality**: Validated information
- ✅ **Faster onboarding**: Streamlined process
- ✅ **Professional image**: Modern app experience

## 🔧 Required Backend Updates

### Add to Partner Schema
```typescript
// Add these fields to Partner Schema
@Prop({ required: true })
businessType: 'restaurant' | 'cloud_kitchen' | 'catering' | 'home_chef';

@Prop({ required: true })
fssaiLicense: string;

@Prop({ required: true })
panNumber: string;

@Prop({ type: Object, required: true })
bankDetails: {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
};

@Prop({ type: Object, default: {} })
documents: {
  fssaiDocument?: string;
  gstDocument?: string;
  panDocument?: string;
  bankDocument?: string;
};

@Prop({ 
  type: String,
  enum: ['pending', 'verified', 'rejected'],
  default: 'pending'
})
verificationStatus: string;
```

---

*This document defines the complete partner onboarding flow architecture. All implementation should follow these specifications.*
