import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import {
  PaymentFrequency,
  SubscriptionStatus,
} from "../schemas/subscription.schema";

export class CreateSubscriptionDto {
  @ApiProperty({
    description: "User ID who is subscribing",
    example: "60d21b4667d0d8992e610c85",
  })
  @IsMongoId()
  customer: string;

  @ApiProperty({
    description: "Subscription plan ID",
    example: "60d21b4667d0d8992e610c86",
  })
  @IsMongoId()
  plan: string;

  @ApiProperty({
    description: "Status of subscription",
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
    example: SubscriptionStatus.PENDING,
  })
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus = SubscriptionStatus.PENDING;

  @ApiProperty({
    description: "Start date of subscription",
    example: "2023-06-15T00:00:00.000Z",
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: "End date of subscription",
    example: "2023-07-15T00:00:00.000Z",
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    description: "Whether to auto-renew the subscription",
    default: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  autoRenew?: boolean = false;

  @ApiProperty({
    description: "Payment frequency",
    enum: PaymentFrequency,
    default: PaymentFrequency.MONTHLY,
    example: PaymentFrequency.MONTHLY,
  })
  @IsEnum(PaymentFrequency)
  @IsOptional()
  paymentFrequency?: PaymentFrequency = PaymentFrequency.MONTHLY;

  @ApiProperty({ description: "Total amount of subscription", example: 199.99 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    description: "Discount amount applied to subscription",
    default: 0,
    example: 20.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number = 0;

  @ApiProperty({
    description: "Payment ID from payment processor",
    example: "pay_1234567890",
    required: false,
  })
  @IsString()
  @IsOptional()
  paymentId?: string;

  @ApiProperty({
    description: "Whether the subscription is paid",
    default: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean = false;

  @ApiProperty({
    description: "Custom meal preferences or requirements",
    type: [String],
    example: ["No onions", "Extra spicy"],
    required: false,
  })
  @IsString({ each: true })
  @IsOptional()
  customizations?: string[] = [];
}
