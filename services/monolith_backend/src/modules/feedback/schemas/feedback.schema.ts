import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { FeedbackType, FeedbackCategory } from "../dto/feedback.dto";

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  user?: string;

  @Prop({ required: true, enum: Object.values(FeedbackType) })
  type: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: Object.values(FeedbackCategory) })
  category: string;

  @Prop({ default: "medium", enum: ["low", "medium", "high", "critical"] })
  priority: string;

  @Prop({ default: "new", enum: ["new", "in-review", "addressed", "closed"] })
  status: string;

  @Prop({ min: 1, max: 5 })
  rating?: number;

  @Prop({ type: Object })
  deviceInfo?: {
    platform?: string;
    browser?: string;
    device?: string;
    os?: string;
  };

  @Prop()
  screenshots?: string[];

  @Prop()
  adminNotes?: string;

  @Prop({ default: false })
  isResolved: boolean;

  @Prop()
  resolvedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
