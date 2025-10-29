import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { LayoutDashboard as Dashboard, ClipboardList, BookText, ChartBar as BarChart3, Users, User } from 'lucide-react-native';

const tabs = [
  { name: 'dashboard', path: '/(tabs)/dashboard', title: 'Dashboard', Icon: Dashboard },
  { name: 'orders', path: '/(tabs)/orders', title: 'Orders', Icon: ClipboardList },
  { name: 'menu', path: '/(tabs)/menu', title: 'Menu', Icon: BookText },
  { name: 'earnings', path: '/(tabs)/earnings', title: 'Earnings', Icon: BarChart3 },
  { name: 'customers', path: '/(tabs)/customers', title: 'Customers', Icon: Users },
  { name: 'profile', path: '/(tabs)/profile', title: 'Profile', Icon: User },
];

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        // Check if current path matches or starts with the tab path
        const isActive = pathname === tab.path || pathname?.startsWith(tab.path);
        const { Icon } = tab;

        return (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tab,
              isActive && styles.tabActive,
            ]}
            onPress={() => router.push(tab.path as any)}
          >
            <View style={[
              styles.tabContent,
              isActive && styles.tabContentActive,
            ]}>
              <Icon
                size={24}
                color={isActive ? '#FF9F43' : '#999'}
                strokeWidth={isActive ? 2.5 : 2}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 12,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: '#FFF8E6',
    borderTopWidth: 2,
    borderTopColor: '#FF9F43',
    elevation: 2,
    shadowColor: '#FF9F43',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 10,
  },
  tabContentActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFE4B5',
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    marginTop: 4,
    color: '#999',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#FF9F43',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
  },
});