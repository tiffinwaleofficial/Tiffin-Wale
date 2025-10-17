import { Redirect } from 'expo-router';
import { useAuth } from '@/auth/AuthProvider';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function Root() {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
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
  
  // Redirect to proper location based on auth state
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(onboarding)/welcome" />;
  }
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