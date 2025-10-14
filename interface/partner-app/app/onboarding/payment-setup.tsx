import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, PaymentSetupData } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';

const PaymentSetup: React.FC = () => {
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

  const [localData, setLocalData] = useState<PaymentSetupData>(
    formData.step8 || {
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        bankName: '',
      },
      upiId: '',
      commissionRate: 20,
    }
  );

  const [errors, setLocalErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'accountNumber':
        if (!value.trim()) return 'Account number is required';
        if (!/^[0-9]{9,18}$/.test(value.replace(/\D/g, ''))) return 'Account number must be 9-18 digits';
        return '';
      case 'ifscCode':
        if (!value.trim()) return 'IFSC code is required';
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase())) return 'Please enter a valid IFSC code';
        return '';
      case 'accountHolderName':
        if (!value.trim()) return 'Account holder name is required';
        if (value.trim().length < 2) return 'Account holder name must be at least 2 characters';
        return '';
      case 'bankName':
        if (!value.trim()) return 'Bank name is required';
        return '';
      case 'upiId':
        if (value.trim() && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(value)) return 'Please enter a valid UPI ID';
        return '';
      default:
        return '';
    }
  };

  const handleBankDetailChange = (field: keyof PaymentSetupData['bankDetails'], value: string) => {
    const newBankDetails = { ...localData.bankDetails, [field]: value.toUpperCase() };
    const newData = { ...localData, bankDetails: newBankDetails };
    setLocalData(newData);
    
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

  const handleUpiIdChange = (value: string) => {
    const newData = { ...localData, upiId: value };
    setLocalData(newData);
    
    // Validate UPI ID (optional field)
    if (value.trim()) {
      const error = validateField('upiId', value);
      if (error) {
        setLocalErrors(prev => ({ ...prev, upiId: error }));
        setError('upiId', error);
      } else {
        setLocalErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.upiId;
          return newErrors;
        });
        clearError('upiId');
      }
    } else {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.upiId;
        return newErrors;
      });
      clearError('upiId');
    }
  };

  const handleBack = () => {
    setCurrentStep(7);
    router.back();
  };

  const handleContinue = () => {
    // Validate all required fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    // Validate bank details
    Object.keys(localData.bankDetails).forEach((field) => {
      const error = validateField(field, localData.bankDetails[field as keyof typeof localData.bankDetails]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    // Validate UPI ID if provided
    if (localData.upiId.trim()) {
      const upiError = validateField('upiId', localData.upiId);
      if (upiError) {
        newErrors.upiId = upiError;
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setLocalErrors(newErrors);
      return;
    }

    // Save data and proceed
    updateFormData('step8', localData);
    setCurrentStep(9);
    router.push('./review-submit');
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    localData.bankDetails.accountNumber.trim() && 
    localData.bankDetails.ifscCode.trim() && 
    localData.bankDetails.accountHolderName.trim() && 
    localData.bankDetails.bankName.trim();

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
                Payment setup
              </Text>
              <Text 
                variant="body" 
                style={{ 
                  textAlign: 'center', 
                  color: theme.colors.textSecondary,
                  lineHeight: 22 
                }}
              >
                Set up your payment details to receive earnings
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
              {/* Bank Details */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                Bank Account Details
              </Text>

              <Input
                label="Account Holder Name"
                value={localData.bankDetails.accountHolderName}
                onChangeText={(value) => handleBankDetailChange('accountHolderName', value)}
                placeholder="Enter account holder name"
                error={errors.accountHolderName}
                style={{ marginBottom: theme.spacing.md }}
              />

              <Input
                label="Account Number"
                value={localData.bankDetails.accountNumber}
                onChangeText={(value) => handleBankDetailChange('accountNumber', value.replace(/\D/g, ''))}
                placeholder="Enter account number"
                type="numeric"
                error={errors.accountNumber}
                style={{ marginBottom: theme.spacing.md }}
              />

              <Input
                label="IFSC Code"
                value={localData.bankDetails.ifscCode}
                onChangeText={(value) => handleBankDetailChange('ifscCode', value.toUpperCase())}
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                error={errors.ifscCode}
                style={{ marginBottom: theme.spacing.md }}
              />

              <Input
                label="Bank Name"
                value={localData.bankDetails.bankName}
                onChangeText={(value) => handleBankDetailChange('bankName', value)}
                placeholder="Enter bank name"
                error={errors.bankName}
                style={{ marginBottom: theme.spacing.lg }}
              />

              {/* UPI Details */}
              <Text 
                variant="subtitle" 
                style={{ 
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text 
                }}
              >
                UPI Details (Optional)
              </Text>

              <Input
                label="UPI ID"
                value={localData.upiId}
                onChangeText={handleUpiIdChange}
                placeholder="yourname@paytm or yourname@phonepe"
                error={errors.upiId}
                style={{ marginBottom: theme.spacing.lg }}
              />

              {/* Commission Information */}
              <View style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.info + '10',
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.lg,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                  <Icon name="info" size={20} color={theme.colors.info} />
                  <Text variant="subtitle" style={{ color: theme.colors.info, marginLeft: theme.spacing.sm }}>
                    Commission Information
                  </Text>
                </View>
                <Text variant="body" style={{ color: theme.colors.textSecondary, lineHeight: 20 }}>
                  TiffinWale charges a {localData.commissionRate}% commission on all orders. This helps us maintain the platform, provide customer support, and handle payments securely.
                </Text>
                <Text variant="caption" style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.sm }}>
                  • Commission is calculated on the order total (excluding taxes)
                </Text>
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  • Payments are processed weekly
                </Text>
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  • No hidden fees or charges
                </Text>
              </View>

              {/* Security Notice */}
              <View style={{
                padding: theme.spacing.md,
                backgroundColor: theme.colors.success + '10',
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.lg,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
                  <Icon name="shield" size={20} color={theme.colors.success} />
                  <Text variant="subtitle" style={{ color: theme.colors.success, marginLeft: theme.spacing.sm }}>
                    Secure & Encrypted
                  </Text>
                </View>
                <Text variant="body" style={{ color: theme.colors.textSecondary, lineHeight: 20 }}>
                  Your payment information is encrypted and stored securely. We use bank-grade security to protect your financial data.
                </Text>
              </View>

              {/* Continue Button */}
              <Button
                title="Continue"
                onPress={handleContinue}
                disabled={!isFormValid}
                fullWidth
                style={{ marginBottom: theme.spacing.md }}
              />
            </Card>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default PaymentSetup;
