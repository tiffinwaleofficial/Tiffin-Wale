#!/usr/bin/env node

/**
 * Script to test PDF generation endpoints
 * 
 * Usage: node scripts/test-pdf-generation.js
 * 
 * Prerequisites:
 * - Server must be running (npm run start:dev)
 * - MongoDB must have test data (orders, subscriptions, partners)
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
const API_PREFIX = process.env.API_PREFIX || '/api';
const OUTPUT_DIR = path.join(__dirname, '../src/modules/report/formats/pdf/storage/generated');

// Default real IDs from MongoDB (queried on 2025-11-06)
const DEFAULT_ORDER_ID = '6907c1dc041b4ddf848ccf02';
const DEFAULT_SUBSCRIPTION_ID = '6907c1db041b4ddf848ccefb';
const DEFAULT_PARTNER_ID = '69038003345c8af2df48c28e';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

/**
 * Check if a string is a valid MongoDB ObjectId
 */
function isValidObjectId(id) {
  if (!id || typeof id !== 'string') return false;
  // MongoDB ObjectId is 24 hex characters
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Fetch real IDs from the API (if available)
 */
async function fetchRealIds() {
  const ids = {
    orderId: null,
    subscriptionId: null,
    partnerId: null,
  };

  try {
    // Try to fetch a recent order
    try {
      const ordersResponse = await axios.get(`${API_BASE_URL}${API_PREFIX}/order`, {
        params: { limit: 1 },
        timeout: 3000,
      });
      if (ordersResponse.data && ordersResponse.data.length > 0) {
        ids.orderId = ordersResponse.data[0]._id || ordersResponse.data[0].id;
        logInfo(`Found order ID: ${ids.orderId}`);
      }
    } catch (e) {
      // Order endpoint might not exist or require auth
    }

    // Try to fetch a recent subscription
    try {
      const subsResponse = await axios.get(`${API_BASE_URL}${API_PREFIX}/subscription`, {
        params: { limit: 1 },
        timeout: 3000,
      });
      if (subsResponse.data && subsResponse.data.length > 0) {
        ids.subscriptionId = subsResponse.data[0]._id || subsResponse.data[0].id;
        logInfo(`Found subscription ID: ${ids.subscriptionId}`);
      }
    } catch (e) {
      // Subscription endpoint might not exist or require auth
    }

    // Try to fetch a partner
    try {
      const partnersResponse = await axios.get(`${API_BASE_URL}${API_PREFIX}/partner`, {
        params: { limit: 1 },
        timeout: 3000,
      });
      if (partnersResponse.data && partnersResponse.data.length > 0) {
        ids.partnerId = partnersResponse.data[0]._id || partnersResponse.data[0].id;
        logInfo(`Found partner ID: ${ids.partnerId}`);
      }
    } catch (e) {
      // Partner endpoint might not exist or require auth
    }
  } catch (error) {
    // Silently fail - we'll use provided IDs or skip tests
  }

  return ids;
}

/**
 * Save PDF buffer to file
 */
async function savePdf(buffer, filename, category) {
  const categoryDir = path.join(OUTPUT_DIR, category);
  
  // Ensure directory exists
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  const filePath = path.join(categoryDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

/**
 * Test Order Receipt PDF generation with dummy data
 */
async function testOrderReceipt() {
  try {
    logInfo('Testing Order Receipt PDF generation with dummy data');
    
    // Use dummy order ID - backend will handle data fetching
    const dummyOrderId = '6907c1dc041b4ddf848ccf02';
    
    const response = await axios.post(
      `${API_BASE_URL}${API_PREFIX}/report/order-receipt`,
      {
        orderId: dummyOrderId,
        includeItems: true,
        includePayment: true,
      },
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const filename = `order-receipt-${Date.now()}.pdf`;
    const filePath = await savePdf(response.data, filename, 'order-receipts');
    
    logSuccess(`Order Receipt PDF saved to: ${filePath}`);
    logInfo(`File size: ${(response.data.length / 1024).toFixed(2)} KB`);
    
    return { success: true, filePath, size: response.data.length };
  } catch (error) {
    logError(`Failed to generate Order Receipt: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Test Subscription Report PDF generation with dummy data
 */
async function testSubscriptionReport() {
  try {
    logInfo('Testing Subscription Report PDF generation with dummy data');
    
    // Use dummy subscription ID - backend will handle data fetching
    const dummySubscriptionId = '6907c1db041b4ddf848ccefb';
    
    const response = await axios.post(
      `${API_BASE_URL}${API_PREFIX}/report/subscription-report`,
      {
        subscriptionId: dummySubscriptionId,
        includeHistory: true,
      },
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const filename = `subscription-report-${Date.now()}.pdf`;
    const filePath = await savePdf(response.data, filename, 'subscriptions');
    
    logSuccess(`Subscription Report PDF saved to: ${filePath}`);
    logInfo(`File size: ${(response.data.length / 1024).toFixed(2)} KB`);
    
    return { success: true, filePath, size: response.data.length };
  } catch (error) {
    logError(`Failed to generate Subscription Report: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Test Partner Contract PDF generation with dummy data
 */
async function testPartnerContract() {
  try {
    logInfo('Testing Partner Contract PDF generation with dummy data');
    
    // Use dummy partner ID - backend will handle data fetching
    const dummyPartnerId = '69038003345c8af2df48c28e';
    
    const response = await axios.post(
      `${API_BASE_URL}${API_PREFIX}/report/partner-contract`,
      {
        partnerId: dummyPartnerId,
        contractType: 'agreement',
        terms: [
          'Partner agrees to maintain food quality standards as per TiffinMate guidelines.',
          'Partner agrees to deliver orders within the specified time frame.',
          'Partner agrees to comply with all local health and safety regulations.',
        ],
      },
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const filename = `partner-contract-${Date.now()}.pdf`;
    const filePath = await savePdf(response.data, filename, 'contracts');
    
    logSuccess(`Partner Contract PDF saved to: ${filePath}`);
    logInfo(`File size: ${(response.data.length / 1024).toFixed(2)} KB`);
    
    return { success: true, filePath, size: response.data.length };
  } catch (error) {
    logError(`Failed to generate Partner Contract: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Test Invoice PDF generation with dummy data
 */
async function testInvoice() {
  try {
    logInfo('Testing Invoice PDF generation with dummy data');
    
    // Use dummy order ID for invoice
    const dummyOrderId = '6907c1dc041b4ddf848ccf02';
    
    const response = await axios.post(
      `${API_BASE_URL}${API_PREFIX}/report/invoice`,
      {
        type: 'order',
        orderId: dummyOrderId,
      },
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const filename = `invoice-order-${Date.now()}.pdf`;
    const filePath = await savePdf(response.data, filename, 'invoices');
    
    logSuccess(`Invoice PDF saved to: ${filePath}`);
    logInfo(`File size: ${(response.data.length / 1024).toFixed(2)} KB`);
    
    return { success: true, filePath, size: response.data.length };
  } catch (error) {
    logError(`Failed to generate Invoice: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Test Legal Document PDF generation with dummy TiffinMate center data
 */
async function testLegalDocument() {
  try {
    logInfo('Testing Legal Document PDF generation with dummy TiffinMate center data');
    
    const response = await axios.post(
      `${API_BASE_URL}${API_PREFIX}/report/legal-document`,
      {
        documentType: 'Service Agreement',
        title: 'Terms of Service Agreement',
        parties: [
          {
            name: 'TiffinMate Platform',
            role: 'Service Provider',
            address: 'TiffinMate Headquarters, 123 Business Street, City, State 12345, India',
            contactInfo: 'support@tiffinmate.com | +1-800-TIFFINMATE',
          },
          {
            name: 'Test Partner',
            role: 'Service Partner',
            address: '456 Partner Street, City, State 67890, India',
            contactInfo: 'partner@example.com | +1-234-567-8900',
          },
        ],
        effectiveDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        terms: [
          {
            section: 'Service Terms',
            clauses: [
              'TiffinMate agrees to provide platform services for meal delivery.',
              'The partner agrees to maintain food quality standards as per TiffinMate guidelines.',
              'Both parties agree to resolve disputes amicably.',
            ],
          },
          {
            section: 'Payment Terms',
            clauses: [
              'Payments will be processed weekly via bank transfer.',
              'Commission rate: 20% of order value.',
              'Payment disputes must be reported within 7 days.',
            ],
          },
          {
            section: 'Termination',
            clauses: [
              'Either party can terminate with 30 days written notice.',
              'Termination does not affect pending orders.',
              'Refunds will be processed as per policy.',
            ],
          },
        ],
      },
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const filename = `legal-document-${Date.now()}.pdf`;
    const filePath = await savePdf(response.data, filename, 'legal-documents');
    
    logSuccess(`Legal Document PDF saved to: ${filePath}`);
    logInfo(`File size: ${(response.data.length / 1024).toFixed(2)} KB`);
    
    return { success: true, filePath, size: response.data.length };
  } catch (error) {
    logError(`Failed to generate Legal Document: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main test function
 */
async function runTests() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🧪 PDF Generation Test Script', 'bright');
  log('='.repeat(60) + '\n', 'cyan');

  // Check if server is running
  try {
    // Try root endpoint for health check (returns { status: "ok", message: "TiffinWale API is running!" })
    try {
      const response = await axios.get(`${API_BASE_URL}/`, { timeout: 3000 });
      if (response.data && response.data.status === 'ok') {
        logSuccess(`Server is running at ${API_BASE_URL}`);
        logInfo(`Server message: ${response.data.message}`);
      } else {
        throw new Error('Server responded but with unexpected format');
      }
    } catch (error) {
      // If root fails, try /ping
      try {
        await axios.get(`${API_BASE_URL}${API_PREFIX}/ping`, { timeout: 3000 });
        logSuccess(`Server is running at ${API_BASE_URL}`);
      } catch (pingError) {
        logError(`Cannot connect to server at ${API_BASE_URL}`);
        logWarning('Please make sure the server is running: npm run start:dev');
        logInfo(`Tried endpoints: ${API_BASE_URL}/ and ${API_BASE_URL}${API_PREFIX}/ping`);
        logInfo(`Error: ${error.message || pingError.message}`);
        throw error;
      }
    }
  } catch (error) {
    process.exit(1);
  }

  const results = {
    orderReceipt: null,
    subscriptionReport: null,
    partnerContract: null,
    invoice: null,
    legalDocument: null,
  };

  log('\n📄 Testing PDF Generation Endpoints with Dummy Data\n', 'bright');
  logInfo('All tests use dummy data - backend will fetch actual data from database');

  // Test 1: Order Receipt
  log('\n1️⃣  Order Receipt PDF', 'cyan');
  log('-'.repeat(40), 'cyan');
  results.orderReceipt = await testOrderReceipt();
  await new Promise(resolve => setTimeout(resolve, 500)); // Small delay

  // Test 2: Subscription Report
  log('\n2️⃣  Subscription Report PDF', 'cyan');
  log('-'.repeat(40), 'cyan');
  results.subscriptionReport = await testSubscriptionReport();
  await new Promise(resolve => setTimeout(resolve, 500));

  // Test 3: Partner Contract
  log('\n3️⃣  Partner Contract PDF', 'cyan');
  log('-'.repeat(40), 'cyan');
  results.partnerContract = await testPartnerContract();
  await new Promise(resolve => setTimeout(resolve, 500));

  // Test 4: Invoice (Order)
  log('\n4️⃣  Invoice PDF (Order)', 'cyan');
  log('-'.repeat(40), 'cyan');
  results.invoice = await testInvoice();
  await new Promise(resolve => setTimeout(resolve, 500));

  // Test 5: Legal Document
  log('\n5️⃣  Legal Document PDF', 'cyan');
  log('-'.repeat(40), 'cyan');
  results.legalDocument = await testLegalDocument();

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 Test Summary', 'bright');
  log('='.repeat(60), 'cyan');

  const successful = Object.values(results).filter(r => r?.success).length;
  const total = Object.keys(results).length;

  log(`\nTotal Tests: ${total}`);
  logSuccess(`Successful: ${successful}`);
  if (successful < total) {
    logError(`Failed: ${total - successful}`);
  }

  log('\n📁 Generated PDFs Location:', 'bright');
  log(`   ${OUTPUT_DIR}`, 'cyan');

  log('\n📋 Results:', 'bright');
  Object.entries(results).forEach(([key, result]) => {
    if (result?.success) {
      logSuccess(`${key}: ✓ (${(result.size / 1024).toFixed(2)} KB)`);
    } else {
      logError(`${key}: ✗ (${result?.error || 'Unknown error'})`);
    }
  });

  log('\n' + '='.repeat(60) + '\n', 'cyan');

  if (successful === total) {
    logSuccess('All PDF generation tests completed successfully! 🎉');
    process.exit(0);
  } else {
    logWarning('Some tests failed. Check the errors above.');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  logError(`Test script failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});

