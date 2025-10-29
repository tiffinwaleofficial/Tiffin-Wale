'use client';

import { useState, useEffect, useRef } from 'react';
import {
  doc,
  onSnapshot,
  type Firestore,
  type DocumentReference,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebase } from '@/firebase';

interface FirestoreDocResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFirestoreDoc<T extends DocumentData>(
  docPath: string | null // Allow null path to prevent fetching initially
): FirestoreDocResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { firestore } = getFirebase();
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    // Don't proceed if firestore or docPath isn't available
    if (!firestore || !docPath) {
      setLoading(false);
      setData(null); // Ensure data is null if path is null
      return;
    }

    setLoading(true);
    setError(null);

    // Ensure cleanup runs if docPath changes or component unmounts
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    try {
      const docRef = doc(firestore, docPath) as DocumentReference<T>;

      unsubscribeRef.current = onSnapshot(
        docRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setData({ id: docSnapshot.id, ...docSnapshot.data() } as T);
          } else {
            setData(null); // Document doesn't exist
          }
          setLoading(false);
        },
        (err) => {
          console.error(`Error fetching Firestore document (${docPath}):`, err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      );
    } catch (err) {
      console.error(`Error setting up Firestore listener for document (${docPath}):`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }

    // Cleanup subscription on unmount or when docPath changes
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [firestore, docPath]); // Re-run effect if firestore or docPath changes

  return { data, loading, error };
}
