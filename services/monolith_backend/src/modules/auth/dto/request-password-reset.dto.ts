import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RequestPasswordResetDto {
  @ApiProperty({
    description:
      "User identifier - can be email, phone number, or username (firstName lastName)",
    examples: {
      email: {
        value: "john.doe@example.com",
        description: "Email address",
      },
      phone: {
        value: "+1234567890",
        description: "Phone number with country code",
      },
      username: {
        value: "John Doe",
        description: "Full name (firstName lastName)",
      },
    },
    example: "john.doe@example.com",
  })
  @IsString()
  @IsNotEmpty()
  identifier: string; // email, username, or phone

  @ApiProperty({
    description: "User role to determine which frontend app to redirect to",
    enum: ["customer", "business_partner"],
    examples: {
      customer: {
        value: "customer",
        description: "Student/Customer user - redirects to Student App",
      },
      partner: {
        value: "business_partner",
        description: "Restaurant/Business partner - redirects to Partner App",
      },
    },
    example: "customer",
  })
  @IsEnum(["customer", "business_partner"])
  @IsNotEmpty()
  role: "customer" | "business_partner";
}
