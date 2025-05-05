import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentStatus {
  CREATED = 'created',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentType {
  ORDER = 'order',
  SUBSCRIPTION = 'subscription',
}

@Schema({ timestamps: true })
export class Payment extends Document {
  @ApiProperty({ description: 'ID of the customer who made the payment' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  customerId: MongooseSchema.Types.ObjectId;

  @ApiProperty({ description: 'Amount of the payment in smallest currency unit (paise)' })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ description: 'Currency of the payment' })
  @Prop({ default: 'INR' })
  currency: string;

  @ApiProperty({ enum: PaymentStatus, description: 'Current status of the payment' })
  @Prop({ enum: PaymentStatus, default: PaymentStatus.CREATED })
  status: PaymentStatus;

  @ApiProperty({ description: 'Razorpay Payment ID' })
  @Prop()
  razorpayPaymentId: string;

  @ApiProperty({ description: 'Razorpay Order ID' })
  @Prop({ required: true })
  razorpayOrderId: string;

  @ApiProperty({ enum: PaymentType, description: 'Type of payment (order or subscription)' })
  @Prop({ enum: PaymentType, required: true })
  type: PaymentType;

  @ApiProperty({ description: 'ID of the referenced order or subscription' })
  @Prop({ type: MongooseSchema.Types.ObjectId, refPath: 'type' })
  referenceId: MongooseSchema.Types.ObjectId;

  @ApiProperty({ description: 'Payment method used' })
  @Prop()
  method: string;

  @ApiProperty({ description: 'Additional details about the payment' })
  @Prop({ type: Object })
  metadata: Record<string, any>;
  
  @ApiProperty({ description: 'Notes related to the payment' })
  @Prop({ type: Object })
  notes: Record<string, any>;

  @ApiProperty({ description: 'Timestamp when payment was successfully processed' })
  @Prop()
  paidAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment); 