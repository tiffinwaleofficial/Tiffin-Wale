import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  IsArray,
  IsBoolean,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { UserRole } from "../../../common/interfaces/user.interface";

// Address DTO
export class AddressDto {
  @ApiProperty({ example: "123 Main Street", description: "Street address" })
  @IsNotEmpty({ message: "Street address is required" })
  @IsString({ message: "Street address must be a string" })
  @MaxLength(255, { message: "Street address is too long" })
  street: string;

  @ApiProperty({ example: "New York", description: "City" })
  @IsNotEmpty({ message: "City is required" })
  @IsString({ message: "City must be a string" })
  @MaxLength(100, { message: "City is too long" })
  city: string;

  @ApiProperty({ example: "NY", description: "State" })
  @IsNotEmpty({ message: "State is required" })
  @IsString({ message: "State must be a string" })
  @MaxLength(100, { message: "State is too long" })
  state: string;

  @ApiProperty({ example: "10001", description: "Postal code" })
  @IsNotEmpty({ message: "Postal code is required" })
  @IsString({ message: "Postal code must be a string" })
  @MaxLength(20, { message: "Postal code is too long" })
  postalCode: string;

  @ApiProperty({ example: "USA", description: "Country" })
  @IsNotEmpty({ message: "Country is required" })
  @IsString({ message: "Country must be a string" })
  @MaxLength(100, { message: "Country is too long" })
  country: string;
}

// Business Hours DTO
export class BusinessHoursDto {
  @ApiProperty({ example: "09:00", description: "Opening time" })
  @IsNotEmpty({ message: "Opening time is required" })
  @IsString({ message: "Opening time must be a string" })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Opening time must be in HH:MM format",
  })
  open: string;

  @ApiProperty({ example: "22:00", description: "Closing time" })
  @IsNotEmpty({ message: "Closing time is required" })
  @IsString({ message: "Closing time must be a string" })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Closing time must be in HH:MM format",
  })
  close: string;

  @ApiProperty({
    example: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    description: "Operating days",
    type: [String],
  })
  @IsNotEmpty({ message: "Operating days are required" })
  @IsArray({ message: "Operating days must be an array" })
  @IsString({ each: true, message: "Each day must be a string" })
  days: string[];
}

// Documents DTO
export class DocumentsDto {
  @ApiPropertyOptional({
    description: "License documents URLs",
    type: [String],
    example: [
      "https://cloudinary.com/license1.jpg",
      "https://cloudinary.com/license2.pdf",
    ],
  })
  @IsOptional()
  @IsArray({ message: "License documents must be an array" })
  @IsString({
    each: true,
    message: "Each license document URL must be a string",
  })
  licenseDocuments?: string[];

  @ApiPropertyOptional({
    description: "Certification documents URLs",
    type: [String],
    example: [
      "https://cloudinary.com/cert1.jpg",
      "https://cloudinary.com/cert2.pdf",
    ],
  })
  @IsOptional()
  @IsArray({ message: "Certification documents must be an array" })
  @IsString({
    each: true,
    message: "Each certification document URL must be a string",
  })
  certificationDocuments?: string[];

  @ApiPropertyOptional({
    description: "Identity documents URLs",
    type: [String],
    example: [
      "https://cloudinary.com/id1.jpg",
      "https://cloudinary.com/id2.pdf",
    ],
  })
  @IsOptional()
  @IsArray({ message: "Identity documents must be an array" })
  @IsString({
    each: true,
    message: "Each identity document URL must be a string",
  })
  identityDocuments?: string[];

  @ApiPropertyOptional({
    description: "Other documents URLs",
    type: [String],
    example: [
      "https://cloudinary.com/other1.jpg",
      "https://cloudinary.com/other2.pdf",
    ],
  })
  @IsOptional()
  @IsArray({ message: "Other documents must be an array" })
  @IsString({ each: true, message: "Each other document URL must be a string" })
  otherDocuments?: string[];
}

