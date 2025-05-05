import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, Min, Max } from "class-validator";

export class AddOrderReviewDto {
  @ApiProperty({
    example: 4.5,
    description: "Rating (1-5)",
    minimum: 1,
    maximum: 5,
  })
  @IsNumber({}, { message: "Rating must be a number" })
  @Min(1, { message: "Rating must be at least 1" })
  @Max(5, { message: "Rating cannot be greater than 5" })
  @IsNotEmpty({ message: "Rating is required" })
  rating: number;

  @ApiProperty({
    example: "Food was delicious and delivered on time. Will order again!",
    description: "Review text",
  })
  @IsString({ message: "Review must be a string" })
  @IsNotEmpty({ message: "Review is required" })
  review: string;
}
