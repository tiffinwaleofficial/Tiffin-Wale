import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics, logEvent, setUserProperties, setUserId } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLi-qYKG8ZW1wIQgzy4oeFVz4Teh1VQ5g",
  authDomain: "official-web-app.firebaseapp.com",
  projectId: "official-web-app",
  storageBucket: "official-web-app.firebasestorage.app",
  messagingSenderId: "368936020156",
  appId: "1:368936020156:web:713a71da0a55a41c2288b9",
  measurementId: "G-530E9GPQNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser environment
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
  console.log('🔥 Firebase Analytics initialized!');
  console.log('📊 Measurement ID:', firebaseConfig.measurementId);
}

export { analytics, logEvent, setUserProperties, setUserId };
export default app;

