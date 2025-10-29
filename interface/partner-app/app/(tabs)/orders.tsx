import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  LayoutList,
  ChefHat,
  Calendar,
  RefreshCw,
} from 'lucide-react-native';
import { OrderCard } from '../../components/OrderCard';
import { ProductionSummary } from '../../components/ProductionSummary';
import { api } from '../../lib/api';

type ViewMode = 'list' | 'production';

export default function OrdersScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [productionSummary, setProductionSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedDate, viewMode]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (viewMode === 'list') {
        // Load orders list from API
        console.log('📦 Fetching orders from API...');
        const response = await api.orders.getMyOrders(1, 100);
        console.log('✅ Orders loaded:', response.orders?.length || 0);
        setOrders(response.orders || []);
      } else {
        // Load production summary from API
        const dateStr = selectedDate.toISOString().split('T')[0];
        console.log('📊 Fetching production summary for:', dateStr);
        const summary = await api.orders.getProductionSummary(dateStr);
        console.log('✅ Production summary loaded:', summary);
        setProductionSummary(summary);
        
        // Also load orders for action buttons
        const response = await api.orders.getMyOrders(1, 100);
        setOrders(response.orders || []);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await api.orders.updateOrderStatus(orderId, status as any);
      await loadData(); // Reload to reflect changes
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update order status');
    }
  };

  const handleReplyToReview = async (reviewId: string, response: string) => {
    try {
      await api.reviews.replyToReview(reviewId, response);
      await loadData(); // Reload to show reply
    } catch (error) {
      console.error('Failed to reply to review:', error);
      alert('Failed to submit reply');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) return false;
    if (selectedMealType !== 'all' && order.mealType !== selectedMealType) return false;
    return true;
  });

  // Group orders by delivery slot
  const groupedOrders = filteredOrders.reduce((acc: any, order) => {
    const slot = order.deliverySlot || 'unscheduled';
    if (!acc[slot]) acc[slot] = [];
    acc[slot].push(order);
    return acc;
  }, {});

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>
          {viewMode === 'list' ? "Today's Orders" : 'Production View'}
        </Text>
        
        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'list' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('list')}
          >
            <LayoutList
              size={18}
              color={viewMode === 'list' ? '#FFF' : '#666'}
            />
            <Text
              style={[
                styles.toggleButtonText,
                viewMode === 'list' && styles.toggleButtonTextActive,
              ]}
            >
              Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'production' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('production')}
          >
            <ChefHat
              size={18}
              color={viewMode === 'production' ? '#FFF' : '#666'}
            />
            <Text
              style={[
                styles.toggleButtonText,
                viewMode === 'production' && styles.toggleButtonTextActive,
              ]}
            >
              Kitchen
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            const yesterday = new Date(selectedDate);
            yesterday.setDate(yesterday.getDate() - 1);
            setSelectedDate(yesterday);
          }}
        >
          <Text style={styles.dateButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.dateDisplay}>
          <Calendar size={16} color="#FF9F43" />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            const tomorrow = new Date(selectedDate);
            tomorrow.setDate(tomorrow.getDate() + 1);
            setSelectedDate(tomorrow);
          }}
        >
          <Text style={styles.dateButtonText}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.todayButton}
          onPress={() => setSelectedDate(new Date())}
        >
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>

      {/* Filters (Only show in list view) */}
      {viewMode === 'list' && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersRow}
            contentContainerStyle={styles.filtersContent}
          >
            {['all', 'pending', 'preparing', 'ready', 'out_for_delivery', 'delivered'].map(
              (status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    selectedStatus === status && styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedStatus === status && styles.filterChipTextActive,
                    ]}
                  >
                    {status === 'all' 
                      ? 'All'
                      : status === 'out_for_delivery'
                      ? 'Out for Delivery'
                      : status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.mealFiltersRow}
            contentContainerStyle={styles.filtersContent}
          >
            {['all', 'breakfast', 'lunch', 'dinner'].map((mealType) => (
              <TouchableOpacity
                key={mealType}
                style={[
                  styles.mealFilterChip,
                  selectedMealType === mealType && styles.mealFilterChipActive,
                ]}
                onPress={() => setSelectedMealType(mealType)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedMealType === mealType && styles.filterChipTextActive,
                  ]}
                >
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF9F43" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      {/* Content */}
      {viewMode === 'production' ? (
        productionSummary ? (
          <ProductionSummary summary={productionSummary} />
        ) : (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#FF9F43" />
          </View>
        )
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF9F43']} />
          }
        >
          {Object.keys(groupedOrders).length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No orders found</Text>
              <Text style={styles.emptySubtext}>
                {selectedDate.toDateString() === new Date().toDateString()
                  ? 'No orders for today yet'
                  : 'No orders for selected date'}
              </Text>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {Object.entries(groupedOrders).map(([slot, slotOrders]: [string, any]) => (
                <View key={slot} style={styles.slotGroup}>
                  <Text style={styles.slotHeader}>
                    {slot === 'morning' && '🌅 Morning Delivery (8-10 AM)'}
                    {slot === 'afternoon' && '☀️ Afternoon Delivery (12-2 PM)'}
                    {slot === 'evening' && '🌙 Evening Delivery (6-8 PM)'}
                    {slot === 'unscheduled' && '📦 Unscheduled'}
                    {' '}({slotOrders.length})
                  </Text>
                  {slotOrders.map((order: any) => (
                    <OrderCard
                      key={order._id || order.id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                      onReplyToReview={handleReplyToReview}
                    />
                  ))}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#333',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FF9F43',
  },
  toggleButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#FFF',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  dateButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#666',
  },
  dateDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  dateText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#333',
  },
  todayButton: {
    backgroundColor: '#FF9F43',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  todayButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#FFF',
  },
  filtersRow: {
    marginBottom: 12,
  },
  mealFiltersRow: {
    marginBottom: 0,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  filterChipActive: {
    backgroundColor: '#FF9F43',
  },
  filterChipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  mealFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mealFilterChipActive: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FF9F43',
  },
  scrollView: {
    flex: 1,
  },
  ordersList: {
    padding: 16,
  },
  slotGroup: {
    marginBottom: 24,
  },
  slotHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
  },
});
