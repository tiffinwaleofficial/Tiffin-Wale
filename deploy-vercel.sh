#!/bin/bash

# Vercel Deployment Script for TiffinWale Backend
echo "🚀 Deploying TiffinWale Backend to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to backend directory
cd monolith_backend

echo "📦 Installing dependencies..."
npm install

echo "🔧 Building the project..."
npm run build

echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "🔗 Your backend should be available at:"
echo "   https://backend-tiffin-wale.vercel.app"
echo ""
echo "🧪 Test endpoints:"
echo "   https://backend-tiffin-wale.vercel.app/"
echo "   https://backend-tiffin-wale.vercel.app/api/ping"
echo "   https://backend-tiffin-wale.vercel.app/api-docs"
echo ""
echo "⚠️  Make sure to set environment variables in Vercel dashboard:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - JWT_REFRESH_SECRET"
echo "   - NODE_ENV=production"
