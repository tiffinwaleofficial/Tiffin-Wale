# PNPM Migration Guide for TiffinWale

## Overview
We have migrated the TiffinWale project from npm to pnpm for better performance, disk space efficiency, and improved monorepo management.

## Installation

### 1. Install pnpm globally
```bash
npm install -g pnpm
# or using corepack (recommended)
corepack enable
corepack prepare pnpm@latest --activate
```

### 2. Remove existing node_modules and lock files
```bash
# In project root
rm -rf node_modules package-lock.json
rm -rf monolith_backend/node_modules monolith_backend/package-lock.json
rm -rf interface/official-web-app/node_modules interface/official-web-app/package-lock.json
rm -rf interface/student-app/node_modules interface/student-app/package-lock.json
rm -rf interface/partner-app/node_modules interface/partner-app/package-lock.json
rm -rf interface/super-admin-web/node_modules interface/super-admin-web/package-lock.json
```

### 3. Install all dependencies
```bash
# From project root
pnpm install:all
```

## Key Changes

### Command Replacements
- `npm install` → `pnpm install`
- `npm run` → `pnpm run` or just `pnpm`
- `npx` → `pnpm dlx`
- `npm ci` → `pnpm install --frozen-lockfile`

### Updated Scripts
All package.json scripts have been updated to use pnpm:
- Root commands now use `pnpm run` instead of `npm run`
- Build scripts use `pnpm` for all operations
- Deployment scripts updated for Google Cloud Platform

### Workspace Configuration
- Added `pnpm-workspace.yaml` for monorepo management
- Added `.npmrc` with pnpm-specific configurations
- Configured for better dependency hoisting and peer dependency handling

## Common Commands

### Development
```bash
# Start backend only
pnpm backend:dev

# Start frontend only
pnpm frontend:dev

# Start both backend and frontend
pnpm both:dev

# Start all services (backend, frontend, mobile)
pnpm all:dev
```

### Building
```bash
# Build backend
pnpm backend:build

# Build frontend
pnpm frontend:build

# Build both
pnpm both:build
```

### Mobile Development
```bash
# Start mobile app
pnpm mobile:dev

# Build for web
pnpm mobile:build:web

# Build for Android
pnpm mobile:build:android

# Build for iOS
pnpm mobile:build:ios
```

### Deployment
```bash
# Deploy mobile app
pnpm deploy:mobile

# Deploy frontend
pnpm deploy:frontend

# Deploy all services
pnpm deploy:all
```

## Benefits of pnpm

1. **Disk Space Efficiency**: pnpm uses a content-addressable store, saving significant disk space
2. **Faster Installations**: Parallel installation and linking from global store
3. **Strict Dependency Resolution**: Prevents phantom dependencies
4. **Better Monorepo Support**: Native workspace support with shared dependencies
5. **Security**: Stricter package isolation

## Troubleshooting

### Issue: Command not found
```bash
# Ensure pnpm is in PATH
which pnpm
# If not found, reinstall globally
npm install -g pnpm
```

### Issue: Permission errors
```bash
# On Unix systems, you might need to use sudo
sudo pnpm install -g <package>
```

### Issue: Peer dependency warnings
The `.npmrc` file is configured to handle peer dependencies automatically. If issues persist:
```bash
pnpm install --shamefully-hoist
```

### Issue: Build failures on CI/CD
Update your CI/CD pipelines to:
1. Install pnpm before running scripts
2. Use `pnpm install --frozen-lockfile` for reproducible builds

## CI/CD Updates Required

### GitHub Actions Example
```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

### Google Cloud Build
Update `cloudbuild.yaml` to install pnpm:
```yaml
steps:
  - name: 'node:20'
    entrypoint: npm
    args: ['install', '-g', 'pnpm']
  
  - name: 'node:20'
    entrypoint: pnpm
    args: ['install', '--frozen-lockfile']
```

## Migration Checklist

- [x] Update all package.json files to use pnpm commands
- [x] Create pnpm-workspace.yaml
- [x] Create .npmrc with pnpm configurations
- [x] Update deployment scripts (app.yaml files)
- [x] Update build scripts
- [ ] Update CI/CD pipelines
- [ ] Update developer documentation
- [ ] Test all commands locally
- [ ] Deploy and verify on staging environment

## Resources

- [pnpm Documentation](https://pnpm.io/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Migration from npm/yarn](https://pnpm.io/motivation#migrating-from-npm-or-yarn)

---

For any issues or questions during migration, please refer to the pnpm documentation or contact the development team. 