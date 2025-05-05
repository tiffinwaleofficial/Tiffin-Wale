import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  subject?: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: "website" })
  source: string;

  @Prop({ default: "new", enum: ["new", "contacted", "resolved"] })
  status: string;

  @Prop({ default: false })
  isResolved: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact); 