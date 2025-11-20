import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Utensils, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/theme/types';
import { CustomerSubscription } from '@/types/api';
import { BaseCard } from '../ui/BaseCard';

interface PlanOverviewCardProps {
    activeSubscription: CustomerSubscription | undefined;
    onViewDetails?: () => void;
}

export const PlanOverviewCard: React.FC<PlanOverviewCardProps> = ({
    activeSubscription,
    onViewDetails,
}) => {
    const { t } = useTranslation('common');
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    return (
        <BaseCard style={styles.planCard} variant="elevated">
            <View style={styles.planHeaderRow}>
                <Text style={styles.planTitle}>{t('yourPlan')}</Text>
                <TouchableOpacity style={styles.viewDetailsButton} onPress={onViewDetails}>
                    <Text style={styles.viewDetailsText}>{t('viewDetails')}</Text>
                    <ChevronRight size={16} color={theme.colors.primary} />
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
                        <Utensils size={18} color={theme.colors.success} />
                        <Text style={styles.planDetailText}>
                            {activeSubscription.plan?.mealsPerDay || 1} meal{(activeSubscription.plan?.mealsPerDay || 1) > 1 ? 's' : ''} per day
                        </Text>
                    </View>

                    <View style={styles.planDetailRow}>
                        <Clock size={18} color={theme.colors.textSecondary} />
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
        </BaseCard>
    );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
    planCard: {
        marginVertical: theme.spacing.m,
        padding: theme.spacing.l,
    },
    planHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    planTitle: {
        fontFamily: theme.typography.fontFamily.bold,
        fontWeight: '700',
        fontSize: 18,
        color: theme.colors.text,
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewDetailsText: {
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: 14,
        color: theme.colors.primary,
        marginRight: 4,
    },
    planName: {
        fontFamily: theme.typography.fontFamily.semiBold,
        fontSize: 22,
        color: theme.colors.text,
        marginBottom: 4,
    },
    planDescription: {
        fontFamily: theme.typography.fontFamily.regular,
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.m,
    },
    planDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    planDetailText: {
        fontFamily: theme.typography.fontFamily.regular,
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginLeft: 8,
    },
});
