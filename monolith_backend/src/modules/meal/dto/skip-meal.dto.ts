import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SkipMealDto {
  @ApiProperty({
    description: "Reason for skipping the meal",
    example: "I will be out of town",
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
