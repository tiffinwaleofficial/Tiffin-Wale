'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton'; // Use Skeleton for loading state

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start loading as true
  const { auth } = getFirebase();

  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (isMounted) {
          setUser(firebaseUser);
          setLoading(false); // Set loading false once auth state is determined
        }
      },
      (error) => { // Handle errors during auth state observation
        console.error("Auth state change error:", error);
        if (isMounted) {
          setUser(null); // Assume logged out on error
          setLoading(false); // Ensure loading completes even on error
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [auth]);

  if (loading) {
    // Display a full-page loading skeleton or similar indicator
    return (
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


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
