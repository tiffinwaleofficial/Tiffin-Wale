import { Injectable, Logger } from "@nestjs/common";
import {
  RedisConfigService,
  RedisDataCategory,
} from "../../config/redis-config";
import { RedisRegistryService } from "./redis-registry.service";
import Redis from "ioredis";

export interface LoadBalancingDecision {
  instanceId: string;
  instance: Redis;
  reason: string;
  confidence: number; // 0-1 scale
  alternativeInstances: string[];
}

export interface RebalancingPlan {
  sourceInstanceId: string;
  targetInstanceId: string;
  dataKeysToMove: string[];
  estimatedImpact: {
    sourceMemoryReduction: number; // in bytes
    targetMemoryIncrease: number; // in bytes
    estimatedMigrationTime: number; // in seconds
  };
}

export interface LoadBalancingMetrics {
  totalRequests: number;
  requestsPerInstance: Record<string, number>;
  averageResponseTime: number;
  rebalancingEvents: number;
  lastRebalancing: Date | null;
  efficiency: number; // 0-1 scale
}

@Injectable()
export class RedisLoadBalancerService {
  private readonly logger = new Logger(RedisLoadBalancerService.name);
  private readonly requestCounts = new Map<string, number>();
  private readonly recentDecisions = new Map<
    string,
    { instanceId: string; timestamp: Date; dataType: RedisDataCategory }[]
  >();
  private readonly rebalancingHistory: RebalancingPlan[] = [];
  private rebalancingInterval: NodeJS.Timeout | null = null;
  private metrics: LoadBalancingMetrics = {
    totalRequests: 0,
    requestsPerInstance: {},
    averageResponseTime: 0,
    rebalancingEvents: 0,
    lastRebalancing: null,
    efficiency: 1.0,
  };

  constructor(
    private readonly redisConfig: RedisConfigService,
    private readonly redisRegistry: RedisRegistryService,
  ) {
    this.initializeLoadBalancer();
  }

  private initializeLoadBalancer(): void {
    const config = this.redisConfig.getLoadBalancingConfig();
    const instances = this.redisConfig.getInstances();

    this.logger.log("⚖️ Initializing Smart Redis Load Balancer...");
    this.logger.log(`📊 Strategy: ${config.strategy.toUpperCase()}`);
    this.logger.log(`🎯 Capacity Threshold: ${config.capacityThreshold}%`);
    this.logger.log(
      `🔄 Auto-rebalancing: ${config.rebalanceEnabled ? "ENABLED" : "DISABLED"}`,
    );

    if (config.rebalanceEnabled) {
      this.startRebalancingScheduler(config.rebalanceInterval);
      this.logger.log(`⏰ Rebalancing interval: ${config.rebalanceInterval}s`);
    }

    // Initialize request counts for all instances
    for (const instance of instances) {
      this.requestCounts.set(instance.id, 0);
      this.metrics.requestsPerInstance[instance.id] = 0;
      this.logger.log(
        `📋 Registered instance '${instance.id}' for load balancing`,
      );
    }

    this.logger.log("✅ Smart Redis Load Balancer initialized successfully");
  }

  private startRebalancingScheduler(intervalSeconds: number): void {
    this.rebalancingInterval = setInterval(async () => {
      await this.performAutomaticRebalancing();
    }, intervalSeconds * 1000);

    this.logger.log(
      `Automatic rebalancing scheduled every ${intervalSeconds} seconds`,
    );
  }

  /**
   * Select the best Redis instance for a given data type and operation
   */
  async selectInstance(
    dataType: RedisDataCategory,
    operation: "read" | "write" | "delete" = "read",
    key?: string,
  ): Promise<LoadBalancingDecision> {
    const config = this.redisConfig.getLoadBalancingConfig();
    const availableInstances =
      this.redisRegistry.getInstancesForDataType(dataType);

    if (availableInstances.length === 0) {
      throw new Error(
        `No healthy Redis instances available for data type: ${dataType}`,
      );
    }

    if (availableInstances.length === 1) {
      const instanceId = this.getInstanceId(availableInstances[0]);
      return {
        instanceId,
        instance: availableInstances[0],
        reason: "Only available instance",
        confidence: 1.0,
        alternativeInstances: [],
      };
    }

    let decision: LoadBalancingDecision;

    switch (config.strategy) {
      case "round-robin":
        decision = await this.selectRoundRobin(availableInstances, dataType);
        break;
      case "least-used":
        decision = await this.selectLeastUsed(availableInstances, dataType);
        break;
      case "smart":
        decision = await this.selectSmart(
          availableInstances,
          dataType,
          operation,
          key,
        );
        break;
      case "data-type":
        decision = await this.selectByDataType(availableInstances, dataType);
        break;
      default:
        decision = await this.selectSmart(
          availableInstances,
          dataType,
          operation,
          key,
        );
    }

    // Track the decision
    this.trackDecision(decision, dataType);

    return decision;
  }

