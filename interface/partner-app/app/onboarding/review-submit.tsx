import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Checkbox } from '../../components/ui/Checkbox';
import { Icon } from '../../components/ui/Icon';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';

const ReviewSubmit: React.FC = () => {
  const { theme } = useTheme();
  const { 
    currentStep, 
    totalSteps, 
    formData, 
    submitApplication, 
    isSubmitting, 
    errors,
    setCurrentStep 
  } = useOnboardingStore();

  const [agreeToSubmit, setAgreeToSubmit] = useState(false);

  const handleBack = () => {
    setCurrentStep(8);
    router.back();
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
    router.push(`./${getStepRoute(step)}`);
  };

  const getStepRoute = (step: number): string => {
    const routes = [
      '', // Step 0 (not used)
      'welcome',
      'account-setup',
      'business-profile',
      'location-hours',
      'cuisine-services',
      'images-branding',
      'documents',
      'payment-setup',
      'review-submit'
    ];
    return routes[step] || '';
  };

  const handleSubmit = async () => {
    if (!agreeToSubmit) {
      return;
    }
    
    await submitApplication();
    
    // Navigate to success screen or dashboard
    router.push('./success');
  };

  const renderSummaryCard = (title: string, step: number, data: any, fields: string[]) => (
    <Card variant="elevated" style={{ marginBottom: theme.spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
        <Text variant="subtitle" style={{ color: theme.colors.text }}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => handleEditStep(step)}>
          <Text variant="body" style={{ color: theme.colors.primary }}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
      
      {fields.map((field) => {
        const value = getNestedValue(data, field);
        if (!value) return null;
        
        return (
          <View key={field} style={{ marginBottom: theme.spacing.sm }}>
            <Text variant="caption" style={{ color: theme.colors.textSecondary, textTransform: 'capitalize' }}>
              {field.replace(/([A-Z])/g, ' $1').trim()}:
            </Text>
            <Text variant="body" style={{ color: theme.colors.text }}>
              {formatValue(field, value)}
            </Text>
          </View>
        );
      })}
    </Card>
  );

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const formatValue = (field: string, value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  return (
    <Screen backgroundColor={theme.colors.background}>
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
              Review your information
            </Text>
            <Text 
              variant="body" 
              style={{ 
                textAlign: 'center', 
                color: theme.colors.textSecondary,
                lineHeight: 22 
              }}
            >
              Please review all your information before submitting your application
            </Text>
          </View>

          {/* Summary Cards */}
          {formData.step1 && renderSummaryCard(
            'Personal Information',
            1,
            formData.step1,
            ['firstName', 'lastName', 'email', 'phoneNumber']
          )}

          {formData.step3 && renderSummaryCard(
            'Business Profile',
            3,
            formData.step3,
            ['businessName', 'businessType', 'description', 'establishedYear']
          )}

          {formData.step4 && renderSummaryCard(
            'Location & Hours',
            4,
            formData.step4,
            ['address.street', 'address.city', 'address.state', 'address.postalCode', 'businessHours.days', 'deliveryRadius']
          )}

          {formData.step5 && renderSummaryCard(
            'Cuisine & Services',
            5,
            formData.step5,
            ['cuisineTypes', 'isVegetarian', 'hasDelivery', 'hasPickup', 'acceptsCash', 'acceptsCard', 'minimumOrderAmount', 'deliveryFee']
          )}

          {formData.step6 && (formData.step6.logoUrl || formData.step6.bannerUrl || Object.values(formData.step6.socialMedia).some(v => v)) && renderSummaryCard(
            'Images & Branding',
            6,
            formData.step6,
            ['logoUrl', 'bannerUrl', 'socialMedia']
          )}

          {formData.step7 && renderSummaryCard(
            'Documents & Verification',
            7,
            formData.step7,
            ['fssaiLicense', 'gstNumber', 'panNumber', 'licenseNumber']
          )}

          {formData.step8 && renderSummaryCard(
            'Payment Setup',
            8,
            formData.step8,
            ['bankDetails.accountHolderName', 'bankDetails.bankName', 'upiId', 'commissionRate']
          )}

          {/* Terms and Conditions */}
          <Card variant="elevated" style={{ marginBottom: theme.spacing.lg }}>
            <Checkbox
              checked={agreeToSubmit}
              onPress={() => setAgreeToSubmit(!agreeToSubmit)}
              style={{ marginBottom: theme.spacing.md }}
            >
              <Text variant="body" style={{ color: theme.colors.text }}>
                I confirm that all the information provided is accurate and complete. I agree to the{' '}
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

            {/* Error Message */}
            {errors.submit && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.error + '10',
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.md,
              }}>
                <Icon name="alert-circle" size={16} color={theme.colors.error} />
                <Text variant="caption" style={{ color: theme.colors.error, marginLeft: theme.spacing.sm }}>
                  {errors.submit}
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <Button
              title={isSubmitting ? "Submitting Application..." : "Submit Application"}
              onPress={handleSubmit}
              disabled={!agreeToSubmit || isSubmitting}
              loading={isSubmitting}
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
    </Screen>
  );
};

export default ReviewSubmit;
