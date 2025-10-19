import { ApiProperty } from "@nestjs/swagger";

export class HealthCheckDto {
  @ApiProperty({
    description: "Status of the server",
    example: "ok",
  })
  status: string;

  @ApiProperty({
    description: "Timestamp of the health check",
    example: "2023-06-03T10:15:30.000Z",
  })
  timestamp: Date;

  @ApiProperty({
    description: "Server uptime in seconds",
    example: 1234567,
  })
  uptime: number;

  @ApiProperty({
    description: "Environment the server is running in",
    example: "production",
  })
  environment: string;

  @ApiProperty({
    description: "Health check message",
    example: "Server is healthy",
  })
  message: string;

  @ApiProperty({
    description: "Redis health status",
    example: { status: "healthy", latency: 5 },
    required: false,
  })
  redis?: {
    status: string;
    latency?: number;
    error?: string;
  };
}
