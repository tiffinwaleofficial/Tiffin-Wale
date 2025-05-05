#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// ANSI color codes for colorful output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
  }
};

// Helper function to print colorful headers
function printHeader(message) {
  console.log('\n' + colors.bright + colors.fg.cyan + '='.repeat(80) + colors.reset);
  console.log(colors.bright + colors.fg.cyan + '== ' + message + colors.reset);
  console.log(colors.bright + colors.fg.cyan + '='.repeat(80) + colors.reset + '\n');
}

// Helper function to print step information
function printStep(step, message) {
  console.log(colors.bright + colors.fg.yellow + step + ': ' + colors.reset + message);
}

// Helper function to print success message
function printSuccess(message) {
  console.log(colors.bright + colors.fg.green + '✓ ' + message + colors.reset);
}

// Helper function to print error message
function printError(message) {
  console.log(colors.bright + colors.fg.red + '✗ ' + message + colors.reset);
}

// Main function to run deployment process
async function deploy() {
  try {
    printHeader('TiffinWale Deployment to Google Cloud App Engine');
    
    // Step 1: Build the application
    printStep('STEP 1', 'Building the application for deployment');
    
    try {
      execSync('node scripts/build-for-gcp.js', { stdio: 'inherit' });
      printSuccess('Build completed successfully');
    } catch (error) {
      printError('Build failed');
      console.error(error.message);
      process.exit(1);
    }
    
    // Step 2: Check if gcloud is installed
    printStep('STEP 2', 'Checking if Google Cloud SDK is installed');
    
    try {
      execSync('gcloud --version', { stdio: 'pipe' });
      printSuccess('Google Cloud SDK is installed');
    } catch (error) {
      printError('Google Cloud SDK is not installed or not in PATH');
      console.log('\nPlease install Google Cloud SDK from: https://cloud.google.com/sdk/docs/install');
      process.exit(1);
    }
    
    // Step 3: Check if user is logged in to gcloud
    printStep('STEP 3', 'Checking if you are logged in to Google Cloud');
    
    try {
      const accountInfo = execSync('gcloud auth list --filter=status:ACTIVE --format="value(account)"', { stdio: 'pipe' }).toString().trim();
      
      if (accountInfo) {
        printSuccess(`Logged in as: ${accountInfo}`);
      } else {
        printError('Not logged in to Google Cloud');
        console.log('\nPlease log in using: gcloud auth login');
        process.exit(1);
      }
    } catch (error) {
      printError('Failed to check authentication status');
      console.log('\nPlease log in using: gcloud auth login');
      process.exit(1);
    }
    
    // Step 4: Check and set project
    printStep('STEP 4', 'Checking current Google Cloud project');
    
    try {
      const currentProject = execSync('gcloud config get-value project', { stdio: 'pipe' }).toString().trim();
      
      if (currentProject && currentProject !== '(unset)') {
        printSuccess(`Current project: ${currentProject}`);
        
        // Confirm if user wants to use this project
        console.log(colors.fg.yellow + '\nDo you want to deploy to this project? (y/n)' + colors.reset);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        
        process.stdin.on('data', (data) => {
          const input = data.toString().trim().toLowerCase();
          
          if (input === 'y' || input === 'yes') {
            process.stdin.pause();
            continueDeployment(currentProject);
          } else {
            console.log('\nPlease set your project using: gcloud config set project YOUR_PROJECT_ID');
            console.log('Then run this deployment script again.');
            process.exit(0);
          }
        });
      } else {
        printError('No Google Cloud project is set');
        console.log('\nPlease set your project using: gcloud config set project YOUR_PROJECT_ID');
        process.exit(1);
      }
    } catch (error) {
      printError('Failed to check Google Cloud project');
      console.error(error.message);
      process.exit(1);
    }
  } catch (error) {
    printError('Deployment process failed');
    console.error(error.message);
    process.exit(1);
  }
}

function continueDeployment(projectId) {
  // Step 5: Check if App Engine is enabled
  printStep('STEP 5', 'Checking if App Engine API is enabled');
  
  try {
    execSync(`gcloud services list --project=${projectId} --filter="name:appengine.googleapis.com"`, { stdio: 'pipe' });
    printSuccess('App Engine API is enabled');
  } catch (error) {
    printError('App Engine API might not be enabled');
    console.log('\nEnabling App Engine API...');
    
    try {
      execSync(`gcloud services enable appengine.googleapis.com --project=${projectId}`, { stdio: 'inherit' });
      printSuccess('App Engine API has been enabled');
    } catch (enableError) {
      printError('Failed to enable App Engine API');
      console.error(enableError.message);
      process.exit(1);
    }
  }
  
  // Step 6: Deploy to App Engine
  printStep('STEP 6', 'Deploying to Google App Engine');
  
  try {
    console.log('\nStarting deployment... This may take several minutes.');
    execSync('cd dist && gcloud app deploy --quiet', { stdio: 'inherit' });
    printSuccess('Deployment completed successfully');
    
    // Get the deployed URL
    const appUrl = execSync('gcloud app browse --no-launch-browser', { stdio: 'pipe' }).toString().trim();
    console.log('\n' + colors.bright + colors.bg.green + colors.fg.black + ' APPLICATION DEPLOYED SUCCESSFULLY! ' + colors.reset);
    console.log('\nYour application is now available at: ' + colors.fg.cyan + appUrl + colors.reset);
    
    // Final instructions for domain mapping
    printHeader('Next Steps for Domain Mapping');
    console.log('To set up your custom domain (tiffin-wale.com):');
    console.log('1. Run: ' + colors.fg.cyan + 'node scripts/setup-domains.js' + colors.reset);
    console.log('2. Follow the instructions to verify domain ownership and set up DNS records');
    console.log('\nThank you for using the TiffinWale deployment tool!');
  } catch (error) {
    printError('Deployment failed');
    console.error(error.message);
    process.exit(1);
  }
}

// Start the deployment process
deploy();