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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>

          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.text}>
            Welcome to TiffinWale Partner. We are committed to protecting your privacy and ensuring the security of your personal information.
          </Text>

          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.text}>
            We collect information that you provide directly to us when you register, use our services, or communicate with us. This may include:
          </Text>
          <Text style={styles.bulletPoint}>• Business information (name, address, contact details)</Text>
          <Text style={styles.bulletPoint}>• Financial information (bank account details, payment information)</Text>
          <Text style={styles.bulletPoint}>• Operational data (menu items, orders, customer information)</Text>
          <Text style={styles.bulletPoint}>• Device information and usage data</Text>

          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.text}>
            We use the information we collect to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide and maintain our services</Text>
          <Text style={styles.bulletPoint}>• Process orders and payments</Text>
          <Text style={styles.bulletPoint}>• Communicate with you about your account and services</Text>
          <Text style={styles.bulletPoint}>• Improve our platform and services</Text>
          <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.text}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Text>

          <Text style={styles.sectionTitle}>5. Data Sharing</Text>
          <Text style={styles.text}>
            We do not sell your personal information. We may share your information with:
          </Text>
          <Text style={styles.bulletPoint}>• Service providers who assist us in operating our platform</Text>
          <Text style={styles.bulletPoint}>• Payment processors for transaction processing</Text>
          <Text style={styles.bulletPoint}>• Legal authorities when required by law</Text>

          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.text}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Access and update your personal information</Text>
          <Text style={styles.bulletPoint}>• Request deletion of your data</Text>
          <Text style={styles.bulletPoint}>• Object to processing of your data</Text>
          <Text style={styles.bulletPoint}>• Request data portability</Text>

          <Text style={styles.sectionTitle}>7. Contact Us</Text>
          <Text style={styles.text}>
            If you have questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: privacy@tiffinwale.com</Text>
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

