import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsEnum,
  IsOptional,
} from "class-validator";
import { UserRole } from "../../../common/interfaces/user.interface";

export class CheckPhoneDto {
  @ApiProperty({
    example: "9876543210",
    description: "Phone number to check (10 digits without country code)",
  })
  @IsString({ message: "Phone number must be a string" })
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^[0-9]{10}$/, {
    message: "Phone number must be exactly 10 digits",
  })
  phoneNumber: string;

  @ApiProperty({
    example: "customer",
    description: "Role to check for (customer or partner)",
    enum: [UserRole.CUSTOMER, UserRole.PARTNER],
    required: true,
  })
  @IsNotEmpty({ message: "Role is required" })
  @IsEnum([UserRole.CUSTOMER, UserRole.PARTNER], {
    message: "Role must be either 'customer' or 'partner'",
  })
  role: UserRole.CUSTOMER | UserRole.PARTNER;
}
