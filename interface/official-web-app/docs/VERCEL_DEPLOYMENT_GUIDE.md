# 🚀 Vercel Deployment Guide for TiffinWale Official Web App

## ✅ Pre-Deployment Checklist

### 1. Environment Configuration
- ✅ **API URL**: Updated to production (`https://api.tiffin-wale.com`)
- ✅ **Build System**: Converted to Bun package manager
- ✅ **Vercel Config**: Created `vercel.json` with proper settings
- ✅ **Build Test**: Local build successful with production API

### 2. Files Updated
- ✅ `.env` - Production API URL configured
- ✅ `package.json` - Bun scripts and package manager
- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `tsconfig.json` - Fixed TypeScript configuration
- ✅ `client/src/vite-env.d.ts` - Added Vite environment types

## 🚀 Deployment Steps

### Step 1: Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
# or
bun add -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy to Vercel
```bash
# For preview deployment
bun run preview:vercel

# For production deployment
bun run deploy:vercel
```

### Step 4: Configure Environment Variables in Vercel Dashboard
After deployment, go to your Vercel project dashboard and set these environment variables:

#### Production Environment Variables:
```
API_BASE_URL=https://api.tiffin-wale.com
VITE_CLOUDINARY_CLOUD_NAME=tiffinwale
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🔧 Vercel Configuration Details

### Build Settings
- **Build Command**: `bun run build`
- **Output Directory**: `dist/public`
- **Install Command**: `bun install`

### Environment Variables
The `vercel.json` file includes environment variables that will be used during build:
- `API_BASE_URL`: Points to production backend
- `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary configuration

### Routing Configuration
- **API Proxy**: Routes `/api/*` to `https://api.tiffin-wale.com/api/*`
- **SPA Fallback**: All other routes serve `index.html` for client-side routing

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: origin-when-cross-origin`

### Caching
- Static assets cached for 1 year with immutable flag
- Optimized for performance

## 🎯 Expected Deployment URL
After successful deployment, your app will be available at:
- **Preview**: `https://tiffin-wale-official-web-[hash].vercel.app`
- **Production**: `https://tiffin-wale-official-web.vercel.app` (after custom domain setup)

## 🔍 Post-Deployment Verification

### 1. Check API Connectivity
- Verify the app can connect to `https://api.tiffin-wale.com`
- Test authentication flows
- Verify data loading

### 2. Performance Check
- Run Lighthouse audit
- Check Core Web Vitals
- Verify build optimization

### 3. Functionality Test
- Test all major user flows
- Verify responsive design
- Check error handling

## 🛠️ Troubleshooting

### Common Issues:
1. **Build Failures**: Check Bun installation and dependencies
2. **API Connection**: Verify backend is accessible from Vercel
3. **Environment Variables**: Ensure all required vars are set in Vercel dashboard
4. **Routing Issues**: Check SPA fallback configuration

### Support Commands:
```bash
# Check environment configuration
bun run check:env

# Local build test
bun run build

# Preview deployment
bun run preview:vercel
```

## 📝 Notes
- The app is configured to use Bun for faster builds and package management
- All API calls are proxied through Vercel to the production backend
- Static assets are optimized and cached for performance
- TypeScript configuration is properly set up for Vite + Bun
