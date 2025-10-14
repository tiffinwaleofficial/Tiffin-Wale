import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '../ui/Text';
import { useTheme } from '../../store/themeStore';

const TermsAndConditions: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ScrollView 
      style={{ flex: 1, padding: theme.spacing.lg }}
      showsVerticalScrollIndicator={true}
    >
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Text 
          variant="title" 
          style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            marginBottom: theme.spacing.lg,
            color: theme.colors.text 
          }}
        >
          Terms and Conditions
        </Text>
        
        <Text 
          variant="body" 
          style={{ 
            fontSize: 12, 
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg 
          }}
        >
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <Text 
          variant="body" 
          style={{ 
            fontSize: 16, 
            lineHeight: 24,
            marginBottom: theme.spacing.lg,
            color: theme.colors.text 
          }}
        >
          Welcome to TiffinWale! These Terms and Conditions ("Terms") govern your use of our platform and services. By creating an account and using our services, you agree to be bound by these Terms.
        </Text>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text 
            variant="subtitle" 
            style={{ 
              fontSize: 18, 
              fontWeight: '600',
              marginBottom: theme.spacing.md,
              color: theme.colors.text 
            }}
          >
            1. Acceptance of Terms
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              color: theme.colors.text 
            }}
          >
            By accessing or using TiffinWale's platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our services.
          </Text>
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text 
            variant="subtitle" 
            style={{ 
              fontSize: 18, 
              fontWeight: '600',
              marginBottom: theme.spacing.md,
              color: theme.colors.text 
            }}
          >
            2. Partner Responsibilities
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            As a partner on our platform, you agree to:
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • Provide accurate and complete information about your business
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • Maintain food safety standards and comply with local health regulations
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • Deliver orders within the promised timeframes
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • Provide quality food that matches your menu descriptions
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • Respond promptly to customer inquiries and complaints
          </Text>
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text 
            variant="subtitle" 
            style={{ 
              fontSize: 18, 
              fontWeight: '600',
              marginBottom: theme.spacing.md,
              color: theme.colors.text 
            }}
          >
            3. Commission and Payments
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • TiffinWale charges a commission on each order processed through our platform
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • Payments are processed weekly, subject to our payment terms
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • You are responsible for any taxes applicable to your earnings
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • Refunds and chargebacks may affect your payment schedule
          </Text>
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text 
            variant="subtitle" 
            style={{ 
              fontSize: 18, 
              fontWeight: '600',
              marginBottom: theme.spacing.md,
              color: theme.colors.text 
            }}
          >
            4. Platform Usage
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • You may not use our platform for any illegal or unauthorized purpose
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • You must not interfere with or disrupt the platform's functionality
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • You are responsible for maintaining the confidentiality of your account credentials
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • You must not create multiple accounts or share your account with others
          </Text>
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text 
            variant="subtitle" 
            style={{ 
              fontSize: 18, 
              fontWeight: '600',
              marginBottom: theme.spacing.md,
              color: theme.colors.text 
            }}
          >
            5. Termination
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • Either party may terminate this agreement with appropriate notice
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • TiffinWale reserves the right to suspend or terminate accounts for violations
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            • Upon termination, you must settle all outstanding payments and obligations
          </Text>
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text 
            variant="subtitle" 
            style={{ 
              fontSize: 18, 
              fontWeight: '600',
              marginBottom: theme.spacing.md,
              color: theme.colors.text 
            }}
          >
            6. Limitation of Liability
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              color: theme.colors.text 
            }}
          >
            TiffinWale shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform. Our total liability is limited to the amount of commission paid to us in the preceding 12 months.
          </Text>
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text 
            variant="subtitle" 
            style={{ 
              fontSize: 18, 
              fontWeight: '600',
              marginBottom: theme.spacing.md,
              color: theme.colors.text 
            }}
          >
            7. Changes to Terms
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              color: theme.colors.text 
            }}
          >
            We reserve the right to modify these Terms at any time. We will notify you of any material changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the new Terms.
          </Text>
        </View>

        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text 
            variant="subtitle" 
            style={{ 
              fontSize: 18, 
              fontWeight: '600',
              marginBottom: theme.spacing.md,
              color: theme.colors.text 
            }}
          >
            8. Contact Information
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            If you have any questions about these Terms, please contact us:
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            Email: legal@tiffinwale.com
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            Phone: +91-9876543210
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              color: theme.colors.text 
            }}
          >
            Address: TiffinWale Technologies Pvt. Ltd., Mumbai, India
          </Text>
        </View>

        <View style={{ 
          padding: theme.spacing.lg, 
          backgroundColor: theme.colors.background + '80',
          borderRadius: theme.borderRadius.md,
          marginTop: theme.spacing.lg 
        }}>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 12, 
              lineHeight: 18,
              textAlign: 'center',
              color: theme.colors.textSecondary 
            }}
          >
            By using TiffinWale's platform, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default TermsAndConditions;


