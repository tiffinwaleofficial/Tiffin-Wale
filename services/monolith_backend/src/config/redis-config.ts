import { ConfigService } from "@nestjs/config";
import { Injectable, Logger } from "@nestjs/common";

export interface RedisInstanceConfig {
  id: string;
  name: string;
  url?: string;
  host: string;
  port: number;
  password?: string;
  username?: string;
  database?: number;
  maxMemory: number; // in MB
  priority: "primary" | "secondary" | "tertiary";
  dataTypes: RedisDataCategory[];
  isActive: boolean;
  healthCheckInterval: number; // in seconds
  connectionTimeout: number; // in milliseconds
  commandTimeout: number; // in milliseconds
  retryDelayOnFailover: number; // in milliseconds
  maxRetriesPerRequest: number;
}

export type RedisDataCategory =
  | "auth" // User sessions, tokens, authentication data
  | "user" // User profiles, preferences, settings
  | "menu" // Menu items, restaurant data, partner info
  | "order" // Active orders, order status, real-time data
  | "analytics" // Dashboard data, metrics, reports
  | "ml" // ML predictions, recommendations, AI data
  | "notifications" // Notification preferences, push tokens
  | "cache" // General purpose caching
  | "default"; // Fallback category

export interface RedisTTLConfig {
  [key: string]: {
    default: number;
    min: number;
    max: number;
    frequencyMultiplier: number; // Multiplier for frequently accessed data
  };
}

export interface LoadBalancingConfig {
  strategy: "round-robin" | "least-used" | "smart" | "data-type";
  capacityThreshold: number; // Percentage (0-100)
  rebalanceEnabled: boolean;
  rebalanceInterval: number; // in seconds
  emergencyThreshold: number; // Percentage (0-100)
  healthCheckWeight: number; // Weight factor for health in load balancing
}

export interface RedisGlobalConfig {
  instances: RedisInstanceConfig[];
  ttlStrategies: RedisTTLConfig;
  loadBalancing: LoadBalancingConfig;
  monitoring: {
    enabled: boolean;
    metricsInterval: number; // in seconds
    alertThresholds: {
      memoryUsage: number; // Percentage
      responseTime: number; // in milliseconds
      errorRate: number; // Percentage
    };
  };
  fallback: {
    enabled: boolean;
    inMemoryCache: boolean;
    maxInMemoryItems: number;
  };
}

@Injectable()
export class RedisConfigService {
  private readonly logger = new Logger(RedisConfigService.name);
  private config: RedisGlobalConfig;

  constructor(private configService: ConfigService) {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
    this.logger.log("Redis configuration loaded successfully");
  }

