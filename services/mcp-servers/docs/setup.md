# Setup Guide

This guide will walk you through setting up MCP servers for use with Cursor IDE.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account or MongoDB instance
- Cursor IDE installed
- MongoDB connection string

## Step 1: Install Dependencies

Navigate to the `services/mcp-servers` directory and install dependencies:

```bash
cd services/mcp-servers
npm install
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and configure your MongoDB connection:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_READ_ONLY=true
MCP_LOG_LEVEL=info
MCP_TRANSPORT=stdio
```

**Important:** Never commit the `.env` file to git. It contains sensitive credentials.

## Step 3: Install MongoDB MCP Server Package

Install the official MongoDB MCP server package:

```bash
npm run mcp:mongodb:install
```

## Step 4: Build the Project

Compile TypeScript to JavaScript:

```bash
npm run build
```

This creates the `dist/` directory with compiled files.

## Step 5: Configure Cursor IDE

### Windows

1. Open Cursor IDE
2. Open settings:
   - Press `Ctrl + Shift + P`
   - Type "Preferences: Open User Settings (JSON)"
   - Press Enter

3. Add the MongoDB MCP server configuration:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "node",
      "args": [
        "D:\\Bachelor Food App\\Tiffin-Wale\\services\\mcp-servers\\dist\\servers\\mongodb\\index.js"
      ],
      "env": {
        "MONGODB_URI": "mongodb+srv://your-connection-string",
        "MONGODB_READ_ONLY": "true",
        "MCP_LOG_LEVEL": "info"
      }
    }
  }
}
```

**Important:** 
- Update the path to match your actual project location
- Replace `your-connection-string` with your actual MongoDB connection string
- Use forward slashes or escaped backslashes in the path

### macOS / Linux

1. Open Cursor IDE
2. Open settings:
   - Press `Cmd + Shift + P` (macOS) or `Ctrl + Shift + P` (Linux)
   - Type "Preferences: Open User Settings (JSON)"
   - Press Enter

3. Add the MongoDB MCP server configuration:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "node",
      "args": [
        "/path/to/project/services/mcp-servers/dist/servers/mongodb/index.js"
      ],
      "env": {
        "MONGODB_URI": "mongodb+srv://your-connection-string",
        "MONGODB_READ_ONLY": "true",
        "MCP_LOG_LEVEL": "info"
      }
    }
  }
}
```

## Step 6: Restart Cursor

Close and reopen Cursor IDE for the changes to take effect.

## Step 7: Verify Setup

1. Open Cursor IDE
2. Start a conversation with the AI
3. Try asking about your database:
   - "What collections exist in my MongoDB database?"
   - "Show me the schema of the users collection"
   - "Query the orders collection for recent orders"

If the MCP server is working correctly, Cursor should be able to access your database.

## Troubleshooting

### Server Not Starting

- Check that Node.js is in your PATH
- Verify the path to the compiled server is correct
- Check Cursor's developer console for errors (Help > Toggle Developer Tools)

### Connection Errors

- Verify your MongoDB connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure MongoDB credentials are valid
- Check firewall settings

### Environment Variables Not Loading

- Ensure `.env` file exists in `services/mcp-servers/`
- Verify environment variables are set correctly
- Check that paths use correct separators for your OS

### Path Issues on Windows

Use one of these formats:
- Forward slashes: `D:/path/to/file.js`
- Escaped backslashes: `D:\\path\\to\\file.js`
- Use `path.resolve()` or `path.join()` in Node.js scripts

## Next Steps

- Read the [Architecture Guide](architecture.md) to understand the system design
- See [Adding New Servers](adding-servers.md) to add more MCP servers
- Check [MongoDB Server README](../src/servers/mongodb/README.md) for MongoDB-specific features















