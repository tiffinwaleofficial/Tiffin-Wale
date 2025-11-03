# Adding New MCP Servers

This guide explains how to add a new MCP server to the infrastructure.

## Overview

Adding a new MCP server involves:
1. Creating the server module
2. Implementing the launcher
3. Adding configuration
4. Registering in the server registry
5. Updating documentation

## Step-by-Step Guide

### Step 1: Create Server Directory

Create a new directory for your server in `src/servers/`:

```bash
mkdir -p src/servers/your-server-name
```

### Step 2: Create Server Files

Create the following files:

#### `src/servers/your-server-name/index.ts`

```typescript
#!/usr/bin/env node

/**
 * Your Server MCP Launcher
 */

import { spawn } from 'child_process';
import { getYourServerConfig } from './config.js';
import { createLogger } from '../../shared/utils/logger.js';
import { loadEnv } from '../../shared/config/env.js';

const env = loadEnv();
const logger = createLogger('Your-Server-MCP', env.mcp.logLevel);

function startYourServer(): void {
  const config = getYourServerConfig();

  logger.info('Starting Your Server MCP...');

  const serverProcess = spawn(config.command, config.args || [], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...config.env,
    },
    shell: true,
  });

  serverProcess.on('error', (error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });

  serverProcess.on('exit', (code, signal) => {
    if (code !== null) {
      logger.info(`Server exited with code ${code}`);
    }
    process.exit(code || 0);
  });

  process.on('SIGINT', () => {
    logger.info('Shutting down gracefully...');
    serverProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    logger.info('Shutting down gracefully...');
    serverProcess.kill('SIGTERM');
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startYourServer();
}

export { startYourServer };
```

#### `src/servers/your-server-name/config.ts`

```typescript
import type { MCPServerConfig } from '../../shared/types/mcp-server.js';
import { loadEnv } from '../../shared/config/env.js';
import { getBaseConfig, mergeConfig } from '../../shared/config/mcp-config.js';

export interface YourServerConfig extends MCPServerConfig {
  config: {
    // Your server-specific config
  };
}

export function getYourServerConfig(): YourServerConfig {
  const env = loadEnv();
  const baseConfig = getBaseConfig();

  return mergeConfig(baseConfig, {
    name: 'your-server',
    description: 'Description of your server',
    command: 'npx',
    args: [
      '-y',
      'your-mcp-server-package@latest',
      // Add arguments as needed
    ],
    enabled: true,
    env: {
      // Server-specific environment variables
    },
    config: {
      // Server-specific configuration
    },
  }) as YourServerConfig;
}
```

#### `src/servers/your-server-name/README.md`

Document your server:
- Purpose and features
- Configuration options
- Usage examples
- Security considerations

### Step 3: Add Environment Variables

Add any required environment variables to `.env.example`:

```env
# Your Server Configuration
YOUR_SERVER_API_KEY=your-api-key-here
YOUR_SERVER_ENDPOINT=https://api.example.com
```

### Step 4: Update Server Registry

Add your server to `config/servers.json`:

```json
{
  "servers": [
    {
      "id": "your-server",
      "name": "Your Server",
      "description": "Description of your server",
      "enabled": true,
      "module": "src/servers/your-server-name/index.ts",
      "command": "node",
      "args": [
        "${DIST_PATH}/servers/your-server-name/index.js"
      ],
      "env": {
        "YOUR_SERVER_API_KEY": "${YOUR_SERVER_API_KEY}",
        "YOUR_SERVER_ENDPOINT": "${YOUR_SERVER_ENDPOINT}"
      }
    }
  ]
}
```

### Step 5: Update Cursor Configuration Template

Add your server to `config/cursor-config.json`:

```json
{
  "mcpServers": {
    "your-server": {
      "command": "node",
      "args": [
        "D:\\Bachelor Food App\\Tiffin-Wale\\services\\mcp-servers\\dist\\servers\\your-server-name\\index.js"
      ],
      "env": {
        "YOUR_SERVER_API_KEY": "your-api-key",
        "YOUR_SERVER_ENDPOINT": "https://api.example.com"
      }
    }
  }
}
```

### Step 6: Add npm Scripts

Add scripts to `package.json`:

```json
{
  "scripts": {
    "mcp:your-server:install": "npm install your-mcp-server-package",
    "mcp:your-server:start": "node dist/servers/your-server-name/index.js",
    "mcp:your-server:dev": "tsx src/servers/your-server-name/index.ts",
    "mcp:your-server:test": "tsx src/servers/your-server-name/test.ts"
  }
}
```

### Step 7: Update Main Documentation

Update `README.md` to include your new server:
- Add to "Available Servers" section
- Update scripts list
- Add any special configuration notes

### Step 8: Test Your Server

1. Build the project: `npm run build`
2. Test locally: `npm run mcp:your-server:dev`
3. Verify it starts correctly
4. Test with Cursor IDE

## Best Practices

### Naming Conventions
- Use kebab-case for directory names: `redis-server`
- Use camelCase for TypeScript files: `redisConfig.ts`
- Use descriptive names that indicate purpose

### Error Handling
- Always handle process errors
- Log errors with context
- Exit gracefully on errors

### Configuration
- Validate configuration at startup
- Provide sensible defaults
- Document all configuration options

### Security
- Never hardcode credentials
- Use environment variables
- Enable read-only mode for databases
- Validate input and configuration

### Documentation
- Document all features
- Provide usage examples
- Include troubleshooting tips
- Explain security considerations

## Example: Adding a Redis MCP Server

See the template structure below:

```
src/servers/redis/
├── index.ts
├── config.ts
└── README.md
```

**index.ts** would spawn a Redis MCP server package.

**config.ts** would load Redis connection details from environment.

**README.md** would document Redis-specific features and configuration.

## Troubleshooting

### Server Not Starting
- Check Node.js version compatibility
- Verify package is installed
- Check environment variables are set
- Review error logs

### Configuration Issues
- Validate all required env vars are set
- Check path formatting (Windows vs Unix)
- Verify JSON syntax in config files

### Cursor Integration Issues
- Ensure paths are absolute
- Check file permissions
- Verify Cursor settings JSON syntax
- Restart Cursor after changes

## Next Steps

After adding your server:
1. Update architecture documentation if needed
2. Add to CI/CD if applicable
3. Create test scripts if needed
4. Share with team for feedback

## Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Cursor MCP Documentation](https://cursor.sh/docs)
- Existing server implementations for reference
- [Architecture Guide](architecture.md) for design patterns


















