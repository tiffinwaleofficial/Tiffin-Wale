import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { Calendar, Star, ChevronRight, Plus, ShoppingBag, Package, Clock, Truck } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter, useFocusEffect } from 'expo-router';

import { useAuth } from '@/auth/AuthProvider';
import { OrderCard } from '@/components/OrderCard';
import { useTranslation } from '@/hooks/useTranslation';
import { api, Order, OrderStatus } from '@/lib/api';

export default function OrdersScreen() {
  const router = useRouter();
  useAuth();
  const { t } = useTranslation('orders');

  const [todayOrders, setTodayOrders] = useState<Order[]>([]);
  const [upcomingOrders, setUpcomingOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past'>('today');

  // Fetch orders on mount
  useEffect(() => {
    fetchAllOrders();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAllOrders();
    }, [])
  );

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      // Use cached data first, then refresh in background
      const [todayData, upcomingData, pastData] = await Promise.all([
        api.orders.getTodaysOrders(false), // Use cache first
        api.orders.getUpcomingOrders(false), // Use cache first
        api.orders.getPastOrders(1, 10, false), // Use cache first
      ]);
      setTodayOrders(todayData);
      setUpcomingOrders(upcomingData);
      setPastOrders(pastData.orders);
      
      // Refresh in background for fresh data
      Promise.all([
        api.orders.getTodaysOrders(true), // Force refresh
        api.orders.getUpcomingOrders(true), // Force refresh
        api.orders.getPastOrders(1, 10, true), // Force refresh
      ]).then(([todayRefresh, upcomingRefresh, pastRefresh]) => {
        setTodayOrders(todayRefresh);
        setUpcomingOrders(upcomingRefresh);
        setPastOrders(pastRefresh.orders);
      }).catch(err => console.error('Background refresh failed:', err));
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllOrders();
      setRefreshing(false);
  };

  const handleRateOrder = (orderId: string) => {
    router.push(`/rate-meal?orderId=${orderId}`);
  };

  const handleTrackOrder = (orderId: string) => {
    router.push(`/track?orderId=${orderId}`);
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

  const getCurrentOrders = () => {
    switch (activeTab) {
      case 'today':
        return todayOrders;
      case 'upcoming':
        return upcomingOrders;
      case 'past':
        return pastOrders;
      default:
        return [];
    }
  };

  const currentOrders = getCurrentOrders();

  const renderContent = () => {
    if (loading && currentOrders.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF9B42" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      );
    }

    if (currentOrders.length === 0) {
      const emptyConfig = {
        today: {
          icon: <Clock size={64} color="#CCCCCC" />,
          title: 'No Orders Today',
          description: 'You have no scheduled deliveries for today',
        },
        upcoming: {
          icon: <Package size={64} color="#CCCCCC" />,
          title: 'No Upcoming Orders',
          description: 'Subscribe to a plan to see your upcoming deliveries',
        },
        past: {
          icon: <Calendar size={64} color="#CCCCCC" />,
          title: 'No Past Orders',
          description: 'Your order history will appear here',
        },
      };

      const config = emptyConfig[activeTab];

        return (
          <View style={styles.emptyContainer}>
          {config.icon}
          <Text style={styles.emptyTitle}>{config.title}</Text>
          <Text style={styles.emptyDescription}>{config.description}</Text>
          {activeTab !== 'past' && (
            <TouchableOpacity 
              onPress={() => router.push('/plans')}
              style={styles.exploreButton}
            >
              <Text style={styles.exploreButtonText}>Explore Plans</Text>
            </TouchableOpacity>
          )}
          </View>
        );
      }

      return (
        <View style={styles.listContainer}>
        {currentOrders.map((order, index) => (
            <Animated.View 
            key={order._id} 
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
            <OrderCard 
              order={order}
              onRate={handleRateOrder}
              onTrack={handleTrackOrder}
              />
            </Animated.View>
          ))}
        </View>
      );
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
            activeTab === 'today' && styles.activeTab
          ]}
          onPress={() => setActiveTab('today')}
        >
          <Clock size={18} color={activeTab === 'today' ? '#FF9B42' : '#999'} />
          <Text style={[
            styles.tabText,
            activeTab === 'today' && styles.activeTabText
          ]}>
            Today ({todayOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && styles.activeTab
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Package size={18} color={activeTab === 'upcoming' ? '#FF9B42' : '#999'} />
          <Text style={[
            styles.tabText,
            activeTab === 'upcoming' && styles.activeTabText
          ]}>
            Upcoming ({upcomingOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'past' && styles.activeTab
          ]}
          onPress={() => setActiveTab('past')}
        >
          <Calendar size={18} color={activeTab === 'past' ? '#FF9B42' : '#999'} />
          <Text style={[
            styles.tabText,
            activeTab === 'past' && styles.activeTabText
          ]}>
            Past
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
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