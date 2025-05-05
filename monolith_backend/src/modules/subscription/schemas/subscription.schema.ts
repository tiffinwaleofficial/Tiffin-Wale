import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/schemas/user.schema";
import { SubscriptionPlan } from "./subscription-plan.schema";

export enum SubscriptionStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  PENDING = "pending",
}

export enum PaymentFrequency {
  ONETIME = "onetime",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
}

@Schema({ timestamps: true })
export class Subscription extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
  })
  customer: User;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "SubscriptionPlan",
  })
  plan: SubscriptionPlan;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(SubscriptionStatus),
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  @Prop({
    required: true,
    type: Date,
  })
  startDate: Date;

  @Prop({
    required: true,
    type: Date,
  })
  endDate: Date;

  @Prop({
    type: Date,
  })
  cancelledAt: Date;

  @Prop({
    type: String,
  })
  cancellationReason: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  autoRenew: boolean;

  @Prop({
    type: String,
    enum: Object.values(PaymentFrequency),
    default: PaymentFrequency.MONTHLY,
  })
  paymentFrequency: PaymentFrequency;

  @Prop({
    type: Number,
    required: true,
  })
  totalAmount: number;

  @Prop({
    type: Number,
    default: 0,
  })
  discountAmount: number;

  @Prop({
    type: String,
  })
  paymentId: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isPaid: boolean;

  @Prop({
    type: [String],
    default: [],
  })
  customizations: string[];

  @Prop({
    type: Date,
  })
  lastRenewalDate: Date;

  @Prop({
    type: Date,
  })
  nextRenewalDate: Date;

  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription); 