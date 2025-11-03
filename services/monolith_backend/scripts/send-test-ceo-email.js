const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:3001';
const TEST_EMAIL = 'riyatiwari7805@gmail.com';
const TEST_NAME = 'Riya';

// Colors for console output, consistent with other scripts
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

async function checkBackend() {
  log('🔍 Checking if backend is running...', colors.cyan);
  try {
    // Correctly check the health endpoint with /api prefix
    const response = await axios.get(`${BASE_URL}/api/email-test/health`, { timeout: 5000 });
    if (response.data.success) {
      log('✅ Backend is running!', colors.green);
      return true;
    }
  } catch (error) {
    log('❌ Backend is not running or not responding!', colors.red);
    log(`   Please make sure your backend is running on ${BASE_URL}`, colors.yellow);
    return false;
  }
}

async function sendTestEmail() {
  log('\n🚀 Sending CEO Welcome Email...', colors.magenta + colors.bright);
  
  try {
    // Correctly call the endpoint with /api prefix
    const response = await axios.post(`${BASE_URL}/api/email-test/send-ceo-welcome`, {
      to: TEST_EMAIL,
      name: TEST_NAME,
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    if (response.data.success) {
      log(`✅ Email sent successfully to ${TEST_EMAIL}!`, colors.green);
    } else {
      log(`❌ Failed to send email: ${response.data.message}`, colors.red);
    }
  } catch (error) {
    log(`❌ An error occurred: ${error.message}`, colors.red);
  }
}

async function main() {
  const backendRunning = await checkBackend();
  if (!backendRunning) {
    process.exit(1);
  }
  await sendTestEmail();
}

main();









