# TiffinWale Motia Separate Deployment Script
Write-Host "🚀 Deploying TiffinWale Motia Workflows to Vercel..." -ForegroundColor Green

# Create temporary deployment directory
$deployDir = "motia-deploy"
Write-Host "📁 Creating deployment directory: $deployDir" -ForegroundColor Yellow

if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir

# Copy Motia-specific files
Write-Host "📋 Copying Motia files..." -ForegroundColor Yellow
Copy-Item -Recurse "steps" "$deployDir/steps"
Copy-Item -Recurse "src/services" "$deployDir/src/services" -ErrorAction SilentlyContinue
Copy-Item -Recurse "python_modules" "$deployDir/python_modules" -ErrorAction SilentlyContinue
Copy-Item "requirements.txt" "$deployDir/" -ErrorAction SilentlyContinue
Copy-Item "motia.json" "$deployDir/" -ErrorAction SilentlyContinue
Copy-Item ".env" "$deployDir/" -ErrorAction SilentlyContinue

# Copy deployment configs
Copy-Item "motia-vercel.json" "$deployDir/vercel.json"
Copy-Item "motia-package.json" "$deployDir/package.json"

# Change to deployment directory
Set-Location $deployDir

Write-Host "🔧 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
vercel --prod --name "tiffin-wale-motia"

# Return to original directory
Set-Location ..

Write-Host "✅ Motia deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your Motia workflows are now available at: https://tiffin-wale-motia.vercel.app" -ForegroundColor Cyan

# Clean up
Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $deployDir

Write-Host "🎉 Done! Your Motia workflows are live!" -ForegroundColor Green
