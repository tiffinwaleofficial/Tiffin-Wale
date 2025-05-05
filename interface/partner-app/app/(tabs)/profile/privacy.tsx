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

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: April 26, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.text}>
            We collect the following types of information:{'\n\n'}
            • Business Information (name, address, contact details){'\n'}
            • Financial Information (bank account details){'\n'}
            • Order and Transaction History{'\n'}
            • Device and Usage Information{'\n'}
            • Location Data
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            Your information is used for:{'\n\n'}
            • Processing orders and payments{'\n'}
            • Improving our services{'\n'}
            • Communication about orders and updates{'\n'}
            • Analytics and performance monitoring{'\n'}
            • Legal compliance
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Data Security</Text>
          <Text style={styles.text}>
            We implement various security measures including:{'\n\n'}
            • Encryption of sensitive data{'\n'}
            • Secure server infrastructure{'\n'}
            • Regular security audits{'\n'}
            • Access controls and authentication{'\n'}
            • Regular backup procedures
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Sharing</Text>
          <Text style={styles.text}>
            We may share your information with:{'\n\n'}
            • Delivery partners{'\n'}
            • Payment processors{'\n'}
            • Analytics providers{'\n'}
            • Legal authorities when required{'\n\n'}
            We never sell your personal information to third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.text}>
            You have the right to:{'\n\n'}
            • Access your personal data{'\n'}
            • Request data correction{'\n'}
            • Delete your account{'\n'}
            • Opt-out of marketing communications{'\n'}
            • Export your data
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Cookies and Tracking</Text>
          <Text style={styles.text}>
            We use cookies and similar technologies to:{'\n\n'}
            • Improve user experience{'\n'}
            • Analyze platform usage{'\n'}
            • Customize content{'\n'}
            • Remember your preferences
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Contact Us</Text>
          <Text style={styles.text}>
            For privacy-related concerns:{'\n\n'}
            Email: privacy@tiffinwale.com{'\n'}
            Phone: +91 98765 43210{'\n'}
            Address: 123 Privacy Street, Bangalore - 560001
          </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
  },
  content: {
    padding: 16,
  },
  lastUpdated: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
});