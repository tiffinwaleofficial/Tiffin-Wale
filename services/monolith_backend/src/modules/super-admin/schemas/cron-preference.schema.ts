import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class CronPreference extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  schedule: string;

  @Prop({ default: true })
  enabled: boolean;

  @Prop()
  lastRun?: Date;

  @Prop()
  nextRun?: Date;

  @Prop({ default: 0 })
  runCount: number;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CronPreferenceSchema =
  SchemaFactory.createForClass(CronPreference);
