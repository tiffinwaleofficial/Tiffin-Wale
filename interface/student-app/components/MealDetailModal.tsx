import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  Clock,
  Utensils,
  MapPin,
  X,
  Plus,
  Minus,
  CheckCircle,
  Star,
  ThumbsUp,
} from 'lucide-react-native';
import { api, Order } from '@/lib/api';
import { useFirebaseNotification } from '@/hooks/useFirebaseNotification';
import { notificationActions } from '@/store/notificationStore';

const { width } = Dimensions.get('window');

interface ExtraItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface MealDetailModalProps {
  visible: boolean;
  orderId: string | null;
  action?: 'extras' | 'rate';
  onClose: () => void;
  onOrderUpdated?: () => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  visible,
  orderId,
  action,
  onClose,
  onOrderUpdated,
}) => {
  const { showSuccess, showError } = useFirebaseNotification();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestingExtras, setRequestingExtras] = useState(false);
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    if (visible && orderId) {
      fetchOrderDetails();
      if (action === 'extras') {
        initializeExtras();
      }
    } else {
      // Reset state when modal closes
      setOrder(null);
      setExtras([]);
      setSpecialInstructions('');
      setRating(0);
      setReview('');
    }
  }, [visible, orderId, action]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const orderData = await api.orders.getOrderById(orderId);
      setOrder(orderData);
    } catch (error: any) {
      console.error('Failed to fetch order details:', error);
      showError('Error', error.message || 'Failed to load meal details');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const initializeExtras = () => {
    setExtras([
      { id: 'extra-roti', name: 'Extra Roti', price: 10, quantity: 0 },
      { id: 'extra-rice', name: 'Extra Rice', price: 15, quantity: 0 },
      { id: 'extra-dal', name: 'Extra Dal', price: 20, quantity: 0 },
      { id: 'extra-sabzi', name: 'Extra Sabzi', price: 25, quantity: 0 },
      { id: 'pudina-chutney', name: 'Pudina Chutney', price: 10, quantity: 0 },
      { id: 'pickle', name: 'Achar/Pickle', price: 15, quantity: 0 },
    ]);
  };

  const updateExtraQuantity = (id: string, delta: number) => {
    setExtras(prev => prev.map(extra =>
      extra.id === id
        ? { ...extra, quantity: Math.max(0, extra.quantity + delta) }
        : extra
    ));
  };

  const calculateTotal = () => {
    return extras.reduce((sum, extra) => sum + (extra.price * extra.quantity), 0);
  };

  const handleRequestExtras = async () => {
    if (!order) return;

    const selectedExtras = extras.filter(e => e.quantity > 0);
    if (selectedExtras.length === 0) {
      showError('No Extras Selected', 'Please select at least one extra item');
      return;
    }

    try {
      setRequestingExtras(true);

      const extrasItems = selectedExtras.map(extra => ({
        mealId: extra.id,
        quantity: extra.quantity,
        price: extra.price,
        specialInstructions: `${extra.name} - Extra item request`,
      }));

      const currentItems = order.items || [];
      const updatedItems = [
        ...currentItems,
        ...extrasItems.map(extra => ({
          mealId: extra.mealId,
          quantity: extra.quantity,
          price: extra.price,
          specialInstructions: extra.specialInstructions,
        })),
      ];

      const itemsTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const { apiClient } = await import('@/lib/api/client');

      const existingInstructions = order.deliveryInstructions || '';
      const extrasDescription = `Extras requested: ${selectedExtras.map(e => `${e.quantity}x ${e.name}`).join(', ')}`;
      const combinedInstructions = [
        existingInstructions,
        extrasDescription,
        specialInstructions.trim()
      ].filter(Boolean).join('. ');

      const updatePayload = {
        items: updatedItems,
        totalAmount: itemsTotal,
        deliveryInstructions: combinedInstructions,
      };

      await apiClient.patch(`/orders/${orderId}`, updatePayload);

      showSuccess(
        'Extras Requested! ✅',
        `Your extra items will be added to your order`
      );

      notificationActions.showNotification({
        id: `extras-requested-${Date.now()}`,
        type: 'toast',
        variant: 'success',
        title: 'Extras Requested',
        message: `Your extra items (₹${calculateTotal()}) will be included with your meal`,
        category: 'order',
        timestamp: new Date(),
      });

      await fetchOrderDetails();
      onOrderUpdated?.();
      onClose();
    } catch (error: any) {
      console.error('Failed to request extras:', error);
      showError('Request Failed', error.message || 'Failed to request extras. Please try again.');
    } finally {
      setRequestingExtras(false);
    }
  };

  const handleRateOrder = async () => {
    if (!order || rating === 0) {
      showError('Invalid Rating', 'Please select a rating');
      return;
    }

    try {
      setRequestingExtras(true);
      await api.orders.rateOrder(order._id, rating, review);
      
      showSuccess('Thank You! ⭐', 'Your review has been submitted');
      await fetchOrderDetails();
      onOrderUpdated?.();
      onClose();
    } catch (error: any) {
      console.error('Failed to rate order:', error);
      showError('Rating Failed', error.message || 'Failed to submit review. Please try again.');
    } finally {
      setRequestingExtras(false);
    }
  };

  if (!visible) return null;

  const getBusinessName = () => {
    if (order && typeof order.businessPartner === 'object' && order.businessPartner) {
      return order.businessPartner.businessName || 'Restaurant';
    }
    return 'Restaurant';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {action === 'extras' ? 'Add Extras' : action === 'rate' ? 'Rate Meal' : 'Meal Details'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF9B42" />
                <Text style={styles.loadingText}>Loading meal details...</Text>
              </View>
            ) : order ? (
              <>
                {/* Meal Info Card */}
                <View style={styles.mealCard}>
                  <View style={styles.mealHeader}>
                    <View style={styles.mealTypeBadge}>
                      <Utensils size={16} color="#FF9B42" />
                      <Text style={styles.mealTypeText}>
                        {order.mealType || order.deliverySlot || 'Lunch'}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, 
                      order.status === 'delivered' && styles.statusBadgeDelivered,
                      order.status === 'preparing' && styles.statusBadgePreparing,
                      order.status === 'confirmed' && styles.statusBadgeConfirmed,
                      order.status === 'ready' && styles.statusBadgeReady,
                      order.status === 'pending' && styles.statusBadgePending
                    ]}>
                      <Text style={styles.statusText}>
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ') : 'Scheduled'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.mealTitle}>Subscription Meal</Text>
                  <Text style={styles.partnerName}>{getBusinessName()}</Text>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Clock size={16} color="#666" />
                      <Text style={styles.detailText}>
                        {order.deliveryTimeRange || order.scheduledDeliveryTime || 'Scheduled'}
                      </Text>
                    </View>
                    {order.deliveryDate && (
                      <View style={styles.detailItem}>
                        <MapPin size={16} color="#666" />
                        <Text style={styles.detailText}>
                          {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Base Meal Items */}
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
                      <>
                        {baseItems.length > 0 && (
                          <View style={styles.itemsSection}>
                            <Text style={styles.sectionTitle}>Base Meal Items</Text>
                            {baseItems.map((item: any, index: number) => (
                              <View key={index} style={styles.itemRow}>
                                <CheckCircle size={16} color="#10B981" />
                                <Text style={styles.itemText}>
                                  {item.name || item.specialInstructions || `${item.quantity || 1}x Meal Item`}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {extraItems.length > 0 && (
                          <View style={styles.itemsSection}>
                            <Text style={[styles.sectionTitle, styles.extraItemsTitle]}>
                              Extra Items (Added by You) ✨
                            </Text>
                            {extraItems.map((item: any, index: number) => (
                              <View key={index} style={[styles.itemRow, styles.extraItemRow]}>
                                <Utensils size={16} color="#FF9B42" />
                                <View style={styles.extraItemContent}>
                                  <Text style={styles.extraItemText}>
                                    {item.name || item.specialInstructions || `${item.quantity || 1}x Extra Item`}
                                  </Text>
                                  {item.price > 0 && (
                                    <Text style={styles.extraItemPrice}>+ ₹{item.price}</Text>
                                  )}
                                </View>
                              </View>
                            ))}
                          </View>
                        )}
                      </>
                    );
                  })()}
                </View>

                {/* Request Extras Section */}
                {action === 'extras' && (
                  <View style={styles.extrasSection}>
                    <Text style={styles.sectionTitle}>Add Extras to Your Meal</Text>
                    <Text style={styles.sectionSubtitle}>Select additional items you'd like with your meal</Text>

                    {extras.map((extra) => (
                      <View key={extra.id} style={styles.extraCard}>
                        <View style={styles.extraInfo}>
                          <Text style={styles.extraName}>{extra.name}</Text>
                          <Text style={styles.extraPrice}>₹{extra.price}</Text>
                        </View>
                        <View style={styles.quantityControls}>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateExtraQuantity(extra.id, -1)}
                            disabled={extra.quantity === 0}
                          >
                            <Minus size={16} color={extra.quantity === 0 ? "#CCC" : "#FF9B42"} />
                          </TouchableOpacity>
                          <Text style={styles.quantityText}>{extra.quantity}</Text>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateExtraQuantity(extra.id, 1)}
                          >
                            <Plus size={16} color="#FF9B42" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}

                    {/* Special Instructions */}
                    <View style={styles.instructionsSection}>
                      <Text style={styles.instructionsLabel}>Special Instructions (Optional)</Text>
                      <TextInput
                        style={styles.instructionsInput}
                        placeholder="Any special requests or notes..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={3}
                        value={specialInstructions}
                        onChangeText={setSpecialInstructions}
                      />
                    </View>

                    {/* Total */}
                    {calculateTotal() > 0 && (
                      <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>Extra Items Total</Text>
                        <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Rate Order Section */}
                {action === 'rate' && (
                  <View style={styles.ratingSection}>
                    <Text style={styles.sectionTitle}>Rate Your Meal</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={star}
                          onPress={() => setRating(star)}
                          style={styles.starButton}
                        >
                          <Star
                            size={32}
                            color="#FFB800"
                            fill={star <= rating ? "#FFB800" : "transparent"}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TextInput
                      style={styles.reviewInput}
                      placeholder="Write a review (optional)..."
                      placeholderTextColor="#999"
                      multiline
                      numberOfLines={4}
                      value={review}
                      onChangeText={setReview}
                    />
                  </View>
                )}
              </>
            ) : null}
          </ScrollView>

          {/* Footer Actions */}
          {order && !loading && (
            <View style={styles.footer}>
              {action === 'extras' && (
                <TouchableOpacity
                  style={[styles.actionButton, requestingExtras && styles.actionButtonDisabled]}
                  onPress={handleRequestExtras}
                  disabled={requestingExtras || calculateTotal() === 0}
                >
                  {requestingExtras ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.actionButtonText}>
                      Request Extras {calculateTotal() > 0 && `(₹${calculateTotal()})`}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              {action === 'rate' && (
                <TouchableOpacity
                  style={[styles.actionButton, (requestingExtras || rating === 0) && styles.actionButtonDisabled]}
                  onPress={handleRateOrder}
                  disabled={requestingExtras || rating === 0}
                >
                  {requestingExtras ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.actionButtonText}>Submit Review</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFAF0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  mealCard: {
    backgroundColor: '#FFF',
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9B42',
    fontFamily: 'Poppins-SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  statusBadgeDelivered: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgePreparing: {
    backgroundColor: '#E0E7FF',
  },
  statusBadgeConfirmed: {
    backgroundColor: '#DBEAFE',
  },
  statusBadgeReady: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgePending: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
    fontFamily: 'Poppins-SemiBold',
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  partnerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'Poppins-Medium',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  itemsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  extraItemsTitle: {
    color: '#FF9B42',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  extraItemRow: {
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#FFE4CC',
  },
  extraItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extraItemText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },
  extraItemPrice: {
    fontSize: 14,
    color: '#FF9B42',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  extrasSection: {
    backgroundColor: '#FFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  extraCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  extraInfo: {
    flex: 1,
  },
  extraName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  extraPrice: {
    fontSize: 14,
    color: '#FF9B42',
    fontFamily: 'Poppins-Medium',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF9B42',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  instructionsSection: {
    marginTop: 24,
  },
  instructionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Poppins-SemiBold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF9B42',
    fontFamily: 'Poppins-Bold',
  },
  ratingSection: {
    backgroundColor: '#FFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 20,
  },
  starButton: {
    padding: 4,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    backgroundColor: '#FF9B42',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#CCC',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: 'Poppins-Bold',
  },
});

