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
    type: [String],
    default: [],
  })
  images?: string[]; // Multiple images for the plan

  @Prop({
    type: Object,
    required: false,
  })
  mealSpecification?: {
    rotis?: number;
    sabzis?: Array<{
      name: string;
      quantity: string;
    }>;
    dal?: {
      type: string;
      quantity: string;
    };
    rice?: {
      quantity: string;
      type?: string;
    };
    extras?: Array<{
      name: string;
      included: boolean;
      cost?: number;
    }>;
    salad?: boolean;
    curd?: boolean;
  };

  @Prop({
    type: String,
    required: false,
  })
  partner?: string; // Partner ID who owns this plan

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

  // Day-wise meal menu scheduling
  @Prop({
    type: Object,
    required: false,
  })
  weeklyMenu?: {
    monday?: { breakfast?: string[]; lunch?: string[]; dinner?: string[] };
    tuesday?: { breakfast?: string[]; lunch?: string[]; dinner?: string[] };
    wednesday?: { breakfast?: string[]; lunch?: string[]; dinner?: string[] };
    thursday?: { breakfast?: string[]; lunch?: string[]; dinner?: string[] };
    friday?: { breakfast?: string[]; lunch?: string[]; dinner?: string[] };
    saturday?: { breakfast?: string[]; lunch?: string[]; dinner?: string[] };
    sunday?: { breakfast?: string[]; lunch?: string[]; dinner?: string[] };
  };

  // Operational days
  @Prop({
    type: [String],
    default: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
  })
  operationalDays?: string[];

  // Delivery slots configuration
  @Prop({
    type: Object,
    default: {
      morning: { enabled: true, timeRange: "8-10 AM" },
      afternoon: { enabled: true, timeRange: "12-2 PM" },
      evening: { enabled: true, timeRange: "6-8 PM" },
    },
  })
  deliverySlots?: {
    morning?: { enabled: boolean; timeRange: string };
    afternoon?: { enabled: boolean; timeRange: string };
    evening?: { enabled: boolean; timeRange: string };
  };

  // Monthly menu variation
  @Prop({
    default: false,
  })
  monthlyMenuVariation?: boolean;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
