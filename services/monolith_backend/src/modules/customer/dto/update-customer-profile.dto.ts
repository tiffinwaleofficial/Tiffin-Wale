import { IsOptional, IsString, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCustomerProfileDto {
  @ApiProperty({
    description: "First name",
    example: "John",
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: "Last name",
    example: "Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: "Phone number",
    example: "+1234567890",
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: "City",
    example: "New York",
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: "College/University",
    example: "MIT",
    required: false,
  })
  @IsOptional()
  @IsString()
  college?: string;

  @ApiProperty({
    description: "Branch/Department",
    example: "Computer Science",
    required: false,
  })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiProperty({
    description: "Date of birth",
    example: "1995-05-15",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dob?: string;
}
