import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Chrome as Home, ClipboardList, ChartBar as BarChart3, Bell, User } from 'lucide-react-native';

const tabs = [
  { name: 'dashboard', path: '/(tabs)/dashboard', title: 'Dashboard', Icon: Home },
  { name: 'orders', path: '/(tabs)/orders', title: 'Orders', Icon: ClipboardList },
  { name: 'earnings', path: '/(tabs)/earnings', title: 'Earnings', Icon: BarChart3 },
  { name: 'notifications', path: '/(tabs)/notifications', title: 'Alerts', Icon: Bell },
  { name: 'profile', path: '/(tabs)/profile', title: 'Profile', Icon: User },
];

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        const { Icon } = tab;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.path)}
          >
            <View style={styles.tabContent}>
              <Icon
                size={24}
                color={isActive ? '#FF9F43' : '#999'}
                strokeWidth={2}
              />
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                ]}
                numberOfLines={1}
              >
                {tab.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: Platform.OS === 'web' ? 0 : 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    minWidth: 64,
    maxWidth: 100,
    paddingHorizontal: 4,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginTop: 4,
    color: '#999',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#FF9F43',
  },
});