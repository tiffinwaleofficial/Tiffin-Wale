import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/schemas/user.schema";

export enum PartnerStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  SUSPENDED = "suspended",
}

@Schema({ _id: false })
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;
}

@Schema({ _id: false })
export class BusinessHours {
  @Prop({ required: true })
  open: string;

  @Prop({ required: true })
  close: string;

  @Prop({ type: [String], required: true })
  days: string[];
}

@Schema({ timestamps: true })
export class Partner extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  })
  user: User;

  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  cuisineTypes: string[];

  @Prop({ type: Address, required: true })
  address: Address;

  @Prop({ type: BusinessHours, required: true })
  businessHours: BusinessHours;

  @Prop({ default: "" })
  logoUrl: string;

  @Prop({ default: "" })
  bannerUrl: string;

  @Prop({ default: true })
  isAcceptingOrders: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({
    type: String,
    enum: Object.values(PartnerStatus),
    default: PartnerStatus.PENDING,
  })
  status: string;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  // Business details

  @Prop({ default: "" })
  gstNumber: string;

  @Prop({ default: "" })
  licenseNumber: string;

  @Prop({ default: 0 })
  establishedYear: number;

  // Contact information
  @Prop({ default: "" })
  contactEmail: string;

  @Prop({ default: "" })
  contactPhone: string;

  @Prop({ default: "" })
  whatsappNumber: string;

  // Delivery information
  @Prop({ default: 5 })
  deliveryRadius: number;

  @Prop({ default: 100 })
  minimumOrderAmount: number;

  @Prop({ default: 0 })
  deliveryFee: number;

  @Prop({ default: 30 })
  estimatedDeliveryTime: number;

  // Financial information
  @Prop({ default: 20 })
  commissionRate: number;

  // Social media
  @Prop({ type: Object, default: {} })
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };

  // Operational details
  @Prop({ default: false })
  isVegetarian: boolean;

  @Prop({ default: true })
  hasDelivery: boolean;

  @Prop({ default: true })
  hasPickup: boolean;

  @Prop({ default: true })
  acceptsCash: boolean;

  @Prop({ default: true })
  acceptsCard: boolean;

  @Prop({ default: true })
  acceptsUPI: boolean;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);

// Create indexes for common queries
PartnerSchema.index({ "address.city": 1 });
PartnerSchema.index({ "address.state": 1 });
PartnerSchema.index({ status: 1 });
PartnerSchema.index({ isAcceptingOrders: 1 });
PartnerSchema.index({ isFeatured: 1 });
PartnerSchema.index({ cuisineTypes: 1 });
PartnerSchema.index({ businessName: "text", description: "text" });
