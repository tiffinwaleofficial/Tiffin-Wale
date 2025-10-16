import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export type EmailLogDocument = EmailLog & Document;

@Schema({ timestamps: true })
export class EmailLog {
  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  template: string;

  @Prop({ type: Object, default: {} })
  templateData: Record<string, any>;

  @Prop({
    enum: ["pending", "sent", "delivered", "failed", "bounced"],
    default: "pending",
  })
  status: string;

  @Prop()
  resendId: string;

  @Prop()
  errorMessage: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  userId: mongoose.Types.ObjectId;

  @Prop()
  from: string;

  @Prop({ type: [String] })
  cc: string[];

  @Prop({ type: [String] })
  bcc: string[];

  @Prop()
  replyTo: string;

  @Prop({ default: Date.now })
  sentAt: Date;

  @Prop()
  deliveredAt: Date;

  @Prop()
  failedAt: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop({ default: 0 })
  retryCount: number;

  @Prop()
  nextRetryAt: Date;
}

export const EmailLogSchema = SchemaFactory.createForClass(EmailLog);

// Create indexes for better query performance
EmailLogSchema.index({ userId: 1, createdAt: -1 });
EmailLogSchema.index({ status: 1, createdAt: -1 });
EmailLogSchema.index({ template: 1, createdAt: -1 });
EmailLogSchema.index({ resendId: 1 });
EmailLogSchema.index({ nextRetryAt: 1, status: 1 });
