import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsNotEmpty,
  Min,
  Max,
  IsEnum,
  ArrayMinSize,
  ArrayMaxSize,
} from "class-validator";

export class AddressDto {
  @ApiProperty({
    description: 'Name label for the address (e.g., "Home", "Work")',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Street address" })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: "City" })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: "State/province" })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: "Postal/ZIP code" })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ description: "Country" })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({
    description: "Whether this is the default delivery address",
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class CreateCustomerProfileDto {
  @ApiProperty({ description: "Customer's city of residence" })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ description: "Customer's college/university name" })
  @IsString()
  @IsOptional()
  college?: string;

  @ApiPropertyOptional({ description: "Field of study/department" })
  @IsString()
  @IsOptional()
  branch?: string;

  @ApiPropertyOptional({
    description: "Expected/actual graduation year",
    minimum: 2000,
    maximum: 2100,
  })
  @IsNumber()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  graduationYear?: number;

  @ApiPropertyOptional({
    description: "Dietary preferences (e.g., vegetarian, vegan, etc.)",
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dietaryPreferences?: string[];

  @ApiPropertyOptional({
    description: "Favorite cuisine types",
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  favoriteCuisines?: string[];

  @ApiPropertyOptional({
    description: "Preferred payment methods",
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredPaymentMethods?: string[];

  @ApiPropertyOptional({
    description: "Delivery addresses",
    type: [AddressDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @IsOptional()
  deliveryAddresses?: AddressDto[];
}

export class UpdateCustomerProfileDto {
  @ApiPropertyOptional({ description: "Customer's city of residence" })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: "Customer's college/university name" })
  @IsString()
  @IsOptional()
  college?: string;

  @ApiPropertyOptional({ description: "Field of study/department" })
  @IsString()
  @IsOptional()
  branch?: string;

  @ApiPropertyOptional({
    description: "Expected/actual graduation year",
    minimum: 2000,
    maximum: 2100,
  })
  @IsNumber()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  graduationYear?: number;

  @ApiPropertyOptional({
    description: "Dietary preferences (e.g., vegetarian, vegan, etc.)",
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dietaryPreferences?: string[];

  @ApiPropertyOptional({
    description: "Favorite cuisine types",
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  favoriteCuisines?: string[];

  @ApiPropertyOptional({
    description: "Preferred payment methods",
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredPaymentMethods?: string[];

  @ApiPropertyOptional({
    description: "Delivery addresses",
    type: [AddressDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  @IsOptional()
  deliveryAddresses?: AddressDto[];
}

export class AddressResponseDto extends AddressDto {
  @ApiProperty({ description: "Unique identifier for this address" })
  id: string;
}

export class CustomerProfileResponseDto {
  @ApiProperty({ description: "Unique identifier for this profile" })
  id: string;

  @ApiProperty({ description: "Reference to the user ID" })
  user: string;

  @ApiProperty({ description: "Customer's city of residence" })
  city: string;

  @ApiPropertyOptional({ description: "Customer's college/university name" })
  college?: string;

  @ApiPropertyOptional({ description: "Field of study/department" })
  branch?: string;

  @ApiPropertyOptional({ description: "Expected/actual graduation year" })
  graduationYear?: number;

  @ApiProperty({
    description: "Dietary preferences (e.g., vegetarian, vegan, etc.)",
  })
  dietaryPreferences: string[];

  @ApiProperty({ description: "Favorite cuisine types" })
  favoriteCuisines: string[];

  @ApiProperty({ description: "Preferred payment methods" })
  preferredPaymentMethods: string[];

  @ApiProperty({ description: "Delivery addresses" })
  deliveryAddresses: AddressResponseDto[];

  @ApiProperty({ description: "Timestamp of profile creation" })
  createdAt: Date;

  @ApiProperty({ description: "Timestamp of last update" })
  updatedAt: Date;
}

export class CustomerListResponseDto {
  @ApiProperty({
    description: "List of customer profiles",
    type: [CustomerProfileResponseDto],
  })
  customers: CustomerProfileResponseDto[];

  @ApiProperty({
    description: "Total number of profiles matching the criteria",
  })
  total: number;

  @ApiProperty({ description: "Current page number" })
  page: number;

  @ApiProperty({ description: "Number of items per page" })
  limit: number;
}

export class CustomerStatisticsDto {
  @ApiProperty({ description: "Total number of customers" })
  totalCustomers: number;

  @ApiProperty({ description: "Number of active customers" })
  activeCustomers: number;

  @ApiProperty({ description: "Customers grouped by city", type: Object })
  customersByCity: Record<string, number>;

  @ApiProperty({ description: "Customers grouped by college", type: Object })
  customersByCollege: Record<string, number>;

  @ApiProperty({
    description: "Customers grouped by graduation year",
    type: Object,
  })
  customersByGraduationYear: Record<string, number>;

  @ApiProperty({
    description: "Breakdown of dietary preferences",
    type: Object,
  })
  dietaryPreferences: Record<string, number>;

  @ApiProperty({ description: "Breakdown of favorite cuisines", type: Object })
  favoriteCuisines: Record<string, number>;
}