  private async selectRoundRobin(
    instances: Redis[],
    _dataType: RedisDataCategory,
  ): Promise<LoadBalancingDecision> {
    const instanceIds = instances.map((i) => this.getInstanceId(i));
    const totalRequests = this.metrics.totalRequests;
    const selectedIndex = totalRequests % instances.length;
    const selectedInstanceId = instanceIds[selectedIndex];

    return {
      instanceId: selectedInstanceId,
      instance: instances[selectedIndex],
      reason: "Round-robin selection",
      confidence: 0.7,
      alternativeInstances: instanceIds.filter(
        (id) => id !== selectedInstanceId,
      ),
    };
  }

  private async selectLeastUsed(
    instances: Redis[],
    _dataType: RedisDataCategory,
  ): Promise<LoadBalancingDecision> {
    const instanceStatuses = await Promise.all(
      instances.map(async (instance) => {
        const instanceId = this.getInstanceId(instance);
        const status = this.redisRegistry.getInstanceStatus(instanceId);
        return { instance, instanceId, status };
      }),
    );

    // Sort by memory usage (ascending) and request count (ascending)
    instanceStatuses.sort((a, b) => {
      const aMemoryWeight = a.status?.memoryUsage.percentage || 0;
      const bMemoryWeight = b.status?.memoryUsage.percentage || 0;
      const aRequestWeight = this.requestCounts.get(a.instanceId) || 0;
      const bRequestWeight = this.requestCounts.get(b.instanceId) || 0;

      // Combine memory usage and request count (60% memory, 40% requests)
      const aScore = aMemoryWeight * 0.6 + aRequestWeight * 0.4;
      const bScore = bMemoryWeight * 0.6 + bRequestWeight * 0.4;

      return aScore - bScore;
    });

    const selected = instanceStatuses[0];
    const alternatives = instanceStatuses.slice(1).map((s) => s.instanceId);

    return {
      instanceId: selected.instanceId,
      instance: selected.instance,
      reason: `Least used (Memory: ${selected.status?.memoryUsage.percentage.toFixed(1)}%, Requests: ${this.requestCounts.get(selected.instanceId) || 0})`,
      confidence: 0.85,
      alternativeInstances: alternatives,
    };
  }

