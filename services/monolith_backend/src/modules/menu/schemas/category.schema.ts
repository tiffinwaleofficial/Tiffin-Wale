import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/schemas/user.schema";

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  businessPartner: User | string;

  @Prop()
  imageUrl: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
