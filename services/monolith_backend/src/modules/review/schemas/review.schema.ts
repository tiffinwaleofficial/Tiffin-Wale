import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/schemas/user.schema";
import { Partner } from "../../partner/schemas/partner.schema";
import { MenuItem } from "../../menu/schemas/menu-item.schema";

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  user: User | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Partner" })
  restaurant?: Partner | string; // For restaurant reviews

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "MenuItem" })
  menuItem?: MenuItem | string; // For menu item reviews

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment?: string;

  @Prop({ type: [String], default: [] })
  images: string[]; // Review images

  @Prop({ default: 0 })
  helpfulCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
