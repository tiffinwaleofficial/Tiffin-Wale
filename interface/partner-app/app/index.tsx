import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuthContext } from '@/lib/auth/AuthProvider';
import { tokenManager } from '@/lib/auth/TokenManager';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, initialize } = useAuthContext();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      setIsChecking(true);
      
      // Wait for auth to initialize
      await initialize();
      
      // Double-check token exists
      const token = await tokenManager.getAccessToken();
      const userData = await tokenManager.getUserData();
      
      console.log('🔐 Auth check:', { token: !!token, userId: !!userData?.id, isAuthenticated });
      
      if (token && userData?.id && isAuthenticated) {
        console.log('✅ User is authenticated, redirecting to dashboard');
        router.replace('/(tabs)/dashboard');
      } else {
        console.log('❌ User is not authenticated, redirecting to login');
        router.replace('/(auth)/phone-input');
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      router.replace('/(auth)/phone-input');
    } finally {
      setIsChecking(false);
    }
  };

  // Show loading screen while checking authentication
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF9B42" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
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
