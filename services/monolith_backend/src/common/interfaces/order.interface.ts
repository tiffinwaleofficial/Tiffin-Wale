import { Document } from "mongoose";
import { IUser } from "./user.interface";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  READY = "ready",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface IOrderItem {
  mealId: string;
  quantity: number;
  specialInstructions?: string;
  price: number;
}

export interface IOrder extends Document {
  customer: IUser | string;
  businessPartner: IUser | string;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryInstructions?: string;
  isPaid: boolean;
  paymentDetails: {
    transactionId?: string;
    paidAt?: Date;
    paymentMethod?: string;
    amount?: number;
  };
  scheduledDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}
