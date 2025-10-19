import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuthContext } from '../../context/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * Ensures that only authenticated users can access protected routes.
 * Automatically redirects unauthenticated users to the login screen.
 * 
 * Features:
 * - Automatic route protection based on authentication state
 * - Loading state handling during auth initialization
 * - Seamless navigation between protected and public routes
 * - Integration with Expo Router for navigation
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized, isLoading } = useAuthContext();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isInitialized) {
      // Still initializing auth state
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboardingGroup = segments[0] === 'onboarding';

    if (__DEV__) {
      console.log('🔒 ProtectedRoute: Auth state check', {
        isAuthenticated,
        isInitialized,
        isLoading,
        segments,
        inAuthGroup,
        inTabsGroup,
        inOnboardingGroup,
      });
    }

    if (!isAuthenticated) {
      // User is not authenticated
      if (inTabsGroup || inOnboardingGroup) {
        // Redirect to phone input if trying to access protected routes
        if (__DEV__) console.log('🔒 ProtectedRoute: Redirecting unauthenticated user to phone-input');
        router.replace('/(auth)/phone-input');
      }
      // If already in auth group, stay there
    } else {
      // User is authenticated
      if (inAuthGroup) {
        // Redirect to dashboard if trying to access auth routes while authenticated
        if (__DEV__) console.log('🔒 ProtectedRoute: Redirecting authenticated user to dashboard');
        router.replace('/(tabs)/dashboard');
      }
      // If already in protected routes, stay there
    }
  }, [isAuthenticated, isInitialized, segments, router]);

  // Show loading screen while initializing
  if (!isInitialized || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9F43" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF6E9',
  },
});
