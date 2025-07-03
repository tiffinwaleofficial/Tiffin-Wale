import { PartialType } from "@nestjs/mapped-types";
import { CreateSubscriptionDto } from "./create-subscription.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  @ApiProperty({
    description: "Reason for cancellation if subscription is cancelled",
    example: "Moving to a different city",
    required: false,
  })
  @IsString()
  @IsOptional()
  cancellationReason?: string;
}
