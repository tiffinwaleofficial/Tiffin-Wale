import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ example: "OldPassword123!", description: "Current password" })
  @IsString({ message: "Current password must be a string" })
  @IsNotEmpty({ message: "Current password is required" })
  oldPassword: string;

  @ApiProperty({
    example: "NewPassword123!",
    description:
      "New password (min 8 characters, must include uppercase, lowercase, number, and special character)",
  })
  @IsString({ message: "New password must be a string" })
  @IsNotEmpty({ message: "New password is required" })
  @MinLength(8, { message: "New password must be at least 8 characters long" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  )
  newPassword: string;
}
