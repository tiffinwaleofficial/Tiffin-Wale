import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { MapPin, Star, Clock, Check, ChevronRight, Leaf, Drumstick } from 'lucide-react-native';
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

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Top Section: Logo + Basic Info */}
      <View style={styles.topSection}>
        {/* Partner Logo - Larger & More Prominent */}
        <View style={styles.logoContainer}>
          {partner.logoUrl ? (
            <Image
              source={{ uri: partner.logoUrl }}
              style={styles.logo}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderLogo}>
              <Text style={styles.placeholderText}>
                {partner.businessName.substring(0, 2).toUpperCase()}
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
        <View style={styles.infoContainer}>
          {/* Name & Open Status */}
          <View style={styles.nameRow}>
            <Text style={styles.businessName} numberOfLines={1}>
              {partner.businessName}
            </Text>
            {partner.isAcceptingOrders && (
              <View style={styles.openBadge}>
                <View style={styles.openDot} />
                <Text style={styles.openText}>Open</Text>
              </View>
            )}
          </View>

          {/* Rating - Prominent Display */}
          <View style={styles.ratingContainer}>
            {partner.averageRating && partner.averageRating > 0 ? (
              <View style={styles.ratingBadge}>
                <Star size={14} color="#FFF" fill="#FFF" />
                <Text style={styles.ratingText}>{partner.averageRating.toFixed(1)}</Text>
              </View>
            ) : (
              <View style={styles.newPartnerBadge}>
                <Text style={styles.newPartnerText}>New</Text>
              </View>
            )}
            {partner.totalReviews && partner.totalReviews > 0 && (
              <Text style={styles.reviewsText}>
                {partner.totalReviews} reviews
              </Text>
            )}
          </View>

          {/* Location */}
          {partner.address && (
            <View style={styles.locationRow}>
              <MapPin size={13} color="#666" />
              <Text style={styles.locationText} numberOfLines={1}>
                {partner.address.city}, {partner.address.state}
              </Text>
            </View>
          )}

          {/* Dietary Icons - Important Visual Indicators */}
          <View style={styles.dietaryIconsRow}>
            {partner.isVegetarian && (
              <View style={styles.vegBadge}>
                <View style={styles.vegDot} />
                <Text style={styles.vegText}>Pure Veg</Text>
              </View>
            )}
            {!partner.isVegetarian && (
              <View style={styles.nonVegBadge}>
                <View style={styles.nonVegDot} />
                <Text style={styles.nonVegText}>Non-Veg</Text>
              </View>
            )}
            {partner.dietaryOptions?.includes('vegan') && (
              <View style={styles.veganBadge}>
                <Leaf size={12} color="#10B981" />
                <Text style={styles.veganText}>Vegan</Text>
              </View>
            )}
            {partner.dietaryOptions?.includes('jain') && (
              <View style={styles.jainBadge}>
                <Text style={styles.jainText}>Jain</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Bottom Section: Cuisines & Hours */}
      <View style={styles.bottomSection}>
        {/* Cuisine Tags - Show Top 2 */}
        {partner.cuisineTypes && partner.cuisineTypes.length > 0 && (
          <View style={styles.cuisineContainer}>
            {partner.cuisineTypes.slice(0, 2).map((cuisine, index) => (
              <View 
                key={index} 
                style={[
                  styles.cuisineTag,
                  index === 0 && styles.primaryCuisineTag
                ]}
              >
                <Text 
                  style={[
                    styles.cuisineText,
                    index === 0 && styles.primaryCuisineText
                  ]}
                >
                  {cuisine}
                </Text>
              </View>
            ))}
            {partner.cuisineTypes.length > 2 && (
              <View style={styles.moreTag}>
                <Text style={styles.moreText}>+{partner.cuisineTypes.length - 2}</Text>
              </View>
            )}
          </View>
        )}

        {/* Operating Hours */}
        {partner.businessHours && (
          <View style={styles.hoursContainer}>
            <Clock size={13} color="#10B981" />
            <Text style={styles.hoursText}>
              {partner.businessHours.open} - {partner.businessHours.close}
            </Text>
          </View>
        )}
      </View>

      {/* View Details Arrow */}
      <View style={styles.arrowContainer}>
        <ChevronRight size={20} color="#FF9B42" />
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
    marginBottom: 12,
    padding: 12,
    shadowColor: '#FF9B42',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFF3E0',
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  logoContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    marginRight: 12,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF8E6',
  },
  placeholderLogo: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#FF9B42',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF8E6',
  },
  placeholderText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  businessName: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  openDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  openText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#059669',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9B42',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginLeft: 3,
  },
  newPartnerBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
  },
  newPartnerText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#6B7280',
  },
  reviewsText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginLeft: 5,
    flex: 1,
  },
  dietaryIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 2,
  },
  vegBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  vegDot: {
    width: 7,
    height: 7,
    borderRadius: 1,
    backgroundColor: '#10B981',
    marginRight: 3,
  },
  vegText: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    color: '#059669',
  },
  nonVegBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  nonVegDot: {
    width: 7,
    height: 7,
    borderRadius: 1,
    backgroundColor: '#EF4444',
    marginRight: 3,
  },
  nonVegText: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    color: '#DC2626',
  },
  veganBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  veganText: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    color: '#059669',
    marginLeft: 2,
  },
  jainBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  jainText: {
    fontSize: 9,
    fontFamily: 'Poppins-SemiBold',
    color: '#D97706',
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cuisineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  cuisineTag: {
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
    marginRight: 5,
    marginBottom: 3,
  },
  primaryCuisineTag: {
    backgroundColor: '#FF9B42',
  },
  cuisineText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF9B42',
  },
  primaryCuisineText: {
    color: '#FFF',
  },
  moreTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },
  moreText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#6B7280',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },
  hoursText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#059669',
    marginLeft: 4,
  },
  arrowContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
  },
});

