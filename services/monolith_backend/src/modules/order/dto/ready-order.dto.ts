import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber } from "class-validator";

export class ReadyOrderDto {
  @ApiProperty({
    description: "Estimated pickup time in minutes from now",
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  estimatedPickupTime?: number;

  @ApiProperty({
    description: "Message for the customer about pickup",
    example: "Your order is ready for pickup at counter 3",
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
