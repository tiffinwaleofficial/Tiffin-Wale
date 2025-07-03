import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateSubscriberDto {
  @ApiProperty({
    description: "Email address",
    example: "subscriber@example.com",
  })
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @ApiProperty({
    description: "Full name (optional)",
    example: "Jane Smith",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Content preferences (optional)",
    example: ["promotions", "new-partners"],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferences?: string[];

  @ApiProperty({
    description: "Source of the subscription",
    example: "landing-page",
    required: false,
  })
  @IsOptional()
  @IsString()
  source?: string;
}

export class SubscriberResponseDto {
  @ApiProperty({
    description: "Unique identifier",
    example: "60d21b4667d0d8992e610c88",
  })
  id: string;

  @ApiProperty({
    description: "Email address",
    example: "subscriber@example.com",
  })
  email: string;

  @ApiProperty({
    description: "Full name (optional)",
    example: "Jane Smith",
  })
  name?: string;

  @ApiProperty({
    description: "Content preferences",
    example: ["promotions", "new-partners"],
    type: [String],
  })
  preferences?: string[];

  @ApiProperty({
    description: "Whether the subscription is active",
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: "Source of the subscription",
    example: "landing-page",
  })
  source?: string;

  @ApiProperty({
    description: "Unsubscribe token",
    example: "9062e06b0aab3a0523a47d9b41dda64f910e2cb3cer4a200d97f858328a7b256",
  })
  unsubscribeToken?: string;

  @ApiProperty({
    description: "Timestamp of subscription",
    example: "2023-06-03T10:15:30.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Timestamp of last update",
    example: "2023-06-03T10:15:30.000Z",
  })
  updatedAt: Date;
}

// New DTO for subscribers list response
export class GetSubscribersResponseDto {
  @ApiProperty({
    description: "List of subscribers",
    type: [SubscriberResponseDto],
  })
  subscribers: SubscriberResponseDto[];

  @ApiProperty({
    description: "Total number of subscribers matching the filter",
    example: 120,
  })
  total: number;

  @ApiProperty({
    description: "Current page number",
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
  })
  limit: number;
}
