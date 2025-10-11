import { Redirect } from 'expo-router';
import { useAuthContext } from '@/context/AuthProvider';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { RouteGuard } from '@/components/RouteGuard';

export default function Root() {
  const { isAuthenticated, isInitialized, isLoading } = useAuthContext();
  
  // Show loading while authentication is being initialized
  if (!isInitialized || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9B42" />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }
  
  return (
    <RouteGuard requireAuth={false}>
      {/* Redirect to proper location based on auth state */}
      {isAuthenticated ? (
        <Redirect href="/(tabs)" />
      ) : (
        <Redirect href="/(auth)/login" />
      )}
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#666666',
  },
}); 