import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/schemas/user.schema";
import { OrderStatus } from "../../../common/interfaces/order.interface";

@Schema({ _id: false })
class OrderItem {
  @Prop({ required: true }) // Changed from ObjectId to allow string IDs for subscription orders
  mealId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  specialInstructions: string;

  @Prop({ required: true })
  price: number;
}

@Schema({ _id: false })
class PaymentDetails {
  @Prop()
  transactionId: string;

  @Prop()
  paidAt: Date;

  @Prop()
  paymentMethod: string;

  @Prop()
  amount: number;
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  customer: User | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  businessPartner: User | string;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ required: true })
  deliveryAddress: string;

  @Prop()
  deliveryInstructions: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ type: PaymentDetails, default: {} })
  paymentDetails: PaymentDetails;

  @Prop()
  scheduledDeliveryTime: Date;

  @Prop()
  deliveryDate?: Date; // Date part only (for frontend filtering by date)

  @Prop()
  actualDeliveryTime: Date;

  @Prop({ min: 1, max: 5 })
  rating: number;

  @Prop()
  review: string;

  // New fields for tiffin center operations
  @Prop({
    type: String,
    enum: ["breakfast", "lunch", "dinner"],
  })
  mealType?: string;

  @Prop({
    type: String,
    enum: ["morning", "afternoon", "evening"],
  })
  deliverySlot?: string;

  @Prop()
  deliveryTimeRange?: string; // "8-10 AM"

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "SubscriptionPlan" })
  subscriptionPlan?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Subscription" })
  subscription?: string; // Link to subscription

  @Prop()
  dayOfWeek?: string; // "monday", "tuesday", etc.

  @Prop()
  preparedAt?: Date;

  @Prop()
  outForDeliveryAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
