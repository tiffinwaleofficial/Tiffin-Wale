import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/schemas/user.schema";
import { MenuItem } from "../../menu/schemas/menu-item.schema";

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
export class Meal extends Document {
  @Prop({
    required: true,
    type: String,
    enum: Object.values(MealType),
  })
  type: MealType;

  @Prop({
    required: true,
    type: Date,
  })
  scheduledDate: Date;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: "MenuItem" }],
    default: [],
  })
  menuItems: MenuItem[];

  @Prop({
    required: true,
    type: String,
    enum: Object.values(MealStatus),
    default: MealStatus.SCHEDULED,
  })
  status: MealStatus;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
  })
  customer: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
  })
  businessPartner: User;

  @Prop({
    type: String,
  })
  businessPartnerName: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isRated: boolean;

  @Prop({
    type: Number,
    min: 1,
    max: 5,
  })
  rating: number;

  @Prop({
    type: String,
  })
  review: string;

  @Prop({
    type: String,
  })
  cancellationReason: string;

  @Prop({
    type: String,
  })
  deliveryNotes: string;

  @Prop({
    type: Date,
  })
  deliveredAt: Date;

  @Prop({
    type: Date,
  })
  createdAt: Date;

  @Prop({
    type: Date,
  })
  updatedAt: Date;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
