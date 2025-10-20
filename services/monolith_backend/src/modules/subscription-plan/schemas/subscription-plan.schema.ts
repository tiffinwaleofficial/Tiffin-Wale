import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SubscriptionPlanDocument = SubscriptionPlan & Document;

@Schema({ timestamps: true })
export class SubscriptionPlan {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number })
  mealsPerDay: number;

  @Prop({ required: true, type: Number })
  daysPerWeek: number;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);

// Add indexes for better query performance
SubscriptionPlanSchema.index({ isActive: 1 });
SubscriptionPlanSchema.index({ price: 1 });
