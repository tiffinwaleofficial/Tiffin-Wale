import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SystemService } from "./system.service";
import { HealthCheckDto, VersionDto } from "./dto";

@ApiTags("system")
@Controller()
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get("ping")
  @ApiOperation({ summary: "Server health check" })
  @ApiResponse({
    status: 200,
    description: "Server health status",
    type: HealthCheckDto,
  })
  @ApiResponse({
    status: 503,
    description: "Server is experiencing issues",
  })
  async healthCheck(): Promise<HealthCheckDto> {
    return this.systemService.getHealthCheck();
  }

  @Get("version")
  @ApiOperation({ summary: "Application version information" })
  @ApiResponse({
    status: 200,
    description: "Application version details",
    type: VersionDto,
  })
  async getVersion(): Promise<VersionDto> {
    return this.systemService.getVersion();
  }

  @Get("redis/health")
  @ApiOperation({ summary: "Redis health check" })
  @ApiResponse({
    status: 200,
    description: "Redis health status",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "healthy" },
        latency: { type: "number", example: 5 },
        error: { type: "string", example: null },
      },
    },
  })
  async getRedisHealth() {
    return this.systemService.getRedisHealth();
  }

  @Get("redis/stats")
  @ApiOperation({ summary: "Redis cache statistics" })
  @ApiResponse({
    status: 200,
    description: "Redis cache statistics",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "connected" },
        timestamp: { type: "string", example: "2023-12-01T10:00:00.000Z" },
      },
    },
  })
  async getRedisStats() {
    return this.systemService.getRedisStats();
  }
}
