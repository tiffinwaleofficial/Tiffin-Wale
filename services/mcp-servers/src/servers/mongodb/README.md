# MongoDB MCP Server

MongoDB MCP Server provides direct access to your MongoDB database through Cursor IDE using the Model Context Protocol.

## Features

- **Direct Database Access**: Query and explore your MongoDB database directly from Cursor
- **Schema Exploration**: Automatically understand database structure and collections
- **Read-Only Mode**: Safe read-only access by default to prevent accidental modifications
- **Secure**: Uses environment variables for connection strings (never hardcoded)

## Configuration

The MongoDB MCP server is configured via environment variables:

- `MONGODB_URI` - MongoDB connection string (required)
- `MONGODB_READ_ONLY` - Enable read-only mode (default: true)
- `MCP_LOG_LEVEL` - Logging level (default: info)

## Usage

### Start the Server

```bash
# Development mode
npm run mcp:mongodb:dev

# Production mode (after build)
npm run mcp:mongodb:start
```

### Test Connection

```bash
npm run mcp:mongodb:test
```

## Integration with Cursor

Add the following to your Cursor settings (`%APPDATA%\Cursor\User\settings.json` on Windows):

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "node",
      "args": [
        "D:\\Bachelor Food App\\Tiffin-Wale\\services\\mcp-servers\\dist\\servers\\mongodb\\index.js"
      ],
      "env": {
        "MONGODB_URI": "mongodb+srv://...",
        "MONGODB_READ_ONLY": "true"
      }
    }
  }
}
```

## Security

- Always use read-only mode in development
- Store connection strings in `.env` file (never commit to git)
- Use MongoDB Atlas IP whitelist and authentication
- Regularly rotate database credentials


















