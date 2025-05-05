import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Restaurant } from '@/types';
import { Star, MapPin, Utensils } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface RestaurantCardProps {
  restaurant: Restaurant;
  featured?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  featured = false,
}) => {
  const router = useRouter();
  const {
    id,
    name,
    address,
    cuisineType,
    rating,
    reviewCount,
    image,
    featuredDish,
    distance,
  } = restaurant;

  const handlePress = () => {
    router.push(`/restaurant/${id}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, featured && styles.featuredCard]} 
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: image }} 
          style={styles.image}
        />
        {featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        {distance && (
          <View style={styles.distanceBadge}>
            <MapPin size={12} color="#000" />
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        
        <View style={styles.addressContainer}>
          <MapPin size={14} color="#666" />
          <Text style={styles.address} numberOfLines={1}>{address}</Text>
        </View>
        
        <View style={styles.cuisineContainer}>
          {cuisineType.map((cuisine, index) => (
            <View key={index} style={styles.cuisineBadge}>
              <Text style={styles.cuisineText}>{cuisine}</Text>
            </View>
          ))}
        </View>
        
        {featuredDish && (
          <View style={styles.featuredDishContainer}>
            <Utensils size={14} color="#666" />
            <Text style={styles.featuredDishLabel}>Famous for: </Text>
            <Text style={styles.featuredDish}>{featuredDish}</Text>
          </View>
        )}
        
        <View style={styles.ratingContainer}>
          <View style={styles.ratingBadge}>
            <Star size={14} color="#FF9B42" fill="#FF9B42" />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#FF9B42',
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF9B42',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  cuisineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  cuisineBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  cuisineText: {
    fontSize: 12,
    color: '#666',
  },
  featuredDishContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredDishLabel: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  featuredDish: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9B42',
  },
  reviewCount: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
});

export default RestaurantCard; 