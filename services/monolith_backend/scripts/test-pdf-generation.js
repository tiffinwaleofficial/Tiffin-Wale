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
const DATA_DIR = path.join(__dirname, 'data');

// Load data from JSON files
let TIFFIN_CENTERS = [];
let CUSTOMERS = [];

try {
  const partnersPath = path.join(DATA_DIR, 'partners.json');
  const customersPath = path.join(DATA_DIR, 'customers.json');
  
  if (fs.existsSync(partnersPath)) {
    TIFFIN_CENTERS = JSON.parse(fs.readFileSync(partnersPath, 'utf-8'));
  }
  
  if (fs.existsSync(customersPath)) {
    CUSTOMERS = JSON.parse(fs.readFileSync(customersPath, 'utf-8'));
  }
} catch (error) {
  console.error('Error loading data files:', error.message);
  process.exit(1);
}

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
 * Generate Customer Financial Report Dummy Data
 */
function generateCustomerFinancialReportData() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculate dates for past 3 months
  const months = [];
  for (let i = 2; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    months.push(date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }));
  }
  
  // Calculate totals from customers
  const totalUsers = CUSTOMERS.length;
  const activeSubscriptions = CUSTOMERS.filter(c => c.status === 'active').length;
  const totalRevenue = CUSTOMERS.reduce((sum, c) => sum + (c.price || 0), 0);
  const currentMonthRevenue = CUSTOMERS
    .filter(c => {
      const purchaseDate = new Date(c.purchaseDate);
      return purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear;
    })
    .reduce((sum, c) => sum + (c.price || 0), 0);
  
  // Generate metrics
  const currentMonthSubs = CUSTOMERS.filter(c => {
    const purchaseDate = new Date(c.purchaseDate);
    return purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear;
  }).length;
  
  const lastMonthSubs = CUSTOMERS.filter(c => {
    const purchaseDate = new Date(c.purchaseDate);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return purchaseDate.getMonth() === lastMonth && purchaseDate.getFullYear() === lastMonthYear;
  }).length;
  
  // Revenue by plan type
  const planTypes = {};
  CUSTOMERS.forEach(c => {
    if (!planTypes[c.planName]) {
      planTypes[c.planName] = { subscribers: 0, totalRevenue: 0 };
    }
    planTypes[c.planName].subscribers++;
    planTypes[c.planName].totalRevenue += c.price || 0;
  });
  
  const byPlanType = Object.keys(planTypes).map(planName => ({
    planName,
    subscribers: planTypes[planName].subscribers,
    monthlyRevenue: planTypes[planName].totalRevenue / 3, // Approximate
    totalRevenue: planTypes[planName].totalRevenue,
    percentage: Math.round((planTypes[planName].totalRevenue / totalRevenue) * 100),
  }));
  
  // Generate chart data
  const subscriptionTrendData = [lastMonthSubs, currentMonthSubs, currentMonthSubs + Math.floor(Math.random() * 5)];
  const revenueBarData = months.map((_, i) => {
    const baseRevenue = totalRevenue / 3;
    return Math.floor(baseRevenue * (0.8 + Math.random() * 0.4));
  });
  const planDistributionData = byPlanType.map(p => p.totalRevenue);
  const planDistributionLabels = byPlanType.map(p => p.planName);
  
  return {
    generationDate: now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    reportPeriod: 'All Time',
    summary: {
      totalUsers,
      activeSubscriptions,
      totalRevenue,
      currentMonthRevenue,
    },
    metrics: {
      currentMonth: {
        newSubscriptions: currentMonthSubs,
        usersOnboarded: currentMonthSubs,
        revenue: currentMonthRevenue,
        growthPercent: lastMonthSubs > 0 ? Math.round(((currentMonthSubs - lastMonthSubs) / lastMonthSubs) * 100) : 0,
      },
      lastMonth: {
        newSubscriptions: lastMonthSubs,
        usersOnboarded: lastMonthSubs,
        revenue: Math.floor(totalRevenue / 3),
        growthPercent: 0,
      },
      past3Months: months.map((month, i) => ({
        month,
        newSubscriptions: subscriptionTrendData[i] || 0,
        usersOnboarded: subscriptionTrendData[i] || 0,
        revenue: revenueBarData[i] || 0,
        growthPercent: i > 0 ? Math.round(((subscriptionTrendData[i] - subscriptionTrendData[i-1]) / subscriptionTrendData[i-1]) * 100) : 0,
      })),
    },
    revenueBreakdown: {
      totalRevenue,
      byPlanType,
    },
    users: CUSTOMERS.map(c => ({
      userId: c.userId,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      planName: c.planName,
      price: c.price,
      purchaseDate: c.purchaseDate,
      status: c.status,
      renewalDate: c.renewalDate,
    })),
    charts: {
      subscriptionTrend: {
        labels: months,
        data: subscriptionTrendData,
      },
      revenueBar: {
        labels: months,
        data: revenueBarData,
      },
      planDistribution: {
        labels: planDistributionLabels,
        data: planDistributionData,
      },
    },
  };
}