  private loadConfiguration(): RedisGlobalConfig {
    // Load Redis instances from environment variables
    const instances: RedisInstanceConfig[] = [];

    // Primary Redis Instance
    if (
      this.configService.get("REDIS_PRIMARY_URL") ||
      this.configService.get("REDIS_PRIMARY_HOST")
    ) {
      instances.push({
        id: "primary",
        name: "Primary Redis Instance",
        url: this.configService.get("REDIS_PRIMARY_URL"),
        host: this.configService.get("REDIS_PRIMARY_HOST", "localhost"),
        port: this.configService.get("REDIS_PRIMARY_PORT", 6379),
        password: this.configService.get("REDIS_PRIMARY_PASSWORD"),
        username: this.configService.get("REDIS_PRIMARY_USERNAME", "default"),
        database: this.configService.get("REDIS_PRIMARY_DB", 0),
        maxMemory: this.configService.get("REDIS_PRIMARY_MAX_MEMORY", 30), // 30MB
        priority: "primary",
        dataTypes: ["auth", "order", "notifications", "analytics"],
        isActive: true,
        healthCheckInterval: 30,
        connectionTimeout: 60000,
        commandTimeout: 5000,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
      });
    }

    // Secondary Redis Instance
    if (
      this.configService.get("REDIS_SECONDARY_URL") ||
      this.configService.get("REDIS_SECONDARY_HOST")
    ) {
      instances.push({
        id: "secondary",
        name: "Secondary Redis Instance",
        url: this.configService.get("REDIS_SECONDARY_URL"),
        host: this.configService.get("REDIS_SECONDARY_HOST", "localhost"),
        port: this.configService.get("REDIS_SECONDARY_PORT", 6380),
        password: this.configService.get("REDIS_SECONDARY_PASSWORD"),
        username: this.configService.get("REDIS_SECONDARY_USERNAME", "default"),
        database: this.configService.get("REDIS_SECONDARY_DB", 0),
        maxMemory: this.configService.get("REDIS_SECONDARY_MAX_MEMORY", 30), // 30MB
        priority: "secondary",
        dataTypes: ["user", "menu", "ml", "cache"],
        isActive: true,
        healthCheckInterval: 30,
        connectionTimeout: 60000,
        commandTimeout: 5000,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
      });
    }

    // Tertiary Redis Instance (for future expansion)
    if (
      this.configService.get("REDIS_TERTIARY_URL") ||
      this.configService.get("REDIS_TERTIARY_HOST")
    ) {
      instances.push({
        id: "tertiary",
        name: "Tertiary Redis Instance",
        url: this.configService.get("REDIS_TERTIARY_URL"),
        host: this.configService.get("REDIS_TERTIARY_HOST", "localhost"),
        port: this.configService.get("REDIS_TERTIARY_PORT", 6381),
        password: this.configService.get("REDIS_TERTIARY_PASSWORD"),
        username: this.configService.get("REDIS_TERTIARY_USERNAME", "default"),
        database: this.configService.get("REDIS_TERTIARY_DB", 0),
        maxMemory: this.configService.get("REDIS_TERTIARY_MAX_MEMORY", 30), // 30MB
        priority: "tertiary",
        dataTypes: ["default"],
        isActive: true,
        healthCheckInterval: 30,
        connectionTimeout: 60000,
        commandTimeout: 5000,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
      });
    }

    // Fallback to single Redis if no multi-Redis configuration
    if (instances.length === 0) {
      instances.push({
        id: "default",
        name: "Default Redis Instance",
        url: this.configService.get("REDIS_URL"),
        host: this.configService.get("REDIS_HOST", "localhost"),
        port: this.configService.get("REDIS_PORT", 6379),
        password: this.configService.get("REDIS_PASSWORD"),
        username: this.configService.get("REDIS_USERNAME", "default"),
        database: this.configService.get("REDIS_DB", 0),
        maxMemory: this.configService.get("REDIS_MAX_MEMORY", 30),
        priority: "primary",
        dataTypes: [
          "auth",
          "user",
          "menu",
          "order",
          "analytics",
          "ml",
          "notifications",
          "cache",
          "default",
        ],
        isActive: true,
        healthCheckInterval: 30,
        connectionTimeout: 60000,
        commandTimeout: 5000,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
      });
    }

    return {
      instances,
      ttlStrategies: {
        auth: {
          default: 900, // 15 minutes
          min: 300, // 5 minutes
          max: 3600, // 1 hour
          frequencyMultiplier: 1.5,
        },
        user: {
          default: 1800, // 30 minutes
          min: 600, // 10 minutes
          max: 7200, // 2 hours
          frequencyMultiplier: 2.0,
        },
        menu: {
          default: 3600, // 1 hour
          min: 1800, // 30 minutes
          max: 14400, // 4 hours
          frequencyMultiplier: 1.8,
        },
        order: {
          default: 7200, // 2 hours
          min: 1800, // 30 minutes
          max: 21600, // 6 hours
          frequencyMultiplier: 1.2,
        },
        analytics: {
          default: 600, // 10 minutes
          min: 300, // 5 minutes
          max: 1800, // 30 minutes
          frequencyMultiplier: 1.3,
        },
        ml: {
          default: 1800, // 30 minutes
          min: 900, // 15 minutes
          max: 7200, // 2 hours
          frequencyMultiplier: 2.5,
        },
        notifications: {
          default: 3600, // 1 hour
          min: 900, // 15 minutes
          max: 10800, // 3 hours
          frequencyMultiplier: 1.4,
        },
        cache: {
          default: 300, // 5 minutes
          min: 60, // 1 minute
          max: 1800, // 30 minutes
          frequencyMultiplier: 1.1,
        },
        default: {
          default: 300, // 5 minutes
          min: 60, // 1 minute
          max: 1800, // 30 minutes
          frequencyMultiplier: 1.0,
        },
      },
      loadBalancing: {
        strategy: this.configService.get(
          "REDIS_LOAD_BALANCE_STRATEGY",
          "smart",
        ) as any,
        capacityThreshold: this.configService.get(
          "REDIS_CAPACITY_THRESHOLD",
          80,
        ),
        rebalanceEnabled:
          this.configService.get("REDIS_REBALANCE_ENABLED", "true") === "true",
        rebalanceInterval: this.configService.get(
          "REDIS_REBALANCE_INTERVAL",
          300,
        ), // 5 minutes
        emergencyThreshold: this.configService.get(
          "REDIS_EMERGENCY_THRESHOLD",
          95,
        ),
        healthCheckWeight: this.configService.get(
          "REDIS_HEALTH_CHECK_WEIGHT",
          0.3,
        ),
      },
      monitoring: {
        enabled:
          this.configService.get("REDIS_MONITORING_ENABLED", "true") === "true",
        metricsInterval: this.configService.get("REDIS_METRICS_INTERVAL", 60), // 1 minute
        alertThresholds: {
          memoryUsage: this.configService.get(
            "REDIS_ALERT_MEMORY_THRESHOLD",
            85,
          ),
          responseTime: this.configService.get(
            "REDIS_ALERT_RESPONSE_TIME",
            100,
          ), // 100ms
          errorRate: this.configService.get("REDIS_ALERT_ERROR_RATE", 5), // 5%
        },
      },
      fallback: {
        enabled:
          this.configService.get("REDIS_FALLBACK_ENABLED", "true") === "true",
        inMemoryCache:
          this.configService.get("REDIS_FALLBACK_IN_MEMORY", "true") === "true",
        maxInMemoryItems: this.configService.get(
          "REDIS_FALLBACK_MAX_ITEMS",
          1000,
        ),
      },
    };
  }

