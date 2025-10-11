import { Slot } from 'expo-router';
import { PublicRoute } from '@/components/RouteGuard';

export default function AuthLayout() {
  return (
    <PublicRoute>
      <Slot />
    </PublicRoute>
  );
}