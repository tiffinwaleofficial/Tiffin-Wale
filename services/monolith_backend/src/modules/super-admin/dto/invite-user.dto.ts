import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from "class-validator";
import { UserRole } from "../../../common/interfaces/user.interface";

export class InviteUserDto {
  @ApiProperty({ example: "admin@example.com", description: "Email address" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.ADMIN,
    description: "User role",
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiPropertyOptional({
    example: ["read", "write"],
    description: "User permissions",
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];

  @ApiPropertyOptional({ example: "John Doe", description: "Full name" })
  @IsString()
  @IsOptional()
  name?: string;
}

