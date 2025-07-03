import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRestaurantStore } from '@/store/restaurantStore';
import { Star, MapPin, Utensils, ArrowLeft } from 'lucide-react-native';

const RestaurantDetail: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { fetchRestaurantById, currentRestaurant, isLoading, error } = useRestaurantStore();
  
  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchRestaurantById(id);
    }
  }, [id, fetchRestaurantById]);

  if (isLoading) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Loading restaurant...</Text>
      </View>
    );
  }

  if (error || !currentRestaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Restaurant not found'}</Text>
      </View>
    );
  }

  const restaurant = currentRestaurant;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Image 
          source={{ uri: restaurant.image || 'https://via.placeholder.com/400x250' }} 
          style={styles.image}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{restaurant.name}</Text>

        <View style={styles.ratingContainer}>
          <View style={styles.ratingBadge}>
            <Star size={16} color="#FF9B42" fill="#FF9B42" />
            <Text style={styles.ratingText}>{restaurant.rating?.toFixed(1) || 'N/A'}</Text>
          </View>
          <Text style={styles.reviewCount}>({restaurant.reviewCount || 0} reviews)</Text>
        </View>

        <View style={styles.addressContainer}>
          <MapPin size={16} color="#666" />
          <Text style={styles.address}>{restaurant.address || 'Address not available'}</Text>
        </View>

        <View style={styles.cuisineContainer}>
          {restaurant.cuisineType?.map((cuisine, index) => (
            <View key={index} style={styles.cuisineBadge}>
              <Text style={styles.cuisineText}>{cuisine}</Text>
            </View>
          )) || (
            <View style={styles.cuisineBadge}>
              <Text style={styles.cuisineText}>Restaurant</Text>
            </View>
          )}
        </View>

        {restaurant.featuredDish && (
          <View style={styles.featuredDishContainer}>
            <Utensils size={16} color="#666" />
            <Text style={styles.featuredDishLabel}>Famous for: </Text>
            <Text style={styles.featuredDish}>{restaurant.featuredDish}</Text>
          </View>
        )}



        {/* Add more sections like menu, reviews, etc. */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 155, 66, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9B42',
  },
  reviewCount: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  address: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  cuisineBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  cuisineText: {
    fontSize: 14,
    color: '#666',
  },
  featuredDishContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredDishLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  featuredDish: {
    fontSize: 14,
    fontWeight: '500',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
  },
});

export default RestaurantDetail; 