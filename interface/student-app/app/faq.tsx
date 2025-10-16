import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { BackButton } from '@/components/BackButton';
import { useTranslation } from '@/hooks/useTranslation';

const FAQ_ITEMS = [
  {
    question: 'How does the subscription work?',
    answer: 'Our subscription service provides daily meals delivered to your doorstep. Choose from our Basic, Premium, or Family plans, each offering different meal frequencies and customization options. You can pause, modify, or cancel your subscription anytime.',
  },
  {
    question: 'What are the delivery timings?',
    answer: 'We deliver meals according to standard meal times: Breakfast (7:30 AM - 9:00 AM), Lunch (12:00 PM - 1:30 PM), and Dinner (7:00 PM - 8:30 PM). You can customize your preferred delivery time slots within these windows.',
  },
  {
    question: 'Can I customize my meals?',
    answer: 'Yes! Premium and Family plan subscribers can customize their meals based on dietary preferences, allergies, and taste preferences. Basic plan users receive our standard menu rotation.',
  },
  {
    question: 'How do I pause my subscription?',
    answer: 'You can easily pause your subscription through the app. Go to your subscription settings and select "Pause Subscription." You can pause for up to 30 days at a time.',
  },
  {
    question: "What if I'm not satisfied with a meal?",
    answer: "Your satisfaction is our priority. If you're not happy with a meal, please rate and provide feedback in the app. We'll review your feedback and may offer compensation or replacement meals.",
  },
  {
    question: 'Do you deliver on weekends?',
    answer: 'Yes, we offer weekend delivery with all our subscription plans. You can choose to opt-out of weekend delivery if preferred.',
  },
  {
    question: 'How is the food packaged?',
    answer: 'We use high-quality, food-grade containers that are microwave-safe and environmentally friendly. All packaging is sealed to maintain freshness and hygiene.',
  },
  {
    question: 'What about food allergies?',
    answer: 'We take allergies very seriously. You can specify your allergies in your profile, and our system will ensure you never receive meals containing those ingredients.',
  },
  {
    question: 'Can I order extra items?',
    answer: 'Yes! Besides your regular subscription meals, you can order additional items like desserts, beverages, or extra portions through the app.',
  },
  {
    question: 'How do I contact customer support?',
    answer: "You can reach our customer support team through the app's help section, email at support@tiffinwale.com, or call us at 1800-123-4567 during business hours.",
  },
];

export default function FAQScreen() {
  const router = useRouter();
  const { t } = useTranslation('support');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>{t('frequentlyAskedQuestions')}</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FAQ_ITEMS.map((item, index) => (
          <Animated.View 
            key={index}
            entering={FadeInDown.delay(200 + (index * 50)).duration(400)}
          >
            <TouchableOpacity
              style={[
                styles.faqItem,
                expandedIndex === index && styles.faqItemExpanded
              ]}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <View style={styles.questionContainer}>
                <Text style={styles.question}>{item.question}</Text>
                {expandedIndex === index ? (
                  <ChevronUp size={20} color="#FF9B42" />
                ) : (
                  <ChevronDown size={20} color="#666666" />
                )}
              </View>
              
              {expandedIndex === index && (
                <Text style={styles.answer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Still have questions?</Text>
          <Text style={styles.supportText}>
            Our support team is here to help you with any questions or concerns.
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 40,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  faqItemExpanded: {
    backgroundColor: '#FFF8EE',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333333',
    flex: 1,
    marginRight: 16,
  },
  answer: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
    lineHeight: 22,
  },
  supportSection: {
    marginTop: 32,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  supportTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333333',
    marginBottom: 8,
  },
  supportText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  contactButton: {
    backgroundColor: '#FF9B42',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  contactButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});