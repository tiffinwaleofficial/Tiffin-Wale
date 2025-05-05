import React from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFAF0' }
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="customize-meal" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="delivery-addresses" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="account-information" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="help-support" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="profile" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="subscription-checkout" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="faq" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="active-subscription-plan" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="payment-methods" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}