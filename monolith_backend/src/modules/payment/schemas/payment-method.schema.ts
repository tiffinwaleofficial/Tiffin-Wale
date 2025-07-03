import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export enum PaymentMethodType {
  CARD = "card",
  UPI = "upi",
  NETBANKING = "netbanking",
  WALLET = "wallet",
}

@Schema({ timestamps: true })
export class PaymentMethod extends Document {
  @ApiProperty({
    description: "ID of the customer who owns this payment method",
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  customerId: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    enum: PaymentMethodType,
    description: "Type of payment method",
  })
  @Prop({ enum: PaymentMethodType, required: true })
  type: PaymentMethodType;

  @ApiProperty({ description: "Whether this payment method is set as default" })
  @Prop({ default: false })
  isDefault: boolean;

  @ApiProperty({ description: "Last 4 digits of card number (for cards)" })
  @Prop()
  last4: string;

  @ApiProperty({
    description: "Network/brand of the card (Visa, Mastercard, etc.)",
  })
  @Prop()
  brand: string;

  @ApiProperty({ description: "Expiry month (for cards)" })
  @Prop()
  expiryMonth: number;

  @ApiProperty({ description: "Expiry year (for cards)" })
  @Prop()
  expiryYear: number;

  @ApiProperty({ description: "Name on the card (for cards)" })
  @Prop()
  cardholderName: string;

  @ApiProperty({ description: "UPI ID (for UPI payments)" })
  @Prop()
  upiId: string;

  @ApiProperty({ description: "Bank account number (for netbanking)" })
  @Prop()
  accountNumber: string;

  @ApiProperty({ description: "IFSC code (for netbanking)" })
  @Prop()
  ifsc: string;

  @ApiProperty({ description: "Bank name (for netbanking)" })
  @Prop()
  bankName: string;

  @ApiProperty({ description: "Wallet name (for wallet payments)" })
  @Prop()
  walletName: string;

  @ApiProperty({ description: "Token ID from payment gateway" })
  @Prop({ required: true })
  tokenId: string;

  @ApiProperty({ description: "Whether the payment method is still valid" })
  @Prop({ default: true })
  isValid: boolean;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);