  private async selectSmart(
    instances: Redis[],
    dataType: RedisDataCategory,
    operation: "read" | "write" | "delete",
    _key?: string,
  ): Promise<LoadBalancingDecision> {
    const config = this.redisConfig.getLoadBalancingConfig();
    const instanceScores = await Promise.all(
      instances.map(async (instance) => {
        const instanceId = this.getInstanceId(instance);
        const status = this.redisRegistry.getInstanceStatus(instanceId);
        const instanceConfig = this.redisConfig.getInstance(instanceId);

        if (!status || !instanceConfig) {
          return {
            instance,
            instanceId,
            score: 0,
            reasons: ["Status unavailable"],
          };
        }

        const reasons: string[] = [];
        let score = 100; // Start with perfect score

        // Memory usage factor (0-40 points penalty)
        const memoryPenalty = (status.memoryUsage.percentage / 100) * 40;
        score -= memoryPenalty;
        reasons.push(
          `Memory: -${memoryPenalty.toFixed(1)} (${status.memoryUsage.percentage.toFixed(1)}%)`,
        );

        // Performance factor (0-30 points penalty)
        const avgResponseTime = status.performance.avgResponseTime;
        const responsePenalty = Math.min((avgResponseTime / 100) * 30, 30); // Max 30 points penalty
        score -= responsePenalty;
        reasons.push(
          `Response: -${responsePenalty.toFixed(1)} (${avgResponseTime.toFixed(1)}ms)`,
        );

        // Error rate factor (0-20 points penalty)
        const errorPenalty = (status.performance.errorRate / 100) * 20;
        score -= errorPenalty;
        reasons.push(
          `Errors: -${errorPenalty.toFixed(1)} (${status.performance.errorRate.toFixed(1)}%)`,
        );

        // Data type affinity bonus (0-10 points bonus)
        const isPreferredDataType = instanceConfig.dataTypes.includes(dataType);
        if (isPreferredDataType) {
          score += 10;
          reasons.push("DataType: +10 (preferred)");
        }

        // Health check weight
        const healthBonus = status.isHealthy
          ? config.healthCheckWeight * 10
          : -50;
        score += healthBonus;
        reasons.push(
          `Health: ${healthBonus > 0 ? "+" : ""}${healthBonus.toFixed(1)}`,
        );

        // Recent usage pattern (sticky sessions for reads)
        if (operation === "read" && _key) {
          const recentDecisions = this.getRecentDecisionsForKey(_key);
          const wasRecentlyUsed = recentDecisions.some(
            (d) => d.instanceId === instanceId,
          );
          if (wasRecentlyUsed) {
            score += 5;
            reasons.push("Sticky: +5 (recent usage)");
          }
        }

        // Emergency threshold check
        if (status.memoryUsage.percentage > config.emergencyThreshold) {
          score -= 100; // Heavily penalize instances near capacity
          reasons.push(`Emergency: -100 (>${config.emergencyThreshold}%)`);
        }

        return { instance, instanceId, score: Math.max(0, score), reasons };
      }),
    );

    // Sort by score (descending)
    instanceScores.sort((a, b) => b.score - a.score);

    const selected = instanceScores[0];
    const alternatives = instanceScores.slice(1).map((s) => s.instanceId);

    // Calculate confidence based on score distribution
    const topScore = selected.score;
    const secondScore = instanceScores[1]?.score || 0;
    const confidence =
      topScore > 0 ? Math.min(1.0, (topScore - secondScore) / 100 + 0.5) : 0.1;

    return {
      instanceId: selected.instanceId,
      instance: selected.instance,
      reason: `Smart selection (Score: ${selected.score.toFixed(1)}) - ${selected.reasons.join(", ")}`,
      confidence,
      alternativeInstances: alternatives,
    };
  }

  private async selectByDataType(
    instances: Redis[],
    dataType: RedisDataCategory,
  ): Promise<LoadBalancingDecision> {
    // Get instances that have this data type as primary
    const primaryInstances = instances.filter((instance) => {
      const instanceId = this.getInstanceId(instance);
      const config = this.redisConfig.getInstance(instanceId);
      return config?.dataTypes[0] === dataType; // First data type is primary
    });

    const targetInstances =
      primaryInstances.length > 0 ? primaryInstances : instances;

    // Use least-used strategy among the filtered instances
    return this.selectLeastUsed(targetInstances, dataType);
  }

  private trackDecision(
    decision: LoadBalancingDecision,
    dataType: RedisDataCategory,
  ): void {
    // Increment request count
    const currentCount = this.requestCounts.get(decision.instanceId) || 0;
    this.requestCounts.set(decision.instanceId, currentCount + 1);

    // Update metrics
    this.metrics.totalRequests++;
    this.metrics.requestsPerInstance[decision.instanceId] = currentCount + 1;

    // Track recent decisions for sticky sessions
    const key = `${dataType}_recent`;
    const recentDecisions = this.recentDecisions.get(key) || [];
    recentDecisions.push({
      instanceId: decision.instanceId,
      timestamp: new Date(),
      dataType,
    });

    // Keep only last 100 decisions
    if (recentDecisions.length > 100) {
      recentDecisions.splice(0, recentDecisions.length - 100);
    }

    this.recentDecisions.set(key, recentDecisions);
  }

