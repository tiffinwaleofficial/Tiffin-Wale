import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { CustomerProfile } from '@/types/api';
import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/theme/types';

interface DashboardHeaderProps {
    user: CustomerProfile | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
    const { t } = useTranslation('common');
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    // Get dynamic greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return t('goodMorning');
        } else if (hour >= 12 && hour < 17) {
            return t('goodAfternoon');
        } else if (hour >= 17 && hour < 21) {
            return t('goodEvening');
        } else {
            return t('goodNight');
        }
    };

    // Format date
    const formatDate = () => {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>{getGreeting()}, {user?.firstName || user?.name || t('there')}</Text>
                <Text style={styles.date}>{formatDate()}</Text>
            </View>
            <TouchableOpacity style={styles.bellContainer}>
                <Bell size={20} color={theme.colors.text} />
            </TouchableOpacity>
        </View>
    );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontFamily: theme.typography.fontFamily.bold,
        fontSize: 24,
        color: theme.colors.text,
        marginBottom: 4,
    },
    date: {
        fontFamily: theme.typography.fontFamily.regular,
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    bellContainer: {
        width: 40,
        height: 40,
        backgroundColor: theme.colors.card,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
});
