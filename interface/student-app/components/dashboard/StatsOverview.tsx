import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Utensils, Star, Wallet } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/theme/types';
import { Meal } from '@/types';
import { CustomerSubscription } from '@/types/api';

interface StatsOverviewProps {
    activeSubscription: CustomerSubscription | undefined;
    todayMeals: Meal[];
    upcomingMeals?: Meal[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
    activeSubscription,
    todayMeals,
    upcomingMeals = [],
}) => {
    const { t } = useTranslation('common');
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    const calculateDaysLeft = () => {
        if (!activeSubscription) return '0';
        return Math.max(0, Math.ceil((new Date(activeSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))).toString();
    };

    const calculateMealsLeft = () => {
        if (!activeSubscription) return '0';
        const daysLeft = Math.max(0, Math.ceil((new Date(activeSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
        return ((activeSubscription.plan?.mealsPerDay || 1) * daysLeft).toString();
    };

    const calculateRating = () => {
        if (!activeSubscription) return '0.0';
        const allMeals = [...todayMeals, ...(upcomingMeals || [])];
        const ratedMeals = allMeals.filter(m => m.rating && m.rating > 0);
        if (ratedMeals.length === 0) {
            return activeSubscription.plan?.averageRating?.toFixed(1) || '0.0';
        }
        const avgRating = ratedMeals.reduce((sum, m) => sum + (m.rating || 0), 0) / ratedMeals.length;
        return avgRating.toFixed(1);
    };

    const calculateSavings = () => {
        if (!activeSubscription) return '0';
        const plan = activeSubscription.plan;
        if (!plan) return '0';

        const discountAmount = activeSubscription.discountAmount || 0;
        const discountedPrice = plan.discountedPrice || plan.price;
        const regularPrice = plan.price;
        const discountPerOrder = regularPrice - discountedPrice;

        const daysLeft = Math.max(0, Math.ceil((new Date(activeSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
        const mealsLeft = (plan.mealsPerDay || 1) * daysLeft;
        const totalSavings = discountAmount > 0
            ? discountAmount
            : discountPerOrder * mealsLeft;

        return Math.max(0, Math.round(totalSavings)).toString();
    };

    return (
        <View>
            {/* Stats Cards - First Row */}
            <View style={styles.statsRow}>
                <View style={styles.statsCard}>
                    <View style={styles.statsIconContainer}>
                        <Calendar size={24} color="#3B82F6" />
                    </View>
                    <Text style={styles.statsNumber}>{calculateDaysLeft()}</Text>
                    <Text style={styles.statsLabel}>{t('daysLeft')}</Text>
                </View>
                <View style={styles.statsCard}>
                    <View style={[styles.statsIconContainer, { backgroundColor: '#FFF5E8' }]}>
                        <Utensils size={24} color="#FF9B42" />
                    </View>
                    <Text style={styles.statsNumber}>{calculateMealsLeft()}</Text>
                    <Text style={styles.statsLabel}>{t('mealsLeft')}</Text>
                </View>
            </View>

            {/* Stats Cards - Second Row */}
            <View style={styles.statsRow}>
                <View style={styles.statsCard}>
                    <View style={[styles.statsIconContainer, { backgroundColor: '#E6F7EF' }]}>
                        <Star size={24} color="#4CB944" />
                    </View>
                    <Text style={styles.statsNumber}>{calculateRating()}</Text>
                    <Text style={styles.statsLabel}>{t('rating')}</Text>
                </View>
                <View style={styles.statsCard}>
                    <View style={[styles.statsIconContainer, { backgroundColor: '#F0EAFF' }]}>
                        <Wallet size={24} color="#7C3AED" />
                    </View>
                    <Text style={styles.statsNumber}>₹{calculateSavings()}</Text>
                    <Text style={styles.statsLabel}>{t('savings')}</Text>
                </View>
            </View>
        </View>
    );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statsCard: {
        flex: 1,
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: theme.colors.shadowColor,
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
        backgroundColor: '#EBF5FF', // Default for first card
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statsNumber: {
        fontFamily: theme.typography.fontFamily.semiBold,
        fontSize: 24,
        color: theme.colors.text,
        marginBottom: 4,
    },
    statsLabel: {
        fontFamily: theme.typography.fontFamily.regular,
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
});