  private validateConfiguration(): void {
    if (this.config.instances.length === 0) {
      throw new Error("No Redis instances configured");
    }

    // Validate each instance
    for (const instance of this.config.instances) {
      if (!instance.host || !instance.port) {
        throw new Error(
          `Invalid Redis configuration for instance ${instance.id}: missing host or port`,
        );
      }

      if (instance.maxMemory <= 0) {
        throw new Error(
          `Invalid maxMemory for Redis instance ${instance.id}: must be greater than 0`,
        );
      }
    }

    // Validate load balancing configuration
    if (
      this.config.loadBalancing.capacityThreshold < 0 ||
      this.config.loadBalancing.capacityThreshold > 100
    ) {
      throw new Error("Invalid capacityThreshold: must be between 0 and 100");
    }

    this.logger.log(
      `Configuration validated: ${this.config.instances.length} Redis instances configured`,
    );
  }

  // Getter methods
  getGlobalConfig(): RedisGlobalConfig {
    return this.config;
  }

  getInstances(): RedisInstanceConfig[] {
    return this.config.instances.filter((instance) => instance.isActive);
  }

  getInstance(id: string): RedisInstanceConfig | undefined {
    return this.config.instances.find(
      (instance) => instance.id === id && instance.isActive,
    );
  }

  getInstancesForDataType(dataType: RedisDataCategory): RedisInstanceConfig[] {
    return this.config.instances.filter(
      (instance) => instance.isActive && instance.dataTypes.includes(dataType),
    );
  }

  getPrimaryInstance(): RedisInstanceConfig | undefined {
    return this.config.instances.find(
      (instance) => instance.isActive && instance.priority === "primary",
    );
  }

  getTTLConfig(category: RedisDataCategory): RedisTTLConfig[string] {
    return (
      this.config.ttlStrategies[category] || this.config.ttlStrategies.default
    );
  }

  getLoadBalancingConfig(): LoadBalancingConfig {
    return this.config.loadBalancing;
  }

  // Dynamic configuration updates
  updateInstanceStatus(instanceId: string, isActive: boolean): void {
    const instance = this.config.instances.find((i) => i.id === instanceId);
    if (instance) {
      instance.isActive = isActive;
      this.logger.log(
        `Instance ${instanceId} status updated to: ${isActive ? "active" : "inactive"}`,
      );
    }
  }

  updateTTLStrategy(
    category: RedisDataCategory,
    ttlConfig: Partial<RedisTTLConfig[string]>,
  ): void {
    this.config.ttlStrategies[category] = {
      ...this.config.ttlStrategies[category],
      ...ttlConfig,
    };
    this.logger.log(`TTL strategy updated for category: ${category}`);
  }

  updateLoadBalancingConfig(config: Partial<LoadBalancingConfig>): void {
    this.config.loadBalancing = {
      ...this.config.loadBalancing,
      ...config,
    };
    this.logger.log("Load balancing configuration updated");
  }

  // Utility methods
  calculateOptimalTTL(
    category: RedisDataCategory,
    accessFrequency: number = 1,
  ): number {
    const ttlConfig = this.getTTLConfig(category);
    const baseTTL = ttlConfig.default;
    const adjustedTTL = Math.floor(
      baseTTL * (ttlConfig.frequencyMultiplier * accessFrequency),
    );

    return Math.max(ttlConfig.min, Math.min(ttlConfig.max, adjustedTTL));
  }

  getConnectionString(instance: RedisInstanceConfig): string {
    if (instance.url) {
      return instance.url;
    }

    let connectionString = `redis://`;

    if (instance.username && instance.password) {
      connectionString += `${instance.username}:${instance.password}@`;
    } else if (instance.password) {
      connectionString += `:${instance.password}@`;
    }

    connectionString += `${instance.host}:${instance.port}`;

    if (instance.database) {
      connectionString += `/${instance.database}`;
    }

    return connectionString;
  }

  // Health and monitoring
  getHealthCheckConfig(
    instanceId: string,
  ): { interval: number; timeout: number } | undefined {
    const instance = this.getInstance(instanceId);
    if (!instance) return undefined;

    return {
      interval: instance.healthCheckInterval * 1000, // Convert to milliseconds
      timeout: instance.commandTimeout,
    };
  }

  isMonitoringEnabled(): boolean {
    return this.config.monitoring.enabled;
  }

  getMonitoringConfig() {
    return this.config.monitoring;
  }

  // Configuration export/import for debugging
  exportConfiguration(): string {
    return JSON.stringify(this.config, null, 2);
  }

  getConfigurationSummary(): string {
    const summary = {
      totalInstances: this.config.instances.length,
      activeInstances: this.config.instances.filter((i) => i.isActive).length,
      totalMaxMemory: this.config.instances.reduce(
        (sum, i) => sum + i.maxMemory,
        0,
      ),
      loadBalancingStrategy: this.config.loadBalancing.strategy,
      monitoringEnabled: this.config.monitoring.enabled,
    };

    return JSON.stringify(summary, null, 2);
  }
}
