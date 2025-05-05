import { Document } from "mongoose";

export enum UserRole {
  CUSTOMER = "customer",
  BUSINESS = "business",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
