import { Module, Global } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";
import { RedisService } from "./redis.service";

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>("REDIS_URL");

        if (!redisUrl) {
          console.warn("Redis URL not configured, using in-memory cache");
          return {
            ttl: 300, // 5 minutes default TTL
            max: 1000, // Maximum number of items in cache
          };
        }

        return {
          store: redisStore as any,
          url: redisUrl,
          ttl: 300, // 5 minutes default TTL
          max: 10000, // Maximum number of items in cache
          // Redis-specific options
          retryDelayOnFailover: 100,
          enableReadyCheck: false,
          maxRetriesPerRequest: null,
          lazyConnect: true,
          keepAlive: 30000,
          connectTimeout: 60000,
          commandTimeout: 5000,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService, CacheModule],
})
export class RedisModule {}
