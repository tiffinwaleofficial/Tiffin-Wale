# Architecture

This document provides an overview of the MCP servers architecture and design decisions.

## Design Principles

### 1. Modularity
Each MCP server is a self-contained module with its own configuration, implementation, and documentation. This allows:
- Easy addition of new servers
- Independent maintenance
- Clear separation of concerns

### 2. Shared Infrastructure
Common utilities are shared across all servers:
- Environment variable management
- Configuration utilities
- Logging
- Type definitions

### 3. Type Safety
Full TypeScript support ensures:
- Compile-time error detection
- Better IDE support
- Self-documenting code
- Consistent interfaces

### 4. Security First
- Environment variables for sensitive data
- Read-only modes by default
- No hardcoded credentials
- Git-ignored `.env` files

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│           Cursor IDE / MCP Client              │
└──────────────────┬──────────────────────────────┘
                   │ stdio transport
                   │
┌──────────────────▼──────────────────────────────┐
│         MCP Server Launcher                      │
│  (src/servers/{server}/index.ts)                │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼────────┐
│ MongoDB Server │   │  Future Servers │
│  (mongodb-mcp) │   │  (Redis, API...)│
└───────┬────────┘   └─────────────────┘
        │
┌───────▼────────────────────────────────────────┐
│      Shared Infrastructure                      │
│  - Config Management (env.ts)                  │
│  - MCP Utilities (mcp-config.ts)              │
│  - Logging (logger.ts)                         │
│  - Types (mcp-server.ts)                       │
└────────────────────────────────────────────────┘
```

## Component Overview

### Server Modules (`src/servers/`)

Each server module contains:
- `index.ts` - Server launcher that spawns the MCP server process
- `config.ts` - Server-specific configuration
- `README.md` - Server-specific documentation

**Example Structure:**
```
src/servers/mongodb/
├── index.ts      # Launches mongodb-mcp-server
├── config.ts     # MongoDB-specific config
└── README.md     # MongoDB server docs
```

### Shared Infrastructure (`src/shared/`)

#### Config (`src/shared/config/`)

- **env.ts**: Loads and validates environment variables
- **mcp-config.ts**: Utilities for MCP server configuration

#### Types (`src/shared/types/`)

- **mcp-server.ts**: Interfaces and types for MCP servers
  - `MCPServerConfig`: Server configuration interface
  - `MCPServer`: Server implementation contract
  - `BaseMCPServerConfig`: Base configuration options

#### Utils (`src/shared/utils/`)

- **logger.ts**: Logging utility with configurable levels

### Configuration Files (`config/`)

- **servers.json**: Registry of all available servers
- **cursor-config.json**: Template for Cursor IDE configuration

## Server Lifecycle

1. **Initialization**: Load environment variables and configuration
2. **Validation**: Verify configuration and dependencies
3. **Launch**: Spawn MCP server process with stdio transport
4. **Runtime**: Server handles MCP protocol messages
5. **Shutdown**: Graceful shutdown on SIGINT/SIGTERM

## Transport Protocol

Currently supports **stdio** transport:
- Server communicates via standard input/output
- Simple and reliable
- No network configuration needed
- Secure (local only)

Future support for **HTTP** transport:
- Remote MCP servers
- Network-based communication
- Load balancing capabilities

## Adding New Servers

See [Adding New Servers Guide](adding-servers.md) for step-by-step instructions.

### Quick Checklist

1. Create server module in `src/servers/{name}/`
2. Implement `index.ts` launcher
3. Create `config.ts` with server-specific configuration
4. Add entry to `config/servers.json`
5. Update `config/cursor-config.json` template
6. Add npm scripts to `package.json`
7. Create server-specific README
8. Update main README

## Configuration Flow

```
Environment Variables (.env)
    ↓
env.ts (loads and validates)
    ↓
mcp-config.ts (merges base + server config)
    ↓
Server config.ts (server-specific settings)
    ↓
Server index.ts (launches with config)
```

## Security Architecture

### Environment Variables
- Stored in `.env` file (gitignored)
- Loaded at runtime
- Never committed to repository

### Read-Only Mode
- Enabled by default for database servers
- Prevents accidental modifications
- Can be disabled per-server if needed

### Credential Management
- Connection strings from environment
- No hardcoded credentials
- Support for MongoDB Atlas authentication

## Extension Points

### Custom Servers
Implement the `MCPServer` interface to create custom servers:

```typescript
import type { MCPServer } from '@shared/types/mcp-server';

export class CustomServer implements MCPServer {
  // Implementation
}
```

### Configuration Extensions
Extend `MCPServerConfig` for server-specific options:

```typescript
interface CustomServerConfig extends MCPServerConfig {
  config: {
    customOption: string;
  };
}
```

## Performance Considerations

- Servers run as separate processes
- Minimal overhead per server
- Stateless design allows easy scaling
- Resource isolation between servers

## Future Enhancements

- [ ] HTTP transport support
- [ ] Server health checks
- [ ] Automatic server discovery
- [ ] Configuration validation CLI
- [ ] Server management dashboard
- [ ] Metrics and monitoring


















