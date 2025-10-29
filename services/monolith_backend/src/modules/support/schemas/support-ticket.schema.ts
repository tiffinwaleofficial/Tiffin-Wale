import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/schemas/user.schema";
import { Partner } from "../../partner/schemas/partner.schema";

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum TicketCategory {
  PAYMENTS = "payments",
  ORDERS = "orders",
  ACCOUNT = "account",
  MENU = "menu",
  TECHNICAL = "technical",
  OTHER = "other",
}

@Schema({ timestamps: true })
export class SupportTicket extends Document {
  @Prop({ required: true, unique: true })
  ticketId: string; // Auto-generated unique ID like "TW-2024-0001"

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  user: User | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Partner" })
  partner?: Partner | string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: String,
    enum: Object.values(TicketCategory),
    required: true,
  })
  category: string;

  @Prop({
    type: String,
    enum: Object.values(TicketStatus),
    default: TicketStatus.OPEN,
  })
  status: string;

  @Prop({
    type: String,
    enum: Object.values(TicketPriority),
    default: TicketPriority.MEDIUM,
  })
  priority: string;

  @Prop({ type: [Object], default: [] })
  replies: Array<{
    message: string;
    by: string; // 'user' or 'admin'
    userId?: string;
    adminId?: string;
    timestamp: Date;
  }>;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  assignedTo?: User | string;

  @Prop()
  resolvedAt?: Date;

  @Prop()
  closedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);

// Create indexes
SupportTicketSchema.index({ ticketId: 1 });
SupportTicketSchema.index({ user: 1 });
SupportTicketSchema.index({ partner: 1 });
SupportTicketSchema.index({ status: 1 });
SupportTicketSchema.index({ category: 1 });
SupportTicketSchema.index({ createdAt: -1 });
