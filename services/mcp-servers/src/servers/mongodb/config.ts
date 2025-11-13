/**
 * MongoDB MCP Server Configuration
 * 
 * Configuration specific to the MongoDB MCP server
 */

import type { MCPServerConfig } from '../../shared/types/mcp-server.js';
import { loadEnv } from '../../shared/config/env.js';
import { getBaseConfig, mergeConfig } from '../../shared/config/mcp-config.js';

export interface MongoDBMCPServerConfig extends MCPServerConfig {
  config: {
    connectionString: string;
    readOnly: boolean;
    database?: string;
  };
}

/**
 * Get MongoDB MCP server configuration
 */
export function getMongoDBConfig(): MongoDBMCPServerConfig {
  const env = loadEnv();
  const baseConfig = getBaseConfig();

  const config: MongoDBMCPServerConfig = mergeConfig(baseConfig, {
    name: 'mongodb',
    description: 'MongoDB MCP Server for database queries and schema exploration',
    command: 'npx',
    args: [
      '-y',
      'mongodb-mcp-server@latest',
      '--connectionString',
      env.mongodb.uri,
      ...(env.mongodb.readOnly ? ['--readOnly'] : []),
    ],
    enabled: true,
    env: {
      MONGODB_URI: env.mongodb.uri,
      MCP_LOG_LEVEL: env.mcp.logLevel,
    },
    config: {
      connectionString: env.mongodb.uri,
      readOnly: env.mongodb.readOnly,
    },
  }) as MongoDBMCPServerConfig;

  return config;
}





















