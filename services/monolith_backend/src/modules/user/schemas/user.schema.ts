import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UserRole } from "../../../common/interfaces/user.interface";

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop({ default: false })
  phoneVerified: boolean;

  @Prop()
  firebaseUid: string;

  @Prop()
  profileImage: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  // Password reset fields
  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({ default: 0 })
  passwordResetAttempts?: number;

  @Prop()
  lastPasswordResetRequest?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add compound unique indexes: same email/phone allowed for different roles
UserSchema.index({ email: 1, role: 1 }, { unique: true });
UserSchema.index({ phoneNumber: 1, role: 1 }, { unique: true });
