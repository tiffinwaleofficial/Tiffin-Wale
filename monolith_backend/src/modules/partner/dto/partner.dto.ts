import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsPhoneNumber,
  IsArray,
  IsObject,
  ValidateNested,
  IsUrl,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { UserRole } from "../../../common/interfaces/user.interface";
import { PartnerStatus } from "../schemas/partner.schema";

export class BusinessHoursDto {
  @ApiProperty({ description: "Opening time (HH:MM format)", example: "09:00" })
  @IsString()
  @IsNotEmpty()
  open: string;

  @ApiProperty({ description: "Closing time (HH:MM format)", example: "21:00" })
  @IsString()
  @IsNotEmpty()
  close: string;

  @ApiProperty({
    description: "Days of the week the business is open",
    example: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  })
  @IsArray()
  @IsString({ each: true })
  days: string[];
}

export class WeeklyHoursDto {
  @ApiProperty({ description: "Monday hours" })
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  monday: BusinessHoursDto;

  @ApiProperty({ description: "Tuesday hours" })
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  tuesday: BusinessHoursDto;

  @ApiProperty({ description: "Wednesday hours" })
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  wednesday: BusinessHoursDto;

  @ApiProperty({ description: "Thursday hours" })
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  thursday: BusinessHoursDto;

  @ApiProperty({ description: "Friday hours" })
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  friday: BusinessHoursDto;

  @ApiProperty({ description: "Saturday hours" })
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  saturday: BusinessHoursDto;

  @ApiProperty({ description: "Sunday hours" })
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  sunday: BusinessHoursDto;
}

export class AddressDto {
  @ApiProperty({ description: "Street address" })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: "City" })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: "State or province" })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: "Postal code" })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ description: "Country" })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: "Latitude", example: 40.7128 })
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: "Longitude", example: -74.006 })
  @IsOptional()
  longitude?: number;
}

export class CreatePartnerDto {
  @ApiProperty({ description: "Business email address" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "Account password", minLength: 6, maxLength: 32 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @ApiProperty({ description: "Business name" })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ description: "Business phone number" })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: "Business description" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "Types of cuisine offered",
    example: ["Indian", "Vegetarian"],
  })
  @IsArray()
  @IsString({ each: true })
  cuisineTypes: string[];

  @ApiProperty({ description: "Business address" })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ description: "Business hours" })
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  businessHours: BusinessHoursDto;

  @ApiPropertyOptional({ description: "URL to business logo" })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ description: "URL to business banner image" })
  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @ApiPropertyOptional({
    description: "Whether the partner is currently accepting orders",
  })
  @IsBoolean()
  @IsOptional()
  isAcceptingOrders?: boolean;

  @ApiPropertyOptional({
    description: "Whether the partner should be featured on the platform",
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

export class UpdatePartnerDto {
  @ApiPropertyOptional({ description: "Business email address" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: "Business name" })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiPropertyOptional({ description: "Business phone number" })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: "Business description" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: "Types of cuisine offered",
    example: ["Indian", "Vegetarian"],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cuisineTypes?: string[];

  @ApiPropertyOptional({ description: "Business address" })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @ApiPropertyOptional({ description: "Business hours" })
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  @IsOptional()
  businessHours?: BusinessHoursDto;

  @ApiPropertyOptional({ description: "URL to business logo" })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ description: "URL to business banner image" })
  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @ApiPropertyOptional({
    description: "Whether the partner is currently accepting orders",
  })
  @IsBoolean()
  @IsOptional()
  isAcceptingOrders?: boolean;

  @ApiPropertyOptional({
    description: "Whether the partner should be featured on the platform",
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ description: "Is the business active", example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class PartnerResponseDto {
  @ApiProperty({ description: "Partner ID" })
  id: string;

  @ApiProperty({ description: "Business name" })
  businessName: string;

  @ApiProperty({ description: "Business email address" })
  email: string;

  @ApiProperty({ description: "Business phone number" })
  phoneNumber: string;

  @ApiProperty({ description: "Business description" })
  description: string;

  @ApiProperty({
    description: "Types of cuisine offered",
    example: ["Indian", "Vegetarian"],
  })
  cuisineTypes: string[];

  @ApiProperty({ description: "Business address" })
  address: AddressDto;

  @ApiProperty({ description: "Business hours" })
  businessHours: BusinessHoursDto;

  @ApiProperty({ description: "URL to business logo" })
  logoUrl: string;

  @ApiProperty({ description: "URL to business banner image" })
  bannerUrl: string;

  @ApiProperty({
    description: "Whether the partner is currently accepting orders",
  })
  isAcceptingOrders: boolean;

  @ApiProperty({
    description: "Whether the partner is featured on the platform",
  })
  isFeatured: boolean;

  @ApiProperty({ description: "Whether the partner account is active" })
  isActive: boolean;

  @ApiProperty({ description: "Average customer rating", example: 4.5 })
  averageRating: number;

  @ApiProperty({ description: "Total number of customer reviews", example: 42 })
  totalReviews: number;

  @ApiProperty({ description: "Partner status", enum: PartnerStatus })
  status: string;

  @ApiProperty({ description: "Creation timestamp" })
  createdAt: Date;

  @ApiProperty({ description: "Last update timestamp" })
  updatedAt: Date;
}

export class PartnerStatusUpdateDto {
  @ApiProperty({ description: "Partner status", enum: PartnerStatus })
  @IsEnum(PartnerStatus)
  @IsNotEmpty()
  status: string;
}

export class PartnerListResponseDto {
  @ApiProperty({ description: "List of partners", type: [PartnerResponseDto] })
  partners: PartnerResponseDto[];

  @ApiProperty({ description: "Total number of partners matching the query" })
  total: number;

  @ApiProperty({ description: "Current page number" })
  page: number;

  @ApiProperty({ description: "Number of items per page" })
  limit: number;
}
