import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HealthCheckDto, VersionDto } from "./dto";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class SystemService {
  private startTime: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.startTime = Date.now();
  }

  /**
   * Get server health status
   */
  async getHealthCheck(): Promise<HealthCheckDto> {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const environment =
      this.configService.get<string>("NODE_ENV") || "development";

    // Check Redis health
    const redisHealth = await this.redisService.healthCheck();

    return {
      status: redisHealth.status === "healthy" ? "ok" : "degraded",
      timestamp: new Date(),
      uptime,
      environment,
      message:
        redisHealth.status === "healthy"
          ? "Server is healthy"
          : "Server is running but Redis is unhealthy",
      redis: redisHealth,
    };
  }

  /**
   * Get Redis health status
   */
  async getRedisHealth() {
    return this.redisService.healthCheck();
  }

  /**
   * Get Redis statistics
   */
  async getRedisStats() {
    return this.redisService.getStats();
  }

  /**
   * Get application version information
   */
  async getVersion(): Promise<VersionDto> {
    const environment =
      this.configService.get<string>("NODE_ENV") || "development";
    const version = this.configService.get<string>("APP_VERSION") || "1.0.0";
    const buildNumber =
      this.configService.get<string>("BUILD_NUMBER") || "development";
    const releaseDate = new Date(
      this.configService.get<string>("RELEASE_DATE") || Date.now(),
    );
    const apiVersion = this.configService.get<string>("API_VERSION") || "v1";
    const commitHash =
      this.configService.get<string>("COMMIT_HASH") || "development";

    // Feature flags
    const features = {
      payments: this.configService.get<boolean>("FEATURE_PAYMENTS") || false,
      referrals: this.configService.get<boolean>("FEATURE_REFERRALS") || false,
      subscriptions:
        this.configService.get<boolean>("FEATURE_SUBSCRIPTIONS") || false,
    };

    return {
      version,
      buildNumber,
      releaseDate,
      environment,
      apiVersion,
      commitHash,
      features,
    };
  }
}
