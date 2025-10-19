import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  ValidateNested,
  Matches,
} from "class-validator";
import { Type } from "class-transformer";

class AddressDto {
  @ApiProperty({
    example: "123 Main Street, Apt 4B",
    description: "Street address",
  })
  @IsString({ message: "Street must be a string" })
  @IsNotEmpty({ message: "Street is required" })
  street: string;

  @ApiProperty({ example: "Downtown", description: "Area or locality" })
  @IsString({ message: "Area must be a string" })
  @IsNotEmpty({ message: "Area is required" })
  area: string;

  @ApiProperty({ example: "Mumbai", description: "City" })
  @IsString({ message: "City must be a string" })
  @IsNotEmpty({ message: "City is required" })
  city: string;

  @ApiProperty({ example: "400001", description: "Pincode" })
  @IsString({ message: "Pincode must be a string" })
  @IsNotEmpty({ message: "Pincode is required" })
  @Matches(/^\d{6}$/, { message: "Pincode must be a 6-digit number" })
  pincode: string;

  @ApiProperty({
    example: { latitude: 19.076, longitude: 72.8777 },
    description: "GPS coordinates",
    required: false,
  })
  @IsOptional()
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export class RegisterCustomerDto {
  // Personal Information
  @ApiProperty({ example: "John", description: "First name" })
  @IsString({ message: "First name must be a string" })
  @IsNotEmpty({ message: "First name is required" })
  firstName: string;

  @ApiProperty({ example: "Doe", description: "Last name" })
  @IsString({ message: "Last name must be a string" })
  @IsNotEmpty({ message: "Last name is required" })
  lastName: string;

  @ApiProperty({
    example: "john.doe@example.com",
    description: "Email address",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    example: "9876543210",
    description: "Phone number (verified)",
  })
  @IsString({ message: "Phone number must be a string" })
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^[0-9]{10,15}$/, {
    message: "Phone number must be between 10-15 digits",
  })
  phoneNumber: string;

  // Food Preferences
  @ApiProperty({
    example: ["North Indian", "Chinese", "Italian"],
    description: "Preferred cuisine types",
  })
  @IsArray({ message: "Cuisine preferences must be an array" })
  @IsString({ each: true, message: "Each cuisine preference must be a string" })
  @IsNotEmpty({ message: "At least one cuisine preference is required" })
  cuisinePreferences: string[];

  @ApiProperty({
    example: "vegetarian",
    description: "Dietary type",
    enum: ["vegetarian", "non-vegetarian", "vegan", "jain"],
  })
  @IsEnum(["vegetarian", "non-vegetarian", "vegan", "jain"], {
    message:
      "Dietary type must be one of: vegetarian, non-vegetarian, vegan, jain",
  })
  @IsNotEmpty({ message: "Dietary type is required" })
  dietaryType: "vegetarian" | "non-vegetarian" | "vegan" | "jain";

  @ApiProperty({
    example: 3,
    description: "Spice level preference (1-5 scale)",
    minimum: 1,
    maximum: 5,
  })
  @IsNumber({}, { message: "Spice level must be a number" })
  @Min(1, { message: "Spice level must be at least 1" })
  @Max(5, { message: "Spice level must be at most 5" })
  spiceLevel: number;

  @ApiProperty({
    example: ["Nuts", "Dairy"],
    description: "Food allergies",
    required: false,
  })
  @IsOptional()
  @IsArray({ message: "Allergies must be an array" })
  @IsString({ each: true, message: "Each allergy must be a string" })
  allergies?: string[];

  // Delivery Location
  @ApiProperty({ description: "Delivery address" })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty({ message: "Address is required" })
  address: AddressDto;

  @ApiProperty({
    example: "home",
    description: "Address type",
    enum: ["home", "hostel", "pg", "office"],
  })
  @IsEnum(["home", "hostel", "pg", "office"], {
    message: "Address type must be one of: home, hostel, pg, office",
  })
  @IsNotEmpty({ message: "Address type is required" })
  addressType: "home" | "hostel" | "pg" | "office";

  @ApiProperty({
    example: "Ring the bell twice, Gate 2",
    description: "Delivery instructions",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Delivery instructions must be a string" })
  deliveryInstructions?: string;

  // Role (automatically set to customer)
  @ApiProperty({ example: "customer", description: "User role" })
  @IsEnum(["customer"], { message: "Role must be customer" })
  role: "customer";
}

