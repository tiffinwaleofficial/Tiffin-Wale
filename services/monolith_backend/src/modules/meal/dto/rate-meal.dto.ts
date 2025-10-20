import { IsNumber, IsOptional, IsString, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RateMealDto {
  @ApiProperty({
    description: "Rating for the meal (1-5)",
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: "Review comment for the meal",
    example: "The food was delicious and arrived on time.",
    required: false,
  })
  @IsOptional()
  @IsString()
  review?: string;
}
