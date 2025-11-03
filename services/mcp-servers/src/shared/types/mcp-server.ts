/**
 * MCP Server Interface
 * 
 * Defines the contract that all MCP servers must implement
 * for consistency and extensibility.
 */

export interface MCPServerConfig {
  /** Server name/identifier */
  name: string;
  /** Server description */
  description: string;
  /** Command to start the server */
  command: string;
  /** Arguments to pass to the command */
  args?: string[];
  /** Environment variables for the server */
  env?: Record<string, string>;
  /** Whether the server is enabled */
  enabled: boolean;
  /** Server-specific configuration */
  config?: Record<string, unknown>;
}

export interface MCPServerMetadata {
  /** Server identifier */
  id: string;
  /** Server name */
  name: string;
  /** Server version */
  version: string;
  /** Server description */
  description: string;
  /** Supported capabilities */
  capabilities?: string[];
}

export interface MCPServer {
  /** Server metadata */
  metadata: MCPServerMetadata;
  /** Start the server */
  start(): Promise<void>;
  /** Stop the server */
  stop(): Promise<void>;
  /** Check if server is running */
  isRunning(): boolean;
  /** Get server configuration */
  getConfig(): MCPServerConfig;
}

/**
 * Base configuration for MCP servers
 */
export interface BaseMCPServerConfig {
  /** Transport protocol (stdio or http) */
  transport: 'stdio' | 'http';
  /** Log level */
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  /** Read-only mode */
  readOnly?: boolean;
}

















