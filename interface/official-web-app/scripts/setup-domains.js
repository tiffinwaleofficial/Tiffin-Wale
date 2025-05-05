import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌐 Google Cloud Domain Mapping Setup for TiffinWale');
console.log('===================================================');
console.log('');
console.log('This script will help you set up custom domains for your App Engine application.');
console.log('');
console.log('Prerequisites:');
console.log('1. Google Cloud SDK (gcloud) installed and initialized');
console.log('2. App Engine application deployed');
console.log('3. Domain ownership verified in Google Cloud Console');
console.log('4. DNS records properly configured for tiffin-wale.com');
console.log('');

rl.question('Have you verified domain ownership in Google Cloud Console? (yes/no): ', (answer) => {
  if (answer.toLowerCase() !== 'yes') {
    console.log('');
    console.log('⚠️  Please verify domain ownership first:');
    console.log('1. Go to https://console.cloud.google.com/appengine/settings/domains');
    console.log('2. Click "Add a custom domain"');
    console.log('3. Follow the steps to verify domain ownership');
    console.log('');
    console.log('Run this script again after completing these steps.');
    rl.close();
    return;
  }

  console.log('');
  console.log('🔄 Setting up domain mapping for tiffin-wale.com and www.tiffin-wale.com...');
  
  try {
    // Map apex domain (tiffin-wale.com)
    console.log('• Adding mapping for tiffin-wale.com...');
    execSync('gcloud app domain-mappings create tiffin-wale.com', { stdio: 'inherit' });
    
    // Map www subdomain (www.tiffin-wale.com)
    console.log('• Adding mapping for www.tiffin-wale.com...');
    execSync('gcloud app domain-mappings create www.tiffin-wale.com', { stdio: 'inherit' });

    console.log('');
    console.log('✅ Domain mappings created successfully!');
    console.log('');
    console.log('Important: You now need to create the following DNS records:');
    console.log('');

    // Get SSL certificate details
    console.log('🔒 Fetching SSL certificate details...');
    const sslOutput = execSync('gcloud app domain-mappings list').toString();
    
    console.log('');
    console.log('Please create the following DNS records with your domain registrar:');
    console.log('');
    console.log('1. For tiffin-wale.com:');
    console.log('   Type: A');
    console.log('   Name: @');
    console.log('   Value: Check IPs from "gcloud app domain-mappings list"');
    console.log('');
    console.log('2. For www.tiffin-wale.com:');
    console.log('   Type: CNAME');
    console.log('   Name: www');
    console.log('   Value: ghs.googlehosted.com.');
    console.log('');

    console.log('SSL certificates will be automatically provisioned by Google.');
    console.log('It may take up to 24 hours for DNS changes to propagate and SSL certificates to be issued.');
    
  } catch (error) {
    console.error('⚠️ Error setting up domain mappings:', error.message);
    console.log('');
    console.log('Make sure your App Engine application is deployed and you have the necessary permissions.');
  }

  rl.close();
});