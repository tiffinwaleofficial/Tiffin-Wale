import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Partner } from "../../partner/schemas/partner.schema";

@Schema({ timestamps: true })
export class Menu extends Document {
  @Prop({ required: true })
  name: string; // "Breakfast Menu", "Lunch Special"
  
  @Prop()
  description: string;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Partner", required: true })
  restaurant: Partner | string;
  
  @Prop({ type: [String], default: [] })
  images: string[]; // Menu banner images
  
  @Prop({ default: true })
  isActive: boolean;
  
  @Prop()
  availableFrom: string; // "08:00"
  
  @Prop()
  availableTo: string; // "11:00"
  
  createdAt: Date;
  updatedAt: Date;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

