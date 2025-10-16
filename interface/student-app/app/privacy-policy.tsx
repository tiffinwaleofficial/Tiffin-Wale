import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '@/components/BackButton';
import { useTranslation } from '@/hooks/useTranslation';

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { t } = useTranslation('profile');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>{t('privacyPolicy')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last updated: October 11, 2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information you provide directly to us, such as when you create an account, 
            place an order, or contact us for support. This may include:
          </Text>
          <Text style={styles.bulletPoint}>• Name, email address, and phone number</Text>
          <Text style={styles.bulletPoint}>• Delivery addresses and preferences</Text>
          <Text style={styles.bulletPoint}>• Payment information (processed securely)</Text>
          <Text style={styles.bulletPoint}>• Order history and meal preferences</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to:
          </Text>
          <Text style={styles.bulletPoint}>• Process and fulfill your orders</Text>
          <Text style={styles.bulletPoint}>• Provide customer support</Text>
          <Text style={styles.bulletPoint}>• Send you important updates about your orders</Text>
          <Text style={styles.bulletPoint}>• Improve our services and user experience</Text>
          <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except:
          </Text>
          <Text style={styles.bulletPoint}>• To our delivery partners for order fulfillment</Text>
          <Text style={styles.bulletPoint}>• To payment processors for transaction processing</Text>
          <Text style={styles.bulletPoint}>• When required by law or to protect our rights</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. This includes:
          </Text>
          <Text style={styles.bulletPoint}>• Encryption of sensitive data</Text>
          <Text style={styles.bulletPoint}>• Secure payment processing</Text>
          <Text style={styles.bulletPoint}>• Regular security audits</Text>
          <Text style={styles.bulletPoint}>• Limited access to personal information</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Access your personal information</Text>
          <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
          <Text style={styles.bulletPoint}>• Delete your account and data</Text>
          <Text style={styles.bulletPoint}>• Opt-out of marketing communications</Text>
          <Text style={styles.bulletPoint}>• Withdraw consent for data processing</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Cookies and Tracking</Text>
          <Text style={styles.paragraph}>
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
            and provide personalized content. You can control cookie settings through your browser.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Third-Party Services</Text>
          <Text style={styles.paragraph}>
            Our app may contain links to third-party websites or services. We are not responsible 
            for the privacy practices of these external sites. We encourage you to review their 
            privacy policies.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our services are not intended for children under 13 years of age. We do not knowingly 
            collect personal information from children under 13.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: privacy@tiffinwale.com</Text>
          <Text style={styles.contactInfo}>Phone: +91 98765 43210</Text>
          <Text style={styles.contactInfo}>Address: TiffinWale Pvt Ltd, Mumbai, India</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555555',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555555',
    marginLeft: 16,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 16,
    color: '#FF9B42',
    fontWeight: '500',
    marginBottom: 4,
  },
});
