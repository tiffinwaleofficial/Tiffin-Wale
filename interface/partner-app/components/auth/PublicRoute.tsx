/**
 * Public Route Component
 * Prevents authenticated users from accessing auth screens
 * Redirects authenticated users to dashboard
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { tokenManager } from '../../lib/auth/TokenManager';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Public Route Guard
 * Wraps public/auth routes and redirects authenticated users
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter();
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

      // Double-check with token manager
      const token = await tokenManager.getAccessToken();
      const userData = await tokenManager.getUserData();
      
      console.log('🔒 PublicRoute check:', { 
        isAuthenticated, 
        hasToken: !!token, 
        hasUserId: !!userData?.id 
      });

      if (isAuthenticated && token && userData?.id) {
        console.log('✅ User is authenticated, redirecting from auth screen');
        setShouldRedirect(true);
      } else {
        console.log('👤 User is not authenticated, showing auth screen');
        setShouldRedirect(false);
      }
    } catch (error) {
      console.error('❌ Auth verification failed:', error);
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
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  // Redirect to dashboard if already authenticated
  if (shouldRedirect) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  // User is not authenticated, render auth content
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

export default PublicRoute;

