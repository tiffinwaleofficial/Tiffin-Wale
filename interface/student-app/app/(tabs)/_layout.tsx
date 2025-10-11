import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Home, ClipboardList, MapPin, User, CreditCard } from 'lucide-react-native';
import { ProtectedRoute } from '@/components/RouteGuard';

export default function TabLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FF9B42',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: {
            display: 'flex',
            backgroundColor: '#FFFFFF',
            height: 64,
            paddingBottom: 4,
            paddingTop: 4,
            borderTopWidth: 1,
            borderTopColor: '#EEEEEE',
          },
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontFamily: 'Poppins-Medium',
            fontSize: 12,
            marginBottom: 4,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color, size }) => (
              <ClipboardList size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="track"
          options={{
            title: 'Track',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.trackIconContainer}>
                <MapPin size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="plans"
          options={{
            title: 'Plans',
            tabBarIcon: ({ color, size }) => (
              <CreditCard size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  trackIconContainer: {
    top: -2,
  },
});