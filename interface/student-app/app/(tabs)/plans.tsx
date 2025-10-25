import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { Check, Crown, Zap, Shield, RefreshCw, Eye, Star } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter, useFocusEffect } from 'expo-router';
import { useRestaurantStore } from '@/store/restaurantStore';

import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuth } from '@/auth/AuthProvider';
import { SubscriptionPlan } from '@/types/api';
import PlanDetailModal from '@/components/PlanDetailModal';
import { useTranslation } from '@/hooks/useTranslation';
import { Restaurant } from '@/types/restaurant';

export default function PlansScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation('subscription');
  const { 
    availablePlans, 
    currentSubscription, 
    isLoading, 
    error, 
    fetchAvailablePlans,
    fetchCurrentSubscription,
    refreshSubscriptionData,
    createSubscription 
  } = useSubscriptionStore();

  const {
    restaurants,
    isLoading: restaurantsLoading,
    fetchRestaurants,
  } = useRestaurantStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [subscribingToPlan, setSubscribingToPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Enterprise caching: Load cached data immediately on mount
  useEffect(() => {
    const initializePlans = async () => {
      if (__DEV__) console.log('🔔 Plans: Showing cached data instantly');
      
      try {
        // Load cached data first (no force refresh) - INSTANT UI
        await Promise.all([
          fetchAvailablePlans(false),
          fetchCurrentSubscription(false),
          fetchRestaurants(),
        ]);
        
        if (__DEV__) console.log('✅ Plans: Cached data loaded instantly');
      } catch (error) {
        if (__DEV__) console.error('❌ Plans: Error loading cached data:', error);
      }
    };
    
    initializePlans();
  }, []);

  // Smart focus refresh: Background refresh when page comes into focus
  useFocusEffect(
    useCallback(() => {
      if (__DEV__) console.log('👁️ Plans: Page focused - background refresh');
      // Background refresh without loading states
      setTimeout(() => {
        fetchAvailablePlans(false); // Background refresh
        fetchCurrentSubscription(false); // Background refresh
        fetchRestaurants();
      }, 100);
    }, [fetchAvailablePlans, fetchCurrentSubscription])
  );

  // Pull to refresh handler - Force fresh data
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (__DEV__) console.log('🔄 Plans: Pull-to-refresh triggered');
      await Promise.all([
        fetchAvailablePlans(true), // Force refresh
        fetchCurrentSubscription(true), // Force refresh
        fetchRestaurants(),
      ]);
    } catch (error) {
      console.error('Error refreshing plans:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }

    // Navigate to checkout page with the selected plan
    router.push(`/checkout?planId=${planId}` as any);
  };

  const handleViewPlanDetails = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const handleModalSubscribe = (planId: string) => {
    setModalVisible(false);
    handleSubscribe(planId);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(0)}`;
  };

  const renderRestaurantCard = (restaurant: Restaurant, index: number) => {
    return (
      <Animated.View
        key={restaurant.id}
        entering={FadeInDown.delay(index * 150).duration(400)}
      >
        <TouchableOpacity style={styles.restaurantCard} onPress={() => router.push(`/restaurant/${restaurant.id}`)}>
          <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName} numberOfLines={1}>{restaurant.name}</Text>
            <Text style={styles.restaurantCuisine} numberOfLines={1}>
              {Array.isArray(restaurant.cuisineType) ? restaurant.cuisineType.join(', ') : ''}
            </Text>
            <View style={styles.restaurantRating}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.restaurantRatingText}>{restaurant.rating?.toFixed(1)} ({restaurant.reviewCount} reviews)</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
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
    if (!currentSubscription) return false;
    
    // Check if the current subscription's plan matches this plan
    const subscriptionPlanId = typeof currentSubscription.plan === 'string' 
      ? currentSubscription.plan 
      : currentSubscription.plan?.id;
      
    return subscriptionPlanId === planId && 
           (currentSubscription.status === 'active' || currentSubscription.status === 'pending');
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
              <Text style={styles.activeLabelText}>{t('currentPlan')}</Text>
            </View>
          )}
        </View>

        <Text style={styles.planDescription}>{plan.description}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatPrice(plan.price)}</Text>
          <Text style={styles.pricePeriod}>/{plan.duration} {t('days')}</Text>
        </View>

        {plan.features && plan.features.length > 0 && (
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>{t('features')}</Text>
            {plan.features.map((feature: string, idx: number) => (
              <View key={idx} style={styles.featureItem}>
                <Check size={16} color="#4CAF50" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}

        {isActive && currentSubscription && (
          <View style={styles.subscriptionDetails}>
            <Text style={styles.subscriptionDetailsTitle}>{t('subscriptionDetails')}</Text>
            <View style={styles.subscriptionDetailRow}>
              <Text style={styles.subscriptionDetailLabel}>{t('status')}</Text>
              <Text style={[styles.subscriptionDetailValue, { 
                color: currentSubscription.status === 'active' ? '#4CAF50' : '#FF9B42' 
              }]}>
                {currentSubscription.status.toUpperCase()}
              </Text>
            </View>
            <View style={styles.subscriptionDetailRow}>
              <Text style={styles.subscriptionDetailLabel}>{t('validUntil')}</Text>
              <Text style={styles.subscriptionDetailValue}>
                {new Date(currentSubscription.endDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
            </View>
            <View style={styles.subscriptionDetailRow}>
              <Text style={styles.subscriptionDetailLabel}>{t('startedOn')}</Text>
              <Text style={styles.subscriptionDetailValue}>
                {new Date(currentSubscription.startDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => handleViewPlanDetails(plan)}
          >
            <Eye size={16} color="#FF9B42" />
            <Text style={styles.viewDetailsButtonText}>{t('viewDetails')}</Text>
          </TouchableOpacity>

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
                ? t('subscribing') 
                : isActive 
                  ? t('activePlan') 
                  : t('subscribeNow')
              }
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  // Removed loading state - show content immediately

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('subscriptionPlans')}</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            onPress={() => {
              fetchAvailablePlans(true);
              fetchRestaurants();
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('subscriptionPlans')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('choosePerfectPlan')}
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
        {currentSubscription && currentSubscription.plan && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={styles.sectionTitle}>{t('activeSubscription')}</Text>
            {renderPlanCard(currentSubscription.plan as SubscriptionPlan, 0)}
          </Animated.View>
        )}
        
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.sectionTitle}>{t('exploreTiffinCenters')}</Text>
          {restaurantsLoading && restaurants.length === 0 ? (
            <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#FF9B42" />
          ) : restaurants.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Crown size={64} color="#CCCCCC" />
              <Text style={styles.emptyTitle}>{t('noTiffinCentersFound')}</Text>
              <Text style={styles.emptyDescription}>
                {t('checkBackLaterForTiffinCenters')}
              </Text>
            </View>
          ) : (
            <View style={styles.plansContainer}>
              {restaurants.map((restaurant, index) => renderRestaurantCard(restaurant, index))}
            </View>
          )}
        </Animated.View>

      </ScrollView>

      {/* Plan Detail Modal */}
      <PlanDetailModal
        visible={modalVisible}
        plan={selectedPlan}
        onClose={() => setModalVisible(false)}
        onSubscribe={handleModalSubscribe}
        isActive={selectedPlan ? isPlanActive(selectedPlan.id) : false}
      />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
    marginTop: 20,
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  restaurantImage: {
    width: 120,
    height: '100%',
  },
  restaurantInfo: {
    padding: 16,
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  restaurantRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantRatingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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
  subscriptionDetails: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8F4FD',
  },
  subscriptionDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  subscriptionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionDetailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  subscriptionDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  viewDetailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF9B42',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  viewDetailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9B42',
  },
  subscribeButton: {
    flex: 2,
    backgroundColor: '#FF9B42',
    borderRadius: 12,
    paddingVertical: 12,
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
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
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