// Social Media DTO
export class SocialMediaDto {
  @ApiPropertyOptional({
    example: "https://instagram.com/restaurant",
    description: "Instagram URL",
  })
  @IsOptional()
  @IsString({ message: "Instagram URL must be a string" })
  @MaxLength(255, { message: "Instagram URL is too long" })
  instagram?: string;

  @ApiPropertyOptional({
    example: "https://facebook.com/restaurant",
    description: "Facebook URL",
  })
  @IsOptional()
  @IsString({ message: "Facebook URL must be a string" })
  @MaxLength(255, { message: "Facebook URL is too long" })
  facebook?: string;

  @ApiPropertyOptional({
    example: "https://twitter.com/restaurant",
    description: "Twitter URL",
  })
  @IsOptional()
  @IsString({ message: "Twitter URL must be a string" })
  @MaxLength(255, { message: "Twitter URL is too long" })
  twitter?: string;
}

export class RegisterPartnerDto {
  // Basic User Info (from RegisterDto)
  @ApiProperty({ example: "partner@example.com", description: "Email address" })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  @MaxLength(255, { message: "Email is too long" })
  email: string;

  @ApiProperty({
    example: "Password123!",
    description:
      "Password (min 8 characters, must include uppercase, lowercase, number, and special character)",
  })
  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  )
  password: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.PARTNER,
    description: "User role",
  })
  @IsEnum(UserRole, { message: "Invalid user role" })
  @IsNotEmpty({ message: "Role is required" })
  role: UserRole;

  @ApiProperty({ example: "John", description: "First name" })
  @IsString({ message: "First name must be a string" })
  @IsNotEmpty({ message: "First name is required" })
  @MaxLength(50, { message: "First name is too long" })
  firstName: string;

  @ApiProperty({ example: "Doe", description: "Last name" })
  @IsString({ message: "Last name must be a string" })
  @IsNotEmpty({ message: "Last name is required" })
  @MaxLength(50, { message: "Last name is too long" })
  lastName: string;

  @ApiProperty({ example: "1234567890", description: "Phone number" })
  @IsString({ message: "Phone number must be a string" })
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^[0-9]{10,15}$/, {
    message: "Phone number must be between 10-15 digits",
  })
  phoneNumber: string;

  // Business Information
  @ApiProperty({
    example: "Tasty Bites Restaurant",
    description: "Business name",
  })
  @IsNotEmpty({ message: "Business name is required" })
  @IsString({ message: "Business name must be a string" })
  @MaxLength(255, { message: "Business name is too long" })
  businessName: string;

  @ApiProperty({
    example: ["restaurant", "cloud_kitchen"],
    description: "Business types",
    type: [String],
  })
  @IsNotEmpty({ message: "Business type is required" })
  @IsArray({ message: "Business type must be an array" })
  @IsString({ each: true, message: "Each business type must be a string" })
  businessType: string[];

  @ApiProperty({
    example: "Delicious home-cooked meals with authentic flavors",
    description: "Business description",
  })
  @IsNotEmpty({ message: "Business description is required" })
  @IsString({ message: "Business description must be a string" })
  @MaxLength(1000, { message: "Business description is too long" })
  description: string;

  @ApiProperty({
    example: ["Indian", "Chinese", "Continental"],
    description: "Cuisine types offered",
    type: [String],
  })
  @IsNotEmpty({ message: "Cuisine types are required" })
  @IsArray({ message: "Cuisine types must be an array" })
  @IsString({ each: true, message: "Each cuisine type must be a string" })
  cuisineTypes: string[];

  // Address
  @ApiProperty({ description: "Business address" })
  @IsNotEmpty({ message: "Address is required" })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  // Business Hours
  @ApiProperty({ description: "Business operating hours" })
  @IsNotEmpty({ message: "Business hours are required" })
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  businessHours: BusinessHoursDto;

  // Contact Information
  @ApiPropertyOptional({
    example: "contact@restaurant.com",
    description: "Contact email",
  })
  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid contact email address" })
  @MaxLength(255, { message: "Contact email is too long" })
  contactEmail?: string;

  @ApiPropertyOptional({ example: "+1234567890", description: "Contact phone" })
  @IsOptional()
  @IsString({ message: "Contact phone must be a string" })
  @Matches(/^[0-9+]{10,15}$/, {
    message:
      "Contact phone must be between 10-15 digits with optional + prefix",
  })
  contactPhone?: string;

  @ApiPropertyOptional({
    example: "+1234567890",
    description: "WhatsApp number",
  })
  @IsOptional()
  @IsString({ message: "WhatsApp number must be a string" })
  @Matches(/^[0-9+]{10,15}$/, {
    message:
      "WhatsApp number must be between 10-15 digits with optional + prefix",
  })
  whatsappNumber?: string;

  // Business Details
  @ApiPropertyOptional({ example: "GST123456789", description: "GST number" })
  @IsOptional()
  @IsString({ message: "GST number must be a string" })
  @MaxLength(50, { message: "GST number is too long" })
  gstNumber?: string;

  @ApiPropertyOptional({
    example: "LIC123456789",
    description: "License number",
  })
  @IsOptional()
  @IsString({ message: "License number must be a string" })
  @MaxLength(50, { message: "License number is too long" })
  licenseNumber?: string;

  @ApiPropertyOptional({ example: 2010, description: "Year established" })
  @IsOptional()
  @IsNumber({}, { message: "Established year must be a number" })
  establishedYear?: number;

  // Delivery Information
  @ApiPropertyOptional({
    example: 5,
    description: "Delivery radius in km",
    default: 5,
  })
  @IsOptional()
  @IsNumber({}, { message: "Delivery radius must be a number" })
  deliveryRadius?: number;

  @ApiPropertyOptional({
    example: 100,
    description: "Minimum order amount",
    default: 100,
  })
  @IsOptional()
  @IsNumber({}, { message: "Minimum order amount must be a number" })
  minimumOrderAmount?: number;

  @ApiPropertyOptional({ example: 0, description: "Delivery fee", default: 0 })
  @IsOptional()
  @IsNumber({}, { message: "Delivery fee must be a number" })
  deliveryFee?: number;

  @ApiPropertyOptional({
    example: 30,
    description: "Estimated delivery time in minutes",
    default: 30,
  })
  @IsOptional()
  @IsNumber({}, { message: "Estimated delivery time must be a number" })
  estimatedDeliveryTime?: number;

  // Financial Information
  @ApiPropertyOptional({
    example: 20,
    description: "Commission rate percentage",
    default: 20,
  })
  @IsOptional()
  @IsNumber({}, { message: "Commission rate must be a number" })
  commissionRate?: number;

  // Branding
  @ApiPropertyOptional({
    example: "https://cloudinary.com/logo.jpg",
    description: "Logo URL",
  })
  @IsOptional()
  @IsString({ message: "Logo URL must be a string" })
  @MaxLength(500, { message: "Logo URL is too long" })
  logoUrl?: string;

  @ApiPropertyOptional({
    example: "https://cloudinary.com/banner.jpg",
    description: "Banner URL",
  })
  @IsOptional()
  @IsString({ message: "Banner URL must be a string" })
  @MaxLength(500, { message: "Banner URL is too long" })
  bannerUrl?: string;

  // Social Media
  @ApiPropertyOptional({ description: "Social media links" })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto;

  // Operational Settings
  @ApiPropertyOptional({
    example: false,
    description: "Is vegetarian only",
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: "Is vegetarian must be a boolean" })
  isVegetarian?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Has delivery service",
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: "Has delivery must be a boolean" })
  hasDelivery?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Has pickup service",
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: "Has pickup must be a boolean" })
  hasPickup?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Accepts cash payments",
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: "Accepts cash must be a boolean" })
  acceptsCash?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Accepts card payments",
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: "Accepts card must be a boolean" })
  acceptsCard?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Accepts UPI payments",
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: "Accepts UPI must be a boolean" })
  acceptsUPI?: boolean;

  // Documents
  @ApiPropertyOptional({ description: "Business documents" })
  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentsDto)
  documents?: DocumentsDto;

  // Marketing Preference
  @ApiPropertyOptional({
    example: false,
    description: "Agree to marketing emails",
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: "Marketing preference must be a boolean" })
  agreeToMarketing?: boolean;
}
