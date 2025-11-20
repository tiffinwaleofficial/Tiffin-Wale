import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { ReportService } from "./report.service";
import {
  OrderReceiptDto,
  SubscriptionReportDto,
  PartnerContractDto,
  InvoiceDto,
  LegalDocumentDto,
  PartnerMouDto,
  ServiceAgreementDto,
  PartnerNdaDto,
  CustomerFinancialReportDto,
  PartnerFinancialReportDto,
} from "./dto";
import { Public } from "src/common/decorators/public.decorator";

@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Public()
  @Post("order-receipt")
  async generateOrderReceipt(
    @Body() orderReceiptDto: OrderReceiptDto,
    @Res() res: Response,
  ) {
    try {
      const { buffer, filename } =
        await this.reportService.generateOrderReceipt(orderReceiptDto);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("subscription-report")
  async generateSubscriptionReport(
    @Body() subscriptionReportDto: SubscriptionReportDto,
    @Res() res: Response,
  ) {
    try {
      const { buffer, filename } =
        await this.reportService.generateSubscriptionReport(
          subscriptionReportDto,
        );
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("partner-contract")
  async generatePartnerContract(
    @Body() partnerContractDto: PartnerContractDto,
    @Res() res: Response,
  ) {
    try {
      const { buffer, filename } =
        await this.reportService.generatePartnerContract(partnerContractDto);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("invoice")
  async generateInvoice(@Body() invoiceDto: InvoiceDto, @Res() res: Response) {
    try {
      const { buffer, filename } =
        await this.reportService.generateInvoice(invoiceDto);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("legal-document")
  async generateLegalDocument(
    @Body() legalDocumentDto: LegalDocumentDto,
    @Res() res: Response,
  ) {
    try {
      const { buffer, filename } =
        await this.reportService.generateLegalDocument(legalDocumentDto);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("partner-mou")
  async generatePartnerMou(
    @Body() partnerMouDto: PartnerMouDto,
    @Res() res: Response,
  ) {
    try {
      const { buffer, filename } =
        await this.reportService.generatePartnerMou(partnerMouDto);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("service-agreement")
  async generateServiceAgreement(
    @Body() serviceAgreementDto: ServiceAgreementDto,
    @Res() res: Response,
  ) {
    try {
      const { buffer, filename } =
        await this.reportService.generateServiceAgreement(serviceAgreementDto);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("partner-nda")
  async generatePartnerNda(
    @Body() partnerNdaDto: PartnerNdaDto,
    @Res() res: Response,
  ) {
    try {
      const { buffer, filename } =
        await this.reportService.generatePartnerNda(partnerNdaDto);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("customer-financial-report")
  async generateCustomerFinancialReport(
    @Body() customerFinancialReportDto: CustomerFinancialReportDto,
    @Res() res: Response,
  ) {
    try {
      const { buffer, filename } =
        await this.reportService.generateCustomerFinancialReport(
          customerFinancialReportDto,
        );
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("partner-financial-report")
  async generatePartnerFinancialReport(
    @Body() partnerFinancialReportDto: PartnerFinancialReportDto,
    @Res() res: Response,
  ) {
    try {
      const { buffer, filename } =
        await this.reportService.generatePartnerFinancialReport(
          partnerFinancialReportDto,
        );
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
