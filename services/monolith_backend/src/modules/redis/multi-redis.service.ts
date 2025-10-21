import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import {
  RedisConfigService,
  RedisDataCategory,
} from "../../config/redis-config";
import { RedisRegistryService } from "./redis-registry.service";
import {
  RedisLoadBalancerService,
  LoadBalancingDecision,
} from "./redis-load-balancer.service";
import Redis from "ioredis";

export interface CacheOptions {
  ttl?: number;
  category?: RedisDataCategory;
  operation?: "read" | "write" | "delete";
  forceInstance?: string;
  skipLoadBalancing?: boolean;
}

export interface CacheResult<T> {
  success: boolean;
  data?: T;
  instanceId?: string;
  fromCache: boolean;
  responseTime: number;
  error?: string;
}

export interface BatchOperation {
  key: string;
  value?: any;
  operation: "get" | "set" | "del";
  options?: CacheOptions;
}

export interface BatchResult {
  success: boolean;
  results: Array<{
    key: string;
    success: boolean;
    data?: any;
    error?: string;
    instanceId?: string;
  }>;
  totalTime: number;
  instancesUsed: string[];
}

export interface MigrationProgress {
  totalKeys: number;
  migratedKeys: number;
  failedKeys: number;
  currentKey?: string;
  estimatedTimeRemaining: number; // in seconds
  startTime: Date;
  errors: Array<{ key: string; error: string }>;
}

@Injectable()
export class MultiRedisService {
  private readonly logger = new Logger(MultiRedisService.name);
  private readonly inMemoryFallback = new Map<
    string,
    { value: any; expiry: number }
  >();
  private fallbackCleanupInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor(
    private readonly redisConfig: RedisConfigService,
    private readonly redisRegistry: RedisRegistryService,
    private readonly loadBalancer: RedisLoadBalancerService,
  ) {}

  private initialize() {
    if (this.isInitialized) return;
    
    this.logger.log("🚀 Initializing Multi-Redis Service Layer...");

    const globalConfig = this.redisConfig.getGlobalConfig();
    const instances = this.redisConfig.getInstances();

    this.logger.log(`🔧 Configuration Summary:`);
    this.logger.log(`   📊 Total Instances: ${instances.length}`);
    const totalCapacity = instances.reduce((sum, i) => sum + i.maxMemory, 0);
    this.logger.log(`   💾 Total Capacity: ${totalCapacity}MB`);
    this.logger.log(
      `   🎯 Load Balancing: ${globalConfig.loadBalancing.strategy}`,
    );
    this.logger.log(
      `   📈 Monitoring: ${globalConfig.monitoring.enabled ? "ENABLED" : "DISABLED"}`,
    );
    this.logger.log(
      `   🛡️ Fallback Cache: ${globalConfig.fallback.enabled ? "ENABLED" : "DISABLED"}`,
    );

    this.startFallbackCleanup();
    this.isInitialized = true;
    this.logger.log("✅ Multi-Redis Service Layer initialized successfully");
  }

