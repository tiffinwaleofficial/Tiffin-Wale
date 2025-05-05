import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { ArrowLeft, MessageCircle, Phone, HelpCircle, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function HelpSupportScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const supportEmail = 'support@tiffinwale.com';
  const supportPhone = '1800-123-4567';

  const helpCategories = [
    {
      title: 'Delivery Issues',
      description: 'Late deliveries, wrong location, etc.',
      action: () => alert('Delivery issues help will be shown here'),
    },
    {
      title: 'Food Quality',
      description: 'Issues with food quality or packaging',
      action: () => alert('Food quality help will be shown here'),
    },
    {
      title: 'Account & Payments',
      description: 'Subscription, payments, or account issues',
      action: () => alert('Account and payments help will be shown here'),
    },
    {
      title: 'Other Issues',
      description: 'Any other concerns or feedback',
      action: () => alert('Other issues help will be shown here'),
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <View style={styles.bellIconPlaceholder} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help topics..."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => alert('Chat support will be shown here')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#E6F2FF' }]}>
                <MessageCircle size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionTitle}>Chat</Text>
              <Text style={styles.actionSubtitle}>Support</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => Linking.openURL(`tel:${supportPhone}`)}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#E7F5EF' }]}>
                <Phone size={24} color="#22C55E" />
              </View>
              <Text style={styles.actionTitle}>Call Us</Text>
              <Text style={styles.actionSubtitle}></Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/faq')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3E7' }]}>
                <HelpCircle size={24} color="#F97316" />
              </View>
              <Text style={styles.actionTitle}>FAQs</Text>
              <Text style={styles.actionSubtitle}></Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Text style={styles.sectionTitle}>Help Categories</Text>
          <View style={styles.helpCategoriesContainer}>
            {helpCategories.map((category, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.categoryCard}
                onPress={category.action}
              >
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
                <ChevronRight size={20} color="#999999" />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <View style={styles.contactInfoCard}>
            <Text style={styles.contactInfoTitle}>Contact Information</Text>
            <Text style={styles.supportHours}>
              Our support team is available from 8:00 AM to 10:00 PM
            </Text>
            <View style={styles.contactDetail}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{supportEmail}</Text>
            </View>
            <View style={styles.contactDetail}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{supportPhone}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFBF2',
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#333333',
  },
  notificationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bellIconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#333333',
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333333',
  },
  actionSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  helpCategoriesContainer: {
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  contactInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInfoTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333333',
    marginBottom: 8,
  },
  supportHours: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  contactDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contactLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#666666',
  },
  contactValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333333',
  },
}); 