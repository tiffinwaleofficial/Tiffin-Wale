import React, { useState, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Image } from '../../components/ui/Image';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, PersonalInfoData } from '../../store/onboardingStore';

export default function Step1Welcome() {
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

  // Ensure we're on step 1 when this component loads
  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

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
        // Phone number is already verified, no validation needed
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
    router.push('./business-profile');
  };

  const handleLoginPress = () => {
    router.push('/(auth)/phone-input');
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    localData.firstName.trim() && 
    localData.lastName.trim() && 
    localData.email.trim() && 
    localData.phoneNumber.trim(); // Phone number is pre-populated from verification

  return (
    <Screen backgroundColor="#FFFAF0">
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        {/* Back Button - Navigate to Login */}
        <BackButton 
          onPress={() => router.push('/(auth)/phone-input')} 
          style={styles.backButton}
        />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Container padding="lg">
            {/* Header */}
            <View style={styles.header}>
              <Image
                source="https://via.placeholder.com/80x80/FF9F43/FFFFFF?text=TW"
                width={80}
                height={80}
                borderRadius={40}
                style={styles.logo}
              />
              <Text 
                variant="title" 
                style={styles.title}
              >
                Join TiffinWale Partner Network
              </Text>
              <Text 
                variant="body" 
                style={styles.subtitle}
              >
                Start earning with your delicious food. Join thousands of partners already making money with TiffinWale.
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={styles.card}>
              <Text 
                variant="subtitle" 
                style={styles.formTitle}
              >
                Let's get started
              </Text>

              {/* First Name */}
              <Input
                label="First Name"
                value={localData.firstName}
                onChangeText={(value: string) => handleFieldChange('firstName', value)}
                placeholder="Enter your first name"
                error={errors.firstName}
                containerStyle={styles.inputMargin}
              />

              {/* Last Name */}
              <Input
                label="Last Name"
                value={localData.lastName}
                onChangeText={(value: string) => handleFieldChange('lastName', value)}
                placeholder="Enter your last name"
                error={errors.lastName}
                containerStyle={styles.inputMargin}
              />

              {/* Email */}
              <Input
                label="Email Address"
                value={localData.email}
                onChangeText={(value: string) => handleFieldChange('email', value)}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                containerStyle={styles.inputMargin}
              />

              {/* Phone Number - Already Verified */}
              <View style={styles.phoneContainer}>
                <Text style={styles.phoneLabel}>
                  Phone Number (Verified)
                </Text>
                <View style={styles.phoneVerifiedBox}>
                  <Text style={styles.phoneNumber}>
                    +91 {localData.phoneNumber.replace(/^\+91/, '').replace(/(\d{5})(\d{5})/, '$1 $2')}
                  </Text>
                </View>
              </View>

              {/* Continue Button */}
              <Button
                title="Continue"
                onPress={handleContinue}
                disabled={!isFormValid}
                fullWidth
                style={styles.buttonMargin}
              />
            </Card>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    marginTop: 16,
    marginLeft: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1A1A1A',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 22,
  },
  card: {
    marginBottom: 24,
  },
  formTitle: {
    marginBottom: 24,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
  inputMargin: {
    marginBottom: 16,
  },
  phoneContainer: {
    marginBottom: 24,
  },
  phoneLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  phoneVerifiedBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  phoneNumber: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#10B981',
  },
  buttonMargin: {
    marginBottom: 16,
  },
});
