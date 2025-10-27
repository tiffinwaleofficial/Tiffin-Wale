import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore, PaymentSetupData } from '../../store/onboardingStore';

export default function PaymentSetup() {
  const { 
    currentStep, 
    totalSteps, 
    formData, 
    updateFormData, 
    setError, 
    clearError, 
    setCurrentStep 
  } = useOnboardingStore();

  const [localData, setLocalData] = useState<PaymentSetupData>(() => {
    const step7Data = (formData.step7 as unknown as PaymentSetupData);
    if (step7Data && step7Data.bankDetails) {
      return step7Data;
    }
    return {
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        bankName: '',
      },
      upiId: '',
      commissionRate: 20,
    };
  });

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
    updateFormData('step7', localData);
    setCurrentStep(9);
    router.push('./review-submit');
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    localData.bankDetails.accountNumber.trim() && 
    localData.bankDetails.ifscCode.trim() && 
    localData.bankDetails.accountHolderName.trim() && 
    localData.bankDetails.bankName.trim();

  return (
    <Screen backgroundColor="#FFFAF0">
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        {/* Back Button */}
        <BackButton 
          onPress={() => router.back()} 
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
              <Text 
                variant="title" 
                style={styles.title}
              >
                Payment setup
              </Text>
              <Text 
                variant="body" 
                style={styles.subtitle}
              >
                Set up your payment details to receive earnings
              </Text>
            </View>

            {/* Form Card */}
            <Card variant="elevated" style={styles.card}>
              {/* Bank Details */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                Bank Account Details
              </Text>

              <Input
                label="Account Holder Name"
                value={localData.bankDetails.accountHolderName}
                onChangeText={(value: string) => handleBankDetailChange('accountHolderName', value)}
                placeholder="Enter account holder name"
                error={errors.accountHolderName}
                containerStyle={styles.inputMargin}
              />

              <Input
                label="Account Number"
                value={localData.bankDetails.accountNumber}
                onChangeText={(value: string) => handleBankDetailChange('accountNumber', value.replace(/\D/g, ''))}
                placeholder="Enter account number"
                keyboardType="numeric"
                error={errors.accountNumber}
                containerStyle={styles.inputMargin}
              />

              <Input
                label="IFSC Code"
                value={localData.bankDetails.ifscCode}
                onChangeText={(value: string) => handleBankDetailChange('ifscCode', value.toUpperCase())}
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                error={errors.ifscCode}
                containerStyle={styles.inputMargin}
              />

              <Input
                label="Bank Name"
                value={localData.bankDetails.bankName}
                onChangeText={(value: string) => handleBankDetailChange('bankName', value)}
                placeholder="Enter bank name"
                error={errors.bankName}
                containerStyle={styles.inputMargin}
              />

              {/* UPI Details */}
              <Text 
                variant="subtitle" 
                style={styles.sectionTitle}
              >
                UPI Details (Optional)
              </Text>

              <Input
                label="UPI ID"
                value={localData.upiId}
                onChangeText={(value: string) => handleUpiIdChange(value)}
                placeholder="yourname@paytm or yourname@phonepe"
                error={errors.upiId}
                containerStyle={styles.inputMargin}
              />

              {/* Commission Information */}
              <View style={styles.infoBox}>
                <View style={styles.infoHeader}>
                  <Icon name="info" size={20} color="#3B82F6" />
                  <Text variant="subtitle" style={styles.infoTitle}>
                    Commission Information
                  </Text>
                </View>
                <Text variant="body" style={styles.infoText}>
                  TiffinWale charges a {localData.commissionRate}% commission on all orders. This helps us maintain the platform, provide customer support, and handle payments securely.
                </Text>
                <Text variant="caption" style={styles.infoItem}>
                  • Commission is calculated on the order total (excluding taxes)
                </Text>
                <Text variant="caption" style={styles.infoItemLast}>
                  • Payments are processed weekly
                </Text>
                <Text variant="caption" style={styles.infoItemLast}>
                  • No hidden fees or charges
                </Text>
              </View>

              {/* Security Notice */}
              <View style={styles.successBox}>
                <View style={styles.infoHeader}>
                  <Icon name="shield" size={20} color="#10B981" />
                  <Text variant="subtitle" style={styles.successTitle}>
                    Secure & Encrypted
                  </Text>
                </View>
                <Text variant="body" style={styles.infoText}>
                  Your payment information is encrypted and stored securely. We use bank-grade security to protect your financial data.
                </Text>
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
}

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
  sectionTitle: {
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
  inputMargin: {
    marginBottom: 16,
  },
  infoBox: {
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    marginBottom: 16,
  },
  successBox: {
    padding: 16,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    color: '#3B82F6',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  successTitle: {
    color: '#10B981',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  infoText: {
    color: '#666',
    lineHeight: 20,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  infoItem: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  infoItemLast: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  buttonMargin: {
    marginBottom: 16,
  },
});
