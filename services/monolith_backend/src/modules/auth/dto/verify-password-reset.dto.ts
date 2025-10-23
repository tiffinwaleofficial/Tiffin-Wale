import { IsString, IsNotEmpty, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyPasswordResetDto {
  @ApiProperty({
    description:
      "Password reset token received in email (64-character hexadecimal string)",
    example: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    minLength: 64,
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description:
      "New password - must be at least 8 characters with uppercase, lowercase, number, and special character",
    examples: {
      strong: {
        value: "MyNewPassword123!",
        description: "Strong password with all required character types",
      },
      secure: {
        value: "SecurePass2024@",
        description: "Another example of a secure password",
      },
    },
    example: "MyNewPassword123!",
    minLength: 8,
    pattern:
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]",
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  newPassword: string;

  @ApiProperty({
    description:
      "Confirm new password - must match the newPassword field exactly",
    example: "MyNewPassword123!",
  })
  @IsString()
  confirmPassword: string;
}
