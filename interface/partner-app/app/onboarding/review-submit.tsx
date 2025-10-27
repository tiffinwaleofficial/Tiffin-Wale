import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import Button from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Checkbox } from '../../components/ui/Checkbox';
import { Icon } from '../../components/ui/Icon';
import ProgressIndicator from '../../components/onboarding/ProgressIndicator';
import BackButton from '../../components/navigation/BackButton';
import { PolicyModal, TermsAndConditions, PrivacyPolicy } from '../../components/policies';
import { useOnboardingStore } from '../../store/onboardingStore';

export default function ReviewSubmit() {
  const { 
    currentStep, 
    totalSteps, 
    formData, 
    submitApplication, 
    isSubmitting, 
    errors,
    setCurrentStep,
    updateFormData
  } = useOnboardingStore();

  const [agreeToSubmit, setAgreeToSubmit] = useState(false);
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);
  
  // Policy modal states
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
    
    // Save final preferences to store
    updateFormData('agreeToTerms', agreeToSubmit);
    updateFormData('agreeToMarketing', agreeToMarketing);
    
    await submitApplication();
    
    // Navigate to success screen or dashboard
    router.push('./success');
  };

  const renderSummaryCard = (title: string, step: number, data: any, fields: string[]) => (
    <Card variant="elevated" style={styles.summaryCard}>
      <View style={styles.cardHeader}>
        <Text variant="subtitle" style={styles.cardTitle}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => handleEditStep(step)}>
          <Text variant="body" style={styles.editText}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
      
      {fields.map((field) => {
        const value = getNestedValue(data, field);
        
        // Check if value exists and has meaningful data
        const hasValue = value !== undefined && value !== null && value !== '';
        const hasArrayValue = Array.isArray(value) && value.length > 0;
        const hasObjectValue = typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length > 0;
        
        // Show field if it has value, is an array with items, or is an object with properties, or is a boolean
        if (!hasValue && !hasArrayValue && !hasObjectValue && typeof value !== 'boolean') {
          return null;
        }
        
        return (
          <View key={field} style={styles.fieldContainer}>
            <Text variant="caption" style={styles.fieldLabel}>
              {field.replace(/([A-Z])/g, ' $1').trim()}:
            </Text>
            {typeof formatValue(field, value) === 'string' ? (
              <Text variant="body" style={styles.fieldValue}>
                {formatValue(field, value)}
              </Text>
            ) : (
              formatValue(field, value)
            )}
          </View>
        );
      })}
    </Card>
  );

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const formatValue = (field: string, value: any): string | React.ReactNode => {
    // Handle image URLs specially
    if ((field === 'logoUrl' || field === 'bannerUrl') && typeof value === 'string' && value.includes('cloudinary.com')) {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: value }}
            style={[
              styles.image,
              field === 'logoUrl' ? styles.logoImage : styles.bannerImage
            ]}
            resizeMode="cover"
          />
          <Text style={styles.imageLabel}>
            {field === 'logoUrl' ? 'Logo' : 'Banner'}
          </Text>
        </View>
      );
    }
    
    // Handle business types array specially
    if (field === 'businessType' && Array.isArray(value)) {
      const businessTypeLabels: Record<string, string> = {
        'restaurant': 'Restaurant',
        'cloud_kitchen': 'Cloud Kitchen',
        'catering': 'Catering Service',
        'home_chef': 'Home Chef',
      };
      return value.map(type => businessTypeLabels[type] || type).join(', ');
    }
    
    // Handle establishment date specially
    if (field === 'establishedDate' && typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }
    
    // Handle cuisine types array
    if (field === 'cuisineTypes' && Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Not selected';
    }
    
    // Handle days array for business hours
    if (field === 'days' && Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Not set';
    }
    
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Not selected';
    }
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ') || 'Not provided';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  return (
    <Screen backgroundColor="#FFFAF0">
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
              Review your information
            </Text>
            <Text 
              variant="body" 
              style={styles.subtitle}
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

          {formData.step2 && renderSummaryCard(
            'Business Profile',
            2,
            formData.step2,
            ['businessName', 'businessType', 'description', 'establishedDate']
          )}

          {formData.step3 && renderSummaryCard(
            'Location & Hours',
            3,
            formData.step3,
            ['address.street', 'address.city', 'address.state', 'address.postalCode', 'businessHours.days', 'businessHours.open', 'businessHours.close', 'deliveryRadius']
          )}

          {formData.step4 && renderSummaryCard(
            'Cuisine & Services',
            4,
            formData.step4,
            ['cuisineTypes', 'isVegetarian', 'hasDelivery', 'hasPickup', 'acceptsCash', 'acceptsCard', 'minimumOrderAmount', 'deliveryFee', 'estimatedDeliveryTime']
          )}

          {formData.step5 && renderSummaryCard(
            'Images & Branding',
            5,
            formData.step5,
            ['logoUrl', 'bannerUrl', 'socialMedia']
          )}

          {formData.step6 && renderSummaryCard(
            'Documents & Verification',
            6,
            formData.step6,
            ['fssaiLicense', 'gstNumber', 'panNumber', 'licenseNumber']
          )}

          {formData.step7 && renderSummaryCard(
            'Payment Setup',
            7,
            formData.step7,
            ['bankDetails.accountHolderName', 'bankDetails.accountNumber', 'bankDetails.ifscCode', 'bankDetails.bankName', 'upiId', 'commissionRate']
          )}

          {/* Terms and Conditions */}
          <Card variant="elevated" style={styles.termsCard}>
            <Checkbox
              checked={agreeToSubmit}
              onPress={() => setAgreeToSubmit(!agreeToSubmit)}
              style={styles.checkboxMargin}
            >
              <Text variant="body" style={styles.checkboxText}>
                I confirm that all the information provided is accurate and complete. I agree to the{' '}
                <TouchableOpacity onPress={() => setShowTermsModal(true)}>
                  <Text 
                    variant="body" 
                    style={styles.linkText}
                  >
                    Terms and Conditions
                  </Text>
                </TouchableOpacity>
                {' '}and{' '}
                <TouchableOpacity onPress={() => setShowPrivacyModal(true)}>
                  <Text 
                    variant="body" 
                    style={styles.linkText}
                  >
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
              </Text>
            </Checkbox>

            {/* Marketing Emails (Optional) */}
            <Checkbox
              checked={agreeToMarketing}
              onPress={() => setAgreeToMarketing(!agreeToMarketing)}
              style={styles.checkboxMarginLast}
            >
              <Text variant="body" style={styles.checkboxText}>
                I would like to receive marketing emails and updates about new features
              </Text>
            </Checkbox>

            {/* Error Message */}
            {errors.submit && (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={16} color="#EF4444" />
                <Text variant="caption" style={styles.errorText}>
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
              style={styles.buttonMargin}
            />
          </Card>
        </Container>
      </ScrollView>

      {/* Policy Modals */}
      <PolicyModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms and Conditions"
      >
        <TermsAndConditions />
      </PolicyModal>

      <PolicyModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
      >
        <PrivacyPolicy />
      </PolicyModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  summaryCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1A1A1A',
  },
  editText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FF9B42',
  },
  fieldContainer: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textTransform: 'capitalize',
  },
  fieldValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1A1A1A',
  },
  imageContainer: {
    marginTop: 8,
  },
  image: {
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  bannerImage: {
    width: 120,
    height: 60,
  },
  imageLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  termsCard: {
    marginBottom: 24,
  },
  checkboxMargin: {
    marginBottom: 16,
  },
  checkboxMarginLast: {
    marginBottom: 24,
  },
  checkboxText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1A1A1A',
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FF9B42',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#EF4444',
    marginLeft: 8,
  },
  buttonMargin: {
    marginBottom: 16,
  },
});
