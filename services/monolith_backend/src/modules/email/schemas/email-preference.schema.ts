import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";

export type EmailPreferenceDocument = EmailPreference & Document;

@Schema({ timestamps: true })
export class EmailPreference {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ default: true })
  orderUpdates: boolean;

  @Prop({ default: true })
  subscriptionNotifications: boolean;

  @Prop({ default: false })
  marketingEmails: boolean;

  @Prop({ default: true })
  securityAlerts: boolean;

  @Prop({ default: true })
  partnerNotifications: boolean;

  @Prop({ default: true })
  paymentNotifications: boolean;

  @Prop({ default: true })
  systemNotifications: boolean;

  @Prop({ default: "en" })
  preferredLanguage: string;

  @Prop({ default: "UTC" })
  timezone: string;

  @Prop({
    enum: ["immediate", "daily", "weekly", "never"],
    default: "immediate",
  })
  digestFrequency: string;

  @Prop({ type: [String], default: [] })
  unsubscribedCategories: string[];

  @Prop()
  unsubscribeToken: string;

  @Prop({ default: false })
  globalUnsubscribe: boolean;

  @Prop()
  lastEmailSent: Date;

  @Prop({ default: 0 })
  totalEmailsSent: number;
}

export const EmailPreferenceSchema =
  SchemaFactory.createForClass(EmailPreference);

// Create indexes
EmailPreferenceSchema.index({ userId: 1 }, { unique: true });
EmailPreferenceSchema.index({ unsubscribeToken: 1 });
EmailPreferenceSchema.index({ globalUnsubscribe: 1 });
