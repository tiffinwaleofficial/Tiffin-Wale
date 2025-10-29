import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard tab immediately
    router.replace('/(tabs)/dashboard');
  }, []);

  // Return null since we're redirecting
  return null;
}