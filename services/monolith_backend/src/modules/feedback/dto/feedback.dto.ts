import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

enum FeedbackType {
  GENERAL = "general",
  SUGGESTION = "suggestion",
  BUG = "bug",
  COMPLAINT = "complaint",
}

enum FeedbackCategory {
  APP = "app",
  FOOD = "food",
  DELIVERY = "delivery",
  PARTNER = "partner",
  OTHER = "other",
}

export class CreateFeedbackDto {
  @ApiProperty({
    enum: FeedbackType,
    description: "Type of feedback",
    example: FeedbackType.SUGGESTION,
  })
  @IsNotEmpty({ message: "Type is required" })
  @IsEnum(FeedbackType, { message: "Invalid feedback type" })
  type: FeedbackType;

  @ApiProperty({
    description: "Brief subject of the feedback",
    example: "Add Meal Plans Feature",
  })
  @IsNotEmpty({ message: "Subject is required" })
  @IsString()
  @Length(3, 100, { message: "Subject must be between 3 and 100 characters" })
  subject: string;

  @ApiProperty({
    description: "Detailed feedback message",
    example:
      "It would be great if we could subscribe to weekly meal plans at a discounted rate.",
  })
  @IsNotEmpty({ message: "Message is required" })
  @IsString()
  @Length(10, 2000, {
    message: "Message must be between 10 and 2000 characters",
  })
  message: string;

  @ApiProperty({
    enum: FeedbackCategory,
    description: "Category of the feedback",
    example: FeedbackCategory.APP,
  })
  @IsNotEmpty({ message: "Category is required" })
  @IsEnum(FeedbackCategory, { message: "Invalid feedback category" })
  category: FeedbackCategory;

  @ApiPropertyOptional({
    description: "Optional rating (1-5)",
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: "Rating must be at least 1" })
  @Max(5, { message: "Rating cannot exceed 5" })
  rating?: number;

  @ApiPropertyOptional({
    description: "Device information for technical issues",
    example: {
      platform: "web",
      browser: "Chrome 91.0.4472.124",
      device: "Desktop",
      os: "Windows 10",
    },
  })
  @IsOptional()
  deviceInfo?: {
    platform?: string;
    browser?: string;
    device?: string;
    os?: string;
  };
}

export class FeedbackResponseDto {
  @ApiProperty({
    description: "Unique identifier",
    example: "60d21b4667d0d8992e610c90",
  })
  id: string;

  @ApiProperty({
    description: "Reference to User schema if authenticated",
    example: "60d21b4667d0d8992e610c80",
    required: false,
  })
  user?: string;

  @ApiProperty({
    enum: FeedbackType,
    description: "Type of feedback",
    example: FeedbackType.SUGGESTION,
  })
  type: FeedbackType;

  @ApiProperty({
    description: "Brief subject of the feedback",
    example: "Add Meal Plans Feature",
  })
  subject: string;

  @ApiProperty({
    description: "Detailed feedback message",
    example:
      "It would be great if we could subscribe to weekly meal plans at a discounted rate.",
  })
  message: string;

  @ApiProperty({
    enum: FeedbackCategory,
    description: "Category of the feedback",
    example: FeedbackCategory.APP,
  })
  category: FeedbackCategory;

  @ApiProperty({
    description: "Priority level",
    example: "medium",
    enum: ["low", "medium", "high", "critical"],
  })
  priority: string;

  @ApiProperty({
    description: "Status of the feedback",
    example: "new",
    enum: ["new", "in-review", "addressed", "closed"],
  })
  status: string;

  @ApiPropertyOptional({
    description: "Optional rating (1-5)",
    example: 4,
  })
  rating?: number;

  @ApiPropertyOptional({
    description: "Device information for technical issues",
    example: {
      platform: "web",
      browser: "Chrome 91.0.4472.124",
      device: "Desktop",
      os: "Windows 10",
    },
  })
  deviceInfo?: {
    platform?: string;
    browser?: string;
    device?: string;
    os?: string;
  };

  @ApiProperty({
    description: "Whether the feedback has been resolved",
    example: false,
  })
  isResolved: boolean;

  @ApiProperty({
    description: "Timestamp of submission",
    example: "2023-06-03T10:15:30.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Timestamp of last update",
    example: "2023-06-03T10:15:30.000Z",
  })
  updatedAt: Date;
}

// Export enums for reuse
export { FeedbackType, FeedbackCategory };
