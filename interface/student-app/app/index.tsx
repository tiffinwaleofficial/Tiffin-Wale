import { Redirect } from 'expo-router';
import { useAuthContext } from '@/context/AuthProvider';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { RouteGuard } from '@/components/RouteGuard';
import { useTranslation } from 'react-i18next';

export default function Root() {
  const { isAuthenticated, isInitialized, isLoading } = useAuthContext();
  const { t } = useTranslation('common');
  
  // Show loading while authentication is being initialized
  if (!isInitialized || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9B42" />
        <Text style={styles.loadingText}>{t('initializing')}</Text>
      </View>
    );
  }
  
  return (
    <RouteGuard requireAuth={false}>
      {/* Redirect to proper location based on auth state */}
      {isAuthenticated ? (
        <Redirect href="/(tabs)" />
      ) : (
        <Redirect href="/(onboarding)/welcome" />
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