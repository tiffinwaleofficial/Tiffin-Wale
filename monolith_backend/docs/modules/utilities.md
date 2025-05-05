# System Utilities Module

## Overview

The System Utilities Module provides essential infrastructure endpoints for monitoring, testing, and maintaining the TiffinMate application. These endpoints support operations like health checks, version tracking, and system diagnostics, which are crucial for ensuring the reliability and proper functioning of the application.

## Features

- **Health Monitoring**: Check system and service availability
- **Version Tracking**: Track and verify application versions
- **Diagnostic Tools**: Utilities for system troubleshooting
- **Performance Metrics**: Basic performance monitoring endpoints

## API Endpoints

### Server Health Check

**Endpoint**: `GET /api/ping`

**Description**: Check if the server is running and responsive

**Access Control**: 
- Public endpoint (no authentication required)

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2023-06-03T10:15:30.000Z",
  "uptime": 1234567, // in seconds
  "environment": "production",
  "message": "Server is healthy"
}
```

**Status Codes**:
- `200`: Server is healthy and operating normally
- `503`: Server is experiencing issues

### Application Version

**Endpoint**: `GET /api/version`

**Description**: Get the current version information of the application

**Access Control**: 
- Public endpoint (no authentication required)

**Response**:
```json
{
  "version": "1.2.3",
  "buildNumber": "20230603-1",
  "releaseDate": "2023-06-01T00:00:00.000Z",
  "environment": "production",
  "apiVersion": "v1",
  "commitHash": "a1b2c3d",
  "features": {
    "payments": true,
    "referrals": true,
    "subscriptions": false
  }
}
```

**Status Codes**:
- `200`: Version information returned successfully

## Additional Endpoints (Future Expansion)

### Database Health Check

**Endpoint**: `GET /api/health/db`

**Description**: Check if the database connection is healthy

**Access Control**: 
- Users with `ADMIN` or `SUPER_ADMIN` role

**Response**:
```json
{
  "status": "ok",
  "responseTime": 15, // in milliseconds
  "connections": 25,
  "message": "Database connection is healthy"
}
```

### Cache Health Check

**Endpoint**: `GET /api/health/cache`

**Description**: Check if the cache service is healthy

**Access Control**: 
- Users with `ADMIN` or `SUPER_ADMIN` role

**Response**:
```json
{
  "status": "ok",
  "responseTime": 5, // in milliseconds
  "message": "Cache service is healthy"
}
```

### System Status

**Endpoint**: `GET /api/health/system`

**Description**: Get comprehensive system status information

**Access Control**: 
- Users with `ADMIN` or `SUPER_ADMIN` role

**Response**:
```json
{
  "status": "ok",
  "server": {
    "uptime": 1234567, // in seconds
    "memory": {
      "total": 8589934592, // in bytes
      "used": 4294967296, // in bytes
      "free": 4294967296 // in bytes
    },
    "cpu": {
      "usage": 25.5 // percentage
    }
  },
  "database": {
    "status": "ok",
    "connections": 25,
    "responseTime": 15 // in milliseconds
  },
  "cache": {
    "status": "ok",
    "responseTime": 5 // in milliseconds
  },
  "services": {
    "notification": "ok",
    "payment": "ok",
    "sms": "degraded",
    "email": "ok"
  },
  "message": "All systems operational with minor degradation in SMS service"
}
```

## Usage Examples

### Implementing Health Checks in a Monitoring System

```typescript
// Monitoring service example
async function checkSystemHealth() {
  try {
    const response = await fetch('/api/ping');
    
    if (response.ok) {
      const health = await response.json();
      console.log(`System Status: ${health.status}, Uptime: ${formatUptime(health.uptime)}`);
      
      if (health.status === 'ok') {
        updateHealthMonitor('green');
      } else {
        updateHealthMonitor('yellow');
        alertDevTeam('System reporting degraded status');
      }
    } else {
      console.error('Health check failed:', await response.text());
      updateHealthMonitor('red');
      alertDevTeam('Health check endpoint returned error status');
    }
  } catch (error) {
    console.error('Error performing health check:', error);
    updateHealthMonitor('red');
    alertDevTeam('Health check endpoint unreachable');
  }
}

// Schedule health checks
setInterval(checkSystemHealth, 60000); // Check every minute
```

### Version Verification in Mobile App

```typescript
// Mobile app startup example
async function verifyAppVersion() {
  try {
    const response = await fetch('https://api.tiffinmate.com/api/version');
    
    if (response.ok) {
      const serverVersionInfo = await response.json();
      const clientVersion = getAppVersion(); // e.g., "1.2.0"
      
      // Compare versions
      if (compareVersions(clientVersion, serverVersionInfo.version) < 0) {
        // Client version is older than server version
        if (requiresUpdate(clientVersion, serverVersionInfo.version)) {
          showForceUpdateDialog();
        } else {
          showOptionalUpdateDialog();
        }
      } else {
        console.log('App version is up to date');
      }
      
      // Check for feature flags
      updateFeatureFlags(serverVersionInfo.features);
    } else {
      console.error('Failed to check version:', await response.text());
      // Continue with app startup but log the issue
    }
  } catch (error) {
    console.error('Error checking app version:', error);
    // Continue with app startup but log the issue
  }
}

// Call during app initialization
verifyAppVersion();
```

## Implementation Details

### Health Check Implementation

The health check endpoint performs the following checks:

1. Verifies that the application server is running
2. Checks basic connectivity to the database
3. Verifies memory usage is within acceptable limits
4. Ensures that critical services are responding
5. Returns a consolidated health status

The response time of the health check endpoint is kept minimal to ensure it can be called frequently by monitoring systems.

### Version Tracking

The version information returned by the `/api/version` endpoint includes:

- **version**: Semantic version (major.minor.patch)
- **buildNumber**: Unique identifier for the specific build
- **releaseDate**: When this version was released
- **environment**: Which environment the application is running in
- **apiVersion**: Version of the API contract
- **commitHash**: Git commit hash for traceability
- **features**: Feature flags indicating which features are enabled

This information helps with:
- Mobile app version compatibility checks
- Debugging issues specific to certain versions
- Feature flag management across platforms

## Dependencies

- System monitoring libraries for gathering health metrics
- Version management package for semantic versioning
- Configuration management for feature flags 