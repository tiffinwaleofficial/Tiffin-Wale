import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateContactDto {
  @ApiProperty({
    description: "Full name of the contact",
    example: "John Doe",
  })
  @IsNotEmpty({ message: "Name is required" })
  @IsString()
  @Length(2, 100, { message: "Name must be between 2 and 100 characters" })
  name: string;

  @ApiProperty({
    description: "Email address",
    example: "john.doe@example.com",
  })
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @ApiProperty({
    description: "Phone number (optional)",
    example: "+919876543210",
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: "Subject of the inquiry (optional)",
    example: "Partnership Inquiry",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100, { message: "Subject must be between 2 and 100 characters" })
  subject?: string;

  @ApiProperty({
    description: "Contact message/inquiry",
    example: "I'm interested in becoming a delivery partner for TiffinMate.",
  })
  @IsNotEmpty({ message: "Message is required" })
  @IsString()
  @Length(10, 1000, {
    message: "Message must be between 10 and 1000 characters",
  })
  message: string;

  @ApiProperty({
    description: "Where the contact came from",
    example: "website",
    required: false,
  })
  @IsOptional()
  @IsString()
  source?: string;
}

export class ContactResponseDto {
  @ApiProperty({
    description: "Unique identifier",
    example: "60d21b4667d0d8992e610c87",
  })
  id: string;

  @ApiProperty({
    description: "Full name of the contact",
    example: "John Doe",
  })
  name: string;

  @ApiProperty({
    description: "Email address",
    example: "john.doe@example.com",
  })
  email: string;

  @ApiProperty({
    description: "Phone number (optional)",
    example: "+919876543210",
  })
  phoneNumber?: string;

  @ApiProperty({
    description: "Subject of the inquiry (optional)",
    example: "Partnership Inquiry",
  })
  subject?: string;

  @ApiProperty({
    description: "Contact message/inquiry",
    example: "I'm interested in becoming a delivery partner for TiffinMate.",
  })
  message: string;

  @ApiProperty({
    description: "Where the contact came from",
    example: "website",
  })
  source?: string;

  @ApiProperty({
    description: "Status of the contact",
    example: "new",
  })
  status: string;

  @ApiProperty({
    description: "Whether the inquiry has been resolved",
    example: false,
  })
  isResolved: boolean;

  @ApiProperty({
    description: "Timestamp of contact submission",
    example: "2023-06-03T10:15:30.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Timestamp of last update",
    example: "2023-06-03T10:15:30.000Z",
  })
  updatedAt: Date;
}
