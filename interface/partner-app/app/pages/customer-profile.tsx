import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  MessageCircle,
  User,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Star,
} from 'lucide-react-native';
import type { Customer } from '../../components/CustomerCard';
import { api } from '../../lib/api';

export default function CustomerProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    customerId: string;
  }>();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'subscription'>('overview');
  
  useEffect(() => {
    loadCustomerProfile();
  }, [params.customerId]);
  
  const loadCustomerProfile = async () => {
    try {
      setLoading(true);
      
      if (!params.customerId) {
        throw new Error('Customer ID is required');
      }
      
      // Fetch customer profile from API
      const response = await api.customers.getCustomerProfile(params.customerId);
      
      setCustomer(response as Customer);
    } catch (error) {
      console.error('Failed to load customer profile:', error);
      // Show error to user
      alert('Failed to load customer profile. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomerProfile();
  };
  
  const handleChatPress = () => {
    if (customer) {
      router.push({
        pathname: '/pages/chat',
        params: {
          recipientId: customer._id,
          recipientName: customer.name,
          conversationType: 'customer',
        },
      });
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'paused':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#999';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={20} color="#10B981" />;
      case 'paused':
        return <Pause size={20} color="#F59E0B" />;
      case 'cancelled':
        return <XCircle size={20} color="#EF4444" />;
      default:
        return null;
    }
  };
  
  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  if (loading || !customer) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF9F43" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Profile</Text>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChatPress}
        >
          <MessageCircle size={24} color="#FF9F43" />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF9F43']} />
        }
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {customer.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <Text style={styles.customerName}>{customer.name}</Text>
          
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(customer.subscriptionStatus)}20` },
            ]}
          >
            {getStatusIcon(customer.subscriptionStatus)}
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(customer.subscriptionStatus) },
              ]}
            >
              {getStatusLabel(customer.subscriptionStatus)}
            </Text>
          </View>
          
          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Package size={20} color="#FF9F43" />
              <Text style={styles.statValue}>{customer.totalOrders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <DollarSign size={20} color="#10B981" />
              <Text style={styles.statValue}>₹{customer.planPrice}</Text>
              <Text style={styles.statLabel}>Plan</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Calendar size={20} color="#3B82F6" />
              <Text style={styles.statValue}>
                {Math.floor((new Date().getTime() - new Date(customer.subscribedDate).getTime()) / (1000 * 60 * 60 * 24))}
              </Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
          </View>
        </View>
        
        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Phone size={20} color="#3B82F6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{customer.phoneNumber}</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Mail size={20} color="#10B981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{customer.email}</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <MapPin size={20} color="#F59E0B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Delivery Address</Text>
              <Text style={styles.infoValue}>
                {customer.address}
                {customer.distance && (
                  <Text style={styles.distanceText}> • {customer.distance}km away</Text>
                )}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'orders' && styles.tabActive]}
            onPress={() => setActiveTab('orders')}
          >
            <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>
              Orders
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'subscription' && styles.tabActive]}
            onPress={() => setActiveTab('subscription')}
          >
            <Text style={[styles.tabText, activeTab === 'subscription' && styles.tabTextActive]}>
              Subscription
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Subscription Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Subscription Details</Text>
              
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Plan Name</Text>
                  <Text style={styles.detailValue}>{customer.planName}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Monthly Price</Text>
                  <Text style={styles.detailValue}>₹{customer.planPrice}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Start Date</Text>
                  <Text style={styles.detailValue}>
                    {new Date(customer.subscribedDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                
                {customer.lastOrderDate && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Last Order</Text>
                    <Text style={styles.detailValue}>
                      {new Date(customer.lastOrderDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            {/* Performance Metrics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Metrics</Text>
              
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <TrendingUp size={24} color="#10B981" />
                  <Text style={styles.metricValue}>100%</Text>
                  <Text style={styles.metricLabel}>Delivery Rate</Text>
                </View>
                
                <View style={styles.metricCard}>
                  <Star size={24} color="#F59E0B" />
                  <Text style={styles.metricValue}>4.8</Text>
                  <Text style={styles.metricLabel}>Avg Rating</Text>
                </View>
                
                <View style={styles.metricCard}>
                  <Clock size={24} color="#3B82F6" />
                  <Text style={styles.metricValue}>15m</Text>
                  <Text style={styles.metricLabel}>Avg Delivery</Text>
                </View>
                
                <View style={styles.metricCard}>
                  <Package size={24} color="#8B5CF6" />
                  <Text style={styles.metricValue}>{customer.totalOrders}</Text>
                  <Text style={styles.metricLabel}>Total Orders</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        
        {activeTab === 'orders' && (
          <View style={styles.tabContent}>
            <View style={styles.emptyState}>
              <Package size={64} color="#CCC" />
              <Text style={styles.emptyStateText}>Order history coming soon</Text>
              <Text style={styles.emptyStateSubtext}>
                View all orders placed by {customer.name}
              </Text>
            </View>
          </View>
        )}
        
        {activeTab === 'subscription' && (
          <View style={styles.tabContent}>
            <View style={styles.emptyState}>
              <Calendar size={64} color="#CCC" />
              <Text style={styles.emptyStateText}>Subscription details coming soon</Text>
              <Text style={styles.emptyStateSubtext}>
                View subscription history and preferences
              </Text>
            </View>
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleChatPress}
          >
            <MessageCircle size={20} color="#FFF" />
            <Text style={styles.primaryButtonText}>Send Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Phone size={20} color="#FF9F43" />
            <Text style={styles.secondaryButtonText}>Call Customer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#FFF',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF9F43',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFF',
  },
  customerName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 24,
  },
  statusText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#333',
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  distanceText: {
    color: '#999',
    fontSize: 13,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FF9F43',
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#999',
  },
  tabTextActive: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9F43',
  },
  tabContent: {
    backgroundColor: '#FFF',
    paddingBottom: 16,
  },
  detailCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#333',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  metricValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333',
  },
  metricLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
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
  actionsContainer: {
    padding: 16,
    gap: 12,
    backgroundColor: '#FFF',
    marginTop: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F43',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#FF9F43',
  },
  secondaryButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FF9F43',
  },
});

