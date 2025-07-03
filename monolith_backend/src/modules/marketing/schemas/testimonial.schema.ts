import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

/**
 * Testimonial Schema - Stores customer testimonials and reviews
 */
@Schema({
  timestamps: true,
  collection: "testimonials",
})
export class Testimonial extends Document {
  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
  })
  profession?: string;

  @Prop({
    required: true,
    type: Number,
    min: 1,
    max: 5,
  })
  rating: number;

  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  testimonial: string;

  @Prop({
    type: String,
    trim: true,
  })
  imageUrl?: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isApproved: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isFeatured: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
    required: false,
  })
  user?: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: ["web", "app", "manual", "other"],
    default: "web",
  })
  source: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
