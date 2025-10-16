# DevOps & Deployment Scope - Official Web App

## 🎯 Scope Overview

The DevOps scope encompasses deployment, infrastructure, CI/CD, monitoring, and operational aspects of the TiffinWale Official Web Application across multiple platforms and environments.

## 🏗️ Deployment Architecture

### Multi-Platform Strategy
```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PLATFORMS                    │
├─────────────────────────────────────────────────────────────┤
│  PRIMARY: Vercel                                           │
│  ├── Frontend: Static site hosting                         │
│  ├── API: Serverless functions                             │
│  ├── CDN: Global edge network                              │
│  └── Analytics: Built-in monitoring                        │
├─────────────────────────────────────────────────────────────┤
│  ALTERNATIVE: Google Cloud Platform                        │
│  ├── App Engine: Managed application hosting               │
│  ├── Cloud Storage: Static asset storage                   │
│  ├── Cloud SQL: Database hosting                           │
│  └── Cloud CDN: Content delivery network                   │
├─────────────────────────────────────────────────────────────┤
│  CONTAINER: Docker                                         │
│  ├── Multi-stage builds                                    │
│  ├── Production optimization                               │
│  ├── Environment isolation                                 │
│  └── Scalable deployment                                   │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Vercel Deployment (Primary)

### Configuration (`vercel.json`)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public",
        "buildCommand": "bun run build"
      }
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.tiffin-wale.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### Deployment Process
1. **Build Command**: `bun run build`
2. **Output Directory**: `dist/public`
3. **API Proxy**: Backend service integration
4. **Static Assets**: CDN distribution
5. **Environment Variables**: Secure configuration

### Vercel Features
- **Automatic Deployments**: Git-based deployment triggers
- **Preview Deployments**: Branch-based preview URLs
- **Edge Functions**: Serverless API endpoints
- **Analytics**: Built-in performance monitoring
- **Custom Domains**: Domain mapping and SSL

### Deployment Commands
```bash
# Deploy to production
npm run deploy:vercel

# Create preview deployment
vercel

# View deployment status
vercel ls
```

## ☁️ Google Cloud Platform Deployment

### App Engine Configuration (`app.yaml`)
```yaml
runtime: nodejs20
service: tiffin-wale-web

env_variables:
  NODE_ENV: production
  DATABASE_URL: ${DATABASE_URL}
  CLOUDINARY_CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME}

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6

handlers:
- url: /api/.*
  script: auto
  secure: always

- url: /.*
  static_files: dist/public/index.html
  upload: dist/public/index.html
  secure: always
```

### GCP Deployment Process
1. **Build**: `npm run build:gcloud`
2. **Deploy**: `gcloud app deploy`
3. **Domain Setup**: Custom domain mapping
4. **SSL Certificate**: Automatic HTTPS

### GCP Services Integration
- **App Engine**: Application hosting
- **Cloud Storage**: Static asset storage
- **Cloud SQL**: Database hosting
- **Cloud CDN**: Content delivery
- **Cloud Monitoring**: Performance monitoring

### Deployment Commands
```bash
# Build for GCP
npm run build:gcloud

# Deploy to App Engine
npm run deploy:gcloud

# View deployment logs
gcloud app logs tail
```

## 🐳 Docker Deployment

### Dockerfile Structure
```dockerfile
# Multi-stage build for optimization
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 5000
CMD ["npm", "start"]
```

### Docker Compose Configuration
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./dist:/app/dist
    restart: unless-stopped
```

### Container Deployment
```bash
# Build Docker image
docker build -t tiffin-wale-web .

# Run container
docker run -p 5000:5000 tiffin-wale-web

# Docker Compose
docker-compose up -d
```

## 🔧 Build & Deployment Scripts

