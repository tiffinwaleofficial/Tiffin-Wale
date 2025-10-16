import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Clock as ClockIcon, Star, ThumbsUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Meal } from '@/types';
import { formatMealStatusText, getMealStatusColor } from '@/utils/mealUtils';

interface MealCardProps {
  meal: Meal;
  delay?: number;
}

export function MealCard({ meal, delay = 0 }: MealCardProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const menuItem = meal.menu.length > 0 ? meal.menu[0] : null;
  
  const statusColor = getMealStatusColor(meal.status);
  const statusText = formatMealStatusText(meal.status);
  
  const handleTrackPress = () => {
    router.push({
      pathname: '/track',
      params: { id: meal.id }
    });
  };
  
  const handleRatePress = () => {
    // Navigate to profile page for now since rate page was removed
    router.push("/(tabs)");
    // Show a notification to user that rating functionality is coming soon
    console.log('Rating functionality is coming soon!');
  };
  
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.card}>
      <View style={styles.typeContainer}>
        <Text style={styles.typeText}>
          {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
        </Text>
      </View>
      
      {menuItem ? (
        <View style={styles.mealContent}>
          <Image 
            source={{ uri: menuItem.image }} 
            style={styles.mealImage} 
          />
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{menuItem.name}</Text>
            <Text style={styles.restaurantName}>{meal.restaurantName}</Text>
            
            <View style={styles.mealDetails}>
              <View style={styles.ratingContainer}>
                <Star size={14} color="#FFB800" fill="#FFB800" />
                <Text style={styles.ratingText}>{menuItem.rating}</Text>
              </View>
              
              <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              {meal.status === 'delivered' && (
                <TouchableOpacity 
                  style={styles.rateButton}
                  onPress={handleRatePress}
                >
                  <ThumbsUp size={14} color="#FF9B42" />
                  <Text style={styles.rateButtonText}>{t('rate')}</Text>
                </TouchableOpacity>
              )}
              {(meal.status === 'preparing' || meal.status === 'ready') && (
                <TouchableOpacity 
                  style={styles.trackButton}
                  onPress={handleTrackPress}
                >
                  <ClockIcon size={14} color="#FFFFFF" />
                  <Text style={styles.trackButtonText}>{t('track')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyMealContent}>
          <Text style={styles.emptyMealText}>{t('noMenuInfo')}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeContainer: {
    backgroundColor: '#FFF8EE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE8CC',
  },
  typeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FF9B42',
  },
  mealContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    resizeMode: 'cover',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  restaurantName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  mealDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF8EE',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFE8CC',
  },
  rateButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FF9B42',
    marginLeft: 4,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FF9B42',
    borderRadius: 4,
  },
  trackButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  emptyMealContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMealText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#999999',
  },
});