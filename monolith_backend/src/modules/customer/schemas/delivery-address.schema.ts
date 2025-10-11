import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type DeliveryAddressDocument = DeliveryAddress & Document;

@Schema({ timestamps: true })
export class DeliveryAddress {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  addressLine1: string;

  @Prop()
  addressLine2?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  landmark?: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ required: true })
  label: string; // e.g., "Home", "Work", "College"

  @Prop()
  contactNumber?: string;

  @Prop()
  instructions?: string;
}

export const DeliveryAddressSchema =
  SchemaFactory.createForClass(DeliveryAddress);

// Index for faster queries
DeliveryAddressSchema.index({ userId: 1 });
DeliveryAddressSchema.index({ userId: 1, isDefault: 1 });
