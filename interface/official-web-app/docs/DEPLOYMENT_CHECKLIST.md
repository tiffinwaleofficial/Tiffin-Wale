# TiffinWale Deployment Checklist

Use this checklist to make sure you've completed all the steps needed for a successful deployment to Google Cloud App Engine with custom domain configuration.

## Before Deployment

- [ ] Install Google Cloud SDK
  ```bash
  # Visit https://cloud.google.com/sdk/docs/install for installation instructions
  ```

- [ ] Initialize Google Cloud SDK
  ```bash
  gcloud init
  ```

- [ ] Create a Google Cloud project
  ```bash
  gcloud projects create tiffinwale-website --name="TiffinWale Website"
  ```

- [ ] Set the project as default
  ```bash
  gcloud config set project tiffinwale-website
  ```

- [ ] Enable App Engine API
  ```bash
  gcloud services enable appengine.googleapis.com
  ```

- [ ] Check Billing is enabled for your Google Cloud project
  ```bash
  # Visit https://console.cloud.google.com/billing
  ```

## Building the Application

- [ ] Ensure all tests pass
  ```bash
  npm test
  ```

- [ ] Build the application for deployment
  ```bash
  node scripts/build-for-gcp.js
  ```

- [ ] Verify the build was successful (a `dist` folder should be created)

## Deploying to App Engine

- [ ] Navigate to the dist folder
  ```bash
  cd dist
  ```

- [ ] Deploy to App Engine
  ```bash
  gcloud app deploy
  ```

- [ ] Verify the deployment was successful
  ```bash
  gcloud app browse
  ```

## Domain Configuration

- [ ] Go to Google Cloud Console > App Engine > Settings > Custom Domains

- [ ] Verify ownership of your domain (tiffin-wale.com)
  - [ ] Follow Google's instructions to add verification records to your DNS

- [ ] Set up domain mappings using the script
  ```bash
  node scripts/setup-domains.js
  ```

- [ ] Configure DNS records with your domain registrar
  - [ ] A records for tiffin-wale.com (pointing to Google's IP addresses)
  - [ ] CNAME record for www.tiffin-wale.com (pointing to ghs.googlehosted.com)

- [ ] Wait for SSL certificates to be provisioned (can take up to 24 hours)

- [ ] Verify domain setup is complete
  ```bash
  gcloud app domain-mappings list
  ```

## Post-Deployment

- [ ] Check website works at https://tiffin-wale.com
  - [ ] Test navigation and all important features
  - [ ] Verify HTTPS is working correctly

- [ ] Check website works at https://www.tiffin-wale.com
  - [ ] Verify redirects are working if configured

- [ ] Set up monitoring and alerts
  ```bash
  # Visit https://console.cloud.google.com/monitoring
  ```

- [ ] Test the contact form submission and any other API endpoints

- [ ] Check all environment variables are correctly set and accessible

## Maintenance Plan

- [ ] Schedule regular check-ins to verify the site is running properly

- [ ] Set up Cloud Scheduler for any recurring tasks
  ```bash
  # Visit https://console.cloud.google.com/cloudscheduler
  ```

- [ ] Document any database backup procedures (if applicable)

- [ ] Create a rollback plan in case of deployment issues

## Security Checks

- [ ] Ensure all API keys have appropriate restrictions

- [ ] Verify CORS settings are properly configured

- [ ] Check for any security headers that should be enabled

- [ ] Review permission settings in Google Cloud Console

## Notes

Use this section to document any specific issues or configuration details for your deployment:

```
# Add your notes here
```