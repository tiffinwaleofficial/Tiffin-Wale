import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { ArrowLeft, Check, ChevronRight, MapPin, Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data for demonstration
const mockMeal = {
  id: 'meal2',
  type: 'lunch',
  date: '2023-07-14T12:00:00Z',
  status: 'preparing',
  restaurantId: 'rest1',
  restaurantName: 'Spice Garden',
  menu: [
    {
      id: 'item1',
      name: 'Paneer Butter Masala with Roti',
      description: 'Creamy paneer curry with butter and spices, served with soft rotis',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      price: 12.99,
      rating: 4.7,
      reviewCount: 120,
      category: 'lunch',
      tags: ['vegetarian', 'spicy', 'north-indian'],
      isVegetarian: true,
      availableToday: true,
      restaurantId: 'rest1'
    }
  ]
};

const DELIVERY_STEPS = [
  { id: 'ordered', title: 'Order Confirmed', description: 'Your meal has been confirmed' },
  { id: 'preparing', title: 'Preparing', description: 'The restaurant is preparing your meal' },
  { id: 'ready', title: 'Ready for Pickup', description: 'Your meal is ready for pickup' },
  { id: 'delivered', title: 'Delivered', description: 'Enjoy your meal!' },
];

export default function TrackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthStore();
  const [meal, setMeal] = useState(mockMeal);
  
  // Animation values for the pulsating effect
  const activeBulletScale = useSharedValue(1);
  const activeLineOpacity = useSharedValue(0.6);
  
  // Set up the animations when component mounts
  useEffect(() => {
    activeBulletScale.value = withRepeat(
      withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, // infinite repetitions
      true // reverse
    );
    
    activeLineOpacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, // infinite repetitions
      true // reverse
    );
  }, []);
  
  // Fetch meal data based on ID from params
  useEffect(() => {
    if (params.id) {
      // In a real app, you would fetch the meal data from an API
      // For now, we'll just use the mock data
      console.log(`Fetching meal with ID: ${params.id}`);
    }
  }, [params.id]);
  
  // Animated styles for the active status bullet
  const animatedBulletStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: activeBulletScale.value }],
    };
  });
  
  // Animated styles for the active status line
  const animatedLineStyle = useAnimatedStyle(() => {
    return {
      opacity: activeLineOpacity.value,
    };
  });
  
  const getStepStatus = (stepId: string) => {
    if (!meal) return 'pending';
    
    const statusOrder = ['scheduled', 'preparing', 'ready', 'delivered', 'cancelled'];
    const currentStatusIndex = statusOrder.indexOf(meal.status);
    
    let stepIndex;
    switch (stepId) {
      case 'ordered': stepIndex = 0; break;
      case 'preparing': stepIndex = 1; break;
      case 'ready': stepIndex = 2; break;
      case 'delivered': stepIndex = 3; break;
      default: stepIndex = -1;
    }
    
    if (stepIndex < currentStatusIndex) return 'completed';
    if (stepIndex === currentStatusIndex) return 'active';
    return 'pending';
  };

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
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.mealDetailsCard}>
          <View style={styles.mealImageContainer}>
            {meal.menu.length > 0 && (
              <Image 
                source={{ uri: meal.menu[0].image }} 
                style={styles.mealImage} 
              />
            )}
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
              style={styles.mealImageGradient}
            />
            <View style={styles.mealTypeTag}>
              <Text style={styles.mealTypeText}>
                {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.mealDetails}>
            {meal.menu.length > 0 && (
              <Text style={styles.mealName}>{meal.menu[0].name}</Text>
            )}
            <Text style={styles.restaurantName}>{meal.restaurantName}</Text>
            
            <View style={styles.deliveryMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Delivery Time</Text>
                <Text style={styles.metaValue}>30-45 min</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Order ID</Text>
                <Text style={styles.metaValue}>#{meal.id}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.deliveryStatus}>
          <Text style={styles.deliveryStatusTitle}>Delivery Status</Text>
          
          <View style={styles.timeline}>
            {DELIVERY_STEPS.map((step, index) => {
              const status = getStepStatus(step.id);
              const isLastItem = index === DELIVERY_STEPS.length - 1;
              
              return (
                <View key={step.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    {status === 'active' ? (
                      <Animated.View 
                        style={[
                          styles.timelineBullet,
                          styles.timelineBulletActive,
                          animatedBulletStyle
                        ]}
                      />
                    ) : (
                      <View 
                        style={[
                          styles.timelineBullet,
                          status === 'completed' && styles.timelineBulletCompleted,
                        ]}
                      >
                        {status === 'completed' && <Check size={16} color="#FFFFFF" />}
                      </View>
                    )}
                    
                    {!isLastItem && (
                      status === 'active' ? (
                        <Animated.View 
                          style={[
                            styles.timelineLine,
                            styles.timelineLineActive,
                            animatedLineStyle
                          ]} 
                        />
                      ) : (
                        <View 
                          style={[
                            styles.timelineLine,
                            status === 'completed' && styles.timelineLineCompleted,
                          ]} 
                        />
                      )
                    )}
                  </View>
                  
                  <View style={styles.timelineContent}>
                    <Text 
                      style={[
                        styles.timelineTitle,
                        status === 'completed' && styles.timelineTitleCompleted,
                        status === 'active' && styles.timelineTitleActive,
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text style={styles.timelineDescription}>{step.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.deliveryDetails}>
          <Text style={styles.deliveryDetailsTitle}>Delivery Details</Text>
          
          <View style={styles.deliveryAddressCard}>
            <View style={styles.deliveryAddressHeader}>
              <MapPin size={20} color="#333333" />
              <Text style={styles.deliveryAddressTitle}>Delivery Address</Text>
            </View>
            <Text style={styles.deliveryAddressText}>{user?.address || '123 Main Street, Indore, MP'}</Text>
            <TouchableOpacity 
              style={styles.changeAddressButton}
              onPress={() => router.push("/delivery-addresses")}
            >
              <Text style={styles.changeAddressButtonText}>Change</Text>
              <ChevronRight size={16} color="#FF9B42" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.deliveryPersonCard}>
            <View style={styles.deliveryPersonHeader}>
              <View style={styles.deliveryPersonNameContainer}>
                <Text style={styles.deliveryPersonTitle}>Delivery Partner</Text>
                <Text style={styles.deliveryPersonName}>Raj Kumar</Text>
              </View>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
                style={styles.deliveryPersonImage} 
              />
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Phone size={20} color="#FFFFFF" />
              <Text style={styles.callButtonText}>Call Driver</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFAF0',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mealDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealImageContainer: {
    height: 200,
    position: 'relative',
  },
  mealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mealImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  mealTypeTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 155, 66, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  mealTypeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  mealDetails: {
    padding: 16,
  },
  mealName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 4,
  },
  restaurantName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  deliveryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999999',
    marginBottom: 2,
  },
  metaValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#333333',
  },
  metaDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },
  deliveryStatus: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deliveryStatusTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineBullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timelineBulletCompleted: {
    backgroundColor: '#4CAF50',
  },
  timelineBulletActive: {
    backgroundColor: '#FF9B42',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#F5F5F5',
  },
  timelineLineCompleted: {
    backgroundColor: '#4CAF50',
  },
  timelineLineActive: {
    backgroundColor: '#FF9B42',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  timelineTitleCompleted: {
    color: '#4CAF50',
  },
  timelineTitleActive: {
    color: '#FF9B42',
  },
  timelineDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999999',
  },
  deliveryDetails: {
    marginBottom: 24,
  },
  deliveryDetailsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  deliveryAddressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deliveryAddressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryAddressTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333333',
    marginLeft: 8,
  },
  deliveryAddressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  changeAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  changeAddressButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9B42',
    marginRight: 4,
  },
  deliveryPersonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deliveryPersonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  deliveryPersonNameContainer: {
    flex: 1,
  },
  deliveryPersonTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  deliveryPersonName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333333',
  },
  deliveryPersonImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  callButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
}); 