# API Client Configuration Guide

## Overview

This project uses `@hey-api/openapi-ts` to auto-generate TypeScript API clients from the NestJS backend's Swagger/OpenAPI specification.

## ✅ The Problem We Solved

When using auto-generated clients in Next.js, a common issue is that API requests hit the Next.js dev server (port 9002) instead of the backend API (port 3001). This happens because:

1. The generated client doesn't know about your backend URL
2. Axios defaults to relative URLs (which resolve to the current browser location)
3. Next.js intercepts requests meant for the backend

## ✅ Our Solution

We implemented a **permanent, regeneration-proof** solution:

### 1. Custom Client Configuration (`src/lib/api/client.ts`)

- Creates a custom Axios instance with the correct `baseURL` (http://127.0.0.1:3001)
- Adds JWT token from `localStorage` to every request
- Handles 401 errors by clearing tokens and redirecting to login
- Logs every request for debugging

### 2. Wrapped SDK Functions (`src/lib/api/index.ts`)

- Wraps ALL auto-generated SDK functions to use our configured client
- Ensures every API call uses the correct backend URL
- Safe to regenerate - post-processing script maintains this file

### 3. Post-Generation Script (`scripts/post-generate-api.js`)

- Runs automatically after `npm run api:generate`
- Ensures `client.ts` and `index.ts` exist and are properly configured
- Prevents configuration loss on regeneration

## 🚀 Usage

### Generating API Clients

```bash
# Make sure backend is running on port 3001
npm run api:generate
```

This will:
1. Generate fresh API clients from backend Swagger
2. Run post-processing to ensure correct configuration
3. Maintain your custom client setup

### Importing API Functions

**✅ CORRECT - Always use:**
```typescript
import { authControllerLogin, userControllerGetProfile } from '@/lib/api';
```

**❌ WRONG - Never use:**
```typescript
import { authControllerLogin } from '@tiffinwale/sdk';  // Bypasses config!
import { authControllerLogin } from './generated/sdk.gen';  // Bypasses config!
```

### Example: Login Function

```typescript
import { authControllerLogin } from '@/lib/api';

const login = async (email: string, password: string) => {
  const { data, error } = await authControllerLogin({ 
    body: { email, password } 
  });
  
  if (error) {
    throw new Error('Login failed');
  }
  
  // Store token
  localStorage.setItem('token', data.token);
};
```

### Example: Using React Query Hooks

```typescript
import { useQuery } from '@tanstack/react-query';
import { superAdminControllerGetDashboardStatsOptions } from '@/lib/api';

function DashboardPage() {
  const { data, isLoading } = useQuery(
    superAdminControllerGetDashboardStatsOptions()
  );
  
  return <div>{data?.totalUsers}</div>;
}
```

## 🔧 Configuration Files

### `openapi-ts.config.ts`

Main configuration for the API client generator:

```typescript
export default defineConfig({
  client: '@hey-api/client-axios',
  input: 'http://localhost:3001/api-docs-json',
  output: {
    path: './src/lib/api/generated',
  },
  plugins: [
    '@hey-api/typescript',
    '@hey-api/sdk',
    '@tanstack/react-query',
  ],
});
```

### `.env`

**REQUIRED** - Configure your backend URL here:

```env
# LOCAL DEVELOPMENT (Backend on port 3001)
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3001

# PRODUCTION (Deployed backend)
# NEXT_PUBLIC_API_BASE_URL=https://api.tiffin-wale.com
```

**To switch environments:**
1. Comment/uncomment the appropriate URL in `.env`
2. Restart Next.js dev server: `npm run dev`

**Fallback**: If not set, defaults to `http://127.0.0.1:3001`

### `tsconfig.json`

Import aliases for cleaner imports:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@tiffinwale/api": ["./src/lib/api/generated/@tanstack/react-query.gen"],
      "@tiffinwale/types": ["./src/lib/api/generated/types.gen"],
    }
  }
}
```

## 🐛 Debugging

### Check API Request URLs

Open browser DevTools Console and look for:

```
🔧 API Client Configuration:
   - Base URL: http://127.0.0.1:3001
   - Next.js is on port 9002 (SHOULD NOT USE THIS!)

📡 API Request: POST http://127.0.0.1:3001/api/auth/login
🔑 JWT token added
✅ Response: 200 /api/auth/login
```

### Common Issues

**Issue: Still hitting port 9002**
- **Solution**: Check imports - make sure you're using `@/lib/api` not `@tiffinwale/sdk`

**Issue: 404 errors**
- **Solution**: Ensure backend is running on port 3001

**Issue: CORS errors**
- **Solution**: Backend must have CORS configured for `http://localhost:9002`

## 📝 Architecture

```
┌─────────────────────────────────────────────────────┐
│  Next.js Frontend (port 9002)                       │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  Your Code                                    │  │
│  │  import { authControllerLogin } from '@/lib/api' │
│  └────────────────┬─────────────────────────────┘  │
│                   │                                  │
│  ┌────────────────▼─────────────────────────────┐  │
│  │  src/lib/api/index.ts                        │  │
│  │  (Wraps SDK with configured client)          │  │
│  └────────────────┬─────────────────────────────┘  │
│                   │                                  │
│  ┌────────────────▼─────────────────────────────┐  │
│  │  src/lib/api/client.ts                       │  │
│  │  (Custom Axios with baseURL: 3001)           │  │
│  └────────────────┬─────────────────────────────┘  │
│                   │                                  │
│  ┌────────────────▼─────────────────────────────┐  │
│  │  src/lib/api/generated/sdk.gen.ts            │  │
│  │  (Auto-generated API functions)              │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ HTTP Request to http://127.0.0.1:3001
                   │
┌──────────────────▼──────────────────────────────────┐
│  NestJS Backend (port 3001)                         │
│  - Swagger/OpenAPI at /api-docs-json                │
│  - REST API endpoints                                │
└─────────────────────────────────────────────────────┘
```

## 🎯 Best Practices

1. **Always use `@/lib/api` for imports** - Never import directly from generated files
2. **Run `api:generate` after backend changes** - Keep types in sync
3. **Check console logs during development** - Verify correct URLs
4. **Use React Query hooks for data fetching** - Better caching and state management
5. **Handle errors gracefully** - All API functions return `{ data, error }`

## 🔄 Regeneration Safety

When you run `npm run api:generate`, the following happens:

1. ✅ `src/lib/api/generated/*` - Fully regenerated (safe)
2. ✅ `src/lib/api/client.ts` - Preserved (custom)
3. ✅ `src/lib/api/index.ts` - Preserved (custom)
4. ✅ Post-processing script runs - Validates setup

Your configuration is **100% safe from regeneration** because:
- Custom files are outside the `generated/` folder
- Post-processing script validates after each generation
- Import aliases point to your custom wrapper, not generated files

## 📚 Additional Resources

- [@hey-api/openapi-ts Documentation](https://heyapi.dev/openapi-ts)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/docs/intro)

