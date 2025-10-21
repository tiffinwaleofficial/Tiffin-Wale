import { Module, Global } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { RedisService } from "./redis.service";
import { RedisConfigService } from "../../config/redis-config";
import { RedisRegistryService } from "./redis-registry.service";
import { RedisLoadBalancerService } from "./redis-load-balancer.service";
import { MultiRedisService } from "./multi-redis.service";
import { RedisAnalyticsService } from "./redis-analytics.service";
import { RedisHealthService } from "./redis-health.service";
import { RedisConfigController } from "./redis-config.controller";

@Global()
@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    // Using Multi-Redis system instead of single Redis CacheModule
    // CacheModule now uses in-memory cache to avoid conflicts
    CacheModule.register({
      ttl: 300, // 5 minutes default TTL
      max: 1000, // Maximum number of items in cache
      isGlobal: true,
    }),
  ],
  controllers: [RedisConfigController],
  providers: [
    RedisConfigService,
    RedisRegistryService,
    RedisLoadBalancerService,
    MultiRedisService,
    RedisAnalyticsService,
    RedisHealthService,
    RedisService, // Keep existing service for backward compatibility
  ],
  exports: [
    RedisConfigService,
    RedisRegistryService,
    RedisLoadBalancerService,
    MultiRedisService,
    RedisAnalyticsService,
    RedisHealthService,
    RedisService,
    CacheModule,
  ],
})
export class RedisModule {}
