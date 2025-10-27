import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber } from "class-validator";

export class AcceptOrderDto {
  @ApiProperty({
    description: "Estimated preparation time in minutes",
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  estimatedTime?: number;

  @ApiProperty({
    description: "Additional message for the customer",
    example: "Your order will be ready in 30 minutes",
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
