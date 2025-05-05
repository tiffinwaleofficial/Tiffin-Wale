import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateReferralDto {
  @ApiProperty({
    description: "Email of the referrer (if not registered)",
    example: "existing@example.com",
  })
  @IsNotEmpty({ message: "Referrer email is required" })
  @IsEmail({}, { message: "Invalid referrer email format" })
  referrerEmail: string;

  @ApiProperty({
    description: "Email of the person being referred",
    example: "friend@example.com",
  })
  @IsNotEmpty({ message: "Referred email is required" })
  @IsEmail({}, { message: "Invalid referred email format" })
  referredEmail: string;

  @ApiPropertyOptional({
    description: "UTM source parameter",
    example: "email",
  })
  @IsOptional()
  @IsString()
  utmSource?: string;

  @ApiPropertyOptional({
    description: "UTM medium parameter",
    example: "referral",
  })
  @IsOptional()
  @IsString()
  utmMedium?: string;

  @ApiPropertyOptional({
    description: "UTM campaign parameter",
    example: "summer2023",
  })
  @IsOptional()
  @IsString()
  utmCampaign?: string;

  @ApiPropertyOptional({
    description: "UTM content parameter",
    example: "header_button",
  })
  @IsOptional()
  @IsString()
  utmContent?: string;

  @ApiPropertyOptional({
    description: "UTM term parameter",
    example: "food_delivery",
  })
  @IsOptional()
  @IsString()
  utmTerm?: string;
}

export class ReferralResponseDto {
  @ApiProperty({
    description: "Unique identifier",
    example: "60d21b4667d0d8992e610c89",
  })
  id: string;

  @ApiProperty({
    description: "Referrer email",
    example: "existing@example.com",
  })
  referrerEmail: string;

  @ApiPropertyOptional({
    description: "User ID of the referrer (if registered)",
    example: "60d21b4667d0d8992e610c80",
  })
  referrer?: string;

  @ApiProperty({
    description: "Referred email",
    example: "friend@example.com",
  })
  referredEmail: string;

  @ApiPropertyOptional({
    description: "User ID of the referred person (once registered)",
    example: null,
  })
  referredUser?: string;

  @ApiProperty({
    description: "Unique referral code",
    example: "REF123456",
  })
  code: string;

  @ApiProperty({
    description: "Status of the referral",
    example: "pending",
    enum: ["pending", "converted", "expired"],
  })
  status: string;

  @ApiPropertyOptional({
    description: "When the referral was converted",
    example: null,
  })
  conversionDate?: Date;

  @ApiProperty({
    description: "Rewards information",
    example: {
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

  @ApiPropertyOptional({
    description: "UTM source parameter",
    example: "email",
  })
  utmSource?: string;

  @ApiPropertyOptional({
    description: "UTM medium parameter",
    example: "referral",
  })
  utmMedium?: string;

  @ApiPropertyOptional({
    description: "UTM campaign parameter",
    example: "summer2023",
  })
  utmCampaign?: string;

  @ApiPropertyOptional({
    description: "UTM content parameter",
    example: null,
  })
  utmContent?: string;

  @ApiPropertyOptional({
    description: "UTM term parameter",
    example: null,
  })
  utmTerm?: string;

  @ApiProperty({
    description: "Timestamp of referral creation",
    example: "2023-06-03T10:15:30.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Expiration date of the referral",
    example: "2023-07-03T10:15:30.000Z",
  })
  expiresAt: Date;

  @ApiProperty({
    description: "Timestamp of last update",
    example: "2023-06-03T10:15:30.000Z",
  })
  updatedAt: Date;
} 