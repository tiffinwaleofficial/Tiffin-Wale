import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, ChevronRight, Phone, Mail, MessageSquare, FileText, CircleHelp as HelpCircle } from 'lucide-react-native';

const faqData = [
  {
    id: '1',
    question: 'How do I update my menu items?',
    answer: 'You can update your menu items from the Menu Management section in your dashboard. Click on the item you want to update and make the necessary changes.',
  },
  {
    id: '2',
    question: 'How are payments processed?',
    answer: 'Payments are processed weekly. The amount will be transferred directly to your registered bank account every Monday for the previous week\'s orders.',
  },
  {
    id: '3',
    question: 'What if I need to take a break?',
    answer: 'You can temporarily disable your availability from the Settings section. This will prevent new orders from coming in until you enable it again.',
  },
  {
    id: '4',
    question: 'How do I handle order cancellations?',
    answer: 'If a customer cancels an order, you\'ll receive a notification. The order will be automatically removed from your queue, and any applicable compensation will be processed.',
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactOptions}>
            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => {
                // Handle phone call
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#EBF5FF' }]}>
                <Phone size={24} color="#3B82F6" />
              </View>
              <Text style={styles.contactText}>Call Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => {
                // Handle email
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Mail size={24} color="#F59E0B" />
              </View>
              <Text style={styles.contactText}>Email Us</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => router.push('/profile/chat')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
                <MessageSquare size={24} color="#10B981" />
              </View>
              <Text style={styles.contactText}>Live Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqData.map((faq) => (
            <TouchableOpacity key={faq.id} style={styles.faqItem}>
              <View style={styles.faqHeader}>
                <HelpCircle size={20} color="#666" />
                <Text style={styles.faqQuestion}>{faq.question}</Text>
              </View>
              <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.helpfulLinks}>
          <Text style={styles.sectionTitle}>Helpful Links</Text>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => router.push('/profile/terms')}
          >
            <View style={styles.linkContent}>
              <FileText size={20} color="#666" />
              <Text style={styles.linkText}>Terms & Conditions</Text>
            </View>
            <ChevronRight size={20} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => router.push('/profile/privacy')}
          >
            <View style={styles.linkContent}>
              <FileText size={20} color="#666" />
              <Text style={styles.linkText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color="#CCC" />
          </TouchableOpacity>
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
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  contactSection: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactOption: {
    alignItems: 'center',
    width: '30%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  faqSection: {
    padding: 16,
    backgroundColor: '#FFF',
    marginTop: 8,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  faqQuestion: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  helpfulLinks: {
    padding: 16,
    backgroundColor: '#FFF',
    marginTop: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
});