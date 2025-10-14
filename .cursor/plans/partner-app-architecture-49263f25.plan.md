<!-- 49263f25-fd38-4427-8e48-f98fd165f920 905f4c87-d521-4ae1-977d-ea83469ce4cd -->
# Partner App Comprehensive Fixes

## 1. Create DateTimePicker Component

- Build reusable `DateTimePicker.tsx` component using `@react-native-community/datetimepicker`
- Support time mode for opening/closing hours
- Support date mode for year selection (extract year from date)
- Handle platform differences (iOS/Android/Web)

## 2. Fix Location-Hours Page Issues

- Make delivery radius slider/input editable
- Replace time inputs with DateTimePicker component
- Add proper state management for time values
- Ensure form validation works correctly

## 3. Fix Business Profile Issues

- Fix businessType array display (showing individual characters)
- Replace year input with DateTimePicker component
- Add proper formatting for business types display
- Ensure proper data structure for businessType array

## 4. Rename and Enhance Upload Service

- Rename `imageUploadService.ts` to `cloudinaryUploadService.ts`
- Fix FormData blob error for mobile platforms
- Update all imports across the app
- Improve file handling for different platforms

## 5. Fix Review Page Display Issues

- Replace raw Cloudinary URLs with actual image previews
- Create proper image display components
- Handle different file types (images vs documents)
- Add fallback for failed image loads

## 6. Add Frontend Validation

- Implement password validation with regex
- Add businessType array validation
- Add real-time validation feedback
- Prevent form submission with invalid data

## 7. Fix Platform Detection for API URLs

- Add platform detection utility
- Use localhost for web, EXPO_PUBLIC_PROD_API_BASE_URL for mobile
- Update environment configuration
- Test API connectivity on both platforms

## 8. Remove Bottom Back Buttons

- Remove back buttons from bottom of onboarding pages
- Keep only top navigation back buttons
- Ensure step counter works correctly

## 9. Fix Backend Validation Errors

- Update businessType handling to send proper array
- Ensure password meets backend requirements
- Fix documents validation structure

## 10. Implement Proper Progress Bar

- Research React Native progress bar best practices
- Implement native progress indicators
- Add smooth animations for upload progress
- Handle different file types properly

### To-dos

- [ ] Create reusable DateTimePicker component using expo date picker
- [ ] Fix delivery radius and time picker inputs in location-hours page
- [ ] Fix business type display and add year picker to business profile
- [ ] Rename imageUploadService to cloudinaryUploadService and fix blob errors
- [ ] Replace raw URLs with image previews on review page
- [ ] Implement comprehensive frontend validation for all form fields
- [ ] Add platform detection for API URL selection
- [ ] Remove bottom back buttons from onboarding pages
- [ ] Fix backend validation errors for password and businessType
- [ ] Implement proper React Native progress bar for uploads