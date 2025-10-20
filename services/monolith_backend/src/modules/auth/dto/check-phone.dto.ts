import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsEnum,
} from "class-validator";

export class CheckPhoneDto {
  @ApiProperty({
    example: "9876543210",
    description: "Phone number to check (10 digits without country code)",
  })
  @IsString({ message: "Phone number must be a string" })
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^[0-9]{10}$/, {
    message: "Phone number must be exactly 10 digits",
  })
  phoneNumber: string;

  @ApiProperty({
    example: "customer",
    description: "Role to check for (customer or business)",
    enum: ["customer", "business"],
    required: false,
  })
  @IsOptional()
  @IsEnum(["customer", "business"], {
    message: "Role must be either 'customer' or 'business'",
  })
  role?: "customer" | "business";
}
