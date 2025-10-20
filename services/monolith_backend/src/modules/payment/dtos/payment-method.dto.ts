import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
} from "class-validator";
import { PaymentMethodType } from "../schemas/payment-method.schema";

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: "ID of the customer who owns this payment method",
  })
  @IsMongoId()
  customerId: string;

  @ApiProperty({
    enum: PaymentMethodType,
    description: "Type of payment method",
  })
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @ApiProperty({ description: "Token ID from payment gateway", required: true })
  @IsString()
  tokenId: string;

  @ApiProperty({
    description: "Whether this payment method is set as default",
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({
    description: "Last 4 digits of card number (for cards)",
    required: false,
  })
  @IsString()
  @IsOptional()
  last4?: string;

  @ApiProperty({
    description: "Network/brand of the card (Visa, Mastercard, etc.)",
    required: false,
  })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ description: "Expiry month (for cards)", required: false })
  @IsNumber()
  @IsOptional()
  expiryMonth?: number;

  @ApiProperty({ description: "Expiry year (for cards)", required: false })
  @IsNumber()
  @IsOptional()
  expiryYear?: number;

  @ApiProperty({ description: "Name on the card (for cards)", required: false })
  @IsString()
  @IsOptional()
  cardholderName?: string;

  @ApiProperty({ description: "UPI ID (for UPI payments)", required: false })
  @IsString()
  @IsOptional()
  upiId?: string;

  @ApiProperty({
    description: "Bank account number (for netbanking)",
    required: false,
  })
  @IsString()
  @IsOptional()
  accountNumber?: string;

  @ApiProperty({ description: "IFSC code (for netbanking)", required: false })
  @IsString()
  @IsOptional()
  ifsc?: string;

  @ApiProperty({ description: "Bank name (for netbanking)", required: false })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiProperty({
    description: "Wallet name (for wallet payments)",
    required: false,
  })
  @IsString()
  @IsOptional()
  walletName?: string;
}

export class UpdatePaymentMethodDto {
  @ApiProperty({
    description: "Whether this payment method is set as default",
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({
    description: "Whether the payment method is still valid",
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isValid?: boolean;
}
