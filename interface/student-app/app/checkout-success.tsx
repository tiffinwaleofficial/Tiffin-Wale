import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Home, FileText, Gift, Star, Clock, Shield, Truck, Heart } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';

export default function CheckoutSuccessScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentSubscription } = useSubscriptionStore();
  const [planDetails, setPlanDetails] = useState<any>(null);

  useEffect(() => {
    // Refresh user subscriptions in the background
    const refreshSubscriptions = async () => {
      try {
        const { useSubscriptionStore } = await import('@/store/subscriptionStore');
        const { fetchUserSubscriptions } = useSubscriptionStore.getState();
        await fetchUserSubscriptions();
      } catch (error) {
        console.error('Error refreshing subscriptions:', error);
      }
    };

    refreshSubscriptions();
  }, []);

  const perks = [
    {
      icon: <Star size={24} color="#FFB800" />,
      title: "Premium Quality Meals",
      description: "Fresh, healthy meals prepared by top-rated restaurants"
    },
    {
      icon: <Truck size={24} color="#4CAF50" />,
      title: "Free Delivery",
      description: "No delivery charges on any of your meals"
    },
    {
      icon: <Clock size={24} color="#2196F3" />,
      title: "Flexible Timing",
      description: "Choose your preferred delivery time slots"
    },
    {
      icon: <Shield size={24} color="#9C27B0" />,
      title: "Hygiene Guaranteed",
      description: "100% hygienic preparation and packaging"
    },
    {
      icon: <Heart size={24} color="#E91E63" />,
      title: "Nutritionist Approved",
      description: "All meals are balanced and nutritionist approved"
    },
    {
      icon: <Gift size={24} color="#FF5722" />,
      title: "Special Rewards",
      description: "Earn points and get exclusive discounts"
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Success Icon */}
        <Animated.View 
          entering={FadeInUp.duration(600)}
          style={styles.iconContainer}
        >
          <CheckCircle size={120} color="#4CAF50" />
        </Animated.View>

        {/* Success Message */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.messageContainer}
        >
          <Text style={styles.title}>Subscription Activated!</Text>
          <Text style={styles.subtitle}>
            Welcome to TiffinWale, {user?.firstName || user?.name || 'Food Lover'}! 🎉{'\n'}
            Your subscription has been successfully activated and you're all set for delicious meals.
          </Text>
        </Animated.View>

        {/* Perks Section */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.perksContainer}
        >
          <Text style={styles.perksTitle}>🎁 What You Get With Your Subscription</Text>
          <View style={styles.perksGrid}>
            {perks.map((perk, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(600 + index * 100).duration(400)}
                style={styles.perkCard}
              >
                <View style={styles.perkIcon}>
                  {perk.icon}
                </View>
                <Text style={styles.perkTitle}>{perk.title}</Text>
                <Text style={styles.perkDescription}>{perk.description}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Info Cards */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(600)}
          style={styles.infoContainer}
        >
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🚀 What's Next?</Text>
            <Text style={styles.infoText}>
              • Check your profile to view detailed subscription information{'\n'}
              • Browse today's meals on your personalized dashboard{'\n'}
              • Rate and review meals to help us serve you better{'\n'}
              • Pause or modify your subscription anytime{'\n'}
              • Contact support for any assistance 24/7
            </Text>
          </View>

          <View style={[styles.infoCard, styles.highlightCard]}>
            <Text style={styles.highlightTitle}>🎉 Welcome to the Family!</Text>
            <Text style={styles.highlightText}>
              You're now part of the TiffinWale family with over 10,000+ happy customers. 
              Get ready for an amazing culinary journey with fresh, healthy, and delicious meals 
              delivered right to your doorstep!
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(1000).duration(600)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.replace('/dashboard')}
          >
            <Home size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/subscription-details')}
          >
            <FileText size={20} color="#FF9B42" />
            <Text style={styles.secondaryButtonText}>View Subscription Details</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  perksContainer: {
    marginBottom: 32,
  },
  perksTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  perksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  perkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  perkIcon: {
    marginBottom: 12,
  },
  perkTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 6,
  },
  perkDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: 22,
  },
  highlightCard: {
    backgroundColor: '#FFF5E8',
    borderWidth: 2,
    borderColor: '#FF9B42',
  },
  highlightTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FF9B42',
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333333',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9B42',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF9B42',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9B42',
  },
});


