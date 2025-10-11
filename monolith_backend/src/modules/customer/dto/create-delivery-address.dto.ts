import { IsNotEmpty, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDeliveryAddressDto {
  @ApiProperty({
    description: "Full address",
    example: "123 Main Street, Apt 4B",
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: "City",
    example: "New York",
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: "State",
    example: "NY",
  })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({
    description: "ZIP code",
    example: "10001",
  })
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @ApiProperty({
    description: "Country",
    example: "USA",
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: "Landmark or additional instructions",
    example: "Near Central Park",
    required: false,
  })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiProperty({
    description: "Contact phone number for delivery",
    example: "+1234567890",
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: "Whether this is the default address",
    example: false,
    required: false,
  })
  @IsOptional()
  isDefault?: boolean;
}
