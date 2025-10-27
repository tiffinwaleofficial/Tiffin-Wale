/**
 * Tabs Layout
 * Wraps authenticated tab screens with AuthGuard
 * Ensures only authenticated users can access
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import CustomTabBar from '../../components/CustomTabBar';
import { AuthGuard } from '../../components/auth/AuthGuard';

export default function TabLayout() {
  return (
    <AuthGuard>
      <View style={styles.container}>
        <View style={styles.content}>
          <Slot />
        </View>
        <CustomTabBar />
      </View>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF6E9',
  },
  content: {
    flex: 1,
  },
});
