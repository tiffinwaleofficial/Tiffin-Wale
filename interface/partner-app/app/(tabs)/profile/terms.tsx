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

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: April 26, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.text}>
            Welcome to TiffinWale Partner. These Terms and Conditions govern your use of our platform and services as a food service partner. By registering and using our platform, you agree to these terms in their entirety.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Partner Responsibilities</Text>
          <Text style={styles.text}>
            As a TiffinWale Partner, you agree to:{'\n\n'}
            • Maintain high food quality and safety standards{'\n'}
            • Prepare and package food in a hygienic environment{'\n'}
            • Follow all local health and safety regulations{'\n'}
            • Accurately represent your menu items and pricing{'\n'}
            • Maintain consistent operating hours as specified{'\n'}
            • Process orders promptly and accurately
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Commission & Payments</Text>
          <Text style={styles.text}>
            • TiffinWale charges a commission of 15% on each order{'\n'}
            • Payments are processed weekly{'\n'}
            • All applicable taxes will be deducted as per local laws{'\n'}
            • Payment disputes must be raised within 7 days
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Order Management</Text>
          <Text style={styles.text}>
            Partners are responsible for:{'\n\n'}
            • Accepting orders within 5 minutes{'\n'}
            • Updating order status promptly{'\n'}
            • Maintaining sufficient inventory{'\n'}
            • Communicating any issues immediately
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Quality Standards</Text>
          <Text style={styles.text}>
            All partners must maintain:{'\n\n'}
            • FSSAI certification{'\n'}
            • Regular health and safety inspections{'\n'}
            • Proper food storage facilities{'\n'}
            • Clean and hygienic preparation areas
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Termination</Text>
          <Text style={styles.text}>
            TiffinWale reserves the right to terminate partnership if:{'\n\n'}
            • Quality standards are not maintained{'\n'}
            • Multiple customer complaints are received{'\n'}
            • Terms and conditions are violated{'\n'}
            • Fraudulent activity is detected
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Updates to Terms</Text>
          <Text style={styles.text}>
            We may update these terms from time to time. Partners will be notified of any changes, and continued use of the platform constitutes acceptance of updated terms.
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