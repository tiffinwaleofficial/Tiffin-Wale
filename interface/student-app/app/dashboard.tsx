import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useMealStore } from '@/store/mealStore';
import { ActiveSubscriptionDashboard } from '@/components/ActiveSubscriptionDashboard';
import { Home, ClipboardList, MapPin, User, CreditCard } from 'lucide-react-native';
import { TouchableOpacity, Text } from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();
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

  const navigateTo = (route: any) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <ActiveSubscriptionDashboard 
        user={user} 
        todayMeals={todayMeals} 
        isLoading={isLoading} 
      />
      
      {/* Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigateTo('/dashboard')}
        >
          <Home size={24} color="#FF9B42" />
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigateTo('/(tabs)/orders')}
        >
          <ClipboardList size={24} color="#999999" />
          <Text style={styles.tabLabel}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigateTo('/(tabs)/track')}
        >
          <MapPin size={24} color="#999999" />
          <Text style={styles.tabLabel}>Track</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigateTo('/(tabs)/plans')}
        >
          <CreditCard size={24} color="#999999" />
          <Text style={styles.tabLabel}>Plans</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigateTo('/(tabs)/profile')}
        >
          <User size={24} color="#999999" />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 64,
    paddingBottom: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginTop: 4,
    color: '#999999',
  },
  activeTabLabel: {
    color: '#FF9B42',
  }
}); 