import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronDown,
  Clock,
  CircleCheck as CheckCircle2,
  ArrowUpDown,
  Search,
  Filter,
} from 'lucide-react-native';

// Mock Orders Data
const mockOrders = [
  {
    id: '1',
    mealType: 'Breakfast',
    mealName: 'Poha with Jalebi',
    customerName: 'Rahul Sharma',
    address: 'Block A, Room 102, Hostel 2',
    time: '8:30 AM',
    status: 'Delivered',
    image:
      'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '2',
    mealType: 'Breakfast',
    mealName: 'Aloo Paratha',
    customerName: 'Priya Patel',
    address: 'Block B, Room 205, Girls Hostel',
    time: '8:30 AM',
    status: 'In Progress',
    image:
      'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '3',
    mealType: 'Lunch',
    mealName: 'Paneer Butter Masala with Roti',
    customerName: 'Amit Kumar',
    address: 'Block C, Room 305, Hostel 3',
    time: '1:00 PM',
    status: 'Pending',
    image:
      'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '4',
    mealType: 'Lunch',
    mealName: 'Dal Tadka with Rice',
    customerName: 'Shreya Singh',
    address: 'Block A, Room 110, Hostel 2',
    time: '1:00 PM',
    status: 'Pending',
    image:
      'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '5',
    mealType: 'Dinner',
    mealName: 'Chole Bhature',
    customerName: 'Vikram Malhotra',
    address: 'Block B, Room 215, Hostel 1',
    time: '8:00 PM',
    status: 'Scheduled',
    image:
      'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '6',
    mealType: 'Dinner',
    mealName: 'Veg Pulao',
    customerName: 'Deepika Joshi',
    address: 'Block C, Room 320, Girls Hostel',
    time: '8:00 PM',
    status: 'Scheduled',
    image:
      'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeMealType, setActiveMealType] = useState('All');

  // Filter data based on selected filters
  const filteredOrders = mockOrders.filter((order) => {
    if (activeMealType !== 'All' && order.mealType !== activeMealType) {
      return false;
    }
    if (
      activeFilter !== 'All' &&
      order.status !== activeFilter &&
      !(activeFilter === 'Active' &&
        (order.status === 'Pending' || order.status === 'In Progress'))
    ) {
      return false;
    }
    return true;
  });

  // Group orders by meal type
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order.mealType]) {
      acc[order.mealType] = [];
    }
    acc[order.mealType].push(order);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#DCFCE7', text: '#10B981' };
      case 'In Progress':
        return { bg: '#EBF5FF', text: '#3B82F6' };
      case 'Pending':
        return { bg: '#FEF3C7', text: '#F59E0B' };
      case 'Scheduled':
        return { bg: '#F3E8FF', text: '#8B5CF6' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const renderOrderCard = ({ item }) => {
    const statusColors = getStatusColor(item.status);

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <Text style={styles.orderAddress}>{item.address}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors.bg },
            ]}
          >
            <Text
              style={[styles.statusText, { color: statusColors.text }]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.orderContent}>
          <Image source={{ uri: item.image }} style={styles.mealImage} />
          <View style={styles.mealDetails}>
            <Text style={styles.mealName}>{item.mealName}</Text>
            <View style={styles.timeContainer}>
              <Clock size={14} color="#666" />
              <Text style={styles.deliveryTime}>{item.time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.orderActions}>
          {item.status === 'Pending' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.startButton]}
              onPress={() => {
                // Start preparing logic
              }}
            >
              <Text style={styles.startButtonText}>Start Preparing</Text>
            </TouchableOpacity>
          )}

          {item.status === 'In Progress' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.readyButton]}
              onPress={() => {
                // Mark as ready logic
              }}
            >
              <Text style={styles.readyButtonText}>Mark as Ready</Text>
            </TouchableOpacity>
          )}

          {(item.status === 'Delivered' || item.status === 'Scheduled') && (
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => {
                // View details logic
              }}
            >
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Orders</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Sort</Text>
            <ArrowUpDown size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterTabs}
        contentContainerStyle={styles.filterTabsContent}
      >
        {['All', 'Active', 'Pending', 'In Progress', 'Delivered', 'Scheduled'].map(
          (filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.activeFilterTab,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter && styles.activeFilterTabText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      {/* Meal Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.mealTypeTabs}
        contentContainerStyle={styles.mealTypeTabsContent}
      >
        {['All', 'Breakfast', 'Lunch', 'Dinner'].map((mealType) => (
          <TouchableOpacity
            key={mealType}
            style={[
              styles.mealTypeTab,
              activeMealType === mealType && styles.activeMealTypeTab,
            ]}
            onPress={() => setActiveMealType(mealType)}
          >
            <Text
              style={[
                styles.mealTypeTabText,
                activeMealType === mealType && styles.activeMealTypeTabText,
              ]}
            >
              {mealType}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
          <Text style={styles.emptySubtext}>
            Try changing your filters to see more orders
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  sortButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  filterTabs: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterTabsContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  activeFilterTab: {
    backgroundColor: '#FF9F43',
  },
  filterTabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
  },
  activeFilterTabText: {
    color: '#FFF',
  },
  mealTypeTabs: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  mealTypeTabsContent: {
    paddingHorizontal: 16,
  },
  mealTypeTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeMealTypeTab: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FF9F43',
  },
  mealTypeTabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
  },
  activeMealTypeTabText: {
    color: '#FF9F43',
  },
  ordersList: {
    padding: 16,
    paddingBottom: 90,
  },
  sectionHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  orderAddress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  orderContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mealImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  mealDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  mealName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  orderActions: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: '#EBF5FF',
  },
  startButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#3B82F6',
  },
  readyButton: {
    backgroundColor: '#FF9F43',
  },
  readyButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFF',
  },
  viewButton: {
    backgroundColor: '#F5F5F5',
  },
  viewButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 60,
  },
  emptyText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});