/**
 * Generate Partner Financial Report Dummy Data
 */
function generatePartnerFinancialReportData() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculate dates for past 3 months
  const months = [];
  for (let i = 2; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    months.push(date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }));
  }
  
  const totalPartners = TIFFIN_CENTERS.length;
  const activePartners = totalPartners; // Assume all are active
  
  // Generate partner financial data
  const partners = TIFFIN_CENTERS.map((center, index) => {
    const totalRevenue = 50000 + Math.floor(Math.random() * 200000);
    const commissionRate = 18 + Math.floor(Math.random() * 5); // 18-22%
    const partnerShare = Math.floor(totalRevenue * (1 - commissionRate / 100));
    const companyShare = totalRevenue - partnerShare;
    const totalOrders = 100 + Math.floor(Math.random() * 400);
    const avgOrderValue = Math.floor(totalRevenue / totalOrders);
    const cashBurnPerMonth = 15000 + Math.floor(Math.random() * 10000);
    
    const onboardingDate = new Date(center.establishedYear || 2020, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    
    return {
      partnerId: `partner_${String(index + 1).padStart(3, '0')}`,
      businessName: center.businessName,
      ownerName: center.ownerName,
      address: center.address.full,
      onboardingDate: onboardingDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'active',
      totalOrders,
      totalRevenue,
      partnerShare,
      companyShare,
      cashBurnPerMonth,
      avgOrderValue,
      commissionEarned: companyShare,
    };
  });
  
  const totalCompanyRevenue = partners.reduce((sum, p) => sum + p.companyShare, 0);
  const totalPartnerPayouts = partners.reduce((sum, p) => sum + p.partnerShare, 0);
  
  // Generate cost analysis
  const cac = 50000;
  const advertisementExpenses = 75000;
  const marketingCosts = 30000;
  const operationalCosts = 100000;
  const totalOperatingCosts = cac + advertisementExpenses + marketingCosts + operationalCosts;
  
  // Generate monthly advertisement breakdown
  const monthlyAdvertisementBreakdown = months.map(month => ({
    month,
    advertisementSpend: 20000 + Math.floor(Math.random() * 10000),
    newCustomers: 5 + Math.floor(Math.random() * 10),
    cac: 2000 + Math.floor(Math.random() * 1000),
  }));
  
  // Generate chart data
  const partnerOnboardingData = [2, 3, 2]; // New partners per month
  const revenueTrendCompanyData = months.map(() => Math.floor(totalCompanyRevenue / 3 * (0.9 + Math.random() * 0.2)));
  const revenueTrendPartnerData = months.map(() => Math.floor(totalPartnerPayouts / 3 * (0.9 + Math.random() * 0.2)));
  const profitMarginData = months.map(() => 15 + Math.floor(Math.random() * 10)); // 15-25%
  
  return {
    generationDate: now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    reportPeriod: 'All Time',
    summary: {
      totalPartners,
      activePartners,
      totalCompanyRevenue,
      totalPartnerPayouts,
    },
    metrics: {
      currentMonth: {
        newPartners: 2,
        totalRevenue: revenueTrendCompanyData[2] + revenueTrendPartnerData[2],
        totalOrders: partners.reduce((sum, p) => sum + p.totalOrders, 0) / 3,
        growthPercent: 15,
      },
      lastMonth: {
        newPartners: 3,
        totalRevenue: revenueTrendCompanyData[1] + revenueTrendPartnerData[1],
        totalOrders: partners.reduce((sum, p) => sum + p.totalOrders, 0) / 3,
        growthPercent: 10,
      },
      past3Months: months.map((month, i) => ({
        month,
        newPartners: partnerOnboardingData[i] || 0,
        totalRevenue: revenueTrendCompanyData[i] + revenueTrendPartnerData[i],
        totalOrders: Math.floor(partners.reduce((sum, p) => sum + p.totalOrders, 0) / 3),
        growthPercent: 10 + Math.floor(Math.random() * 10),
      })),
    },
    financialMetrics: {
      totalCompanyRevenue,
      totalPartnerPayouts,
      otherTaxes: 5000,
      operatingCosts: totalOperatingCosts,
    },
    costAnalysis: {
      cac,
      advertisementExpenses,
      marketingCosts,
      operationalCosts,
      monthlyAdvertisementBreakdown,
    },
    perPartnerBreakdown: partners.map(p => ({
      partnerId: p.partnerId,
      businessName: p.businessName,
      cashBurnPerMonth: p.cashBurnPerMonth,
      avgOrderValue: p.avgOrderValue,
      totalOrders: p.totalOrders,
      totalRevenue: p.totalRevenue,
      partnerShare: p.partnerShare,
      companyShare: p.companyShare,
      commissionEarned: p.commissionEarned,
    })),
    partners: partners.map(p => ({
      partnerId: p.partnerId,
      businessName: p.businessName,
      ownerName: p.ownerName,
      address: p.address,
      onboardingDate: p.onboardingDate,
      status: p.status,
      totalOrders: p.totalOrders,
      totalRevenue: p.totalRevenue,
      partnerShare: p.partnerShare,
      companyShare: p.companyShare,
    })),
    charts: {
      partnerOnboarding: {
        labels: months,
        data: partnerOnboardingData,
      },
      revenueTrend: {
        labels: months,
        companyData: revenueTrendCompanyData,
        partnerData: revenueTrendPartnerData,
      },
      revenueDistribution: {
        labels: ['Company Revenue', 'Partner Revenue'],
        data: [totalCompanyRevenue, totalPartnerPayouts],
      },
      costBreakdown: {
        labels: ['CAC', 'Advertisement', 'Marketing', 'Operations'],
        data: [cac, advertisementExpenses, marketingCosts, operationalCosts],
      },
      profitMargin: {
        labels: months,
        data: profitMarginData,
      },
    },
  };
}

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
 * Generate Customer Financial Report PDF
 */
