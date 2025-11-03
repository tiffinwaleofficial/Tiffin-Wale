#!/usr/bin/env node

/**
 * MongoDB MCP Server Launcher
 * 
 * Launches the official MongoDB MCP server with project configuration
 */

import { spawn } from 'child_process';
import { getMongoDBConfig } from './config.js';
import { createLogger } from '../../shared/utils/logger.js';
import { loadEnv } from '../../shared/config/env.js';

const env = loadEnv();
const logger = createLogger('MongoDB-MCP', env.mcp.logLevel);

/**
 * Start the MongoDB MCP server
 */
function startMongoDBServer(): void {
  const config = getMongoDBConfig();

  logger.info('Starting MongoDB MCP Server...');
  logger.debug('Configuration:', {
    connectionString: config.config.connectionString.substring(0, 20) + '...',
    readOnly: config.config.readOnly,
    transport: 'stdio',
  });

  // Spawn the MongoDB MCP server process
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
    logger.error('Failed to start MongoDB MCP Server:', error);
    process.exit(1);
  });

  serverProcess.on('exit', (code, signal) => {
    if (code !== null) {
      logger.info(`MongoDB MCP Server exited with code ${code}`);
    } else if (signal) {
      logger.warn(`MongoDB MCP Server was terminated by signal ${signal}`);
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
  startMongoDBServer();
}

export { startMongoDBServer };

















