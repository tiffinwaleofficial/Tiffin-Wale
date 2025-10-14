import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '../ui/Text';
import { useTheme } from '../../store/themeStore';

const PrivacyPolicy: React.FC = () => {
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
          Privacy Policy
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
          At TiffinWale, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
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
            1. Information We Collect
          </Text>
          
          <Text 
            variant="body" 
            style={{ 
              fontSize: 16, 
              fontWeight: '500',
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            Personal Information:
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
            • Name, email address, phone number
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
            • Business information (restaurant name, address, license details)
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
            • Bank account details for payment processing
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
            • Government-issued identification documents
          </Text>

          <Text 
            variant="body" 
            style={{ 
              fontSize: 16, 
              fontWeight: '500',
              marginTop: theme.spacing.md,
              marginBottom: theme.spacing.sm,
              color: theme.colors.text 
            }}
          >
            Usage Information:
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
            • Device information (IP address, browser type, operating system)
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
            • App usage patterns and preferences
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
            • Location data (for delivery services)
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
            • Transaction history and payment information
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
            2. How We Use Your Information
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
            • To provide and maintain our services
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
            • To process payments and manage your account
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
            • To communicate with you about your account and our services
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
            • To improve our platform and develop new features
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
            • To comply with legal obligations and prevent fraud
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
            • To send you marketing communications (with your consent)
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
            3. Information Sharing and Disclosure
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
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
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
            • With service providers who assist us in operating our platform
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
            • With payment processors for transaction processing
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
            • When required by law or to protect our rights and safety
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
            • In connection with a business transfer or merger
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
            4. Data Security
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
            We implement appropriate technical and organizational measures to protect your personal information:
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
            • Encryption of data in transit and at rest
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
            • Regular security audits and updates
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
            • Access controls and authentication measures
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
            • Employee training on data protection
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
            5. Your Rights and Choices
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
            You have the following rights regarding your personal information:
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
            • Access: Request a copy of your personal data
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
            • Correction: Update or correct inaccurate information
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
            • Deletion: Request deletion of your personal data
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
            • Portability: Receive your data in a structured format
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
            • Opt-out: Unsubscribe from marketing communications
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
            6. Cookies and Tracking
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
            We use cookies and similar technologies to:
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
            • Remember your preferences and settings
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
            • Analyze app usage and improve performance
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
            • Provide personalized content and recommendations
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
            • Ensure security and prevent fraud
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
            7. Data Retention
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
            We retain your personal information for as long as necessary to:
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
            • Provide our services to you
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
            • Comply with legal obligations
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
            • Resolve disputes and enforce agreements
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
            • Generally, we retain data for 7 years after account closure
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
            8. Children's Privacy
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              color: theme.colors.text 
            }}
          >
            Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete such information.
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
            9. Changes to This Policy
          </Text>
          <Text 
            variant="body" 
            style={{ 
              fontSize: 14, 
              lineHeight: 22,
              color: theme.colors.text 
            }}
          >
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
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
            10. Contact Us
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
            If you have any questions about this Privacy Policy or our data practices, please contact us:
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
            Email: privacy@tiffinwale.com
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
              marginBottom: theme.spacing.sm,
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
            By using TiffinWale's platform, you acknowledge that you have read and understood this Privacy Policy and consent to our data practices as described herein.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicy;