async function generateCustomerFinancialReport() {
  try {
    const dummyData = generateCustomerFinancialReportData();
    
    const response = await axios.post(
      `${API_BASE_URL}${API_PREFIX}/report/customer-financial-report`,
      dummyData,
      {
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000,
      }
    );

    const filename = `customer-financial-report-${Date.now()}.pdf`;
    const filePath = await savePdf(response.data, filename, 'financial-reports');
    
    logSuccess('Customer Financial Report generated successfully!');
    logInfo(`   Saved: ${filePath}`);
    logInfo(`   Size: ${(response.data.length / 1024).toFixed(2)} KB`);
    
    return { success: true, filePath, size: response.data.length };
  } catch (error) {
    logError(`Failed: ${error.response?.data?.message || error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Generate Partner Financial Report PDF
 */
async function generatePartnerFinancialReport() {
  try {
    const dummyData = generatePartnerFinancialReportData();
    
    const response = await axios.post(
      `${API_BASE_URL}${API_PREFIX}/report/partner-financial-report`,
      dummyData,
      {
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000,
      }
    );

    const filename = `partner-financial-report-${Date.now()}.pdf`;
    const filePath = await savePdf(response.data, filename, 'financial-reports');
    
    logSuccess('Partner Financial Report generated successfully!');
    logInfo(`   Saved: ${filePath}`);
    logInfo(`   Size: ${(response.data.length / 1024).toFixed(2)} KB`);
    
    return { success: true, filePath, size: response.data.length };
  } catch (error) {
    logError(`Failed: ${error.response?.data?.message || error.message}`);
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
  log('   4. All Legal Documents (MoU + Service Agreement + NDA)', 'cyan');
  log('   5. Customer Financial Report', 'cyan');
  log('   6. Partner Financial Report', 'cyan');
  log('   7. All Financial Reports (Customer + Partner)\n', 'cyan');
  
  const categoryInput = await askQuestion(rl, 'Select category (1-7): ');
  const category = parseInt(categoryInput);
  
  if (isNaN(category) || category < 1 || category > 7) {
    logError('Invalid category selection!');
    rl.close();
    process.exit(1);
  }

  // Handle financial reports (no quantity needed)
  if (category === 5 || category === 6 || category === 7) {
    rl.close();
    
    log('\n' + '='.repeat(70), 'cyan');
    log(`🚀 Generating Financial Report(s)`, 'bright');
    log('='.repeat(70) + '\n', 'cyan');

    const results = [];
    
    if (category === 5 || category === 7) {
      const result = await generateCustomerFinancialReport();
      results.push({ type: 'Customer Financial Report', ...result });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (category === 6 || category === 7) {
      const result = await generatePartnerFinancialReport();
      results.push({ type: 'Partner Financial Report', ...result });
      await new Promise(resolve => setTimeout(resolve, 500));
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
    log(`   ${OUTPUT_DIR}/financial-reports`, 'cyan');

    log('\n📋 Detailed Results:', 'bright');
    results.forEach((result, idx) => {
      if (result.success) {
        logSuccess(`${idx + 1}. ${result.type} (${(result.size / 1024).toFixed(2)} KB)`);
      } else {
        logError(`${idx + 1}. ${result.type} (${result.error})`);
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