### Build Scripts (`scripts/`)
- `build-for-gcp.js` - Google Cloud optimized build
- `deploy.js` - Deployment automation
- `fix-missing-images.js` - Asset optimization
- `generate-sitemap.js` - SEO sitemap generation
- `setup-domains.js` - Domain configuration

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "bun run vite",
    "build": "bun run vite build",
    "build:server": "bun run vite build && bun run esbuild server/index.ts",
    "start": "NODE_ENV=production bun run dist/index.js",
    "build:gcloud": "bun run build && bun run fix:images && xcopy /E /I /Y dist\\public .\\gcloud\\public",
    "deploy:gcloud": "bun run build:gcloud && cd gcloud && gcloud app deploy app.yaml",
    "deploy:vercel": "vercel --prod",
    "vercel-build": "bun run build"
  }
}
```

## 🌍 Environment Management

### Environment Configuration
```typescript
// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// API configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
```

### Environment Variables
```bash
# Production
NODE_ENV=production
API_BASE_URL=https://api.tiffin-wale.com
DATABASE_URL=postgresql://...
CLOUDINARY_CLOUD_NAME=tiffinwale
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Development
NODE_ENV=development
API_BASE_URL=http://localhost:3001
DATABASE_URL=postgresql://localhost:5432/tiffinwale
```

### Environment-Specific Builds
- **Development**: Hot reload, debug mode, local API
- **Staging**: Production-like environment, test data
- **Production**: Optimized build, CDN, monitoring

## 📊 Monitoring & Analytics

### Vercel Analytics
```typescript
// Built-in analytics
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
```

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Real User Monitoring**: Actual user performance data
- **Error Tracking**: JavaScript error monitoring
- **API Monitoring**: Backend service health

### Logging Strategy
```typescript
// Structured logging
const log = (message: string, data?: any) => {
  console.log(`[${new Date().toISOString()}] ${message}`, data);
};

// API request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    log(`${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`);
  });
  next();
});
```

## 🔒 Security & Compliance

### Security Headers
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### SSL/TLS Configuration
- **Automatic HTTPS**: Platform-managed SSL certificates
- **HSTS**: HTTP Strict Transport Security
- **Certificate Transparency**: SSL certificate monitoring

### Data Protection
- **Environment Variables**: Secure configuration management
- **Database Security**: Connection encryption
- **API Security**: Rate limiting and validation

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### Deployment Triggers
- **Main Branch**: Automatic production deployment
- **Feature Branches**: Preview deployment
- **Pull Requests**: Staging deployment
- **Manual**: On-demand deployment

## 📱 Domain & DNS Management

### Domain Configuration
- **Primary Domain**: tiffin-wale.com
- **WWW Redirect**: www.tiffin-wale.com → tiffin-wale.com
- **API Subdomain**: api.tiffin-wale.com
- **CDN**: Global edge network

### DNS Records
```
A     tiffin-wale.com        → Vercel IP
CNAME www.tiffin-wale.com    → tiffin-wale.com
CNAME api.tiffin-wale.com    → Backend service
```

### SSL Certificate Management
- **Automatic Provisioning**: Platform-managed certificates
- **Certificate Renewal**: Automatic renewal process
- **Certificate Transparency**: Public certificate logging

## 🔧 Infrastructure as Code

### Terraform Configuration (Optional)
```hcl
# Infrastructure definition
resource "vercel_project" "tiffin_wale" {
  name      = "tiffin-wale-web"
  framework = "vite"
  
  environment = [
    {
      key    = "API_BASE_URL"
      value  = "https://api.tiffin-wale.com"
      target = ["production"]
    }
  ]
}
```

### Configuration Management
- **Environment Variables**: Secure storage and management
- **Secrets Management**: Encrypted configuration
- **Version Control**: Infrastructure configuration tracking

## 📈 Performance Optimization

### Build Optimization
```typescript
// Vite configuration
export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'wouter'],
          ui: ['@/components/ui'],
        },
      },
    },
  },
});
```

### CDN Configuration
- **Static Assets**: Long-term caching (1 year)
- **HTML Files**: Short-term caching (1 hour)
- **API Responses**: No caching
- **Image Optimization**: WebP format, responsive images

### Caching Strategy
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 🚨 Disaster Recovery

### Backup Strategy
- **Code**: Git repository with multiple remotes
- **Database**: Automated backups with point-in-time recovery
- **Assets**: CDN replication and backup
- **Configuration**: Version-controlled environment variables

### Recovery Procedures
1. **Code Recovery**: Git repository restoration
2. **Database Recovery**: Point-in-time database restoration
3. **Asset Recovery**: CDN asset restoration
4. **Configuration Recovery**: Environment variable restoration

## 📊 Cost Optimization

### Resource Optimization
- **Serverless Functions**: Pay-per-use pricing
- **CDN Usage**: Efficient asset delivery
- **Database Optimization**: Query optimization and indexing
- **Monitoring**: Resource usage tracking

### Cost Monitoring
- **Vercel**: Usage-based billing monitoring
- **Google Cloud**: Resource usage tracking
- **Database**: Query performance monitoring
- **CDN**: Bandwidth usage tracking

---

*This scope covers all DevOps and deployment aspects of the Official Web App. For development workflows, refer to the frontend-scope.md and backend-scope.md documentation.*

