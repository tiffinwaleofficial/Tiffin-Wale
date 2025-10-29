import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  HelpCircle,
  FileText,
  Send,
  ExternalLink,
  MessageSquare,
  Video,
  BookOpen,
  CheckCircle,
} from 'lucide-react-native';
import { api } from '../../lib/api';

const HelpSupportScreen = () => {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);
  
  const handleChatWithSupport = () => {
    router.push({
      pathname: '/pages/chat',
      params: {
        recipientId: 'support_team',
        recipientName: 'Support Team',
        conversationType: 'support',
      },
    });
  };

  const categories = [
    { id: 'payments', label: 'Payments & Earnings', icon: '💰' },
    { id: 'orders', label: 'Orders & Delivery', icon: '📦' },
    { id: 'account', label: 'Account Settings', icon: '⚙️' },
    { id: 'menu', label: 'Menu Management', icon: '🍽️' },
    { id: 'technical', label: 'Technical Issues', icon: '🔧' },
    { id: 'other', label: 'Other', icon: '❓' },
  ];

  const handleCall = () => {
    Linking.openURL('tel:+919131114837');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@tiffinwale.com?subject=Partner Support Request');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/919131114837');
  };

  const handleSubmitQuery = async () => {
    if (!subject || !message || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields before submitting');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await api.support.createTicket({
        subject,
        message,
        category: selectedCategory as any,
      });

      // Stop loading
      setIsSubmitting(false);

      // Store the submitted ticket to show success UI
      setSubmittedTicket(response.ticket);

      // Clear form
      setSubject('');
      setMessage('');
      setSelectedCategory('');
    } catch (error: any) {
      setIsSubmitting(false);
      console.error('Support ticket error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to submit ticket. Please try again or contact us directly.'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Chat with Support */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.chatWithSupportButton}
            onPress={handleChatWithSupport}
          >
            <View style={styles.chatIconContainer}>
              <MessageCircle size={28} color="#FFF" />
            </View>
            <View style={styles.chatTextContainer}>
              <Text style={styles.chatTitle}>Chat with Support</Text>
              <Text style={styles.chatSubtitle}>Get instant help from our team</Text>
            </View>
            <ExternalLink size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Contact</Text>
          <Text style={styles.sectionSubtitle}>
            Get instant assistance through your preferred channel
          </Text>

          <View style={styles.contactGrid}>
            <TouchableOpacity style={styles.contactCard} onPress={handleCall}>
              <View style={[styles.contactIconContainer, { backgroundColor: '#DCFCE7' }]}>
                <Phone size={24} color="#10B981" />
              </View>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactValue}>+91 91 3111 4837</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp}>
              <View style={[styles.contactIconContainer, { backgroundColor: '#D1FAE5' }]}>
                <MessageCircle size={24} color="#10B981" />
              </View>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactValue}>Chat Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
              <View style={[styles.contactIconContainer, { backgroundColor: '#E0E7FF' }]}>
                <Mail size={24} color="#3B82F6" />
              </View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>support@tiffinwale.com</Text>
            </TouchableOpacity>

            <View style={styles.contactCard}>
              <View style={[styles.contactIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Clock size={24} color="#F59E0B" />
              </View>
              <Text style={styles.contactLabel}>Available</Text>
              <Text style={styles.contactValue}>24/7</Text>
            </View>
          </View>
        </View>

        {/* Submit a Query */}
        <View style={styles.section}>
          {submittedTicket ? (
            /* Success Message */
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <CheckCircle size={48} color="#10B981" />
              </View>
              <Text style={styles.successTitle}>Ticket Created Successfully! 🎉</Text>
              <Text style={styles.successMessage}>
                Your support request has been submitted successfully.
                Our team will get back to you within 24 hours.
              </Text>
              
              <View style={styles.ticketIdCard}>
                <Text style={styles.ticketIdLabel}>Your Ticket ID</Text>
                <Text style={styles.ticketId}>{submittedTicket.ticketId}</Text>
                <Text style={styles.ticketIdHint}>
                  Save this ID to track your request
                </Text>
              </View>

              <View style={styles.ticketDetailsCard}>
                <View style={styles.ticketDetailRow}>
                  <Text style={styles.ticketDetailLabel}>Subject:</Text>
                  <Text style={styles.ticketDetailValue}>{submittedTicket.subject}</Text>
                </View>
                <View style={styles.ticketDetailRow}>
                  <Text style={styles.ticketDetailLabel}>Category:</Text>
                  <Text style={styles.ticketDetailValue}>{submittedTicket.category}</Text>
                </View>
                <View style={styles.ticketDetailRow}>
                  <Text style={styles.ticketDetailLabel}>Status:</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{submittedTicket.status}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.newTicketButton}
                onPress={() => setSubmittedTicket(null)}
              >
                <Text style={styles.newTicketButtonText}>Submit Another Query</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Query Form */
            <>
              <Text style={styles.sectionTitle}>Submit a Query</Text>
              <Text style={styles.sectionSubtitle}>
                Can't reach us? Submit your query and we'll respond within 24 hours
              </Text>

              <View style={styles.form}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.id && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.categoryTextActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Brief description of your issue"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Describe your issue in detail..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={6}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmitQuery}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Send size={18} color="#FFF" />
              )}
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Query'}
              </Text>
            </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqContainer}>
            <TouchableOpacity style={styles.faqItem}>
              <View style={styles.faqIconContainer}>
                <HelpCircle size={20} color="#FF9F43" />
              </View>
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>How do I receive payments?</Text>
                <Text style={styles.faqAnswer}>
                  Payments are automatically transferred to your linked bank account every week on Sunday.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.faqItem}>
              <View style={styles.faqIconContainer}>
                <HelpCircle size={20} color="#FF9F43" />
              </View>
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>What is the commission rate?</Text>
                <Text style={styles.faqAnswer}>
                  The platform charges a commission based on your agreement. Check your profile for exact rates.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.faqItem}>
              <View style={styles.faqIconContainer}>
                <HelpCircle size={20} color="#FF9F43" />
              </View>
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>How do I update my menu?</Text>
                <Text style={styles.faqAnswer}>
                  Go to Menu tab, select your menu, and add/edit items. Changes are reflected immediately.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.faqItem}>
              <View style={styles.faqIconContainer}>
                <HelpCircle size={20} color="#FF9F43" />
              </View>
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>Can I pause accepting orders?</Text>
                <Text style={styles.faqAnswer}>
                  Yes, you can toggle "Accepting Orders" in your business profile at any time.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.faqItem}>
              <View style={styles.faqIconContainer}>
                <HelpCircle size={20} color="#FF9F43" />
              </View>
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>How do I handle refunds?</Text>
                <Text style={styles.faqAnswer}>
                  Contact our support team for refund requests. Refunds are processed within 5-7 business days.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>

          <TouchableOpacity style={styles.resourceItem}>
            <View style={styles.resourceIconContainer}>
              <BookOpen size={20} color="#3B82F6" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Partner Guidelines</Text>
              <Text style={styles.resourceDescription}>
                Learn best practices for managing your tiffin business
              </Text>
            </View>
            <ExternalLink size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <View style={styles.resourceIconContainer}>
              <Video size={20} color="#EC4899" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Video Tutorials</Text>
              <Text style={styles.resourceDescription}>
                Watch step-by-step guides on using the partner app
              </Text>
            </View>
            <ExternalLink size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <View style={styles.resourceIconContainer}>
              <FileText size={20} color="#F59E0B" />
            </View>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Documentation</Text>
              <Text style={styles.resourceDescription}>
                Detailed documentation on app features and policies
              </Text>
            </View>
            <ExternalLink size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Operating Hours */}
        <View style={styles.section}>
          <View style={styles.hoursCard}>
            <Clock size={24} color="#FF9F43" />
            <View style={styles.hoursContent}>
              <Text style={styles.hoursTitle}>Support Hours</Text>
              <Text style={styles.hoursText}>Monday - Sunday: 9:00 AM - 9:00 PM</Text>
              <Text style={styles.hoursSubtext}>
                Emergency support available 24/7 via WhatsApp
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    width: '47%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    textAlign: 'center',
  },
  form: {
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginBottom: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipActive: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FF9F43',
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  categoryTextActive: {
    color: '#FF9F43',
    fontFamily: 'Poppins-SemiBold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    backgroundColor: '#FFF',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F43',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#FFCB8F',
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    gap: 12,
  },
  faqIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF8E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqContent: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    lineHeight: 16,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    marginBottom: 10,
    gap: 12,
  },
  resourceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  resourceDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E6',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  hoursContent: {
    flex: 1,
  },
  hoursTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  hoursText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#FF9F43',
    marginBottom: 4,
  },
  hoursSubtext: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#10B981',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  ticketIdCard: {
    backgroundColor: '#ECFDF5',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A7F3D0',
    marginBottom: 16,
  },
  ticketIdLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#059669',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#10B981',
    marginBottom: 8,
  },
  ticketIdHint: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  ticketDetailsCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    marginBottom: 24,
  },
  ticketDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ticketDetailLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  ticketDetailValue: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#10B981',
    textTransform: 'capitalize',
  },
  newTicketButton: {
    backgroundColor: '#FF9F43',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  newTicketButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
  },
  chatWithSupportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  chatIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatTextContainer: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  chatSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

export default HelpSupportScreen;

