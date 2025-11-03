/**
 * Environment Variable Loader
 * 
 * Centralized environment variable management for MCP servers
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

export interface EnvConfig {
  // MongoDB Configuration
  mongodb: {
    uri: string;
    readOnly: boolean;
  };
  // MCP Server Configuration
  mcp: {
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    transport: 'stdio' | 'http';
  };
}

/**
 * Load and validate environment variables
 */
export function loadEnv(): EnvConfig {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  return {
    mongodb: {
      uri: mongodbUri,
      readOnly: process.env.MONGODB_READ_ONLY === 'true' || process.env.MONGODB_READ_ONLY === '1',
    },
    mcp: {
      logLevel: (process.env.MCP_LOG_LEVEL as EnvConfig['mcp']['logLevel']) || 'info',
      transport: (process.env.MCP_TRANSPORT as EnvConfig['mcp']['transport']) || 'stdio',
    },
  };
}

/**
 * Get a specific environment variable with optional default
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

/**
 * Get a boolean environment variable
 */
export function getEnvBool(key: string, defaultValue = false): boolean {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value === 'true' || value === '1' || value === 'yes';
}

















