# TiffinWale Commands Guide

This guide provides a comprehensive overview of all available commands in the TiffinWale monorepo.

## 📦 Installation Commands

### Install Everything
```bash
pnpm install:all
```
This command will:
1. Install root dependencies
2. Install backend dependencies
3. Install all frontend app dependencies (official-web, student-app, partner-app, super-admin)

### Individual Installation
```bash
pnpm install:backend    # Install backend dependencies only
pnpm install:frontend   # Install official web app dependencies
pnpm install:mobile     # Install student app dependencies
pnpm install:partner    # Install partner app dependencies
pnpm install:admin      # Install admin dashboard dependencies
```

## 🚀 Development Commands

### Quick Start Commands
```bash
pnpm dev          # Start backend + official web (most common)
pnpm dev:all      # Start ALL services (backend + all frontends)
pnpm dev:web      # Start backend + official web + admin
pnpm dev:mobile   # Start backend + student app + partner app
```

### Individual Service Commands

#### Backend
```bash
pnpm backend        # Start backend in production mode
pnpm backend:dev    # Start backend in development mode (with hot reload)
pnpm backend:build  # Build backend for production
pnpm backend:test   # Run backend tests
pnpm backend:lint   # Lint backend code
```

#### Official Web App
```bash
pnpm frontend         # Start frontend dev server
pnpm frontend:dev     # Same as above
pnpm frontend:build   # Build for production
pnpm frontend:preview # Preview production build
pnpm frontend:check   # TypeScript type checking
```

#### Student Mobile App
```bash
pnpm mobile              # Start Expo dev server
pnpm mobile:dev          # Same as above
pnpm mobile:android      # Run on Android device/emulator
pnpm mobile:ios          # Run on iOS device/simulator
pnpm mobile:build:web    # Build web version
pnpm mobile:build:android # Build Android APK/AAB
pnpm mobile:build:ios    # Build iOS IPA
pnpm mobile:lint         # Lint mobile app code
```

#### Partner App
```bash
pnpm partner           # Start Partner app dev server
pnpm partner:dev       # Same as above
pnpm partner:build:web # Build web version
pnpm partner:lint      # Lint partner app code
```

#### Admin Dashboard
```bash
pnpm admin           # Start admin dashboard dev server
pnpm admin:dev       # Same as above
pnpm admin:build     # Build for production
pnpm admin:start     # Start production server
pnpm admin:lint      # Lint admin code
pnpm admin:typecheck # Run TypeScript type checking
```

## 🏗️ Build Commands

```bash
pnpm build        # Build backend + official web
pnpm build:all    # Build backend + official web + admin
pnpm build:mobile # Build web versions of mobile apps
```

## 🚢 Deployment Commands

### Individual Deployments
```bash
pnpm deploy:backend   # Deploy backend to Google App Engine
pnpm deploy:frontend  # Build and deploy official web app
pnpm deploy:mobile    # Build and deploy student app
pnpm deploy:partner   # Build and deploy partner app
pnpm deploy:admin     # Build and deploy admin dashboard
pnpm deploy:dispatch  # Deploy routing configuration
```

### Full Deployment
```bash
pnpm deploy:all  # Deploy all services + dispatch.yaml
```

## 🧹 Utility Commands

### Cleaning
```bash
pnpm clean          # Remove all node_modules and build artifacts
pnpm clean:modules  # Remove all node_modules directories
pnpm clean:build    # Remove all build/dist directories
pnpm clean:lock     # Remove all pnpm-lock.yaml files
pnpm reinstall      # Clean everything and reinstall
```

## 🧪 Testing & Linting

```bash
pnpm test      # Run backend tests
pnpm test:all  # Run all available tests
pnpm lint      # Run linting for all apps
```

## 📝 Common Workflows

### Starting Fresh
```bash
# Clean install everything
pnpm reinstall

# Or manually:
pnpm clean
pnpm install:all
```

### Daily Development
```bash
# Backend + Official Web
pnpm dev

# Everything
pnpm dev:all
```

### Before Committing
```bash
# Run linting
pnpm lint

# Run tests
pnpm test
```

### Deployment
```bash
# Deploy everything
pnpm deploy:all

# Deploy specific service
pnpm deploy:frontend  # or backend, mobile, partner, admin
```

## 🔧 Troubleshooting

### If installation fails
```bash
# Clean everything and try again
pnpm clean
pnpm install:all
```

### If a service won't start
```bash
# Check individual service
cd monolith_backend  # or relevant directory
pnpm install
pnpm dev
```

### Windows-specific issues
Some commands use Unix-style paths. On Windows, you might need to:
1. Use Git Bash or WSL
2. Or modify commands for Windows compatibility

## 📌 Quick Reference

| Task | Command |
|------|---------|
| Install everything | `pnpm install:all` |
| Start backend + web | `pnpm dev` |
| Start everything | `pnpm dev:all` |
| Build for production | `pnpm build:all` |
| Deploy all services | `pnpm deploy:all` |
| Clean and reinstall | `pnpm reinstall` |
| Run all tests | `pnpm test:all` |
| Lint all code | `pnpm lint` |

## 🎯 Pro Tips

1. **Use workspace commands**: Since we're using pnpm workspaces, you can also run commands from the root using `-r` flag:
   ```bash
   pnpm -r build  # Build all packages
   ```

2. **Filter commands**: You can filter which packages to run commands on:
   ```bash
   pnpm -F monolith_backend dev  # Run dev in backend only
   ```

3. **Parallel execution**: Many commands use `concurrently` for parallel execution, making them faster.

4. **Check package.json**: For the most up-to-date commands, always check the root `package.json` file.

---

For more details about specific services, check their individual README files in their respective directories. 