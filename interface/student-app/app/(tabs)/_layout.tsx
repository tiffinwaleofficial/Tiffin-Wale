import { Tabs } from 'expo-router';
import { Home, Receipt, Navigation, Package, UserCircle } from 'lucide-react-native';
import { ProtectedRoute } from '@/auth/AuthMiddleware';

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
            tabBarIcon: ({ color, size, focused }) => (
              <Home 
                size={focused ? size + 2 : size} 
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color, size, focused }) => (
              <Receipt 
                size={focused ? size + 2 : size} 
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="track"
          options={{
            title: 'Track',
            tabBarIcon: ({ color, size, focused }) => (
              <Navigation 
                size={focused ? size + 2 : size} 
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="plans"
          options={{
            title: 'Plans',
            tabBarIcon: ({ color, size, focused }) => (
              <Package 
                size={focused ? size + 2 : size} 
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <UserCircle 
                size={focused ? size + 2 : size} 
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
