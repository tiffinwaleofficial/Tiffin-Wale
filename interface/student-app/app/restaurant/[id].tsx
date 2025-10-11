import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRestaurantStore } from '@/store/restaurantStore';
import { Star, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function RestaurantDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    currentRestaurant, 
    currentRestaurantMenu, 
    isLoading, 
    error, 
    fetchRestaurantById, 
    fetchMenuForRestaurant 
  } = useRestaurantStore();

  useEffect(() => {
    if (id) {
      fetchRestaurantById(id);
      fetchMenuForRestaurant(id);
    }
  }, [id, fetchRestaurantById, fetchMenuForRestaurant]);

  if (isLoading && !currentRestaurant) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9B42" />
        <Text style={styles.loadingText}>Loading Restaurant...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => {
          if (id) {
            fetchRestaurantById(id);
            fetchMenuForRestaurant(id);
          }
        }} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentRestaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>
      <ScrollView>
        <Animated.View entering={FadeInUp.duration(500)}>
          <Image source={{ uri: currentRestaurant.image }} style={styles.restaurantImage} />
          <View style={styles.detailsContainer}>
            <Text style={styles.restaurantName}>{currentRestaurant.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{currentRestaurant.rating} ({currentRestaurant.reviewCount} reviews)</Text>
            </View>
            <Text style={styles.restaurantAddress}>{currentRestaurant.address}</Text>
            <Text style={styles.cuisineType}>{currentRestaurant.cuisineType.join(' • ')}</Text>
          </View>
        </Animated.View>

        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menu</Text>
          {isLoading && !currentRestaurantMenu ? (
            <ActivityIndicator size="small" color="#FF9B42" />
          ) : (
            currentRestaurantMenu?.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInUp.delay(index * 100).duration(500)}>
                <View style={styles.menuItem}>
                  <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                  <View style={styles.menuItemDetails}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                    <Text style={styles.menuItemPrice}>₹{item.price.toFixed(2)}</Text>
                  </View>
                </View>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF9B42',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
  restaurantImage: {
    width: '100%',
    height: 250,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: -20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cuisineType: {
    fontSize: 14,
    color: '#FF9B42',
    fontWeight: '600',
  },
  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  menuItemDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#777',
    marginVertical: 4,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9B42',
  },
}); 