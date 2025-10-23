import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import {
  RedisConfigService,
  RedisInstanceConfig,
  RedisDataCategory,
} from "../../config/redis-config";

export interface RedisInstanceStatus {
  id: string;
  isConnected: boolean;
  isHealthy: boolean;
  lastHealthCheck: Date;
  connectionCount: number;
  memoryUsage: {
    used: number; // in bytes
    max: number; // in bytes
    percentage: number; // 0-100
  };
  performance: {
    avgResponseTime: number; // in milliseconds
    errorRate: number; // 0-100 percentage
    operationsPerSecond: number;
  };
  stats: {
    totalConnections: number;
    totalOperations: number;
    totalErrors: number;
    uptime: number; // in seconds
  };
}

export interface ConnectionPoolConfig {
  maxConnections: number;
  minConnections: number;
  acquireTimeoutMillis: number;
  createTimeoutMillis: number;
  destroyTimeoutMillis: number;
  idleTimeoutMillis: number;
  reapIntervalMillis: number;
}

@Injectable()
export class RedisRegistryService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisRegistryService.name);
  private readonly instances = new Map<string, Redis>();
  private readonly connectionPools = new Map<string, Redis[]>();
  private readonly instanceStatus = new Map<string, RedisInstanceStatus>();
  private readonly healthCheckIntervals = new Map<string, NodeJS.Timeout>();
  private readonly performanceMetrics = new Map<
    string,
    {
      responseTimes: number[];
      errors: number;
      operations: number;
      lastReset: Date;
    }
  >();

  private readonly poolConfig: ConnectionPoolConfig = {
    maxConnections: 10,
    minConnections: 2,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 300000, // 5 minutes
    reapIntervalMillis: 60000, // 1 minute
  };

  constructor(
    private readonly redisConfig: RedisConfigService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log("🚀 Initializing Multi-Redis Registry Service...");
    this.logger.log(
      "📊 Loading Redis configuration from environment variables...",
    );

    const instances = this.redisConfig.getInstances();
    this.logger.log(
      `🔍 Found ${instances.length} Redis instance(s) configured:`,
    );

    for (const instance of instances) {
      this.logger.log(
        `  📍 ${instance.name} (${instance.id}): ${instance.host}:${instance.port} - ${instance.maxMemory}MB`,
      );
      this.logger.log(`     📂 Data Types: [${instance.dataTypes.join(", ")}]`);
    }

    await this.initializeInstances();
    this.startHealthChecks();
    this.startPerformanceTracking();

    const healthyCount = this.getHealthyInstances().length;
    const totalCapacity = instances.reduce((sum, i) => sum + i.maxMemory, 0);

    this.logger.log("✅ Multi-Redis Registry Service initialized successfully");
    this.logger.log(
      `📈 System Status: ${healthyCount}/${instances.length} instances healthy, ${totalCapacity}MB total capacity`,
    );
  }

  async onModuleDestroy() {
    this.logger.log("Shutting down Redis Registry Service...");
    this.stopHealthChecks();
    await this.disconnectAllInstances();
    this.logger.log("Redis Registry Service shut down successfully");
  }

  private async initializeInstances(): Promise<void> {
    const instances = this.redisConfig.getInstances();

    for (const instanceConfig of instances) {
      try {
        this.logger.log(
          `🔄 Connecting to Redis instance: ${instanceConfig.name}...`,
        );

        // Create the main instance first
        const mainInstance = await this.createInstance(instanceConfig);
        await mainInstance.connect();

        // Then initialize the connection pool (which will create additional connections)
        await this.initializeConnectionPool(instanceConfig);

        this.logger.log(
          `✅ Redis instance '${instanceConfig.id}' connected and ready (${instanceConfig.host}:${instanceConfig.port})`,
        );
      } catch (error) {
        this.logger.error(
          `❌ Failed to connect to Redis instance '${instanceConfig.id}' (${instanceConfig.host}:${instanceConfig.port}):`,
          error.message,
        );
        // Mark instance as unhealthy but don't fail the entire service
        this.updateInstanceStatus(instanceConfig.id, {
          isConnected: false,
          isHealthy: false,
          lastHealthCheck: new Date(),
        });
      }
    }
  }

  private async createInstance(config: RedisInstanceConfig): Promise<Redis> {
    const connectionString = this.redisConfig.getConnectionString(config);

    const redisOptions = {
      host: config.host,
      port: config.port,
      password: config.password,
      username: config.username,
      db: config.database || 0,
      connectTimeout: config.connectionTimeout,
      commandTimeout: config.commandTimeout,
      retryDelayOnFailover: config.retryDelayOnFailover,
      maxRetriesPerRequest: config.maxRetriesPerRequest,
      lazyConnect: true,
      keepAlive: 30000,
      enableReadyCheck: true,
      maxLoadingTimeout: 5000,
      // Connection pool settings
      family: 4,
      // Retry settings
      retryDelayOnClusterDown: 300,
      retryDelayOnClusterFailover: 100,
    };

    const redis = config.url
      ? new Redis(connectionString)
      : new Redis(redisOptions);

    // Set up event listeners
    redis.on("connect", () => {
      this.logger.log(
        `🔗 Redis instance '${config.id}' (${config.host}:${config.port}) connected`,
      );
      this.updateInstanceStatus(config.id, { isConnected: true });
    });

    redis.on("ready", () => {
      this.logger.log(
        `🟢 Redis instance '${config.id}' (${config.host}:${config.port}) ready for operations`,
      );
      this.updateInstanceStatus(config.id, { isHealthy: true });
    });

    redis.on("error", (error) => {
      this.logger.error(
        `🔴 Redis instance '${config.id}' (${config.host}:${config.port}) error:`,
        error.message,
      );
      this.updateInstanceStatus(config.id, {
        isConnected: false,
        isHealthy: false,
      });
      this.incrementErrorCount(config.id);
    });

    redis.on("close", () => {
      this.logger.warn(
        `🔌 Redis instance '${config.id}' (${config.host}:${config.port}) connection closed`,
      );
      this.updateInstanceStatus(config.id, {
        isConnected: false,
        isHealthy: false,
      });
    });

    redis.on("reconnecting", () => {
      this.logger.log(
        `🔄 Redis instance '${config.id}' (${config.host}:${config.port}) reconnecting...`,
      );
    });

    // Initialize performance tracking
    this.performanceMetrics.set(config.id, {
      responseTimes: [],
      errors: 0,
      operations: 0,
      lastReset: new Date(),
    });

    // Initialize status
    this.instanceStatus.set(config.id, {
      id: config.id,
      isConnected: false,
      isHealthy: false,
      lastHealthCheck: new Date(),
      connectionCount: 0,
      memoryUsage: {
        used: 0,
        max: config.maxMemory * 1024 * 1024,
        percentage: 0,
      },
      performance: { avgResponseTime: 0, errorRate: 0, operationsPerSecond: 0 },
      stats: {
        totalConnections: 0,
        totalOperations: 0,
        totalErrors: 0,
        uptime: 0,
      },
    });

    this.instances.set(config.id, redis);
    return redis;
  }

  private async createPoolConnection(
    config: RedisInstanceConfig,
  ): Promise<Redis> {
    const connectionString = this.redisConfig.getConnectionString(config);

    const redisOptions = {
      host: config.host,
      port: config.port,
      password: config.password,
      username: config.username,
      db: config.database || 0,
      connectTimeout: config.connectionTimeout,
      commandTimeout: config.commandTimeout,
      retryDelayOnFailover: config.retryDelayOnFailover,
      maxRetriesPerRequest: config.maxRetriesPerRequest,
      lazyConnect: true,
      keepAlive: 30000,
      enableReadyCheck: true,
      maxLoadingTimeout: 5000,
      family: 4,
      retryDelayOnClusterDown: 300,
      retryDelayOnClusterFailover: 100,
    };

    // Create pool connection without extensive event listeners
    const redis = config.url
      ? new Redis(connectionString)
      : new Redis(redisOptions);

    // Only add basic error handling for pool connections
    redis.on("error", (error) => {
      this.logger.warn(
        `🟡 Redis pool connection for '${config.id}' error: ${error.message}`,
      );
    });

    return redis;
  }

  private async initializeConnectionPool(
    config: RedisInstanceConfig,
  ): Promise<void> {
    const pool: Redis[] = [];

    // Get the main instance that was already created
    const mainInstance = this.instances.get(config.id);
    if (mainInstance) {
      pool.push(mainInstance);
    }

    // Create additional connections for the pool (minConnections - 1, since we already have the main instance)
    const additionalConnections = Math.max(
      0,
      this.poolConfig.minConnections - 1,
    );

    for (let i = 0; i < additionalConnections; i++) {
      try {
        const connection = await this.createPoolConnection(config);
        await connection.connect();
        pool.push(connection);
      } catch (error) {
        this.logger.error(
          `Failed to create pool connection ${i + 1} for instance '${config.id}':`,
          error,
        );
      }
    }

    this.connectionPools.set(config.id, pool);
    this.logger.log(
      `Connection pool initialized for instance '${config.id}' with ${pool.length} connections`,
    );
  }

  private startHealthChecks(): void {
    const instances = this.redisConfig.getInstances();

    for (const instanceConfig of instances) {
      const healthCheckConfig = this.redisConfig.getHealthCheckConfig(
        instanceConfig.id,
      );
      if (!healthCheckConfig) continue;

      const interval = setInterval(async () => {
        await this.performHealthCheck(instanceConfig.id);
      }, healthCheckConfig.interval);

      this.healthCheckIntervals.set(instanceConfig.id, interval);
    }

    this.logger.log("Health checks started for all Redis instances");
  }

  private stopHealthChecks(): void {
    for (const [instanceId, interval] of this.healthCheckIntervals) {
      clearInterval(interval);
      this.logger.log(`Health check stopped for instance '${instanceId}'`);
    }
    this.healthCheckIntervals.clear();
  }

  private async performHealthCheck(instanceId: string): Promise<void> {
    const redis = this.instances.get(instanceId);
    if (!redis) return;

    const startTime = Date.now();

    try {
      // Perform ping test
      const pong = await redis.ping();
      const responseTime = Date.now() - startTime;

      if (pong === "PONG") {
        // Get memory info
        const memoryInfo = await this.getMemoryInfo(instanceId);

        // Update status
        this.updateInstanceStatus(instanceId, {
          isConnected: true,
          isHealthy: true,
          lastHealthCheck: new Date(),
          memoryUsage: memoryInfo,
        });

        // Track performance
        this.trackPerformance(instanceId, responseTime, false);
      } else {
        throw new Error("Invalid ping response");
      }
    } catch (error) {
      this.logger.error(
        `Health check failed for instance '${instanceId}':`,
        error,
      );

      this.updateInstanceStatus(instanceId, {
        isConnected: false,
        isHealthy: false,
        lastHealthCheck: new Date(),
      });

      this.trackPerformance(instanceId, Date.now() - startTime, true);
    }
  }

  private async getMemoryInfo(
    instanceId: string,
  ): Promise<{ used: number; max: number; percentage: number }> {
    const redis = this.instances.get(instanceId);
    const instanceConfig = this.redisConfig.getInstance(instanceId);

    if (!redis || !instanceConfig) {
      return { used: 0, max: instanceConfig?.maxMemory || 0, percentage: 0 };
    }

    try {
      // Use INFO memory command instead of MEMORY USAGE for better compatibility
      const info = await redis.info("memory");
      const memoryLines = info.split("\r\n");
      const usedMemoryLine = memoryLines.find((line) =>
        line.startsWith("used_memory:"),
      );
      const used = usedMemoryLine
        ? parseInt(usedMemoryLine.split(":")[1]) || 0
        : 0;
      const max = instanceConfig.maxMemory * 1024 * 1024; // Convert MB to bytes
      const percentage = max > 0 ? (used / max) * 100 : 0;

      return { used, max, percentage };
    } catch (error) {
      this.logger.error(
        `Failed to get memory info for instance '${instanceId}':`,
        error,
      );
      return {
        used: 0,
        max: instanceConfig.maxMemory * 1024 * 1024,
        percentage: 0,
      };
    }
  }

  private startPerformanceTracking(): void {
    // Reset performance metrics every minute
    setInterval(() => {
      this.resetPerformanceMetrics();
    }, 60000);
  }

  private trackPerformance(
    instanceId: string,
    responseTime: number,
    isError: boolean,
  ): void {
    const metrics = this.performanceMetrics.get(instanceId);
    if (!metrics) return;

    metrics.operations++;
    metrics.responseTimes.push(responseTime);

    if (isError) {
      metrics.errors++;
    }

    // Keep only last 100 response times to prevent memory bloat
    if (metrics.responseTimes.length > 100) {
      metrics.responseTimes = metrics.responseTimes.slice(-100);
    }
  }

  private resetPerformanceMetrics(): void {
    for (const [instanceId, metrics] of this.performanceMetrics) {
      const avgResponseTime =
        metrics.responseTimes.length > 0
          ? metrics.responseTimes.reduce((sum, time) => sum + time, 0) /
            metrics.responseTimes.length
          : 0;

      const errorRate =
        metrics.operations > 0
          ? (metrics.errors / metrics.operations) * 100
          : 0;

      const operationsPerSecond = metrics.operations; // Since we reset every minute

      // Update instance status with performance metrics
      this.updateInstanceStatus(instanceId, {
        performance: {
          avgResponseTime,
          errorRate,
          operationsPerSecond,
        },
      });

      // Reset metrics
      metrics.responseTimes = [];
      metrics.errors = 0;
      metrics.operations = 0;
      metrics.lastReset = new Date();
    }
  }

  private incrementErrorCount(instanceId: string): void {
    const status = this.instanceStatus.get(instanceId);
    if (status) {
      status.stats.totalErrors++;
    }
  }

  private updateInstanceStatus(
    instanceId: string,
    updates: Partial<RedisInstanceStatus>,
  ): void {
    const currentStatus = this.instanceStatus.get(instanceId);
    if (currentStatus) {
      Object.assign(currentStatus, updates);
    }
  }

  private async disconnectAllInstances(): Promise<void> {
    const disconnectPromises: Promise<void>[] = [];

    // Disconnect main instances
    for (const [instanceId, redis] of this.instances) {
      try {
        await redis.disconnect();
        this.logger.log(`Disconnected instance '${instanceId}'`);
      } catch (error) {
        this.logger.error(
          `Error disconnecting instance '${instanceId}':`,
          error,
        );
      }
    }

    // Disconnect pool connections
    for (const [instanceId, pool] of this.connectionPools) {
      for (const connection of pool) {
        try {
          await connection.disconnect();
        } catch (error) {
          this.logger.error(
            `Error disconnecting pool connection for '${instanceId}':`,
            error,
          );
        }
      }
    }

    await Promise.all(disconnectPromises);

    this.instances.clear();
    this.connectionPools.clear();
    this.instanceStatus.clear();
    this.performanceMetrics.clear();
  }

  // Public API methods

  getInstance(instanceId: string): Redis | undefined {
    return this.instances.get(instanceId);
  }

  getInstanceStatus(instanceId: string): RedisInstanceStatus | undefined {
    return this.instanceStatus.get(instanceId);
  }

  getAllInstanceStatuses(): RedisInstanceStatus[] {
    return Array.from(this.instanceStatus.values());
  }

  getHealthyInstances(): string[] {
    return Array.from(this.instanceStatus.entries())
      .filter(([_, status]) => status.isHealthy && status.isConnected)
      .map(([instanceId]) => instanceId);
  }

  getInstancesForDataType(dataType: RedisDataCategory): Redis[] {
    const instanceConfigs = this.redisConfig.getInstancesForDataType(dataType);
    const healthyInstances = this.getHealthyInstances();

    return instanceConfigs
      .filter((config) => healthyInstances.includes(config.id))
      .map((config) => this.instances.get(config.id))
      .filter(Boolean) as Redis[];
  }

  async getPooledConnection(instanceId: string): Promise<Redis | undefined> {
    const pool = this.connectionPools.get(instanceId);
    if (!pool || pool.length === 0) {
      return this.getInstance(instanceId);
    }

    // Simple round-robin selection
    const connection = pool.shift();
    if (connection) {
      pool.push(connection); // Move to end of pool
      return connection;
    }

    return this.getInstance(instanceId);
  }

  // Monitoring and diagnostics

  async getDetailedStatus(): Promise<{
    summary: {
      totalInstances: number;
      healthyInstances: number;
      totalMemoryUsage: number;
      totalMaxMemory: number;
    };
    instances: RedisInstanceStatus[];
  }> {
    const instances = this.getAllInstanceStatuses();

    return {
      summary: {
        totalInstances: instances.length,
        healthyInstances: instances.filter((i) => i.isHealthy).length,
        totalMemoryUsage: instances.reduce(
          (sum, i) => sum + i.memoryUsage.used,
          0,
        ),
        totalMaxMemory: instances.reduce(
          (sum, i) => sum + i.memoryUsage.max,
          0,
        ),
      },
      instances,
    };
  }

  async forceHealthCheck(instanceId?: string): Promise<void> {
    if (instanceId) {
      await this.performHealthCheck(instanceId);
    } else {
      const instances = this.redisConfig.getInstances();
      await Promise.all(
        instances.map((config) => this.performHealthCheck(config.id)),
      );
    }
  }

  // Emergency procedures

  async emergencyFailover(failedInstanceId: string): Promise<void> {
    this.logger.warn(
      `Initiating emergency failover for instance '${failedInstanceId}'`,
    );

    // Mark instance as inactive
    this.redisConfig.updateInstanceStatus(failedInstanceId, false);

    // Update local status
    this.updateInstanceStatus(failedInstanceId, {
      isConnected: false,
      isHealthy: false,
    });

    // Attempt to reconnect after a delay
    setTimeout(async () => {
      try {
        const instanceConfig = this.redisConfig.getInstance(failedInstanceId);
        if (instanceConfig) {
          await this.createInstance(instanceConfig);
          this.redisConfig.updateInstanceStatus(failedInstanceId, true);
          this.logger.log(
            `Instance '${failedInstanceId}' reconnected successfully`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to reconnect instance '${failedInstanceId}':`,
          error,
        );
      }
    }, 30000); // Wait 30 seconds before attempting reconnection
  }
}
