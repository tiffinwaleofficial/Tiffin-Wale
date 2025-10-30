import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Utensils, Clock, Tag, TrendingDown } from 'lucide-react-native';
import { SubscriptionPlan, DurationType, MealFrequency } from '@/lib/api';
import { useRouter } from 'expo-router';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onPress?: () => void;
  variant?: 'default' | 'compact';
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onPress, variant = 'default' }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/pages/plan-detail?id=${plan._id}`);
    }
  };

  const formatDuration = () => {
    const typeMap: Record<DurationType, string> = {
      [DurationType.DAYS]: plan.durationValue === 1 ? 'Day' : 'Days',
      [DurationType.WEEKS]: plan.durationValue === 1 ? 'Week' : 'Weeks',
      [DurationType.MONTHS]: plan.durationValue === 1 ? 'Month' : 'Months',
    };
    return `${plan.durationValue} ${typeMap[plan.durationType]}`;
  };

  const formatFrequency = () => {
    const frequencyMap: Record<MealFrequency, string> = {
      [MealFrequency.DAILY]: 'Daily',
      [MealFrequency.WEEKDAYS]: 'Weekdays Only',
      [MealFrequency.WEEKENDS]: 'Weekends Only',
      [MealFrequency.CUSTOM]: 'Custom',
    };
    return frequencyMap[plan.mealFrequency];
  };

  const hasDiscount = plan.discountedPrice && plan.discountedPrice < plan.price;
  const discountPercentage = hasDiscount
    ? Math.round(((plan.price - plan.discountedPrice!) / plan.price) * 100)
    : 0;

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.compactContent}>
          <Text style={styles.compactName} numberOfLines={1}>{plan.name}</Text>
          <View style={styles.compactRow}>
            <Text style={styles.compactPrice}>
              ₹{hasDiscount ? plan.discountedPrice : plan.price}
            </Text>
            <Text style={styles.compactDuration}>/ {formatDuration()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Plan Image */}
      {plan.imageUrl && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: plan.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <TrendingDown size={12} color="#FFF" />
              <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
            </View>
          )}
        </View>
      )}

      {/* Plan Details */}
      <View style={styles.content}>
        {/* Plan Name */}
        <Text style={styles.planName} numberOfLines={2}>{plan.name}</Text>

        {/* Description */}
        {plan.description && (
          <Text style={styles.description} numberOfLines={2}>
            {plan.description}
          </Text>
        )}

        {/* Key Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Calendar size={16} color="#FF9F43" />
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{formatDuration()}</Text>
          </View>

          <View style={styles.infoItem}>
            <Clock size={16} color="#FF9F43" />
            <Text style={styles.infoLabel}>Frequency</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{formatFrequency()}</Text>
          </View>

          <View style={styles.infoItem}>
            <Utensils size={16} color="#FF9F43" />
            <Text style={styles.infoLabel}>Meals/Day</Text>
            <Text style={styles.infoValue}>{plan.mealsPerDay}</Text>
          </View>
        </View>

        {/* Features */}
        {plan.features && plan.features.length > 0 && (
          <View style={styles.featuresContainer}>
            {plan.features.slice(0, 2).map((feature, index) => (
              <View key={index} style={styles.featureTag}>
                <Tag size={10} color="#10B981" />
                <Text style={styles.featureText} numberOfLines={1}>{feature}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Meal Specification Preview */}
        {plan.mealSpecification && (
          <View style={styles.mealSpecRow}>
            {plan.mealSpecification.rotis && (
              <View style={styles.specTag}>
                <Text style={styles.specText}>{plan.mealSpecification.rotis} Rotis</Text>
              </View>
            )}
            {plan.mealSpecification.sabzis && plan.mealSpecification.sabzis.length > 0 && (
              <View style={styles.specTag}>
                <Text style={styles.specText}>{plan.mealSpecification.sabzis.length} Sabzi</Text>
              </View>
            )}
            {plan.mealSpecification.dal && (
              <View style={styles.specTag}>
                <Text style={styles.specText}>Dal</Text>
              </View>
            )}
            {plan.mealSpecification.rice && (
              <View style={styles.specTag}>
                <Text style={styles.specText}>Rice</Text>
              </View>
            )}
          </View>
        )}

        {/* Price Section */}
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            {hasDiscount && (
              <Text style={styles.originalPrice}>₹{plan.price}</Text>
            )}
            <Text style={styles.price}>
              ₹{hasDiscount ? plan.discountedPrice : plan.price}
            </Text>
            <Text style={styles.pricePeriod}>/ {formatDuration()}</Text>
          </View>
          {plan.deliveryFee && plan.deliveryFee > 0 && (
            <Text style={styles.deliveryFee}>+ ₹{plan.deliveryFee} delivery</Text>
          )}
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={handlePress}>
          <Text style={styles.ctaText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 4,
    maxWidth: 120,
  },
  mealSpecRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  specTag: {
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 6,
  },
  specText: {
    fontSize: 12,
    color: '#FF9F43',
    fontWeight: '600',
  },
  priceContainer: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF9F43',
  },
  pricePeriod: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  deliveryFee: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  ctaButton: {
    backgroundColor: '#FF9F43',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  // Compact variant styles
  compactCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  compactContent: {
    gap: 6,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  compactPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF9F43',
  },
  compactDuration: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
});

