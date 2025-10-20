import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/schemas/user.schema";

@Schema({ timestamps: true })
export class MenuItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  imageUrl: string;

  @Prop({ type: [String], default: [] })
  images: string[]; // Multiple images for each menu item

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  businessPartner: User | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Category" })
  category: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Menu" })
  menu?: string; // Optional menu grouping

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: Number, default: 0 })
  averageRating: number;

  @Prop({ type: Number, default: 0 })
  totalReviews: number;

  @Prop()
  tags: string[];

  @Prop()
  allergens: string[];

  @Prop({ type: Object })
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
