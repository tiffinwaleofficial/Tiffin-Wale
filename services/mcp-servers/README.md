# MCP Servers - Scalable Model Context Protocol Infrastructure

A scalable MCP (Model Context Protocol) server infrastructure for the Tiffin-Wale platform. This project provides a modular architecture for managing multiple MCP servers that enable AI assistants like Cursor to interact with various services and databases.

## Features

- **Modular Architecture**: Easy to add new MCP servers
- **Type-Safe**: Full TypeScript support
- **Shared Utilities**: Common configuration and logging
- **Security First**: Environment variables and read-only modes
- **Well Documented**: Comprehensive guides and examples

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and set your MongoDB connection string:

```bash
cp .env.example .env
```

Edit `.env` and set your `MONGODB_URI`.

### 3. Install MongoDB MCP Server

```bash
npm run mcp:mongodb:install
```

### 4. Build the Project

```bash
npm run build
```

### 5. Configure Cursor

Add the MongoDB MCP server configuration to your Cursor settings. See [Setup Guide](docs/setup.md) for detailed instructions.

## Project Structure

```
mcp-servers/
├── src/
│   ├── servers/          # Individual MCP server implementations
│   │   └── mongodb/      # MongoDB MCP server
│   ├── shared/           # Shared utilities and types
│   │   ├── config/       # Configuration utilities
│   │   ├── types/        # TypeScript interfaces
│   │   └── utils/        # Utility functions
├── config/               # Configuration files
│   ├── servers.json      # Server registry
│   └── cursor-config.json # Cursor configuration template
└── docs/                 # Documentation
```

## Available Servers

### MongoDB MCP Server

Provides direct access to MongoDB databases for querying and schema exploration.

**Features:**
- Database queries
- Schema exploration
- Read-only mode support
- Secure connection handling

See [MongoDB Server README](src/servers/mongodb/README.md) for details.

## Scripts

- `npm run build` - Build the project
- `npm run dev` - Development mode with hot reload
- `npm run mcp:mongodb:install` - Install MongoDB MCP server package
- `npm run mcp:mongodb:start` - Start MongoDB MCP server
- `npm run mcp:mongodb:dev` - Start MongoDB MCP server in dev mode
- `npm run mcp:mongodb:test` - Test MongoDB connection

## Documentation

- [Setup Guide](docs/setup.md) - Detailed setup instructions
- [Architecture](docs/architecture.md) - Architecture overview
- [Adding New Servers](docs/adding-servers.md) - Guide for adding new MCP servers

## Security

- All sensitive data stored in `.env` (gitignored)
- Read-only mode enabled by default
- Connection strings never hardcoded
- Follow MongoDB Atlas security best practices

## Contributing

When adding new MCP servers:

1. Follow the existing structure in `src/servers/`
2. Implement the `MCPServer` interface
3. Add server configuration to `config/servers.json`
4. Update documentation
5. Add npm scripts for the new server

See [Adding New Servers](docs/adding-servers.md) for detailed instructions.

## License

UNLICENSED - Private project







