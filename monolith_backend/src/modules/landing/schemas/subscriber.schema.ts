import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { randomBytes } from "crypto";

export type SubscriberDocument = Subscriber & Document;

@Schema({ 
  timestamps: true,
  collection: 'subscribers'
})
export class Subscriber {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name?: string;

  @Prop({ type: [String], default: [] })
  preferences: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    default: () => randomBytes(32).toString("hex"),
  })
  unsubscribeToken: string;

  @Prop({ default: "landing-page" })
  source: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber); 