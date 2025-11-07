# Report Module

Comprehensive PDF generation module for TiffinMate platform. Generates professional PDF documents for orders, subscriptions, partner contracts, invoices, and legal documents.

## Features

- ✅ **Order Receipts** - Professional order receipts with items table and payment details
- ✅ **Subscription Reports** - Detailed subscription statements with meal history
- ✅ **Partner Contracts** - Legal MoU/Contract documents with proper formatting
- ✅ **Invoices** - Payment invoices for orders and subscriptions
- ✅ **Legal Documents** - Contracts, agreements, and other legal documents
- ✅ **Dynamic Headers/Footers** - Automatic headers and footers on every page
- ✅ **Brand Styling** - TiffinMate brand styling (extensible for future variants)
- ✅ **Local Storage** - Generated PDFs saved to `formats/pdf/storage/generated/` for easy review
- ✅ **Extensible Architecture** - Ready for Excel/CSV format support in the future

## Architecture

The module is designed with extensibility in mind:

```
report/
├── interfaces/          # Core interfaces for all formats
├── formats/
│   ├── pdf/            # PDF implementation
│   ├── excel/          # Excel (future)
│   └── csv/            # CSV (future)
└── generators/         # Format-agnostic data preparation
```

## API Endpoints

All endpoints require JWT authentication:

- `POST /report/order-receipt` - Generate order receipt PDF
- `POST /report/subscription-report` - Generate subscription report PDF
- `POST /report/partner-contract` - Generate partner contract/MoU PDF
- `POST /report/invoice` - Generate invoice PDF
- `POST /report/legal-document` - Generate legal document PDF

## Usage

### Generate Order Receipt

```typescript
POST /report/order-receipt
{
  "orderId": "order-id-here",
  "includeItems": true,
  "includePayment": true
}
```

### Generate Subscription Report

```typescript
POST /report/subscription-report
{
  "subscriptionId": "subscription-id-here",
  "dateRangeStart": "2024-01-01",
  "dateRangeEnd": "2024-12-31",
  "includeHistory": true
}
```

### Generate Partner Contract

```typescript
POST /report/partner-contract
{
  "partnerId": "partner-id-here",
  "contractType": "agreement",
  "terms": ["Custom term 1", "Custom term 2"]
}
```

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

## Resources

### Fonts

Place custom fonts in `resources/fonts/`:
- `Outfit-Regular.ttf`
- `Outfit-Bold.ttf`
- `Outfit-Light.ttf`
- `CedarvilleCursive-Regular.ttf`

If fonts are not available, the system will fall back to default fonts.

### Images

Place brand logos in `resources/images/`:
- `logo.png` - Main logo
- `logo-long.png` - Long horizontal logo (optional)

## Future Enhancements

- Excel format support
- CSV format support
- Email integration (attach PDFs to emails)
- PDF caching/storage in database
- Batch PDF generation
- PDF templates customization
- Multi-brand variant support

## Implementation Notes

The `ReportService` contains placeholder methods for data preparation:
- `prepareOrderReceiptData()` - Needs implementation based on OrderService
- `prepareSubscriptionReportData()` - Needs implementation based on SubscriptionService
- `preparePartnerContractData()` - Needs implementation based on PartnerService
- `prepareInvoiceData()` - Needs implementation based on invoice type

These methods should fetch actual data from the respective services and transform it into the interface structures defined in `interfaces/report-data.interface.ts`.

