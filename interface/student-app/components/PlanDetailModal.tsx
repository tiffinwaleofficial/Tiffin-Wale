import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { X, Check, Star, Clock, Utensils, Gift, Shield, Truck } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SubscriptionPlan } from '@/types/api';

interface PlanDetailModalProps {
  visible: boolean;
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSubscribe: (planId: string) => void;
  isActive?: boolean;
}

export default function PlanDetailModal({ 
  visible, 
  plan, 
  onClose, 
  onSubscribe, 
  isActive = false 
}: PlanDetailModalProps) {
  if (!plan) return null;

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(0)}`;
  };

  const mealTypes = [
    {
      type: 'Breakfast',
      items: ['Poha with Jalebi', 'Upma with Chutney', 'Paratha with Curd', 'Idli Sambhar'],
      icon: '🌅'
    },
    {
      type: 'Lunch', 
      items: ['Dal Chawal Combo', 'Rajma Rice', 'Chole Bhature', 'Paneer Curry with Roti'],
      icon: '🌞'
    },
    {
      type: 'Dinner',
      items: ['Biryani with Raita', 'Dal Tadka with Rice', 'Mixed Veg Curry', 'Butter Chicken'],
      icon: '🌙'
    }
  ];

  const additionalPerks = [
    { icon: <Gift size={20} color="#FF5722" />, text: 'Free dessert on weekends' },
    { icon: <Shield size={20} color="#4CAF50" />, text: '100% hygiene guaranteed' },
    { icon: <Truck size={20} color="#2196F3" />, text: 'Free delivery & packaging' },
    { icon: <Star size={20} color="#FFB800" />, text: 'Premium quality ingredients' },
    { icon: <Clock size={20} color="#9C27B0" />, text: 'Flexible delivery timing' },
    { icon: <Utensils size={20} color="#E91E63" />, text: 'Nutritionist approved meals' }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plan Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Plan Header */}
          <Animated.View 
            entering={FadeInUp.duration(400)}
            style={styles.planHeader}
          >
            <View style={styles.planTitleContainer}>
              <Text style={styles.planName}>{plan.name}</Text>
              {isActive && (
                <View style={styles.activeLabel}>
                  <Text style={styles.activeLabelText}>Current Plan</Text>
                </View>
              )}
            </View>
            <Text style={styles.planDescription}>{plan.description}</Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatPrice(plan.discountedPrice || plan.price)}</Text>
              {plan.discountedPrice && (
                <Text style={styles.originalPrice}>{formatPrice(plan.price)}</Text>
              )}
              <Text style={styles.pricePeriod}>/{plan.durationValue || plan.duration || 30} days</Text>
            </View>
          </Animated.View>

          {/* Meal Types Section */}
          <Animated.View 
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>🍽️ What's Included</Text>
            {mealTypes.map((meal, index) => (
              <View key={index} style={styles.mealTypeCard}>
                <View style={styles.mealTypeHeader}>
                  <Text style={styles.mealTypeIcon}>{meal.icon}</Text>
                  <Text style={styles.mealTypeName}>{meal.type}</Text>
                </View>
                <View style={styles.mealItems}>
                  {meal.items.map((item, idx) => (
                    <View key={idx} style={styles.mealItem}>
                      <Check size={14} color="#4CAF50" />
                      <Text style={styles.mealItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </Animated.View>

          {/* Features Section */}
          {plan.features && plan.features.length > 0 && (
            <Animated.View 
              entering={FadeInDown.delay(400).duration(400)}
              style={styles.section}
            >
              <Text style={styles.sectionTitle}>✨ Plan Features</Text>
              <View style={styles.featuresGrid}>
                {plan.features.map((feature: string, index: number) => (
                  <View key={index} style={styles.featureItem}>
                    <Check size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Additional Perks */}
          <Animated.View 
            entering={FadeInDown.delay(600).duration(400)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>🎁 Additional Perks</Text>
            <View style={styles.perksGrid}>
              {additionalPerks.map((perk, index) => (
                <View key={index} style={styles.perkItem}>
                  <View style={styles.perkIcon}>
                    {perk.icon}
                  </View>
                  <Text style={styles.perkText}>{perk.text}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Plan Stats */}
          <Animated.View 
            entering={FadeInDown.delay(800).duration(400)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>📊 Plan Statistics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{plan.mealsPerDay || 3}</Text>
                <Text style={styles.statLabel}>Meals/Day</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{plan.durationValue || 30}</Text>
                <Text style={styles.statLabel}>Days</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{plan.maxSkipCount || 5}</Text>
                <Text style={styles.statLabel}>Skip Allowance</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{plan.maxPauseCount || 2}</Text>
                <Text style={styles.statLabel}>Pause Allowance</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom Action */}
        <Animated.View 
          entering={FadeInUp.delay(1000).duration(400)}
          style={styles.bottomAction}
        >
          {!isActive && (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => onSubscribe(plan.id)}
            >
              <Text style={styles.subscribeButtonText}>Subscribe to This Plan</Text>
            </TouchableOpacity>
          )}
          {isActive && (
            <View style={styles.activeSubscriptionInfo}>
              <Check size={20} color="#4CAF50" />
              <Text style={styles.activeSubscriptionText}>This is your current active plan</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  planHeader: {
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
  planTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  planName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333333',
  },
  activeLabel: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeLabelText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#4CAF50',
  },
  planDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  price: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FF9B42',
  },
  originalPrice: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  pricePeriod: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333333',
    marginBottom: 16,
  },
  mealTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  mealTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  mealTypeIcon: {
    fontSize: 20,
  },
  mealTypeName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
  },
  mealItems: {
    gap: 8,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealItemText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    flex: 1,
  },
  featuresGrid: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    flex: 1,
  },
  perksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  perkItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  perkIcon: {
    marginBottom: 8,
  },
  perkText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FF9B42',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  bottomAction: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  subscribeButton: {
    backgroundColor: '#FF9B42',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  activeSubscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  activeSubscriptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#4CAF50',
  },
});
