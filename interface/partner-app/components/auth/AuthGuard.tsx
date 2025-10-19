import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, AlertCircle } from 'lucide-react-native';
import { useAuthContext } from '../../context/AuthProvider';
import { useRouter } from 'expo-router';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * AuthGuard Component
 * 
 * A flexible authentication guard that can be used to protect specific components
 * or sections of the app. Provides customizable fallback UI and redirect options.
 * 
 * Features:
 * - Component-level authentication protection
 * - Customizable fallback UI
 * - Optional redirect functionality
 * - Loading state handling
 * - Error state display
 */
export default function AuthGuard({ 
  children, 
  fallback, 
  requireAuth = true,
  redirectTo = '/(auth)/phone-input'
}: AuthGuardProps) {
  const { isAuthenticated, isInitialized, isLoading, error } = useAuthContext();
  const router = useRouter();

  const handleRedirect = () => {
    router.push(redirectTo as any);
  };

  // Show loading state
  if (!isInitialized || isLoading) {
    return fallback || (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Shield size={48} color="#FF9F43" />
        </View>
        <Text style={styles.title}>Checking Authentication</Text>
        <Text style={styles.subtitle}>Please wait...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return fallback || (
      <View style={styles.container}>
        <View style={[styles.iconContainer, styles.errorIcon]}>
          <AlertCircle size={48} color="#FF4444" />
        </View>
        <Text style={styles.title}>Authentication Error</Text>
        <Text style={styles.subtitle}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRedirect}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Shield size={48} color="#FF9F43" />
        </View>
        <Text style={styles.title}>Authentication Required</Text>
        <Text style={styles.subtitle}>
          You need to be logged in to access this content
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleRedirect}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If authentication is not required or user is authenticated, show children
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>;
  }

  // Default fallback
  return fallback || null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF6E9',
    padding: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorIcon: {
    backgroundColor: '#FFE5E5',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: '#FF9F43',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    minWidth: 120,
  },
  loginButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    minWidth: 120,
  },
  retryButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
