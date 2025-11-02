import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Clock,
  Utensils,
  MapPin,
  Star,
  Plus,
  Minus,
  CheckCircle,
  X,
} from 'lucide-react-native';
import { BackButton } from '@/components/BackButton';
import { api, Order } from '@/lib/api';
import { useAuth } from '@/auth/AuthProvider';
import { useFirebaseNotification } from '@/hooks/useFirebaseNotification';
import { notificationActions } from '@/store/notificationStore';

const { width } = Dimensions.get('window');

interface ExtraItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function MealDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const orderId = params.id as string;
  const action = params.action as string; // 'extras' or 'rate'
  const { user } = useAuth();
  const { showSuccess, showError } = useFirebaseNotification();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestingExtras, setRequestingExtras] = useState(false);
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const orderData = await api.orders.getOrderById(orderId);
      setOrder(orderData);
      
      // Initialize extras if action is 'extras'
      if (action === 'extras' && orderData) {
        // Pre-populate with common extras options
        // In a real app, you'd fetch available extras from partner menu
        setExtras([
          { id: 'extra-roti', name: 'Extra Roti', price: 10, quantity: 0 },
          { id: 'extra-rice', name: 'Extra Rice', price: 15, quantity: 0 },
          { id: 'extra-dal', name: 'Extra Dal', price: 20, quantity: 0 },
          { id: 'extra-sabzi', name: 'Extra Sabzi', price: 25, quantity: 0 },
          { id: 'pudina-chutney', name: 'Pudina Chutney', price: 10, quantity: 0 },
          { id: 'pickle', name: 'Achar/Pickle', price: 15, quantity: 0 },
        ]);
      }
    } catch (error: any) {
      console.error('Failed to fetch order details:', error);
      showError('Error', error.message || 'Failed to load meal details');
      router.back();
    } finally {
      setLoading(false);
    }
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

      // Create order update with extras
      const extrasItems = selectedExtras.map(extra => ({
        mealId: extra.id,
        quantity: extra.quantity,
        price: extra.price,
        specialInstructions: `${extra.name} - Extra item request`,
      }));

      // Get current order items and add extras
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

      // Calculate new total amount
      const itemsTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Update order with extras using PATCH endpoint
      const { apiClient } = await import('@/lib/api/client');
      
      // Get existing delivery instructions if any
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

      console.log('📝 Updating order with extras:', updatePayload);
      
      const response = await apiClient.patch(`/orders/${orderId}`, updatePayload);
      
      console.log('✅ Order updated successfully:', response.data);

      // Show success notification
      notificationActions.showNotification({
        id: `extras-requested-${Date.now()}`,
        type: 'toast',
        variant: 'success',
        title: 'Extras Requested! ✅',
        message: `Your extra items will be added to your order`,
        duration: 4000,
      });

      showSuccess(
        'Extras Requested',
        `Your extra items (₹${calculateTotal()}) will be included with your meal`
      );

      // Refresh order data
      await fetchOrderDetails();
      
      // Navigate back after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      console.error('Failed to request extras:', error);
      showError('Request Failed', error.message || 'Failed to request extras. Please try again.');
    } finally {
      setRequestingExtras(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9B42" />
        <Text style={styles.loadingText}>Loading meal details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <X size={48} color="#EF4444" />
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const partner = typeof order.businessPartner === 'object' ? order.businessPartner : null;
  const mealType = order.mealType || order.deliverySlot || 'lunch';
  const mealTypeLabels: Record<string, string> = {
    breakfast: '🌅 Breakfast',
    lunch: '🍽️ Lunch',
    dinner: '🌙 Dinner',
    morning: '🌅 Breakfast',
    afternoon: '🍽️ Lunch',
    evening: '🌙 Dinner',
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Meal Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Meal Info Card */}
        <View style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <View style={styles.mealTypeBadge}>
              <Utensils size={16} color="#FF9B42" />
              <Text style={styles.mealTypeText}>
                {mealTypeLabels[mealType.toLowerCase()] || mealType}
              </Text>
            </View>
            <View style={[styles.statusBadge, 
              order.status === 'delivered' && styles.statusBadgeDelivered,
              order.status === 'preparing' && styles.statusBadgePreparing,
              order.status === 'pending' && styles.statusBadgePending,
            ]}>
              <Text style={styles.statusText}>
                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ') : 'Scheduled'}
              </Text>
            </View>
          </View>

          <Text style={styles.mealTitle}>Subscription Meal</Text>
          <Text style={styles.partnerName}>{partner?.businessName || 'Your Plan'}</Text>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Clock size={16} color="#666" />
              <Text style={styles.detailText}>
                {order.deliveryTimeRange || order.scheduledDeliveryTime ? 
                  new Date(order.scheduledDeliveryTime || '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) :
                  'Scheduled'
                }
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

          {/* Current Items */}
          {order.items && order.items.length > 0 && (
            <View style={styles.itemsSection}>
              <Text style={styles.sectionTitle}>Current Meal Items</Text>
              {order.items.map((item: any, index: number) => (
                <View key={index} style={styles.itemRow}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={styles.itemText}>
                    {item.specialInstructions || `${item.quantity || 1}x Meal Item`}
                  </Text>
                </View>
              ))}
            </View>
          )}
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
      </ScrollView>

      {/* Bottom Action Button */}
      {action === 'extras' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.requestButton, requestingExtras && styles.requestButtonDisabled]}
            onPress={handleRequestExtras}
            disabled={requestingExtras || calculateTotal() === 0}
          >
            {requestingExtras ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Text style={styles.requestButtonText}>
                  Request Extras {calculateTotal() > 0 && `(₹${calculateTotal()})`}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FF9B42',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  scrollView: {
    flex: 1,
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
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Poppins-SemiBold',
  },
  placeholder: {
    width: 40,
  },
  mealCard: {
    backgroundColor: '#FFF',
    margin: 16,
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
    marginBottom: 16,
  },
  mealTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8EE',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9B42',
    fontFamily: 'Poppins-SemiBold',
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 155, 66, 0.13)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusBadgeDelivered: {
    backgroundColor: 'rgba(76, 185, 68, 0.13)',
  },
  statusBadgePreparing: {
    backgroundColor: 'rgba(30, 136, 229, 0.13)',
  },
  statusBadgePending: {
    backgroundColor: 'rgba(255, 155, 66, 0.13)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9B42',
    fontFamily: 'Poppins-Medium',
  },
  mealTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  partnerName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
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
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
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
  extrasSection: {
    backgroundColor: '#FFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  requestButton: {
    backgroundColor: '#FF9B42',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButtonDisabled: {
    opacity: 0.6,
  },
  requestButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: 'Poppins-Bold',
  },
});

