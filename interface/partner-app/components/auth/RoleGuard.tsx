import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserCheck, AlertTriangle } from 'lucide-react-native';
import { useAuthContext } from '../../lib/auth/AuthProvider';
import { useRouter } from 'expo-router';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * RoleGuard Component
 * 
 * Protects components based on user roles. Only users with specified roles
 * can access the protected content.
 * 
 * Features:
 * - Role-based access control
 * - Multiple role support
 * - Customizable fallback UI
 * - Automatic redirect options
 * - Integration with authentication context
 */
export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback,
  redirectTo = '/(tabs)/dashboard'
}: RoleGuardProps) {
  const { isAuthenticated, user, isInitialized } = useAuthContext();
  const router = useRouter();

  const handleRedirect = () => {
    router.push(redirectTo as any);
  };

  // Wait for auth initialization
  if (!isInitialized) {
    return null;
  }

  // User must be authenticated first
  if (!isAuthenticated || !user) {
    return fallback || (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <UserCheck size={48} color="#FF9F43" />
        </View>
        <Text style={styles.title}>Authentication Required</Text>
        <Text style={styles.subtitle}>
          Please log in to access this content
        </Text>
      </View>
    );
  }

  // Check if user has required role
  const userRole = user.role;
  const hasRequiredRole = allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    return fallback || (
      <View style={styles.container}>
        <View style={[styles.iconContainer, styles.warningIcon]}>
          <AlertTriangle size={48} color="#FF9F43" />
        </View>
        <Text style={styles.title}>Access Restricted</Text>
        <Text style={styles.subtitle}>
          You don't have permission to access this content.{'\n'}
          Required role: {allowedRoles.join(' or ')}{'\n'}
          Your role: {userRole}
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={handleRedirect}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // User has required role, show protected content
  return <>{children}</>;
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
  warningIcon: {
    backgroundColor: '#FFF9E5',
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
  backButton: {
    backgroundColor: '#FF9F43',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    minWidth: 120,
  },
  backButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
