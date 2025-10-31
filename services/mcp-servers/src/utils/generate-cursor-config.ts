#!/usr/bin/env node

/**
 * Cursor Configuration Generator
 * 
 * Generates Cursor IDE MCP server configuration from server registry
 */

import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { getEnabledServers, registryEntryToConfig } from '../shared/utils/server-registry.js';
import { createLogger } from '../shared/utils/logger.js';

const logger = createLogger('Config-Generator');

/**
 * Generate Cursor configuration JSON
 */
function generateCursorConfig(projectRoot: string): string {
  const servers = getEnabledServers();
  const mcpServers: Record<string, unknown> = {};

  servers.forEach((entry) => {
    const config = registryEntryToConfig(entry);
    
    // Convert module path to absolute path
    const modulePath = resolve(projectRoot, 'dist', entry.module.replace('src/', ''));
    
    mcpServers[entry.id] = {
      command: config.command,
      args: (config.args || []).map((arg) => {
        // Replace placeholders in args
        if (arg.includes('${DIST_PATH}')) {
          return arg.replace('${DIST_PATH}', resolve(projectRoot, 'dist'));
        }
        return arg;
      }),
      env: config.env,
    };
  });

  return JSON.stringify(
    {
      mcpServers,
      _comment: 'Add this configuration to your Cursor settings.json file',
    },
    null,
    2
  );
}

/**
 * Main function to generate and save configuration
 */
function main(): void {
  const projectRoot = process.cwd();
  const outputPath = resolve(projectRoot, 'config', 'cursor-config-generated.json');
  
  logger.info('Generating Cursor configuration...');
  
  try {
    const config = generateCursorConfig(projectRoot);
    writeFileSync(outputPath, config, 'utf-8');
    
    logger.info(`Configuration generated: ${outputPath}`);
    logger.info('\nNext steps:');
    logger.info('1. Review the generated configuration');
    logger.info('2. Copy the mcpServers section to your Cursor settings.json');
    logger.info(`3. Update paths and environment variables as needed`);
  } catch (error) {
    logger.error('Failed to generate configuration:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

// Export for use as module
export { generateCursorConfig };

