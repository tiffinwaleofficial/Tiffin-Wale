import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  CircleCheck as CheckCircle2, 
  Clock, 
  TrendingUp, 
  CircleAlert as AlertCircle, 
  ChevronRight, 
  Bell, 
  MessageCircle, 
  Utensils, 
  Power,
  DollarSign
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { usePartnerStore } from '../../store/partnerStore';

export default function HomeScreen() {
  const router = useRouter();
  const [currentDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Store hooks
  const { user, partner, isAuthenticated } = useAuthStore();
  const { 
    todayOrders, 
    todayStats, 
    isLoading: ordersLoading, 
    error: ordersError,
    fetchTodayOrders
  } = useOrderStore();
  const { 
    profile, 
    stats, 
    isLoading: profileLoading, 
    isUpdating,
    error: profileError,
    fetchProfile,
    fetchStats,
    refreshProfile,
    refreshStats,
    toggleAcceptingOrders 
  } = usePartnerStore();

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        fetchProfile(),
        fetchStats(),
        fetchTodayOrders(),
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshProfile(),
        refreshStats(),
        fetchTodayOrders(),
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshProfile, refreshStats, fetchTodayOrders]);

  const handleToggleAcceptingOrders = async () => {
    try {
      await toggleAcceptingOrders();
      Alert.alert(
        'Success',
        'Status updated successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to update status. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Generate overview data from real stats
  const overviewData = [
    { 
      id: '1', 
      title: 'Pending', 
      count: todayStats?.pendingOrders || 0, 
      icon: Clock, 
      color: '#F59E0B' 
    },
    { 
      id: '2', 
      title: 'Active', 
      count: Math.max(0, (todayStats?.totalOrders || 0) - (todayStats?.completedOrders || 0)), 
      icon: Utensils, 
      color: '#3B82F6' 
    },
    {
      id: '3',
      title: 'Completed',
      count: todayStats?.completedOrders || 0,
      icon: CheckCircle2,
      color: '#10B981',
    },
  ];

  const renderOrderCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderDetails}>
        <Text style={styles.orderNumber}>Order #{item.id}</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderAmount}>
            {item.items?.length || 1} items • ₹{item.totalAmount || 0}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusColor(item.status).bg,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: getStatusColor(item.status).text,
                },
              ]}
            >
              {item.status || 'pending'}
            </Text>
          </View>
        </View>
        <View style={styles.orderActions}>
          <Text style={styles.orderTime}>
            <Clock size={14} color="#666" /> {formatTime(item.createdAt)}
          </Text>
          {item.status === 'pending' && (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAcceptOrder(item.id)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', text: '#F59E0B' };
      case 'accepted': 
      case 'preparing': return { bg: '#EBF5FF', text: '#3B82F6' };
      case 'ready': 
      case 'completed': return { bg: '#DCFCE7', text: '#10B981' };
      case 'cancelled': return { bg: '#FEE2E2', text: '#EF4444' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      Alert.alert(
        'Accept Order',
        'Order accepted successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to accept order');
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loginPrompt}>Please log in to continue</Text>
      </View>
    );
  }

  const businessName = profile?.businessName || partner?.businessName || 'Partner';
  const todayRevenue = todayStats?.totalRevenue || stats?.todayRevenue || 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {businessName}!</Text>
          <Text style={styles.date}>{formatDate(currentDate)}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.statusToggle} onPress={handleToggleAcceptingOrders}>
            <Power 
              size={20} 
              color={profile?.isAcceptingOrders ? '#10B981' : '#6B7280'} 
            />
            <Text style={[
              styles.statusToggleText,
              { color: profile?.isAcceptingOrders ? '#10B981' : '#6B7280' }
            ]}>
              {profile?.isAcceptingOrders ? 'Open' : 'Closed'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Accepting Orders Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>Accepting Orders</Text>
          <Switch
            value={profile?.isAcceptingOrders || false}
            onValueChange={handleToggleAcceptingOrders}
            disabled={isUpdating}
            trackColor={{ false: '#FECACA', true: '#86EFAC' }}
            thumbColor={profile?.isAcceptingOrders ? '#10B981' : '#EF4444'}
          />
        </View>
        <Text style={styles.statusDescription}>
          {profile?.isAcceptingOrders 
            ? 'You are currently accepting new orders' 
            : 'You are not accepting new orders'}
        </Text>
      </View>

      {/* Today's Earnings */}
      <View style={styles.earningsCard}>
        <View style={styles.earningsHeader}>
          <Text style={styles.earningsTitle}>Today's Earnings</Text>
          <TouchableOpacity onPress={() => router.push('/earnings')}>
            <TrendingUp size={20} color="#10B981" />
          </TouchableOpacity>
        </View>
        {profileLoading || ordersLoading ? (
          <ActivityIndicator size="large" color="#FF9F43" />
        ) : (
          <>
            <Text style={styles.earningsAmount}>₹{todayRevenue.toLocaleString()}</Text>
            <Text style={styles.earningsSubtext}>
              From {todayStats?.totalOrders || 0} orders today
            </Text>
          </>
        )}
      </View>

      {/* Today's Overview */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Overview</Text>
      </View>

      <View style={styles.statsContainer}>
        {overviewData.map((item) => (
          <View key={item.id} style={styles.statCard}>
            <View
              style={[styles.statIconContainer, { backgroundColor: item.color + '20' }]}
            >
              <item.icon size={22} color={item.color} />
            </View>
            <Text style={styles.statCount}>{item.count}</Text>
            <Text style={styles.statTitle}>{item.title}</Text>
          </View>
        ))}
      </View>

      {/* Recent Orders */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push('/orders')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color="#FF9F43" />
        </TouchableOpacity>
      </View>

      {ordersLoading ? (
        <ActivityIndicator size="large" color="#FF9F43" style={styles.loadingIndicator} />
      ) : todayOrders?.length > 0 ? (
        <FlatList
          data={todayOrders.slice(0, 3)}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Utensils size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No orders today yet</Text>
          <Text style={styles.emptyStateSubtext}>Orders will appear here when customers place them</Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}>
              <Utensils size={20} color="#3B82F6" />
            </View>
            <Text style={styles.actionText}>Manage Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/earnings')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#DCFCE7' }]}>
              <DollarSign size={20} color="#10B981" />
            </View>
            <Text style={styles.actionText}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/profile/help')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <MessageCircle size={20} color="#F59E0B" />
            </View>
            <Text style={styles.actionText}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Display */}
      {(ordersError || profileError) && (
        <View style={styles.errorCard}>
          <AlertCircle size={20} color="#EF4444" />
          <Text style={styles.errorText}>
            {ordersError || profileError}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#333',
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusToggleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  notificationButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4757',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: '#FFF',
  },
  statusCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  statusDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  earningsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  earningsTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#666',
  },
  earningsAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#333',
    marginBottom: 4,
  },
  earningsSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9F43',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333',
  },
  statTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderDetails: {
    flex: 1,
  },
  orderNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderAmount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  acceptButton: {
    backgroundColor: '#FF9F43',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  acceptButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFF',
  },
  quickActions: {
    marginTop: 8,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  loadingIndicator: {
    marginVertical: 32,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  errorCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#EF4444',
    flex: 1,
  },
  loginPrompt: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#666',
  },
}); 