/**
 * Enhanced Error Handling System for Partner App
 * Provides comprehensive error handling, logging, and user-friendly error messages
 */

import { AxiosError } from 'axios';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Structured error interface
export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  originalError?: any;
  code?: string;
  statusCode?: number;
  timestamp: Date;
  context?: Record<string, any>;
}

/**
 * Get user-friendly error message from any error
 */
export function getErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle Axios errors
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Server responded with error status
    if (axiosError.response) {
      const data = axiosError.response.data as any;
      
      // Try to extract message from response
      if (data?.message) {
        return Array.isArray(data.message) ? data.message[0] : data.message;
      }
      
      if (data?.error) {
        return typeof data.error === 'string' ? data.error : 'Server error occurred';
      }
      
      // Default messages based on status code
      switch (axiosError.response.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Authentication failed. Please login again.';
        case 403:
          return 'You don\'t have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'This resource already exists or conflicts with existing data.';
        case 422:
          return 'The provided data is invalid.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 502:
          return 'Service temporarily unavailable. Please try again.';
        case 503:
          return 'Service maintenance in progress. Please try again later.';
        default:
          return `Server error (${axiosError.response.status}). Please try again.`;
      }
    }
    
    // Network error
    if (axiosError.request) {
      return 'Network error. Please check your internet connection.';
    }
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message || 'An error occurred';
  }

  // Handle objects with message property
  if (error?.message) {
    return error.message;
  }

  // Fallback
  return 'An unexpected error occurred';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  if (isAxiosError(error)) {
    return !error.response && !!error.request;
  }
  
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('Network Error') ||
         error?.message?.includes('network');
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  if (isAxiosError(error)) {
    return error.response?.status === 401;
  }
  
  return error?.code === 'AUTH_ERROR' ||
         error?.message?.includes('Unauthorized') ||
         error?.message?.includes('Authentication');
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: any): boolean {
  if (isAxiosError(error)) {
    return error.response?.status === 400 || error.response?.status === 422;
  }
  
  return error?.code === 'VALIDATION_ERROR' ||
         error?.message?.includes('validation') ||
         error?.message?.includes('invalid');
}

/**
 * Check if error is an Axios error
 */
export function isAxiosError(error: any): error is AxiosError {
  return error?.isAxiosError === true;
}

/**
 * Create a structured AppError from any error
 */
export function createAppError(
  error: any,
  context?: Record<string, any>
): AppError {
  const timestamp = new Date();
  
  // Handle Axios errors
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // Server error
      const statusCode = axiosError.response.status;
      let type = ErrorType.SERVER;
      let severity = ErrorSeverity.MEDIUM;
      
      if (statusCode === 401) {
        type = ErrorType.AUTH;
        severity = ErrorSeverity.HIGH;
      } else if (statusCode >= 400 && statusCode < 500) {
        type = ErrorType.CLIENT;
        severity = ErrorSeverity.MEDIUM;
      } else if (statusCode >= 500) {
        type = ErrorType.SERVER;
        severity = ErrorSeverity.HIGH;
      }
      
      return {
        type,
        severity,
        message: getErrorMessage(error),
        originalError: error,
        code: axiosError.code,
        statusCode,
        timestamp,
        context,
      };
    } else if (axiosError.request) {
      // Network error
      return {
        type: ErrorType.NETWORK,
        severity: ErrorSeverity.HIGH,
        message: getErrorMessage(error),
        originalError: error,
        code: axiosError.code,
        timestamp,
        context,
      };
    }
  }
  
  // Handle validation errors
  if (isValidationError(error)) {
    return {
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.MEDIUM,
      message: getErrorMessage(error),
      originalError: error,
      timestamp,
      context,
    };
  }
  
  // Handle auth errors
  if (isAuthError(error)) {
    return {
      type: ErrorType.AUTH,
      severity: ErrorSeverity.HIGH,
      message: getErrorMessage(error),
      originalError: error,
      timestamp,
      context,
    };
  }
  
  // Default unknown error
  return {
    type: ErrorType.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    message: getErrorMessage(error),
    originalError: error,
    timestamp,
    context,
  };
}

/**
 * Log error with appropriate level
 */
export function logError(error: AppError): void {
  const logData = {
    type: error.type,
    severity: error.severity,
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    timestamp: error.timestamp.toISOString(),
    context: error.context,
  };
  
  switch (error.severity) {
    case ErrorSeverity.CRITICAL:
      console.error('🚨 CRITICAL ERROR:', logData);
      break;
    case ErrorSeverity.HIGH:
      console.error('❌ HIGH SEVERITY ERROR:', logData);
      break;
    case ErrorSeverity.MEDIUM:
      console.warn('⚠️ MEDIUM SEVERITY ERROR:', logData);
      break;
    case ErrorSeverity.LOW:
      console.log('ℹ️ LOW SEVERITY ERROR:', logData);
      break;
    default:
      console.error('❓ UNKNOWN SEVERITY ERROR:', logData);
  }
}

/**
 * Handle error with logging and return user-friendly message
 */
export function handleError(
  error: any,
  context?: Record<string, any>
): string {
  const appError = createAppError(error, context);
  logError(appError);
  return appError.message;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Don't retry auth errors or client errors
      if (isAuthError(error) || (isAxiosError(error) && error.response?.status && error.response.status < 500)) {
        break;
      }
      
      // Exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      if (__DEV__) {
        console.log(`🔄 Retrying request (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms`);
      }
    }
  }
  
  throw lastError;
}

/**
 * Safe async function wrapper that handles errors gracefully
 */
export function safeAsync<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  return fn().catch((error) => {
    handleError(error, { function: fn.name });
    return fallback;
  });
}

/**
 * Error boundary helper for React components
 */
export function createErrorBoundaryHandler(componentName: string) {
  return (error: Error, errorInfo: any) => {
    const appError = createAppError(error, {
      component: componentName,
      errorInfo,
    });
    logError(appError);
  };
}
