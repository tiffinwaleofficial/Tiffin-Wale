import { IsString, IsOptional, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum InvoiceType {
  ORDER = "order",
  SUBSCRIPTION = "subscription",
  OTHER = "other",
}

export class InvoiceDto {
  @ApiPropertyOptional({ description: "Invoice ID (if already exists)" })
  @IsOptional()
  @IsString()
  invoiceId?: string;

  @ApiPropertyOptional({ description: "Order ID (for order invoices)" })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    description: "Subscription ID (for subscription invoices)",
  })
  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @ApiProperty({
    description: "Type of invoice",
    enum: InvoiceType,
  })
  @IsEnum(InvoiceType)
  type: InvoiceType;
}
