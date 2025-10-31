import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle, Clock, Mail, Smartphone, Phone, MessageCircle } from 'lucide-react-native';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import Button from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useTheme } from '../../hooks/useTheme';
import { useAuthContext } from '../../lib/auth/AuthProvider';

const Success: React.FC = () => {
  const { theme } = useTheme();
  const { formData, resetOnboarding, setCurrentStep } = useOnboardingStore();
  const { register, isLoading } = useAuthContext();
  const [isRegistering, setIsRegistering] = useState(false);

  const [registrationComplete, setRegistrationComplete] = useState(false);

  useEffect(() => {
    // Automatically register the user when the success screen loads
    handleRegister();
  }, []);

  const handleRegister = async () => {
    try {
      setIsRegistering(true);
      console.log('🚀 Starting registration process...');
      
      // Pass complete form data to register
      await register(formData);
      
      console.log('✅ Registration successful!');
      
      // Registration successful - set flag but don't auto-navigate
      setRegistrationComplete(true);
      console.log('✅ registrationComplete set to true');
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      
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
      console.log('🏁 Registration process completed. isRegistering set to false');
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

  const handleViewDashboard = () => {
    router.replace('/(tabs)/dashboard');
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      marginTop: theme.spacing['2xl'],
    },
    successIcon: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.successLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
      shadowColor: theme.colors.success,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      textAlign: 'center',
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    card: {
      marginBottom: theme.spacing.lg,
    },
    cardTitle: {
      marginBottom: theme.spacing.lg,
    },
    stepItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.backgroundSecondary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    stepIconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    stepContent: {
      flex: 1,
    },
    stepTitle: {
      marginBottom: theme.spacing.xs,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    contactIconContainer: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primaryLight + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    footer: {
      backgroundColor: theme.colors.primaryLight + '20',
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.primaryLight + '30',
    },
    loadingContainer: {
      alignItems: 'center',
      marginVertical: theme.spacing.xl,
    },
    buttonContainer: {
      marginBottom: theme.spacing.xl,
    },
  });

  return (
    <Screen backgroundColor={theme.colors.secondary}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Container padding="lg">
          {/* Success Icon */}
          <View style={styles.header}>
            <View style={styles.successIcon}>
              <CheckCircle size={50} color={theme.colors.success} />
            </View>
            
            <Text variant="h2" weight="bold" style={styles.title}>
              {isRegistering ? 'Creating Your Account...' : 'Account Created Successfully!'}
            </Text>
            
            <Text variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
              Thank you for joining TiffinWale! Your application is under review.
            </Text>
          </View>

          {/* View Dashboard Button - Show when not registering */}
          {!isRegistering && (
            <View style={styles.buttonContainer}>
              <Button
                title="View Dashboard"
                onPress={handleViewDashboard}
                fullWidth
                icon="arrow-right"
              />
            </View>
          )}

          {/* Loading Indicator */}
          {isRegistering && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text 
                variant="body" 
                color={theme.colors.textSecondary}
                style={{ marginTop: theme.spacing.md, textAlign: 'center' }}
              >
                Setting up your account...
              </Text>
            </View>
          )}

          {/* Information Card */}
          <Card variant="elevated" style={styles.card}>
            <Text variant="h4" weight="semiBold" style={styles.cardTitle}>
              What happens next?
            </Text>
            
            <View style={[styles.stepItem, { borderLeftWidth: 3, borderLeftColor: theme.colors.primary }]}>
              <View style={[styles.stepIconContainer, { backgroundColor: theme.colors.primaryLight + '20' }]}>
                <Clock size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.stepContent}>
                <Text variant="body" weight="semiBold" style={styles.stepTitle}>
                  Review Process
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Our team will review your application within 24-48 hours
                </Text>
              </View>
            </View>
            
            <View style={[styles.stepItem, { borderLeftWidth: 3, borderLeftColor: theme.colors.success }]}>
              <View style={[styles.stepIconContainer, { backgroundColor: theme.colors.successLight + '20' }]}>
                <Mail size={20} color={theme.colors.success} />
              </View>
              <View style={styles.stepContent}>
                <Text variant="body" weight="semiBold" style={styles.stepTitle}>
                  Email Notification
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  You'll receive an email once your application is approved
                </Text>
              </View>
            </View>
            
            <View style={[styles.stepItem, { borderLeftWidth: 3, borderLeftColor: theme.colors.info, marginBottom: 0 }]}>
              <View style={[styles.stepIconContainer, { backgroundColor: theme.colors.infoLight + '20' }]}>
                <Smartphone size={20} color={theme.colors.info} />
              </View>
              <View style={styles.stepContent}>
                <Text variant="body" weight="semiBold" style={styles.stepTitle}>
                  App Access
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Start managing your business from the dashboard
                </Text>
              </View>
            </View>
          </Card>

          {/* Contact Information */}
          <Card variant="elevated" style={styles.card}>
            <Text variant="h4" weight="semiBold" style={styles.cardTitle}>
              Need Help?
            </Text>
            
            <Text variant="body" color={theme.colors.textSecondary} style={{ marginBottom: theme.spacing.lg }}>
              If you have any questions about your application or need assistance, please contact our support team.
            </Text>
            
            <View style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <Phone size={20} color={theme.colors.primary} />
              </View>
              <Text variant="body" weight="medium">
                +91 98765 43210
              </Text>
            </View>
            
            <View style={[styles.contactItem, { marginBottom: 0 }]}>
              <View style={styles.contactIconContainer}>
                <MessageCircle size={20} color={theme.colors.primary} />
              </View>
              <Text variant="body" weight="medium">
                support@tiffinwale.com
              </Text>
            </View>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text variant="body" weight="semiBold" color={theme.colors.primary}>
              Welcome to the TiffinWale family! 🎉
            </Text>
          </View>
        </Container>
      </ScrollView>
    </Screen>
  );
};

export default Success;
