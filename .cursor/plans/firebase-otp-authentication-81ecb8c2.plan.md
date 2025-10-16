<!-- 81ecb8c2-e61a-4eb0-bbf5-7b6e92fe9380 f54abd8d-d449-46e3-8a26-c23388f0f02c -->
# Firebase OTP Authentication Implementation

## Overview

Replace the current email/password authentication with Firebase OTP system. Users will enter phone number (+91 prefix), receive OTP, verify, then either login (existing users) or proceed through onboarding (new users).

## Architecture Changes

### Frontend (Partner App)

- **New OTP Flow**: Phone input → OTP verification → User check → Login/Onboarding
- **Firebase Integration**: Add Firebase Auth with phone authentication
- **UI Components**: Phone input screen, OTP verification screen with 6-digit boxes
- **State Management**: Update auth context and onboarding store for phone-first flow

### Backend Integration

- **New Endpoints**: Phone verification, OTP validation, phone-based user lookup
- **Database Updates**: Add phone verification status to user/partner models
- **Existing Flow**: Maintain current partner registration but skip phone field validation

## Implementation Steps

### Phase 1: Firebase Setup & Dependencies

- Install Firebase packages (`firebase`, `@react-native-firebase/app`, `@react-native-firebase/auth`)
- Configure Firebase with provided credentials
- Setup Firebase Auth for phone authentication
- Add necessary Expo plugins and configuration

### Phase 2: Backend API Extensions

- Create `/auth/verify-phone` endpoint for OTP sending
- Create `/auth/verify-otp` endpoint for OTP validation
- Create `/auth/check-phone` endpoint to check if user exists
- Add phone verification fields to User and Partner models
- Update existing registration to store verified phone numbers

### Phase 3: Frontend OTP Components

- Create `PhoneInputScreen` with +91 prefix and Indian phone validation
- Create `OTPVerificationScreen` with 6-digit input boxes
- Implement Firebase phone auth integration
- Add loading states, error handling, and resend functionality

### Phase 4: Authentication Flow Integration

- Update `AuthProvider` to handle phone-based authentication
- Modify app routing to start with phone input instead of login
- Implement user existence check after OTP verification
- Route to dashboard (existing users) or onboarding (new users)

### Phase 5: Onboarding Flow Updates

- Remove phone number field from Step 1 (already verified)
- Pre-populate phone number in onboarding store
- Update registration API calls to include verified phone
- Maintain all existing onboarding steps and validation

### Phase 6: User Migration & Linking

- Create migration strategy for existing email-based users
- Implement phone number linking for existing accounts
- Add fallback authentication methods during transition
- Update user profile management to handle phone numbers

## Key Files to Modify

### Frontend

- `app/index.tsx` - Update initial routing logic
- `app/(auth)/` - Replace login with phone/OTP screens
- `context/AuthProvider.tsx` - Add Firebase auth integration
- `store/onboardingStore.ts` - Pre-populate phone number
- `app/onboarding/welcome.tsx` - Remove phone field
- `package.json` - Add Firebase dependencies

### Backend

- `src/modules/auth/auth.controller.ts` - Add OTP endpoints
- `src/modules/auth/auth.service.ts` - Add phone verification logic
- `src/modules/auth/dto/` - Create OTP-related DTOs
- `src/modules/user/user.entity.ts` - Add phone verification fields
- `src/modules/partner/partner.entity.ts` - Update phone storage

## Technical Considerations

### Security

- Implement rate limiting for OTP requests
- Add phone number validation and sanitization
- Secure Firebase configuration and API keys
- Implement proper error handling without exposing sensitive data

### User Experience

- Auto-detect and format phone numbers
- Implement OTP auto-fill on supported devices
- Add clear error messages and retry mechanisms
- Maintain loading states throughout the flow

### Data Consistency

- Ensure phone numbers are stored consistently across User and Partner entities
- Implement proper validation for Indian phone numbers (+91)
- Handle edge cases like number changes and re-verification

## Success Criteria

- Users can authenticate using only phone number and OTP
- Existing users can login directly after OTP verification
- New users proceed through existing onboarding flow
- Phone numbers are properly stored and linked to accounts
- All existing functionality remains intact
- Smooth migration path for current users

### To-dos

- [ ] Install and configure Firebase packages with phone authentication
- [ ] Create OTP verification and phone check endpoints in backend
- [ ] Create phone input screen with +91 prefix and validation
- [ ] Create OTP verification screen with 6-digit input boxes
- [ ] Integrate Firebase phone authentication in AuthProvider
- [ ] Update app routing to start with phone input instead of login
- [ ] Remove phone field from onboarding and pre-populate verified number
- [ ] Implement phone linking for existing email-based users