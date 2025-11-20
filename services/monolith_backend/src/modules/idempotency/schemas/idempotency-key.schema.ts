import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class IdempotencyKey extends Document {
  @Prop({ required: true, unique: true, index: true })
  key: string; // UUID idempotency key

  @Prop({ type: String, ref: "User" })
  userId?: string; // User who made the request

  @Prop()
  userRole?: string; // Role of the user (SUPER_ADMIN, ADMIN, PARTNER, CUSTOMER)

  @Prop({ required: true })
  method: string; // HTTP method (POST, PUT, PATCH, DELETE)

  @Prop({ required: true })
  path: string; // Request path

  @Prop({ required: true })
  requestHash: string; // SHA-256 hash of method + path + body

  @Prop({ type: Object })
  response?: any; // Cached response data

  @Prop()
  statusCode?: number; // HTTP status code of the response

  @Prop({ required: true })
  expiresAt: Date; // TTL expiration date (24 hours from creation)

  @Prop({ default: "pending" })
  status: "pending" | "completed" | "failed"; // Request processing status

  @Prop({ type: Object, default: {} })
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    [key: string]: any;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const IdempotencyKeySchema =
  SchemaFactory.createForClass(IdempotencyKey);

// Create TTL index on expiresAt field (24 hours = 86400 seconds)
IdempotencyKeySchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: "expiresAt_ttl" },
);

// Compound index for faster lookups
IdempotencyKeySchema.index({ key: 1, userId: 1 });
