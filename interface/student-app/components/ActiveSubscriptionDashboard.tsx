import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bell, ChevronRight, Clock, Coffee, Star, Calendar, ChevronDown, Utensils, Wallet, ThumbsUp } from 'lucide-react-native';

import { CustomerProfile } from '@/types/auth';
import { Meal } from '@/types';

type ActiveSubscriptionDashboardProps = {
  user: CustomerProfile | null;
  todayMeals: Meal[];
  isLoading: boolean;
};

export const ActiveSubscriptionDashboard = ({ user, todayMeals, isLoading }: ActiveSubscriptionDashboardProps) => {
  const router = useRouter();
  
  // Get time of day for greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  // Format date
  const formatDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Header with Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getTimeOfDay()}, John</Text>
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
          <TouchableOpacity style={styles.bellContainer}>
            <Bell size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards - First Row */}
        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <View style={styles.statsIconContainer}>
              <Calendar size={24} color="#3B82F6" />
            </View>
            <Text style={styles.statsNumber}>42</Text>
            <Text style={styles.statsLabel}>Days Left</Text>
          </View>
          <View style={styles.statsCard}>
            <View style={[styles.statsIconContainer, { backgroundColor: '#FFF5E8' }]}>
              <Utensils size={24} color="#FF9B42" />
            </View>
            <Text style={styles.statsNumber}>24</Text>
            <Text style={styles.statsLabel}>Meals Left</Text>
          </View>
        </View>

        {/* Stats Cards - Second Row */}
        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <View style={[styles.statsIconContainer, { backgroundColor: '#E6F7EF' }]}>
              <Star size={24} color="#4CB944" />
            </View>
            <Text style={styles.statsNumber}>4.8</Text>
            <Text style={styles.statsLabel}>Rating</Text>
          </View>
          <View style={styles.statsCard}>
            <View style={[styles.statsIconContainer, { backgroundColor: '#F0EAFF' }]}>
              <Wallet size={24} color="#7C3AED" />
            </View>
            <Text style={styles.statsNumber}>₹349</Text>
            <Text style={styles.statsLabel}>Savings</Text>
          </View>
        </View>

        {/* Plan Information */}
        <View style={styles.planCard}>
          <View style={styles.planHeaderRow}>
            <Text style={styles.planTitle}>Your Plan</Text>
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <ChevronRight size={16} color="#FF9B42" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.planName}>Premium Plan</Text>
          <Text style={styles.planDescription}>Three meals a day</Text>
          
          <View style={styles.planDetailRow}>
            <Utensils size={18} color="#4CB944" />
            <Text style={styles.planDetailText}>3 meals per day</Text>
          </View>
          
          <View style={styles.planDetailRow}>
            <Clock size={18} color="#666666" />
            <Text style={styles.planDetailText}>Valid until 26 May, 2025</Text>
          </View>
        </View>

        {/* Today's Meals */}
        <View style={styles.todaysMealsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#FF9B42" />
            </TouchableOpacity>
          </View>

          {/* Breakfast Card */}
          <Animated.View 
            style={styles.mealCard}
            entering={FadeInDown.duration(400).delay(500)}
          >
            <View style={styles.mealCardHeader}>
              <Text style={styles.mealTypeLabel}>Breakfast</Text>
            </View>
            <View style={styles.mealCardContent}>
              <View style={styles.mealImageContainer}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/14705131/pexels-photo-14705131.jpeg' }} 
                  style={styles.mealImage} 
                />
              </View>
              <View style={styles.mealDetails}>
                <Text style={styles.mealName}>Poha with Jalebi</Text>
                <Text style={styles.vendorName}>Indori Delights</Text>
                <View style={styles.ratingAndStatus}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.ratingText}>4.5</Text>
                  </View>
                  <View style={styles.deliveredBadge}>
                    <Text style={styles.deliveredText}>Delivered</Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.rateButton}>
                    <ThumbsUp size={14} color="#FF9B42" />
                    <Text style={styles.rateButtonText}>Rate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Lunch Card */}
          <Animated.View 
            style={styles.mealCard}
            entering={FadeInDown.duration(400).delay(600)}
          >
            <View style={styles.mealCardHeader}>
              <Text style={styles.mealTypeLabel}>Lunch</Text>
            </View>
            <View style={styles.mealCardContent}>
              <View style={styles.mealImageContainer}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg' }} 
                  style={styles.mealImage} 
                />
              </View>
              <View style={styles.mealDetails}>
                <Text style={styles.mealName}>Paneer Butter Masala with Roti</Text>
                <Text style={styles.vendorName}>Spice Garden</Text>
                <View style={styles.ratingAndStatus}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.ratingText}>4.7</Text>
                  </View>
                  <View style={styles.preparingBadge}>
                    <Text style={styles.preparingText}>Preparing</Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.trackButton}>
                    <Clock size={14} color="#FFFFFF" />
                    <Text style={styles.trackButtonText}>Track</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Dinner Card */}
          <Animated.View 
            style={styles.mealCard}
            entering={FadeInDown.duration(400).delay(700)}
          >
            <View style={styles.mealCardHeader}>
              <Text style={styles.mealTypeLabel}>Dinner</Text>
            </View>
            <View style={styles.mealCardContent}>
              <View style={styles.mealImageContainer}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg' }} 
                  style={styles.mealImage} 
                />
              </View>
              <View style={styles.mealDetails}>
                <Text style={styles.mealName}>Dal Tadka with Rice</Text>
                <Text style={styles.vendorName}>Homely Meals</Text>
                <View style={styles.ratingAndStatus}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.ratingText}>4.3</Text>
                  </View>
                  <View style={styles.scheduledBadge}>
                    <Text style={styles.scheduledText}>Scheduled</Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  {/* No button for scheduled meal */}
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Coming Up Next */}
        <View style={styles.comingUpContainer}>
          <Text style={styles.comingUpTitle}>Coming Up Next</Text>
          
          <View style={styles.mealCard}>
            <View style={styles.mealCardHeader}>
              <View style={styles.headerWithIcon}>
                <Utensils size={16} color="#FF9B42" />
                <Text style={styles.mealTypeLabel}>Lunch</Text>
              </View>
            </View>
            <View style={styles.mealCardContent}>
              <View style={styles.mealImageContainer}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg' }} 
                  style={styles.mealImage} 
                />
              </View>
              <View style={styles.mealDetails}>
                <Text style={styles.mealName}>Paneer Butter Masala with Roti</Text>
                <Text style={styles.vendorName}>From Spice Garden</Text>
                <View style={styles.ratingAndStatus}>
                  <View style={styles.preparingBadge}>
                    <Text style={styles.preparingText}>Preparing</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  bellContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    marginHorizontal: 4,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 4,
  },
  statsLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9B42',
    marginRight: 4,
  },
  planName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#333333',
    marginBottom: 4,
  },
  planDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  planDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planDetailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  todaysMealsContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9B42',
    marginRight: 4,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealCardHeader: {
    backgroundColor: '#FFF8EE',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealTypeLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9B42',
  },
  mealCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  mealImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mealDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  mealName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  vendorName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  ratingAndStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 1,
  },
  ratingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
    marginRight: 8,
  },
  deliveredBadge: {
    backgroundColor: 'rgba(76, 185, 68, 0.13)',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deliveredText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#4CB944',
  },
  preparingBadge: {
    backgroundColor: 'rgba(30, 136, 229, 0.13)',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  preparingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#1E88E5',
  },
  scheduledBadge: {
    backgroundColor: 'rgba(255, 155, 66, 0.13)',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  scheduledText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FF9B42',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  rateButton: {
    backgroundColor: '#FFF8EE',
    borderColor: '#FFF0E0',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
    alignSelf: 'flex-start',
  },
  rateButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9B42',
    marginRight: 2,
  },
  trackButton: {
    backgroundColor: '#FF9B42',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
    alignSelf: 'flex-start',
  },
  trackButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginRight: 2,
  },
  comingUpContainer: {
    marginBottom: 20,
  },
  comingUpTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
}); 