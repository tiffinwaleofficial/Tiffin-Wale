import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageCircle, Package, MapPin, Calendar } from 'lucide-react-native';

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  distance?: number;
  subscriptionStatus: 'active' | 'paused' | 'cancelled';
  planName: string;
  planPrice: number;
  subscribedDate: string;
  totalOrders: number;
  lastOrderDate?: string;
}

interface CustomerCardProps {
  customer: Customer;
  onChatPress: (customer: Customer) => void;
  onOrdersPress?: (customer: Customer) => void;
  onPress?: (customer: Customer) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onChatPress,
  onOrdersPress,
  onPress,
}) => {
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
  
  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return (
    <TouchableOpacity
      style={styles.customerCard}
      onPress={() => onPress?.(customer)}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {customer.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{customer.name}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(customer.subscriptionStatus)}20` },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(customer.subscriptionStatus) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(customer.subscriptionStatus) },
              ]}
            >
              {getStatusLabel(customer.subscriptionStatus)}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Details */}
      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <MapPin size={14} color="#666" />
          <Text style={styles.detailText}>
            {customer.address} {customer.distance && `• ${customer.distance}km`}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Package size={14} color="#666" />
          <Text style={styles.detailText}>
            {customer.planName} • {customer.totalOrders} orders
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Calendar size={14} color="#666" />
          <Text style={styles.detailText}>
            Subscribed {new Date(customer.subscribedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>
      
      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onOrdersPress?.(customer)}
        >
          <Package size={18} color="#666" />
          <Text style={styles.actionButtonText}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.chatButton]}
          onPress={() => onChatPress(customer)}
        >
          <MessageCircle size={18} color="#FFF" />
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customerCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF9F43',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFF',
  },
  customerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  customerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
  },
  cardDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    gap: 8,
  },
  actionButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#666',
  },
  chatButton: {
    backgroundColor: '#FF9F43',
  },
  chatButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFF',
  },
});

export default CustomerCard;

