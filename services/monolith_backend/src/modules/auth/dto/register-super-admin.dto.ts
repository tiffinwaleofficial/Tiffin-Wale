import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from "class-validator";

export class RegisterSuperAdminDto {
  @ApiProperty({ example: "admin@tiffinwale.com", description: "Email address" })
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

  @ApiPropertyOptional({ example: "John", description: "First name" })
  @IsString({ message: "First name must be a string" })
  @IsOptional()
  @MaxLength(50, { message: "First name is too long" })
  firstName?: string;

  @ApiPropertyOptional({ example: "Doe", description: "Last name" })
  @IsString({ message: "Last name must be a string" })
  @IsOptional()
  @MaxLength(50, { message: "Last name is too long" })
  lastName?: string;

  @ApiPropertyOptional({ example: "1234567890", description: "Phone number" })
  @IsString({ message: "Phone number must be a string" })
  @IsOptional()
  @Matches(/^[0-9]{10,15}$/, {
    message: "Phone number must be between 10-15 digits",
  })
  phoneNumber?: string;
}

