# PDF Generation Service - Complete Architecture Documentation

## Table of Contents
1. [Installation & Dependencies](#installation--dependencies)
2. [Overview](#overview)
3. [Architecture](#architecture)
4. [Core PDF Generation Functions](#core-pdf-generation-functions)
5. [PDF Types and Formats](#pdf-types-and-formats)
6. [Dynamic Header and Footer System](#dynamic-header-and-footer-system)
7. [Font and Typography System](#font-and-typography-system)
8. [Text Alignment and Layout](#text-alignment-and-layout)
9. [Signature Photo Handling](#signature-photo-handling)
10. [Variant-Based Styling System](#variant-based-styling-system)
11. [Data Formats and Schemas](#data-formats-and-schemas)
12. [Implementation Patterns](#implementation-patterns)
13. [Best Practices](#best-practices)

---

## Installation & Dependencies

### Required NPM Packages

Install these packages to use the PDF generation service:

```bash
npm install pdfkit-table pdfkit
# or
pnpm add pdfkit-table pdfkit
# or
yarn add pdfkit-table pdfkit
```

### Package Versions (Tested & Recommended)

```json
{
  "dependencies": {
    "pdfkit-table": "0.1.99",
    "pdfkit": "0.15.0"
  },
  "devDependencies": {
    "@types/pdfkit": "^0.12.8"
  }
}
```

### TypeScript Types

For TypeScript projects, install the type definitions:

```bash
npm install --save-dev @types/pdfkit
# or
pnpm add -D @types/pdfkit
```

### Package Details

| Package | Version | Purpose |
|---------|---------|---------|
| `pdfkit-table` | 0.1.99 | Main PDF generation library with table support |
| `pdfkit` | 0.15.0 | Core PDFKit library (dependency of pdfkit-table) |
| `@types/pdfkit` | ^0.12.8 | TypeScript type definitions |

### Import Statements

```typescript
// Core PDF document type
import PDFDocumentWithTables from 'pdfkit-table';

// If using PDFKit directly (rarely needed)
import PDFDocument from 'pdfkit';
```

---

## Overview

This PDF generation service is a comprehensive, enterprise-grade solution built on **PDFKit with Tables** (`pdfkit-table`). It provides a complete abstraction layer for generating professional, branded PDF documents with dynamic headers, footers, signatures, and multi-variant styling support.

### Key Features
- ✅ **Dynamic Header/Footer System** - Automatically added to every page
- ✅ **Multi-Variant Branding** - Support for 10+ brand variants with custom styling
- ✅ **Professional Typography** - Custom fonts (Regular, Bold, Light, Cursive)
- ✅ **Signature Integration** - Automatic signature photo insertion with sizing
- ✅ **Table Generation** - Advanced table rendering with custom headers
- ✅ **Page Management** - Automatic page breaks and pagination
- ✅ **Email Integration** - Built-in PDF-to-email attachment conversion
- ✅ **Base64 Encoding** - Complete PDF-to-attachment pipeline

---

## Architecture

### Core Components

```
PDF Generation Service
├── Base PDF Library (libraries/packages/base-server/resources/pdf/)
│   ├── Pdf.ts - Core PDF generation functions
│   ├── styles/ - Variant-specific styling
│   │   ├── internal.ts - Internal fonts and resources
│   │   ├── scriptassist.ts - ScriptAssist variant
│   │   ├── cb1.ts - CB1 variant
│   │   └── [8 more variants]
│   ├── fonts/ - Custom font files
│   └── images/ - Brand logos and assets
├── Document API Controllers (packages/domain/document-api/src/api/controllers/)
│   ├── pdf.controller.ts - Main PDF generation endpoints
│   ├── patientLetter.controller.ts - Patient letter PDFs
│   ├── loi.controller.ts - Letter of Intent PDFs
│   └── premisesLetter.controller.ts - Premises letter PDFs
└── Schemas (packages/domain/document-api/src/api/schemas/)
    ├── pdf.schema.ts - PDF request schemas
    ├── doctorPatientPdf.schema.ts - Patient/Doctor PDF schemas
    └── patientLetterPdf.schema.ts - Letter PDF schemas
```

### Technology Stack
- **PDFKit with Tables**: `pdfkit-table@0.1.99` - Core PDF generation library
- **PDFKit**: `pdfkit@0.15.0` - Base PDF generation (dependency)
- **TypeScript**: Full type safety throughout
- **Type Definitions**: `@types/pdfkit@^0.12.8` - TypeScript types
- **Class Validator**: Request validation
- **Express**: HTTP response handling

> **Note**: See [Installation & Dependencies](#installation--dependencies) section for complete package installation instructions.

---

## Core PDF Generation Functions

### 1. Page Creation Functions

#### `coverPage(variant: Variant, landscape?: boolean)`
Creates a cover page with brand logo.

```typescript
const pdfCover = coverPage(variant);
// Creates new PDFDocumentWithTables with:
// - A4 size
// - Portrait/landscape layout
// - Zero margins
// - Brand logo centered
```

**Parameters:**
- `variant`: Variant enum (SCRIPTASSIST, CB1, GHOSH, etc.)
- `landscape`: Optional boolean for landscape orientation

#### `blankPage(landscape?: boolean, margins?: Margins)`
Creates a blank page with customizable margins.

```typescript
const doc = blankPage();
// Default margins: top: 50, bottom: 0, left: 72, right: 72

const docCustom = blankPage(false, { top: 100, left: 50 });
```

**Default Margins:**
- Top: 50pt
- Bottom: 0pt
- Left: 72pt
- Right: 72pt

#### `getHeaderedPdf(doc: PDFDocumentWithTables, variant: Variant, title: string, title2?: string)`
Creates a PDF with automatic header on every page.

```typescript
const pdfCover = coverPage(variant);
const pdf = getHeaderedPdf(pdfCover, variant, 'Patient Profile');
// Automatically adds header and footer to all pages
```

**Features:**
- Adds header on first page
- Automatically adds header on new pages via `pageAdded` event
- Includes footer with generation timestamp
- Supports optional subtitle (`title2`)

#### `getHeaderedPaymentPdf(doc: PDFDocumentWithTables, title: string, variant: Variant, title2?: string)`
Similar to `getHeaderedPdf` but for payment documents (no cover page).

```typescript
const newDoc = blankPage();
const pdf = getHeaderedPaymentPdf(newDoc, 'Prescription Payment - #123', variant);
```

#### `getLetterHeadPdf(variant: Variant)`
Creates a letterhead-style PDF with specific margins.

```typescript
const pdf = getLetterHeadPdf(variant);
// Margins: top: 70, bottom: 70, left: 50, right: 50
// Adds letterhead header on every page
```

#### `loiPages(doc: PDFDocumentWithTables, prescriptionId?: number)`
Creates Letter of Intent (LOI) pages with custom header.

```typescript
const newDoc = blankPage();
const pdf = loiPages(newDoc, prescriptionId);
// Includes SOP header with prescription number and page numbers
```

---

### 2. Text Writing Functions

#### `writeHeading(doc: PDFDocumentWithTables, text: string, yRows: number, meta?: any, y?: number, x?: number)`
Writes bold heading text.

```typescript
writeHeading(pdf, 'Patient Details', 0, { underline: true });
// Uses: Bold font, 16pt, black color
// Position: startingX (30) + x offset, addRowsToY(yRows) from startingY (110)
```

**Parameters:**
- `text`: Heading text
- `yRows`: Row offset from startingY (each row = 30pt)
- `meta`: Optional formatting (underline, align, etc.)
- `y`: Optional absolute Y position
- `x`: Optional absolute X position

#### `writeText(doc: PDFDocumentWithTables, text: string, yRows: number, meta?: any, y?: number, x?: number)`
Writes regular body text.

```typescript
writeText(pdf, `Name: ${patient.firstName} ${patient.lastName}`, 1);
// Uses: Regular font, 12pt, black color
```

#### `writeTextBold(doc: PDFDocumentWithTables, text: string, yRows: number, meta?: any, y?: number, x?: number)`
Writes bold body text.

```typescript
writeTextBold(pdf, `Total: £${total}`, 0);
```

#### `buildHeadingWriter(doc: PDFDocumentWithTables)`
Returns configured heading writer.

```typescript
buildHeadingWriter(doc).text('Section Title', 30, 100, { underline: true });
```

#### `buildTextWriter(doc: PDFDocumentWithTables)`
Returns configured text writer.

```typescript
buildTextWriter(doc).text('Body text', 30, 150);
```

#### `addRowsToY(numRows: number, y?: number)`
Calculates Y position based on row offset.

```typescript
const newY = addRowsToY(2); // startingY (110) + 2 * rowHeight (30) = 170
const customY = addRowsToY(3, 200); // 200 + 3 * 30 = 290
```

**Constants:**
- `startingX`: 30pt
- `startingY`: 110pt
- `rowHeight`: 30pt
- `footerStartingY`: 670pt

---

### 3. Image and Signature Functions

#### `signatureImage(doc: PDFDocumentWithTables, date: Date, imageBuffer: Buffer | undefined)`
Adds signature image with date.

```typescript
const { cms, file } = await getCmsAndFile(transactionId, cmsId);
signatureImage(pdf, cms.updatedAt!, file);
// Image: 60pt width, centered
// Position: doc.y + 10
// Date text: doc.y + 35, aligned left at x=220
```

**Signature Specifications:**
- **Width**: 60pt
- **Position**: Centered horizontally (260pt from left)
- **Y Position**: Current doc.y + 10pt
- **Date Format**: "Signed At: {dateString}"
- **Date Position**: doc.y + 35pt, x=220pt

#### `addImage(doc: PDFDocumentWithTables, imageBuffer: Buffer | undefined)`
Adds image without date.

```typescript
addImage(pdf, imageBuffer);
// Same positioning as signatureImage but without date text
```

**Image Processing:**
- Converts Buffer to Base64
- Creates Data URI: `data:image/png;base64,{base64}`
- Handles undefined gracefully (no-op)

---

### 4. Table Functions

The service uses `pdfkit-table` for advanced table rendering.

#### Basic Table Structure

```typescript
const tableData = {
  headers: [
    { label: 'Column 1', property: 'field1', width: 200 },
    { label: 'Column 2', property: 'field2', width: 100 },
    { label: 'Column 3', property: 'field3', width: 75 }
  ],
  datas: [
    { field1: 'Value 1', field2: 'Value 2', field3: 'Value 3' },
    { field1: 'Value 4', field2: 'Value 5', field3: 'Value 6' }
  ]
};

await pdf.table(tableData, {});
```

#### Table Options

```typescript
await pdf.table(tableData, {
  hideHeader: true,    // Hide header row
  y: 200,              // Absolute Y position
  columnsSize: [100, 200, 150] // Override column widths
});
```

#### Example: Prescription Lines Table

```typescript
const prescriptionLinesTable = {
  headers: [
    { label: 'Product', property: 'productName', width: 200 },
    { label: 'Date Prescribed', property: 'createdAt', width: 100 },
    { label: 'Dose', property: 'dose', width: 100 },
    { label: 'Daily Frequency', property: 'dailyFrequency', width: 75 },
    { label: 'Total # Units', property: 'quantity', width: 75 }
  ],
  datas: prescriptionLines.map((pl) => ({
    productName: pl.batch!.product!.name,
    createdAt: new Date(pl.createdAt!).toDateString(),
    dose: pl.titrationPlan || `${pl.dose!} ${pl.batch!.product!.units}`,
    dailyFrequency: pl.dailyFrequency || 0,
    quantity: pl.quantity!
  }))
};

await pdf.table(prescriptionLinesTable, {});
```

---

### 5. PDF Conversion Functions

#### `pdfToAttachment(doc: PDFDocumentWithTables, filename: string): Promise<AttachmentResponse>`
Converts PDF document to email attachment.

```typescript
const response = await pdfToAttachment(pdf, 'Patient Profile.pdf');
// Returns:
// {
//   attachment: {
//     ContentType: 'application/pdf',
//     Filename: 'Patient Profile.pdf',
//     Base64Content: '...base64...'
//   }
// }
```

**Process:**
1. Collects PDF data buffers
2. Concatenates buffers
3. Converts to Base64
4. Creates Attachment object
5. Ends PDF document

#### `closePdfKitDocAndReturnRes(doc: PDFDocumentWithTables, res: Response, filename: string)`
Converts PDF to HTTP response.

```typescript
await closePdfKitDocAndReturnRes(pdf, res, 'report.pdf');
// Sets headers:
// - Content-type: application/pdf
// - Content-encoding: base64
// - Content-disposition: attachment; filename=report.pdf
```

---

## PDF Types and Formats

### 1. Patient Profile PDF

**Endpoint:** `POST /exec/pdf/patientProfile`

**Schema:**
```typescript
{
  doctorId: number;
  patientId: number;
}
```

**Content:**
- Cover page with brand logo
- Patient details (name, DOB, address, contact)
- Demographics (gender, ethnicity, referral source)
- Prescription history (last 25 prescriptions)
- Booking history (last 25 bookings)
- Consultation history (last 25 consultations)
- Doctor footer with prescriber details

**Filename:** `Patient Profile - {firstName} {lastName}.pdf`

---

### 2. Patient Eligibility PDF

**Endpoint:** `POST /exec/pdf/patientEligibilityPdf`

**Schema:**
```typescript
{
  patientId: number;
}
```

**Content:**
- Cover page
- Patient details
- Eligibility sections:
  - Medical History
  - Psychiatric History
  - Social History
  - Substance Use and Wellbeing History
- Signature image (if available)

**Filename:** `Patient Eligibility - {firstName} {lastName}.pdf`

---

### 3. Prescription Payment PDF

**Endpoint:** `POST /exec/pdf/payment/prescription`

**Schema:**
```typescript
{
  patientId: number;
  prescriptionId: number;
}
```

**Content:**
- Header with title
- Patient details (name, DOB, address)
- Date
- Product table:
  - Product name
  - Sub total
  - Notes/Titration plan
  - Total units
- Dispensary fees
- Total amount
- Email sent to patient and clinic

**Filename:** `Prescription Payment - #{prescriptionId}.pdf`

---

### 4. Booking Payment PDF

**Endpoint:** `POST /exec/pdf/payment/booking`

**Schema:**
```typescript
{
  patientId: number;
  bookingId: number;
}
```

**Content:**
- Header with title
- Patient details
- Booking confirmation details
- Booking table:
  - Name
  - Duration (if not hidden)
  - Format
  - Cost
- Total amount
- Email sent to patient

**Filename:** `Booking Payment - {date}.pdf`

---

### 5. Formulary PDF

**Endpoint:** `POST /exec/pdf/formulary`

**Content:**
- Cover page
- Currently available formulary table:
  - Product name
  - Format
  - Cultivar/Spectrum
  - Source (country)
  - THC concentration
  - CBD concentration
  - Size
  - Price
- Custom table rendering with pagination

**Filename:** `Formulary - {date}.pdf`

---

### 6. Shared Care PDF

**Endpoint:** `POST /exec/pdf/sharedCare`

**Schema:**
```typescript
{
  sharedCareArrangementId: number;
}
```

**Content:**
- Combines Patient Profile PDF
- Combines Patient Eligibility PDF
- Emails both PDFs to recipient doctor

---

### 7. Letter of Intent (LOI) PDF

**Endpoint:** `POST /exec/loi`

**Schema:**
```typescript
{
  doctorId: number;
  productRequests: ProductRequest[];
  indicationId: number;
  prescriptionId: number;
}
```

**Content:**
- Custom LOI header with SOP information
- Supplier and clinic details
- Instructions section
- Product details table (Oils and Dried Cannabis)
- Prescriber details
- Patient population details
- Eligibility for CBPM
- Delivery details
- Prescriber declaration with signature

**Filename:** `CLN - {supplierName} - {date}.pdf`

---

### 8. Patient Letter PDFs

**Endpoints:**
- `POST /exec/patientLetter/gpInformingOfTreatment`
- `POST /exec/patientLetter/newSpecialistOrConsultant`
- `POST /exec/patientLetter/prescriptionForEmployer`
- `POST /exec/patientLetter/medicalNecessityForTravel`
- `POST /exec/patientLetter/prescriptionForInsurance`
- `POST /exec/patientLetter/prescriptionForOrganisation`

**Common Features:**
- Letterhead style PDF
- Today's date
- Greeting
- Paragraphs with proper spacing
- Prescription details table (where applicable)
- Doctor signature block

---

## Dynamic Header and Footer System

### Header Implementation

Headers are automatically added to every page using PDFKit's `pageAdded` event.

```typescript
const addHeader = (doc: PDFDocumentWithTables, variant: Variant, title: string, title2?: string) => {
  const style = styles[variant];
  
  // Rounded rectangle background (10, 10, 575, 80, 15 radius)
  doc.roundedRect(10, 10, 575, 80, 15).fill(style.rect.colour);
  
  // Logo positioning
  doc.image(style.rect.logo.image, style.rect.logo.x, style.rect.logo.y, { 
    scale: style.rect.logo.scale 
  });
  
  // Title (Bold, 20pt, white font)
  doc.font(internalStyle.boldFont)
     .fillColor(style.rect.fontColour)
     .fontSize(20)
     .text(title, 30, 35);
  
  // Optional subtitle (Light, 14pt)
  if (title2) {
    doc.font(internalStyle.lightFont)
       .fillColor(style.rect.fontColour)
       .fontSize(14)
       .text(title2, 30, 55);
  }
};
```

**Header Dimensions:**
- **Position**: (10, 10)
- **Size**: 575pt × 80pt
- **Border Radius**: 15pt
- **Title Position**: (30, 35)
- **Subtitle Position**: (30, 55)

### Footer Implementation

```typescript
const addFooter = (doc: PDFDocumentWithTables) =>
  doc.font(internalStyle.regularFont)
     .fillColor('#727272')
     .fontSize(10)
     .text(`Generated by Script Assist on ${new Date().toLocaleString()}`, 180, 790);
```

**Footer Specifications:**
- **Font**: Regular, 10pt
- **Color**: #727272 (gray)
- **Position**: (180, 790)
- **Content**: "Generated by Script Assist on {timestamp}"

### Automatic Page Addition

```typescript
doc.on('pageAdded', () => addHeader(doc, variant, title, title2));
doc.on('pageAdded', () => addFooter(doc));
```

This ensures headers and footers appear on every page automatically.

---

## Font and Typography System

### Font Files

Located in `libraries/packages/base-server/resources/pdf/fonts/`

**Font Families:**

1. **ScriptAssist Fonts** (`fonts/scriptAssist/`)
   - `Outfit-Regular.ttf` - Regular text
   - `Outfit-Bold.ttf` - Bold text
   - `Outfit-Light.ttf` - Light text

2. **Cursive Font** (`fonts/cursive/`)
   - `CedarvilleCursive-Regular.ttf` - Signatures

3. **Standard Fonts** (`fonts/standard/`)
   - `Tinos-Regular.ttf`
   - `Tinos-Bold.ttf`
   - `Tinos-Italic.ttf`

### Font Usage

```typescript
// Regular text
doc.font(internalStyle.regularFont).fontSize(12).fillColor('black');

// Bold text
doc.font(internalStyle.boldFont).fontSize(16).fillColor('black');

// Light text
doc.font(internalStyle.lightFont).fontSize(14).fillColor('white');

// Cursive (for signatures)
doc.font(internalStyle.cursiveFont).fontSize(12).text('Doctor Name', x, y, { 
  oblique: true 
});
```

### Font Sizes

- **Headings**: 16pt (bold)
- **Body Text**: 12pt (regular)
- **Header Title**: 20pt (bold)
- **Header Subtitle**: 14pt (light)
- **Footer**: 10pt (regular)
- **Table Headers**: 9pt (bold)
- **Table Content**: 8pt (regular)
- **Small Text**: 7-8pt

### Color Usage

- **Black**: `'black'` or `'#000000'` - Primary text
- **White**: `'white'` or `'#ffffff'` - Text on colored backgrounds
- **Gray**: `'#727272'` - Footer text
- **Light Gray**: `'#cccccc'` - Table borders
- **Variant Colors**: Defined in style files (e.g., `#8d90b9` for ScriptAssist)

---

## Text Alignment and Layout

### Alignment Options

```typescript
// Left align (default)
pdf.text('Left aligned', x, y, { align: 'left' });

// Center align
pdf.text('Center aligned', x, y, { align: 'center' });

// Right align
pdf.text('Right aligned', x, y, { align: 'right' });

// Justify
pdf.text('Justified text', x, y, { align: 'justify' });
```

### Positioning System

**Coordinate System:**
- Origin: Top-left corner (0, 0)
- X increases rightward
- Y increases downward
- Units: Points (1pt = 1/72 inch)

**Standard Positions:**
- `startingX`: 30pt (left margin)
- `startingY`: 110pt (below header)
- `footerStartingY`: 670pt (footer area)

### Layout Helpers

```typescript
// Move down by lines
pdf.moveDown(1);  // Move down 1 line (default line height)
pdf.moveDown(2);  // Move down 2 lines

// Calculate row-based Y position
const y = addRowsToY(3);  // startingY + 3 * rowHeight (30) = 200

// Write at specific position
writeText(pdf, 'Text', 0, {}, 150, 50);  // y=150, x=50
```

### Paragraph Spacing

```typescript
function paragraphSeparator(pdf: PDFDocumentWithTables, paragraphs: string[]) {
  paragraphs.forEach((paragraph, index) => {
    pdf.text(paragraph, 60, undefined, { width: 480, align: 'left' });
    if (index < paragraphs.length - 1) {
      pdf.moveDown(1);
    }
  });
}
```

**Paragraph Specifications:**
- **X Position**: 60pt
- **Width**: 480pt
- **Alignment**: Left
- **Spacing**: 1 line between paragraphs

---

## Signature Photo Handling

### Signature Function

```typescript
export const signatureImage = (
  doc: PDFDocumentWithTables, 
  date: Date, 
  imageBuffer: Buffer | undefined
): PDFDocumentWithTables => {
  if (imageBuffer) {
    // Convert to base64
    const imageBase64 = imageBuffer.toString('base64');
    const logoDataURI = `data:image/png;base64,${imageBase64}`;
    
    // Add image (60pt width, centered)
    doc.image(logoDataURI, 260, doc.y + 10, { width: 60, align: 'center' });
    
    // Add date text
    const signedAt = new Date(date).toDateString();
    writeText(doc, `Signed At: ${signedAt}`, 22, undefined, doc.y + 35, 220);
  }
  return doc;
};
```

### Signature Specifications

**Image:**
- **Width**: 60pt (fixed)
- **Position**: X = 260pt (centered on 595pt wide page)
- **Y Position**: `doc.y + 10pt` (10pt below current text)
- **Format**: PNG (converted from Buffer)
- **Encoding**: Base64 Data URI

**Date Text:**
- **Position**: X = 220pt, Y = `doc.y + 35pt`
- **Format**: "Signed At: {dateString}"
- **Font**: Regular, 12pt
- **Color**: Black

### Retrieving Signature from CMS

```typescript
export async function getCmsAndFile(transactionId: string, cmsId: number) {
  const [cms] = await CmsService(transactionId, true).getQuery({
    where: { _id: cmsId }
  });

  const { location, fileName, ownerId, timestamp } = cms;
  let file;
  try {
    file = await new GcsFileAdapter().downloadFile(
      location, 
      `${ownerId}-${timestamp}-${fileName}`
    );
  } catch {
    file = await new GcsFileAdapter().downloadFile(
      location, 
      `${ownerId}-${fileName}`
    );
  }
  return { cms, file };
}

// Usage
const { cms, file } = await getCmsAndFile(transactionId, eligibility.cmsId!);
signatureImage(pdf, cms.updatedAt!, file);
```

---

## Variant-Based Styling System

### Supported Variants

1. **SCRIPTASSIST** - Default brand
2. **CB1** - CB1 Medical
3. **GHOSH** - Dr. Ghosh
4. **MEDICANN** - Medicann
5. **T21** - T21
6. **IPS** - IPS
7. **INTEGRO** - Integro
8. **LUMIR** - Lumir
9. **WELLFORD** - Wellford
10. **NEWGROVE** - Newgrove

### Style Structure

Each variant style file exports a style object:

```typescript
export const scriptAssistStyle = {
  rect: {
    colour: '#8d90b9',           // Header background color
    logo: {
      image: `data:...base64...`, // Logo image (base64)
      scale: 0.01,                // Logo scale factor
      x: 515,                     // Logo X position
      y: 20                       // Logo Y position
    },
    letterHead: {
      image: `data:...base64...`, // Letterhead logo
      scale: 0.006,
      x: 30,
      y: 9
    },
    fontColour: 'white'           // Header text color
  },
  coverPage: {
    logo: {
      image: `data:...base64...`, // Cover page logo
      scale: 0.08,
      x: 75,
      y: 280
    }
  }
};
```

### Example: CB1 Style

```typescript
export const cb1Style = {
  rect: {
    colour: '#ECEAE5',           // Light beige background
    logo: {
      image: `data:logo/png;base64,${fs.readFileSync(`${resourcesPath}/images/cb1/cb1-logo-short.png`).toString('base64')}`,
      scale: 0.24,
      x: 500,
      y: 16
    },
    letterHead: {
      image: `data:logo/png;base64,${fs.readFileSync(`${resourcesPath}/images/cb1/cb1-logo-long.png`).toString('base64')}`,
      scale: 0.18,
      x: 45,
      y: 10
    },
    fontColour: '#4b5e5c'        // Dark green-gray text
  },
  coverPage: {
    logo: {
      image: `data:logo/png;base64,${fs.readFileSync(`${resourcesPath}/images/cb1/cb1-logo-long.png`).toString('base64')}`,
      scale: 0.55,
      x: 40,
      y: 295
    }
  }
};
```

### Using Variants

```typescript
// Get variant from premises
const variant = await getVariant(premisesId, transactionId);

// Create PDF with variant styling
const pdfCover = coverPage(variant);
const pdf = getHeaderedPdf(pdfCover, variant, 'Document Title');
```

### Adding New Variant

1. Create style file: `styles/{variantName}.ts`
2. Add images to `images/{variantName}/`
3. Export style object
4. Add to styles map in `Pdf.ts`:

```typescript
const styles = {
  SCRIPTASSIST: scriptAssistStyle,
  CB1: cb1Style,
  NEWVARIANT: newVariantStyle  // Add here
};
```

---

## Data Formats and Schemas

### Request Schemas

#### Patient Profile Request

```typescript
class DoctorPatientPdf {
  @IsInt()
  doctorId!: number;

  @IsInt()
  patientId!: number;
}
```

#### Prescription Payment Request

```typescript
class prescriptionPaymentPdf {
  @IsInt()
  patientId!: number;

  @IsInt()
  prescriptionId!: number;
}
```

#### Booking Payment Request

```typescript
class bookingPaymentPdf {
  @IsInt()
  patientId!: number;

  @IsInt()
  bookingId!: number;
}
```

#### Patient Letter Request

```typescript
class PatientLetterGpPdf {
  @IsInt()
  doctorId!: number;

  @IsInt()
  @IsOptional()
  patientId?: number;

  @IsString()
  @IsOptional()
  gpOrSpecialistName?: string;
}
```

#### Travel Letter Request

```typescript
class TravelLetterPdf {
  @IsInt()
  doctorId!: number;

  @IsInt()
  patientId!: number;

  @IsDate()
  @Type(() => Date)
  from!: Date;

  @IsDate()
  @Type(() => Date)
  to!: Date;

  @IsString()
  destination!: string;
}
```

### Response Format

#### Attachment Response

```typescript
class Attachment {
  @IsString()
  ContentType!: string;        // 'application/pdf'

  @IsString()
  Filename!: string;            // 'Patient Profile.pdf'

  @IsString()
  Base64Content!: string;       // Base64 encoded PDF
}

class AttachmentResponse {
  @ValidateNested()
  @Type(() => Attachment)
  attachment!: Attachment;
}
```

#### Success Response

```typescript
class SuccessResponse {
  success!: boolean;  // true
}
```

---

## Implementation Patterns

### Pattern 1: Basic PDF Generation

```typescript
async generateBasicPdf(req: any, data: MyData): Promise<SuccessResponse> {
  const transactionId = req.headers[TRANSACTION_ID];
  const premisesId = req.headers[PREMISES_ID];
  const variant = await getVariant(premisesId, transactionId);

  // 1. Create cover page
  const pdfCover = coverPage(variant);
  
  // 2. Create headered PDF
  const pdf = getHeaderedPdf(pdfCover, variant, 'My Document Title');
  
  // 3. Add content
  writeHeading(pdf, 'Section 1', 0, { underline: true });
  writeText(pdf, `Field 1: ${data.field1}`, 1);
  writeText(pdf, `Field 2: ${data.field2}`, 2);
  
  // 4. Convert to attachment
  const filename = `My Document - ${data.name}.pdf`;
  const response = await pdfToAttachment(pdf, filename);
  
  // 5. Send email (optional)
  await sendPdfToEmail(req, 'My Document', 'PDF_TYPE', [response.attachment]);
  
  return { success: true };
}
```

### Pattern 2: PDF with Tables

```typescript
async generatePdfWithTable(req: any, items: Item[]): Promise<SuccessResponse> {
  const transactionId = req.headers[TRANSACTION_ID];
  const premisesId = req.headers[PREMISES_ID];
  const variant = await getVariant(premisesId, transactionId);

  const pdfCover = coverPage(variant);
  const pdf = getHeaderedPdf(pdfCover, variant, 'Report with Table');
  
  writeHeading(pdf, 'Data Table', 0, { underline: true });
  pdf.moveDown(1);

  // Prepare table data
  const tableData = {
    headers: [
      { label: 'Column 1', property: 'col1', width: 200 },
      { label: 'Column 2', property: 'col2', width: 100 },
      { label: 'Column 3', property: 'col3', width: 75 }
    ],
    datas: items.map(item => ({
      col1: item.field1,
      col2: item.field2,
      col3: item.field3
    }))
  };

  await pdf.table(tableData, {});
  
  const filename = `Report - ${dayjs().format('YYYY-MM-DD')}.pdf`;
  const response = await pdfToAttachment(pdf, filename);
  await sendPdfToEmail(req, 'Report', 'REPORT', [response.attachment]);
  
  return { success: true };
}
```

### Pattern 3: PDF with Signature

```typescript
async generatePdfWithSignature(req: any, data: MyData): Promise<SuccessResponse> {
  const transactionId = req.headers[TRANSACTION_ID];
  const premisesId = req.headers[PREMISES_ID];
  const variant = await getVariant(premisesId, transactionId);

  const pdfCover = coverPage(variant);
  const pdf = getHeaderedPdf(pdfCover, variant, 'Signed Document');
  
  // Add content
  writeHeading(pdf, 'Document Content', 0, { underline: true });
  writeText(pdf, data.content, 1);
  
  // Add signature if available
  if (data.signatureCmsId) {
    await RunWithElevatedPermissions(async () => {
      const { cms, file } = await getCmsAndFile(transactionId, data.signatureCmsId!);
      signatureImage(pdf, cms.updatedAt!, file);
    }, transactionId);
  }
  
  const filename = `Signed Document - ${data.name}.pdf`;
  const response = await pdfToAttachment(pdf, filename);
  await sendPdfToEmail(req, 'Signed Document', 'SIGNED_DOC', [response.attachment]);
  
  return { success: true };
}
```

### Pattern 4: Multi-Page PDF

```typescript
async generateMultiPagePdf(req: any, data: MyData): Promise<SuccessResponse> {
  const transactionId = req.headers[TRANSACTION_ID];
  const premisesId = req.headers[PREMISES_ID];
  const variant = await getVariant(premisesId, transactionId);

  const pdfCover = coverPage(variant);
  const pdf = getHeaderedPdf(pdfCover, variant, 'Multi-Page Document');
  
  // Page 1
  writeHeading(pdf, 'Page 1 Content', 0, { underline: true });
  writeText(pdf, data.page1Content, 1);
  
  // Page 2
  pdf.addPage();
  writeHeading(pdf, 'Page 2 Content', 0, { underline: true });
  writeText(pdf, data.page2Content, 1);
  
  // Page 3
  pdf.addPage();
  writeHeading(pdf, 'Page 3 Content', 0, { underline: true });
  writeText(pdf, data.page3Content, 1);
  
  const filename = `Multi-Page Document.pdf`;
  const response = await pdfToAttachment(pdf, filename);
  await sendPdfToEmail(req, 'Multi-Page Document', 'MULTI_PAGE', [response.attachment]);
  
  return { success: true };
}
```

### Pattern 5: Letter-Style PDF

```typescript
async generateLetterPdf(req: any, data: LetterData): Promise<SuccessResponse> {
  const transactionId = req.headers[TRANSACTION_ID];
  const premisesId = req.headers[PREMISES_ID];
  const variant = await getVariant(premisesId, transactionId);

  // Use letterhead style
  const pdf = getLetterHeadPdf(variant);
  
  // Add date
  todaysDate(pdf);
  
  // Add greeting
  pdf.fillColor('black').fontSize(11).text(`Dear ${data.recipientName}`, 60, undefined);
  pdf.moveDown(1);
  
  // Add paragraphs
  const paragraphs = [
    data.paragraph1,
    data.paragraph2,
    data.paragraph3
  ];
  paragraphSeparator(pdf, paragraphs);
  
  // Add signature block
  await yoursFaithfully(pdf, transactionId, doctor);
  
  const filename = `Letter - ${data.recipientName}.pdf`;
  const response = await pdfToAttachment(pdf, filename);
  await sendPdfToEmail(req, 'Letter', 'LETTER', [response.attachment]);
  
  return { success: true };
}
```

---

## Best Practices

### 1. Always Use Variant-Aware Functions

✅ **Good:**
```typescript
const variant = await getVariant(premisesId, transactionId);
const pdf = getHeaderedPdf(coverPage(variant), variant, 'Title');
```

❌ **Bad:**
```typescript
const pdf = new PDFDocumentWithTables(); // No variant support
```

### 2. Use Helper Functions for Text

✅ **Good:**
```typescript
writeHeading(pdf, 'Section Title', 0, { underline: true });
writeText(pdf, 'Body text', 1);
```

❌ **Bad:**
```typescript
pdf.font('Helvetica').fontSize(16).text('Section Title', 30, 110);
```

### 3. Handle Undefined Values

✅ **Good:**
```typescript
if (imageBuffer) {
  signatureImage(pdf, date, imageBuffer);
}
```

❌ **Bad:**
```typescript
signatureImage(pdf, date, imageBuffer); // May throw if undefined
```

### 4. Use Proper Filenames

✅ **Good:**
```typescript
const filename = `Patient Profile - ${patient.firstName} ${patient.lastName}.pdf`;
```

❌ **Bad:**
```typescript
const filename = `pdf.pdf`;
```

### 5. Always End PDF Documents

✅ **Good:**
```typescript
const response = await pdfToAttachment(pdf, filename);
// pdf.end() is called automatically in pdfToAttachment
```

❌ **Bad:**
```typescript
// Missing pdf.end() will cause incomplete PDFs
```

### 6. Use Row-Based Positioning

✅ **Good:**
```typescript
writeText(pdf, 'Line 1', 0);
writeText(pdf, 'Line 2', 1);
writeText(pdf, 'Line 3', 2);
```

❌ **Bad:**
```typescript
pdf.text('Line 1', 30, 110);
pdf.text('Line 2', 30, 140);
pdf.text('Line 3', 30, 170);
```

### 7. Validate Data Before PDF Generation

✅ **Good:**
```typescript
if (!patient) {
  throw new NotFoundError('Patient not found');
}
const pdf = generatePdf(patient);
```

❌ **Bad:**
```typescript
const pdf = generatePdf(patient); // May fail if patient is null
```

### 8. Use Transactions for Data Access

✅ **Good:**
```typescript
const patient = await PatientService(transactionId, true).getById(patientId);
```

❌ **Bad:**
```typescript
const patient = await PatientService().getById(patientId); // Missing transaction
```

### 9. Handle Page Breaks in Tables

✅ **Good:**
```typescript
// Tables automatically handle page breaks
await pdf.table(tableData, {});
```

### 10. Use Consistent Font Sizes

✅ **Good:**
- Headings: 16pt
- Body: 12pt
- Footer: 10pt

❌ **Bad:**
- Random font sizes without consistency

---

## Complete Example: Patient Profile PDF

```typescript
async getPatientProfile(req: any, patientId: number, doctorId: number) {
  const transactionId = req.headers[TRANSACTION_ID];
  const premisesId = req.headers[PREMISES_ID];
  const variant = await getVariant(premisesId, transactionId);
  
  // Fetch data
  const [patient] = await PatientService(transactionId, true).getQuery({
    where: { _id: patientId },
    relations: { areaOfTreatment: true }
  });
  
  if (!patient) {
    throw new NotFoundError('Patient not found');
  }
  
  const doctor = await DoctorService(transactionId, true).getById(doctorId);
  const [compliance] = await DoctorComplianceService(transactionId, true).getAll();
  
  // Create PDF
  const pdfCover = coverPage(variant);
  const pdf = getHeaderedPdf(pdfCover, variant, 'Patient Profile');
  
  // Add doctor footer
  await this.addDoctorFooter(pdf, doctor, transactionId, compliance, premisesId);
  
  // Patient details section
  writeHeading(pdf, 'Patient Details', 0, { underline: true });
  writeText(pdf, `Name: ${patient.firstName} ${patient.lastName}`, 1);
  writeText(pdf, `Date of Birth: ${new Date(patient.dateOfBirth!).toDateString()}`, 2);
  writeText(pdf, `Address: ${await returnAddressString(patient?.areaOfTreatment?.defaultAddressId!, transactionId)}`, 3);
  writeText(pdf, `Phone: ${patient.phoneNumber}`, 4);
  writeText(pdf, `Email: ${patient.email}`, 5);
  
  // Prescription history table
  const prescriptionLines = await PrescriptionLineService(transactionId, true).getQuery({
    relations: { batch: { product: true } },
    where: { prescription: { patientId, doctorId } },
    order: { createdAt: 'DESC' },
    take: 25
  });
  
  if (prescriptionLines?.length > 0) {
    pdf.addPage();
    writeHeading(pdf, 'Prescription Details (Last 25)', 0, { underline: true });
    pdf.moveDown(1);
    
    const prescriptionLinesTable = {
      headers: [
        { label: 'Product', property: 'productName', width: 200 },
        { label: 'Date Prescribed', property: 'createdAt', width: 100 },
        { label: 'Dose', property: 'dose', width: 100 },
        { label: 'Daily Frequency', property: 'dailyFrequency', width: 75 },
        { label: 'Total # Units', property: 'quantity', width: 75 }
      ],
      datas: prescriptionLines.map((pl) => ({
        productName: pl.batch!.product!.name,
        createdAt: new Date(pl.createdAt!).toDateString(),
        dose: pl.titrationPlan ? pl.titrationPlan : `${pl.dose!} ${pl.batch!.product!.units}`,
        dailyFrequency: pl.dailyFrequency || 0,
        quantity: pl.quantity!
      }))
    };
    
    await pdf.table(prescriptionLinesTable, {});
  }
  
  const filename = `Patient Profile - ${patient.firstName} ${patient.lastName}.pdf`;
  return { patient, doctor, pdf, filename };
}
```

---

## Summary

This PDF generation service provides:

1. **Complete Architecture** - Modular, extensible design
2. **Variant Support** - 10+ brand variants with custom styling
3. **Dynamic Headers/Footers** - Automatic on every page
4. **Professional Typography** - Custom fonts and consistent sizing
5. **Signature Integration** - Automatic signature photo handling
6. **Table Support** - Advanced table rendering with pagination
7. **Email Integration** - Built-in PDF-to-email conversion
8. **Type Safety** - Full TypeScript support
9. **Best Practices** - Consistent patterns throughout

**Key Constants:**
- `startingX`: 30pt
- `startingY`: 110pt
- `rowHeight`: 30pt
- `footerStartingY`: 670pt

**Key Functions:**
- `coverPage()` - Create cover page
- `getHeaderedPdf()` - Create PDF with headers
- `writeHeading()` - Write headings
- `writeText()` - Write body text
- `signatureImage()` - Add signature
- `pdfToAttachment()` - Convert to email attachment

**Main PDF Types:**
1. Patient Profile
2. Patient Eligibility
3. Prescription Payment
4. Booking Payment
5. Formulary
6. Shared Care
7. Letter of Intent (LOI)
8. Patient Letters (various types)

This documentation provides everything needed to implement a perfect PDF generation service in any project!

