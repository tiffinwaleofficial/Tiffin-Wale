import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Star, Clock, Check } from 'lucide-react-native';
import { Partner } from '@/lib/api';
import { useRouter } from 'expo-router';

interface PartnerCardProps {
  partner: Partner;
  onPress?: () => void;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner, onPress }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/pages/partner-detail?id=${partner._id}`);
    }
  };

  const distance = partner.address?.coordinates
    ? calculateDistance(partner.address.coordinates.latitude, partner.address.coordinates.longitude)
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Partner Logo */}
      <View style={styles.imageContainer}>
        {partner.logoUrl ? (
          <Image
            source={{ uri: partner.logoUrl }}
            style={styles.logo}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderLogo}>
            <Text style={styles.placeholderText}>
              {partner.businessName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {partner.status === 'approved' && (
          <View style={styles.verifiedBadge}>
            <Check size={12} color="#FFF" strokeWidth={3} />
          </View>
        )}
      </View>

      {/* Partner Info */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.businessName} numberOfLines={1}>
            {partner.businessName}
          </Text>
          {partner.isAcceptingOrders && (
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Open</Text>
            </View>
          )}
        </View>

        {/* Rating and Reviews */}
        {partner.averageRating && partner.averageRating > 0 ? (
          <View style={styles.ratingRow}>
            <Star size={16} color="#FF9F43" fill="#FF9F43" />
            <Text style={styles.rating}>{partner.averageRating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>
              ({partner.totalReviews || 0} reviews)
            </Text>
          </View>
        ) : (
          <Text style={styles.noRating}>New Partner</Text>
        )}

        {/* Location */}
        {partner.address && (
          <View style={styles.locationRow}>
            <MapPin size={14} color="#999" />
            <Text style={styles.locationText} numberOfLines={1}>
              {partner.address.city}, {partner.address.state}
            </Text>
          </View>
        )}

        {/* Cuisine Types */}
        {partner.cuisineTypes && partner.cuisineTypes.length > 0 && (
          <View style={styles.cuisineRow}>
            {partner.cuisineTypes.slice(0, 3).map((cuisine, index) => (
              <View key={index} style={styles.cuisineTag}>
                <Text style={styles.cuisineText}>{cuisine}</Text>
              </View>
            ))}
            {partner.cuisineTypes.length > 3 && (
              <Text style={styles.moreText}>+{partner.cuisineTypes.length - 3}</Text>
            )}
          </View>
        )}

        {/* Dietary Options */}
        {partner.dietaryOptions && partner.dietaryOptions.length > 0 && (
          <View style={styles.dietaryRow}>
            {partner.dietaryOptions.slice(0, 2).map((option, index) => (
              <View key={index} style={styles.dietaryTag}>
                <Text style={styles.dietaryText}>{option}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Operational Hours */}
        {partner.businessHours && (
          <View style={styles.hoursRow}>
            <Clock size={12} color="#666" />
            <Text style={styles.hoursText}>
              {partner.businessHours.open} - {partner.businessHours.close}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Helper function to calculate distance (mock - replace with real geolocation)
function calculateDistance(lat: number, lng: number): number {
  // This is a placeholder. In real implementation, use user's location
  return Math.random() * 10 + 1;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  placeholderLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FF9F43',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  noRating: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  distanceText: {
    fontSize: 12,
    color: '#FF9F43',
    fontWeight: '600',
    marginLeft: 4,
  },
  cuisineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  cuisineTag: {
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  cuisineText: {
    fontSize: 11,
    color: '#FF9F43',
    fontWeight: '600',
  },
  moreText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    alignSelf: 'center',
  },
  dietaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  dietaryTag: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  dietaryText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

