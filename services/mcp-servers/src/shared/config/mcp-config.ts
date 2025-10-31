/**
 * MCP Configuration Utilities
 * 
 * Utilities for managing MCP server configurations
 */

import type { MCPServerConfig, BaseMCPServerConfig } from '../types/mcp-server.js';
import { loadEnv } from './env.js';

/**
 * Generate base MCP server configuration
 */
export function getBaseConfig(): BaseMCPServerConfig {
  const env = loadEnv();
  return {
    transport: env.mcp.transport,
    logLevel: env.mcp.logLevel,
    readOnly: env.mongodb.readOnly,
  };
}

/**
 * Merge base configuration with server-specific configuration
 */
export function mergeConfig(
  base: BaseMCPServerConfig,
  serverConfig: Partial<MCPServerConfig>
): MCPServerConfig {
  return {
    name: serverConfig.name || 'unknown',
    description: serverConfig.description || '',
    command: serverConfig.command || '',
    args: serverConfig.args || [],
    enabled: serverConfig.enabled !== false,
    env: {
      MCP_TRANSPORT: base.transport,
      MCP_LOG_LEVEL: base.logLevel,
      ...(base.readOnly ? { MCP_READ_ONLY: 'true' } : {}),
      ...serverConfig.env,
    },
    config: serverConfig.config,
  };
}

/**
 * Validate MCP server configuration
 */
export function validateConfig(config: MCPServerConfig): void {
  if (!config.name) {
    throw new Error('MCP server configuration must have a name');
  }
  if (!config.command) {
    throw new Error('MCP server configuration must have a command');
  }
  if (config.enabled === undefined) {
    throw new Error('MCP server configuration must specify enabled status');
  }
}

/**
 * Generate command arguments from configuration
 */
export function generateArgs(config: MCPServerConfig): string[] {
  const args: string[] = [];

  // Add configuration-specific arguments
  if (config.args) {
    args.push(...config.args);
  }

  return args;
}

