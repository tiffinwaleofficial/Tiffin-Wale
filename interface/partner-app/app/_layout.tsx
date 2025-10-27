import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../lib/auth/AuthProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NotificationContainer from '@/components/NotificationContainer';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeLoader } from '../components/ThemeLoader';
import { useTheme } from '../store/themeStore';

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

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Custom theme for your TiffinWale Partner app
// const customTheme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#FF9B42',
//     background: '#FFFAF0',
//     card: '#FFFFFF',
//     text: '#333333',
//     border: '#EEEEEE',
//     notification: '#FF9B42',
//   },
// };

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });
  const { hasHydrated } = useTheme();

  useEffect(() => {
    // Hide splash screen when fonts are loaded
    // Theme is always available immediately from themes.ts
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Only wait for fonts, not theme hydration
  // Theme is always available from themes.ts, hydration just loads the isDark preference
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Always render the navigator structure once everything is ready
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeLoader>
          <AuthProvider>
            <NotificationContainer>
              <Slot />
            </NotificationContainer>
            <StatusBar style="dark" />
            {/* Vercel Analytics - Web only */}
            {Platform.OS === 'web' && Analytics && <Analytics />}
            {Platform.OS === 'web' && SpeedInsights && <SpeedInsights />}
          </AuthProvider>
        </ThemeLoader>
      </QueryClientProvider>
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