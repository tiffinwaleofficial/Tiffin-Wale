// Environment Configuration Checker for TiffinWale Partner App
import 'dotenv/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🔍 Environment Configuration Check');
console.log('=====================================');

// Check if .env file exists
try {
  const envPath = join(__dirname, '..', '.env');
  const envContent = readFileSync(envPath, 'utf8');
  console.log('✅ .env file found');
  
  // Parse .env content to show current configuration
  const lines = envContent.split('\n');
  const apiLines = lines.filter(line => line.includes('API_BASE_URL') && !line.trim().startsWith('#'));
  
  if (apiLines.length > 0) {
    console.log('📝 Current active API configuration:');
    apiLines.forEach(line => {
      console.log(`  ${line}`);
    });
  } else {
    console.log('⚠️ No active API_BASE_URL found (all lines are commented)');
  }
  
} catch (error) {
  console.log('❌ .env file not found');
  console.log('   Please create a .env file in the project root');
}

console.log('\n🌐 API Configuration:');
const apiUrl = process.env.API_BASE_URL;
if (apiUrl) {
  console.log('  ✅ API_BASE_URL found:', apiUrl);
  
  if (apiUrl.includes('127.0.0.1') || apiUrl.includes('localhost')) {
    console.log('  🏠 Environment: LOCAL DEVELOPMENT');
  } else if (apiUrl.includes('api.tiffin-wale.com')) {
    console.log('  🌍 Environment: PRODUCTION (Custom Domain)');
  } else if (apiUrl.includes('appspot.com')) {
    console.log('  🌍 Environment: PRODUCTION (Google Cloud)');
  } else {
    console.log('  ❓ Environment: UNKNOWN');
  }
} else {
  console.log('  ❌ API_BASE_URL not found in .env file');
  console.log('  📋 Expected format:');
  console.log('     API_BASE_URL=https://api.tiffin-wale.com');
}

console.log('\n🔧 Expo Environment Variables:');
console.log('  EXPO_PUBLIC_APP_ENV:', process.env.EXPO_PUBLIC_APP_ENV || 'Not set');

console.log('\n💡 To switch environments:');
console.log('  1. Open the .env file in the project root');
console.log('  2. Comment/uncomment the desired API_BASE_URL');
console.log('  3. Restart the dev server');

console.log('\n📖 Available environments:');
console.log('  🌍 Production:  API_BASE_URL=https://api.tiffin-wale.com');
console.log('  🏠 Local:       API_BASE_URL=http://127.0.0.1:3001');
console.log('  🔧 Staging:     API_BASE_URL=https://tiffinwale-backend-12345.appspot.com'); 