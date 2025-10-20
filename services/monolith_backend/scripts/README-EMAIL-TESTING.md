# 📧 Email Templates Testing Guide

This guide helps you test all 18 modernized email templates by sending them to your email address.

## 🚀 Quick Start

### Prerequisites
1. Make sure your backend is running on `http://127.0.0.1:3001`
2. Ensure your email service is configured and working

### Run the Test Script

**Option 1: Using npm script (Recommended)**
```bash
npm run test:emails
```

**Option 2: Using bun (if you have bun installed)**
```bash
bun run test:emails
```

**Option 3: Direct node execution**
```bash
node scripts/test-all-email-templates.js
```

## 📬 What You'll Receive

The script will send **18 beautiful, modernized email templates** to `karmarahul67@gmail.com`:

### Customer Emails (7)
1. **Welcome Email** - Onboarding with promo code
2. **Email Verification** - Account verification with security tips
3. **Password Reset** - Security-focused reset instructions
4. **Order Confirmation** - 4-step progress tracker
5. **Order Preparing** - Chef info and preparation timeline
6. **Order Ready** - Delivery tracking and partner details
7. **Order Delivered** - Rating CTA and reorder option

### Payment Emails (3)
8. **Payment Success** - Receipt design with transaction details
9. **Payment Failed** - Retry CTA with common issues
10. **Refund Processed** - Processing timeline and notices

### Subscription Emails (4)
11. **Subscription Created** - Plan details and welcome bonus
12. **Subscription Renewed** - Loyalty rewards and benefits
13. **Subscription Expiring** - Urgency countdown and renewal CTA
14. **Subscription Cancelled** - Win-back offer and feedback request

### Partner Emails (4)
15. **Partner Welcome** - Business setup and benefits
16. **New Order Notification** - Order alert for restaurant partners
17. **Earnings Summary** - Performance metrics and growth tips

## 🎨 Email Features

All templates include:
- 📱 **Mobile-responsive design** (600px width, <600px breakpoints)
- 🎨 **Beautiful gradient headers** (customizable colors)
- ✨ **19 SVG icons** (email-safe, inline rendering)
- 🎯 **Clear visual hierarchy** with professional typography
- 💫 **Modern color palette** (Orange/Green/Blue themed)
- 📦 **Reusable components** (InfoCard, ProgressTracker, Button)
- 🌐 **Social media footer** (Facebook, Instagram, Twitter)

## 🔧 Customization

To change the test email address, edit the script:

```javascript
// In scripts/test-all-email-templates.js
const TEST_EMAIL = 'your-email@example.com';
const TEST_NAME = 'Your Name';
```

## 📊 Script Output

The script provides detailed feedback:

```
🚀 Starting Email Templates Testing Script
============================================================
📧 Test Email: karmarahul67@gmail.com
🏠 Backend URL: http://127.0.0.1:3001
============================================================

🔍 Checking if backend is running...
✅ Backend is running!

📬 Sending all 18 email templates...

📧 Sending welcomeEmail...
✅ welcomeEmail sent successfully!
📧 Sending emailVerification...
✅ emailVerification sent successfully!
...

============================================================
📊 SUMMARY
============================================================
✅ Successful: 18
❌ Failed: 0
📧 Total Templates: 18

🎉 Check your email inbox!
   All successful emails have been sent to: karmarahul67@gmail.com
   You should receive them within a few minutes.

✨ Email Templates Testing Complete!
```

## 🐛 Troubleshooting

### Backend Not Running
```
❌ Backend is not running or not responding!
   Please make sure your backend is running on http://127.0.0.1:3001
```
**Solution:** Start your backend with `npm run start:dev`

### Email Service Not Configured
If emails fail to send, check:
1. `RESEND_API_KEY` environment variable
2. `FROM_EMAIL` environment variable
3. Email service configuration in your backend

### Timeout Errors
The script has a 10-second timeout per email. If you get timeout errors:
1. Check your internet connection
2. Verify email service is responding
3. Check backend logs for errors

## 📝 Test Data

The script uses realistic test data:
- **Customer:** Rahul Karma (karmarahul67@gmail.com)
- **Orders:** TW-2024-001, TW-2024-002, etc.
- **Restaurants:** Spice Garden, Delhi Darbar, Taste of Punjab
- **Amounts:** ₹450, ₹750, ₹299 (realistic pricing)
- **Addresses:** Realistic Indian addresses

## 🎯 Next Steps

After receiving the emails:
1. **Check your inbox** (and spam folder)
2. **Test on different devices** (mobile, desktop, tablet)
3. **Try different email clients** (Gmail, Outlook, Apple Mail)
4. **Review the designs** and provide feedback
5. **Test dark mode** if your email client supports it

## 🏆 Achievement

You now have **18 production-ready, modern email templates** that will impress your users and improve engagement! 🚀

---

**Happy Testing!** 📧✨
