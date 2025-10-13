# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables in your Vercel dashboard (Project Settings > Environment Variables):

### Core Application Variables
```
NODE_ENV=production
PORT=3000
API_PREFIX=api
APP_NAME=TiffinWale
```

### Database Configuration
```
MONGODB_URI=mongodb+srv://SupremeRahul:OptimusPrime@clusternse.wpf8cel.mongodb.net/TiffinWale
```

### JWT Configuration
```
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
JWT_EXPIRATION=30d
```

### Swagger Configuration
```
SWAGGER_TITLE=TiffinWale API
SWAGGER_DESCRIPTION=API Documentation for TiffinWale Platform
SWAGGER_VERSION=1.0
SWAGGER_PATH=api-docs
```

### Logging Configuration
```
LOG_LEVEL=info
```

## How to Add Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable above with the corresponding value
5. Make sure to set them for "Production", "Preview", and "Development" environments

## Security Notes:

- **NEVER** commit sensitive environment variables to your repository
- Use strong, unique values for JWT_SECRET in production
- Consider using Vercel's secret management for sensitive data
- Regularly rotate your secrets

## Deployment Command:

After setting up environment variables, deploy with:
```bash
vercel --prod
```