  private getRecentDecisionsForKey(
    _key: string,
  ): { instanceId: string; timestamp: Date; dataType: RedisDataCategory }[] {
    const allDecisions: {
      instanceId: string;
      timestamp: Date;
      dataType: RedisDataCategory;
    }[] = [];

    for (const decisions of this.recentDecisions.values()) {
      allDecisions.push(...decisions);
    }

    // Filter decisions from last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return allDecisions.filter((d) => d.timestamp > fiveMinutesAgo);
  }

  private getInstanceId(instance: Redis): string {
    // Extract instance ID from Redis connection
    const instances = this.redisConfig.getInstances();
    for (const config of instances) {
      const registryInstance = this.redisRegistry.getInstance(config.id);
      if (registryInstance === instance) {
        return config.id;
      }
    }
    return "unknown";
  }

  /**
   * Automatic rebalancing based on capacity and performance metrics
   */
  private async performAutomaticRebalancing(): Promise<void> {
    const config = this.redisConfig.getLoadBalancingConfig();
    const instanceStatuses = this.redisRegistry.getAllInstanceStatuses();

    // Find instances that need rebalancing
    const overloadedInstances = instanceStatuses.filter(
      (status) => status.memoryUsage.percentage > config.capacityThreshold,
    );

    const underutilizedInstances = instanceStatuses.filter(
      (status) =>
        status.memoryUsage.percentage < config.capacityThreshold * 0.5 &&
        status.isHealthy,
    );

    if (
      overloadedInstances.length === 0 ||
      underutilizedInstances.length === 0
    ) {
      return; // No rebalancing needed
    }

    this.logger.log(
      `Starting automatic rebalancing: ${overloadedInstances.length} overloaded, ${underutilizedInstances.length} underutilized instances`,
    );

    const rebalancingPlans: RebalancingPlan[] = [];

    for (const overloaded of overloadedInstances) {
      const targetInstance = underutilizedInstances.sort(
        (a, b) => a.memoryUsage.percentage - b.memoryUsage.percentage,
      )[0];

      if (targetInstance) {
        const plan = await this.createRebalancingPlan(
          overloaded.id,
          targetInstance.id,
        );
        if (plan) {
          rebalancingPlans.push(plan);
        }
      }
    }

    // Execute rebalancing plans
    for (const plan of rebalancingPlans) {
      try {
        await this.executeRebalancingPlan(plan);
        this.rebalancingHistory.push(plan);
        this.metrics.rebalancingEvents++;
        this.metrics.lastRebalancing = new Date();
      } catch (error) {
        this.logger.error(
          `Failed to execute rebalancing plan from ${plan.sourceInstanceId} to ${plan.targetInstanceId}:`,
          error,
        );
      }
    }

    if (rebalancingPlans.length > 0) {
      this.logger.log(
        `Completed automatic rebalancing: ${rebalancingPlans.length} plans executed`,
      );
    }
  }

  private async createRebalancingPlan(
    sourceInstanceId: string,
    targetInstanceId: string,
  ): Promise<RebalancingPlan | null> {
    const sourceInstance = this.redisRegistry.getInstance(sourceInstanceId);
    const targetInstance = this.redisRegistry.getInstance(targetInstanceId);

    if (!sourceInstance || !targetInstance) {
      return null;
    }

    try {
      // Get sample of keys from source instance (for estimation)
      const sampleKeys = await sourceInstance.randomkey();
      if (!sampleKeys) return null;

      // Estimate data to move (simplified approach)
      const keysToMove = [sampleKeys]; // In real implementation, use more sophisticated key selection

      const sourceStatus =
        this.redisRegistry.getInstanceStatus(sourceInstanceId);
      const targetStatus =
        this.redisRegistry.getInstanceStatus(targetInstanceId);

      if (!sourceStatus || !targetStatus) return null;

      const estimatedDataSize = sourceStatus.memoryUsage.used * 0.1; // Move 10% of data

      return {
        sourceInstanceId,
        targetInstanceId,
        dataKeysToMove: keysToMove,
        estimatedImpact: {
          sourceMemoryReduction: estimatedDataSize,
          targetMemoryIncrease: estimatedDataSize,
          estimatedMigrationTime: Math.ceil(keysToMove.length / 100), // 100 keys per second estimate
        },
      };
    } catch (error) {
      this.logger.error(`Failed to create rebalancing plan:`, error);
      return null;
    }
  }

