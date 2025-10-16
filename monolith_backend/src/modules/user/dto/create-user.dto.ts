import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { UserRole } from "../../../common/interfaces/user.interface";

export class CreateUserDto {
  @ApiProperty({ example: "user@example.com", description: "Email address" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: "Password123", description: "User password" })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.CUSTOMER,
    description: "User role",
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiPropertyOptional({ example: "John", description: "First name" })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: "Doe", description: "Last name" })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: "1234567890", description: "Phone number" })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: "https://example.com/profile.jpg",
    description: "Profile image URL",
  })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional({
    example: "firebase_uid_123",
    description: "Firebase UID for phone authentication",
  })
  @IsString()
  @IsOptional()
  firebaseUid?: string;
}
