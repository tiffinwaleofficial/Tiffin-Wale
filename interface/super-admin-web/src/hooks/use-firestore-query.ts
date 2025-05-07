'use client';

import { useState, useEffect, useRef } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  type Firestore,
  type CollectionReference,
  type DocumentData,
  type Query,
  type QueryConstraint,
  type Unsubscribe,
  type WhereFilterOp,
  type OrderByDirection,
} from 'firebase/firestore';
import { getFirebase } from '@/firebase';

interface UseFirestoreQueryOptions {
  constraints?: Array<{
    field: string;
    operator: WhereFilterOp;
    value: any;
  }>;
  orderByField?: string;
  orderByDirection?: OrderByDirection;
  limitCount?: number;
}

interface FirestoreQueryResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

export function useFirestoreQuery<T extends DocumentData>(
  collectionPath: string,
  options: UseFirestoreQueryOptions = {}
): FirestoreQueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { firestore } = getFirebase();
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // Memoize options to prevent unnecessary re-renders/refetches
  const optionsRef = useRef(options);
  useEffect(() => {
    // Basic deep comparison for options; consider a library for complex cases
    if (JSON.stringify(options) !== JSON.stringify(optionsRef.current)) {
      optionsRef.current = options;
      // Re-trigger the effect if options change
      setLoading(true); // Reset loading state for new query
      setError(null);
      setData([]); // Clear old data
      if (unsubscribeRef.current) {
        unsubscribeRef.current(); // Unsubscribe from the old query
      }
    }
  }, [options]);


  useEffect(() => {
    if (!firestore) return;

    setLoading(true);
    setError(null);

    try {
        const collectionRef = collection(firestore, collectionPath) as CollectionReference<T>;

        // Build query constraints dynamically
        const queryConstraints: QueryConstraint[] = [];
        const currentOptions = optionsRef.current; // Use the ref value

        if (currentOptions.constraints) {
        currentOptions.constraints.forEach(c => {
            if (c.value !== undefined && c.value !== null) { // Ensure value is valid
             queryConstraints.push(where(c.field, c.operator, c.value));
            }
        });
        }

        if (currentOptions.orderByField) {
        queryConstraints.push(orderBy(currentOptions.orderByField, currentOptions.orderByDirection || 'asc'));
        }

        if (currentOptions.limitCount) {
        queryConstraints.push(limit(currentOptions.limitCount));
        }

        const q: Query<T> = query(collectionRef, ...queryConstraints);


      unsubscribeRef.current = onSnapshot(
        q,
        (querySnapshot) => {
          const results = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as T[];
          setData(results);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching Firestore data:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      );
    } catch (err) {
         console.error('Error setting up Firestore listener:', err);
         setError(err instanceof Error ? err : new Error(String(err)));
         setLoading(false);
    }


    // Cleanup subscription on unmount or when dependencies change
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null; // Reset ref after unsubscribing
      }
    };
    // Add firestore and collectionPath to dependencies. options changes are handled separately.
  }, [firestore, collectionPath]); // Re-run effect if firestore or collectionPath changes

  return { data, loading, error };
}
