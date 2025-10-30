import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, MapPin, Phone, Star } from 'lucide-react-native';
import { Order, SubscriptionPlan } from '@/lib/api';
import { OrderStatusBadge } from './OrderStatusBadge';
import { useRouter } from 'expo-router';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  onRate?: (orderId: string) => void;
  onTrack?: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  onRate,
  onTrack,
}) => {
  const router = useRouter();

  const partner = typeof order.businessPartner === 'object'
    ? order.businessPartner
    : null;

  const plan = typeof order.subscriptionPlan === 'object'
    ? order.subscriptionPlan as SubscriptionPlan
    : null;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/pages/order-detail?id=${order._id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMealType = (type?: string) => {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const canRate = order.status === 'delivered' && !order.rating;
  const canTrack = ['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Header with Partner Info and Status */}
      <View style={styles.header}>
        <View style={styles.partnerInfo}>
          {partner?.logoUrl && (
            <Image
              source={{ uri: partner.logoUrl }}
              style={styles.partnerLogo}
              resizeMode="cover"
            />
          )}
          <View style={styles.partnerText}>
            <Text style={styles.partnerName} numberOfLines={1}>
              {partner?.businessName || 'Tiffin Service'}
            </Text>
            {plan && (
              <Text style={styles.planName} numberOfLines={1}>
                {plan.name}
              </Text>
            )}
          </View>
        </View>
        <OrderStatusBadge status={order.status} size="small" />
      </View>

      {/* Order Details */}
      <View style={styles.details}>
        {/* Order ID and Date */}
        <View style={styles.detailRow}>
          <Text style={styles.orderIdLabel}>Order #{order._id.slice(-8)}</Text>
          <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
        </View>

        {/* Meal Type and Time Slot */}
        {(order.mealType || order.deliveryTimeRange) && (
          <View style={styles.mealRow}>
            {order.mealType && (
              <View style={styles.mealTag}>
                <Text style={styles.mealText}>{formatMealType(order.mealType)}</Text>
              </View>
            )}
            {order.deliveryTimeRange && (
              <View style={styles.timeTag}>
                <Text style={styles.timeText}>{order.deliveryTimeRange}</Text>
              </View>
            )}
          </View>
        )}

        {/* Delivery Date */}
        <View style={styles.infoRow}>
          <Calendar size={14} color="#666" />
          <Text style={styles.infoLabel}>Delivery:</Text>
          <Text style={styles.infoValue}>{formatDate(order.deliveryDate)}</Text>
        </View>

        {/* Delivery Address */}
        <View style={styles.infoRow}>
          <MapPin size={14} color="#666" />
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {order.deliveryAddress.street}, {order.deliveryAddress.city}
          </Text>
        </View>

        {/* Partner Contact (if out for delivery) */}
        {canTrack && partner?.phoneNumber && (
          <View style={styles.infoRow}>
            <Phone size={14} color="#666" />
            <Text style={styles.infoLabel}>Contact:</Text>
            <Text style={styles.infoValue}>{partner.phoneNumber}</Text>
          </View>
        )}

        {/* Special Instructions */}
        {order.specialInstructions && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsLabel}>Note:</Text>
            <Text style={styles.instructionsText} numberOfLines={2}>
              {order.specialInstructions}
            </Text>
          </View>
        )}

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <View style={styles.itemsContainer}>
            {order.items.slice(0, 2).map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
              </View>
            ))}
            {order.items.length > 2 && (
              <Text style={styles.moreItems}>
                +{order.items.length - 2} more items
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Footer with Amount and Actions */}
      <View style={styles.footer}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total</Text>
          <Text style={styles.amount}>₹{order.totalAmount}</Text>
        </View>
        <View style={styles.actions}>
          {canTrack && onTrack && (
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => onTrack(order._id)}
            >
              <Text style={styles.trackButtonText}>Track</Text>
            </TouchableOpacity>
          )}
          {canRate && onRate && (
            <TouchableOpacity
              style={styles.rateButton}
              onPress={() => onRate(order._id)}
            >
              <Star size={14} color="#FF9F43" />
              <Text style={styles.rateButtonText}>Rate</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Existing Rating */}
      {order.rating && (
        <View style={styles.ratingContainer}>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                color="#FF9F43"
                fill={star <= order.rating! ? '#FF9F43' : 'transparent'}
              />
            ))}
          </View>
          {order.review && (
            <Text style={styles.reviewText} numberOfLines={2}>
              {order.review}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  partnerLogo: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 10,
  },
  partnerText: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  planName: {
    fontSize: 13,
    color: '#666',
  },
  details: {
    padding: 16,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  mealRow: {
    flexDirection: 'row',
    gap: 8,
  },
  mealTag: {
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  mealText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9F43',
  },
  timeTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  instructionsContainer: {
    backgroundColor: '#FFF8E6',
    padding: 10,
    borderRadius: 8,
  },
  instructionsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
  itemsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 13,
    color: '#1F2937',
    flex: 1,
  },
  itemQty: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
  },
  moreItems: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  amountContainer: {
    gap: 4,
  },
  amountLabel: {
    fontSize: 11,
    color: '#999',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF9F43',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  trackButton: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  trackButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3730A3',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  rateButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  ratingContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    gap: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});

