import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PdfService } from "./formats/pdf/pdf.service";
import { PdfStorageService } from "./formats/pdf/storage/pdf-storage.service";
import {
  OrderReceiptDto,
  SubscriptionReportDto,
  PartnerContractDto,
  InvoiceDto,
  LegalDocumentDto,
  PartnerMouDto,
  ServiceAgreementDto,
  PartnerNdaDto,
} from "./dto";
import {
  OrderReceiptData,
  SubscriptionReportData,
  PartnerContractData,
  InvoiceData,
  LegalDocumentData,
  PartnerMouData,
  ServiceAgreementData,
  PartnerNdaData,
} from "./interfaces/report-data.interface";
import { OrderService } from "../order/order.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { SubscriptionPlanService } from "../subscription/subscription-plan.service";
import { PartnerService } from "../partner/partner.service";
import { UserService } from "../user/user.service";
import {
  OrderReceiptDataGenerator,
  SubscriptionReportDataGenerator,
  PartnerContractDataGenerator,
  InvoiceDataGenerator,
  PartnerMouDataGenerator,
  ServiceAgreementDataGenerator,
  PartnerNdaDataGenerator,
} from "./generators";

/**
 * Report Service
 * Orchestrates PDF generation, validates data, and calls generators
 */
@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly pdfService: PdfService,
    private readonly pdfStorageService: PdfStorageService,
    private readonly orderService: OrderService,
    private readonly subscriptionService: SubscriptionService,
    private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly partnerService: PartnerService,
    private readonly userService: UserService,
    private readonly orderReceiptDataGenerator: OrderReceiptDataGenerator,
    private readonly subscriptionReportDataGenerator: SubscriptionReportDataGenerator,
    private readonly partnerContractDataGenerator: PartnerContractDataGenerator,
    private readonly invoiceDataGenerator: InvoiceDataGenerator,
    private readonly partnerMouDataGenerator: PartnerMouDataGenerator,
    private readonly serviceAgreementDataGenerator: ServiceAgreementDataGenerator,
    private readonly partnerNdaDataGenerator: PartnerNdaDataGenerator,
  ) {}

  /**
   * Generate order receipt PDF
   */
  async generateOrderReceipt(dto: OrderReceiptDto): Promise<{ buffer: Buffer; filename: string }> {
    try {
      const orderData = await this.prepareOrderReceiptData(dto.orderId);
      const pdfBuffer = await this.pdfService.generate("order-receipt", orderData);
      const filename = this.pdfService.getFilename("order-receipt", orderData);
      
      // Only save if auto-save is enabled in config
      const config = this.pdfService.getConfig();
      if (config.storage.saveOnGeneration) {
        await this.pdfStorageService.savePdf(pdfBuffer, filename, "order-receipts");
      }
      
      return { buffer: pdfBuffer, filename };
    } catch (error) {
      this.logger.error(`Error generating order receipt: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate subscription report PDF
   */
  async generateSubscriptionReport(dto: SubscriptionReportDto): Promise<{ buffer: Buffer; filename: string }> {
    try {
      const subscriptionData = await this.prepareSubscriptionReportData(
        dto.subscriptionId,
        dto.dateRangeStart,
        dto.dateRangeEnd,
        dto.includeHistory,
      );

      const pdfBuffer = await this.pdfService.generate("subscription-report", subscriptionData);
      const filename = this.pdfService.getFilename("subscription-report", subscriptionData);
      
      // Only save if auto-save is enabled in config
      const config = this.pdfService.getConfig();
      if (config.storage.saveOnGeneration) {
        await this.pdfStorageService.savePdf(pdfBuffer, filename, "subscriptions");
      }
      
      return { buffer: pdfBuffer, filename };
    } catch (error) {
      this.logger.error(`Error generating subscription report: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate partner contract PDF
   */
  async generatePartnerContract(dto: PartnerContractDto): Promise<{ buffer: Buffer; filename: string }> {
    try {
      const contractData = await this.preparePartnerContractData(
        dto.partnerId,
        dto.contractType,
        dto.terms,
      );

      const pdfBuffer = await this.pdfService.generate("partner-contract", contractData);
      const filename = this.pdfService.getFilename("partner-contract", contractData);
      
      // Only save if auto-save is enabled in config
      const config = this.pdfService.getConfig();
      if (config.storage.saveOnGeneration) {
        await this.pdfStorageService.savePdf(pdfBuffer, filename, "contracts");
      }
      
      return { buffer: pdfBuffer, filename };
    } catch (error) {
      this.logger.error(`Error generating partner contract: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate invoice PDF
   */
  async generateInvoice(dto: InvoiceDto): Promise<{ buffer: Buffer; filename: string }> {
    try {
      const invoiceData = await this.prepareInvoiceData(dto);
      const pdfBuffer = await this.pdfService.generate("invoice", invoiceData);
      const filename = this.pdfService.getFilename("invoice", invoiceData);
      
      // Only save if auto-save is enabled in config
      const config = this.pdfService.getConfig();
      if (config.storage.saveOnGeneration) {
        await this.pdfStorageService.savePdf(pdfBuffer, filename, "invoices");
      }
      
      return { buffer: pdfBuffer, filename };
    } catch (error) {
      this.logger.error(`Error generating invoice: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate legal document PDF
   */
  async generateLegalDocument(dto: LegalDocumentDto): Promise<{ buffer: Buffer; filename: string }> {
    try {
      const legalData: LegalDocumentData = {
        documentId: `DOC-${Date.now()}`,
        documentType: dto.documentType,
        title: dto.title,
        parties: dto.parties.map((p) => ({
          name: p.name,
          role: p.role,
          address: p.address,
          contactInfo: p.contactInfo,
        })),
        effectiveDate: new Date(dto.effectiveDate),
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        terms: dto.terms.map((t) => ({
          section: t.section,
          clauses: t.clauses,
        })),
      };

      const pdfBuffer = await this.pdfService.generate("legal-document", legalData);
      const filename = this.pdfService.getFilename("legal-document", legalData);
      
      // Only save if auto-save is enabled in config
      const config = this.pdfService.getConfig();
      if (config.storage.saveOnGeneration) {
        await this.pdfStorageService.savePdf(pdfBuffer, filename, "legal-documents");
      }
      
      return { buffer: pdfBuffer, filename };
    } catch (error) {
      this.logger.error(`Error generating legal document: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Prepare order receipt data from order ID
   */
  private async prepareOrderReceiptData(orderId: string): Promise<OrderReceiptData> {
    const order = await this.orderService.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const customer = await this.userService.findById(
      typeof order.customer === "string" ? order.customer : order.customer._id.toString(),
    );
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    const partnerId = typeof order.businessPartner === "string" 
      ? order.businessPartner 
      : order.businessPartner._id.toString();

    const partner = await this.partnerService.findById(partnerId);
    if (!partner) {
      throw new NotFoundException("Partner not found");
    }

    return this.orderReceiptDataGenerator.prepareOrderReceiptData(order, customer, partner);
  }

  /**
   * Prepare subscription report data
   */
  private async prepareSubscriptionReportData(
    subscriptionId: string,
    dateRangeStart?: string,
    dateRangeEnd?: string,
    includeHistory?: boolean,
  ): Promise<SubscriptionReportData> {
    const subscription = await this.subscriptionService.findOne(subscriptionId);
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${subscriptionId} not found`);
    }

    let plan;
    if (typeof subscription.plan === "object" && subscription.plan !== null) {
      plan = subscription.plan;
    } else {
      const planId = typeof subscription.plan === "string" 
        ? subscription.plan 
        : subscription.plan._id.toString();
      plan = await this.subscriptionPlanService.findOne(planId);
    }

    if (!plan) {
      throw new NotFoundException("Subscription plan not found");
    }

    const customer = await this.userService.findById(
      typeof subscription.customer === "string" 
        ? subscription.customer 
        : subscription.customer._id.toString(),
    );
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    const meals = includeHistory ? [] : undefined;
    const payments = includeHistory ? [] : undefined;

    return this.subscriptionReportDataGenerator.prepareSubscriptionReportData(
      subscription,
      plan,
      customer,
      meals,
      payments,
    );
  }

  /**
   * Prepare partner contract data
   */
  private async preparePartnerContractData(
    partnerId: string,
    contractType: string,
    customTerms?: string[],
  ): Promise<PartnerContractData> {
    const partner = await this.partnerService.findById(partnerId);
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${partnerId} not found`);
    }

    const partnerUser = await this.userService.findById(partner.user.toString());
    if (!partnerUser) {
      throw new NotFoundException("Partner user not found");
    }

    return this.partnerContractDataGenerator.preparePartnerContractData(
      partner,
      partnerUser,
      contractType,
      customTerms,
    );
  }

  /**
   * Prepare invoice data
   */
  private async prepareInvoiceData(dto: InvoiceDto): Promise<InvoiceData> {
    if (dto.invoiceId) {
      throw new BadRequestException("Invoice ID lookup not yet implemented");
    }

    if (dto.type === "order" && dto.orderId) {
      const order = await this.orderService.findById(dto.orderId);
      if (!order) {
        throw new NotFoundException(`Order with ID ${dto.orderId} not found`);
      }

      const customer = await this.userService.findById(
        typeof order.customer === "string" ? order.customer : order.customer._id.toString(),
      );
      if (!customer) {
        throw new NotFoundException("Customer not found");
      }

      return this.invoiceDataGenerator.prepareInvoiceFromOrder(order, customer);
    }

    if (dto.type === "subscription" && dto.subscriptionId) {
      const subscription = await this.subscriptionService.findOne(dto.subscriptionId);
      if (!subscription) {
        throw new NotFoundException(`Subscription with ID ${dto.subscriptionId} not found`);
      }

      const customer = await this.userService.findById(
        typeof subscription.customer === "string" 
          ? subscription.customer 
          : subscription.customer._id.toString(),
      );
      if (!customer) {
        throw new NotFoundException("Customer not found");
      }

      return this.invoiceDataGenerator.prepareInvoiceFromSubscription(subscription, customer);
    }

    throw new BadRequestException(
      "Either orderId or subscriptionId must be provided based on invoice type",
    );
  }

  /**
   * Generate Partner MoU PDF
   */
  async generatePartnerMou(dto: PartnerMouDto): Promise<{ buffer: Buffer; filename: string }> {
    try {
      const mouData = await this.preparePartnerMouData(dto);

      const pdfBuffer = await this.pdfService.generate("partner-mou", mouData);
      const filename = this.pdfService.getFilename("partner-mou", mouData);
      
      // Only save if auto-save is enabled in config
      const config = this.pdfService.getConfig();
      if (config.storage.saveOnGeneration) {
        await this.pdfStorageService.savePdf(pdfBuffer, filename, "contracts");
      }
      
      return { buffer: pdfBuffer, filename };
    } catch (error) {
      this.logger.error(`Error generating partner MoU: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate Service Agreement PDF
   */
  async generateServiceAgreement(dto: ServiceAgreementDto): Promise<{ buffer: Buffer; filename: string }> {
    try {
      const agreementData = await this.prepareServiceAgreementData(dto);

      const pdfBuffer = await this.pdfService.generate("service-agreement", agreementData);
      const filename = this.pdfService.getFilename("service-agreement", agreementData);
      
      // Only save if auto-save is enabled in config
      const config = this.pdfService.getConfig();
      if (config.storage.saveOnGeneration) {
        await this.pdfStorageService.savePdf(pdfBuffer, filename, "contracts");
      }
      
      return { buffer: pdfBuffer, filename };
    } catch (error) {
      this.logger.error(`Error generating service agreement: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate Partner NDA PDF
   */
  async generatePartnerNda(dto: PartnerNdaDto): Promise<{ buffer: Buffer; filename: string }> {
    try {
      const ndaData = await this.preparePartnerNdaData(dto);

      const pdfBuffer = await this.pdfService.generate("partner-nda", ndaData);
      const filename = this.pdfService.getFilename("partner-nda", ndaData);
      
      // Only save if auto-save is enabled in config
      const config = this.pdfService.getConfig();
      if (config.storage.saveOnGeneration) {
        await this.pdfStorageService.savePdf(pdfBuffer, filename, "legal-documents");
      }
      
      return { buffer: pdfBuffer, filename };
    } catch (error) {
      this.logger.error(`Error generating partner NDA: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Prepare Partner MoU data
   */
  private async preparePartnerMouData(dto: PartnerMouDto): Promise<PartnerMouData> {
    // If partnerData is provided, use it directly; otherwise fetch from database
    if (dto.partnerData) {
      // Create mock partner and user objects from provided data
      const mockPartner = {
        _id: { toString: () => Date.now().toString(16) },
        businessName: dto.partnerData.businessName || '',
        address: dto.partnerData.address || '',
        contactEmail: dto.partnerData.contactEmail || '',
        contactPhone: dto.partnerData.contactPhone || '',
        whatsappNumber: dto.partnerData.whatsappNumber,
        gstNumber: dto.partnerData.gstNumber,
        licenseNumber: dto.partnerData.licenseNumber,
        establishedYear: dto.partnerData.establishedYear,
        commissionRate: dto.commissionRate || 20,
        deliveryRadius: 5,
        minimumOrderAmount: 100,
      } as any;

      const mockUser = {
        firstName: dto.partnerData.ownerFirstName || '',
        lastName: dto.partnerData.ownerLastName || '',
        email: dto.partnerData.contactEmail || '',
        phoneNumber: dto.partnerData.contactPhone || '',
      } as any;

      return this.partnerMouDataGenerator.preparePartnerMouData(
        mockPartner,
        mockUser,
        {
          commissionRate: dto.commissionRate,
          paymentTerms: dto.paymentTerms,
          contractDuration: dto.contractDuration,
          terminationNotice: dto.terminationNotice,
          minimumRating: dto.minimumRating,
          effectiveDate: dto.effectiveDate,
          expiryDate: dto.expiryDate,
          companyGstNumber: dto.companyGstNumber,
          companyPanNumber: dto.companyPanNumber,
        },
      );
    }

    // Fetch from database
    if (!dto.partnerId) {
      throw new BadRequestException("Either partnerId or partnerData must be provided");
    }

    const partner = await this.partnerService.findById(dto.partnerId);
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${dto.partnerId} not found`);
    }

    const partnerUser = await this.userService.findById(partner.user.toString());
    if (!partnerUser) {
      throw new NotFoundException("Partner user not found");
    }

    return this.partnerMouDataGenerator.preparePartnerMouData(
      partner,
      partnerUser,
      {
        commissionRate: dto.commissionRate,
        paymentTerms: dto.paymentTerms,
        contractDuration: dto.contractDuration,
        terminationNotice: dto.terminationNotice,
        minimumRating: dto.minimumRating,
        effectiveDate: dto.effectiveDate,
        expiryDate: dto.expiryDate,
        companyGstNumber: dto.companyGstNumber,
        companyPanNumber: dto.companyPanNumber,
      },
    );
  }

  /**
   * Prepare Service Agreement data
   */
  private async prepareServiceAgreementData(dto: ServiceAgreementDto): Promise<ServiceAgreementData> {
    // If partnerData is provided, use it directly; otherwise fetch from database
    if (dto.partnerData) {
      const mockPartner = {
        _id: { toString: () => Date.now().toString(16) },
        businessName: dto.partnerData.businessName || '',
        address: dto.partnerData.address || '',
        contactEmail: dto.partnerData.contactEmail || '',
        contactPhone: dto.partnerData.contactPhone || '',
        whatsappNumber: dto.partnerData.whatsappNumber,
        gstNumber: dto.partnerData.gstNumber,
        licenseNumber: dto.partnerData.licenseNumber,
        establishedYear: dto.partnerData.establishedYear,
        commissionRate: dto.commissionRate || 20,
        deliveryRadius: 5,
        minimumOrderAmount: 100,
        estimatedDeliveryTime: 30,
      } as any;

      const mockUser = {
        firstName: dto.partnerData.ownerFirstName || '',
        lastName: dto.partnerData.ownerLastName || '',
        email: dto.partnerData.contactEmail || '',
        phoneNumber: dto.partnerData.contactPhone || '',
      } as any;

      return this.serviceAgreementDataGenerator.prepareServiceAgreementData(
        mockPartner,
        mockUser,
        {
          commissionRate: dto.commissionRate,
          paymentTerms: dto.paymentTerms,
          contractDuration: dto.contractDuration,
          terminationNotice: dto.terminationNotice,
          minimumRating: dto.minimumRating,
          minimumAcceptanceRate: dto.minimumAcceptanceRate,
          orderAcceptanceTime: dto.orderAcceptanceTime,
          cancellationPolicy: dto.cancellationPolicy,
          commissionChangeNotice: dto.commissionChangeNotice,
          paymentProcessingDays: dto.paymentProcessingDays,
          minimumPayoutAmount: dto.minimumPayoutAmount,
          effectiveDate: dto.effectiveDate,
          expiryDate: dto.expiryDate,
          companyGstNumber: dto.companyGstNumber,
          companyPanNumber: dto.companyPanNumber,
        },
      );
    }

    // Fetch from database
    if (!dto.partnerId) {
      throw new BadRequestException("Either partnerId or partnerData must be provided");
    }

    const partner = await this.partnerService.findById(dto.partnerId);
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${dto.partnerId} not found`);
    }

    const partnerUser = await this.userService.findById(partner.user.toString());
    if (!partnerUser) {
      throw new NotFoundException("Partner user not found");
    }

    return this.serviceAgreementDataGenerator.prepareServiceAgreementData(
      partner,
      partnerUser,
      {
        commissionRate: dto.commissionRate,
        paymentTerms: dto.paymentTerms,
        contractDuration: dto.contractDuration,
        terminationNotice: dto.terminationNotice,
        minimumRating: dto.minimumRating,
        minimumAcceptanceRate: dto.minimumAcceptanceRate,
        orderAcceptanceTime: dto.orderAcceptanceTime,
        cancellationPolicy: dto.cancellationPolicy,
        commissionChangeNotice: dto.commissionChangeNotice,
        paymentProcessingDays: dto.paymentProcessingDays,
        minimumPayoutAmount: dto.minimumPayoutAmount,
        effectiveDate: dto.effectiveDate,
        expiryDate: dto.expiryDate,
        companyGstNumber: dto.companyGstNumber,
        companyPanNumber: dto.companyPanNumber,
      },
    );
  }

  /**
   * Prepare Partner NDA data
   */
  private async preparePartnerNdaData(dto: PartnerNdaDto): Promise<PartnerNdaData> {
    // If partnerData is provided, use it directly; otherwise fetch from database
    if (dto.partnerData) {
      const mockPartner = {
        _id: { toString: () => Date.now().toString(16) },
        businessName: dto.partnerData.businessName || '',
        address: dto.partnerData.address || '',
        contactEmail: dto.partnerData.contactEmail || '',
        contactPhone: dto.partnerData.contactPhone || '',
        gstNumber: dto.partnerData.gstNumber,
      } as any;

      const mockUser = {
        firstName: dto.partnerData.ownerFirstName || '',
        lastName: dto.partnerData.ownerLastName || '',
        email: dto.partnerData.contactEmail || '',
        phoneNumber: dto.partnerData.contactPhone || '',
      } as any;

      return this.partnerNdaDataGenerator.preparePartnerNdaData(
        mockPartner,
        mockUser,
        {
          purpose: dto.purpose,
          term: dto.term,
          survivalPeriod: dto.survivalPeriod,
          effectiveDate: dto.effectiveDate,
          expiryDate: dto.expiryDate,
          companyGstNumber: dto.companyGstNumber,
          companyPanNumber: dto.companyPanNumber,
        },
      );
    }

    // Fetch from database
    if (!dto.partnerId) {
      throw new BadRequestException("Either partnerId or partnerData must be provided");
    }

    const partner = await this.partnerService.findById(dto.partnerId);
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${dto.partnerId} not found`);
    }

    const partnerUser = await this.userService.findById(partner.user.toString());
    if (!partnerUser) {
      throw new NotFoundException("Partner user not found");
    }

    return this.partnerNdaDataGenerator.preparePartnerNdaData(
      partner,
      partnerUser,
      {
        purpose: dto.purpose,
        term: dto.term,
        survivalPeriod: dto.survivalPeriod,
        effectiveDate: dto.effectiveDate,
        expiryDate: dto.expiryDate,
        companyGstNumber: dto.companyGstNumber,
        companyPanNumber: dto.companyPanNumber,
      },
    );
  }
}