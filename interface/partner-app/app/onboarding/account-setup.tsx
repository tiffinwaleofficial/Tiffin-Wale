import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Checkbox } from '../../components/ui/Checkbox';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, AccountSetupData } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';

const Step2AccountSetup: React.FC = () => {
  const { theme } = useTheme();
  const { 
    currentStep, 
    totalSteps, 
    formData, 
    updateFormData, 
    setError, 
    clearError, 
    setCurrentStep 
  } = useOnboardingStore();

  const [localData, setLocalData] = useState<AccountSetupData>(
    formData.step2 || {
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      agreeToMarketing: false,
    }
  );

  const [errors, setLocalErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (password.length === 0) return { strength: 0, label: '', color: theme.colors.border };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = [
      theme.colors.border,
      theme.colors.error,
      theme.colors.warning,
      theme.colors.info,
      theme.colors.success,
      theme.colors.success
    ];

    return {
      strength,
      label: labels[strength],
      color: colors[strength]
    };
  };

  const validateField = (field: keyof AccountSetupData, value: string | boolean): string => {
    switch (field) {
      case 'password':
        if (!value || (typeof value === 'string' && value.length === 0)) return 'Password is required';
        if (typeof value === 'string' && value.length < 8) return 'Password must be at least 8 characters';
        return '';
      case 'confirmPassword':
        if (!value || (typeof value === 'string' && value.length === 0)) return 'Please confirm your password';
        if (typeof value === 'string' && value !== localData.password) return 'Passwords do not match';
        return '';
      case 'agreeToTerms':
        if (!value) return 'You must agree to the terms and conditions';
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: keyof AccountSetupData, value: string | boolean) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    
    // Immediately update store for real-time persistence
    updateFormData('step2', newData);
    
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

    // Special validation for confirm password when password changes
    if (field === 'password' && localData.confirmPassword) {
      const confirmError = validateField('confirmPassword', localData.confirmPassword);
      if (confirmError) {
        setLocalErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        setError('confirmPassword', confirmError);
      } else {
        setLocalErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
        clearError('confirmPassword');
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    router.back();
  };

  const handleContinue = () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    Object.keys(localData).forEach((field) => {
      const error = validateField(field as keyof AccountSetupData, localData[field as keyof AccountSetupData]);
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
    updateFormData('step2', localData);
    setCurrentStep(3);
    router.push('./business-profile');
  };

  const passwordStrength = getPasswordStrength(localData.password);
  const isFormValid = Object.keys(errors).length === 0 && 
    localData.password.length >= 8 && 
    localData.password === localData.confirmPassword && 
    localData.agreeToTerms;

  return (
    <Screen backgroundColor={theme.colors.background}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        {/* Back Button */}
        <BackButton 
          onPress={() => router.back()} 
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
              <Text 
                variant="title" 
                style={{ 
                  textAlign: 'center', 
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.text 
                }}
              >
                Create your account
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  textAlign: 'center', 
                  color: theme.colors.textSecondary,
                  lineHeight: 22 
                }}
              >
                Choose a secure password to protect your account
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
              {/* Password */}
              <Input
                label="Password"
                value={localData.password}
                onChangeText={(value) => handleFieldChange('password', value)}
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                error={errors.password}
                rightIcon={showPassword ? '👁️' : '👁️‍🗨️'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                style={{ marginBottom: theme.spacing.sm }}
              />

              {/* Password Strength Indicator */}
              {localData.password.length > 0 && (
                <View style={{ marginBottom: theme.spacing.md }}>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    marginBottom: theme.spacing.xs 
                  }}>
                    <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                      Password strength: 
                    </Text>
                    <Text 
                      variant="caption" 
                      style={{ 
                        color: passwordStrength.color,
                        marginLeft: theme.spacing.xs,
                        fontWeight: '600'
                      }}
                    >
                      {passwordStrength.label}
                    </Text>
                  </View>
                  <View style={{ 
                    height: 4, 
                    backgroundColor: theme.colors.border, 
                    borderRadius: 2 
                  }}>
                    <View style={{ 
                      height: '100%', 
                      backgroundColor: passwordStrength.color, 
                      borderRadius: 2,
                      width: `${(passwordStrength.strength / 5) * 100}%`
                    }} />
                  </View>
                </View>
              )}

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                value={localData.confirmPassword}
                onChangeText={(value) => handleFieldChange('confirmPassword', value)}
                placeholder="Confirm your password"
                type={showConfirmPassword ? 'text' : 'password'}
                error={errors.confirmPassword}
                rightIcon={showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ marginBottom: theme.spacing.lg }}
              />

              {/* Terms and Conditions */}
              <Checkbox
                checked={localData.agreeToTerms}
                onPress={() => handleFieldChange('agreeToTerms', !localData.agreeToTerms)}
                style={{ marginBottom: theme.spacing.md }}
              >
                <Text variant="body" style={{ color: theme.colors.text }}>
                  I agree to the{' '}
                  <Text 
                    variant="body" 
                    style={{ 
                      color: theme.colors.primary,
                      textDecorationLine: 'underline' 
                    }}
                  >
                    Terms and Conditions
                  </Text>
                  {' '}and{' '}
                  <Text 
                    variant="body" 
                    style={{ 
                      color: theme.colors.primary,
                      textDecorationLine: 'underline' 
                    }}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </Checkbox>

              {/* Marketing Emails (Optional) */}
              <Checkbox
                checked={localData.agreeToMarketing}
                onPress={() => handleFieldChange('agreeToMarketing', !localData.agreeToMarketing)}
                style={{ marginBottom: theme.spacing.lg }}
              >
                <Text variant="body" style={{ color: theme.colors.text }}>
                  I would like to receive marketing emails and updates about new features
                </Text>
              </Checkbox>

              {/* Continue Button */}
              <Button
                title="Create Account"
                onPress={handleContinue}
                disabled={!isFormValid}
                fullWidth
                style={{ marginBottom: theme.spacing.md }}
              />
            </Card>

            {/* Back Button */}
            <View style={{ alignItems: 'center' }}>
              <Button
                title="Back"
                variant="outline"
                onPress={handleBack}
                style={{ minWidth: 120 }}
              />
            </View>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default Step2AccountSetup;
