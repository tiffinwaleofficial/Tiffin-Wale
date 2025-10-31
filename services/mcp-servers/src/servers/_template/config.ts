/**
 * {SERVER_NAME} MCP Server Configuration
 * 
 * Template for creating new MCP server configurations
 * 
 * TODO: Replace {SERVER_NAME} with your server name
 * TODO: Update configuration options
 */

import type { MCPServerConfig } from '../../shared/types/mcp-server.js';
import { loadEnv } from '../../shared/config/env.js';
import { getBaseConfig, mergeConfig } from '../../shared/config/mcp-config.js';

// TODO: Replace ServerName with your actual server name
export interface ServerNameMCPServerConfig extends MCPServerConfig {
  config: {
    // Add your server-specific configuration here
    // Example:
    // apiKey: string;
    // endpoint: string;
  };
}

/**
 * Get SERVER_NAME MCP server configuration
 * TODO: Replace SERVER_NAME with your actual server name
 */
export function getServerNameConfig(): ServerNameMCPServerConfig {
  const env = loadEnv();
  const baseConfig = getBaseConfig();

  // TODO: Add your server-specific configuration loading here
  // Example:
  // const apiKey = process.env.SERVER_NAME_API_KEY;
  // if (!apiKey) {
  //   throw new Error('SERVER_NAME_API_KEY environment variable is required');
  // }

  const config: ServerNameMCPServerConfig = mergeConfig(baseConfig, {
    name: '{server-name}', // Use kebab-case
    description: 'Description of your MCP server',
    command: 'npx', // or 'node', or custom command
    args: [
      // TODO: Add your command arguments here
      // Example:
      // '-y',
      // 'your-mcp-server-package@latest',
      // '--api-key', apiKey,
    ],
    enabled: true,
    env: {
      // TODO: Add environment variables for your server
      // Example:
      // SERVER_NAME_API_KEY: apiKey,
    },
    config: {
      // TODO: Add server-specific config
      // Example:
      // apiKey: apiKey,
      // endpoint: process.env.SERVER_NAME_ENDPOINT || 'https://api.example.com',
    },
  }) as ServerNameMCPServerConfig;

  return config;
}

