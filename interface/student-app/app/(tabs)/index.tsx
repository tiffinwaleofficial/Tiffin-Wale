import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Bell, Calendar, MapPin, Clock, Star } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SplashScreen from '@/components/SplashScreen';

import { useAuth } from '@/auth/AuthProvider';
import { useMealStore } from '@/store/mealStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { ActiveSubscriptionDashboard } from '@/components/ActiveSubscriptionDashboard';
import { NoSubscriptionDashboard } from '@/components/NoSubscriptionDashboard';
import { useRestaurantStore } from '@/store/restaurantStore';
import { Restaurant } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isInitialized, isLoading: authLoading } = useAuth();
  const { t } = useTranslation('common');
  const { 
    todayMeals, 
    isLoading: mealsLoading, 
    error: mealsError, 
    fetchTodayMeals 
  } = useMealStore();
  const { 
    currentSubscription, 
    isLoading: subscriptionLoading, 
    fetchCurrentSubscription 
  } = useSubscriptionStore();
  const { 
    getUnreadCount, 
    notifications,
    fetchNotifications
  } = useNotificationStore();
  const {
    restaurants,
    isLoading: restaurantsLoading,
    fetchRestaurants,
  } = useRestaurantStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Load initial data ONLY once when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      if (__DEV__) console.log('🔍 Dashboard: Initial load check:', { 
        isInitialized, 
        authLoading, 
        userId: user?.id,
        isAuthenticated: !!user
      });
      
      if (!isInitialized || authLoading) {
        if (__DEV__) console.log('⏳ Dashboard: Waiting for auth initialization...');
        return;
      }
      
      const userId = user?.id || user?.id;
      if (userId) {
        if (__DEV__) console.log('🚀 Dashboard: Loading cached data with background refresh for user:', userId);
        try {
          // Load cached data first (no force refresh) - INSTANT UI
          await Promise.all([
            fetchTodayMeals(false), // Use cache if available
            fetchCurrentSubscription(false), // Use cache if available
            fetchRestaurants(), // Use cache if available
            fetchNotifications(userId, false), // Use cache if available
          ]);
          if (__DEV__) console.log('✅ Dashboard: Cached data loaded instantly');
        } catch (error) {
          if (__DEV__) console.error('❌ Dashboard: Error loading initial data:', error);
        }
      }
    };

    loadInitialData();
  }, [isInitialized, authLoading, user?.id]); // Removed excessive dependencies

  // Hide splash screen when dashboard is ready AND subscription status is determined
  useEffect(() => {
    // Wait for auth to be initialized and subscription loading to complete
    const isAuthReady = isInitialized && !authLoading;
    const isSubscriptionReady = !subscriptionLoading;
    
    if (isAuthReady && isSubscriptionReady) {
      if (__DEV__) console.log('🎬 Splash: Auth and subscription ready, hiding splash screen', {
        currentSubscription: !!currentSubscription,
        subscriptionLoading
      });
      
      // Dashboard is ready with definitive subscription status, hide splash
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1000); // Give enough time for smooth transition
      return () => clearTimeout(timer);
    }
  }, [isInitialized, authLoading, subscriptionLoading, currentSubscription]);

  // Smart focus refresh - only refresh if data is stale (older than 5 minutes)
  useFocusEffect(
    React.useCallback(() => {
      const userId = user?.id || user?.id;
      if (isInitialized && !authLoading && userId) {
        if (__DEV__) console.log('👁️ Dashboard: Screen focused, checking if refresh needed');
        
        // Only refresh if data is stale - background refresh without loading states
        setTimeout(() => {
          fetchCurrentSubscription(false); // Background refresh - no loading state
          fetchNotifications(userId, false); // Background refresh - no loading state
        }, 100); // Small delay to avoid blocking UI
      }
    }, [isInitialized, authLoading, user?.id, fetchCurrentSubscription, fetchNotifications])
  );

  // Pull to refresh handler
  const onRefresh = async () => {
    const userId = user?.id || user?.id;
    if (!isInitialized || authLoading || !userId) {
      console.log('⚠️ Dashboard: Cannot refresh - auth not ready');
      setRefreshing(false);
      return;
    }
    
    setRefreshing(true);
    try {
      console.log('🔄 Dashboard: Manual refresh triggered');
      await Promise.all([
        fetchTodayMeals(true), // Force refresh meals
        fetchCurrentSubscription(true), // Force refresh current subscription
        fetchRestaurants(), // Fetch restaurants
        fetchNotifications(userId, true), // Force refresh notifications
      ]);
      console.log('✅ Dashboard: Manual refresh completed');
    } catch (error) {
      console.error('❌ Dashboard: Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return t('invalidTime');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return t('invalidDate');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#4CAF50';
      case 'preparing': return '#FF9B42';
      case 'ready': return '#2196F3';
      case 'scheduled': return '#9E9E9E';
      case 'cancelled': return '#F44336';
      case 'skipped': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return t('delivered');
      case 'preparing': return t('preparing');
      case 'ready': return t('ready');
      case 'scheduled': return t('scheduled');
      case 'cancelled': return t('cancelled');
      case 'skipped': return t('skipped');
      default: return status;
    }
  };

  // Show loading screen while auth is initializing
  if (!isInitialized || authLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9B42" />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Splash Screen Overlay */}
      {showSplash && (
        <SplashScreen 
          onComplete={() => setShowSplash(false)}
        />
      )}
      {/* Header - Only show when no active subscription */}
      {!currentSubscription && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              {user?.name ? `Hi, ${user.name.split(' ')[0]}!` : t('hiThere')}
            </Text>
            <View style={styles.locationContainer}>
              <MapPin size={14} color="#666666" />
              <Text style={styles.location}>
                {user?.address || t('setYourLocation')}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications' as never)}
          >
            <Bell size={24} color="#333333" />
            {getUnreadCount() > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {getUnreadCount() > 99 ? '99+' : getUnreadCount()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

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
        {/* Subscription Status */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          {currentSubscription ? (
            <>
              {console.log('🔍 Dashboard: Rendering ActiveSubscriptionDashboard with subscription:', {
                id: currentSubscription.id,
                status: currentSubscription.status,
                planName: currentSubscription.plan?.name
              })}
              <ActiveSubscriptionDashboard 
                user={user} 
                todayMeals={todayMeals} 
                isLoading={mealsLoading && todayMeals.length === 0}
              />
            </>
          ) : (
            <>
              {console.log('🔍 Dashboard: Rendering NoSubscriptionDashboard - no current subscription found')}
              <NoSubscriptionDashboard />
            </>
          )}
        </Animated.View>

        {/* Today's Meals - Only show when no active subscription */}
        {!currentSubscription && (
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('todaysMeals')}</Text>
            <Text style={styles.sectionSubtitle}>
              {formatDate(new Date().toISOString())}
            </Text>
          </View>

          {mealsError ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{mealsError}</Text>
              <TouchableOpacity 
                onPress={() => fetchTodayMeals()}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>{t('retry')}</Text>
              </TouchableOpacity>
            </View>
          ) : todayMeals.length === 0 ? (
            <View style={styles.emptyCard}>
              <Calendar size={48} color="#CCCCCC" />
              <Text style={styles.emptyTitle}>{t('noMealsScheduled')}</Text>
              <Text style={styles.emptyDescription}>
                {t('subscribeToGetStarted')}
              </Text>
              <TouchableOpacity 
                onPress={() => router.push('/plans')}
                style={styles.exploreButton}
              >
                <Text style={styles.exploreButtonText}>{t('explorePlans')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mealsContainer}>
              {todayMeals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.mealCard}
                  onPress={() => router.push(`/track?id=${meal.id}`)}
                >
                  <View style={styles.mealHeader}>
                    <View>
                      <Text style={styles.mealType}>
                        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                      </Text>
                      <Text style={styles.mealRestaurant}>
                        {meal.restaurantName}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(meal.status) }
                    ]}>
                      <Text style={styles.statusText}>
                        {getStatusText(meal.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.mealContent}>
                    <Text style={styles.mealName}>
                      {meal.menu?.[0]?.name || t('meal')}
                    </Text>
                    <Text style={styles.mealDescription}>
                      {meal.menu?.[0]?.description || t('deliciousMealPrepared')}
                    </Text>
                  </View>
                  
                  <View style={styles.mealFooter}>
                    <View style={styles.timeContainer}>
                      <Clock size={14} color="#666666" />
                      <Text style={styles.timeText}>
                        {formatTime(meal.date)}
                      </Text>
                    </View>
                    <Text style={styles.trackText}>{t('track')}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>
        )}

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/orders')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Calendar size={24} color="#2196F3" />
              </View>
              <Text style={styles.quickActionTitle}>{t('orderHistory')}</Text>
              <Text style={styles.quickActionSubtitle}>{t('viewPastOrders')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/help-support')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Bell size={24} color="#FF9B42" />
              </View>
              <Text style={styles.quickActionTitle}>{t('support')}</Text>
              <Text style={styles.quickActionSubtitle}>{t('getHelpFaq')}</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFAF0',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#666666',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
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
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#FF9B42',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mealsContainer: {
    gap: 12,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  mealRestaurant: {
    fontSize: 12,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  mealContent: {
    marginBottom: 12,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#666666',
  },
  trackText: {
    fontSize: 12,
    color: '#FF9B42',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  restaurantList: {
    marginTop: 10,
    paddingHorizontal: -10,
  },
  restaurantCard: {
    width: 150,
    marginHorizontal: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  restaurantInfo: {
    padding: 10,
  },
  restaurantName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  restaurantRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  restaurantRatingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
  },
});