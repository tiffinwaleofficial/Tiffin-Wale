import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/schemas/user.schema";

export class Address {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postalCode: string;

  // @Prop({ required: true })
  // country: string;

  @Prop({ default: false })
  isDefault: boolean;
}

@Schema({ timestamps: true })
export class CustomerProfile extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  })
  user: User;

  @Prop({ required: true })
  city: string;

  @Prop()
  college: string;

  @Prop()
  branch: string;

  @Prop()
  graduationYear: number;

  @Prop({ type: [String], default: [] })
  dietaryPreferences: string[];

  @Prop({ type: [String], default: [] })
  favoriteCuisines: string[];

  @Prop({ type: [String], default: [] })
  preferredPaymentMethods: string[];

  @Prop({ type: [Object], default: [] })
  deliveryAddresses: Address[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CustomerProfileSchema =
  SchemaFactory.createForClass(CustomerProfile);
