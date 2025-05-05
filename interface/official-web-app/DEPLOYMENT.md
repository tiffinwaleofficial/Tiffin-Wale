# TiffinWale Deployment Guide

This document provides step-by-step instructions for deploying the TiffinWale website to Google Cloud App Engine and setting up the custom domains `tiffin-wale.com` and `www.tiffin-wale.com`.

## Prerequisites

1. [Google Cloud Account](https://cloud.google.com/)
2. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed on your machine
3. Ownership of the domain `tiffin-wale.com`
4. Access to your domain's DNS settings

## Step 1: Set Up Google Cloud Project

1. Create a new project in Google Cloud Console:
   ```
   gcloud projects create tiffinwale-website --name="TiffinWale Website"
   ```

2. Set the project as your default:
   ```
   gcloud config set project tiffinwale-website
   ```

3. Enable required APIs:
   ```
   gcloud services enable appengine.googleapis.com
   ```

## Step 2: Prepare Your Application

1. Run the build script to prepare your application for deployment:
   ```
   node scripts/build-for-gcp.js
   ```

   This will create a `dist` directory with everything needed for deployment.

## Step 3: Deploy to App Engine

1. Navigate to the dist directory:
   ```
   cd dist
   ```

2. Deploy to App Engine:
   ```
   gcloud app deploy
   ```

3. When prompted, select a region that's close to your target audience (e.g., `us-central` for North America).

4. The deployment process will start. This may take a few minutes. Once complete, you can view your app:
   ```
   gcloud app browse
   ```

## Step 4: Map Custom Domains

Before starting this process, you must verify ownership of your domain in Google Cloud Console.

### Verify Domain Ownership

1. Go to the [App Engine Domain Settings](https://console.cloud.google.com/appengine/settings/domains) in Google Cloud Console.
2. Click "Add a custom domain"
3. Follow the steps to verify your domain ownership (typically by adding a TXT record to your DNS)

### Set Up Domain Mapping

After verifying domain ownership, you can map your custom domains:

1. Run the domain setup script:
   ```
   node scripts/setup-domains.js
   ```

2. Follow the prompts to complete domain mapping.

### Configure DNS Records

Based on the output from the domain mapping process, you'll need to create the following DNS records:

1. For `tiffin-wale.com`:
   - Type: A
   - Name: @ (or leave blank)
   - Value: [IP addresses provided by Google]

2. For `www.tiffin-wale.com`:
   - Type: CNAME
   - Name: www
   - Value: ghs.googlehosted.com.

## Step 5: Set up SSL Certificates

Google will automatically provision SSL certificates for your domains. This process may take up to 24 hours to complete.

You can check the status of your SSL certificates using:
```
gcloud app domain-mappings list
```

## Environment Variables for Production

If your application requires environment variables in production (such as database connection strings, API keys, etc.), you can set them in the `app.yaml` file under the `env_variables` section before deploying.

For sensitive information, consider using [Google Cloud Secret Manager](https://cloud.google.com/secret-manager) instead of putting secrets directly in `app.yaml`.

## Continuous Deployment (Optional)

To set up continuous deployment from your GitHub repository:

1. Connect your GitHub repository to Google Cloud Build
2. Create a Cloud Build trigger that automatically deploys to App Engine when changes are pushed to your main branch

## Monitoring

You can monitor your application performance, logs, and more through the [Google Cloud Console](https://console.cloud.google.com/appengine).

## Support

If you encounter any issues during deployment, check the [App Engine documentation](https://cloud.google.com/appengine/docs) or contact Google Cloud Support.

---

**Note**: Remember to keep your Google Cloud credentials secure and never commit them to version control.