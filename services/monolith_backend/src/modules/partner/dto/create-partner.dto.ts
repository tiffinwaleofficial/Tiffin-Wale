import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

// Address DTO
export class AddressDto {
  @ApiProperty({ example: "123 Main Street", description: "Street address" })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ example: "New York", description: "City" })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: "NY", description: "State" })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: "10001", description: "Postal code" })
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty({ example: "USA", description: "Country" })
  @IsNotEmpty()
  @IsString()
  country: string;
}

// Business Hours DTO
export class BusinessHoursDto {
  @ApiProperty({ example: "09:00", description: "Opening time" })
  @IsNotEmpty()
  @IsString()
  open: string;

  @ApiProperty({ example: "22:00", description: "Closing time" })
  @IsNotEmpty()
  @IsString()
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
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  days: string[];
}

// Bank Account DTO
export class BankAccountDto {
  @ApiPropertyOptional({
    example: "John Doe",
    description: "Account holder name",
  })
  @IsOptional()
  @IsString()
  accountHolderName?: string;

  @ApiPropertyOptional({ example: "1234567890", description: "Account number" })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional({ example: "SBIN0001234", description: "IFSC code" })
  @IsOptional()
  @IsString()
  ifscCode?: string;

  @ApiPropertyOptional({
    example: "State Bank of India",
    description: "Bank name",
  })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: "Main Branch", description: "Branch name" })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({
    example: "Savings",
    description: "Account type (Savings/Current)",
  })
  @IsOptional()
  @IsString()
  accountType?: string;

  @ApiPropertyOptional({ example: "name@upi", description: "UPI ID" })
  @IsOptional()
  @IsString()
  upiId?: string;

  @ApiPropertyOptional({ example: "ABCDE1234F", description: "PAN number" })
  @IsOptional()
  @IsString()
  panNumber?: string;
}

// Documents DTO
export class DocumentsDto {
  @ApiPropertyOptional({
    description: "License documents URLs",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  licenseDocuments?: string[];

  @ApiPropertyOptional({
    description: "Certification documents URLs",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certificationDocuments?: string[];

  @ApiPropertyOptional({
    description: "Identity documents URLs",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  identityDocuments?: string[];

  @ApiPropertyOptional({
    description: "Other documents URLs",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  otherDocuments?: string[];
}

// Social Media DTO
export class SocialMediaDto {
  @ApiPropertyOptional({
    example: "https://instagram.com/restaurant",
    description: "Instagram URL",
  })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({
    example: "https://facebook.com/restaurant",
    description: "Facebook URL",
  })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional({
    example: "https://twitter.com/restaurant",
    description: "Twitter URL",
  })
  @IsOptional()
  @IsString()
  twitter?: string;
}

export class CreatePartnerDto {
  @ApiProperty({
    description: "Business name",
    example: "Tasty Bites Restaurant",
  })
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @ApiProperty({
    description: "Business types",
    type: [String],
    example: ["restaurant", "cloud_kitchen"],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  businessType: string[];

  @ApiProperty({
    description: "Business description",
    example: "Delicious home-cooked meals with authentic flavors",
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: "Cuisine types offered",
    type: [String],
    example: ["Indian", "Chinese", "Continental"],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  cuisineTypes: string[];

  // Address
  @ApiProperty({ description: "Business address" })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  // Business Hours
  @ApiProperty({ description: "Business operating hours" })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BusinessHoursDto)
  businessHours: BusinessHoursDto;

  // Contact Information
  @ApiPropertyOptional({
    example: "contact@restaurant.com",
    description: "Contact email",
  })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ example: "+1234567890", description: "Contact phone" })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    example: "+1234567890",
    description: "WhatsApp number",
  })
  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  // Business Details
  @ApiPropertyOptional({ example: "GST123456789", description: "GST number" })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiPropertyOptional({
    example: "LIC123456789",
    description: "License number",
  })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: 2010, description: "Year established" })
  @IsOptional()
  @IsNumber()
  establishedYear?: number;

  // Delivery Information
  @ApiPropertyOptional({
    example: 5,
    description: "Delivery radius in km",
    default: 5,
  })
  @IsOptional()
  @IsNumber()
  deliveryRadius?: number;

  @ApiPropertyOptional({
    example: 100,
    description: "Minimum order amount",
    default: 100,
  })
  @IsOptional()
  @IsNumber()
  minimumOrderAmount?: number;

  @ApiPropertyOptional({ example: 0, description: "Delivery fee", default: 0 })
  @IsOptional()
  @IsNumber()
  deliveryFee?: number;

  @ApiPropertyOptional({
    example: 30,
    description: "Estimated delivery time in minutes",
    default: 30,
  })
  @IsOptional()
  @IsNumber()
  estimatedDeliveryTime?: number;

  // Financial Information
  @ApiPropertyOptional({
    example: 20,
    description: "Commission rate percentage",
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  commissionRate?: number;

  // Branding
  @ApiPropertyOptional({
    example: "https://cloudinary.com/logo.jpg",
    description: "Logo URL",
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: "https://cloudinary.com/banner.jpg",
    description: "Banner URL",
  })
  @IsOptional()
  @IsString()
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
  @IsBoolean()
  isVegetarian?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Has delivery service",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  hasDelivery?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Has pickup service",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  hasPickup?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Accepts cash payments",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  acceptsCash?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Accepts card payments",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  acceptsCard?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: "Accepts UPI payments",
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  acceptsUPI?: boolean;

  // Bank Account
  @ApiPropertyOptional({ description: "Bank account details" })
  @IsOptional()
  @ValidateNested()
  @Type(() => BankAccountDto)
  bankAccount?: BankAccountDto;

  // Documents
  @ApiPropertyOptional({ description: "Business documents" })
  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentsDto)
  documents?: DocumentsDto;

  @ApiProperty({
    description: "Whether the partner is accepting orders",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAcceptingOrders?: boolean;

  @ApiProperty({
    description: "Whether the partner is featured",
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    description: "Average rating",
    example: 4.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  averageRating?: number;

  @ApiProperty({
    description: "Total review count",
    example: 150,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalReviews?: number;
}
