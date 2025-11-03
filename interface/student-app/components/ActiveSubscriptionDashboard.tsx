import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bell, ChevronRight, Clock, Coffee, Star, Calendar, ChevronDown, Utensils, Wallet, ThumbsUp } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { CustomerProfile } from '@/types/api';
import { Meal } from '@/types';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { MealDetailModal } from './MealDetailModal';

type ActiveSubscriptionDashboardProps = {
  user: CustomerProfile | null;
  todayMeals: Meal[];
  upcomingMeals?: Meal[];
  isLoading: boolean;
};

export const ActiveSubscriptionDashboard = ({ user, todayMeals, upcomingMeals = [], isLoading }: ActiveSubscriptionDashboardProps) => {
  const router = useRouter();
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<'extras' | 'rate' | undefined>(undefined);
  const { t } = useTranslation('common');
  const { currentSubscription } = useSubscriptionStore();
  
  // Use subscription from user profile if available, otherwise from subscription store
  const activeSubscription = (user as any)?.currentSubscription || currentSubscription;
  
  console.log('🔔 ActiveSubscriptionDashboard: User subscription:', (user as any)?.currentSubscription);
  console.log('🔔 ActiveSubscriptionDashboard: Store subscription:', currentSubscription);
  console.log('🔔 ActiveSubscriptionDashboard: Active subscription:', activeSubscription);
  
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
            <Text style={styles.greeting}>{t('goodMorning')}, {user?.firstName || user?.name || t('there')}</Text>
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
            <Text style={styles.statsNumber}>
              {activeSubscription ? 
                Math.max(0, Math.ceil((new Date(activeSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) 
                : '0'}
            </Text>
            <Text style={styles.statsLabel}>{t('daysLeft')}</Text>
          </View>
          <View style={styles.statsCard}>
            <View style={[styles.statsIconContainer, { backgroundColor: '#FFF5E8' }]}>
              <Utensils size={24} color="#FF9B42" />
            </View>
            <Text style={styles.statsNumber}>
              {activeSubscription ? 
                (activeSubscription.plan?.mealsPerDay || 1) * Math.max(0, Math.ceil((new Date(activeSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                : '0'}
            </Text>
            <Text style={styles.statsLabel}>{t('mealsLeft')}</Text>
          </View>
        </View>

        {/* Stats Cards - Second Row */}
        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <View style={[styles.statsIconContainer, { backgroundColor: '#E6F7EF' }]}>
              <Star size={24} color="#4CB944" />
            </View>
            <Text style={styles.statsNumber}>
              {(() => {
                // Calculate average rating from all orders/meals with ratings
                if (!activeSubscription) return '0.0';
                const allMeals = [...todayMeals, ...(upcomingMeals || [])];
                const ratedMeals = allMeals.filter(m => m.rating && m.rating > 0);
                if (ratedMeals.length === 0) {
                  // If no ratings yet, return default or check subscription plan average
                  return activeSubscription.plan?.averageRating?.toFixed(1) || '0.0';
                }
                const avgRating = ratedMeals.reduce((sum, m) => sum + (m.rating || 0), 0) / ratedMeals.length;
                return avgRating.toFixed(1);
              })()}
            </Text>
            <Text style={styles.statsLabel}>{t('rating')}</Text>
          </View>
          <View style={styles.statsCard}>
            <View style={[styles.statsIconContainer, { backgroundColor: '#F0EAFF' }]}>
              <Wallet size={24} color="#7C3AED" />
            </View>
            <Text style={styles.statsNumber}>
              ₹{(() => {
                // Calculate savings from discount
                if (!activeSubscription) return '0';
                const plan = activeSubscription.plan;
                if (!plan) return '0';
                
                // Calculate total discount from subscription
                const discountAmount = activeSubscription.discountAmount || 0;
                const discountedPrice = plan.discountedPrice || plan.price;
                const regularPrice = plan.price;
                const discountPerOrder = regularPrice - discountedPrice;
                
                // Calculate savings: discount per order * number of orders (days left * meals per day)
                const daysLeft = Math.max(0, Math.ceil((new Date(activeSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
                const mealsLeft = (plan.mealsPerDay || 1) * daysLeft;
                const totalSavings = discountAmount > 0 
                  ? discountAmount 
                  : discountPerOrder * mealsLeft;
                
                return Math.max(0, Math.round(totalSavings));
              })()}
            </Text>
            <Text style={styles.statsLabel}>{t('savings')}</Text>
          </View>
        </View>

        {/* Plan Information */}
        <View style={styles.planCard}>
          <View style={styles.planHeaderRow}>
            <Text style={styles.planTitle}>{t('yourPlan')}</Text>
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>{t('viewDetails')}</Text>
              <ChevronRight size={16} color="#FF9B42" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.planName}>
            {activeSubscription?.plan?.name || t('noActivePlan')}
          </Text>
          <Text style={styles.planDescription}>
            {activeSubscription?.plan?.description || t('noActiveSubscription')}
          </Text>
          
          {activeSubscription && (
            <>
              <View style={styles.planDetailRow}>
                <Utensils size={18} color="#4CB944" />
                <Text style={styles.planDetailText}>
                  {activeSubscription.plan?.mealsPerDay || 1} meal{(activeSubscription.plan?.mealsPerDay || 1) > 1 ? 's' : ''} per day
                </Text>
              </View>
              
              <View style={styles.planDetailRow}>
                <Clock size={18} color="#666666" />
                <Text style={styles.planDetailText}>
                  Valid until {new Date(activeSubscription.endDate).toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Today's Meals - Grouped by Meal Type */}
        <View style={styles.todaysMealsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('todaysMeals')}</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(tabs)/orders' as any)}
            >
              <Text style={styles.viewAllText}>{t('viewAll')}</Text>
              <ChevronRight size={16} color="#FF9B42" />
            </TouchableOpacity>
          </View>

          {todayMeals && todayMeals.length > 0 ? (
            (() => {
              // Deduplicate meals by orderId AND by mealType+deliveryDate+deliverySlot
              // This prevents showing the same order multiple times
              const uniqueMealsMap = new Map();
              todayMeals.forEach(meal => {
                const mealId = meal.orderId || meal.id;
                const mealType = (meal.mealType || meal.deliverySlot || 'lunch').toLowerCase();
                const deliveryKey = `${mealId}-${mealType}`;
                
                // Only add if we haven't seen this exact combination
                if (mealId && !uniqueMealsMap.has(deliveryKey)) {
                  uniqueMealsMap.set(deliveryKey, meal);
                }
              });
              const deduplicatedMeals = Array.from(uniqueMealsMap.values());
              
              console.log('🔍 Deduplication: Original meals:', todayMeals.length, 'Deduplicated:', deduplicatedMeals.length);

              // Group meals by mealType (breakfast, lunch, dinner)
              const groupedMeals = deduplicatedMeals.reduce((acc, meal) => {
                const mealType = meal.mealType || meal.deliverySlot || 'lunch';
                const typeKey = mealType.toLowerCase();
                if (!acc[typeKey]) acc[typeKey] = [];
                acc[typeKey].push(meal);
                return acc;
              }, {} as Record<string, typeof todayMeals>);

              // Define meal type order and labels
              const mealTypeOrder = ['breakfast', 'lunch', 'dinner'];
              const mealTypeLabels: Record<string, string> = {
                breakfast: '🌅 Breakfast',
                lunch: '🍽️ Lunch',
                dinner: '🌙 Dinner',
                morning: '🌅 Breakfast',
                afternoon: '🍽️ Lunch',
                evening: '🌙 Dinner',
              };

              return mealTypeOrder.map((type) => {
                const meals = groupedMeals[type] || [];
                if (meals.length === 0) return null;

                return (
                  <View key={type} style={styles.mealTypeGroup}>
                    <View style={styles.mealTypeGroupHeader}>
                      <Utensils size={18} color="#FF9B42" />
                      <Text style={styles.mealTypeGroupTitle}>
                        {mealTypeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </View>
                    {meals.map((meal: Meal, index: number) => (
                      <TouchableOpacity
                        key={meal.id || meal.orderId || index}
                style={styles.mealCard}
                        onPress={() => {
                          if (meal.orderId) {
                            setSelectedMealId(meal.orderId);
                            setSelectedAction(undefined);
                            setMealModalVisible(true);
                          }
                        }}
              >
                <View style={styles.mealCardHeader}>
                          <Text style={styles.mealTypeLabel}>
                            {meal.deliveryTimeRange || 'Scheduled'}
                          </Text>
                          <View style={[styles.statusBadge, 
                            meal.status === 'delivered' && styles.statusBadgeDelivered,
                            meal.status === 'preparing' && styles.statusBadgePreparing,
                            meal.status === 'confirmed' && styles.statusBadgeConfirmed,
                            meal.status === 'ready' && styles.statusBadgeReady,
                            meal.status === 'pending' && styles.statusBadgePending
                          ]}>
                            <Text style={[styles.statusBadgeText,
                              meal.status === 'delivered' && styles.statusBadgeTextDelivered,
                              meal.status === 'preparing' && styles.statusBadgeTextPreparing,
                              meal.status === 'confirmed' && styles.statusBadgeTextConfirmed,
                              meal.status === 'ready' && styles.statusBadgeTextReady,
                            ]}>
                              {meal.status ? meal.status.charAt(0).toUpperCase() + meal.status.slice(1).replace('_', ' ') : 'Scheduled'}
                            </Text>
                          </View>
                </View>
                <View style={styles.mealCardContent}>
                          <View style={styles.mealInfo}>
                            {(() => {
                              // Build meal title from items
                              if (meal.items && meal.items.length > 0) {
                                const mealItems = meal.items.filter((item: any) => item.mealId !== 'delivery-fee');
                                const itemNames: string[] = [];
                                mealItems.forEach((item: any) => {
                                  let itemName = '';
                                  if (item.specialInstructions) {
                                    const instructions = item.specialInstructions;
                                    if (instructions.includes('Roti')) itemName = `${item.quantity || 4} Rotis`;
                                    else if (instructions.includes('Allo')) itemName = 'Allo';
                                    else if (instructions.includes('Chawal')) itemName = 'Chawal';
                                    else if (instructions.includes('Dal')) itemName = 'Dal';
                                    else if (instructions.includes('Rice')) itemName = 'Rice';
                                    else if (instructions.includes('Salad')) itemName = 'Salad';
                                    else {
                                      const parts = instructions.split(' - ');
                                      itemName = parts[0].replace(/Subscription meal|breakfast|lunch|dinner|Delivery fee/gi, '').trim();
                                    }
                                  } else if (item.mealId) {
                                    if (item.mealId.includes('roti')) itemName = `${item.quantity || 4} Rotis`;
                                    else if (item.mealId.includes('sabzi') || item.mealId.includes('allo')) itemName = 'Sabzi';
                                    else if (item.mealId.includes('dal')) itemName = 'Dal';
                                    else if (item.mealId.includes('rice') || item.mealId.includes('chawal')) itemName = 'Rice';
                                    else if (item.mealId.includes('salad')) itemName = 'Salad';
                                  }
                                  if (itemName && !itemNames.includes(itemName)) {
                                    itemNames.push(itemName);
                                  }
                                });
                                const mealTitle = itemNames.length > 0 
                                  ? itemNames.slice(0, 3).join(' • ') + (itemNames.length > 3 ? ' • ...' : '')
                                  : `${type.charAt(0).toUpperCase() + type.slice(1)} Meal`;
                                return (
                                  <>
                                    <Text style={styles.mealName}>{mealTitle}</Text>
                                    <Text style={styles.vendorName}>{meal.partnerName || 'Your Plan'}</Text>
                                  </>
                                );
                              }
                              // Fallback to meal type
                              return (
                                <>
                                  <Text style={styles.mealName}>{type.charAt(0).toUpperCase() + type.slice(1)} Meal</Text>
                                  <Text style={styles.vendorName}>{meal.partnerName || 'Your Plan'}</Text>
                                </>
                              );
                            })()}
                            {meal.items && meal.items.length > 0 && (
                              <View style={styles.mealItemsContainer}>
                                {meal.items
                                  .filter((item: any) => item.mealId !== 'delivery-fee')
                                  .slice(0, 4)
                                  .map((item: any, itemIndex: number) => {
                                    let itemName = `${item.quantity || 1}x Item`;
                                    if (item.specialInstructions) {
                                      const instructions = item.specialInstructions;
                                      if (instructions.includes('Roti')) itemName = `${item.quantity || 4} Rotis`;
                                      else if (instructions.includes('Allo')) itemName = 'Allo';
                                      else if (instructions.includes('Chawal')) itemName = 'Chawal';
                                      else if (instructions.includes('Dal')) itemName = 'Dal';
                                      else if (instructions.includes('Rice')) itemName = 'Rice';
                                      else if (instructions.includes('Salad')) itemName = 'Salad';
                                      else {
                                        const parts = instructions.split(' - ');
                                        itemName = parts[0].replace(/Subscription meal|breakfast|lunch|dinner|Delivery fee/gi, '').trim() || itemName;
                                      }
                                    } else if (item.mealId) {
                                      if (item.mealId.includes('roti')) itemName = `${item.quantity || 4} Rotis`;
                                      else if (item.mealId.includes('sabzi')) itemName = 'Sabzi';
                                      else if (item.mealId.includes('dal')) itemName = 'Dal';
                                      else if (item.mealId.includes('rice')) itemName = 'Rice';
                                      else if (item.mealId.includes('salad')) itemName = 'Salad';
                                    }
                                    return (
                                      <View key={itemIndex} style={styles.mealItemTag}>
                                        <Text style={styles.mealItemText}>{itemName}</Text>
                                      </View>
                                    );
                                  })}
                                {meal.items.filter((item: any) => item.mealId !== 'delivery-fee').length > 4 && (
                                  <Text style={styles.mealItemMoreText}>
                                    +{meal.items.filter((item: any) => item.mealId !== 'delivery-fee').length - 4} more
                                  </Text>
                                )}
                              </View>
                            )}
                  </View>
                          {meal.rating ? (
                      <View style={styles.ratingContainer}>
                        <Star size={14} color="#FFB800" fill="#FFB800" />
                              <Text style={styles.ratingText}>{meal.rating}</Text>
                      </View>
                          ) : meal.status === 'delivered' ? (
                            <TouchableOpacity 
                              style={styles.rateButton}
                              onPress={(e) => {
                                e.stopPropagation();
                                if (meal.orderId || meal.id) {
                                  setSelectedMealId(meal.orderId || meal.id || null);
                                  setSelectedAction('rate');
                                  setMealModalVisible(true);
                                }
                              }}
                            >
                        <ThumbsUp size={14} color="#FF9B42" />
                        <Text style={styles.rateButtonText}>{t('rate')}</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity 
                              style={styles.addExtrasButton}
                              onPress={(e) => {
                                e.stopPropagation();
                                if (meal.orderId || meal.id) {
                                  setSelectedMealId(meal.orderId || meal.id || null);
                                  setSelectedAction('extras');
                                  setMealModalVisible(true);
                                }
                              }}
                            >
                              <Text style={styles.addExtrasText}>+ Add Extras</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              }).filter(Boolean);
            })()
          ) : isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FF9B42" />
              <Text style={styles.loadingText}>Loading meals...</Text>
                </View>
          ) : (
            <View style={styles.noMealsContainer}>
              <Utensils size={48} color="#CCCCCC" />
              <Text style={styles.noMealsTitle}>{t('noMealsScheduled')}</Text>
              <Text style={styles.noMealsText}>{t('mealsWillAppearHere')}</Text>
            </View>
          )}
        </View>

        {/* Coming Up Next */}
        <View style={styles.comingUpContainer}>
          <View style={styles.sectionHeader}>
          <Text style={styles.comingUpTitle}>{t('comingUpNext')}</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(tabs)/orders?tab=upcoming' as any)}
            >
              <Text style={styles.viewAllText}>{t('viewAll')}</Text>
              <ChevronRight size={16} color="#FF9B42" />
            </TouchableOpacity>
          </View>
          
          {(() => {
            // "Coming Up Next" should show only TODAY's meals that are yet to occur
            // Filter: today's date + scheduled time in the future + not delivered/cancelled
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const todayEnd = new Date(todayStart);
            todayEnd.setDate(todayEnd.getDate() + 1);
            
            // Get all today's meals (from todayMeals) that are still pending/preparing/confirmed
            const todayUpcomingMeals = todayMeals.filter((meal: Meal) => {
              // Must be for today
              const deliveryDate = meal.deliveryDate ? new Date(meal.deliveryDate) : null;
              const scheduledTime = meal.deliveryTime ? new Date(meal.deliveryTime) : null;
              
              // Check if it's today
              let isToday = false;
              if (deliveryDate) {
                const mealDate = new Date(deliveryDate.getFullYear(), deliveryDate.getMonth(), deliveryDate.getDate());
                isToday = mealDate >= todayStart && mealDate < todayEnd;
              } else if (scheduledTime) {
                const mealDate = new Date(scheduledTime.getFullYear(), scheduledTime.getMonth(), scheduledTime.getDate());
                isToday = mealDate >= todayStart && mealDate < todayEnd;
              }
              
              if (!isToday) return false;
              
              // Must be in the future (scheduled time hasn't passed yet)
              if (scheduledTime) {
                if (scheduledTime <= now) return false;
              }
              
              // Must be pending, preparing, confirmed, or ready (not delivered/cancelled)
              const status = (meal.status || '').toLowerCase();
              if (status === 'delivered' || status === 'cancelled') return false;
              
              return true;
            });
            
            // Sort by scheduled time and take only the next one(s) - limit to 3-5 upcoming meals for today
            const sortedTodayUpcoming = todayUpcomingMeals.sort((a, b) => {
              const timeA = a.deliveryTime ? new Date(a.deliveryTime).getTime() : 0;
              const timeB = b.deliveryTime ? new Date(b.deliveryTime).getTime() : 0;
              return timeA - timeB; // Earliest first
            });
            
            const filteredUpcoming = sortedTodayUpcoming.slice(0, 5); // Show max 5 upcoming meals for today
            
            return filteredUpcoming.length > 0 ? (
              filteredUpcoming.map((meal: Meal, index: number) => {
                const mealType = meal.mealType || meal.deliverySlot || 'lunch';
              
              return (
                <TouchableOpacity
                  key={meal.id || meal.orderId || index}
                  style={styles.mealCard}
                  onPress={() => {
                    if (meal.orderId) {
                      setSelectedMealId(meal.orderId);
                      setSelectedAction(undefined);
                      setMealModalVisible(true);
                    }
                  }}
                >
                <View style={styles.mealCardHeader}>
                  <Text style={styles.mealTypeLabel}>
                    {meal.deliveryTimeRange || 'Scheduled'}
                  </Text>
                  <View style={[styles.statusBadge, 
                    meal.status === 'delivered' && styles.statusBadgeDelivered,
                    meal.status === 'preparing' && styles.statusBadgePreparing,
                    meal.status === 'confirmed' && styles.statusBadgeConfirmed,
                    meal.status === 'ready' && styles.statusBadgeReady,
                    meal.status === 'pending' && styles.statusBadgePending
                  ]}>
                    <Text style={[styles.statusBadgeText,
                      meal.status === 'delivered' && styles.statusBadgeTextDelivered,
                      meal.status === 'preparing' && styles.statusBadgeTextPreparing,
                      meal.status === 'confirmed' && styles.statusBadgeTextConfirmed,
                      meal.status === 'ready' && styles.statusBadgeTextReady,
                    ]}>
                      {meal.status ? meal.status.charAt(0).toUpperCase() + meal.status.slice(1).replace('_', ' ') : 'Scheduled'}
                    </Text>
                  </View>
                </View>
                <View style={styles.mealCardContent}>
                    <View style={styles.mealInfo}>
                      {(() => {
                        // Build meal title from items
                        if (meal.items && meal.items.length > 0) {
                          const mealItems = meal.items.filter((item: any) => item.mealId !== 'delivery-fee');
                          const itemNames: string[] = [];
                          mealItems.forEach((item: any) => {
                            let itemName = '';
                            if (item.specialInstructions) {
                              const instructions = item.specialInstructions;
                              if (instructions.includes('Roti')) itemName = `${item.quantity || 4} Rotis`;
                              else if (instructions.includes('Allo')) itemName = 'Allo';
                              else if (instructions.includes('Chawal')) itemName = 'Chawal';
                              else if (instructions.includes('Dal')) itemName = 'Dal';
                              else if (instructions.includes('Rice')) itemName = 'Rice';
                              else if (instructions.includes('Salad')) itemName = 'Salad';
                              else {
                                const parts = instructions.split(' - ');
                                itemName = parts[0].replace(/Subscription meal|breakfast|lunch|dinner|Delivery fee/gi, '').trim();
                              }
                            } else if (item.mealId) {
                              if (item.mealId.includes('roti')) itemName = `${item.quantity || 4} Rotis`;
                              else if (item.mealId.includes('sabzi') || item.mealId.includes('allo')) itemName = 'Sabzi';
                              else if (item.mealId.includes('dal')) itemName = 'Dal';
                              else if (item.mealId.includes('rice') || item.mealId.includes('chawal')) itemName = 'Rice';
                              else if (item.mealId.includes('salad')) itemName = 'Salad';
                            }
                            if (itemName && !itemNames.includes(itemName)) {
                              itemNames.push(itemName);
                            }
                          });
                          const mealTitle = itemNames.length > 0 
                            ? itemNames.slice(0, 3).join(' • ') + (itemNames.length > 3 ? ' • ...' : '')
                            : `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Meal`;
                          return (
                            <>
                              <Text style={styles.mealName}>{mealTitle}</Text>
                              <Text style={styles.vendorName}>{meal.partnerName || 'Your Plan'}</Text>
                            </>
                          );
                        }
                        return (
                          <>
                            <Text style={styles.mealName}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)} Meal</Text>
                            <Text style={styles.vendorName}>{meal.partnerName || 'Your Plan'}</Text>
                          </>
                        );
                      })()}
                    </View>
                    <TouchableOpacity 
                      style={styles.addExtrasButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        if (meal.orderId) {
                          setSelectedMealId(meal.orderId);
                          setSelectedAction('extras');
                          setMealModalVisible(true);
                        }
                      }}
                    >
                      <Text style={styles.addExtrasText}>+ Extras</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
              })
          ) : (
            <View style={styles.noUpcomingMealsContainer}>
              <Utensils size={48} color="#CCCCCC" />
              <Text style={styles.noUpcomingMealsTitle}>{t('noUpcomingMeals')}</Text>
              <Text style={styles.noUpcomingMealsText}>{t('upcomingMealsWillAppearHere')}</Text>
            </View>
            );
          })()}
        </View>
      </View>
      
      {/* Meal Detail Modal */}
      <MealDetailModal
        visible={mealModalVisible}
        orderId={selectedMealId}
        action={selectedAction}
        onClose={() => {
          setMealModalVisible(false);
          setSelectedMealId(null);
          setSelectedAction(undefined);
        }}
        onOrderUpdated={() => {
          // Refresh meal data if needed
          // This will be handled by parent component's refresh logic
        }}
      />
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
    backgroundColor: '#FFF5E6',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5CC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealTypeLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#E65100',
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
  },
  mealTypeGroup: {
    marginBottom: 20,
  },
  mealTypeGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mealTypeGroupTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#E65100',
  },
  mealInfo: {
    flex: 1,
  },
  mealItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  mealItemTag: {
    backgroundColor: '#FFF8EE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5CC',
  },
  mealItemText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#FF6B00',
  },
  mealItemMoreText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#999999',
    alignSelf: 'center',
    marginLeft: 4,
  },
  mealTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  mealDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666666',
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 155, 66, 0.13)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusBadgeDelivered: {
    backgroundColor: 'rgba(76, 185, 68, 0.13)',
  },
  statusBadgePreparing: {
    backgroundColor: 'rgba(30, 136, 229, 0.13)',
  },
  statusBadgePending: {
    backgroundColor: 'rgba(255, 155, 66, 0.13)',
  },
  statusBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#FF9B42',
  },
  statusBadgeTextDelivered: {
    color: '#4CB944',
  },
  statusBadgeTextPreparing: {
    color: '#1E88E5',
  },
  statusBadgeTextConfirmed: {
    color: '#7C3AED',
  },
  statusBadgeTextReady: {
    color: '#10B981',
  },
  statusBadgeConfirmed: {
    backgroundColor: 'rgba(124, 58, 237, 0.13)',
  },
  statusBadgeReady: {
    backgroundColor: 'rgba(16, 185, 129, 0.13)',
  },
  addExtrasButton: {
    backgroundColor: '#FFF8EE',
    borderColor: '#FF9B42',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  addExtrasText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FF9B42',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  noMealsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noMealsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noMealsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  noUpcomingMealsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  noUpcomingMealsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  noUpcomingMealsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
}); 