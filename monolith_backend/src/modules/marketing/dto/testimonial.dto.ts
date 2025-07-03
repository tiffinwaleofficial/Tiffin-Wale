import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Max,
  Min,
} from "class-validator";

export class CreateTestimonialDto {
  @ApiProperty({
    description: "Full name of the person providing testimonial",
    example: "Jane Smith",
  })
  @IsNotEmpty({ message: "Name is required" })
  @IsString()
  @MaxLength(100, { message: "Name cannot exceed 100 characters" })
  name: string;

  @ApiProperty({
    description: "Email of the person providing testimonial",
    example: "jane.smith@example.com",
  })
  @IsNotEmpty({ message: "Email is required" })
  @IsString()
  @MaxLength(100, { message: "Email cannot exceed 100 characters" })
  email: string;

  @ApiPropertyOptional({
    description: "Profession or title of the person",
    example: "Software Engineer",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: "Profession cannot exceed 100 characters" })
  profession?: string;

  @ApiProperty({
    description: "Rating given (1-5)",
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty({ message: "Rating is required" })
  @IsNumber()
  @Min(1, { message: "Rating must be at least 1" })
  @Max(5, { message: "Rating cannot exceed 5" })
  rating: number;

  @ApiProperty({
    description: "Testimonial content",
    example:
      "The service was excellent! The food was fresh and delicious. Will definitely order again.",
  })
  @IsNotEmpty({ message: "Testimonial content is required" })
  @IsString()
  @MaxLength(1000, { message: "Testimonial cannot exceed 1000 characters" })
  testimonial: string;

  @ApiPropertyOptional({
    description: "URL to user's profile/avatar image",
    example: "https://example.com/images/profile.jpg",
    required: false,
  })
  @IsOptional()
  @IsUrl({ require_tld: false }, { message: "Image URL must be a valid URL" })
  imageUrl?: string;
}

export class TestimonialResponseDto {
  @ApiProperty({
    description: "Unique identifier",
    example: "60d21b4667d0d8992e610c85",
  })
  id: string;

  @ApiProperty({
    description: "Full name of the person providing testimonial",
    example: "Jane Smith",
  })
  name: string;

  @ApiProperty({
    description: "Email of the person providing testimonial",
    example: "jane.smith@example.com",
  })
  email: string;

  @ApiPropertyOptional({
    description: "Profession or title of the person",
    example: "Software Engineer",
  })
  profession?: string;

  @ApiProperty({
    description: "Rating given (1-5)",
    example: 5,
  })
  rating: number;

  @ApiProperty({
    description: "Testimonial content",
    example:
      "The service was excellent! The food was fresh and delicious. Will definitely order again.",
  })
  testimonial: string;

  @ApiPropertyOptional({
    description: "URL to user's profile/avatar image",
    example: "https://example.com/images/profile.jpg",
  })
  imageUrl?: string;

  @ApiProperty({
    description: "Whether the testimonial is approved and visible",
    example: false,
  })
  isApproved: boolean;

  @ApiProperty({
    description: "Whether the testimonial is featured",
    example: false,
  })
  isFeatured: boolean;

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

export class GetTestimonialsQueryDto {
  @ApiPropertyOptional({ description: "Page number", default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: "Items per page", default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ description: "Filter by approval status" })
  @IsOptional()
  isApproved?: boolean;

  @ApiPropertyOptional({ description: "Filter by featured status" })
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: "Search term for filtering testimonials",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ description: "Start date for filtering testimonials" })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: "End date for filtering testimonials" })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    description: "Field to sort testimonials by",
    example: "createdAt",
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: "Sort order (asc or desc)",
    default: "desc",
    enum: ["asc", "desc"],
  })
  @IsOptional()
  @IsString()
  sortOrder?: string;
}

export class GetTestimonialsResponseDto {
  @ApiProperty({ type: [TestimonialResponseDto] })
  items: TestimonialResponseDto[];

  @ApiProperty({ description: "Total number of testimonials" })
  total: number;

  @ApiProperty({ description: "Current page number" })
  page: number;

  @ApiProperty({ description: "Number of items per page" })
  limit: number;

  @ApiProperty({ description: "Total number of pages" })
  pages: number;
}
