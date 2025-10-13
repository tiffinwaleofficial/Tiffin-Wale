import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type NotificationTemplateDocument = NotificationTemplate & Document;

@Schema({ timestamps: true })
export class NotificationTemplate {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    required: true,
    enum: ["order", "promotion", "system", "chat", "reminder"],
  })
  category: string;

  @Prop({
    required: true,
    enum: ["success", "error", "warning", "info", "order", "promotion"],
  })
  variant: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: [String], default: [] })
  variables: string[]; // Available template variables like {{userName}}, {{orderNumber}}

  @Prop({ type: [String], default: ["push", "websocket"] })
  defaultChannels: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object })
  styling?: {
    icon?: string;
    color?: string;
    image?: string;
    actions?: Array<{
      text: string;
      action: string;
      style?: "default" | "cancel" | "destructive";
    }>;
  };

  @Prop({ type: Object })
  conditions?: {
    userType?: string[];
    platform?: string[];
    timeRange?: {
      start: string;
      end: string;
    };
    frequency?: {
      maxPerDay?: number;
      maxPerWeek?: number;
      cooldown?: number; // minutes
    };
  };
}

export const NotificationTemplateSchema =
  SchemaFactory.createForClass(NotificationTemplate);
