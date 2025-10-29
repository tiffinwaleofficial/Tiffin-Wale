/**
 * Onboarding Route Component
 * Prevents authenticated users from accessing onboarding screens
 * Redirects authenticated users to dashboard
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { tokenManager } from '../../lib/auth/TokenManager';

interface OnboardingRouteProps {
  children: React.ReactNode;
}

/**
 * Onboarding Route Guard
 * Wraps onboarding routes and redirects authenticated users
 */
export function OnboardingRoute({ children }: OnboardingRouteProps) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    verifyAuthentication();
  }, [isInitialized, isAuthenticated]);

  const verifyAuthentication = async () => {
    try {
      if (!isInitialized) {
        setIsVerifying(true);
        return;
      }

      // Check with token manager
      const token = await tokenManager.getAccessToken();
      const userData = await tokenManager.getUserData();
      
      console.log('🎓 OnboardingRoute check:', { 
        isAuthenticated, 
        hasToken: !!token, 
        hasUserId: !!userData?.id 
      });

      // If user is fully authenticated, redirect to dashboard
      if (isAuthenticated && token && userData?.id) {
        console.log('✅ User is authenticated, redirecting from onboarding');
        setShouldRedirect(true);
      } else {
        setShouldRedirect(false);
      }
    } catch (error) {
      console.error('❌ Onboarding auth verification failed:', error);
      setShouldRedirect(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Show loading while verifying
  if (isVerifying || !isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF9F43" />
        <Text style={styles.loadingText}>Checking registration status...</Text>
      </View>
    );
  }

  // Redirect to dashboard if already authenticated
  if (shouldRedirect) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  // User is in onboarding flow, render content
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF6E9',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#999',
  },
});

export default OnboardingRoute;

