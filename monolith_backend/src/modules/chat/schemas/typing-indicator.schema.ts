import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TypingIndicatorDocument = TypingIndicator & Document;

@Schema({ timestamps: true })
export class TypingIndicator {
  @Prop({ required: true, type: Types.ObjectId, ref: "Conversation" })
  conversationId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  isTyping: boolean;

  @Prop({ default: Date.now })
  lastTypingAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const TypingIndicatorSchema =
  SchemaFactory.createForClass(TypingIndicator);

// Indexes for better performance
TypingIndicatorSchema.index({ conversationId: 1 });
TypingIndicatorSchema.index({ userId: 1 });
TypingIndicatorSchema.index({ isTyping: 1 });
TypingIndicatorSchema.index({ lastTypingAt: -1 });

// TTL index to automatically remove old typing indicators
TypingIndicatorSchema.index({ lastTypingAt: 1 }, { expireAfterSeconds: 30 });







