import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new my-profile page
    router.replace('/my-profile');
  }, [router]);

  return null; // This component just redirects
}