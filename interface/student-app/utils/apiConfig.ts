/**
 * API Configuration Utility
 * Handles different base URLs for different platforms with comprehensive Android support
 */

import { Platform } from 'react-native';

// Define multiple potential backend URLs for Android emulator
const ANDROID_BACKEND_OPTIONS = [
  'http://10.0.2.2:3001',     // Standard Android emulator host mapping
  'http://192.168.1.100:3001', // Replace with your actual laptop IP
  'http://192.168.0.100:3001', // Alternative common IP range
  'http://127.0.0.1:3001',     // Localhost fallback
];

// Function to get your laptop's local IP (you'll need to replace this)
const getLocalIpAddress = (): string => {
  // Your laptop's actual IP address from ipconfig
  return '10.130.40.1'; // Your WiFi adapter IP address
};

export const getApiBaseUrl = (): string => {
  console.log('🔍 Platform.OS detected:', Platform.OS);
  
  // Debug: Log all process.env variables that start with EXPO_PUBLIC_
  console.log('🔍 All EXPO_PUBLIC_ environment variables:', 
    Object.keys(process.env)
      .filter(key => key.startsWith('EXPO_PUBLIC_'))
      .reduce((obj, key) => {
        obj[key] = process.env[key];
        return obj;
      }, {} as Record<string, string | undefined>)
  );
  
  // Check both regular and EXPO_PUBLIC_ prefixed environment variables
  const envVars = {
    PROD_API_BASE_URL: process.env.EXPO_PUBLIC_PROD_API_BASE_URL || process.env.PROD_API_BASE_URL,
    LOCAL_API_BASE_URL: process.env.EXPO_PUBLIC_LOCAL_API_BASE_URL || process.env.LOCAL_API_BASE_URL,
    ANDROID_EMULATOR_API_URL: process.env.EXPO_PUBLIC_ANDROID_EMULATOR_API_URL || process.env.ANDROID_EMULATOR_API_URL,
  };
  
  console.log('🔍 Environment variables check:', {
    PROD_API_BASE_URL: envVars.PROD_API_BASE_URL ? 'SET' : 'NOT SET',
    LOCAL_API_BASE_URL: envVars.LOCAL_API_BASE_URL ? 'SET' : 'NOT SET',
    ANDROID_EMULATOR_API_URL: envVars.ANDROID_EMULATOR_API_URL ? 'SET' : 'NOT SET',
  });
  
  console.log('🔍 Actual environment values:', {
    PROD_API_BASE_URL: envVars.PROD_API_BASE_URL,
    LOCAL_API_BASE_URL: envVars.LOCAL_API_BASE_URL,
    ANDROID_EMULATOR_API_URL: envVars.ANDROID_EMULATOR_API_URL,
  });
  
  // Platform-specific configuration based on .env variables
  if (Platform.OS === 'android') {
    // Android uses production backend
    const prodUrl = envVars.PROD_API_BASE_URL;
    console.log('📱 Android detected - PROD_API_BASE_URL:', prodUrl);
    if (prodUrl) {
      console.log('📱 Android using production backend:', prodUrl);
      return prodUrl;
    }
    
    // Fallback to emulator URLs if production URL not available
    const emulatorUrl = envVars.ANDROID_EMULATOR_API_URL || 'http://10.0.2.2:3001';
    console.log('📱 Android fallback to emulator URL:', emulatorUrl);
    return emulatorUrl;
  }
  
  if (Platform.OS === 'ios') {
    // iOS uses local backend for development
    const localUrl = envVars.LOCAL_API_BASE_URL || 'http://127.0.0.1:3001';
    console.log('📱 iOS detected, using local backend:', localUrl);
    return localUrl;
  }
  
  // Web platform uses local backend for development
  if (Platform.OS === 'web') {
    const localUrl = envVars.LOCAL_API_BASE_URL || 'http://localhost:3001';
    console.log('🌐 Web detected - LOCAL_API_BASE_URL:', envVars.LOCAL_API_BASE_URL);
    console.log('🌐 Web using local backend:', localUrl);
    return localUrl;
  }
  
  // Check user agent as fallback for web
  if (typeof navigator !== 'undefined' && navigator.userAgent) {
    console.log('🔍 Checking user agent:', navigator.userAgent);
    if (navigator.userAgent.includes('Android')) {
      const prodUrl = envVars.PROD_API_BASE_URL || 'https://api-tiffin-wale.vercel.app';
      console.log('📱 Android user agent detected, using production backend:', prodUrl);
      return prodUrl;
    }
    if (navigator.userAgent.includes('iPhone')) {
      const localUrl = envVars.LOCAL_API_BASE_URL || 'http://127.0.0.1:3001';
      console.log('📱 iPhone user agent detected, using local backend:', localUrl);
      return localUrl;
    }
  }
  
  // Default fallback to local development
  const defaultUrl = envVars.LOCAL_API_BASE_URL || 'http://localhost:3001';
  console.log('🌐 Using default local backend:', defaultUrl);
  return defaultUrl;
};

// Function to test connectivity and provide alternative URLs
export const getAlternativeUrls = (): string[] => {
  if (Platform.OS === 'android') {
    const localIp = getLocalIpAddress();
    return [
      'http://10.0.2.2:3001',
      `http://${localIp}:3001`,
      'http://192.168.1.100:3001', // Common IP ranges
      'http://192.168.0.100:3001',
      'http://192.168.1.101:3001',
      'http://127.0.0.1:3001',
    ];
  }
  return [API_BASE_URL];
};

export const API_BASE_URL = getApiBaseUrl();

// WebSocket URL (same as API but with ws protocol)
export const getWebSocketUrl = (): string => {
  const apiUrl = getApiBaseUrl();
  return apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
};

export const getNativeWebSocketUrl = (): string => {
  const apiUrl = getApiBaseUrl();
  // Native WebSocket runs on port 3002 (different from Socket.IO)
  const wsUrl = apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
  
  // Replace port 3001 with 3002 for native WebSocket
  if (wsUrl.includes(':3001')) {
    return wsUrl.replace(':3001', ':3002');
  }
  
  // For production URLs, append the native WebSocket port
  if (wsUrl.includes('api-tiffin-wale') && wsUrl.includes('vercel.app')) {
    // For Vercel, we'll use the same URL but with a different path
    return wsUrl + '/native-ws';
  }
  
  return wsUrl;
};

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  WS_BASE_URL: getWebSocketUrl(),
  NATIVE_WS_URL: getNativeWebSocketUrl(), // New native WebSocket URL
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Enhanced logging for debugging
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔌 WebSocket URL:', API_CONFIG.WS_BASE_URL);
console.log('🔌 Native WebSocket URL:', API_CONFIG.NATIVE_WS_URL);
console.log('🔍 Platform:', Platform.OS);

if (Platform.OS === 'android') {
  console.log('📱 Android Network Troubleshooting:');
  console.log('1. Make sure your backend is running on localhost:3001');
  console.log('2. Check your laptop\'s IP address with: ipconfig (Windows) or ifconfig (Mac/Linux)');
  console.log('3. Alternative URLs to try:', getAlternativeUrls());
  console.log('4. Make sure Windows Firewall allows port 3001');
  console.log('5. Try running backend with: npm run start:dev -- --host 0.0.0.0');
}
