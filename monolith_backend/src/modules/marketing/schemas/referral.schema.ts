import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { randomBytes } from "crypto";

export type ReferralDocument = Referral & Document;

/**
 * Referral status type
 */
enum ReferralStatus {
  PENDING = "pending",
  CONVERTED = "converted",
  EXPIRED = "expired",
}

@Schema({ timestamps: true })
export class Referral {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  referrer?: string;

  @Prop({ required: true })
  referrerEmail: string;

  @Prop({ required: true })
  referredEmail: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  referredUser?: string;

  @Prop({
    required: true,
    unique: true,
    default: () => `REF${randomBytes(4).toString("hex").toUpperCase()}`,
  })
  code: string;

  @Prop({
    default: ReferralStatus.PENDING,
    enum: Object.values(ReferralStatus),
  })
  status: string;

  @Prop()
  conversionDate?: Date;

  @Prop({
    type: Object,
    default: {
      referrerReward: "₹100 off next order",
      referredReward: "₹100 off first order",
      referrerRewardClaimed: false,
      referredRewardClaimed: false,
    },
  })
  rewards: {
    referrerReward: string;
    referredReward: string;
    referrerRewardClaimed: boolean;
    referredRewardClaimed: boolean;
  };

  @Prop()
  utmSource?: string;

  @Prop()
  utmMedium?: string;

  @Prop()
  utmCampaign?: string;

  @Prop()
  utmContent?: string;

  @Prop()
  utmTerm?: string;

  @Prop({
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 30); // 30 days expiry
      return date;
    },
  })
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);

// Export enum for reuse
export { ReferralStatus };
