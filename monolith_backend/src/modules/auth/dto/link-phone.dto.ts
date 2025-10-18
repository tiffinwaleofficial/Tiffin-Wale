import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches, IsEmail } from "class-validator";

export class LinkPhoneDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email address of existing user",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    example: "password123",
    description: "Current password for verification",
  })
  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @ApiProperty({
    example: "9876543210",
    description: "Phone number to link (10 digits without country code)",
  })
  @IsString({ message: "Phone number must be a string" })
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^[0-9]{10}$/, {
    message: "Phone number must be exactly 10 digits",
  })
  phoneNumber: string;

  @ApiProperty({
    example: "firebase_uid_12345",
    description: "Firebase UID from phone authentication",
  })
  @IsString({ message: "Firebase UID must be a string" })
  @IsNotEmpty({ message: "Firebase UID is required" })
  firebaseUid: string;
}










