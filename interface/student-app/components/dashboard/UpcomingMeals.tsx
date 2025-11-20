import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Utensils } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/theme/types';
import { Meal } from '@/types';
import { BaseCard } from '../ui/BaseCard';

interface UpcomingMealsProps {
    todayMeals: Meal[];
    onViewAll: () => void;
    onMealPress: (mealId: string, action?: 'extras' | 'rate') => void;
}

export const UpcomingMeals: React.FC<UpcomingMealsProps> = ({
    todayMeals,
    onViewAll,
    onMealPress,
}) => {
    const { t } = useTranslation('common');
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    // "Coming Up Next" should show only TODAY's meals that are yet to occur
    const getUpcomingMeals = () => {
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

        return sortedTodayUpcoming.slice(0, 5); // Show max 5 upcoming meals for today
    };

    const upcomingMealsList = getUpcomingMeals();

    const renderMealCard = (meal: Meal) => {
        const mealType = meal.mealType || meal.deliverySlot || 'lunch';
        const mealTitle = getMealTitle(meal, mealType);

        return (
            <BaseCard
                key={meal.id || meal.orderId}
                style={styles.mealCard}
                onPress={() => {
                    if (meal.orderId) {
                        onMealPress(meal.orderId);
                    }
                }}
                variant="elevated"
            >
                <View style={styles.mealCardHeader}>
                    <Text style={styles.mealTypeLabel}>
                        {meal.deliveryTimeRange || 'Scheduled'}
                    </Text>
                    <View style={[styles.statusBadge, getStatusBadgeStyle(meal.status, theme, styles)]}>
                        <Text style={[styles.statusBadgeText, getStatusTextStyle(meal.status, theme, styles)]}>
                            {meal.status ? meal.status.charAt(0).toUpperCase() + meal.status.slice(1).replace('_', ' ') : 'Scheduled'}
                        </Text>
                    </View>
                </View>

                <View style={styles.mealCardContent}>
                    <View style={styles.mealInfo}>
                        <Text style={styles.mealName}>{mealTitle}</Text>
                        <Text style={styles.vendorName}>{meal.partnerName || 'Your Plan'}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.addExtrasButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            if (meal.orderId) {
                                onMealPress(meal.orderId, 'extras');
                            }
                        }}
                    >
                        <Text style={styles.addExtrasText}>+ Extras</Text>
                    </TouchableOpacity>
                </View>
            </BaseCard>
        );
    };

    // Helper functions (duplicated from TodaysMeals, could be shared util but keeping self-contained for now)
    const getMealTitle = (meal: Meal, type: string) => {
        if (meal.items && meal.items.length > 0) {
            const mealItems = meal.items.filter((item: any) => item.mealId !== 'delivery-fee');
            const itemNames: string[] = [];
            mealItems.forEach((item: any) => {
                const name = getItemName(item);
                if (name && !itemNames.includes(name)) {
                    itemNames.push(name);
                }
            });
            return itemNames.length > 0
                ? itemNames.slice(0, 3).join(' • ') + (itemNames.length > 3 ? ' • ...' : '')
                : `${type.charAt(0).toUpperCase() + type.slice(1)} Meal`;
        }
        return `${type.charAt(0).toUpperCase() + type.slice(1)} Meal`;
    };

    const getItemName = (item: any) => {
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
        return itemName;
    };

    const getStatusBadgeStyle = (status: string | undefined, theme: Theme, styles: any) => {
        switch (status) {
            case 'delivered': return styles.statusBadgeDelivered;
            case 'preparing': return styles.statusBadgePreparing;
            case 'confirmed': return styles.statusBadgeConfirmed;
            case 'ready': return styles.statusBadgeReady;
            case 'pending': return styles.statusBadgePending;
            default: return {};
        }
    };

    const getStatusTextStyle = (status: string | undefined, theme: Theme, styles: any) => {
        switch (status) {
            case 'delivered': return styles.statusBadgeTextDelivered;
            case 'preparing': return styles.statusBadgeTextPreparing;
            case 'confirmed': return styles.statusBadgeTextConfirmed;
            case 'ready': return styles.statusBadgeTextReady;
            default: return {};
        }
    };

    return (
        <View style={styles.comingUpContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.comingUpTitle}>{t('comingUpNext')}</Text>
                <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
                    <Text style={styles.viewAllText}>{t('viewAll')}</Text>
                    <ChevronRight size={16} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            {upcomingMealsList.length > 0 ? (
                upcomingMealsList.map((meal) => renderMealCard(meal))
            ) : (
                <View style={styles.noUpcomingMealsContainer}>
                    <Utensils size={48} color="#CCCCCC" />
                    <Text style={styles.noUpcomingMealsTitle}>{t('noUpcomingMeals')}</Text>
                    <Text style={styles.noUpcomingMealsText}>{t('upcomingMealsWillAppearHere')}</Text>
                </View>
            )}
        </View>
    );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
    comingUpContainer: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    comingUpTitle: {
        fontFamily: theme.typography.fontFamily.bold,
        fontWeight: '700',
        fontSize: 18,
        color: theme.colors.text,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: 14,
        color: theme.colors.primary,
        marginRight: 4,
    },
    mealCard: {
        padding: 0,
        marginBottom: 16,
        overflow: 'hidden',
    },
    mealCardHeader: {
        backgroundColor: theme.colors.primaryLight + '40',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.primaryLight,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mealTypeLabel: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: 14,
        color: theme.colors.text,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: theme.colors.border,
    },
    statusBadgeText: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    statusBadgeDelivered: { backgroundColor: theme.colors.success + '20' },
    statusBadgePreparing: { backgroundColor: theme.colors.info + '20' },
    statusBadgeConfirmed: { backgroundColor: theme.colors.primary + '20' },
    statusBadgeReady: { backgroundColor: theme.colors.success + '20' },
    statusBadgePending: { backgroundColor: theme.colors.border },

    statusBadgeTextDelivered: { color: theme.colors.success },
    statusBadgeTextPreparing: { color: theme.colors.info },
    statusBadgeTextConfirmed: { color: theme.colors.primary },
    statusBadgeTextReady: { color: theme.colors.success },

    mealCardContent: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mealInfo: {
        flex: 1,
        marginRight: 12,
    },
    mealName: {
        fontFamily: theme.typography.fontFamily.semiBold,
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: 4,
    },
    vendorName: {
        fontFamily: theme.typography.fontFamily.regular,
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    addExtrasButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: theme.colors.primaryLight,
        borderRadius: 20,
    },
    addExtrasText: {
        fontSize: 12,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.primary,
    },
    noUpcomingMealsContainer: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: theme.colors.card,
        borderRadius: 16,
    },
    noUpcomingMealsTitle: {
        marginTop: 16,
        fontSize: 18,
        fontFamily: theme.typography.fontFamily.semiBold,
        color: theme.colors.text,
    },
    noUpcomingMealsText: {
        marginTop: 8,
        fontSize: 14,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});
