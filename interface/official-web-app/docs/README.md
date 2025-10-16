# TiffinWale - Official Web Application

TiffinWale is a home-style meal subscription service for busy students and professionals. This repository contains the official web application.

## Project Structure

```
official-web-app/
├── client/            # React frontend 
├── server/            # Express backend
├── db/                # Database configuration and schema
├── shared/            # Shared code (types/schemas)
├── public/            # Static assets
├── scripts/           # Deployment & utility scripts
├── dist/              # Built application (production-ready)
└── app.yaml           # Google Cloud App Engine configuration
```

## Deployment Instructions

This application is configured for deployment to Google Cloud App Engine. Follow these steps to deploy:

1. **Prerequisites**:
   - Google Cloud SDK installed on your local machine
   - A Google Cloud Platform account
   - Node.js 20.x installed

2. **Deployment Steps**:
   ```bash
   # Extract the deployment package
   unzip official-web-app-deployment.zip -d deploy-folder
   cd deploy-folder

   # Login to your Google account
   gcloud auth login

   # Create a new project (if needed)
   gcloud projects create tiffinwale-website --name="TiffinWale Website"
   # OR use existing project
   gcloud config set project YOUR_PROJECT_ID

   # Enable App Engine API
   gcloud services enable appengine.googleapis.com

   # Deploy to App Engine
   gcloud app deploy

   # View your deployed app
   gcloud app browse
   ```

3. **Custom Domain Setup**:
   - Go to Google Cloud Console > App Engine > Settings > Custom Domains
   - Set up domain mappings for tiffin-wale.com and www.tiffin-wale.com
   - Follow the verification steps and configure DNS records

## Development

To run the application locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at http://localhost:5000.

## Environment Variables

For proper functioning, ensure these environment variables are set:

- `DATABASE_URL`: Connection string for PostgreSQL database
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name for image uploads
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## License

All rights reserved. This is proprietary software.