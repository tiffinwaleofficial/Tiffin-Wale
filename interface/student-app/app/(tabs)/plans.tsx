import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Check, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 2999,
    description: 'Perfect for students and individuals',
    features: [
      '2 meals per day',
      'Basic menu rotation',
      'Weekend delivery',
    ],
    inactiveFeatures: [
      'Menu customization',
      'Priority support',
    ],
    color: '#E3F2FD',
    accentColor: '#1E88E5',
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 3999,
    description: 'Most popular choice for professionals',
    features: [
      '2 meals per day',
      'Premium menu rotation',
      'Weekend delivery',
      'Basic menu customization',
      'Priority support',
    ],
    popular: true,
    color: '#FFF8EE',
    accentColor: '#FF9B42',
  },
  {
    id: 'family',
    name: 'Family Plan',
    price: 7999,
    description: 'Ideal for families and small groups',
    features: [
      '3 meals per day',
      'Premium menu rotation',
      'Weekend delivery',
      'Full menu customization',
      '24/7 Priority support',
    ],
    color: '#E8F5E9',
    accentColor: '#43A047',
  },
];

export default function PlansScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.header}>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SUBSCRIPTION_PLANS.map((plan, index) => (
          <Animated.View 
            key={plan.id}
            entering={FadeInDown.delay(200 + (index * 100)).duration(400)}
            style={[
              styles.planCard,
              { backgroundColor: plan.color }
            ]}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}
            
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planDescription}>{plan.description}</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <Text style={styles.price}>{plan.price}</Text>
              <Text style={styles.period}>/month</Text>
            </View>

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Check size={20} color={plan.accentColor} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
              
              {plan.inactiveFeatures?.map((feature, idx) => (
                <View key={idx} style={[styles.featureRow, styles.inactiveFeature]}>
                  <Check size={20} color="#CCCCCC" />
                  <Text style={styles.inactiveFeatureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.subscribeButton, { backgroundColor: plan.accentColor }]}
              onPress={() => router.push('/subscription-checkout')}
            >
              <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>Have questions?</Text>
          <TouchableOpacity 
            style={styles.faqButton}
            onPress={() => router.push('/faq')}
          >
            <Text style={styles.faqButtonText}>Check our FAQ</Text>
            <ChevronRight size={20} color="#FF9B42" />
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFAF0',
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  planCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FF9B42',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  popularText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 4,
  },
  planDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  currencySymbol: {
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    color: '#333333',
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    color: '#333333',
    marginRight: 4,
  },
  period: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
  },
  inactiveFeature: {
    opacity: 0.5,
  },
  inactiveFeatureText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#999999',
    marginLeft: 12,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  subscribeButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
  faqContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  faqTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333333',
    marginBottom: 12,
  },
  faqButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8EE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  faqButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9B42',
    marginRight: 8,
  },
});