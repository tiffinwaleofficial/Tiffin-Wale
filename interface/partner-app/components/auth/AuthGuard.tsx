/**
 * Auth Guard Component
 * Protects authenticated routes - redirects to login if not authenticated
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Auth Guard
 * Wraps authenticated routes and ensures user is logged in
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized } = useAuthStore();

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF9F43" />
      </View>
    );
  }

  // Redirect to phone input if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/phone-input" />;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF6E9',
  },
});

export default AuthGuard;
