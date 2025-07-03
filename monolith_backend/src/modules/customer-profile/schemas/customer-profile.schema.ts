import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/schemas/user.schema";

@Schema({ timestamps: true })
export class CustomerProfile extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  user: User;

  @Prop({ type: String })
  city?: string;

  @Prop({ type: String })
  college?: string;

  @Prop({ type: String })
  branch?: string;

  @Prop({ type: Number })
  graduationYear?: number;

  @Prop({ type: [String], default: [] })
  dietaryPreferences: string[];

  @Prop({ type: [String], default: [] })
  favoriteCuisines: string[];

  @Prop({
    type: [
      {
        name: String,
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: Boolean,
      },
    ],
    default: [],
  })
  deliveryAddresses: Array<{
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;

  @Prop({ type: Number, default: 0 })
  rating: number;

  @Prop({ type: Number, default: 0 })
  totalSavings: number;
}

export const CustomerProfileSchema =
  SchemaFactory.createForClass(CustomerProfile);
