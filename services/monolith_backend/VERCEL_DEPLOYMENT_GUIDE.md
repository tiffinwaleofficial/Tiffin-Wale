# 🚀 Vercel Deployment Guide for TiffinWale Backend

## ✅ Pre-Deployment Checklist

All configurations have been optimized for Vercel deployment:

- ✅ `vercel.json` configured for serverless functions
- ✅ `package.json` scripts optimized for Vercel
- ✅ `api/index.ts` optimized for performance
- ✅ TypeScript compilation handled automatically

## 🔧 Vercel Project Settings

When creating your new Vercel project, use these **EXACT** settings:

### **Build & Development Settings**
```
Root Directory: monolith_backend/
Build Command: (leave empty - auto-detected)
Output Directory: (leave empty - auto-detected)  
Install Command: bun install
Development Command: (leave empty)
```

### **Framework Preset**
```
Framework Preset: Other
```

## 🌍 Environment Variables Required

Set these in your Vercel project dashboard:

### **Database**
```
MONGODB_URI=mongodb+srv://your-connection-string
```

### **Authentication**
```
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

### **Email Service (Resend)**
```
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com
```

### **App Configuration**
```
NODE_ENV=production
API_PREFIX=api
SWAGGER_TITLE=TiffinWale API
SWAGGER_DESCRIPTION=API Documentation for TiffinWale Platform
SWAGGER_VERSION=1.0
SWAGGER_PATH=api-docs
```

## 🚀 Deployment Steps

1. **Delete old Vercel project** (if exists)
2. **Create new Vercel project**
3. **Connect your GitHub repository**
4. **Set Root Directory to:** `monolith_backend/`
5. **Set Install Command to:** `bun install`
6. **Leave Build Command empty** (auto-detected)
7. **Add all environment variables** from the list above
8. **Deploy!**

## 🔍 Testing Your Deployment

After deployment, test these endpoints:

### **Health Check**
```
GET https://your-vercel-url.vercel.app/
GET https://your-vercel-url.vercel.app/health
```

### **API Documentation**
```
GET https://your-vercel-url.vercel.app/api-docs
```

### **Sample API Endpoint**
```
GET https://your-vercel-url.vercel.app/api/auth/health
```

## 🐛 Troubleshooting

### **Common Issues & Solutions**

1. **"Path does not exist" error**
   - ✅ **Fixed:** Root directory is now correctly set to `monolith_backend/`

2. **Build failures**
   - ✅ **Fixed:** Build command removed, Vercel auto-detects TypeScript

3. **Module not found errors**
   - ✅ **Fixed:** `includeFiles` in `vercel.json` includes all necessary files

4. **Timeout errors**
   - ✅ **Fixed:** Function timeout increased to 30s, memory to 1024MB

### **If deployment still fails:**

1. Check Vercel function logs in dashboard
2. Verify all environment variables are set
3. Ensure MongoDB connection string is correct
4. Check that your GitHub repo has the latest changes

## 📊 Expected Performance

- **Cold start:** ~2-3 seconds
- **Warm requests:** ~100-300ms
- **Health check:** ~50ms (optimized)
- **API endpoints:** ~200-500ms

## 🎯 Success Indicators

✅ **Deployment successful when:**
- Root URL returns health check response
- `/api-docs` shows Swagger documentation
- API endpoints respond correctly
- No 500 errors in function logs

---

**Ready to deploy!** 🚀 Your backend is now optimized for Vercel serverless deployment.
