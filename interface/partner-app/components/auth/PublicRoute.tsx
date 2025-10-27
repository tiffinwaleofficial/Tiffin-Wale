/**
 * Public Route Component
 * Prevents authenticated users from accessing auth screens
 * Redirects authenticated users to dashboard
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Public Route Guard
 * Wraps public/auth routes and redirects authenticated users
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isInitialized } = useAuthStore();

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF9F43" />
      </View>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  // User is not authenticated, render public content
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

export default PublicRoute;

