#!/usr/bin/env node

/**
 * {SERVER_NAME} MCP Server Launcher
 * 
 * Template for creating new MCP servers
 * 
 * TODO: Replace {SERVER_NAME} with your server name
 * TODO: Update imports and function names
 */

import { spawn } from 'child_process';
// TODO: Replace ServerName with your actual server name
// import { getServerNameConfig } from './config.js';
import { createLogger } from '../../shared/utils/logger.js';
import { loadEnv } from '../../shared/config/env.js';

const env = loadEnv();
const logger = createLogger('SERVER_NAME-MCP', env.mcp.logLevel);

/**
 * Start the SERVER_NAME MCP server
 * TODO: Replace SERVER_NAME with your actual server name
 */
function startServerNameServer(): void {
  // TODO: Uncomment and update with your config function
  // const config = getServerNameConfig();
  
  // Placeholder config for template - remove this after implementing
  const config = {
    command: 'node',
    args: ['--version'], // Replace with actual server command
    env: {},
  };

  logger.info('Starting SERVER_NAME MCP Server...');
  logger.debug('Configuration:', {
    // Add relevant config logging here
  });

  // Spawn the MCP server process
  // TODO: Update this with your actual server spawn command
  const serverProcess = spawn(config.command, config.args || [], {
    stdio: 'inherit', // Pipe stdio to parent process (Cursor)
    env: {
      ...process.env,
      ...config.env,
    },
    shell: true,
  });

  // Handle process events
  serverProcess.on('error', (error) => {
    logger.error('Failed to start SERVER_NAME MCP Server:', error);
    process.exit(1);
  });

  serverProcess.on('exit', (code, signal) => {
    if (code !== null) {
      logger.info(`SERVER_NAME MCP Server exited with code ${code}`);
    } else if (signal) {
      logger.warn(`SERVER_NAME MCP Server was terminated by signal ${signal}`);
    }
    process.exit(code || 0);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully...');
    serverProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down gracefully...');
    serverProcess.kill('SIGTERM');
  });
}

// Start the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServerNameServer();
}

export { startServerNameServer };

