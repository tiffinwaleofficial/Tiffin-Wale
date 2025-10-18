import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Calendar, Star, ChevronRight, Plus, ShoppingBag } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter, useFocusEffect } from 'expo-router';

import { useMealStore } from '@/store/mealStore';
import { useAuth } from '@/auth/AuthProvider';
import { useOrderStore } from '@/store/orderStore';

import { AdditionalOrderCard } from '@/components/AdditionalOrderCard';
import { useTranslation } from '@/hooks/useTranslation';

export default function OrdersScreen() {
  const router = useRouter();
  useAuth();
  const { t } = useTranslation('orders');
  const { 
    mealHistory: meals, 
    isLoadingHistory: mealsLoading, 
    error: mealsError, 
    fetchMealHistory: fetchMeals 
  } = useMealStore();
  const {
    orders,
    isLoading: ordersLoading,
    error: ordersError,
    fetchOrders,
  } = useOrderStore();
  
  const [activeTab, setActiveTab] = useState<'meals' | 'additional'>('meals');
  const [refreshing, setRefreshing] = useState(false);

  // Enterprise caching: Load cached data immediately on mount
  useEffect(() => {
    if (__DEV__) console.log('🍽️ Orders: Initial load - showing cached data instantly');
    // Load cached data first (no force refresh) - INSTANT UI
    fetchMeals();
    fetchOrders();
  }, [fetchMeals, fetchOrders]);

  // Smart focus refresh: Background refresh when page comes into focus
  useFocusEffect(
    useCallback(() => {
      if (__DEV__) console.log('👁️ Orders: Page focused - background refresh');
      // Background refresh without loading states
      setTimeout(() => {
        fetchMeals(); // Background refresh
        fetchOrders(); // Background refresh
      }, 100);
    }, [fetchMeals, fetchOrders])
  );

  // Pull to refresh handler - Force fresh data
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (__DEV__) console.log('🔄 Orders: Pull-to-refresh triggered');
      // Force refresh for both tabs to ensure fresh data
      await Promise.all([
        fetchMeals(), // Force refresh
        fetchOrders() // Force refresh
      ]);
    } catch (error) {
      if (__DEV__) console.error('Error refreshing orders:', error);
    } finally {
      setRefreshing(false);
    }
  };



  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return t('today');
      } else if (diffDays === 1) {
        return t('yesterday');
      } else if (diffDays < 7) {
        return t('daysAgo', { count: diffDays });
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
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

  // Filter and sort meals by date (newest first)
  const sortedMeals = [...(meals || [])].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter and sort additional orders by date (newest first)
  const sortedAdditionalOrders = [...orders].sort((a, b) => {
    const dateA = (a as any).date || (a as any).createdAt || new Date().toISOString();
    const dateB = (b as any).date || (b as any).createdAt || new Date().toISOString();
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  const renderContent = () => {
    // Removed loading state - show empty states immediately

    if (mealsError || ordersError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{mealsError || ordersError}</Text>
          <TouchableOpacity 
            onPress={() => activeTab === 'meals' ? fetchMeals() : fetchOrders()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeTab === 'meals') {
      if (sortedMeals.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Calendar size={64} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>{t('noMealsYet')}</Text>
            <Text style={styles.emptyDescription}>
              {t('mealHistoryDescription')}
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/plans')}
              style={styles.exploreButton}
            >
              <Text style={styles.exploreButtonText}>{t('explorePlans')}</Text>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <View style={styles.listContainer}>
          {sortedMeals.map((meal, index) => (
            <Animated.View 
              key={meal.id} 
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <TouchableOpacity
                style={styles.mealCard}
                onPress={() => router.push(`/track?id=${meal.id}`)}
              >
                <View style={styles.mealHeader}>
                  <View style={styles.mealHeaderLeft}>
                    <Text style={styles.mealType}>
                      {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                    </Text>
                    <Text style={styles.mealDate}>
                      {formatDate(meal.date)}
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
                  <Text style={styles.restaurantName}>
                    {meal.restaurantName}
                  </Text>
                  {meal.menu?.[0]?.description && (
                    <Text style={styles.mealDescription}>
                      {meal.menu[0].description}
                    </Text>
                  )}
                </View>

                <View style={styles.mealFooter}>
                  {meal.status === 'delivered' && (
                    <TouchableOpacity
                      style={styles.rateButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        // Navigate to rating screen or show rating modal
                        router.push(`/rate-meal?id=${meal.id}` as never);
                      }}
                    >
                      <Star size={16} color="#FF9B42" />
                      <Text style={styles.rateButtonText}>
                        {meal.userRating ? t('updateRating') : t('rateMeal')}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <ChevronRight size={20} color="#CCCCCC" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      );
    } else {
      if (sortedAdditionalOrders.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <ShoppingBag size={64} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>{t('noAdditionalOrders')}</Text>
            <Text style={styles.emptyDescription}>
              {t('additionalOrdersDescription')}
            </Text>
          </View>
        );
      }

      return (
        <View style={styles.listContainer}>
          {sortedAdditionalOrders.map((order, index) => (
            <Animated.View 
              key={order.id} 
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <AdditionalOrderCard 
                order={{
                  ...order,
                  date: (order as any).date || (order as any).createdAt || new Date().toISOString(),
                  items: (order as any).items || [],
                  total: (order as any).total || 0
                } as any}
                index={index}
              />
            </Animated.View>
          ))}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('orderHistory')}</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'meals' && styles.activeTab
          ]}
          onPress={() => setActiveTab('meals')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'meals' && styles.activeTabText
          ]}>
            {t('mealHistory')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'additional' && styles.activeTab
          ]}
          onPress={() => setActiveTab('additional')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'additional' && styles.activeTabText
          ]}>
            {t('additionalOrders')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
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
        {renderContent()}
      </ScrollView>

      {/* Add Order Button - Only show for additional orders tab */}
      {activeTab === 'additional' && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-order' as never)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
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
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: '#333333',
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
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  exploreButton: {
    backgroundColor: '#FF9B42',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 100,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  mealHeaderLeft: {
    flex: 1,
  },
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  mealDate: {
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 16,
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rateButtonText: {
    fontSize: 12,
    color: '#FF9B42',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF9B42',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});