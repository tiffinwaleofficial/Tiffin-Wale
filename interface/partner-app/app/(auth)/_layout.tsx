/**
 * Auth Layout
 * Wraps authentication screens with PublicRoute guard
 * Prevents authenticated users from accessing auth screens
 */

import { Slot } from 'expo-router';
import { PublicRoute } from '../../components/auth/PublicRoute';

export default function AuthLayout() {
  return (
    <PublicRoute>
      <Slot />
    </PublicRoute>
  );
}
