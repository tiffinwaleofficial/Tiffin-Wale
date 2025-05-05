import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Root() {
  const { isAuthenticated } = useAuthStore();
  
  // Redirect to proper location based on auth state
  if (isAuthenticated) {
    return <Redirect href="/dashboard" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
} 