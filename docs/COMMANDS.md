# TiffinWale Commands Reference

## Quick Start

First time setup:
```bash
pnpm install:all
```

Start development:
```bash
pnpm dev        # Backend + Official Web
pnpm dev:all    # All services
```

## All Available Commands

### Installation
- `pnpm install:all` - Install all dependencies for all apps
- `pnpm install:backend` - Backend only
- `pnpm install:frontend` - Official web app only
- `pnpm install:mobile` - Student app only
- `pnpm install:partner` - Partner app only
- `pnpm install:admin` - Admin dashboard only

### Development
- `pnpm dev` - Start backend + official web
- `pnpm dev:all` - Start all services
- `pnpm dev:web` - Backend + official web + admin
- `pnpm dev:mobile` - Backend + student app + partner app

### Backend Commands
- `pnpm backend` - Start production server
- `pnpm backend:dev` - Start with hot reload
- `pnpm backend:build` - Build for production
- `pnpm backend:test` - Run tests
- `pnpm backend:lint` - Lint code

### Frontend (Official Web) Commands
- `pnpm frontend` - Start dev server
- `pnpm frontend:dev` - Same as above
- `pnpm frontend:build` - Build for production
- `pnpm frontend:preview` - Preview build
- `pnpm frontend:check` - TypeScript checking

### Student App Commands
- `pnpm mobile` - Start Expo
- `pnpm mobile:dev` - Same as above
- `pnpm mobile:android` - Run on Android
- `pnpm mobile:ios` - Run on iOS
- `pnpm mobile:build:web` - Build web version
- `pnpm mobile:build:android` - Build Android
- `pnpm mobile:build:ios` - Build iOS
- `pnpm mobile:lint` - Lint code

### Partner App Commands
- `pnpm partner` - Start Expo
- `pnpm partner:dev` - Same as above
- `pnpm partner:build:web` - Build web version
- `pnpm partner:lint` - Lint code

### Admin Dashboard Commands
- `pnpm admin` - Start dev server
- `pnpm admin:dev` - Same as above
- `pnpm admin:build` - Build for production
- `pnpm admin:start` - Start production
- `pnpm admin:lint` - Lint code
- `pnpm admin:typecheck` - Type checking

### Build Commands
- `pnpm build` - Build backend + frontend
- `pnpm build:all` - Build all web apps
- `pnpm build:mobile` - Build mobile web versions

### Deployment
- `pnpm deploy:backend` - Deploy backend
- `pnpm deploy:frontend` - Deploy official web
- `pnpm deploy:mobile` - Deploy student app
- `pnpm deploy:partner` - Deploy partner app
- `pnpm deploy:admin` - Deploy admin
- `pnpm deploy:all` - Deploy everything
- `pnpm deploy:dispatch` - Deploy routing

### Utilities
- `pnpm clean` - Clean all artifacts
- `pnpm clean:modules` - Remove node_modules
- `pnpm clean:build` - Remove build files
- `pnpm clean:lock` - Remove lock files
- `pnpm reinstall` - Clean + install

### Testing & Quality
- `pnpm test` - Run backend tests
- `pnpm test:all` - Run all tests
- `pnpm lint` - Lint all apps 