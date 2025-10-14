import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ConversationDocument = Conversation & Document;

export enum ConversationType {
  SUPPORT = "support",
  RESTAURANT = "restaurant",
  GROUP_ORDER = "group_order",
}

export enum ParticipantType {
  USER = "user",
  ADMIN = "admin",
  RESTAURANT = "restaurant",
  SYSTEM = "system",
}

@Schema({ _id: false })
export class ConversationParticipant {
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  userId: string;

  @Prop({ required: true, enum: Object.values(ParticipantType) })
  type: ParticipantType;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar?: string;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop()
  lastSeen?: Date;

  @Prop({ default: Date.now })
  joinedAt: Date;
}

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, enum: Object.values(ConversationType) })
  type: ConversationType;

  @Prop({ type: [ConversationParticipant], required: true })
  participants: ConversationParticipant[];

  @Prop({ type: Types.ObjectId, ref: "ChatMessage" })
  lastMessage?: string;

  @Prop({ default: 0 })
  unreadCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object })
  metadata?: {
    orderId?: string;
    restaurantId?: string;
    groupName?: string;
    [key: string]: any;
  };

  @Prop({ default: Date.now })
  lastActivityAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Indexes for better performance
ConversationSchema.index({ "participants.userId": 1 });
ConversationSchema.index({ type: 1 });
ConversationSchema.index({ lastActivityAt: -1 });
ConversationSchema.index({ "metadata.orderId": 1 });
ConversationSchema.index({ "metadata.restaurantId": 1 });






