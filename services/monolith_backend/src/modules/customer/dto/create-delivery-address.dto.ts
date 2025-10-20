import { IsNotEmpty, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDeliveryAddressDto {
  @ApiProperty({
    description: "Address line 1",
    example: "123 Main Street, Apt 4B",
  })
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @ApiProperty({
    description: "Address line 2",
    example: "Near Central Park",
    required: false,
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

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
    description: "Postal code",
    example: "10001",
  })
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty({
    description: "Address label",
    example: "Home",
  })
  @IsNotEmpty()
  @IsString()
  label: string;

  // @ApiProperty({
  //   description: "Country",
  //   example: "USA",
  // })
  // @IsNotEmpty()
  // @IsString()
  // country: string;

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
  contactNumber?: string;

  @ApiProperty({
    description: "Whether this is the default address",
    example: false,
    required: false,
  })
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({
    description: "Additional delivery instructions",
    example: "Ring doorbell twice",
    required: false,
  })
  @IsOptional()
  @IsString()
  instructions?: string;
}
