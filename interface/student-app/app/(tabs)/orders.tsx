import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useMealStore } from '@/store/mealStore';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowUpDown } from 'lucide-react-native';
import { MealHistoryCard } from '@/components/MealHistoryCard';
import { AdditionalOrderCard } from '@/components/AdditionalOrderCard';
import { Meal, OrderAdditional } from '@/types';

type TabType = 'main' | 'additional';
type SortOrder = 'newest' | 'oldest';

export default function OrdersScreen() {
  const { user } = useAuthStore();
  const { meals, additionalOrders, fetchMeals, isLoading } = useMealStore();
  const [activeTab, setActiveTab] = useState<TabType>('main');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMeals();
    setRefreshing(false);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  const sortedMeals = [...meals].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const sortedAdditionalOrders = [...additionalOrders].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const renderMealItem = ({ item, index }: { item: Meal; index: number }) => (
    <MealHistoryCard meal={item} index={index} />
  );

  const renderAdditionalOrderItem = ({ item, index }: { item: OrderAdditional; index: number }) => (
    <AdditionalOrderCard order={item} index={index} />
  );

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.header}>
        <Text style={styles.headerTitle}>Your Orders</Text>
        <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
          <ArrowUpDown size={20} color="#333333" />
          <Text style={styles.sortButtonText}>
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'main' && styles.activeTabButton]}
          onPress={() => setActiveTab('main')}
        >
          <Text
            style={[styles.tabButtonText, activeTab === 'main' && styles.activeTabButtonText]}
          >
            Regular Meals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'additional' && styles.activeTabButton]}
          onPress={() => setActiveTab('additional')}
        >
          <Text
            style={[styles.tabButtonText, activeTab === 'additional' && styles.activeTabButtonText]}
          >
            Additional Items
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9B42" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : activeTab === 'main' ? (
        <FlatList
          data={sortedMeals}
          renderItem={renderMealItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF9B42']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Meal Orders</Text>
              <Text style={styles.emptyText}>Your regular meal orders will appear here</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={sortedAdditionalOrders}
          renderItem={renderAdditionalOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF9B42']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Additional Orders</Text>
              <Text style={styles.emptyText}>Items you order separately will appear here</Text>
            </View>
          }
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  sortButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#333333',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#DDDDDD',
  },
  activeTabButton: {
    borderBottomColor: '#FF9B42',
  },
  tabButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#999999',
  },
  activeTabButtonText: {
    color: '#FF9B42',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#333333',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});