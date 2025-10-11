import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ChatMessageDocument = ChatMessage & Document;

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  FILE = "file",
  SYSTEM = "system",
}

export enum MessageStatus {
  SENDING = "sending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ required: true, type: Types.ObjectId, ref: "Conversation" })
  conversationId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  senderId: string;

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true, enum: Object.values(MessageType) })
  messageType: MessageType;

  @Prop({ required: true })
  content: string;

  @Prop()
  mediaUrl?: string;

  @Prop()
  mediaThumbnail?: string;

  @Prop()
  mediaSize?: number;

  @Prop()
  mediaDuration?: number;

  @Prop({ type: Types.ObjectId, ref: "ChatMessage" })
  replyTo?: string;

  @Prop({
    required: true,
    enum: Object.values(MessageStatus),
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  @Prop({ type: Object })
  metadata?: {
    cloudinaryPublicId?: string;
    fileExtension?: string;
    mimeType?: string;
    [key: string]: any;
  };

  @Prop({ type: [Types.ObjectId], ref: "User" })
  readBy: string[];

  @Prop()
  readAt?: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop({ default: false })
  isEdited: boolean;

  @Prop()
  editedAt?: Date;

  @Prop()
  editedContent?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

// Indexes for better performance
ChatMessageSchema.index({ conversationId: 1, createdAt: -1 });
ChatMessageSchema.index({ senderId: 1 });
ChatMessageSchema.index({ status: 1 });
ChatMessageSchema.index({ messageType: 1 });
ChatMessageSchema.index({ replyTo: 1 });
ChatMessageSchema.index({ isDeleted: 1 });
ChatMessageSchema.index({ createdAt: -1 });

