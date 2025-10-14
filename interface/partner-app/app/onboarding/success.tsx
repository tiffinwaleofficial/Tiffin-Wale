import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Text } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useTheme } from '../../store/themeStore';

const Success: React.FC = () => {
  const { theme } = useTheme();
  const { resetOnboarding } = useOnboardingStore();

  useEffect(() => {
    // Reset onboarding data after successful submission
    const timer = setTimeout(() => {
      resetOnboarding();
    }, 5000); // Reset after 5 seconds

    return () => clearTimeout(timer);
  }, [resetOnboarding]);

  const handleGoToDashboard = () => {
    resetOnboarding();
    router.replace('/dashboard');
  };

  const handleGoToLogin = () => {
    resetOnboarding();
    router.replace('/(auth)/login');
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
            Application Submitted Successfully!
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

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
          <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
            <Button
              title="Go to Login"
              variant="outline"
              onPress={handleGoToLogin}
              fullWidth
            />
          </View>
          <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
            <Button
              title="Download App"
              onPress={handleGoToDashboard}
              fullWidth
            />
          </View>
        </View>

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
