import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useMealStore } from '@/store/mealStore';
import { NoSubscriptionDashboard } from '@/components/NoSubscriptionDashboard';
import { ActiveSubscriptionDashboard } from '@/components/ActiveSubscriptionDashboard';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { todayMeals, fetchTodayMeals, isLoading } = useMealStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTodayMeals();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodayMeals();
    setRefreshing(false);
  };

  // Always show active subscription dashboard for now
  // Original condition: user?.subscriptionActive
  return (
    <View style={styles.container}>
      <ActiveSubscriptionDashboard 
        user={user} 
        todayMeals={todayMeals} 
        isLoading={isLoading} 
      />
    </View>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
});