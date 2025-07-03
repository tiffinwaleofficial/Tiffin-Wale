import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Calendar, MapPin, Clock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuthStore } from '@/store/authStore';
import { useMealStore } from '@/store/mealStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { ActiveSubscriptionDashboard } from '@/components/ActiveSubscriptionDashboard';
import { NoSubscriptionDashboard } from '@/components/NoSubscriptionDashboard';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    todayMeals, 
    isLoading: mealsLoading, 
    error: mealsError, 
    fetchTodayMeals 
  } = useMealStore();
  const { 
    currentSubscription, 
    isLoading: subscriptionLoading, 
    fetchUserSubscriptions 
  } = useSubscriptionStore();
  const { 
    unreadCount, 
    fetchNotifications 
  } = useNotificationStore();
  
  const [refreshing, setRefreshing] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (user?.id) {
        await Promise.all([
          fetchTodayMeals(),
          fetchUserSubscriptions(),
          fetchNotifications(user.id)
        ]);
      }
    };

    loadInitialData();
  }, [user?.id, fetchTodayMeals, fetchUserSubscriptions, fetchNotifications]);

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user?.id) {
        await Promise.all([
          fetchTodayMeals(),
          fetchUserSubscriptions(),
          fetchNotifications(user.id)
        ]);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
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
      return 'Invalid time';
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
      return 'Invalid date';
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
      case 'delivered': return 'Delivered';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready';
      case 'scheduled': return 'Scheduled';
      case 'cancelled': return 'Cancelled';
      case 'skipped': return 'Skipped';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>
            {user?.name ? `Hi, ${user.name.split(' ')[0]}!` : 'Hi there!'}
          </Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color="#666666" />
            <Text style={styles.location}>
              {user?.address || 'Set your location'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/notifications' as never)}
        >
          <Bell size={24} color="#333333" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
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
        {/* Subscription Status */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          {subscriptionLoading ? (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>Loading subscription...</Text>
            </View>
          ) : currentSubscription ? (
      <ActiveSubscriptionDashboard 
        user={user} 
        todayMeals={todayMeals} 
              isLoading={mealsLoading}
            />
          ) : (
            <NoSubscriptionDashboard />
          )}
        </Animated.View>

        {/* Today's Meals */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <Text style={styles.sectionSubtitle}>
              {formatDate(new Date().toISOString())}
            </Text>
          </View>

          {mealsLoading ? (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>Loading today's meals...</Text>
            </View>
          ) : mealsError ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{mealsError}</Text>
              <TouchableOpacity 
                onPress={fetchTodayMeals}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : todayMeals.length === 0 ? (
            <View style={styles.emptyCard}>
              <Calendar size={48} color="#CCCCCC" />
              <Text style={styles.emptyTitle}>No meals scheduled</Text>
              <Text style={styles.emptyDescription}>
                Subscribe to a meal plan to get started
              </Text>
              <TouchableOpacity 
                onPress={() => router.push('/plans')}
                style={styles.exploreButton}
              >
                <Text style={styles.exploreButtonText}>Explore Plans</Text>
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
                      {meal.menu?.[0]?.name || 'Meal'}
                    </Text>
                    <Text style={styles.mealDescription}>
                      {meal.menu?.[0]?.description || 'Delicious meal prepared just for you'}
                    </Text>
                  </View>
                  
                  <View style={styles.mealFooter}>
                    <View style={styles.timeContainer}>
                      <Clock size={14} color="#666666" />
                      <Text style={styles.timeText}>
                        {formatTime(meal.date)}
                      </Text>
                    </View>
                    <Text style={styles.trackText}>Track →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/orders')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Calendar size={24} color="#2196F3" />
              </View>
              <Text style={styles.quickActionTitle}>Order History</Text>
              <Text style={styles.quickActionSubtitle}>View past orders</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => router.push('/help-support')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Bell size={24} color="#FF9B42" />
              </View>
              <Text style={styles.quickActionTitle}>Support</Text>
              <Text style={styles.quickActionSubtitle}>Get help & FAQ</Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
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
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
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
  loadingText: {
    fontSize: 16,
    color: '#666666',
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
});