  private startFallbackCleanup(): void {
    // Clean up expired in-memory cache entries every minute
    this.fallbackCleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.inMemoryFallback.entries()) {
        if (entry.expiry < now) {
          this.inMemoryFallback.delete(key);
        }
      }
    }, 60000);
  }

  /**
   * Set cache value with intelligent instance selection
   */
  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {},
  ): Promise<CacheResult<boolean>> {
    this.initialize(); // Lazy initialization
    const startTime = Date.now();
    const category = options.category || "default";

    try {
      let decision: LoadBalancingDecision;
      let redis: Redis;

      if (options.forceInstance) {
        redis = this.redisRegistry.getInstance(options.forceInstance);
        if (!redis) {
          throw new Error(
            `Forced instance '${options.forceInstance}' not available`,
          );
        }
        decision = {
          instanceId: options.forceInstance,
          instance: redis,
          reason: "Forced instance selection",
          confidence: 1.0,
          alternativeInstances: [],
        };
      } else if (options.skipLoadBalancing) {
        const instances = this.redisRegistry.getInstancesForDataType(category);
        if (instances.length === 0) {
          throw new Error(`No instances available for category: ${category}`);
        }
        redis = instances[0];
        decision = {
          instanceId: this.getInstanceId(redis),
          instance: redis,
          reason: "Skip load balancing - first available",
          confidence: 0.8,
          alternativeInstances: [],
        };
      } else {
        decision = await this.loadBalancer.selectInstance(
          category,
          options.operation || "write",
          key,
        );
        redis = decision.instance;
      }

      // Calculate TTL
      const ttl = this.calculateTTL(category, options.ttl);

      // Serialize value if needed
      const serializedValue = this.serializeValue(value);

      // Perform Redis operation
      if (ttl > 0) {
        await redis.setex(key, ttl, serializedValue);
      } else {
        await redis.set(key, serializedValue);
      }

      const responseTime = Date.now() - startTime;

      this.logger.debug(
        `Cache SET: ${key} on ${decision.instanceId} (TTL: ${ttl}s, Time: ${responseTime}ms) - ${decision.reason}`,
      );

      return {
        success: true,
        data: true,
        instanceId: decision.instanceId,
        fromCache: false,
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`Cache SET error for key ${key}:`, error);

      // Try fallback to in-memory cache
      if (this.shouldUseFallback()) {
        return this.setFallback(key, value, options, responseTime);
      }

      return {
        success: false,
        instanceId: undefined,
        fromCache: false,
        responseTime,
        error: error.message,
      };
    }
  }

  /**
   * Get cache value with intelligent instance selection
   */
  async get<T>(
    key: string,
    options: CacheOptions = {},
  ): Promise<CacheResult<T>> {
    this.initialize(); // Lazy initialization
    const startTime = Date.now();
    const category = options.category || "default";

    try {
      let decision: LoadBalancingDecision;
      let redis: Redis;

      if (options.forceInstance) {
        redis = this.redisRegistry.getInstance(options.forceInstance);
        if (!redis) {
          throw new Error(
            `Forced instance '${options.forceInstance}' not available`,
          );
        }
        decision = {
          instanceId: options.forceInstance,
          instance: redis,
          reason: "Forced instance selection",
          confidence: 1.0,
          alternativeInstances: [],
        };
      } else if (options.skipLoadBalancing) {
        const instances = this.redisRegistry.getInstancesForDataType(category);
        if (instances.length === 0) {
          throw new Error(`No instances available for category: ${category}`);
        }
        redis = instances[0];
        decision = {
          instanceId: this.getInstanceId(redis),
          instance: redis,
          reason: "Skip load balancing - first available",
          confidence: 0.8,
          alternativeInstances: [],
        };
      } else {
        decision = await this.loadBalancer.selectInstance(
          category,
          options.operation || "read",
          key,
        );
        redis = decision.instance;
      }

      // Perform Redis operation
      const rawValue = await redis.get(key);
      const responseTime = Date.now() - startTime;

      if (rawValue !== null) {
        const deserializedValue = this.deserializeValue<T>(rawValue);

        this.logger.debug(
          `Cache HIT: ${key} on ${decision.instanceId} (Time: ${responseTime}ms) - ${decision.reason}`,
        );

        return {
          success: true,
          data: deserializedValue,
          instanceId: decision.instanceId,
          fromCache: true,
          responseTime,
        };
      } else {
        this.logger.debug(
          `Cache MISS: ${key} on ${decision.instanceId} (Time: ${responseTime}ms)`,
        );

        return {
          success: true,
          data: undefined,
          instanceId: decision.instanceId,
          fromCache: false,
          responseTime,
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`Cache GET error for key ${key}:`, error);

      // Try fallback to in-memory cache
      if (this.shouldUseFallback()) {
        return this.getFallback<T>(key, responseTime);
      }

      return {
        success: false,
        instanceId: undefined,
        fromCache: false,
        responseTime,
        error: error.message,
      };
    }
  }

  /**
   * Delete cache key
   */
  async del(
    key: string,
    options: CacheOptions = {},
  ): Promise<CacheResult<number>> {
    const startTime = Date.now();
    const category = options.category || "default";

    try {
      const decision = await this.loadBalancer.selectInstance(
        category,
        "delete",
        key,
      );
      const redis = decision.instance;

      const deletedCount = await redis.del(key);
      const responseTime = Date.now() - startTime;

      // Also remove from fallback cache
      this.inMemoryFallback.delete(key);

      this.logger.debug(
        `Cache DEL: ${key} on ${decision.instanceId} (Deleted: ${deletedCount}, Time: ${responseTime}ms)`,
      );

      return {
        success: true,
        data: deletedCount,
        instanceId: decision.instanceId,
        fromCache: false,
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`Cache DEL error for key ${key}:`, error);

      // Remove from fallback cache anyway
      this.inMemoryFallback.delete(key);

      return {
        success: false,
        instanceId: undefined,
        fromCache: false,
        responseTime,
        error: error.message,
      };
    }
  }

  /**
   * Check if key exists
   */
  async exists(
    key: string,
    options: CacheOptions = {},
  ): Promise<CacheResult<boolean>> {
    const startTime = Date.now();
    const category = options.category || "default";

    try {
      const decision = await this.loadBalancer.selectInstance(
        category,
        "read",
        key,
      );
      const redis = decision.instance;

      const exists = await redis.exists(key);
      const responseTime = Date.now() - startTime;

      return {
        success: true,
        data: exists === 1,
        instanceId: decision.instanceId,
        fromCache: false,
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`Cache EXISTS error for key ${key}:`, error);

      // Check fallback cache
      if (this.shouldUseFallback()) {
        const fallbackExists = this.inMemoryFallback.has(key);
        return {
          success: true,
          data: fallbackExists,
          instanceId: "fallback",
          fromCache: true,
          responseTime,
        };
      }

      return {
        success: false,
        instanceId: undefined,
        fromCache: false,
        responseTime,
        error: error.message,
      };
    }
  }

  /**
   * Increment numeric value
   */
  async increment(
    key: string,
    amount: number = 1,
    options: CacheOptions = {},
  ): Promise<CacheResult<number>> {
    const startTime = Date.now();
    const category = options.category || "default";

    try {
      const decision = await this.loadBalancer.selectInstance(
        category,
        "write",
        key,
      );
      const redis = decision.instance;

      const newValue = await redis.incrby(key, amount);
      const responseTime = Date.now() - startTime;

      // Set TTL if specified
      const ttl = this.calculateTTL(category, options.ttl);
      if (ttl > 0) {
        await redis.expire(key, ttl);
      }

      return {
        success: true,
        data: newValue,
        instanceId: decision.instanceId,
        fromCache: false,
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`Cache INCREMENT error for key ${key}:`, error);

      return {
        success: false,
        instanceId: undefined,
        fromCache: false,
        responseTime,
        error: error.message,
      };
    }
  }

  /**
   * Batch operations for improved performance
   */
  async batch(operations: BatchOperation[]): Promise<BatchResult> {
    const startTime = Date.now();
    const results: BatchResult["results"] = [];
    const instancesUsed = new Set<string>();

    // Group operations by instance for optimal performance
    const operationsByInstance = new Map<string, BatchOperation[]>();

    for (const operation of operations) {
      try {
        const category = operation.options?.category || "default";
        const decision = await this.loadBalancer.selectInstance(
          category,
          operation.operation === "get" ? "read" : "write",
          operation.key,
        );

        instancesUsed.add(decision.instanceId);

        if (!operationsByInstance.has(decision.instanceId)) {
          operationsByInstance.set(decision.instanceId, []);
        }
        operationsByInstance.get(decision.instanceId)!.push(operation);
      } catch (error) {
        results.push({
          key: operation.key,
          success: false,
          error: error.message,
        });
      }
    }

    // Execute operations on each instance
    const batchPromises = Array.from(operationsByInstance.entries()).map(
      async ([instanceId, instanceOperations]) => {
        const redis = this.redisRegistry.getInstance(instanceId);
        if (!redis) {
          return instanceOperations.map((op) => ({
            key: op.key,
            success: false,
            error: `Instance ${instanceId} not available`,
            instanceId,
          }));
        }

        const pipeline = redis.pipeline();

        // Add operations to pipeline
        for (const operation of instanceOperations) {
          switch (operation.operation) {
            case "get":
              pipeline.get(operation.key);
              break;
            case "set":
              const ttl = this.calculateTTL(
                operation.options?.category || "default",
                operation.options?.ttl,
              );
              const serializedValue = this.serializeValue(operation.value);
              if (ttl > 0) {
                pipeline.setex(operation.key, ttl, serializedValue);
              } else {
                pipeline.set(operation.key, serializedValue);
              }
              break;
            case "del":
              pipeline.del(operation.key);
              break;
          }
        }

        try {
          const pipelineResults = await pipeline.exec();

          return instanceOperations.map((operation, index) => {
            const [error, result] = pipelineResults![index];

            if (error) {
              return {
                key: operation.key,
                success: false,
                error: error.message,
                instanceId,
              };
            }

            let processedResult = result;
            if (operation.operation === "get" && result) {
              processedResult = this.deserializeValue(result as string);
            }

            return {
              key: operation.key,
              success: true,
              data: processedResult,
              instanceId,
            };
          });
        } catch (error) {
          return instanceOperations.map((op) => ({
            key: op.key,
            success: false,
            error: error.message,
            instanceId,
          }));
        }
      },
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.flat());

    const totalTime = Date.now() - startTime;

    return {
      success: results.every((r) => r.success),
      results,
      totalTime,
      instancesUsed: Array.from(instancesUsed),
    };
  }

  /**
   * Cross-instance data migration
   */
  async migrateData(
    sourceInstanceId: string,
    targetInstanceId: string,
    keyPattern: string = "*",
    batchSize: number = 100,
  ): Promise<MigrationProgress> {
    const sourceInstance = this.redisRegistry.getInstance(sourceInstanceId);
    const targetInstance = this.redisRegistry.getInstance(targetInstanceId);

    if (!sourceInstance || !targetInstance) {
      throw new Error("Source or target instance not available");
    }

    const progress: MigrationProgress = {
      totalKeys: 0,
      migratedKeys: 0,
      failedKeys: 0,
      estimatedTimeRemaining: 0,
      startTime: new Date(),
      errors: [],
    };

    try {
      // Get all keys matching pattern
      const keys = await sourceInstance.keys(keyPattern);
      progress.totalKeys = keys.length;

      this.logger.log(
        `Starting migration of ${keys.length} keys from ${sourceInstanceId} to ${targetInstanceId}`,
      );

      // Process keys in batches
      for (let i = 0; i < keys.length; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);
        progress.currentKey = batch[0];

        const pipeline = sourceInstance.pipeline();

        // Get data and TTL for each key in batch
        for (const key of batch) {
          pipeline.dump(key);
          pipeline.ttl(key);
        }

        try {
          const results = await pipeline.exec();
          const targetPipeline = targetInstance.pipeline();

          // Process results in pairs (dump, ttl)
          for (let j = 0; j < batch.length; j++) {
            const key = batch[j];
            const dumpResult = results![j * 2];
            const ttlResult = results![j * 2 + 1];

            if (dumpResult[0] || ttlResult[0]) {
              progress.errors.push({
                key,
                error: "Failed to read from source",
              });
              progress.failedKeys++;
              continue;
            }

            const data = dumpResult[1] as Buffer;
            const ttl = ttlResult[1] as number;

            if (data) {
              // Restore to target with TTL
              targetPipeline.restore(key, ttl > 0 ? ttl * 1000 : 0, data);
            }
          }

          // Execute target pipeline
          const targetResults = await targetPipeline.exec();

          // Check results and delete from source if successful
          const sourceDeletions = sourceInstance.pipeline();

          for (let j = 0; j < batch.length; j++) {
            const key = batch[j];
            const targetResult = targetResults![j];

            if (targetResult && !targetResult[0]) {
              sourceDeletions.del(key);
              progress.migratedKeys++;
            } else {
              progress.errors.push({
                key,
                error: "Failed to restore to target",
              });
              progress.failedKeys++;
            }
          }

          await sourceDeletions.exec();
        } catch (error) {
          for (const key of batch) {
            progress.errors.push({ key, error: error.message });
            progress.failedKeys++;
          }
        }

        // Update estimated time remaining
        const elapsed = (Date.now() - progress.startTime.getTime()) / 1000;
        const processed = progress.migratedKeys + progress.failedKeys;
        const rate = processed / elapsed;
        progress.estimatedTimeRemaining =
          rate > 0 ? (progress.totalKeys - processed) / rate : 0;

        // Log progress every 1000 keys
        if (processed % 1000 === 0) {
          this.logger.log(
            `Migration progress: ${processed}/${progress.totalKeys} keys processed`,
          );
        }
      }

      this.logger.log(
        `Migration completed: ${progress.migratedKeys} successful, ${progress.failedKeys} failed`,
      );
    } catch (error) {
      this.logger.error("Migration failed:", error);
      throw error;
    }

    return progress;
  }

  // Helper methods

  private calculateTTL(
    category: RedisDataCategory,
    customTTL?: number,
  ): number {
    if (customTTL !== undefined) {
      return customTTL;
    }

    const ttlConfig = this.redisConfig.getTTLConfig(category);
    return ttlConfig.default;
  }

  private serializeValue(value: any): string {
    if (typeof value === "string") {
      return value;
    }
    return JSON.stringify(value);
  }

  private deserializeValue<T>(value: string): T {
    try {
      return JSON.parse(value);
    } catch {
      return value as unknown as T;
    }
  }

  private getInstanceId(instance: Redis): string {
    const instances = this.redisConfig.getInstances();
    for (const config of instances) {
      const registryInstance = this.redisRegistry.getInstance(config.id);
      if (registryInstance === instance) {
        return config.id;
      }
    }
    return "unknown";
  }

  private shouldUseFallback(): boolean {
    const globalConfig = this.redisConfig.getGlobalConfig();
    return globalConfig.fallback.enabled && globalConfig.fallback.inMemoryCache;
  }

  private setFallback<T>(
    key: string,
    value: T,
    options: CacheOptions,
    responseTime: number,
  ): CacheResult<boolean> {
    const globalConfig = this.redisConfig.getGlobalConfig();

    if (this.inMemoryFallback.size >= globalConfig.fallback.maxInMemoryItems) {
      // Remove oldest entry
      const firstKey = this.inMemoryFallback.keys().next().value;
      if (firstKey) {
        this.inMemoryFallback.delete(firstKey);
      }
    }

    const ttl = this.calculateTTL(options.category || "default", options.ttl);
    const expiry = Date.now() + ttl * 1000;

    this.inMemoryFallback.set(key, { value, expiry });

    this.logger.debug(`Fallback SET: ${key} (TTL: ${ttl}s)`);

    return {
      success: true,
      data: true,
      instanceId: "fallback",
      fromCache: false,
      responseTime,
    };
  }

  private getFallback<T>(key: string, responseTime: number): CacheResult<T> {
    const entry = this.inMemoryFallback.get(key);

    if (entry && entry.expiry > Date.now()) {
      this.logger.debug(`Fallback HIT: ${key}`);
      return {
        success: true,
        data: entry.value,
        instanceId: "fallback",
        fromCache: true,
        responseTime,
      };
    }

    if (entry) {
      // Remove expired entry
      this.inMemoryFallback.delete(key);
    }

    this.logger.debug(`Fallback MISS: ${key}`);
    return {
      success: true,
      data: undefined,
      instanceId: "fallback",
      fromCache: false,
      responseTime,
    };
  }

  // Public API methods for monitoring and management

  async getSystemStatus(): Promise<{
    instances: any[];
    loadBalancing: any;
    fallbackCache: {
      size: number;
      maxSize: number;
      hitRate: number;
    };
  }> {
    const instanceStatuses = this.redisRegistry.getAllInstanceStatuses();
    const loadBalancingMetrics =
      await this.loadBalancer.getLoadBalancingMetrics();
    const globalConfig = this.redisConfig.getGlobalConfig();

    return {
      instances: instanceStatuses,
      loadBalancing: loadBalancingMetrics,
      fallbackCache: {
        size: this.inMemoryFallback.size,
        maxSize: globalConfig.fallback.maxInMemoryItems,
        hitRate: 0, // TODO: Implement hit rate tracking
      },
    };
  }

  async clearAllCaches(): Promise<void> {
    const instances = this.redisConfig.getInstances();
    const clearPromises = instances.map(async (config) => {
      const redis = this.redisRegistry.getInstance(config.id);
      if (redis) {
        try {
          await redis.flushdb();
          this.logger.log(`Cleared cache for instance: ${config.id}`);
        } catch (error) {
          this.logger.error(
            `Failed to clear cache for instance ${config.id}:`,
            error,
          );
        }
      }
    });

    await Promise.all(clearPromises);

    // Clear fallback cache
    this.inMemoryFallback.clear();

    this.logger.log("All caches cleared");
  }

  destroy(): void {
    if (this.fallbackCleanupInterval) {
      clearInterval(this.fallbackCleanupInterval);
      this.fallbackCleanupInterval = null;
    }
    this.inMemoryFallback.clear();
  }
}
