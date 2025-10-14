import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsConditionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.title}>Terms and Conditions</Text>
          <Text style={styles.lastUpdated}>Last updated: October 11, 2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using TiffinWale's food delivery service, you accept and agree to be 
            bound by the terms and provision of this agreement. If you do not agree to abide by 
            the above, please do not use this service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Service Description</Text>
          <Text style={styles.paragraph}>
            TiffinWale provides a platform for ordering meals from local restaurants and food 
            vendors. We facilitate the connection between customers and food providers but are 
            not directly responsible for food preparation or quality.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            To use our service, you must create an account. You are responsible for:
          </Text>
          <Text style={styles.bulletPoint}>• Providing accurate and complete information</Text>
          <Text style={styles.bulletPoint}>• Maintaining the security of your account</Text>
          <Text style={styles.bulletPoint}>• All activities that occur under your account</Text>
          <Text style={styles.bulletPoint}>• Notifying us of any unauthorized use</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Orders and Payments</Text>
          <Text style={styles.paragraph}>
            When placing an order:
          </Text>
          <Text style={styles.bulletPoint}>• All prices are subject to change without notice</Text>
          <Text style={styles.bulletPoint}>• Payment must be made at the time of order</Text>
          <Text style={styles.bulletPoint}>• We accept various payment methods as displayed</Text>
          <Text style={styles.bulletPoint}>• Delivery charges may apply based on location</Text>
          <Text style={styles.bulletPoint}>• Orders cannot be cancelled once confirmed</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Delivery Terms</Text>
          <Text style={styles.paragraph}>
            Delivery terms include:
          </Text>
          <Text style={styles.bulletPoint}>• Delivery times are estimates only</Text>
          <Text style={styles.bulletPoint}>• We deliver to specified addresses only</Text>
          <Text style={styles.bulletPoint}>• Someone must be available to receive the order</Text>
          <Text style={styles.bulletPoint}>• We are not responsible for delays due to weather or traffic</Text>
          <Text style={styles.bulletPoint}>• Delivery fees are non-refundable</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Food Quality and Safety</Text>
          <Text style={styles.paragraph}>
            While we partner with reputable restaurants, we cannot guarantee:
          </Text>
          <Text style={styles.bulletPoint}>• Food quality or taste</Text>
          <Text style={styles.bulletPoint}>• Compliance with dietary restrictions</Text>
          <Text style={styles.bulletPoint}>• Allergen-free preparation</Text>
          <Text style={styles.bulletPoint}>• Temperature maintenance during delivery</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Refunds and Cancellations</Text>
          <Text style={styles.paragraph}>
            Refund policy:
          </Text>
          <Text style={styles.bulletPoint}>• Orders cannot be cancelled after confirmation</Text>
          <Text style={styles.bulletPoint}>• Refunds may be issued for incorrect orders</Text>
          <Text style={styles.bulletPoint}>• Refunds are processed within 5-7 business days</Text>
          <Text style={styles.bulletPoint}>• No refunds for change of mind after delivery</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Subscription Plans</Text>
          <Text style={styles.paragraph}>
            For subscription plans:
          </Text>
          <Text style={styles.bulletPoint}>• Plans are billed in advance</Text>
          <Text style={styles.bulletPoint}>• Cancellation must be done before next billing cycle</Text>
          <Text style={styles.bulletPoint}>• No refunds for unused portions of subscription</Text>
          <Text style={styles.bulletPoint}>• Plan benefits are non-transferable</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Prohibited Uses</Text>
          <Text style={styles.paragraph}>
            You may not use our service:
          </Text>
          <Text style={styles.bulletPoint}>• For any unlawful purpose</Text>
          <Text style={styles.bulletPoint}>• To harass or abuse our staff or partners</Text>
          <Text style={styles.bulletPoint}>• To place fraudulent orders</Text>
          <Text style={styles.bulletPoint}>• To resell our services without permission</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            TiffinWale shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
            or other intangible losses.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Indemnification</Text>
          <Text style={styles.paragraph}>
            You agree to defend, indemnify, and hold harmless TiffinWale and its officers, 
            directors, employees, and agents from any claims, damages, or expenses arising from 
            your use of the service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Governing Law</Text>
          <Text style={styles.paragraph}>
            These terms shall be governed by and construed in accordance with the laws of India, 
            without regard to its conflict of law provisions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these terms at any time. We will notify users of any 
            material changes via email or through the app. Continued use of the service constitutes 
            acceptance of the modified terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Contact Information</Text>
          <Text style={styles.paragraph}>
            For questions about these Terms and Conditions, please contact us:
          </Text>
          <Text style={styles.contactInfo}>Email: legal@tiffinwale.com</Text>
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
