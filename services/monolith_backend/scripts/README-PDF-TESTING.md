# PDF Generation Testing Script

This script tests all PDF generation endpoints and saves the generated PDFs to the storage folder for easy review.

## Prerequisites

1. **Server must be running**
   ```bash
   npm run start:dev
   # or
   bun run start:dev
   ```

2. **MongoDB must have test data**
   - At least one order
   - At least one subscription
   - At least one partner

## Usage

### Basic Usage (with default test IDs)
```bash
npm run test:pdf
# or
bun run test:pdf
# or
node scripts/test-pdf-generation.js
```

### With Custom IDs
```bash
node scripts/test-pdf-generation.js <orderId> <subscriptionId> <partnerId>
```

Example:
```bash
node scripts/test-pdf-generation.js 507f1f77bcf86cd799439011 507f1f77bcf86cd799439012 507f1f77bcf86cd799439013
```

## What It Tests

The script tests all 5 PDF generation endpoints:

1. **Order Receipt PDF** (`POST /report/order-receipt`)
   - Generates order receipt with items and payment details
   - Saved to: `src/modules/report/formats/pdf/storage/generated/order-receipts/`

2. **Subscription Report PDF** (`POST /report/subscription-report`)
   - Generates subscription statement with meal history
   - Saved to: `src/modules/report/formats/pdf/storage/generated/subscriptions/`

3. **Partner Contract PDF** (`POST /report/partner-contract`)
   - Generates MoU/Contract document
   - Saved to: `src/modules/report/formats/pdf/storage/generated/contracts/`

4. **Invoice PDF** (`POST /report/invoice`)
   - Generates invoice for orders/subscriptions
   - Saved to: `src/modules/report/formats/pdf/storage/generated/invoices/`

5. **Legal Document PDF** (`POST /report/legal-document`)
   - Generates legal contracts/agreements
   - Saved to: `src/modules/report/formats/pdf/storage/generated/legal-documents/`

## Output

The script will:
- ✅ Test each endpoint
- ✅ Save PDFs to their respective folders
- ✅ Display file sizes
- ✅ Show success/failure status
- ✅ Provide a summary at the end

## Generated PDFs Location

All generated PDFs are saved to:
```
src/modules/report/formats/pdf/storage/generated/
├── order-receipts/
├── subscriptions/
├── contracts/
├── invoices/
└── legal-documents/
```

You can immediately open and review the PDFs from these folders!

## Configuration

You can change the API base URL by setting environment variable:
```bash
API_URL=http://localhost:3000 node scripts/test-pdf-generation.js
```

Default: `http://localhost:3000`

## Troubleshooting

### Server Not Running
```
❌ Cannot connect to server at http://localhost:3000
⚠️  Please make sure the server is running: npm run start:dev
```

**Solution**: Start the server first

### Invalid IDs
```
❌ Failed to generate Order Receipt: Order with ID xxx not found
```

**Solution**: Use valid IDs from your database, or create test data first

### PDF Generation Errors
Check the error message for specific issues. Common problems:
- Missing data in database
- Invalid request format
- Server errors

## Example Output

```
🧪 PDF Generation Test Script
============================================================

✅ Server is running at http://localhost:3000

📄 Testing PDF Generation Endpoints

1️⃣  Order Receipt PDF
----------------------------------------
ℹ️  Testing Order Receipt PDF generation for order: 507f...
✅ Order Receipt PDF saved to: .../order-receipts/order-receipt-507f...pdf
ℹ️  File size: 45.23 KB

2️⃣  Subscription Report PDF
----------------------------------------
...

📊 Test Summary
============================================================
Total Tests: 5
✅ Successful: 5

📁 Generated PDFs Location:
   .../storage/generated/

✅ All PDF generation tests completed successfully! 🎉
```

