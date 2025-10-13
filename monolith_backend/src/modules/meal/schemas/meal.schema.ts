import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type MealDocument = Meal & Document;

// Export enums for reuse
export enum MealType {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  DINNER = "dinner",
  SNACK = "snack",
}

export enum MealStatus {
  SCHEDULED = "scheduled",
  PREPARING = "preparing",
  READY = "ready",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  SKIPPED = "skipped",
}

@Schema({ timestamps: true })
export class Meal {
  @Prop({ required: true })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  image?: string;

  @Prop({
    required: true,
    enum: MealType,
    default: MealType.BREAKFAST,
  })
  type: MealType;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: "MenuItem" })
  menu: MongooseSchema.Types.ObjectId[];

  @Prop({
    required: true,
    enum: MealStatus,
    default: MealStatus.SCHEDULED,
  })
  status: MealStatus;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  })
  restaurantId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  restaurantName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, min: 1, max: 5 })
  userRating?: number;

  @Prop({ type: String })
  userReview?: string;

  @Prop({ type: String })
  skipReason?: string;

  @Prop({ type: Date })
  deliveredAt?: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  // Virtual properties for compatibility with auth service
  menuItems?: MongooseSchema.Types.ObjectId[];
  businessPartnerName?: string;
  scheduledDate?: Date;
  rating?: number;
}

export const MealSchema = SchemaFactory.createForClass(Meal);

// Add virtual properties for compatibility
MealSchema.virtual("menuItems").get(function () {
  return this.menu;
});

MealSchema.virtual("businessPartnerName").get(function () {
  return this.restaurantName;
});

MealSchema.virtual("scheduledDate").get(function () {
  return this.date;
});

MealSchema.virtual("rating").get(function () {
  return this.userRating;
});

// Ensure virtuals are included when converting to JSON
MealSchema.set("toJSON", { virtuals: true });
MealSchema.set("toObject", { virtuals: true });

// Add indexes for better query performance
MealSchema.index({ userId: 1, date: 1 });
MealSchema.index({ restaurantId: 1, date: 1 });
MealSchema.index({ status: 1 });
MealSchema.index({ userId: 1, status: 1 });
