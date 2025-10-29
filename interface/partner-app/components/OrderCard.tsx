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
        return { bg: '#DCFCE7', text: '#10B981' };
      case 'out_for_delivery':
      case 'outfordelivery':
        return { bg: '#DBEAFE', text: '#3B82F6' };
      case 'ready':
        return { bg: '#FEF3C7', text: '#F59E0B' };
      case 'preparing':
        return { bg: '#E0E7FF', text: '#6366F1' };
      case 'pending':
        return { bg: '#FEE2E2', text: '#EF4444' };
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
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
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
          {order.subscriptionPlan?.mealSpecification && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meal Details</Text>
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
            </View>
          )}

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
                onPress={() => handleStatusUpdate('ready')}
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
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
});

export default OrderCard;


