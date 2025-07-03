import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum DurationType {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export enum MealFrequency {
  DAILY = "daily",
  WEEKDAYS = "weekdays",
  WEEKENDS = "weekends",
  CUSTOM = "custom",
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class SubscriptionPlan extends Document {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    default: null,
    min: 0,
  })
  discountedPrice?: number;

  @Prop({
    required: true,
    min: 1,
  })
  durationValue: number;

  @Prop({
    required: true,
    enum: DurationType,
  })
  durationType: DurationType;

  @Prop({
    required: true,
    enum: MealFrequency,
  })
  mealFrequency: MealFrequency;

  @Prop({
    required: true,
    min: 1,
    max: 5,
  })
  mealsPerDay: number;

  @Prop({
    default: 0,
    min: 0,
  })
  deliveryFee?: number;

  @Prop({
    type: [String],
    default: [],
  })
  features?: string[];

  @Prop()
  imageUrl?: string;

  @Prop({
    default: 0,
    min: 0,
  })
  maxPauseCount?: number;

  @Prop({
    default: 0,
    min: 0,
  })
  maxSkipCount?: number;

  @Prop({
    default: 0,
    min: 0,
  })
  maxCustomizationsPerDay?: number;

  @Prop()
  termsAndConditions?: string;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
