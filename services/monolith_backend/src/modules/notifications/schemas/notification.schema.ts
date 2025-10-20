import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type NotificationDocument = Notification &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    required: true,
    enum: ["toast", "modal", "banner", "push"],
  })
  type: string;

  @Prop({
    required: true,
    enum: ["success", "error", "warning", "info", "order", "promotion"],
  })
  variant: string;

  @Prop({
    required: true,
    enum: ["order", "promotion", "system", "chat", "reminder"],
  })
  category: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  userId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "BusinessPartner", required: false })
  partnerId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Order", required: false })
  orderId?: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  data: Record<string, any>;

  @Prop({
    required: true,
    enum: ["pending", "sent", "delivered", "read", "failed"],
  })
  status: string;

  @Prop()
  scheduledFor?: Date;

  @Prop()
  sentAt?: Date;

  @Prop()
  deliveredAt?: Date;

  @Prop()
  readAt?: Date;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: [String], default: [] })
  channels: string[]; // ['push', 'websocket', 'email', 'sms']

  @Prop()
  expiresAt?: Date;

  @Prop({ default: 0 })
  retryCount: number;

  @Prop()
  errorMessage?: string;

  @Prop({ type: Object })
  metadata?: {
    deviceToken?: string;
    pushId?: string;
    websocketRoom?: string;
    templateId?: string;
    variables?: Record<string, any>;
  };
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
