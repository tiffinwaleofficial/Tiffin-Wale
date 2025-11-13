/**
 * Server Registry
 * 
 * Registry system for managing and discovering MCP servers
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { MCPServerConfig } from '../types/mcp-server.js';

export interface ServerRegistryEntry {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  module: string;
  command: string;
  args: string[];
  env: Record<string, string>;
}

export interface ServerRegistry {
  servers: ServerRegistryEntry[];
  metadata: {
    version: string;
    lastUpdated: string;
  };
}

/**
 * Load server registry from config/servers.json
 */
export function loadServerRegistry(): ServerRegistry {
  const registryPath = resolve(process.cwd(), 'config', 'servers.json');
  const registryContent = readFileSync(registryPath, 'utf-8');
  
  // Replace placeholders with actual values
  const distPath = resolve(process.cwd(), 'dist');
  const processedContent = registryContent
    .replace(/\$\{DIST_PATH\}/g, distPath)
    .replace(/\$\{([^}]+)\}/g, (match, key) => {
      return process.env[key] || match;
    });
  
  return JSON.parse(processedContent) as ServerRegistry;
}

/**
 * Get all enabled servers from registry
 */
export function getEnabledServers(): ServerRegistryEntry[] {
  const registry = loadServerRegistry();
  return registry.servers.filter((server) => server.enabled);
}

/**
 * Get a specific server by ID
 */
export function getServerById(id: string): ServerRegistryEntry | undefined {
  const registry = loadServerRegistry();
  return registry.servers.find((server) => server.id === id && server.enabled);
}

/**
 * Convert registry entry to MCP server configuration
 */
export function registryEntryToConfig(entry: ServerRegistryEntry): MCPServerConfig {
  return {
    name: entry.id,
    description: entry.description,
    command: entry.command,
    args: entry.args,
    env: entry.env,
    enabled: entry.enabled,
  };
}

/**
 * List all available servers
 */
export function listServers(): void {
  const registry = loadServerRegistry();
  
  console.log('\nAvailable MCP Servers:');
  console.log('=====================\n');
  
  registry.servers.forEach((server) => {
    const status = server.enabled ? '✓ Enabled' : '✗ Disabled';
    console.log(`${status} - ${server.name} (${server.id})`);
    console.log(`  ${server.description}\n`);
  });
  
  console.log(`\nTotal: ${registry.servers.length} server(s)`);
}





















