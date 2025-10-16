// Initialize i18n before any other imports
import '@/i18n/config';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/context/AuthProvider';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NotificationContainer from '@/components/NotificationContainer';
import { nativeWebSocketService } from '@/services/nativeWebSocketService';
import KeyboardAvoidingWrapper from '@/components/KeyboardAvoidingWrapper';

// Import Vercel Analytics for web builds only
let Analytics: any = null;
let SpeedInsights: any = null;

if (Platform.OS === 'web') {
  try {
    Analytics = require('@vercel/analytics/react').Analytics;
    SpeedInsights = require('@vercel/speed-insights/react').SpeedInsights;
  } catch (error) {
    console.log('Vercel Analytics not available for this platform');
  }
}

SplashScreen.preventAutoHideAsync();

// Custom theme for your TiffinWale app
const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF9B42',
    background: '#FFFAF0',
    card: '#FFFFFF',
    text: '#333333',
    border: '#EEEEEE',
    notification: '#FF9B42',
  },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      
      // Initialize native WebSocket service
      nativeWebSocketService.initialize().catch((error) => {
        console.warn('⚠️ Native WebSocket initialization failed:', error);
      });
    }
  }, [fontsLoaded, fontError]);

  // Show loading screen while fonts are loading
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9B42" />
        <Text style={styles.loadingText}>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={customTheme}>
        <AuthProvider>
          <NotificationContainer>
            <KeyboardAvoidingWrapper>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: '#FFFAF0' },
                }}
              >
                {/* File-based routes are automatically discovered */}
              </Stack>
            </KeyboardAvoidingWrapper>
          </NotificationContainer>
          <StatusBar style="dark" />
          {/* Vercel Analytics - Web only */}
          {Platform.OS === 'web' && Analytics && <Analytics />}
          {Platform.OS === 'web' && SpeedInsights && <SpeedInsights />}
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
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