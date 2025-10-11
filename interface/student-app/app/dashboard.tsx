import { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useMealStore } from '@/store/mealStore';
import { ActiveSubscriptionDashboard } from '@/components/ActiveSubscriptionDashboard';
import { Home, ClipboardList, MapPin, User, CreditCard } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { ProtectedRoute } from '@/components/RouteGuard';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { todayMeals, fetchTodayMeals, isLoading: mealsLoading } = useMealStore();

  useEffect(() => {
    // Fetch today's meals on mount
    fetchTodayMeals();
    
    // Fetch user subscriptions to update status
    const fetchSubscriptions = async () => {
      try {
        const { useSubscriptionStore } = await import('@/store/subscriptionStore');
        const { fetchUserSubscriptions } = useSubscriptionStore.getState();
        await fetchUserSubscriptions();
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };
    
    fetchSubscriptions();
  }, []);

  const navigateTo = (route: string) => {
    console.log('🔍 Dashboard navigateTo called with route:', route);
    console.log('📱 Router state:', router);
    console.log('👤 Current user:', { id: user?.id, email: user?.email });
    
    try {
      console.log('🚀 Attempting router.push...');
      router.push(route as any);
      console.log('✅ router.push completed successfully');
    } catch (error) {
      console.error('❌ Navigation error in navigateTo:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <ActiveSubscriptionDashboard 
          user={user} 
          todayMeals={todayMeals} 
          isLoading={mealsLoading} 
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
            onPress={() => {
              console.log('🔍 Profile tab clicked from dashboard');
              console.log('📍 Current route: dashboard');
              console.log('🎯 Navigating to: /(tabs)/profile');
              console.log('👤 User state:', { 
                id: user?.id, 
                email: user?.email, 
                firstName: user?.firstName 
              });
              console.log('📱 Router object:', router);
              
              try {
                navigateTo('/(tabs)/profile');
                console.log('✅ Navigation call completed');
              } catch (error) {
                console.error('❌ Navigation error:', error);
              }
            }}
          >
            <User size={24} color="#999999" />
            <Text style={styles.tabLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#999999',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#FF9B42',
  },
}); 