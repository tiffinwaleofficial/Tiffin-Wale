import { Injectable, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { companyInfo } from 'src/config/company-info.config';
import { IFormatService } from "../../interfaces/report-generator.interface";
import {
  OrderReceiptData,
  SubscriptionReportData,
  PartnerContractData,
  InvoiceData,
  LegalDocumentData,
  PartnerMouData,
  ServiceAgreementData,
  PartnerNdaData,
} from "../../interfaces/report-data.interface";

/**
 * PDF Service
 * Unified PDF generation service using Puppeteer and Handlebars templates
 */
interface PdfConfig {
  fonts: {
    primary: string;
    fallback: string[];
    sizes: {
      body: number;
      heading: number;
      subheading: number;
      small: number;
      tiny: number;
    };
    weights: {
      regular: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  logo?: {
    path: string;
    note?: string;
  };
  icon?: {
    path: string;
    note?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    textLight: string;
    textMuted: string;
    border: string;
    background: string;
    backgroundLight: string;
    headerBackground: string;
    headerText: string;
    footerText: string;
    footerTextMuted: string;
  };
  header: {
    enabled: boolean;
    height: number;
    backgroundColor: string;
    textColor: string;
    logoHeight: number;
    logoClickable?: boolean;
    logoUrl?: string;
    showLogo: boolean;
    showCompanyName: boolean;
    showContactInfo: boolean;
    companyName?: string;
    companyNameFontSize?: number;
    contactInfoFontSize?: number;
    title?: string;
    titleFontSize?: number;
    tagline?: string;
    taglineFontSize?: number;
    iconHeight?: number;
    borderRadius?: number;
    padding: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  footer: {
    enabled: boolean;
    height: number;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    textColor: string;
    textColorMuted: string;
    addressFontSize?: number;
    contactFontSize?: number;
    watermarkFontSize?: number;
    showAddress: boolean;
    showContactInfo: boolean;
    showWatermark: boolean;
    watermark: {
      enabled: boolean;
      text: string;
      fontSize: number;
      color: string;
      style: string;
    };
    padding: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  watermark: {
    enabled: boolean;
    type?: 'image' | 'text';
    imagePath?: string;
    text: string;
    opacity: number;
    fontSize: number;
    color: string;
    rotation: number;
    size?: number;
    position: {
      x: string;
      y: string;
    };
    note?: string;
  };
  pageMargins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    unit: string;
  };
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    unit: string;
  };
  page: {
    format: string;
    orientation: string;
    printBackground: boolean;
  };
  storage: {
    autoSave: boolean;
    saveOnGeneration: boolean;
  };
}

@Injectable()
export class PdfService implements IFormatService, OnModuleInit {
  private logoImageBase64: string;
  private logoMimeType: string;
  private iconImageBase64: string;
  private iconMimeType: string;
  private watermarkImageBase64: string | null;
  private watermarkMimeType: string | null;
  private poppinsFontsBase64: {
    regular: string;
    bold: string;
    semibold: string;
  };
  private config: PdfConfig;

  async onModuleInit() {
    // Load PDF configuration
    const configPath = path.join(process.cwd(), 'src/modules/report/formats/pdf/pdf.config.json');
    const configContent = await fs.readFile(configPath, 'utf-8');
    this.config = JSON.parse(configContent) as PdfConfig;

    // Load the logo and convert it to base64 once, during initialization
    // Logo path is now configurable from pdf.config.json
    const logoPathFromConfig = this.config.logo?.path || 'src/modules/report/resources/images/logo.jpg';
    const logoPath = path.join(process.cwd(), logoPathFromConfig);
    const logoBuffer = await fs.readFile(logoPath);
    
    // Determine MIME type based on file extension
    const logoExtension = logoPathFromConfig.toLowerCase().split('.').pop();
    const logoMimeType = logoExtension === 'png' ? 'image/png' : 
                        (logoExtension === 'jpg' || logoExtension === 'jpeg') ? 'image/jpeg' : 
                        'image/png'; // default fallback
    this.logoImageBase64 = logoBuffer.toString('base64');
    this.logoMimeType = logoMimeType;

    // Load the icon and convert it to base64 once, during initialization
    // Icon path is now configurable from pdf.config.json
    const iconPathFromConfig = this.config.icon?.path || 'src/modules/report/resources/images/icon.png';
    const iconPath = path.join(process.cwd(), iconPathFromConfig);
    const iconBuffer = await fs.readFile(iconPath);
    
    // Determine MIME type based on file extension
    const iconExtension = iconPathFromConfig.toLowerCase().split('.').pop();
    const iconMimeType = iconExtension === 'png' ? 'image/png' : 
                        (iconExtension === 'jpg' || iconExtension === 'jpeg') ? 'image/jpeg' : 
                        'image/png'; // default fallback
    this.iconImageBase64 = iconBuffer.toString('base64');
    this.iconMimeType = iconMimeType;

    // Load watermark image (logo_black.png) and convert to base64
    if (this.config.watermark?.enabled && this.config.watermark?.type === 'image') {
      const watermarkPathFromConfig = this.config.watermark.imagePath || 'src/modules/report/resources/images/logo_black.png';
      const watermarkPath = path.join(process.cwd(), watermarkPathFromConfig);
      try {
        const watermarkBuffer = await fs.readFile(watermarkPath);
        
        // Determine MIME type based on file extension
        const watermarkExtension = watermarkPathFromConfig.toLowerCase().split('.').pop();
        const watermarkMimeType = watermarkExtension === 'png' ? 'image/png' : 
                                  (watermarkExtension === 'jpg' || watermarkExtension === 'jpeg') ? 'image/jpeg' : 
                                  'image/png'; // default fallback
        this.watermarkImageBase64 = watermarkBuffer.toString('base64');
        this.watermarkMimeType = watermarkMimeType;
        console.log(`✅ Watermark image loaded successfully: ${watermarkPathFromConfig} (${watermarkBuffer.length} bytes)`);
      } catch (error) {
        console.warn(`⚠️  Warning: Could not load watermark image from ${watermarkPathFromConfig}. Falling back to text watermark. Error: ${error.message}`);
        this.watermarkImageBase64 = null;
        this.watermarkMimeType = null;
      }
    } else {
      // Initialize as null if watermark is disabled or not image type
      this.watermarkImageBase64 = null;
      this.watermarkMimeType = null;
    }

    // Load Poppins fonts and convert to base64 (like Platform UK does)
    const fontsDir = path.join(process.cwd(), 'src/modules/report/resources/fonts');
    const regularFontBuffer = await fs.readFile(path.join(fontsDir, 'Poppins-Regular.ttf'));
    const boldFontBuffer = await fs.readFile(path.join(fontsDir, 'Poppins-Bold.ttf'));
    const semiboldFontBuffer = await fs.readFile(path.join(fontsDir, 'Poppins-SemiBold.ttf'));

    this.poppinsFontsBase64 = {
      regular: regularFontBuffer.toString('base64'),
      bold: boldFontBuffer.toString('base64'),
      semibold: semiboldFontBuffer.toString('base64'),
    };

    // Register Handlebars helpers
    handlebars.registerHelper('add', function (a, b) {
      return a + b;
    });
  }

  /**
   * Get PDF configuration
   */
  getConfig(): PdfConfig {
    return this.config;
  }

  /**
   * Generate a report in PDF format using Handlebars templates
   * @param type Report type (order-receipt, subscription-report, partner-contract, invoice, legal-document)
   * @param data Report data
   * @param options Optional configuration
   * @returns PDF buffer
   */
  async generate(type: string, data: any, options?: any): Promise<Buffer> {
    // Map report types to template names
    const templateMap: Record<string, string> = {
      'order-receipt': 'order-receipt',
      'subscription-report': 'subscription-report', 
      'partner-contract': 'partner-contract',
      'invoice': 'invoice',
      'legal-document': 'legal-document',
      'partner-mou': 'partner-mou',
      'service-agreement': 'service-agreement',
      'partner-nda': 'partner-nda'
    };

    const templateName = templateMap[type];
    if (!templateName) {
      throw new Error(`Unknown report type: ${type}`);
    }

    return this.generatePdfFromTemplate(templateName, data);
  }

  /**
   * Get filename for a report type
   */
  getFilename(type: string, data: any): string {
    switch (type) {
      case "order-receipt":
        const orderData = data as OrderReceiptData;
        return `Order Receipt - #${orderData.orderNumber}.pdf`;

      case "subscription-report":
        const subData = data as SubscriptionReportData;
        return `Subscription Report - ${subData.customer.name}.pdf`;

      case "partner-contract":
        const contractData = data as PartnerContractData;
        return `Partner Agreement - ${contractData.partner.businessName}.pdf`;

      case "invoice":
        const invoiceData = data as InvoiceData;
        return `Invoice - #${invoiceData.invoiceNumber}.pdf`;

      case "legal-document":
        const legalData = data as LegalDocumentData;
        return `${legalData.title} - ${legalData.effectiveDate.toISOString().split('T')[0]}.pdf`;

      case "partner-mou":
        const mouData = data as PartnerMouData;
        return `Partner MoU - ${mouData.partner.businessName} - ${mouData.mouId}.pdf`;

      case "service-agreement":
        const agreementData = data as ServiceAgreementData;
        return `Service Agreement - ${agreementData.partner.businessName} - ${agreementData.agreementId}.pdf`;

      case "partner-nda":
        const ndaData = data as PartnerNdaData;
        return `Partner NDA - ${ndaData.partner.businessName} - ${ndaData.ndaId}.pdf`;

      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }

  /**
   * Get MIME type (always application/pdf for PDF service)
   */
  getMimeType(): string {
    return "application/pdf";
  }

  /**
   * Generate PDF from Handlebars template using Puppeteer
   */
  private async generatePdfFromTemplate(templateName: string, data: any): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true, // Use headless mode
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-default-apps',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-sync',
        '--disable-translate',
        '--disable-ipc-flooding-protection',
        '--memory-pressure-off',
        '--max_old_space_size=4096'
      ],
      timeout: 0, // No timeout
      protocolTimeout: 0, // No protocol timeout
    });
    
    let page;
    try {
      page = await browser.newPage();
      
      // Set a reasonable timeout for page operations
      await page.setDefaultTimeout(30000);
      await page.setDefaultNavigationTimeout(30000);
      // 1. Load and compile the main content template
      const templatePath = path.join(process.cwd(), `src/modules/report/templates/${templateName}.hbs`);
      const templateHtml = await fs.readFile(templatePath, 'utf-8');
      const template = handlebars.compile(templateHtml);
      const contentHtml = template(data);

      // 2. Load global CSS
      const cssPath = path.join(process.cwd(), 'src/modules/report/assets/style.css');
      const css = await fs.readFile(cssPath, 'utf-8');

      // 3. Embed Poppins fonts as base64 (like Platform UK does)
      const poppinsFontFace = `
        @font-face {
          font-family: 'Poppins';
          font-style: normal;
          font-weight: 400;
          src: url('data:application/font-ttf;charset=utf-8;base64,${this.poppinsFontsBase64.regular}') format('truetype');
          font-display: swap;
        }
        @font-face {
          font-family: 'Poppins';
          font-style: normal;
          font-weight: 600;
          src: url('data:application/font-ttf;charset=utf-8;base64,${this.poppinsFontsBase64.semibold}') format('truetype');
          font-display: swap;
        }
        @font-face {
          font-family: 'Poppins';
          font-style: normal;
          font-weight: 700;
          src: url('data:application/font-ttf;charset=utf-8;base64,${this.poppinsFontsBase64.bold}') format('truetype');
          font-display: swap;
        }
      `;

      // 4. Generate watermark HTML and CSS if enabled
      let watermarkHtml = '';
      let watermarkCss = '';
      if (this.config.watermark.enabled) {
        const isCenterX = this.config.watermark.position.x === 'center';
        const isCenterY = this.config.watermark.position.y === 'center';
        let transform = '';
        
        if (isCenterX && isCenterY) {
          transform = `translateX(-50%) translateY(-50%) rotate(${this.config.watermark.rotation}deg)`;
        } else if (isCenterX) {
          transform = `translateX(-50%) rotate(${this.config.watermark.rotation}deg)`;
        } else if (isCenterY) {
          transform = `translateY(-50%) rotate(${this.config.watermark.rotation}deg)`;
        } else {
          transform = `rotate(${this.config.watermark.rotation}deg)`;
        }
        
        const leftPos = isCenterX ? '50%' : this.config.watermark.position.x;
        const topPos = isCenterY ? '50%' : this.config.watermark.position.y;
        
        // Check if watermark should be image or text
        const useImage = this.config.watermark.type === 'image' && this.watermarkImageBase64 && this.watermarkMimeType;
        const watermarkSize = this.config.watermark.size || 300;
        
        if (useImage) {
          // Image watermark - using body background image for multi-page support
          // This ensures the watermark appears centered on every page
          watermarkCss = `
          body {
            position: relative;
            min-height: 100vh;
            background-image: url('data:${this.watermarkMimeType};base64,${this.watermarkImageBase64}');
            background-repeat: no-repeat;
            background-position: center center;
            background-size: ${watermarkSize}px auto;
            background-attachment: local;
          }
          body::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: ${transform};
            width: ${watermarkSize}px;
            height: ${watermarkSize}px;
            background-image: url('data:${this.watermarkMimeType};base64,${this.watermarkImageBase64}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: ${this.config.watermark.opacity};
            z-index: 0;
            pointer-events: none;
            margin-left: -${watermarkSize / 2}px;
            margin-top: -${watermarkSize / 2}px;
          }
          .container {
            position: relative;
            z-index: 1;
            background: white;
          }
          /* Ensure watermark on each printed page */
          @page {
            size: A4;
            @top-center {
              content: "";
            }
          }
        `;
          
          watermarkHtml = ''; // Using CSS background instead of HTML element
        } else {
          // Text watermark (fallback) - using absolute positioning with page-relative calculations
          const pageWidthPx = 794; // A4 width in pixels
          const pageHeightPx = 1123; // A4 height in pixels
          const centerX = pageWidthPx / 2;
          const centerY = pageHeightPx / 2;
          
          watermarkCss = `
          .pdf-watermark {
            position: absolute;
            left: ${centerX}px;
            top: ${centerY}px;
            transform: ${transform};
            font-size: ${this.config.watermark.fontSize}px;
            color: ${this.config.watermark.color};
            opacity: ${this.config.watermark.opacity};
            z-index: 0;
            pointer-events: none;
            font-weight: bold;
            white-space: nowrap;
            font-family: '${this.config.fonts.primary}', ${this.config.fonts.fallback.map(f => `'${f}'`).join(', ')}, sans-serif;
            display: block;
            margin-left: -${this.config.watermark.fontSize * 2}px;
            margin-top: -${this.config.watermark.fontSize / 2}px;
          }
          body {
            position: relative;
            min-height: 100vh;
          }
          .container {
            position: relative;
            z-index: 1;
            background: transparent;
          }
          /* Repeat watermark on each page */
          @page {
            size: A4;
          }
          @media print {
            .pdf-watermark {
              position: absolute;
              left: ${centerX}px;
              top: ${centerY}px;
              transform: ${transform};
            }
          }
        `;
          
          watermarkHtml = `<div class="pdf-watermark">${this.config.watermark.text}</div>`;
        }
      }

      // 5. Set the content of the page with embedded Poppins font and watermark
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              ${poppinsFontFace}
              
              ${css}
              
              /* Override body font to ensure Poppins is used */
              body, * {
                font-family: '${this.config.fonts.primary}', ${this.config.fonts.fallback.map(f => `'${f}'`).join(', ')}, sans-serif !important;
                color: ${this.config.colors.text};
              }
              
              h1, h2, h3 {
                color: ${this.config.colors.primary};
                font-weight: ${this.config.fonts.weights.bold};
              }
              
              h1 { font-size: ${this.config.fonts.sizes.heading}px; }
              h2 { font-size: ${this.config.fonts.sizes.subheading}px; }
              body { font-size: ${this.config.fonts.sizes.body}px; }
              
              /* Ensure no self-closing divs and proper indentation */
              * { box-sizing: border-box; }
              body { 
                margin: 0; 
                padding: 0; 
                position: relative; 
                width: 100%;
                max-width: 100%;
              }
              
              /* Ensure container uses full width */
              .container {
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
              }
              
              /* Watermark styling */
              ${watermarkCss}
            </style>
          </head>
          <body style="position: relative; min-height: 100vh; margin: 0; padding: 0;">
            ${watermarkHtml}
            <div class="container" style="position: relative; z-index: 1;">${contentHtml}</div>
          </body>
        </html>
      `;
      
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0', // Wait for fonts to load
        timeout: 30000 // 30 second timeout for content loading
      });

      // Wait a bit more for fonts to fully load using setTimeout
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 6. Generate header and footer templates using config
      const borderRadius = this.config.header.borderRadius || 12;
      const companyName = this.config.header.companyName || 'Rira Industries';
      const companyNameFontSize = this.config.header.companyNameFontSize || 16;
      const contactInfoFontSize = this.config.header.contactInfoFontSize || 11;
      const logoUrl = this.config.header.logoUrl || 'https://www.tiffin-wale.com/';
      
      // Get page margins for header/footer padding
      const pageMargins = this.config.pageMargins || { top: 0, bottom: 0, left: 0, right: 0, unit: 'in' };
      const pageMarginLeftPx = pageMargins.unit === 'in' ? pageMargins.left * 96 : pageMargins.left;
      const pageMarginRightPx = pageMargins.unit === 'in' ? pageMargins.right * 96 : pageMargins.right;
      
      // Icon with circular border-radius and text next to it (Title + tagline from config)
      const iconSize = this.config.header.iconHeight || 70; // Slightly reduced from logoHeight
      const title = this.config.header.title || 'Tiffin Wale';
      const titleFontSize = this.config.header.titleFontSize || 24;
      const tagline = this.config.header.tagline || 'Ghar Jaisa Khana Har Jagah';
      const taglineFontSize = this.config.header.taglineFontSize || 14;
      const fontFamily = `'${this.config.fonts.primary}', ${this.config.fonts.fallback.map(f => `'${f}'`).join(', ')}, sans-serif`;
      
      const iconHtml = `
        <div style="display: flex; align-items: center; gap: 15px;">
          <img src="data:${this.iconMimeType};base64,${this.iconImageBase64}" style="height: ${iconSize}px; width: ${iconSize}px; border-radius: 50%; object-fit: cover;" alt="Icon">
          <div style="display: flex; flex-direction: column;">
            <div style="font-family: ${fontFamily}; font-size: ${titleFontSize}px; font-weight: ${this.config.fonts.weights.bold}; color: ${this.config.header.textColor}; margin: 0; line-height: 1.2;">${title}</div>
            <div style="font-family: ${fontFamily}; font-size: ${taglineFontSize}px; font-weight: ${this.config.fonts.weights.regular}; color: ${this.config.header.textColor}; margin: 2px 0 0 0; line-height: 1.2; opacity: 0.95;">${tagline}</div>
          </div>
        </div>
      `;
      
      // Keep logo for backward compatibility (can be used elsewhere)
      const logoHtml = this.config.header.showLogo 
        ? (this.config.header.logoClickable 
          ? `<a href="${logoUrl}" style="display: inline-block; text-decoration: none;"><img src="data:${this.logoMimeType};base64,${this.logoImageBase64}" style="height: ${this.config.header.logoHeight}px; width: auto; margin-right: 20px;" alt="Logo"></a>`
          : `<img src="data:${this.logoMimeType};base64,${this.logoImageBase64}" style="height: ${this.config.header.logoHeight}px; width: auto; margin-right: 20px;" alt="Logo">`)
        : '';

      // Header: Filled orange rectangle with curved borders containing logo and white text
      // Add page margin padding so header respects root page margins
      // Use explicit background layer and print-color-adjust to ensure orange background renders
      const headerHtml = this.config.header.enabled ? `
        <style>
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .header-wrapper {
            width: 100%;
            padding-left: ${pageMarginLeftPx}px;
            padding-right: ${pageMarginRightPx}px;
            box-sizing: border-box;
          }
          .header-bg {
            width: 100%;
            height: ${this.config.header.height}px;
            background-color: ${this.config.header.backgroundColor};
            background: ${this.config.header.backgroundColor};
            border-radius: ${borderRadius}px;
            position: relative;
            overflow: hidden;
          }
          .header-container {
            width: 100%;
            height: 100%;
            color: ${this.config.header.textColor};
            padding: ${this.config.header.padding.top}px ${this.config.header.padding.right}px ${this.config.header.padding.bottom}px ${this.config.header.padding.left}px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            box-sizing: border-box;
            position: relative;
            z-index: 1;
          }
        </style>
        <div class="header-wrapper">
          <div class="header-bg">
            <div class="header-container">
              <div style="display: flex; align-items: center; flex: 1;">
                ${iconHtml}
              </div>
              <div style="text-align: right; font-family: ${fontFamily}; flex: 1;">
                ${this.config.header.showCompanyName ? `<div style="font-family: ${fontFamily}; font-size: ${companyNameFontSize}px; font-weight: ${this.config.fonts.weights.bold}; margin: 0; color: ${this.config.header.textColor}; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${companyName}</div>` : ''}
                ${this.config.header.showContactInfo ? `<div style="font-family: ${fontFamily}; font-size: ${contactInfoFontSize}px; font-weight: ${this.config.fonts.weights.regular}; margin: 5px 0 0 0; color: ${this.config.header.textColor}; opacity: 0.95;">www.tiffin-wale.com | contact@tiffin-wale.com</div>` : ''}
              </div>
            </div>
          </div>
        </div>
      ` : '<div></div>';

      const addressFontSize = this.config.footer.addressFontSize || 11;
      const contactFontSize = this.config.footer.contactFontSize || 10;
      const watermarkFontSize = this.config.footer.watermarkFontSize || 8;
      
      const footerWatermark = this.config.footer.watermark.enabled ? `<div style="margin: 4px 0; font-size: ${watermarkFontSize}px; color: ${this.config.footer.watermark.color}; font-style: ${this.config.footer.watermark.style};">${this.config.footer.watermark.text}</div>` : '';
      
      // Add page watermark to footer template (appears on every page)
      let pageWatermarkHtml = '';
      if (this.config.watermark?.enabled) {
        const useImage = this.config.watermark.type === 'image' && this.watermarkImageBase64 && this.watermarkMimeType;
        const watermarkSize = this.config.watermark.size || 400;
        const rotation = this.config.watermark.rotation || -25;
        const opacity = this.config.watermark.opacity || 0.08;
        // Use only transform for centering - no margin offsets needed
        const transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        
        if (useImage) {
          // Watermark image perfectly centered on page
          pageWatermarkHtml = `
            <div style="position: fixed; left: 50%; top: 50%; transform: ${transform}; opacity: ${opacity}; z-index: 0; pointer-events: none; width: ${watermarkSize}px; height: auto; margin: 0; padding: 0;">
              <img src="data:${this.watermarkMimeType};base64,${this.watermarkImageBase64}" style="width: 100%; height: auto; display: block; margin: 0; padding: 0;" alt="Watermark">
            </div>
          `;
        } else {
          // Text watermark perfectly centered on page
          pageWatermarkHtml = `
            <div style="position: fixed; left: 50%; top: 50%; transform: ${transform}; opacity: ${opacity}; z-index: 0; pointer-events: none; font-size: ${this.config.watermark.fontSize}px; color: ${this.config.watermark.color}; font-weight: bold; white-space: nowrap; font-family: Arial, sans-serif; margin: 0; padding: 0; text-align: center;">
              ${this.config.watermark.text}
            </div>
          `;
        }
      }
      
      // Footer: Add page margin padding so footer respects root page margins
      const footerHtml = this.config.footer.enabled ? `
        ${pageWatermarkHtml}
        <div style="width: 100%; padding-left: ${pageMarginLeftPx}px; padding-right: ${pageMarginRightPx}px; box-sizing: border-box; position: relative; z-index: 1;">
          <div style="width: 100%; text-align: center; font-family: Arial, Helvetica, sans-serif; padding: ${this.config.footer.padding.top}px ${this.config.footer.padding.right}px ${this.config.footer.padding.bottom}px ${this.config.footer.padding.left}px; border-top: ${this.config.footer.borderWidth}px solid ${this.config.footer.borderColor}; margin: 0; box-sizing: border-box; background-color: ${this.config.footer.backgroundColor};">
            ${this.config.footer.showAddress ? `<div style="margin: 4px 0; font-size: ${addressFontSize}px; font-weight: 500; color: ${this.config.footer.textColor};">📍 Head Office: 23, Vijay Nagar, Indore, MP - 452010</div>` : ''}
            ${this.config.footer.showContactInfo ? `<div style="margin: 4px 0; font-size: ${contactFontSize}px; font-weight: 600; color: ${this.config.colors.primary};">✉️ contact@tiffin-wale.com | ☎️ +91 91311 14837 | 🌐 www.tiffin-wale.com</div>` : ''}
            ${this.config.footer.showWatermark ? footerWatermark : ''}
          </div>
        </div>
      ` : pageWatermarkHtml || '<div></div>';

      // Handle margins: Root page margins apply to ALL content (header, footer, body)
      // Then add content margins for header/footer spacing
      const pageMarginsForCalc = this.config.pageMargins || { top: 0, bottom: 0, left: 0, right: 0, unit: 'in' };
      
      // Convert page margins to inches for consistency
      const pageMarginTopIn = pageMarginsForCalc.unit === 'in' ? pageMarginsForCalc.top : pageMarginsForCalc.top / 96;
      const pageMarginBottomIn = pageMarginsForCalc.unit === 'in' ? pageMarginsForCalc.bottom : pageMarginsForCalc.bottom / 96;
      const pageMarginLeftIn = pageMarginsForCalc.unit === 'in' ? pageMarginsForCalc.left : pageMarginsForCalc.left / 96;
      const pageMarginRightIn = pageMarginsForCalc.unit === 'in' ? pageMarginsForCalc.right : pageMarginsForCalc.right / 96;
      
      // Content margins: top/bottom in px (for header/footer space), left/right in inches
      const contentTopMarginPx = this.config.margins.top;
      const contentBottomMarginPx = this.config.margins.bottom;
      const contentLeftMarginIn = this.config.margins.left;
      const contentRightMarginIn = this.config.margins.right;
      
      // Total margins = page margins + content margins
      // Top/bottom: page margin (in) + content margin (px converted to in)
      const totalTopMargin = `${pageMarginTopIn + (contentTopMarginPx / 96)}in`;
      const totalBottomMargin = `${pageMarginBottomIn + (contentBottomMarginPx / 96)}in`;
      // Left/right: page margin (in) + content margin (in)
      const totalLeftMargin = `${pageMarginLeftIn + contentLeftMarginIn}in`;
      const totalRightMargin = `${pageMarginRightIn + contentRightMarginIn}in`;

      // Ensure header/footer templates are properly formatted for multi-page PDFs
      // Puppeteer automatically repeats header/footer on every page when displayHeaderFooter is true
      const pdfBuffer = await page.pdf({
        format: this.config.page.format as 'A4' | 'Letter' | 'Legal' | 'Tabloid' | 'Ledger' | 'A3' | 'A5' | 'A6',
        displayHeaderFooter: this.config.header.enabled || this.config.footer.enabled,
        headerTemplate: headerHtml,
        footerTemplate: footerHtml,
        margin: {
          top: totalTopMargin,
          bottom: totalBottomMargin,
          left: totalLeftMargin,
          right: totalRightMargin,
        },
        printBackground: this.config.page.printBackground,
        preferCSSPageSize: false,
        scale: 1,
        timeout: 0, // No timeout
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    } finally {
      if (page) {
        await page.close();
      }
      await browser.close();
    }
  }
}
