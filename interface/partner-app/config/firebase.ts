import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { config } from './index';

// Firebase Configuration - Production (Blaze Plan with Real SMS OTP)
const firebaseConfig = config.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with proper persistence for React Native
let auth: ReturnType<typeof getAuth>;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    // For React Native, initialize auth normally
    // Note: AsyncStorage persistence is handled automatically in newer versions
    auth = initializeAuth(app);
  }
} catch (error) {
  // If auth is already initialized, get the existing instance
  console.log('Firebase Auth already initialized, using existing instance');
  auth = getAuth(app);
}

// Initialize Analytics (optional, only works on web)
let analytics;
if (Platform.OS === 'web') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics not available:', error);
  }
}

export { auth, analytics };
export default app;