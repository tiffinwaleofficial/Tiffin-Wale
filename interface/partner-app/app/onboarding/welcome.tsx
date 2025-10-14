import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Image } from '../../components/ui/Image';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, PersonalInfoData } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';

const Step1Welcome: React.FC = () => {
  const { theme } = useTheme();
  const { 
    currentStep, 
    totalSteps, 
    formData, 
    updateFormData, 
    setError, 
    clearError, 
    validateStep,
    setCurrentStep 
  } = useOnboardingStore();

  const [localData, setLocalData] = useState<PersonalInfoData>(
    formData.step1 || {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    }
  );

  const [errors, setLocalErrors] = useState<Record<string, string>>({});

  const validateField = (field: keyof PersonalInfoData, value: string): string => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        return '';
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ''))) return 'Please enter a valid 10-digit phone number';
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: keyof PersonalInfoData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    
    // Immediately update store for real-time persistence
    updateFormData('step1', newData);
    
    // Validate field
    const error = validateField(field, value);
    if (error) {
      setLocalErrors(prev => ({ ...prev, [field]: error }));
      setError(field, error);
    } else {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      clearError(field);
    }
  };

  const handleContinue = () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    Object.keys(localData).forEach((field) => {
      const error = validateField(field as keyof PersonalInfoData, localData[field as keyof PersonalInfoData]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setLocalErrors(newErrors);
      return;
    }

    // Save data and proceed
    updateFormData('step1', localData);
    setCurrentStep(2);
    router.push('./account-setup');
  };

  const handleLoginPress = () => {
    router.push('/(auth)/login');
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    localData.firstName.trim() && 
    localData.lastName.trim() && 
    localData.email.trim() && 
    localData.phoneNumber.trim();

  return (
    <Screen backgroundColor={theme.colors.background}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        {/* Back Button - Navigate to Login */}
        <BackButton 
          onPress={() => router.push('/(auth)/login')} 
          style={{ marginTop: 16, marginLeft: 16 }}
        />
        
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Container padding="lg">
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}>
              <Image
                source="https://via.placeholder.com/80x80/FF9F43/FFFFFF?text=TW"
                width={80}
                height={80}
                borderRadius={40}
                style={{ marginBottom: theme.spacing.md }}
              />
              <Text 
                variant="title" 
                style={{ 
                  textAlign: 'center', 
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.text 
                }}
              >
                Join TiffinWale Partner Network
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  textAlign: 'center', 
                  color: theme.colors.textSecondary,
                  lineHeight: 22 
                }}
              >
                Start earning with your delicious food. Join thousands of partners already making money with TiffinWale.
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.lg,
                  color: theme.colors.text 
                }}
              >
                Let's get started
              </Text>

              {/* First Name */}
              <Input
                label="First Name"
                value={localData.firstName}
                onChangeText={(value) => handleFieldChange('firstName', value)}
                placeholder="Enter your first name"
                error={errors.firstName}
                style={{ marginBottom: theme.spacing.md }}
              />

              {/* Last Name */}
              <Input
                label="Last Name"
                value={localData.lastName}
                onChangeText={(value) => handleFieldChange('lastName', value)}
                placeholder="Enter your last name"
                error={errors.lastName}
                style={{ marginBottom: theme.spacing.md }}
              />

              {/* Email */}
              <Input
                label="Email Address"
                value={localData.email}
                onChangeText={(value) => handleFieldChange('email', value)}
                placeholder="Enter your email address"
                type="email"
                error={errors.email}
                style={{ marginBottom: theme.spacing.md }}
              />

              {/* Phone Number */}
              <Input
                label="Phone Number"
                value={localData.phoneNumber}
                onChangeText={(value) => handleFieldChange('phoneNumber', value.replace(/\D/g, ''))}
                placeholder="Enter your phone number"
                type="phone"
                error={errors.phoneNumber}
                style={{ marginBottom: theme.spacing.lg }}
              />

              {/* Continue Button */}
              <Button
                title="Continue"
                onPress={handleContinue}
                disabled={!isFormValid}
                fullWidth
                style={{ marginBottom: theme.spacing.md }}
              />
            </Card>

            {/* Login Link */}
            <View style={{ alignItems: 'center' }}>
              <Text variant="body" style={{ color: theme.colors.textSecondary }}>
                Already have an account?{' '}
                <Text 
                  variant="body" 
                  style={{ 
                    color: theme.colors.primary,
                    textDecorationLine: 'underline' 
                  }}
                  onPress={handleLoginPress}
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default Step1Welcome;
