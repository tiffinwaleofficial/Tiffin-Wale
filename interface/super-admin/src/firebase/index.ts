import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from 'firebase/firestore';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase() {
  if (typeof window !== 'undefined') {
    // Initialize on client-side
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      firestore = getFirestore(app);

      // Check if running in development and environment variables are set for emulators
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true'
      ) {
        const authHost =
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
         const firestoreHost =
           process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST ||
           'localhost';
         const firestorePort = parseInt(
           process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT || '8080',
           10
         );


        console.log(`Connecting to Firebase Auth emulator at http://${authHost}`);
        connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true });

        console.log(`Connecting to Firebase Firestore emulator at ${firestoreHost}:${firestorePort}`);
        connectFirestoreEmulator(firestore, firestoreHost, firestorePort);

      } else {
        console.log('Connecting to production Firebase services.');
      }
    } else {
      // If already initialized, get the existing app, auth, and firestore instances
      app = getApps()[0];
      auth = getAuth(app);
      firestore = getFirestore(app);
    }
  } else {
    // Handle server-side or other environments if necessary
    // For now, we focus on client-side initialization
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }
     auth = getAuth(app);
     firestore = getFirestore(app);
     // Note: Emulators typically connect on the client-side during development.
     // Server-side emulator connection might require different setup if needed.
  }
}

// Call initializeFirebase immediately to ensure Firebase is set up when this module is imported.
initializeFirebase();


/**
 * Gets the initialized Firebase instances.
 * Ensures Firebase is initialized before returning instances.
 *
 * @returns An object containing the initialized FirebaseApp, Auth, and Firestore instances.
 */
export function getFirebase() {
  // While initializeFirebase is called above, this check ensures instances are returned correctly,
  // especially in scenarios like module reloading or edge cases.
  if (!app || !auth || !firestore) {
    initializeFirebase();
  }
  return { app, auth, firestore };
}
