import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  User,
  Package,
  Star,
  MessageSquare,
} from 'lucide-react-native';
import { api } from '../lib/api';

interface OrderCardProps {
  order: any;
  onStatusUpdate: (orderId: string, status: string) => Promise<void>;
  onReplyToReview?: (reviewId: string, response: string) => Promise<void>;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onStatusUpdate,
  onReplyToReview,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return { bg: '#E6F7EF', text: '#10B981' };
      case 'out_for_delivery':
      case 'outfordelivery':
        return { bg: '#E6F3FF', text: '#FF9F43' }; // Light blue bg, theme orange text
      case 'ready':
        return { bg: '#FFF5E8', text: '#FF9F43' }; // Theme orange
      case 'preparing':
        return { bg: '#FFF5E8', text: '#FF9F43' }; // Theme orange
      case 'confirmed':
        return { bg: '#FFF5E8', text: '#FF9F43' }; // Theme orange
      case 'pending':
        return { bg: '#FFF5E8', text: '#FF9F43' }; // Theme orange
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      preparing: 'Preparing',
      ready: 'Ready',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
    };
    return labels[status] || status;
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await onStatusUpdate(order._id || order.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !order.review?._id) return;

    try {
      setIsReplying(true);
      await onReplyToReview?.(order.review._id, replyText);
      setReplyText('');
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsReplying(false);
    }
  };

  const statusColors = getStatusColor(order.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.7}
    >
      {/* Collapsed View */}
      <View style={styles.header}>
        <View style={styles.customerInfo}>
          <View style={styles.customerRow}>
            <User size={16} color="#666" />
            <Text style={styles.customerName}>
              {order.customerName || order.customer?.firstName || 'Customer'}
            </Text>
          </View>
          <View style={styles.mealRow}>
            <Package size={14} color="#999" />
            <Text style={styles.mealType}>{order.mealType || 'Lunch'}</Text>
            {order.deliveryTimeRange && (
              <>
                <Clock size={14} color="#999" style={{ marginLeft: 8 }} />
                <Text style={styles.time}>{order.deliveryTimeRange}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Status Badge - smaller, label-like (not a button) */}
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusBadgeText, { color: statusColors.text }]}>
              {getStatusLabel(order.status)}
            </Text>
          </View>
          {isExpanded ? (
            <ChevronUp size={20} color="#666" />
          ) : (
            <ChevronDown size={20} color="#666" />
          )}
        </View>
      </View>

      {/* Expanded View */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Delivery Info */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <MapPin size={16} color="#FF9F43" />
              <Text style={styles.address}>{order.deliveryAddress}</Text>
            </View>
            {order.deliveryInstructions && (
              <Text style={styles.instructions}>{order.deliveryInstructions}</Text>
            )}
          </View>

          {/* Meal Details */}
          {(() => {
            const baseItems = order.items?.filter((item: any) => 
              !item.specialInstructions?.toLowerCase().includes('extra') &&
              !item.mealId?.includes('extra') &&
              !item.mealId?.includes('delivery-fee')
            ) || [];
            
            const extraItems = order.items?.filter((item: any) => 
              item.specialInstructions?.toLowerCase().includes('extra') ||
              item.mealId?.includes('extra')
            ) || [];

            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Meal Details</Text>
                
                {/* Base Meal Items */}
                {baseItems.length > 0 && (
                  <View style={styles.mealSpec}>
                    {baseItems.map((item: any, idx: number) => (
                      <Text key={idx} style={styles.specItem}>
                        ✓ {item.name || item.specialInstructions || `${item.quantity || 1}x Meal Item`}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Extra Items */}
                {extraItems.length > 0 && (
                  <View style={styles.extraItemsContainer}>
                    <Text style={styles.extraItemsTitle}>
                      ✨ Extra Items Requested:
                    </Text>
                    {extraItems.map((item: any, idx: number) => (
                      <View key={idx} style={styles.extraItemRow}>
                        <Text style={styles.extraItemText}>
                          • {item.name || item.specialInstructions || `${item.quantity || 1}x Extra Item`}
                          {item.price > 0 && ` (+₹${item.price})`}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Fallback to subscription plan spec if no items */}
                {baseItems.length === 0 && extraItems.length === 0 && order.subscriptionPlan?.mealSpecification && (
                  <View style={styles.mealSpec}>
                    {order.subscriptionPlan.mealSpecification.rotis && (
                      <Text style={styles.specItem}>
                        🫓 {order.subscriptionPlan.mealSpecification.rotis} Rotis
                      </Text>
                    )}
                    {order.subscriptionPlan.mealSpecification.sabzis?.map((sabzi: any, idx: number) => (
                      <Text key={idx} style={styles.specItem}>
                        🥘 {sabzi.name} ({sabzi.quantity})
                      </Text>
                    ))}
                    {order.subscriptionPlan.mealSpecification.dal && (
                      <Text style={styles.specItem}>
                        🍲 {order.subscriptionPlan.mealSpecification.dal.type} Dal (
                        {order.subscriptionPlan.mealSpecification.dal.quantity})
                      </Text>
                    )}
                  </View>
                )}
              </View>
            );
          })()}

          {/* Review Section */}
          {order.review && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Review</Text>
              <View style={styles.reviewCard}>
                <View style={styles.ratingRow}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      color={i < order.review.rating ? '#F59E0B' : '#E5E7EB'}
                      fill={i < order.review.rating ? '#F59E0B' : 'transparent'}
                    />
                  ))}
                  <Text style={styles.ratingText}>{order.review.rating}/5</Text>
                </View>
                {order.review.comment && (
                  <Text style={styles.reviewComment}>{order.review.comment}</Text>
                )}
                
                {/* Partner Response */}
                {order.review.partnerResponse ? (
                  <View style={styles.partnerResponseContainer}>
                    <Text style={styles.partnerResponseLabel}>Your Response:</Text>
                    <Text style={styles.partnerResponse}>{order.review.partnerResponse}</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.replyButton}
                    onPress={() => {/* Show reply input */}}
                  >
                    <MessageSquare size={16} color="#FF9F43" />
                    <Text style={styles.replyButtonText}>Reply to Review</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            {order.status === 'pending' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => handleStatusUpdate('preparing')}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Start Preparing</Text>
                )}
              </TouchableOpacity>
            )}

            {order.status === 'preparing' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={async () => {
                  try {
                    setIsUpdating(true);
                    // Use markOrderReady endpoint instead of updateOrderStatus
                    // This ensures proper status transition validation
                    await api.orders.markOrderReady(order._id || order.id);
                    await onStatusUpdate(order._id || order.id, 'ready');
                  } catch (error: any) {
                    console.error('Failed to mark order ready:', error);
                    alert(error.response?.data?.message || 'Failed to mark order ready');
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Mark as Ready</Text>
                )}
              </TouchableOpacity>
            )}

            {order.status === 'ready' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => handleStatusUpdate('out_for_delivery')}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Out for Delivery</Text>
                )}
              </TouchableOpacity>
            )}

            {order.status === 'out_for_delivery' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deliverButton]}
                onPress={async () => {
                  try {
                    setIsUpdating(true);
                    await api.orders.markOrderDelivered(order._id || order.id);
                    // Refresh by calling onStatusUpdate
                    if (onStatusUpdate) {
                      await onStatusUpdate(order._id || order.id, 'delivered');
                    }
                  } catch (error: any) {
                    console.error('Failed to mark delivered:', error);
                    alert(error?.message || error?.response?.data?.message || 'Failed to mark order as delivered');
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.deliverButtonText}>Mark as Delivered</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerInfo: {
    flex: 1,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  customerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mealType: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
  },
  time: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start', // Make it smaller, label-like
  },
  statusBadgeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    fontWeight: '500',
  },
  statusText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  section: {
    marginBottom: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  address: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  instructions: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  mealSpec: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  specItem: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#333',
  },
  reviewCard: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#F59E0B',
    marginLeft: 6,
  },
  reviewComment: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  partnerResponseContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  partnerResponseLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: '#10B981',
    marginBottom: 4,
  },
  partnerResponse: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#333',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF',
    borderRadius: 6,
    gap: 6,
    marginTop: 8,
  },
  replyButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FF9F43',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF9F43',
  },
  primaryButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFF',
  },
  deliverButton: {
    backgroundColor: '#FF9F43', // Theme orange
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  deliverButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFF',
    fontWeight: '700',
  },
  extraItemsContainer: {
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FFE4CC',
  },
  extraItemsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#FF9F43',
    marginBottom: 8,
  },
  extraItemRow: {
    marginTop: 4,
  },
  extraItemText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#333',
  },
});

export default OrderCard;


