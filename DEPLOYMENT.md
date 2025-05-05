# TiffinWale Deployment Guide

This document outlines how to deploy the TiffinWale application to Google Cloud Platform (GCP) using App Engine and GitLab CI/CD.

## Prerequisites

- Google Cloud Platform account with billing enabled
- GitLab repository access
- MongoDB Atlas account (for database)

## Initial Setup

1. Enable required Google Cloud APIs:
   - App Engine Admin API
   - Cloud Resource Manager API
   - Cloud Build API

2. Set up service account:
   - Create a service account in GCP IAM
   - Grant the following roles:
     - App Engine Admin
     - Storage Admin
     - Cloud Build Editor
   - Download the service account key (JSON)

3. Configure GitLab CI/CD:
   - Go to your GitLab project Settings > CI/CD > Variables
   - Add `GCP_SERVICE_KEY` variable with the content of your service account JSON key

## Project Structure

```
tiffin-wale/
├── monolith_backend/         # Backend service (default service)
│   └── app.yaml             # Backend App Engine configuration
├── interface/
│   └── webapp/
│       └── OfficialWeb/     # Frontend service
│           └── app.yaml     # Frontend App Engine configuration
└── .gitlab-ci.yml           # CI/CD configuration
```

## Deployment Configuration

### Backend Configuration (app.yaml)
```yaml
runtime: nodejs20
instance_class: F2

entrypoint: npm run start:prod

env_variables:
  NODE_ENV: "production"
  PORT: "8080"
  # Add other environment variables as needed
```

### Frontend Configuration (app.yaml)
```yaml
runtime: nodejs20
service: official-page
instance_class: F2

entrypoint: npm start

env_variables:
  NODE_ENV: "production"
  NEXT_PUBLIC_API_URL: "https://tiffin-wale.de.r.appspot.com"
  PORT: "8080"
```

## Deployment Process

The deployment is automated through GitLab CI/CD pipeline:

1. Backend deployment triggers when:
   - Changes are made to `monolith_backend/**/*`
   - Changes to `.gitlab-ci.yml`

2. Frontend deployment triggers when:
   - Changes are made to `interface/OfficialWeb/**/*`
   - Changes to `.gitlab-ci.yml`

## Service URLs

- Backend (default service): `https://tiffin-wale.de.r.appspot.com`
- Frontend: `https://official-page-dot-tiffin-wale.de.r.appspot.com`

## Monitoring and Maintenance

1. App Engine Dashboard:
   - Go to Google Cloud Console > App Engine > Dashboard
   - Monitor service status, traffic, and instances

2. Logs:
   - View logs in Google Cloud Console > Logging
   - Filter by service name:
     - Backend: `resource.labels.service="default"`
     - Frontend: `resource.labels.service="official-page"`

3. Performance:
   - Monitor in Google Cloud Console > App Engine > Services
   - Check instance count, latency, and traffic

## Troubleshooting

1. Deployment Issues:
   - Check GitLab CI/CD pipeline logs
   - Verify service account permissions
   - Ensure APIs are enabled

2. Runtime Issues:
   - Check App Engine logs for each service
   - Verify environment variables
   - Check MongoDB connection (for backend)

3. Static Content Issues:
   - Verify static file handlers in app.yaml
   - Check browser console for resource loading errors
   - Clear browser cache after deployments

## Cost Management

- App Engine automatically scales based on traffic
- Set up billing alerts in Google Cloud Console
- Monitor instance hours and bandwidth usage
- Configure appropriate instance classes and scaling settings

## Security Notes

- Keep service account keys secure
- Regularly rotate JWT secrets
- Use secure environment variables for sensitive data
- Enable HTTPS for all endpoints

## Useful Commands

```bash
# View app logs
gcloud app logs tail -s default  # for backend
gcloud app logs tail -s official-page  # for frontend

# Deploy manually (if needed)
gcloud app deploy monolith_backend/app.yaml
gcloud app deploy interface/OfficialWeb/app.yaml

# View service status
gcloud app services list
``` 