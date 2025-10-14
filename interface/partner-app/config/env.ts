interface EnvironmentConfig {
  API_BASE_URL: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_UPLOAD_PRESET: string;
  CLOUDINARY_API_KEY: string;
  WS_URL: string;
  PUSHER_KEY: string;
  PUSHER_CLUSTER: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  DEBUG: boolean;
}

// Validate required environment variables
const validateEnv = (): void => {
  const requiredVars = [
    'EXPO_PUBLIC_API_BASE_URL',
    'EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET',
    'EXPO_PUBLIC_WS_URL',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

// Validate environment variables
validateEnv();

export const ENV: EnvironmentConfig = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL!,
  CLOUDINARY_CLOUD_NAME: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_UPLOAD_PRESET: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  CLOUDINARY_API_KEY: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || '',
  WS_URL: process.env.EXPO_PUBLIC_WS_URL!,
  PUSHER_KEY: process.env.EXPO_PUBLIC_PUSHER_KEY || '',
  PUSHER_CLUSTER: process.env.EXPO_PUBLIC_PUSHER_CLUSTER || 'us2',
  ENVIRONMENT: (process.env.EXPO_PUBLIC_ENVIRONMENT as EnvironmentConfig['ENVIRONMENT']) || 'development',
  DEBUG: process.env.EXPO_PUBLIC_DEBUG === 'true',
};

// Helper functions
export const isDevelopment = (): boolean => ENV.ENVIRONMENT === 'development';
export const isProduction = (): boolean => ENV.ENVIRONMENT === 'production';
export const isStaging = (): boolean => ENV.ENVIRONMENT === 'staging';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PARTNER: {
    PROFILE: '/partner/profile',
    UPDATE_PROFILE: '/partner/profile',
    STATS: '/partner/stats',
    EARNINGS: '/partner/earnings',
    SETTINGS: '/partner/settings',
  },
  ORDERS: {
    LIST: '/orders',
    TODAY: '/orders/today',
    DETAIL: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },
  MENU: {
    LIST: '/menu',
    CREATE: '/menu',
    UPDATE: (id: string) => `/menu/${id}`,
    DELETE: (id: string) => `/menu/${id}`,
    CATEGORIES: '/menu/categories',
  },
  MEALS: {
    LIST: '/meals',
    CREATE: '/meals',
    UPDATE: (id: string) => `/meals/${id}`,
    DELETE: (id: string) => `/meals/${id}`,
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    EARNINGS: '/analytics/earnings',
    ORDERS: '/analytics/orders',
  },
  REVIEWS: {
    LIST: '/reviews',
    RESPOND: (id: string) => `/reviews/${id}/respond`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
  UPLOAD: {
    IMAGE: '/upload/image',
    MULTIPLE: '/upload/multiple',
  },
  SUPPORT: {
    CONTACT: '/support/contact',
    FAQ: '/support/faq',
  },
} as const;

// WebSocket events
export const WS_EVENTS = {
  ORDER_CREATED: 'order_created',
  ORDER_UPDATED: 'order_updated',
  ORDER_CANCELLED: 'order_cancelled',
  NOTIFICATION: 'notification',
  CHAT_MESSAGE: 'chat_message',
  TYPING: 'typing',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
} as const;

// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: ENV.CLOUDINARY_CLOUD_NAME,
  UPLOAD_PRESET: ENV.CLOUDINARY_UPLOAD_PRESET,
  API_KEY: ENV.CLOUDINARY_API_KEY,
  BASE_URL: `https://api.cloudinary.com/v1_1/${ENV.CLOUDINARY_CLOUD_NAME}`,
  IMAGE_URL: `https://res.cloudinary.com/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload`,
} as const;

// Pusher configuration
export const PUSHER_CONFIG = {
  KEY: ENV.PUSHER_KEY,
  CLUSTER: ENV.PUSHER_CLUSTER,
  ENABLED: !!ENV.PUSHER_KEY,
} as const;



