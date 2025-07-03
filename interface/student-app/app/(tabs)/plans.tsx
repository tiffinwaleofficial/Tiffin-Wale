import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Check, Crown, Zap, Shield, RefreshCw } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { useSubscriptionStore, SubscriptionPlan } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';

export default function PlansScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    activePlans, 
    currentSubscription, 
    isLoading, 
    error, 
    fetchActivePlans,
    createSubscription 
  } = useSubscriptionStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [subscribingToPlan, setSubscribingToPlan] = useState<string | null>(null);

  // Fetch plans on component mount
  useEffect(() => {
    fetchActivePlans();
  }, [fetchActivePlans]);

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchActivePlans();
    } catch (error) {
      console.error('Error refreshing plans:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setSubscribingToPlan(planId);
    try {
      await createSubscription(planId);
      // Navigate to success page or show success message
      router.push('/(tabs)');
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      // Show error message to user
    } finally {
      setSubscribingToPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(0)}`;
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('premium') || name.includes('pro')) {
      return <Crown size={24} color="#FF9B42" />;
    } else if (name.includes('basic') || name.includes('starter')) {
      return <Zap size={24} color="#4CAF50" />;
    } else {
      return <Shield size={24} color="#2196F3" />;
    }
  };

  const isPlanActive = (planId: string) => {
    return currentSubscription?.planId === planId && currentSubscription.status === 'active';
  };

  const renderPlanCard = (plan: SubscriptionPlan, index: number) => {
    const isActive = isPlanActive(plan.id);
    const isSubscribing = subscribingToPlan === plan.id;
    
    return (
      <Animated.View
        key={plan.id}
        entering={FadeInDown.delay(index * 150).duration(400)}
        style={[
          styles.planCard,
          isActive && styles.activePlanCard
        ]}
      >
        <View style={styles.planHeader}>
          <View style={styles.planTitleContainer}>
            {getPlanIcon(plan.name)}
            <Text style={styles.planName}>{plan.name}</Text>
          </View>
          {isActive && (
            <View style={styles.activeLabel}>
              <Text style={styles.activeLabelText}>Current Plan</Text>
            </View>
          )}
        </View>

        <Text style={styles.planDescription}>{plan.description}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(plan.price)}</Text>
          <Text style={styles.pricePeriod}>/{plan.duration} days</Text>
        </View>

        {plan.features && plan.features.length > 0 && (
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Features:</Text>
            {plan.features.map((feature: string, idx: number) => (
              <View key={idx} style={styles.featureItem}>
                <Check size={16} color="#4CAF50" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.subscribeButton,
            isActive && styles.activeSubscribeButton,
            isSubscribing && styles.loadingButton
          ]}
          onPress={() => !isActive && !isSubscribing && handleSubscribe(plan.id)}
          disabled={isActive || isSubscribing}
        >
          {isSubscribing ? (
            <RefreshCw size={16} color="#FFFFFF" />
          ) : null}
          <Text style={[
            styles.subscribeButtonText,
            isActive && styles.activeSubscribeButtonText
          ]}>
            {isSubscribing 
              ? 'Subscribing...' 
              : isActive 
                ? 'Active Plan' 
                : 'Subscribe Now'
            }
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Subscription Plans</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Subscription Plans</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            onPress={fetchActivePlans}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <Text style={styles.headerSubtitle}>
          Choose the perfect plan for your meal needs
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#FF9B42']}
            tintColor="#FF9B42"
          />
        }
      >
        {activePlans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Crown size={64} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No plans available</Text>
            <Text style={styles.emptyDescription}>
              Check back later for available subscription plans
            </Text>
          </View>
        ) : (
          <View style={styles.plansContainer}>
            {activePlans.map((plan, index) => renderPlanCard(plan, index))}
          </View>
        )}

        {/* Additional Info */}
        <Animated.View 
          entering={FadeInDown.delay(activePlans.length * 150 + 200).duration(400)}
          style={styles.infoCard}
        >
          <Text style={styles.infoTitle}>Why Subscribe?</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Check size={16} color="#4CAF50" />
              <Text style={styles.infoText}>Regular, healthy meals delivered daily</Text>
            </View>
            <View style={styles.infoItem}>
              <Check size={16} color="#4CAF50" />
              <Text style={styles.infoText}>Affordable pricing compared to ordering daily</Text>
            </View>
            <View style={styles.infoItem}>
              <Check size={16} color="#4CAF50" />
              <Text style={styles.infoText}>Flexible pause and resume options</Text>
            </View>
            <View style={styles.infoItem}>
              <Check size={16} color="#4CAF50" />
              <Text style={styles.infoText}>No cooking or meal planning required</Text>
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
    backgroundColor: '#FFFAF0',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFAF0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF9B42',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  plansContainer: {
    paddingBottom: 20,
  },
  planCard: {
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
  activePlanCard: {
    borderWidth: 2,
    borderColor: '#FF9B42',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  activeLabel: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
    textTransform: 'uppercase',
  },
  planDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF9B42',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#FF9B42',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  activeSubscribeButton: {
    backgroundColor: '#E8E8E8',
  },
  loadingButton: {
    opacity: 0.7,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  activeSubscribeButtonText: {
    color: '#666666',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    lineHeight: 20,
  },
});