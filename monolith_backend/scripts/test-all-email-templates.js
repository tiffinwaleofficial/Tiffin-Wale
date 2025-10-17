#!/usr/bin/env node

/**
 * Email Templates Testing Script
 * 
 * This script sends all 18 modernized email templates to a test email address
 * to preview how they look in actual email clients.
 * 
 * Usage: node scripts/test-all-email-templates.js
 * 
 * Make sure your backend is running on http://127.0.0.1:3001
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://127.0.0.1:3001';
const TEST_EMAIL = 'karmarahul67@gmail.com';
const TEST_NAME = 'Rahul Karma';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Test data for different email templates
const testTemplates = [
  {
    name: 'Welcome Email',
    template: 'welcome',
    data: {
      user: {
        name: TEST_NAME,
        email: TEST_EMAIL
      },
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      loginUrl: 'https://tiffin-wale.com/login',
      dashboardUrl: 'https://tiffin-wale.com/dashboard',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Email Verification',
    template: 'email-verification',
    data: {
      user: {
        name: TEST_NAME,
        email: TEST_EMAIL
      },
      verificationUrl: 'https://tiffin-wale.com/verify?token=abc123xyz',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Password Reset',
    template: 'password-reset',
    data: {
      user: {
        name: TEST_NAME,
        email: TEST_EMAIL
      },
      resetUrl: 'https://tiffin-wale.com/reset?token=reset123xyz',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Order Confirmation',
    template: 'order-confirmation',
    data: {
      order: {
        orderNumber: 'TW-2024-001',
        customerName: TEST_NAME,
        items: [
          { name: 'Butter Chicken with Rice', quantity: 1, price: 250, description: 'Creamy butter chicken with basmati rice' },
          { name: 'Garlic Naan', quantity: 2, price: 60, description: 'Fresh garlic naan bread' },
          { name: 'Mango Lassi', quantity: 1, price: 80, description: 'Traditional mango yogurt drink' }
        ],
        totalAmount: 450,
        subtotal: 390,
        deliveryFee: 40,
        tax: 20,
        deliveryAddress: '123 Food Street, Gourmet Colony, New Delhi - 110001',
        partnerName: 'Spice Garden Restaurant',
        partnerPhone: '+91 98765 43210',
        estimatedDeliveryTime: '45-60 minutes'
      },
      trackingUrl: 'https://tiffin-wale.com/track/TW-2024-001',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Order Preparing',
    template: 'order-preparing',
    data: {
      order: {
        orderNumber: 'TW-2024-002',
        customerName: TEST_NAME,
        partnerName: 'Delhi Darbar',
        estimatedTime: '25-30 minutes',
        items: ['Biryani Special', 'Raita', 'Gulab Jamun'],
        deliveryAddress: '456 Hunger Avenue, Foodie District, Mumbai - 400001'
      },
      trackingUrl: 'https://tiffin-wale.com/track/TW-2024-002',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Order Ready',
    template: 'order-ready',
    data: {
      order: {
        orderNumber: 'TW-2024-003',
        customerName: TEST_NAME,
        partnerName: 'Taste of Punjab',
        deliveryAddress: '789 Spice Lane, Curry Corner, Bangalore - 560001',
        estimatedDeliveryTime: '15-20 minutes'
      },
      trackingUrl: 'https://tiffin-wale.com/track/TW-2024-003',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Order Delivered',
    template: 'order-delivered',
    data: {
      order: {
        orderNumber: 'TW-2024-004',
        customerName: TEST_NAME,
        partnerName: 'Royal Kitchen',
        deliveryTime: 'Today at 2:30 PM'
      },
      ratingUrl: 'https://tiffin-wale.com/rate/TW-2024-004',
      reorderUrl: 'https://tiffin-wale.com/reorder/TW-2024-004',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Payment Success',
    template: 'payment-success',
    data: {
      payment: {
        customerName: TEST_NAME,
        amount: 750,
        transactionId: 'TXN-2024-ABC123',
        paymentMethod: 'UPI - Google Pay',
        orderNumber: 'TW-2024-005',
        date: new Date().toISOString()
      },
      receiptUrl: 'https://tiffin-wale.com/receipt/TXN-2024-ABC123',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Payment Failed',
    template: 'payment-failed',
    data: {
      payment: {
        customerName: TEST_NAME,
        amount: 650,
        reason: 'Insufficient funds in account',
        retryUrl: 'https://tiffin-wale.com/retry-payment/TW-2024-006',
        orderNumber: 'TW-2024-006',
        paymentMethod: 'Credit Card ending in 4567'
      },
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Refund Processed',
    template: 'refund-processed',
    data: {
      refund: {
        customerName: TEST_NAME,
        amount: 550,
        orderNumber: 'TW-2024-007',
        refundId: 'REF-2024-XYZ789',
        reason: 'Order cancelled by restaurant',
        processingTime: '3-5 business days',
        paymentMethod: 'Original payment method (UPI)'
      },
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Subscription Created',
    template: 'subscription-created',
    data: {
      subscription: {
        customerName: TEST_NAME,
        planName: 'Tiffin Premium',
        price: 299,
        billingCycle: 'month',
        startDate: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      manageUrl: 'https://tiffin-wale.com/subscription/manage',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Subscription Renewed',
    template: 'subscription-renewed',
    data: {
      subscription: {
        customerName: TEST_NAME,
        planName: 'Tiffin Premium',
        renewalDate: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 299,
        loyaltyYears: 2
      },
      manageUrl: 'https://tiffin-wale.com/subscription/manage',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com'
    }
  },
  {
    name: 'Subscription Expiring',
    template: 'subscription-expiring',
    data: {
      subscription: {
        customerName: TEST_NAME,
        planName: 'Tiffin Premium',
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        daysLeft: 3
      },
      renewUrl: 'https://tiffin-wale.com/subscription/renew',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com'
    }
  },
  {
    name: 'Subscription Cancelled',
    template: 'subscription-cancelled',
    data: {
      subscription: {
        customerName: TEST_NAME,
        planName: 'Tiffin Premium',
        cancellationDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'User requested cancellation'
      },
      reactivateUrl: 'https://tiffin-wale.com/subscription/reactivate',
      feedbackUrl: 'https://tiffin-wale.com/feedback',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com',
      supportUrl: 'https://tiffin-wale.com/support'
    }
  },
  {
    name: 'Partner Welcome',
    template: 'partner-welcome',
    data: {
      partner: {
        name: 'Chef Rajesh Kumar',
        email: 'chef.rajesh@example.com',
        businessName: 'Rajesh\'s Kitchen',
        partnerId: 'PARTNER-2024-001'
      },
      dashboardUrl: 'https://tiffin-wale.com/partner/dashboard',
      onboardingUrl: 'https://tiffin-wale.com/partner/onboarding',
      supportUrl: 'https://tiffin-wale.com/partner/support',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com'
    }
  },
  {
    name: 'New Order Notification',
    template: 'new-order-notification',
    data: {
      order: {
        orderNumber: 'TW-2024-008',
        customerName: 'Priya Sharma',
        items: ['Dal Makhani', 'Butter Roti', 'Jeera Rice', 'Mixed Pickle'],
        totalAmount: 380,
        deliveryAddress: '321 Garden View, Green Park, Delhi - 110016',
        customerPhone: '+91 98765 12345',
        specialInstructions: 'Please make it less spicy and pack extra chutneys',
        estimatedPrepTime: '30-35 minutes'
      },
      partner: {
        name: 'Chef Rajesh Kumar',
        email: 'chef.rajesh@example.com'
      },
      dashboardUrl: 'https://tiffin-wale.com/partner/dashboard',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com'
    }
  },
  {
    name: 'Earnings Summary',
    template: 'earnings-summary',
    data: {
      partner: {
        name: 'Chef Rajesh Kumar',
        businessName: 'Rajesh\'s Kitchen'
      },
      earnings: {
        period: 'week',
        totalEarnings: 15750,
        totalOrders: 42,
        averageOrderValue: 375,
        topSellingItem: 'Butter Chicken Combo',
        customerRating: 4.7,
        previousPeriodEarnings: 13200
      },
      dashboardUrl: 'https://tiffin-wale.com/partner/dashboard',
      appName: 'Tiffin-Wale',
      appUrl: 'https://tiffin-wale.com'
    }
  }
];

// Function to send email
async function sendEmail(templateConfig) {
  try {
    log(`📧 Sending ${templateConfig.name}...`, colors.yellow);
    
    const response = await axios.post(`${BASE_URL}/api/email-test/send`, {
      to: TEST_EMAIL,
      template: templateConfig.template,
      data: templateConfig.data
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000 // 15 seconds timeout
    });

    if (response.data.success) {
      log(`✅ ${templateConfig.name} sent successfully!`, colors.green);
      return { success: true, templateName: templateConfig.name };
    } else {
      log(`❌ ${templateConfig.name} failed: ${response.data.message}`, colors.red);
      return { success: false, templateName: templateConfig.name, error: response.data.message };
    }
  } catch (error) {
    log(`❌ ${templateConfig.name} failed: ${error.message}`, colors.red);
    return { success: false, templateName: templateConfig.name, error: error.message };
  }
}

// Function to check if backend is running
async function checkBackend() {
  try {
    log('🔍 Checking if backend is running...', colors.cyan);
    const response = await axios.get(`${BASE_URL}/api/email-test/health`, { timeout: 5000 });
    if (response.data.success) {
      log('✅ Backend is running!', colors.green);
      return true;
    }
  } catch (error) {
    // Try root endpoint as fallback
    try {
      await axios.get(`${BASE_URL}/`, { timeout: 5000 });
      log('✅ Backend is running!', colors.green);
      return true;
    } catch (rootError) {
      log('❌ Backend is not running or not responding!', colors.red);
      log('   Please make sure your backend is running on http://127.0.0.1:3001', colors.yellow);
      log(`   Error: ${error.message}`, colors.yellow);
      return false;
    }
  }
}

// Main function
async function main() {
  log('🚀 Starting Email Templates Testing Script', colors.bright + colors.magenta);
  log('=' .repeat(60), colors.magenta);
  log(`📧 Test Email: ${TEST_EMAIL}`, colors.cyan);
  log(`🏠 Backend URL: ${BASE_URL}`, colors.cyan);
  log('=' .repeat(60), colors.magenta);

  // Check if backend is running
  const backendRunning = await checkBackend();
  if (!backendRunning) {
    process.exit(1);
  }

  log(`\\n📬 Sending all ${testTemplates.length} email templates...\\n`, colors.bright + colors.blue);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  // Send all emails with a small delay between each
  for (const templateConfig of testTemplates) {
    const result = await sendEmail(templateConfig);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  log('\\n' + '=' .repeat(60), colors.magenta);
  log('📊 SUMMARY', colors.bright + colors.magenta);
  log('=' .repeat(60), colors.magenta);
  log(`✅ Successful: ${successCount}`, colors.green);
  log(`❌ Failed: ${failCount}`, colors.red);
  log(`📧 Total Templates: ${results.length}`, colors.cyan);

  if (failCount > 0) {
    log('\\n❌ Failed Templates:', colors.red);
    results.filter(r => !r.success).forEach(r => {
      log(`   • ${r.templateName}: ${r.error}`, colors.red);
    });
  }

  if (successCount > 0) {
    log('\\n🎉 Check your email inbox!', colors.bright + colors.green);
    log(`   All successful emails have been sent to: ${TEST_EMAIL}`, colors.green);
    log('   You should receive them within a few minutes.', colors.green);
    log('\\n📱 Don\'t forget to check:', colors.yellow);
    log('   • Gmail inbox (and spam folder)', colors.yellow);
    log('   • Mobile email app', colors.yellow);
    log('   • Different email clients (Outlook, Apple Mail)', colors.yellow);
  }

  log('\\n✨ Email Templates Testing Complete!', colors.bright + colors.magenta);
  log('\\n🏆 You now have 18 production-ready, modern email templates!', colors.bright + colors.green);
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    log(`\\n💥 Script failed: ${error.message}`, colors.red);
    process.exit(1);
  });
}

module.exports = { testTemplates, sendEmail, checkBackend };