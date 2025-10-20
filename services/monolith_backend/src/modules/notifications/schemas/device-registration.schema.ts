import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type DeviceRegistrationDocument = DeviceRegistration & Document;

@Schema({ timestamps: true })
export class DeviceRegistration {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, enum: ["ios", "android", "web"] })
  platform: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  userId?: Types.ObjectId;

  @Prop()
  deviceName?: string;

  @Prop()
  osVersion?: string;

  @Prop()
  appVersion?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastUsed?: Date;

  @Prop({
    type: {
      orders: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      chat: { type: Boolean, default: true },
      system: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
    },
    default: {
      orders: true,
      promotions: true,
      chat: true,
      system: true,
      reminders: true,
    },
  })
  preferences: {
    orders: boolean;
    promotions: boolean;
    chat: boolean;
    system: boolean;
    reminders: boolean;
  };

  @Prop({
    type: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "22:00" },
    },
    default: {
      start: "09:00",
      end: "22:00",
    },
  })
  quietHours: {
    start: string;
    end: string;
  };
}

export const DeviceRegistrationSchema =
  SchemaFactory.createForClass(DeviceRegistration);
