import { ApiProperty } from "@nestjs/swagger";

export class VersionDto {
  @ApiProperty({
    description: "Semantic version of the application",
    example: "1.2.3",
  })
  version: string;

  @ApiProperty({
    description: "Build number of the application",
    example: "20230603-1",
  })
  buildNumber: string;

  @ApiProperty({
    description: "Release date of this version",
    example: "2023-06-01T00:00:00.000Z",
  })
  releaseDate: Date;

  @ApiProperty({
    description: "Environment the application is running in",
    example: "production",
  })
  environment: string;

  @ApiProperty({
    description: "API version",
    example: "v1",
  })
  apiVersion: string;

  @ApiProperty({
    description: "Git commit hash",
    example: "a1b2c3d",
  })
  commitHash: string;

  @ApiProperty({
    description: "Feature flags",
    example: {
      payments: true,
      referrals: true,
      subscriptions: false,
    },
  })
  features: Record<string, boolean>;
}
