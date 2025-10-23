import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsOptional, IsString, IsDate, IsNumber } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: "Password reset token (hashed)" })
  @IsString()
  @IsOptional()
  passwordResetToken?: string;

  @ApiPropertyOptional({ description: "Password reset token expiry date" })
  @IsDate()
  @IsOptional()
  passwordResetExpires?: Date;

  @ApiPropertyOptional({ description: "Number of password reset attempts" })
  @IsNumber()
  @IsOptional()
  passwordResetAttempts?: number;

  @ApiPropertyOptional({ description: "Last password reset request timestamp" })
  @IsDate()
  @IsOptional()
  lastPasswordResetRequest?: Date;
}
