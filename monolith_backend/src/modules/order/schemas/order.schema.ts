import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/schemas/user.schema";
import { OrderStatus } from "../../../common/interfaces/order.interface";

@Schema({ _id: false })
class OrderItem {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
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
  actualDeliveryTime: Date;

  @Prop({ min: 1, max: 5 })
  rating: number;

  @Prop()
  review: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
