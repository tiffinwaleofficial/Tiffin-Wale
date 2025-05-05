import { Stack } from 'expo-router';
import { Slot, Redirect } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();
  
  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Slot />;
}