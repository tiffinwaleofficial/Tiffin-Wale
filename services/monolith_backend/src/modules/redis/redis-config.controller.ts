import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import {
  RedisConfigService,
  RedisDataCategory,
  LoadBalancingConfig,
} from "../../config/redis-config";
import { RedisRegistryService } from "./redis-registry.service";
import { RedisLoadBalancerService } from "./redis-load-balancer.service";
import { RedisAnalyticsService } from "./redis-analytics.service";
import { RedisHealthService, AlertRule } from "./redis-health.service";
import { MultiRedisService } from "./multi-redis.service";

@ApiTags("Redis Configuration")
@Controller("redis/config")
@ApiBearerAuth()
export class RedisConfigController {
  constructor(
    private readonly redisConfig: RedisConfigService,
    private readonly redisRegistry: RedisRegistryService,
    private readonly loadBalancer: RedisLoadBalancerService,
    private readonly analytics: RedisAnalyticsService,
    private readonly health: RedisHealthService,
    private readonly multiRedis: MultiRedisService,
  ) {}

  @Get("status")
  @ApiOperation({ summary: "Get Redis system status" })
  @ApiResponse({
    status: 200,
    description: "Redis system status retrieved successfully",
  })
  async getSystemStatus() {
    try {
      const [systemStatus, healthStatus, analytics] = await Promise.all([
        this.multiRedis.getSystemStatus(),
        this.health.getSystemHealth(),
        this.analytics.getAnalytics(),
      ]);

      return {
        success: true,
        data: {
          system: systemStatus,
          health: healthStatus,
          analytics: analytics.summary,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to get system status",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("instances")
  @ApiOperation({ summary: "Get all Redis instances configuration" })
  @ApiResponse({
    status: 200,
    description: "Redis instances retrieved successfully",
  })
  async getInstances() {
    try {
      const instances = this.redisConfig.getInstances();
      const instanceStatuses = await Promise.all(
        instances.map(async (instance) => {
          const status = this.redisRegistry.getInstanceStatus(instance.id);
          const health = await this.health.getInstanceHealth(instance.id);
          return {
            config: instance,
            status,
            health,
          };
        }),
      );

      return {
        success: true,
        data: {
          instances: instanceStatuses,
          total: instances.length,
          healthy: instanceStatuses.filter((i) => i.status?.isHealthy).length,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to get instances",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("instances/:instanceId")
  @ApiOperation({ summary: "Get specific Redis instance details" })
  @ApiResponse({
    status: 200,
    description: "Redis instance details retrieved successfully",
  })
  async getInstance(@Param("instanceId") instanceId: string) {
    try {
      const config = this.redisConfig.getInstance(instanceId);
      if (!config) {
        throw new HttpException(
          {
            success: false,
            error: "Instance not found",
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const status = this.redisRegistry.getInstanceStatus(instanceId);
      const health = await this.health.getInstanceHealth(instanceId);
      const healthHistory = await this.health.getHealthHistory(instanceId, 24);

      return {
        success: true,
        data: {
          config,
          status,
          health,
          healthHistory,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          error: "Failed to get instance details",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put("instances/:instanceId/status")
  @ApiOperation({ summary: "Update Redis instance status" })
  @ApiResponse({
    status: 200,
    description: "Instance status updated successfully",
  })
  async updateInstanceStatus(
    @Param("instanceId") instanceId: string,
    @Body() body: { isActive: boolean },
  ) {
    try {
      const config = this.redisConfig.getInstance(instanceId);
      if (!config) {
        throw new HttpException(
          {
            success: false,
            error: "Instance not found",
          },
          HttpStatus.NOT_FOUND,
        );
      }

      this.redisConfig.updateInstanceStatus(instanceId, body.isActive);

      return {
        success: true,
        message: `Instance ${instanceId} status updated to ${body.isActive ? "active" : "inactive"}`,
        data: {
          instanceId,
          isActive: body.isActive,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          error: "Failed to update instance status",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("load-balancing")
  @ApiOperation({ summary: "Get load balancing configuration and metrics" })
  @ApiResponse({
    status: 200,
    description: "Load balancing info retrieved successfully",
  })
  async getLoadBalancing() {
    try {
      const config = this.redisConfig.getLoadBalancingConfig();
      const metrics = await this.loadBalancer.getLoadBalancingMetrics();
      const history = this.loadBalancer.getRebalancingHistory();

      return {
        success: true,
        data: {
          config,
          metrics,
          rebalancingHistory: history.slice(-10), // Last 10 events
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to get load balancing info",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put("load-balancing")
  @ApiOperation({ summary: "Update load balancing configuration" })
  @ApiResponse({
    status: 200,
    description: "Load balancing configuration updated successfully",
  })
  async updateLoadBalancing(@Body() config: Partial<LoadBalancingConfig>) {
    try {
      this.redisConfig.updateLoadBalancingConfig(config);

      return {
        success: true,
        message: "Load balancing configuration updated successfully",
        data: this.redisConfig.getLoadBalancingConfig(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to update load balancing configuration",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("load-balancing/rebalance")
  @ApiOperation({ summary: "Force immediate rebalancing" })
  @ApiResponse({
    status: 200,
    description: "Rebalancing initiated successfully",
  })
  async forceRebalancing() {
    try {
      await this.loadBalancer.forceRebalancing();

      return {
        success: true,
        message: "Rebalancing initiated successfully",
        timestamp: new Date(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to initiate rebalancing",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("ttl-strategies")
  @ApiOperation({ summary: "Get TTL strategies for all data categories" })
  @ApiResponse({
    status: 200,
    description: "TTL strategies retrieved successfully",
  })
  async getTTLStrategies() {
    try {
      const globalConfig = this.redisConfig.getGlobalConfig();
      const categories: RedisDataCategory[] = [
        "auth",
        "user",
        "menu",
        "order",
        "analytics",
        "ml",
        "notifications",
        "cache",
        "default",
      ];

      const strategies = categories.reduce(
        (acc, category) => {
          acc[category] = this.redisConfig.getTTLConfig(category);
          return acc;
        },
        {} as Record<string, any>,
      );

      return {
        success: true,
        data: {
          strategies,
          categories,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to get TTL strategies",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put("ttl-strategies/:category")
  @ApiOperation({ summary: "Update TTL strategy for a specific data category" })
  @ApiResponse({
    status: 200,
    description: "TTL strategy updated successfully",
  })
  async updateTTLStrategy(
    @Param("category") category: RedisDataCategory,
    @Body()
    ttlConfig: {
      default?: number;
      min?: number;
      max?: number;
      frequencyMultiplier?: number;
    },
  ) {
    try {
      this.redisConfig.updateTTLStrategy(category, ttlConfig);

      return {
        success: true,
        message: `TTL strategy updated for category: ${category}`,
        data: {
          category,
          config: this.redisConfig.getTTLConfig(category),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to update TTL strategy",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("analytics")
  @ApiOperation({ summary: "Get comprehensive Redis analytics" })
  @ApiResponse({ status: 200, description: "Analytics retrieved successfully" })
  async getAnalytics() {
    try {
      const analytics = await this.analytics.getAnalytics();
      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to get analytics",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("analytics/historical")
  @ApiOperation({ summary: "Get historical metrics" })
  @ApiResponse({
    status: 200,
    description: "Historical metrics retrieved successfully",
  })
  async getHistoricalMetrics(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
    @Query("interval") interval: "minute" | "hour" | "day" = "hour",
  ) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new HttpException(
          {
            success: false,
            error: "Invalid date format",
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const metrics = await this.analytics.getHistoricalMetrics(
        start,
        end,
        interval,
      );

      return {
        success: true,
        data: metrics,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          error: "Failed to get historical metrics",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("analytics/capacity-prediction")
  @ApiOperation({ summary: "Get capacity predictions" })
  @ApiResponse({
    status: 200,
    description: "Capacity predictions retrieved successfully",
  })
  async getCapacityPrediction() {
    try {
      const predictions = await this.analytics.predictCapacity();
      return {
        success: true,
        data: predictions,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to get capacity predictions",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("analytics/report")
  @ApiOperation({ summary: "Generate performance report" })
  @ApiResponse({
    status: 200,
    description: "Performance report generated successfully",
  })
  async getPerformanceReport() {
    try {
      const report = await this.analytics.generatePerformanceReport();
      return {
        success: true,
        data: report,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to generate performance report",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("health")
  @ApiOperation({ summary: "Get system health status" })
  @ApiResponse({
    status: 200,
    description: "Health status retrieved successfully",
  })
  async getHealthStatus() {
    try {
      const health = await this.health.getSystemHealth();
      return {
        success: true,
        data: health,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to get health status",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("health/alerts")
  @ApiOperation({ summary: "Get alert rules" })
  @ApiResponse({
    status: 200,
    description: "Alert rules retrieved successfully",
  })
  async getAlertRules() {
    try {
      const rules = this.health.getAlertRules();
      return {
        success: true,
        data: rules,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to get alert rules",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("health/alerts")
  @ApiOperation({ summary: "Add new alert rule" })
  @ApiResponse({ status: 201, description: "Alert rule created successfully" })
  async addAlertRule(@Body() rule: Omit<AlertRule, "id">) {
    try {
      const newRule = await this.health.addAlertRule(rule);
      return {
        success: true,
        message: "Alert rule created successfully",
        data: newRule,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to create alert rule",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put("health/alerts/:ruleId")
  @ApiOperation({ summary: "Update alert rule" })
  @ApiResponse({ status: 200, description: "Alert rule updated successfully" })
  async updateAlertRule(
    @Param("ruleId") ruleId: string,
    @Body() updates: Partial<AlertRule>,
  ) {
    try {
      const success = await this.health.updateAlertRule(ruleId, updates);
      if (!success) {
        throw new HttpException(
          {
            success: false,
            error: "Alert rule not found",
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: "Alert rule updated successfully",
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          error: "Failed to update alert rule",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete("health/alerts/:ruleId")
  @ApiOperation({ summary: "Delete alert rule" })
  @ApiResponse({ status: 200, description: "Alert rule deleted successfully" })
  async deleteAlertRule(@Param("ruleId") ruleId: string) {
    try {
      const success = await this.health.removeAlertRule(ruleId);
      if (!success) {
        throw new HttpException(
          {
            success: false,
            error: "Alert rule not found",
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: "Alert rule deleted successfully",
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          error: "Failed to delete alert rule",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("health/failover/:instanceId")
  @ApiOperation({ summary: "Initiate manual failover" })
  @ApiResponse({ status: 200, description: "Failover initiated successfully" })
  async initiateFailover(
    @Param("instanceId") instanceId: string,
    @Body() body: { reason: string },
  ) {
    try {
      const failoverEvent = await this.health.manualFailover(
        instanceId,
        body.reason,
      );
      return {
        success: true,
        message: "Failover initiated successfully",
        data: failoverEvent,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to initiate failover",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("health/failover-history")
  @ApiOperation({ summary: "Get failover history" })
  @ApiResponse({
    status: 200,
    description: "Failover history retrieved successfully",
  })
  async getFailoverHistory(@Query("hours") hours: string = "24") {
    try {
      const hoursNum = parseInt(hours, 10);
      const history = await this.health.getFailoverHistory(hoursNum);
      return {
        success: true,
        data: history,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to get failover history",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete("cache")
  @ApiOperation({ summary: "Clear all caches" })
  @ApiResponse({ status: 200, description: "All caches cleared successfully" })
  async clearAllCaches() {
    try {
      await this.multiRedis.clearAllCaches();
      return {
        success: true,
        message: "All caches cleared successfully",
        timestamp: new Date(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to clear caches",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("configuration")
  @ApiOperation({ summary: "Get complete Redis configuration" })
  @ApiResponse({
    status: 200,
    description: "Configuration retrieved successfully",
  })
  async getConfiguration() {
    try {
      const globalConfig = this.redisConfig.getGlobalConfig();
      const summary = this.redisConfig.getConfigurationSummary();

      return {
        success: true,
        data: {
          summary: JSON.parse(summary),
          configuration: globalConfig,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to get configuration",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("configuration/export")
  @ApiOperation({ summary: "Export complete configuration" })
  @ApiResponse({
    status: 200,
    description: "Configuration exported successfully",
  })
  async exportConfiguration() {
    try {
      const config = this.redisConfig.exportConfiguration();
      return {
        success: true,
        data: {
          configuration: JSON.parse(config),
          exportedAt: new Date(),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: "Failed to export configuration",
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

