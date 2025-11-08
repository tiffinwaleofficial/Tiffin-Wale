#!/usr/bin/env node

/**
 * Interactive PDF Generation Test Script
 * 
 * Usage: node scripts/test-pdf-generation.js
 * 
 * Prerequisites:
 * - Server must be running (npm run start:dev)
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
const API_PREFIX = process.env.API_PREFIX || '/api';
const OUTPUT_DIR = path.join(__dirname, '../src/modules/report/formats/pdf/storage/generated');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
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
 * Create readline interface for user input
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask user a question and return the answer
 */
function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Generate a random date from past 3 months (August to October)
 */
function getRandomDateFromPast3Months() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11
  
  // Calculate months: August (7), September (8), October (9)
  // If current month is November (10), past 3 months are Aug, Sep, Oct
  // If current month is December (11), past 3 months are Sep, Oct, Nov
  // For simplicity, we'll use Aug, Sep, Oct of current year
  
  const months = [7, 8, 9]; // August, September, October (0-indexed: 7, 8, 9)
  const randomMonth = months[Math.floor(Math.random() * months.length)];
  
  // Get days in that month
  const daysInMonth = new Date(currentYear, randomMonth + 1, 0).getDate();
  const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
  
  const date = new Date(currentYear, randomMonth, randomDay);
  return date;
}

/**
 * Format date for API (ISO string)
 */
function formatDateForAPI(date) {
  return date.toISOString();
}

/**
 * Format date for display (DD Month YYYY)
 */
function formatDateForDisplay(date) {
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate dummy PAN number (10 chars: 5 letters + 4 digits + 1 letter)
 */
function generatePANNumber() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  
  // First 3 letters (usually first letter of name)
  const first3 = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  
  // 4th letter (usually first letter of surname) - common: A, B, C, F, G, H, L, P, T
  const fourthLetter = ['A', 'B', 'C', 'F', 'G', 'H', 'L', 'P', 'T'][Math.floor(Math.random() * 9)];
  
  // 5th letter (entity type) - common: A, B, C, F, G, H, L, P, T
  const fifthLetter = ['A', 'B', 'C', 'F', 'G', 'H', 'L', 'P', 'T'][Math.floor(Math.random() * 9)];
  
  // 4 digits
  const fourDigits = Array.from({ length: 4 }, () => digits[Math.floor(Math.random() * digits.length)]).join('');
  
  // Last letter (usually first letter of surname)
  const lastLetter = letters[Math.floor(Math.random() * letters.length)];
  
  return `${first3}${fourthLetter}${fifthLetter}${fourDigits}${lastLetter}`;
}

/**
 * Generate dummy GST number (15 chars: 2 state + 10 PAN + 3 entity + 1 check + Z)
 */
function generateGSTNumber() {
  const stateCode = '23'; // Madhya Pradesh
  const pan = generatePANNumber();
  const entityNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const checkDigit = Math.floor(Math.random() * 10);
  return `${stateCode}${pan}${entityNumber}${checkDigit}Z`;
}

/**
 * Generate dummy FSSAI license number
 */
