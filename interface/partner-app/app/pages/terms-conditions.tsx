import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function TermsConditionsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Terms & Conditions</Text>
          <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>

          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing and using the TiffinWale Partner platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
          </Text>

          <Text style={styles.sectionTitle}>2. Partner Obligations</Text>
          <Text style={styles.text}>
            As a partner, you agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide accurate and complete business information</Text>
          <Text style={styles.bulletPoint}>• Maintain food safety and hygiene standards</Text>
          <Text style={styles.bulletPoint}>• Fulfill orders in a timely manner</Text>
          <Text style={styles.bulletPoint}>• Comply with all applicable laws and regulations</Text>
          <Text style={styles.bulletPoint}>• Respect customer privacy and data protection</Text>

          <Text style={styles.sectionTitle}>3. Platform Usage</Text>
          <Text style={styles.text}>
            You agree to use the platform only for lawful purposes and in accordance with these Terms. You must not:
          </Text>
          <Text style={styles.bulletPoint}>• Misuse or attempt to gain unauthorized access</Text>
          <Text style={styles.bulletPoint}>• Transmit any harmful code or malware</Text>
          <Text style={styles.bulletPoint}>• Engage in fraudulent activities</Text>
          <Text style={styles.bulletPoint}>• Violate any applicable laws or regulations</Text>

          <Text style={styles.sectionTitle}>4. Commission and Payments</Text>
          <Text style={styles.text}>
            Commission rates and payment terms are specified in your partner agreement. Payments will be processed according to the agreed schedule, subject to applicable fees and deductions.
          </Text>

          <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
          <Text style={styles.text}>
            All content, features, and functionality of the platform are owned by TiffinWale and protected by copyright, trademark, and other intellectual property laws.
          </Text>

          <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
          <Text style={styles.text}>
            TiffinWale shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.
          </Text>

          <Text style={styles.sectionTitle}>7. Termination</Text>
          <Text style={styles.text}>
            We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason deemed necessary.
          </Text>

          <Text style={styles.sectionTitle}>8. Modifications</Text>
          <Text style={styles.text}>
            We reserve the right to modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the modified Terms.
          </Text>

          <Text style={styles.sectionTitle}>9. Contact Information</Text>
          <Text style={styles.text}>
            For questions about these Terms, please contact:
          </Text>
          <Text style={styles.contactInfo}>Email: legal@tiffinwale.com</Text>
          <Text style={styles.contactInfo}>Phone: +91 9131114837</Text>

          <View style={styles.spacer} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 8,
  },
  lastUpdated: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
  contactInfo: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#FF9F43',
    marginTop: 8,
  },
  spacer: {
    height: 40,
  },
});

