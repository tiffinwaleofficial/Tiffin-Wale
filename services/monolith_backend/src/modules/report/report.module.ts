import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { OrderModule } from '../order/order.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { PartnerModule } from '../partner/partner.module';
import { UserModule } from '../user/user.module';
import { PdfStorageService } from './formats/pdf/storage/pdf-storage.service';
import {
  OrderReceiptDataGenerator,
  SubscriptionReportDataGenerator,
  PartnerContractDataGenerator,
  InvoiceDataGenerator,
  PartnerMouDataGenerator,
  ServiceAgreementDataGenerator,
  PartnerNdaDataGenerator,
} from './generators';
import { ReportLog, ReportLogSchema } from './schemas/report-log.schema';
import { PdfService } from './formats/pdf/pdf.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReportLog.name, schema: ReportLogSchema }]),
    OrderModule,
    SubscriptionModule,
    PartnerModule,
    UserModule,
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    PdfService,
    PdfStorageService,
    OrderReceiptDataGenerator,
    SubscriptionReportDataGenerator,
    PartnerContractDataGenerator,
    InvoiceDataGenerator,
    PartnerMouDataGenerator,
    ServiceAgreementDataGenerator,
    PartnerNdaDataGenerator,
  ],
  exports: [ReportService],
})
export class ReportModule {}
