import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';
import { useAuthContext } from '../../context/AuthProvider';

const Success: React.FC = () => {
  const { theme } = useTheme();
  const { formData, resetOnboarding, setCurrentStep } = useOnboardingStore();
  const { register, isLoading } = useAuthContext();
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    // Automatically register the user when the success screen loads
    handleRegister();
  }, []);

  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      
      // Pass complete form data to register
      await register(formData);
      
      // Registration successful, navigate to dashboard
      router.replace('/(tabs)/dashboard');
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Parse backend validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        
        // Find which step has the error
        const errorStep = mapErrorToStep(errors[0].field);
        
        // Show alert with specific error
        Alert.alert(
          'Validation Error',
          `${errors[0].field}: ${errors[0].errors.join(', ')}`,
          [
            {
              text: 'Fix Now',
              onPress: () => {
                // Navigate to the step with error
                setCurrentStep(errorStep);
                router.replace(getStepRoute(errorStep) as any);
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Registration Failed',
          error.message || 'There was an error creating your account. Please try again.',
          [
            {
              text: 'Try Again',
              onPress: () => handleRegister()
            }
          ]
        );
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const mapErrorToStep = (field: string): number => {
    const fieldToStepMap: Record<string, number> = {
      // Step 1: Personal Info
      email: 1, 
      firstName: 1, 
      lastName: 1, 
      phoneNumber: 1,
      
      // Step 2: Account Setup
      password: 2,
      
      // Step 3: Business Profile
      businessName: 3, 
      description: 3,
      businessType: 3,
      establishedDate: 3,
      
      // Step 4: Location & Hours
      address: 4,
      businessHours: 4,
      deliveryRadius: 4,
      
      // Step 5: Cuisine & Services
      cuisineTypes: 5,
      isVegetarian: 5,
      hasDelivery: 5,
      hasPickup: 5,
      acceptsCash: 5,
      acceptsCard: 5,
      minimumOrderAmount: 5,
      deliveryFee: 5,
      estimatedDeliveryTime: 5,
      
      // Step 6: Images & Branding
      logoUrl: 6,
      bannerUrl: 6,
      socialMedia: 6,
      
      // Step 7: Documents
      gstNumber: 7,
      licenseNumber: 7,
      documents: 7,
      
      // Step 8: Payment Setup
      bankDetails: 8,
      upiId: 8,
      commissionRate: 8,
      
      // Step 9: Review & Submit
      agreeToTerms: 9,
      agreeToMarketing: 9,
    };
    return fieldToStepMap[field] || 1;
  };

  const getStepRoute = (step: number): string => {
    const routes = [
      '', // Step 0 (not used)
      '/onboarding/welcome',
      '/onboarding/account-setup',
      '/onboarding/business-profile',
      '/onboarding/location-hours',
      '/onboarding/cuisine-services',
      '/onboarding/images-branding',
      '/onboarding/documents',
      '/onboarding/payment-setup',
      '/onboarding/review-submit'
    ];
    return routes[step] || '/onboarding/welcome';
  };

  return (
    <Screen backgroundColor={theme.colors.background}>
      <Container padding="lg" style={{ flex: 1, justifyContent: 'center' }}>
        {/* Success Icon */}
        <View style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.success + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.lg,
          }}>
            <Icon name="check" size={40} color={theme.colors.success} />
          </View>
          
          <Text 
            variant="title" 
            style={{ 
              textAlign: 'center', 
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            {isRegistering ? 'Creating Your Account...' : 'Account Created Successfully!'}
          </Text>
          
          <Text 
            variant="body" 
            style={{ 
              textAlign: 'center', 
              color: theme.colors.textSecondary,
              lineHeight: 22,
              marginBottom: theme.spacing.lg
            }}
          >
            Thank you for joining TiffinWale! Your application is under review.
          </Text>
        </View>

        {/* Information Card */}
        <Card variant="elevated" style={{ marginBottom: theme.spacing.xl }}>
          <Text 
            variant="subtitle" 
            style={{ 
              marginBottom: theme.spacing.md,
              color: theme.colors.text 
            }}
          >
            What happens next?
          </Text>
          
          <View style={{ marginBottom: theme.spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: theme.spacing.sm }}>
              <Icon name="clock" size={16} color={theme.colors.primary} style={{ marginTop: 2, marginRight: theme.spacing.sm }} />
              <View style={{ flex: 1 }}>
                <Text variant="body" style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
                  Review Process
                </Text>
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  Our team will review your application within 24-48 hours
                </Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: theme.spacing.sm }}>
              <Icon name="mail" size={16} color={theme.colors.primary} style={{ marginTop: 2, marginRight: theme.spacing.sm }} />
              <View style={{ flex: 1 }}>
                <Text variant="body" style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
                  Email Notification
                </Text>
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  You'll receive an email once your application is approved
                </Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: theme.spacing.sm }}>
              <Icon name="smartphone" size={16} color={theme.colors.primary} style={{ marginTop: 2, marginRight: theme.spacing.sm }} />
              <View style={{ flex: 1 }}>
                <Text variant="body" style={{ color: theme.colors.text, marginBottom: theme.spacing.xs }}>
                  App Access
                </Text>
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  Download the partner app and start managing your business
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Contact Information */}
        <Card variant="elevated" style={{ marginBottom: theme.spacing.xl }}>
          <Text 
            variant="subtitle" 
            style={{ 
              marginBottom: theme.spacing.md,
              color: theme.colors.text 
            }}
          >
            Need Help?
          </Text>
          
          <Text variant="body" style={{ color: theme.colors.textSecondary, lineHeight: 20, marginBottom: theme.spacing.md }}>
            If you have any questions about your application or need assistance, please contact our support team.
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
            <Icon name="phone" size={16} color={theme.colors.primary} style={{ marginRight: theme.spacing.sm }} />
            <Text variant="body" style={{ color: theme.colors.text }}>
              +91 98765 43210
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="mail" size={16} color={theme.colors.primary} style={{ marginRight: theme.spacing.sm }} />
            <Text variant="body" style={{ color: theme.colors.text }}>
              support@tiffinwale.com
            </Text>
          </View>
        </Card>

        {/* Loading Indicator */}
        {isRegistering && (
          <View style={{ alignItems: 'center', marginBottom: theme.spacing.lg }}>
            <Text 
              variant="body" 
              style={{ 
                textAlign: 'center', 
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.md
              }}
            >
              Setting up your account...
            </Text>
            <View style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              borderWidth: 3,
              borderColor: theme.colors.primary + '30',
              borderTopColor: theme.colors.primary,
              // Add rotation animation here if needed
            }} />
          </View>
        )}

        {/* Footer */}
        <Text 
          variant="caption" 
          style={{ 
            textAlign: 'center', 
            color: theme.colors.textSecondary,
            lineHeight: 18
          }}
        >
          Welcome to the TiffinWale family! 🎉
        </Text>
      </Container>
    </Screen>
  );
};

export default Success;
