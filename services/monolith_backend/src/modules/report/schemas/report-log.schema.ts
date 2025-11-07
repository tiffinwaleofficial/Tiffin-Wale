import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum ReportType {
  ORDER_RECEIPT = "order-receipt",
  SUBSCRIPTION_REPORT = "subscription-report",
  PARTNER_CONTRACT = "partner-contract",
  INVOICE = "invoice",
  LEGAL_DOCUMENT = "legal-document",
}

export enum ReportFormat {
  PDF = "pdf",
  EXCEL = "excel",
  CSV = "csv",
}

export enum ReportStatus {
  PENDING = "pending",
  GENERATED = "generated",
  FAILED = "failed",
}

@Schema({ timestamps: true })
export class ReportLog extends Document {
  @Prop({ required: true, enum: ReportType })
  reportType: ReportType;

  @Prop({ required: true, enum: ReportFormat, default: ReportFormat.PDF })
  format: ReportFormat;

  @Prop({ required: true, enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Prop({ required: true })
  filename: string;

  @Prop()
  filePath: string;

  @Prop()
  fileSize: number; // in bytes

  @Prop({ type: Object })
  metadata: {
    orderId?: string;
    subscriptionId?: string;
    partnerId?: string;
    invoiceId?: string;
    documentId?: string;
    [key: string]: any;
  };

  @Prop()
  generatedBy: string; // User ID

  @Prop()
  errorMessage?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ReportLogSchema = SchemaFactory.createForClass(ReportLog);

// Create indexes for efficient queries
ReportLogSchema.index({ reportType: 1, status: 1 });
ReportLogSchema.index({ format: 1, createdAt: -1 });
ReportLogSchema.index({ generatedBy: 1, createdAt: -1 });
ReportLogSchema.index({ "metadata.orderId": 1 });
ReportLogSchema.index({ "metadata.subscriptionId": 1 });
ReportLogSchema.index({ "metadata.partnerId": 1 });
