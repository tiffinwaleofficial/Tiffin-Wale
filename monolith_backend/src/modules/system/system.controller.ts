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
}
