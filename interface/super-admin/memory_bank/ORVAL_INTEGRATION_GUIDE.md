# Complete Orval Integration Guide

This document provides a complete, tested Orval integration setup that works correctly for generating API clients from OpenAPI/Swagger specifications.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Configuration Files](#configuration-files)
4. [Swagger Generation](#swagger-generation)
5. [Orval Configuration](#orval-configuration)
6. [Custom Instance Templates](#custom-instance-templates)
7. [Package Scripts](#package-scripts)
8. [Client Generation Workflow](#client-generation-workflow)
9. [Critical Success Factors](#critical-success-factors)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Dependencies

Install Orval and text-case package at the root level:

```json
{
  "dependencies": {
    "orval": "6.24.0",
    "text-case": "^1.0.9"
  }
}
```

**Critical**: Use exact version `6.24.0` of Orval. Different versions may have breaking changes.

### Node.js Version
- Ensure you're using Node.js `21.6.1` (or compatible version)
- Package manager: `pnpm@8.7.6` (works with npm/yarn but tested with pnpm)

---

## Project Structure

Each API service should have this structure:

```
your-api/
├── src/
│   └── config/
│       └── apiDocs/
│           ├── fullGen.ts          # Generates full swagger.json (with entities)
│           └── nonEntityGen.ts     # Generates swagger-api.json (without entities)
├── swagger/
│   ├── swagger.json                 # Full OpenAPI spec (for UI clients)
│   └── swagger-api.json             # Non-entity spec (for API clients)
├── resources/
│   └── templates/
│       └── client/
│           ├── custom-instance-api.ts   # Template for RPC/API client
│           └── custom-instance-ui.ts    # Template for React Query/UI client
├── orval.api.config.js              # Orval config for API client generation
├── orval.ui.config.js               # Orval config for UI client generation
└── package.json
```

---

## Swagger Generation

### Step 1: Create Swagger Generation Scripts

**File: `src/config/apiDocs/fullGen.ts`**
```typescript
import fs from 'fs';
import { retrieveSpec } from '../../app';

fs.writeFileSync('./swagger/swagger.json', JSON.stringify(retrieveSpec()), {});
```

**File: `src/config/apiDocs/nonEntityGen.ts`**
```typescript
import fs from 'fs';
import { retrieveNonEntitySpec } from '../../app';

fs.writeFileSync('./swagger/swagger-api.json', JSON.stringify(retrieveNonEntitySpec()), {});
```

**Critical**: Your `app.ts` must export:
- `retrieveSpec()` - Returns full OpenAPI spec
- `retrieveNonEntitySpec()` - Returns spec without entity schemas

These functions should return valid OpenAPI 3.x JSON objects.

### Step 2: Generate Swagger Files

Before running Orval, you MUST generate the swagger files:

```bash
# Generate swagger files
pnpm run spec:full-gen       # Generates swagger.json
pnpm run spec:non-entity-gen # Generates swagger-api.json
```

**Order matters**: Always generate swagger files BEFORE running Orval.

---

## Orval Configuration

### API Client Configuration (`orval.api.config.js`)

**File: `orval.api.config.js`**
```javascript
const { camelCase } = require('text-case');

module.exports = {
  ApiClient: {
    output: {
      mode: 'tags',
      target: '../../../libraries/clients/rpc-clients/platform/your-api-name',
      schemas: '../../../libraries/clients/rpc-clients/platform/your-api-name/model',
      client: 'axios',
      mock: false,
      override: {
        title: (title) => camelCase(`${title}Rpc`),
        useDates: true,
        mutator: {
          path: '../../../libraries/clients/rpc-clients/platform/your-api-name/custom-instance-api.ts',
          name: 'factoryInstance'
        },
        components: {
          schemas: {
            suffix: 'Interface'
          }
        }
      }
    },
    input: {
      target: './swagger/swagger-api.json'
    }
  }
};
```

**Key Configuration Points:**
- `mode: 'tags'` - Groups operations by tags
- `client: 'axios'` - Generates Axios-based client
- `useDates: true` - Enables date handling
- `title: (title) => camelCase(\`${title}Rpc\`)` - Renames client class (e.g., `CoreRpc`)
- `suffix: 'Interface'` - All interfaces end with `Interface`
- `input.target` - Points to the generated swagger file

### UI Client Configuration (`orval.ui.config.js`)

**File: `orval.ui.config.js`**
```javascript
module.exports = {
  uiClient: {
    output: {
      mode: 'tags',
      target: '../../../libraries/clients/ui-clients/platform/your-api-name',
      schemas: '../../../libraries/clients/ui-clients/platform/your-api-name/model',
      client: 'react-query',
      mock: false,
      override: {
        useDates: true,
        operations: {
          GetQuery: {
            query: {
              useQuery: true
            }
          }
        },
        mutator: {
          path: '../../../libraries/clients/ui-clients/platform/your-api-name/custom-instance-ui.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: './swagger/swagger.json'
    }
  }
};
```

**Key Configuration Points:**
- `client: 'react-query'` - Generates React Query hooks
- `useQuery: true` for GetQuery operations - Automatically uses useQuery hooks
- `input.target` - Uses the full swagger.json (with entities)

---

## Custom Instance Templates

### API Client Template (`resources/templates/client/custom-instance-api.ts`)

This template is copied to the output directory and then modified by post-processing scripts.

```typescript
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Service } from 'typedi';

const isObject = function (a: any) {
  return !!a && a.constructor === Object;
};

const getParams = (params: any) => {
  const newObj = params;
  if (isObject(newObj)) {
    for (const [key, value] of Object.entries(newObj)) {
      if (isObject(value) || Array.isArray(value)) {
        newObj[key] = JSON.stringify(value);
      }
    }
  }
  return newObj;
};

@Service()
export class AxiosFactory {
  public axiosInstance: AxiosInstance;

  public baseConfig: Partial<AxiosRequestConfig> = {
    baseURL: process.env.YOUR_API_URL  // Change per API
    // ... other config
  };

  constructor() {
    const axios = Axios.create();
    axios.interceptors.response.use(undefined, function (error) {
      return Promise.reject(error);
    });
    this.axiosInstance = axios;
  }
}

export const factoryInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const { axiosInstance, baseConfig } = new AxiosFactory();
  const source = Axios.CancelToken.source();

  const promise = axiosInstance({
    ...config,
    cancelToken: source.token,
    params: getParams(config.params),
    ...baseConfig
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};
```

**Critical**: 
- The `factoryInstance` function signature must match what Orval expects
- Template will be modified post-generation (transaction ID injection, etc.)

### UI Client Template (`resources/templates/client/custom-instance-ui.ts`)

```typescript
import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create();

AXIOS_INSTANCE.interceptors.response.use(undefined, function (error) {
  return Promise.reject(error);
});

const isObject = function (a: any) {
  return !!a && a.constructor === Object;
};

const getParams = (params: any) => {
  const newObj = params;
  if (isObject(newObj)) {
    for (const [key, value] of Object.entries(newObj)) {
      if (isObject(value) || Array.isArray(value)) {
        newObj[key] = JSON.stringify(value);
      }
    }
  }
  return newObj;
};

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,
    //@ts-ignore
    baseURL: import.meta.env.VITE_YOUR_API_URL,  // Change per API
    cancelToken: source.token,
    params: getParams(config.params)
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};
```

**Critical**:
- Must use `import.meta.env` for Vite-based projects
- Function name must be `customInstance` (matches Orval config)

---

## Package Scripts

Add these scripts to each API's `package.json`:

```json
{
  "scripts": {
    "spec:full-gen": "ts-node src/config/apiDocs/fullGen.ts",
    "spec:non-entity-gen": "ts-node src/config/apiDocs/nonEntityGen.ts",
    "client-gen": "pnpm run client-ui && pnpm run client-api",
    "client-ui": "orval --config ./orval.ui.config.js",
    "client-api": "orval --config ./orval.api.config.js"
  }
}
```

### Root-Level Scripts (Optional but Recommended)

For monorepos, add to root `package.json`:

```json
{
  "scripts": {
    "spec-gen": "pnpm --if-present --parallel --filter \"@your-org/*-api\" spec:full-gen",
    "spec-gen:linear": "pnpm --if-present --filter \"@your-org/*-api\" spec:full-gen",
    "client-gen": "pnpm run spec-gen && pnpm run postspec-client-gen-api && pnpm run postspec-client-gen-ui",
    "postspec-client-gen-api": "ts-node resources/scripts/clients/api-client.ts",
    "postspec-client-gen-ui": "pnpm --if-present --parallel --filter \"@your-org/*-api\" client-ui",
    "client-gen-ui": "pnpm run spec-gen && pnpm run postspec-client-gen-ui"
  }
}
```

---

## Client Generation Workflow

### Complete Workflow (Step-by-Step)

1. **Generate Swagger Specifications**
   ```bash
   cd packages/platform/your-api
   pnpm run spec:full-gen      # Creates swagger/swagger.json
   pnpm run spec:non-entity-gen # Creates swagger/swagger-api.json
   ```

2. **Generate UI Client** (React Query)
   ```bash
   pnpm run client-ui
   ```
   - Reads `./swagger/swagger.json`
   - Outputs to `libraries/clients/ui-clients/platform/your-api`
   - Uses `custom-instance-ui.ts` mutator

3. **Generate API Client** (Axios RPC)
   ```bash
   pnpm run client-api
   ```
   - Reads `./swagger/swagger-api.json`
   - Outputs to `libraries/clients/rpc-clients/platform/your-api`
   - Uses `custom-instance-api.ts` mutator

### Critical Order:
```
swagger generation → UI client → API client
```

---

## Critical Success Factors

### 1. Swagger File Validity
- ✅ Swagger files MUST be valid OpenAPI 3.x JSON
- ✅ Files MUST exist before Orval runs
- ✅ Check swagger files: `JSON.parse(fs.readFileSync('./swagger/swagger.json'))`

### 2. File Paths
- ✅ All paths in Orval configs are RELATIVE to the config file location
- ✅ Use `../../../` to go up from `packages/platform/your-api/` to root
- ✅ Output directories must exist OR Orval will create them

### 3. Mutator Configuration
- ✅ `mutator.path` must point to an EXISTING file (or will be created)
- ✅ Function name in mutator must match export in custom-instance file
- ✅ Mutator function signature: `<T>(config: AxiosRequestConfig): Promise<T>`

### 4. Dependencies
- ✅ `text-case` package required for `camelCase` function
- ✅ Orval version must be exactly `6.24.0`
- ✅ `axios` and `react-query` must be installed where clients are used

### 5. TypeScript Configuration
- ✅ Generated clients need proper `tsconfig.json` extending root config
- ✅ `composite: true` and `declaration: true` for TypeScript project references

### 6. Environment Variables
- ✅ API client: `process.env.YOUR_API_URL` must be set
- ✅ UI client: `import.meta.env.VITE_YOUR_API_URL` must be set (Vite)

---

## Troubleshooting

### Problem: Orval generates empty files or errors

**Solution:**
1. Verify swagger files exist and are valid JSON:
   ```bash
   node -e "console.log(JSON.parse(require('fs').readFileSync('./swagger/swagger.json')))"
   ```

2. Check Orval version:
   ```bash
   pnpm list orval
   ```
   Must be `6.24.0`

3. Verify paths in config files are correct (relative to config file location)

### Problem: Generated client has wrong function names

**Solution:**
- Check `title` override in `orval.api.config.js`:
  ```javascript
  title: (title) => camelCase(`${title}Rpc`)
  ```
- Verify `text-case` package is installed

### Problem: Mutator not found error

**Solution:**
1. Ensure custom-instance file exists at the path specified in `mutator.path`
2. Verify function name matches (`factoryInstance` or `customInstance`)
3. Check file is properly exported:
   ```typescript
   export const factoryInstance = <T>(...) => ...
   ```

### Problem: Type errors in generated code

**Solution:**
1. Verify `useDates: true` is set in override
2. Check swagger spec has proper date-time formats
3. Ensure TypeScript config extends root with proper settings

### Problem: Client generation hangs or fails silently

**Solution:**
1. Run Orval with verbose output:
   ```bash
   DEBUG=* pnpm run client-ui
   ```
2. Check file permissions on output directories
3. Verify disk space available

### Problem: React Query hooks not generated

**Solution:**
1. Verify `client: 'react-query'` in `orval.ui.config.js`
2. Check `operations.GetQuery.query.useQuery: true` is set
3. Ensure swagger tags include operations marked as GET

---

## Verification Checklist

After setup, verify:

- [ ] Orval `6.24.0` installed in dependencies
- [ ] `text-case` package installed
- [ ] Swagger generation scripts create valid JSON files
- [ ] `orval.api.config.js` exists and paths are correct
- [ ] `orval.ui.config.js` exists and paths are correct
- [ ] Custom instance templates exist in `resources/templates/client/`
- [ ] Package scripts include `client-ui` and `client-api`
- [ ] Output directories are writable
- [ ] Generated clients compile without errors
- [ ] Mutator functions match config names

---

## Example: Complete Setup for New API

1. Create API structure with swagger generation
2. Create `orval.api.config.js`:
   ```javascript
   const { camelCase } = require('text-case');
   module.exports = {
     ApiClient: {
       output: {
         mode: 'tags',
         target: '../../../libraries/clients/rpc-clients/platform/my-api',
         schemas: '../../../libraries/clients/rpc-clients/platform/my-api/model',
         client: 'axios',
         mock: false,
         override: {
           title: (title) => camelCase(`${title}Rpc`),
           useDates: true,
           mutator: {
             path: '../../../libraries/clients/rpc-clients/platform/my-api/custom-instance-api.ts',
             name: 'factoryInstance'
           },
           components: { schemas: { suffix: 'Interface' } }
         }
       },
       input: { target: './swagger/swagger-api.json' }
     }
   };
   ```

3. Create `orval.ui.config.js`:
   ```javascript
   module.exports = {
     uiClient: {
       output: {
         mode: 'tags',
         target: '../../../libraries/clients/ui-clients/platform/my-api',
         schemas: '../../../libraries/clients/ui-clients/platform/my-api/model',
         client: 'react-query',
         mock: false,
         override: {
           useDates: true,
           operations: { GetQuery: { query: { useQuery: true } } },
           mutator: {
             path: '../../../libraries/clients/ui-clients/platform/my-api/custom-instance-ui.ts',
             name: 'customInstance'
           }
         }
       },
       input: { target: './swagger/swagger.json' }
     }
   };
   ```

4. Run generation:
   ```bash
   pnpm run spec:full-gen
   pnpm run spec:non-entity-gen
   pnpm run client-ui
   pnpm run client-api
   ```

---

## Summary

**The three critical components that make Orval work:**

1. **Valid Swagger Files**: Must be generated BEFORE Orval runs, must be valid OpenAPI 3.x JSON
2. **Correct Paths**: All paths in configs are relative to config file location, output directories must exist or be creatable
3. **Proper Mutators**: Custom instance files must exist, function names must match config, signatures must be correct

**Version Lock:**
- Orval: `6.24.0` (exact version)
- text-case: `^1.0.9`

**Generation Order:**
```
Swagger Gen → UI Client → API Client
```

Following this guide exactly will result in a working Orval integration that generates type-safe clients from your OpenAPI specifications.