  private async executeRebalancingPlan(plan: RebalancingPlan): Promise<void> {
    const sourceInstance = this.redisRegistry.getInstance(
      plan.sourceInstanceId,
    );
    const targetInstance = this.redisRegistry.getInstance(
      plan.targetInstanceId,
    );

    if (!sourceInstance || !targetInstance) {
      throw new Error("Source or target instance not available");
    }

    this.logger.log(
      `Executing rebalancing plan: moving ${plan.dataKeysToMove.length} keys from ${plan.sourceInstanceId} to ${plan.targetInstanceId}`,
    );

    for (const key of plan.dataKeysToMove) {
      try {
        // Get data from source
        const data = await sourceInstance.dump(key);
        const ttl = await sourceInstance.ttl(key);

        if (data) {
          // Restore to target
          await targetInstance.restore(key, ttl > 0 ? ttl * 1000 : 0, data);

          // Delete from source
          await sourceInstance.del(key);
        }
      } catch (error) {
        this.logger.error(`Failed to migrate key ${key}:`, error);
        // Continue with other keys
      }
    }
  }

  // Public API methods

  async getLoadBalancingMetrics(): Promise<LoadBalancingMetrics> {
    // Calculate current efficiency
    const instanceStatuses = this.redisRegistry.getAllInstanceStatuses();
    const memoryUsages = instanceStatuses.map((s) => s.memoryUsage.percentage);

    if (memoryUsages.length > 0) {
      const avgUsage =
        memoryUsages.reduce((sum, usage) => sum + usage, 0) /
        memoryUsages.length;
      const variance =
        memoryUsages.reduce(
          (sum, usage) => sum + Math.pow(usage - avgUsage, 2),
          0,
        ) / memoryUsages.length;
      const standardDeviation = Math.sqrt(variance);

      // Efficiency is inversely related to standard deviation (lower deviation = higher efficiency)
      this.metrics.efficiency = Math.max(0, 1 - standardDeviation / 100);
    }

    return { ...this.metrics };
  }

  async forceRebalancing(): Promise<void> {
    this.logger.log("Forcing immediate rebalancing...");
    await this.performAutomaticRebalancing();
  }

  getRebalancingHistory(): RebalancingPlan[] {
    return [...this.rebalancingHistory];
  }

  resetMetrics(): void {
    this.requestCounts.clear();
    this.recentDecisions.clear();
    this.metrics = {
      totalRequests: 0,
      requestsPerInstance: {},
      averageResponseTime: 0,
      rebalancingEvents: 0,
      lastRebalancing: null,
      efficiency: 1.0,
    };

    // Reinitialize request counts
    const instances = this.redisConfig.getInstances();
    for (const instance of instances) {
      this.requestCounts.set(instance.id, 0);
      this.metrics.requestsPerInstance[instance.id] = 0;
    }

    this.logger.log("Load balancing metrics reset");
  }

  // Emergency procedures

  async emergencyRebalancing(criticalInstanceId: string): Promise<void> {
    this.logger.warn(
      `Initiating emergency rebalancing for critical instance: ${criticalInstanceId}`,
    );

    const criticalStatus =
      this.redisRegistry.getInstanceStatus(criticalInstanceId);
    if (!criticalStatus) return;

    const healthyInstances = this.redisRegistry
      .getAllInstanceStatuses()
      .filter((s) => s.isHealthy && s.id !== criticalInstanceId)
      .sort((a, b) => a.memoryUsage.percentage - b.memoryUsage.percentage);

    if (healthyInstances.length === 0) {
      this.logger.error(
        "No healthy instances available for emergency rebalancing",
      );
      return;
    }

    // Create emergency rebalancing plan
    const targetInstance = healthyInstances[0];
    const plan = await this.createRebalancingPlan(
      criticalInstanceId,
      targetInstance.id,
    );

    if (plan) {
      await this.executeRebalancingPlan(plan);
      this.logger.log(
        `Emergency rebalancing completed for instance: ${criticalInstanceId}`,
      );
    }
  }

  destroy(): void {
    if (this.rebalancingInterval) {
      clearInterval(this.rebalancingInterval);
      this.rebalancingInterval = null;
    }
  }
}
