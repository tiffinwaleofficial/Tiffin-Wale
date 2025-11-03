# Cursor Integration Guide

This guide explains how to integrate MCP servers with Cursor IDE.

## Overview

Cursor IDE supports MCP (Model Context Protocol) servers through its settings configuration. Each MCP server runs as a separate process and communicates with Cursor via stdio transport.

## Configuration Methods

### Method 1: Auto-Generate Configuration

Use the provided script to generate Cursor configuration from the server registry:

```bash
npm run build
npm run generate:cursor-config
```

This creates `config/cursor-config-generated.json` with all enabled servers configured.

### Method 2: Manual Configuration

Manually add MCP server configuration to your Cursor settings.

## Cursor Settings Location

### Windows
```
%APPDATA%\Cursor\User\settings.json
```

Example: `C:\Users\YourName\AppData\Roaming\Cursor\User\settings.json`

### macOS
```
~/Library/Application Support/Cursor/User/settings.json
```

### Linux
```
~/.config/Cursor/User/settings.json
```

## Configuration Format

Add the `mcpServers` section to your Cursor settings.json:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "node",
      "args": [
        "D:\\Bachelor Food App\\Tiffin-Wale\\services\\mcp-servers\\dist\\servers\\mongodb\\index.js"
      ],
      "env": {
        "MONGODB_URI": "mongodb+srv://username:password@cluster.mongodb.net/database",
        "MONGODB_READ_ONLY": "true",
        "MCP_LOG_LEVEL": "info"
      }
    }
  }
}
```

## Server Configuration Structure

Each server entry contains:

- **command**: Command to execute (usually `node` or `npx`)
- **args**: Array of command-line arguments
- **env**: Environment variables for the server process

## Path Configuration

### Windows Paths

Use one of these formats:
- Forward slashes: `D:/path/to/file.js`
- Escaped backslashes: `D:\\path\\to\\file.js`
- Raw backslashes (sometimes): `D:\path\to\file.js`

### macOS/Linux Paths

Use standard Unix paths:
```json
"/Users/username/project/services/mcp-servers/dist/servers/mongodb/index.js"
```

## Environment Variables

### Security Best Practices

1. **Use Environment Variables**: Store sensitive values in your system environment variables

2. **Use Secrets Management**: For production, consider using:
   - Windows: Environment Variables (System Properties)
   - macOS/Linux: Shell profile (`~/.bashrc`, `~/.zshrc`)

3. **Never Commit Secrets**: Never put API keys or connection strings directly in settings.json if committed to git

### Recommended Approach

1. Set environment variables in your shell/profile
2. Reference them in Cursor config:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "node",
      "args": ["..."],
      "env": {
        "MONGODB_URI": "${MONGODB_URI}",
        "MONGODB_READ_ONLY": "true"
      }
    }
  }
}
```

Note: Cursor may not expand `${VAR}` syntax. Use actual values or set in shell environment.

## Adding Multiple Servers

Add each server as a separate entry in `mcpServers`:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "node",
      "args": ["..."],
      "env": { ... }
    },
    "redis": {
      "command": "node",
      "args": ["..."],
      "env": { ... }
    }
  }
}
```

## Verifying Configuration

### Check Server Status

1. Open Cursor IDE
2. Open Developer Console: `Help > Toggle Developer Tools`
3. Check for MCP server connection messages
4. Look for any error messages

### Test Server Access

Try asking Cursor:
- "What collections are in my MongoDB database?"
- "Show me the schema of the users collection"
- "Query the orders collection"

If the server is working, Cursor should be able to access your database.

## Troubleshooting

### Server Not Starting

**Symptoms:**
- Cursor shows errors in developer console
- MCP server doesn't respond to queries

**Solutions:**
1. Verify Node.js is in PATH: `node --version`
2. Check the path to the server script is correct
3. Verify the script exists: `ls dist/servers/mongodb/index.js`
4. Check file permissions
5. Review Cursor developer console for errors

### Path Issues

**Symptoms:**
- "Cannot find module" errors
- Server fails to start

**Solutions:**
1. Use absolute paths (not relative)
2. Verify path separators match your OS
3. Escape backslashes on Windows: `\\`
4. Use forward slashes on Windows: `/`

### Environment Variable Issues

**Symptoms:**
- Connection errors
- Authentication failures

**Solutions:**
1. Verify environment variables are set correctly
2. Check variable names match exactly
3. Ensure values don't have extra spaces
4. Use quotes for values with special characters

### JSON Syntax Errors

**Symptoms:**
- Cursor settings won't load
- Configuration errors

**Solutions:**
1. Validate JSON syntax
2. Ensure trailing commas are removed
3. Check quotes are properly escaped
4. Use a JSON validator

## Updating Configuration

After making changes:

1. Save `settings.json`
2. Reload Cursor window: `Ctrl/Cmd + Shift + P` > "Developer: Reload Window"
3. Or restart Cursor IDE

## Disabling Servers

To temporarily disable a server:

1. Remove it from `mcpServers` object
2. Or comment it out (if Cursor supports comments)
3. Reload Cursor

## Removing Servers

To permanently remove a server:

1. Remove the server entry from `mcpServers`
2. Reload Cursor
3. Optionally uninstall the server package

## Advanced Configuration

### Custom Commands

You can use custom commands instead of `node`:

```json
{
  "mcpServers": {
    "custom": {
      "command": "npx",
      "args": ["-y", "custom-mcp-server@latest"]
    }
  }
}
```

### Logging

Enable debug logging by setting:

```json
{
  "mcpServers": {
    "mongodb": {
      "env": {
        "MCP_LOG_LEVEL": "debug"
      }
    }
  }
}
```

### Multiple Environments

Use separate Cursor settings for different environments:

- Development: Direct connection strings
- Production: Reference environment variables

## Resources

- [Cursor MCP Documentation](https://cursor.sh/docs)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Setup Guide](setup.md) - Initial setup instructions
- [Architecture Guide](architecture.md) - System design overview


















