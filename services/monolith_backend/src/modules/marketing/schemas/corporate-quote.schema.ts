import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CorporateQuoteDocument = CorporateQuote & Document;

@Schema({ timestamps: true })
export class CorporateQuote {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  contactPerson: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  employeeCount: string;

  @Prop()
  requirements?: string;

  @Prop({ default: "new" })
  status: string;

  @Prop()
  notes?: string;

  @Prop()
  assignedTo?: string;

  @Prop({ type: Date })
  followUpDate?: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const CorporateQuoteSchema =
  SchemaFactory.createForClass(CorporateQuote);
