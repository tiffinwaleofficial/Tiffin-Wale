import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Users as UsersIcon,
} from 'lucide-react-native';
import { CustomerCard, Customer } from '../../components/CustomerCard';
import { api } from '../../lib/api';

export default function CustomersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadCustomers();
  }, [selectedFilter]);
  
  const loadCustomers = async () => {
    try {
      setLoading(true);
      
      // Fetch customers from API
      const statusFilter = selectedFilter === 'all' ? undefined : selectedFilter;
      const response = await api.customers.getMyCustomers(statusFilter);
      
      setCustomers(response || []);
    } catch (error) {
      console.error('Failed to load customers:', error);
      // Fallback to empty array on error
      setCustomers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomers();
  };
  
  const handleCustomerPress = (customer: Customer) => {
    router.push({
      pathname: '/pages/customer-profile',
      params: {
        customerId: customer._id,
      },
    });
  };
  
  const handleChatPress = (customer: Customer) => {
    router.push({
      pathname: '/pages/chat',
      params: {
        recipientId: customer._id,
        recipientName: customer.name,
        conversationType: 'customer',
      },
    });
  };
  
  const handleOrdersPress = (customer: Customer) => {
    // TODO: Navigate to customer orders page
    console.log('View orders for:', customer.name);
  };
  
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      selectedFilter === 'all' ||
      customer.subscriptionStatus === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Customers</Text>
          <View style={styles.headerBadge}>
            <UsersIcon size={16} color="#FF9F43" />
            <Text style={styles.headerBadgeText}>{filteredCustomers.length}</Text>
          </View>
        </View>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search customers..."
            placeholderTextColor="#999"
          />
        </View>
        
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'all' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'all' && styles.filterChipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'active' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('active')}
          >
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'active' && styles.filterChipTextActive,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'paused' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('paused')}
          >
            <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'paused' && styles.filterChipTextActive,
              ]}
            >
              Paused
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9F43" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF9F43']} />
          }
        >
          {filteredCustomers.length === 0 ? (
            <View style={styles.emptyState}>
              <UsersIcon size={64} color="#CCC" />
              <Text style={styles.emptyStateText}>No customers found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Your subscribed customers will appear here'}
              </Text>
            </View>
          ) : (
            <View style={styles.customersList}>
              {filteredCustomers.map(customer => (
                <CustomerCard
                  key={customer._id}
                  customer={customer}
                  onPress={handleCustomerPress}
                  onChatPress={handleChatPress}
                  onOrdersPress={handleOrdersPress}
                />
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
  header: {
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  headerBadgeText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9F43',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#FF9F43',
  },
  filterChipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  customersList: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
  },
});