function generateFSSAILicense() {
  const stateCode = '23'; // Madhya Pradesh
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${stateCode}/${year}/${randomNum}`;
}

/**
 * Generate dummy email
 */
function generateEmail(businessName) {
  const cleanName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const randomNum = Math.floor(Math.random() * 1000);
  return `${cleanName}${randomNum}@gmail.com`;
}

/**
 * Generate dummy phone number
 */
function generatePhoneNumber() {
  const prefixes = ['9826', '9827', '9828', '9829', '9893', '9894', '9895', '9896', '9897', '9898'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 100000).toString().padStart(6, '0');
  return `+91 ${prefix} ${suffix.substring(0, 3)} ${suffix.substring(3)}`;
}

/**
 * Tiffin Center Dummy Data
 * All addresses are from Indore, different locations
 */
const TIFFIN_CENTERS = [
  {
    businessName: 'Tipinwala Food Services',
    ownerName: 'Rajesh Kumar Sharma',
    address: {
      street: 'Near MIG Thana, Atal Dwar',
      area: 'New Palasia',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452001',
      full: 'Near MIG Thana, Atal Dwar, New Palasia, A B Road, Indore, Madhya Pradesh - 452001',
    },
    contactEmail: 'tipinwala.food@gmail.com',
    contactPhone: '+91 9826 123 456',
    whatsappNumber: '+91 9826 123 456',
    gstNumber: generateGSTNumber(),
    fssaiLicense: generateFSSAILicense(),
    establishedYear: 2018,
  },
  {
    businessName: 'Jay Ranjeet Tiffin Service',
    ownerName: 'Jay Ranjeet Singh',
    address: {
      street: 'Gumasta Nagar, Sector C',
      area: 'Near Tarakunj Garden, SCH No 71',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452009',
      full: 'Gumasta Nagar, Sector C, Near Tarakunj Garden, SCH No 71, Indore, Madhya Pradesh - 452009',
    },
    contactEmail: 'jayranjeet.tiffin@gmail.com',
    contactPhone: '+91 9827 234 567',
    whatsappNumber: '+91 9827 234 567',
    gstNumber: generateGSTNumber(),
    fssaiLicense: generateFSSAILicense(),
    establishedYear: 2019,
  },
  {
    businessName: 'Leven Foods',
    ownerName: 'Leela Venkatesh',
    address: {
      street: 'Vallabh Nagar',
      area: 'Near Rajkumar Bridge, Chouhan Indane Gas Agency',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452003',
      full: 'Vallabh Nagar, Near Rajkumar Bridge, Chouhan Indane Gas Agency, Indore, Madhya Pradesh - 452003',
    },
    contactEmail: 'leven.foods@gmail.com',
    contactPhone: '+91 9828 345 678',
    whatsappNumber: '+91 9828 345 678',
    gstNumber: generateGSTNumber(),
    fssaiLicense: generateFSSAILicense(),
    establishedYear: 2020,
  },
  {
    businessName: 'Annapurna Tiffin Center',
    ownerName: 'Priya Agarwal',
    address: {
      street: '59, Vishnu Puri Main',
      area: 'Vishnu Puri Colony',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452012',
      full: '59, Vishnu Puri Main, Vishnu Puri Colony, Indore, Madhya Pradesh - 452012',
    },
    contactEmail: 'annapurna.tiffin@gmail.com',
    contactPhone: '+91 9893 456 789',
    whatsappNumber: '+91 9893 456 789',
    gstNumber: generateGSTNumber(),
    fssaiLicense: generateFSSAILicense(),
    establishedYear: 2017,
  },
  {
    businessName: 'Samyak Tiffin Centre',
    ownerName: 'Samyak Jain',
    address: {
      street: 'Vijay Nagar',
      area: 'Near K3 IAS Library',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452010',
      full: 'Vijay Nagar, Near K3 IAS Library, Indore, Madhya Pradesh - 452010',
    },
    contactEmail: 'samyak.tiffin@gmail.com',
    contactPhone: '+91 9894 567 890',
    whatsappNumber: '+91 9894 567 890',
    gstNumber: generateGSTNumber(),
    fssaiLicense: generateFSSAILicense(),
    establishedYear: 2019,
  },
  {
    businessName: "Veronica's Kitchen & Tiffin Center",
    ownerName: 'Veronica D\'Souza',
    address: {
      street: 'Hotel Sourabh Inn',
      area: 'Sanchar Nagar Extension',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452016',
      full: 'Hotel Sourabh Inn, Sanchar Nagar Extension, Indore, Madhya Pradesh - 452016',
    },
    contactEmail: 'veronica.kitchen@gmail.com',
    contactPhone: '+91 9895 678 901',
    whatsappNumber: '+91 9895 678 901',
    gstNumber: generateGSTNumber(),
    fssaiLicense: generateFSSAILicense(),
    establishedYear: 2018,
  },
  {
    businessName: 'Ghar Sa Khana Tiffin Services',
    ownerName: 'Amit Patel',
    address: {
      street: 'Near Sri Aurobindo Institute of Pharmacy',
      area: 'Shri Aurobindo',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452013',
      full: 'Near Sri Aurobindo Institute of Pharmacy, Shri Aurobindo, Indore, Madhya Pradesh - 452013',
    },
    contactEmail: 'gharsakhana.tiffin@gmail.com',
    contactPhone: '+91 9896 789 012',
    whatsappNumber: '+91 9896 789 012',
    gstNumber: generateGSTNumber(),
    fssaiLicense: generateFSSAILicense(),
    establishedYear: 2021,
  },
  {
    businessName: 'Shree Thakur Baba Tiffin Service',
    ownerName: 'Ramesh Thakur',
    address: {
      street: 'Scheme 78, Opposite Prestige College',
      area: 'Vijay Nagar, MR 10 Road',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452010',
      full: 'Scheme 78, Opposite Prestige College, Vijay Nagar, MR 10 Road, Indore, Madhya Pradesh - 452010',
    },
    contactEmail: 'thakurbaba.tiffin@gmail.com',
    contactPhone: '+91 9897 890 123',
    whatsappNumber: '+91 9897 890 123',
    gstNumber: generateGSTNumber(),
    fssaiLicense: generateFSSAILicense(),
    establishedYear: 2016,
  },
  {
    businessName: 'Diet Dial',
    ownerName: 'Dr. Anjali Mehta',
    address: {
      street: 'Corporate Office',
      area: 'Palasia',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452001',
      full: 'Corporate Office, Palasia, Indore, Madhya Pradesh - 452001',
    },
    contactEmail: 'dietdial.indore@gmail.com',
    contactPhone: '+91 9898 901 234',
    whatsappNumber: '+91 9898 901 234',
    gstNumber: generateGSTNumber(),
    fssaiLicense: generateFSSAILicense(),
    establishedYear: 2020,
  },
  {
    businessName: 'Bhojankart',
    ownerName: 'Vikram Singh',
    address: {
      street: 'Central Kitchen',
      area: 'Sapna Sangeeta Road',
      city: 'Indore',
      state: 'Madhya Pradesh',
      postalCode: '452001',
      full: 'Central Kitchen, Sapna Sangeeta Road, Indore, Madhya Pradesh - 452001',
    },
    contactEmail: 'bhojankart.indore@gmail.com',
    contactPhone: '+91 9826 012 345',
    whatsappNumber: '+91 9826 012 345',
    gstNumber: generateGSTNumber(),
    fssaiLicense: generateFSSAILicense(),
    establishedYear: 2019,
  },
];

/**
 * Company Info (Rira Industries - Consistent Vijay Nagar Address)
 */
const COMPANY_INFO = {
  name: 'RI RA INDUSTRIES PRIVATE LIMITED',
  shortName: 'Tiffin Wale',
  website: 'www.tiffin-wale.com',
  email: 'contact@tiffin-wale.com',
  phone: '+91 91311 14837',
  address: {
    line1: '23, Vijay Nagar',
    city: 'Indore',
    state: 'Madhya Pradesh',
    zip: '452010',
    full: '23, Vijay Nagar, Indore, Madhya Pradesh - 452010',
  },
  gstNumber: generateGSTNumber(), // Generate proper GST format
  panNumber: generatePANNumber(), // Generate proper PAN format
};

/**
 * Save PDF buffer to file
 */
async function savePdf(buffer, filename, category) {
  const categoryDir = path.join(OUTPUT_DIR, category);
  
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  const filePath = path.join(categoryDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

/**
 * Generate Partner MoU PDF
 */
async function generatePartnerMou(centerData, index) {
  try {
    // Create a dummy partner ID (24 hex chars)
    const partnerId = Array.from({ length: 24 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    const effectiveDate = getRandomDateFromPast3Months();
    const expiryDate = new Date(effectiveDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    // Split owner name into first and last name
    const ownerNameParts = centerData.ownerName.split(' ');
    const ownerFirstName = ownerNameParts[0] || '';
    const ownerLastName = ownerNameParts.slice(1).join(' ') || '';

    const response = await axios.post(
      `${API_BASE_URL}${API_PREFIX}/report/partner-mou`,
      {
        partnerData: {
          businessName: centerData.businessName,
          ownerFirstName: ownerFirstName,
          ownerLastName: ownerLastName,
          address: centerData.address.full,
          contactEmail: centerData.contactEmail,
          contactPhone: centerData.contactPhone,
          whatsappNumber: centerData.whatsappNumber,
          gstNumber: centerData.gstNumber,
          licenseNumber: centerData.fssaiLicense,
          establishedYear: centerData.establishedYear,
        },
        commissionRate: 18 + Math.floor(Math.random() * 5), // 18-22%
        paymentTerms: 'Weekly payments via bank transfer',
        contractDuration: '12 months',
        terminationNotice: '30 days',
        minimumRating: 4.0 + (Math.random() * 0.5), // 4.0-4.5
        effectiveDate: formatDateForAPI(effectiveDate),
        expiryDate: formatDateForAPI(expiryDate),
      },
      {
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000, // 2 minutes timeout for PDF generation
      }
    );

    const filename = `partner-mou-${centerData.businessName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.pdf`;
    const filePath = await savePdf(response.data, filename, 'legal-documents');
    
    logSuccess(`[${index + 1}] Partner MoU: ${centerData.businessName}`);
    logInfo(`   Saved: ${filePath}`);
    logInfo(`   Size: ${(response.data.length / 1024).toFixed(2)} KB`);
    
    return { success: true, filePath, size: response.data.length };
  } catch (error) {
    logError(`[${index + 1}] Failed: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Generate Service Agreement PDF
 */
async function generateServiceAgreement(centerData, index) {
  try {
    const partnerId = Array.from({ length: 24 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    const effectiveDate = getRandomDateFromPast3Months();
    const expiryDate = new Date(effectiveDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    
    // Split owner name into first and last name
    const ownerNameParts = centerData.ownerName.split(' ');
    const ownerFirstName = ownerNameParts[0] || '';
    const ownerLastName = ownerNameParts.slice(1).join(' ') || '';

    const response = await axios.post(
      `${API_BASE_URL}${API_PREFIX}/report/service-agreement`,
      {
        partnerData: {
          businessName: centerData.businessName,
          ownerFirstName: ownerFirstName,
          ownerLastName: ownerLastName,
          address: centerData.address.full,
          contactEmail: centerData.contactEmail,
          contactPhone: centerData.contactPhone,
          whatsappNumber: centerData.whatsappNumber,
          gstNumber: centerData.gstNumber,
          licenseNumber: centerData.fssaiLicense,
          establishedYear: centerData.establishedYear,
        },
        commissionRate: 18 + Math.floor(Math.random() * 5),
        paymentTerms: 'Weekly payments via bank transfer',
        contractDuration: '12 months',
        terminationNotice: '30 days',
        minimumRating: 4.0 + (Math.random() * 0.5),
        minimumAcceptanceRate: 90 + Math.floor(Math.random() * 10), // 90-99%
        orderAcceptanceTime: 5,
        cancellationPolicy: 'Orders can be cancelled within 5 minutes of placement. After that, cancellation is subject to Partner\'s approval.',
        commissionChangeNotice: '30 days',
        paymentProcessingDays: 7,
        minimumPayoutAmount: 1000,
        companyGstNumber: COMPANY_INFO.gstNumber,
        companyPanNumber: COMPANY_INFO.panNumber,
        effectiveDate: formatDateForAPI(effectiveDate),
        expiryDate: formatDateForAPI(expiryDate),
      },
      {
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000, // 2 minutes timeout for PDF generation
      }
    );

    const filename = `service-agreement-${centerData.businessName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.pdf`;
    const filePath = await savePdf(response.data, filename, 'legal-documents');
    
    logSuccess(`[${index + 1}] Service Agreement: ${centerData.businessName}`);
    logInfo(`   Saved: ${filePath}`);
    logInfo(`   Size: ${(response.data.length / 1024).toFixed(2)} KB`);
    
    return { success: true, filePath, size: response.data.length };
  } catch (error) {
    logError(`[${index + 1}] Failed: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Generate Partner NDA PDF
 */
async function generatePartnerNda(centerData, index) {
  try {
    const partnerId = Array.from({ length: 24 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    const effectiveDate = getRandomDateFromPast3Months();
    const expiryDate = new Date(effectiveDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    
    // Split owner name into first and last name
    const ownerNameParts = centerData.ownerName.split(' ');
    const ownerFirstName = ownerNameParts[0] || '';
    const ownerLastName = ownerNameParts.slice(1).join(' ') || '';

    const response = await axios.post(
      `${API_BASE_URL}${API_PREFIX}/report/partner-nda`,
      {
        partnerData: {
          businessName: centerData.businessName,
          ownerFirstName: ownerFirstName,
          ownerLastName: ownerLastName,
          address: centerData.address.full,
          contactEmail: centerData.contactEmail,
          contactPhone: centerData.contactPhone,
          whatsappNumber: centerData.whatsappNumber,
          gstNumber: centerData.gstNumber,
          licenseNumber: centerData.fssaiLicense,
          establishedYear: centerData.establishedYear,
        },
        purpose: 'partnering with Tiffin Wale to offer food services through the Tiffin Wale platform',
        term: '2 years',
        survivalPeriod: '3',
        companyGstNumber: COMPANY_INFO.gstNumber,
        companyPanNumber: COMPANY_INFO.panNumber,
        effectiveDate: formatDateForAPI(effectiveDate),
        expiryDate: formatDateForAPI(expiryDate),
      },
      {
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000, // 2 minutes timeout for PDF generation
      }
    );

    const filename = `partner-nda-${centerData.businessName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.pdf`;
    const filePath = await savePdf(response.data, filename, 'legal-documents');
    
    logSuccess(`[${index + 1}] Partner NDA: ${centerData.businessName}`);
    logInfo(`   Saved: ${filePath}`);
    logInfo(`   Size: ${(response.data.length / 1024).toFixed(2)} KB`);
    
    return { success: true, filePath, size: response.data.length };
  } catch (error) {
    logError(`[${index + 1}] Failed: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main interactive function
 */
async function main() {
  const rl = createReadlineInterface();
  
  log('\n' + '='.repeat(70), 'cyan');
  log('🧪 Interactive PDF Generation Test Script', 'bright');
  log('='.repeat(70) + '\n', 'cyan');

  // Check if server is running
  try {
    const response = await axios.get(`${API_BASE_URL}/`, { timeout: 3000 });
    if (response.data && response.data.status === 'ok') {
      logSuccess(`Server is running at ${API_BASE_URL}`);
    } else {
      throw new Error('Server responded but with unexpected format');
    }
  } catch (error) {
    logError(`Cannot connect to server at ${API_BASE_URL}`);
    logWarning('Please make sure the server is running: npm run start:dev');
    rl.close();
    process.exit(1);
  }

  // Ask for document category
  log('\n📋 Available Document Categories:', 'bright');
  log('   1. Partner MoU (Memorandum of Understanding)', 'cyan');
  log('   2. Service Agreement', 'cyan');
  log('   3. Partner NDA (Non-Disclosure Agreement)', 'cyan');
  log('   4. All Legal Documents (MoU + Service Agreement + NDA)\n', 'cyan');
  
  const categoryInput = await askQuestion(rl, 'Select category (1-4): ');
  const category = parseInt(categoryInput);
  
  if (isNaN(category) || category < 1 || category > 4) {
    logError('Invalid category selection!');
    rl.close();
    process.exit(1);
  }

  // Ask for quantity
  const quantityInput = await askQuestion(rl, 'How many documents to generate? (1-10): ');
  const quantity = parseInt(quantityInput);
  
  if (isNaN(quantity) || quantity < 1 || quantity > 10) {
    logError('Quantity must be between 1 and 10!');
    rl.close();
    process.exit(1);
  }

  rl.close();

  // Select centers
  const selectedCenters = TIFFIN_CENTERS.slice(0, quantity);
  
  log('\n' + '='.repeat(70), 'cyan');
  log(`🚀 Generating ${quantity} document(s) for category: ${category === 1 ? 'Partner MoU' : category === 2 ? 'Service Agreement' : category === 3 ? 'Partner NDA' : 'All Legal Documents'}`, 'bright');
  log('='.repeat(70) + '\n', 'cyan');

  const results = [];
  
  for (let i = 0; i < selectedCenters.length; i++) {
    const center = selectedCenters[i];
    
    if (category === 1 || category === 4) {
      // Generate MoU
      const result = await generatePartnerMou(center, i);
      results.push({ type: 'Partner MoU', center: center.businessName, ...result });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (category === 2 || category === 4) {
      // Generate Service Agreement
      const result = await generateServiceAgreement(center, i);
      results.push({ type: 'Service Agreement', center: center.businessName, ...result });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (category === 3 || category === 4) {
      // Generate NDA
      const result = await generatePartnerNda(center, i);
      results.push({ type: 'Partner NDA', center: center.businessName, ...result });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Summary
  log('\n' + '='.repeat(70), 'cyan');
  log('📊 Generation Summary', 'bright');
  log('='.repeat(70), 'cyan');

  const successful = results.filter(r => r.success).length;
  const total = results.length;

  log(`\nTotal Documents: ${total}`);
  logSuccess(`Successful: ${successful}`);
  if (successful < total) {
    logError(`Failed: ${total - successful}`);
  }

  log('\n📁 Generated PDFs Location:', 'bright');
  log(`   ${OUTPUT_DIR}`, 'cyan');

  log('\n📋 Detailed Results:', 'bright');
  results.forEach((result, idx) => {
    if (result.success) {
      logSuccess(`${idx + 1}. ${result.type} - ${result.center} (${(result.size / 1024).toFixed(2)} KB)`);
    } else {
      logError(`${idx + 1}. ${result.type} - ${result.center} (${result.error})`);
    }
  });

  log('\n' + '='.repeat(70) + '\n', 'cyan');

  if (successful === total) {
    logSuccess('All PDFs generated successfully! 🎉');
    process.exit(0);
  } else {
    logWarning('Some PDFs failed to generate. Check the errors above.');
    process.exit(1);
  }
}

// Run
main().catch((error) => {
  logError(`Script failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
