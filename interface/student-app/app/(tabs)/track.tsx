import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated, Easing, RefreshControl } from 'react-native';
import { useAuth } from '@/auth/AuthProvider';
import { useNotificationStore } from '@/store/notificationStore';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ArrowLeft, Check, MapPin, Phone, Package, ShoppingBag, Search, ClipboardList } from 'lucide-react-native';
import api from '@/utils/apiClient';

interface Meal {
  id: string;
  type: string;
  date: string;
  status: string;
  restaurantId: string;
  restaurantName: string;
  menu: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    rating: number;
    reviewCount: number;
    category: string;
    tags: string[];
    isVegetarian: boolean;
    availableToday: boolean;
    restaurantId: string;
  }>;
}

const DELIVERY_STEPS = [
  { id: 'scheduled', title: 'Order Confirmed', description: 'Your meal has been confirmed' },
  { id: 'preparing', title: 'Preparing', description: 'The restaurant is preparing your meal' },
  { id: 'ready', title: 'Ready for Pickup', description: 'Your meal is ready for pickup' },
  { id: 'delivered', title: 'Delivered', description: 'Enjoy your meal!' },
];

export default function TrackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  useAuth();
  const { subscribeToOrderUpdates, unsubscribeFromOrderUpdates } = useNotificationStore();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values for the pulsating effect (using standard Animated API)
  const activeBulletScale = useRef(new Animated.Value(1)).current;
  const activeLineOpacity = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Set up the animations when component mounts
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulsating scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(activeBulletScale, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(activeBulletScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Pulsating opacity animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(activeLineOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(activeLineOpacity, {
          toValue: 0.6,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  // Enterprise caching: Fetch meal data and set up real-time tracking
  const fetchMealData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && meal && !refreshing) {
      // Use cached data if available and not force refreshing
      if (__DEV__) console.log('🍽️ Track: Using cached meal data');
      return;
    }

    if (!refreshing) setIsLoading(true);
    setError(null);
    
    try {
      if (params.id) {
        // Fetch specific meal data from API
        if (__DEV__) console.log('🔄 Track: Fetching meal data for ID:', params.id);
        const mealData = await api.meals.getById(params.id as string);
        setMeal(mealData);
          
          // Subscribe to real-time order updates if this is an active order
          if (mealData.status !== 'delivered' && mealData.status !== 'cancelled') {
            subscribeToOrderUpdates(params.id as string);
          }
        } else {
          // No specific meal ID - fetch the most recent active order/meal
          console.log('No meal ID provided, fetching recent active orders');
          
          // Try to get today's meals first
          try {
            const todayMeals = await api.meals.getToday();
            console.log('Today meals response:', todayMeals);
            
            if (todayMeals && todayMeals.length > 0) {
              // Find the most recent active meal
              const activeMeal = todayMeals.find((meal: Meal) => 
                meal.status !== 'delivered' && meal.status !== 'cancelled'
              ) || todayMeals[0]; // fallback to first meal if none active
              
              setMeal(activeMeal);
              
              if (activeMeal.status !== 'delivered' && activeMeal.status !== 'cancelled') {
                subscribeToOrderUpdates(activeMeal.id);
              }
            } else {
              // If no today's meals, try to get customer orders
              console.log('No today meals found, trying customer orders');
              const customerOrders = await api.customer.getOrders();
              console.log('Customer orders response:', customerOrders);
              
              if (customerOrders && customerOrders.length > 0) {
                // Convert order to meal format and get the most recent one
                const recentOrder = customerOrders[0];
                const mealFromOrder = {
                  id: recentOrder.id,
                  type: 'lunch', // Default type since Order doesn't have this
                  date: recentOrder.createdAt || new Date().toISOString(),
                  status: recentOrder.status === 'canceled' ? 'cancelled' : recentOrder.status,
                  restaurantId: '', // Order doesn't have restaurant info
                  restaurantName: 'Restaurant',
                  menu: (recentOrder.items || []).map(item => ({
                    id: typeof item.menuItem === 'string' ? item.menuItem : item.menuItem?.id || '',
                    name: typeof item.menuItem === 'object' ? item.menuItem.name : 'Item',
                    description: typeof item.menuItem === 'object' ? item.menuItem.description : '',
                    image: typeof item.menuItem === 'object' ? (item.menuItem.image || '') : '',
                    price: item.price,
                    rating: typeof item.menuItem === 'object' && item.menuItem.ratings ? item.menuItem.ratings.average : 0,
                    reviewCount: typeof item.menuItem === 'object' && item.menuItem.ratings ? item.menuItem.ratings.count : 0,
                    category: typeof item.menuItem === 'object' ? item.menuItem.category : '',
                    tags: typeof item.menuItem === 'object' && item.menuItem.dietaryInfo ? item.menuItem.dietaryInfo : [],
                    isVegetarian: typeof item.menuItem === 'object' && item.menuItem.dietaryInfo ? item.menuItem.dietaryInfo.includes('vegetarian') : false,
                    availableToday: typeof item.menuItem === 'object' ? item.menuItem.isAvailable : true,
                    restaurantId: typeof item.menuItem === 'object' ? item.menuItem.partnerId : '',
                  }))
                };
                
                setMeal(mealFromOrder);
                
                if (mealFromOrder.status !== 'delivered' && mealFromOrder.status !== 'canceled') {
                  subscribeToOrderUpdates(mealFromOrder.id);
                }
              } else {
                setError('No active orders found to track. Place an order first!');
              }
            }
          } catch (todayMealsError) {
            console.log('Error fetching today meals, trying customer orders:', todayMealsError);
            
            // Fallback to customer orders if today's meals fail
            try {
              const customerOrders = await api.customer.getOrders();
              console.log('Customer orders response (fallback):', customerOrders);
              
              if (customerOrders && customerOrders.length > 0) {
                const recentOrder = customerOrders[0];
                const mealFromOrder = {
                  id: recentOrder.id,
                  type: 'lunch', // Default type since Order doesn't have this
                  date: recentOrder.createdAt || new Date().toISOString(),
                  status: recentOrder.status === 'canceled' ? 'cancelled' : recentOrder.status,
                  restaurantId: '', // Order doesn't have restaurant info
                  restaurantName: 'Restaurant',
                  menu: (recentOrder.items || []).map(item => ({
                    id: typeof item.menuItem === 'string' ? item.menuItem : item.menuItem?.id || '',
                    name: typeof item.menuItem === 'object' ? item.menuItem.name : 'Item',
                    description: typeof item.menuItem === 'object' ? item.menuItem.description : '',
                    image: typeof item.menuItem === 'object' ? (item.menuItem.image || '') : '',
                    price: item.price,
                    rating: typeof item.menuItem === 'object' && item.menuItem.ratings ? item.menuItem.ratings.average : 0,
                    reviewCount: typeof item.menuItem === 'object' && item.menuItem.ratings ? item.menuItem.ratings.count : 0,
                    category: typeof item.menuItem === 'object' ? item.menuItem.category : '',
                    tags: typeof item.menuItem === 'object' && item.menuItem.dietaryInfo ? item.menuItem.dietaryInfo : [],
                    isVegetarian: typeof item.menuItem === 'object' && item.menuItem.dietaryInfo ? item.menuItem.dietaryInfo.includes('vegetarian') : false,
                    availableToday: typeof item.menuItem === 'object' ? item.menuItem.isAvailable : true,
                    restaurantId: typeof item.menuItem === 'object' ? item.menuItem.partnerId : '',
                  }))
                };
                
                setMeal(mealFromOrder);
                
                if (mealFromOrder.status !== 'delivered' && mealFromOrder.status !== 'canceled') {
                  subscribeToOrderUpdates(mealFromOrder.id);
                }
              } else {
                setError('No orders found to track. Place an order first!');
              }
            } catch (ordersError) {
              console.error('Error fetching customer orders:', ordersError);
              setError('Unable to load tracking information. Please try again.');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching meal data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load meal data');
      } finally {
        if (!refreshing) setIsLoading(false);
      }
    }, [params.id, meal, refreshing, subscribeToOrderUpdates]);

  // Initial data load
  useEffect(() => {
    fetchMealData(false); // Load cached data first
  }, [fetchMealData]);

  // Smart focus refresh: Background refresh when page comes into focus
  useFocusEffect(
    useCallback(() => {
      if (__DEV__) console.log('👁️ Track: Page focused - background refresh');
      // Background refresh without loading states
      setTimeout(() => {
        fetchMealData(false); // Background refresh
      }, 100);
    }, [fetchMealData])
  );

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (__DEV__) console.log('🔄 Track: Pull-to-refresh triggered');
      await fetchMealData(true); // Force refresh
    } finally {
      setRefreshing(false);
    }
  }, [fetchMealData]);

  // Cleanup: unsubscribe from updates when component unmounts
  useEffect(() => {
    return () => {
      if (params.id) {
        unsubscribeFromOrderUpdates(params.id as string);
      } else if (meal?.id) {
        unsubscribeFromOrderUpdates(meal.id);
      }
    };
  }, [params.id, meal?.id, unsubscribeFromOrderUpdates]);
  
  // Animated styles for the active status bullet
  const animatedBulletStyle = {
    transform: [{ scale: activeBulletScale }],
  };
  
  // Animated styles for the active status line
  const animatedLineStyle = {
    opacity: activeLineOpacity,
  };
  
  const getStepStatus = (stepId: string) => {
    if (!meal) return 'pending';
    
    const statusOrder = ['scheduled', 'preparing', 'ready', 'delivered', 'cancelled'];
    const currentStatusIndex = statusOrder.indexOf(meal.status);
    
    let stepIndex;
    switch (stepId) {
      case 'scheduled': stepIndex = 0; break;
      case 'preparing': stepIndex = 1; break;
      case 'ready': stepIndex = 2; break;
      case 'delivered': stepIndex = 3; break;
      default: stepIndex = -1;
    }
    
    if (stepIndex < currentStatusIndex) return 'completed';
    if (stepIndex === currentStatusIndex) return 'active';
    return 'pending';
  };

  // Removed loading state - show content immediately

  if (error || !meal) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.replace("/(tabs)")} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.centeredContent}>
          <Animated.View style={[styles.emptyStateCard, { opacity: fadeAnim }]}>
            <View style={styles.emptyIconContainer}>
              <Search size={64} color="#FF9B42" />
            </View>
            <Text style={styles.emptyStateTitle}>Nothing to Track</Text>
            <Text style={styles.emptyStateMessage}>
              You don't have any active orders to track at the moment.{'\n'}
              Check your order history or browse meals to get started!
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                onPress={() => router.push("/(tabs)/orders")} 
                style={styles.primaryButton}
              >
                <ClipboardList size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.primaryButtonText}>View Orders</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.replace("/(tabs)")} 
                style={styles.secondaryButton}
              >
                <ShoppingBag size={20} color="#FF9B42" style={styles.buttonIcon} />
                <Text style={styles.secondaryButtonText}>Browse Meals</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            console.log('Back button pressed in track page');
            router.replace("/(tabs)");
          }} 
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF9B42']}
            tintColor="#FF9B42"
          />
        }
      >
        {/* Meal Card */}
        <Animated.View style={[styles.mealCard, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Image 
            source={{ uri: meal.menu[0]?.image || 'https://via.placeholder.com/300x200' }} 
            style={styles.mealImage} 
          />
          <View style={styles.mealDetails}>
            <Text style={styles.mealName}>{meal.menu[0]?.name || 'Meal'}</Text>
            <Text style={styles.restaurantName}>{meal.restaurantName}</Text>
            <Text style={styles.mealType}>{meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</Text>
          </View>
        </Animated.View>

        {/* Tracking Progress */}
        <Animated.View style={[styles.trackingCard, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Text style={styles.trackingTitle}>Order Status</Text>
          
          <View style={styles.stepsContainer}>
            {DELIVERY_STEPS.map((step, index) => {
              const status = getStepStatus(step.id);
              const isActive = status === 'active';
              const isCompleted = status === 'completed';
              const isLast = index === DELIVERY_STEPS.length - 1;
              
              return (
                <View key={step.id} style={styles.stepWrapper}>
                  <View style={styles.stepContainer}>
                    <Animated.View 
                      style={[
                        styles.stepBullet,
                        isCompleted && styles.stepBulletCompleted,
                        isActive && styles.stepBulletActive,
                        isActive && animatedBulletStyle
                      ]}
                    >
                      {isCompleted && <Check size={12} color="#FFFFFF" />}
                    </Animated.View>
                    
                    <View style={styles.stepContent}>
                      <Text style={[
                        styles.stepTitle,
                        (isActive || isCompleted) && styles.stepTitleActive
                      ]}>
                        {step.title}
                      </Text>
                      <Text style={styles.stepDescription}>{step.description}</Text>
                    </View>
                  </View>
                  
                  {!isLast && (
                    <Animated.View 
                      style={[
                        styles.stepLine,
                        isCompleted && styles.stepLineCompleted,
                        isActive && animatedLineStyle
                      ]} 
                    />
                  )}
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Restaurant Info */}
        <Animated.View style={[styles.restaurantCard, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Text style={styles.restaurantTitle}>Restaurant Details</Text>
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantRow}>
              <MapPin size={16} color="#666666" />
              <Text style={styles.restaurantAddress}>
                {meal.restaurantName} - Contact restaurant for address
              </Text>
            </View>
            <TouchableOpacity style={styles.restaurantRow}>
              <Phone size={16} color="#FF9B42" />
              <Text style={styles.restaurantPhone}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFAF0',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: '#FF9B42',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mealImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  mealDetails: {
    alignItems: 'center',
  },
  mealName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  mealType: {
    fontSize: 12,
    color: '#FF9B42',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trackingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepsContainer: {
    paddingLeft: 20,
  },
  stepWrapper: {
    position: 'relative',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepBulletActive: {
    backgroundColor: '#FF9B42',
  },
  stepBulletCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 2,
  },
  stepTitleActive: {
    color: '#333333',
  },
  stepDescription: {
    fontSize: 12,
    color: '#999999',
  },
  stepLine: {
    position: 'absolute',
    left: 11,
    top: 24,
    width: 2,
    height: 20,
    backgroundColor: '#E8E8E8',
  },
  stepLineCompleted: {
    backgroundColor: '#4CAF50',
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  restaurantTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  restaurantInfo: {
    gap: 12,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  restaurantPhone: {
    fontSize: 14,
    color: '#FF9B42',
    fontWeight: '500',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    maxWidth: 320,
    width: '100%',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FF9B42',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
}); 