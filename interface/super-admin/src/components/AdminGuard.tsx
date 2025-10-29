'use client';

import React from 'react';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'super_admin';
  fallback?: React.ReactNode;
}

export default function AdminGuard({ 
  children, 
  requiredRole = 'admin',
  fallback 
}: AdminGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Show loading state
  if (loading) {
    return fallback || (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/login');
    return null;
  }

  // Check if user has required role
  const hasRequiredRole = () => {
    if (!user.role) return false;
    
    if (requiredRole === 'super_admin') {
      return user.role === 'super_admin';
    }
    
    // For 'admin' requirement, both 'admin' and 'super_admin' are allowed
    return user.role === 'admin' || user.role === 'super_admin';
  };

  // Show access denied if user doesn't have required role
  if (!hasRequiredRole()) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Access Denied
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  You don't have the required permissions to access this area.
                  {requiredRole === 'super_admin' && ' Super admin privileges required.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Shield className="h-3 w-3" />
                <span>Current role: {user.role || 'No role assigned'}</span>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has required role, render children
  return <>{children}</>;
} 