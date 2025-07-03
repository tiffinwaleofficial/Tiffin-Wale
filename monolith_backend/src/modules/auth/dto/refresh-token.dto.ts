import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({ description: "JWT refresh token issued to the user" })
  @IsString()
  refreshToken: string;
}