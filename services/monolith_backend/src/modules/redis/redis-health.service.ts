import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { RedisConfigService } from "../../config/redis-config";
import {
  RedisRegistryService,
  RedisInstanceStatus,
} from "./redis-registry.service";
import { RedisLoadBalancerService } from "./redis-load-balancer.service";

export interface HealthCheckResult {
  instanceId: string;
  isHealthy: boolean;
  responseTime: number;
  timestamp: Date;
  checks: {
    connectivity: { passed: boolean; message: string };
    memory: { passed: boolean; message: string; usage: number };
    performance: { passed: boolean; message: string; avgResponseTime: number };
    errorRate: { passed: boolean; message: string; rate: number };
  };
  overallScore: number; // 0-100
}

export interface SystemHealthStatus {
  overall: "healthy" | "degraded" | "critical";
  timestamp: Date;
  summary: {
    totalInstances: number;
    healthyInstances: number;
    degradedInstances: number;
    criticalInstances: number;
    averageScore: number;
  };
  instances: HealthCheckResult[];
  recommendations: string[];
  autoRecoveryActions: Array<{
    action: string;
    instanceId?: string;
    executed: boolean;
    timestamp: Date;
    result?: string;
  }>;
}

export interface FailoverEvent {
  id: string;
  timestamp: Date;
  sourceInstanceId: string;
  targetInstanceId?: string;
  reason: string;
  status: "initiated" | "in-progress" | "completed" | "failed";
  duration?: number; // in milliseconds
  affectedOperations: number;
  recoveryActions: string[];
}

export interface AlertRule {
  id: string;
  name: string;
  condition: {
    metric: "memory" | "responseTime" | "errorRate" | "connectivity";
    operator: ">" | "<" | "=" | "!=" | ">=" | "<=";
    threshold: number;
    duration: number; // in seconds
  };
  severity: "info" | "warning" | "critical";
  enabled: boolean;
  cooldown: number; // in seconds
  lastTriggered?: Date;
}

@Injectable()
export class RedisHealthService implements OnModuleInit {
  private readonly logger = new Logger(RedisHealthService.name);
  private readonly healthHistory = new Map<string, HealthCheckResult[]>();
  private readonly failoverEvents: FailoverEvent[] = [];
  private readonly alertRules: AlertRule[] = [];
  private readonly activeAlerts = new Map<string, Date>();
  private readonly recoveryAttempts = new Map<string, number>();

  constructor(
    private readonly redisConfig: RedisConfigService,
    private readonly redisRegistry: RedisRegistryService,
    private readonly loadBalancer: RedisLoadBalancerService,
  ) {}

  async onModuleInit() {
    this.logger.log("Initializing Redis Health Service...");
    this.initializeDefaultAlertRules();
    this.logger.log("Redis Health Service initialized successfully");
  }

  private initializeDefaultAlertRules(): void {
    const monitoringConfig = this.redisConfig.getMonitoringConfig();

    this.alertRules.push(
      {
        id: "high-memory-usage",
        name: "High Memory Usage",
        condition: {
          metric: "memory",
          operator: ">",
          threshold: monitoringConfig.alertThresholds.memoryUsage,
          duration: 300, // 5 minutes
        },
        severity: "warning",
        enabled: true,
        cooldown: 600, // 10 minutes
      },
      {
        id: "critical-memory-usage",
        name: "Critical Memory Usage",
        condition: {
          metric: "memory",
          operator: ">",
          threshold: 95,
          duration: 60, // 1 minute
        },
        severity: "critical",
        enabled: true,
        cooldown: 300, // 5 minutes
      },
      {
        id: "high-response-time",
        name: "High Response Time",
        condition: {
          metric: "responseTime",
          operator: ">",
          threshold: monitoringConfig.alertThresholds.responseTime,
          duration: 180, // 3 minutes
        },
        severity: "warning",
        enabled: true,
        cooldown: 600, // 10 minutes
      },
      {
        id: "high-error-rate",
        name: "High Error Rate",
        condition: {
          metric: "errorRate",
          operator: ">",
          threshold: monitoringConfig.alertThresholds.errorRate,
          duration: 120, // 2 minutes
        },
        severity: "warning",
        enabled: true,
        cooldown: 300, // 5 minutes
      },
      {
        id: "connectivity-failure",
        name: "Connectivity Failure",
        condition: {
          metric: "connectivity",
          operator: "=",
          threshold: 0, // 0 = failed, 1 = success
          duration: 30, // 30 seconds
        },
        severity: "critical",
        enabled: true,
        cooldown: 60, // 1 minute
      },
    );
  }

  /**
   * Perform comprehensive health check on all instances
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async performHealthChecks(): Promise<SystemHealthStatus> {
    const timestamp = new Date();
    const instanceStatuses = this.redisRegistry.getAllInstanceStatuses();
    const healthResults: HealthCheckResult[] = [];

    // Perform health checks on each instance
    for (const status of instanceStatuses) {
      const healthResult = await this.checkInstanceHealth(status);
      healthResults.push(healthResult);

      // Store in history
      const history = this.healthHistory.get(status.id) || [];
      history.push(healthResult);

      // Keep only last 24 hours of data
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const filteredHistory = history.filter((h) => h.timestamp > cutoff);
      this.healthHistory.set(status.id, filteredHistory);

      // Check alert rules
      await this.checkAlertRules(healthResult);

      // Trigger auto-recovery if needed
      if (!healthResult.isHealthy && healthResult.overallScore < 30) {
        await this.triggerAutoRecovery(status.id, healthResult);
      }
    }

    // Calculate system-wide health
    const systemHealth = this.calculateSystemHealth(healthResults, timestamp);

    // Log health status
    this.logHealthStatus(systemHealth);

    return systemHealth;
  }

  /**
   * Check health of a specific instance
   */
  private async checkInstanceHealth(
    status: RedisInstanceStatus,
  ): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const instanceId = status.id;
    const redis = this.redisRegistry.getInstance(instanceId);

    const result: HealthCheckResult = {
      instanceId,
      isHealthy: false,
      responseTime: 0,
      timestamp: new Date(),
      checks: {
        connectivity: { passed: false, message: "" },
        memory: { passed: false, message: "", usage: 0 },
        performance: { passed: false, message: "", avgResponseTime: 0 },
        errorRate: { passed: false, message: "", rate: 0 },
      },
      overallScore: 0,
    };

    try {
      // Connectivity check
      if (redis && status.isConnected) {
        const pingStart = Date.now();
        const pong = await redis.ping();
        const pingTime = Date.now() - pingStart;

        if (pong === "PONG") {
          result.checks.connectivity.passed = true;
          result.checks.connectivity.message = `Connected (${pingTime}ms)`;
          result.responseTime = pingTime;
        } else {
          result.checks.connectivity.message = "Invalid ping response";
        }
      } else {
        result.checks.connectivity.message = "Instance not connected";
      }

      // Memory check
      const memoryUsage = status.memoryUsage.percentage;
      result.checks.memory.usage = memoryUsage;

      if (memoryUsage < 90) {
        result.checks.memory.passed = true;
        result.checks.memory.message = `Memory usage: ${memoryUsage.toFixed(1)}%`;
      } else if (memoryUsage < 95) {
        result.checks.memory.message = `High memory usage: ${memoryUsage.toFixed(1)}%`;
      } else {
        result.checks.memory.message = `Critical memory usage: ${memoryUsage.toFixed(1)}%`;
      }

      // Performance check
      const avgResponseTime = status.performance.avgResponseTime;
      result.checks.performance.avgResponseTime = avgResponseTime;

      if (avgResponseTime < 50) {
        result.checks.performance.passed = true;
        result.checks.performance.message = `Good performance: ${avgResponseTime}ms`;
      } else if (avgResponseTime < 100) {
        result.checks.performance.message = `Moderate performance: ${avgResponseTime}ms`;
      } else {
        result.checks.performance.message = `Poor performance: ${avgResponseTime}ms`;
      }

      // Error rate check
      const errorRate = status.performance.errorRate;
      result.checks.errorRate.rate = errorRate;

      if (errorRate < 1) {
        result.checks.errorRate.passed = true;
        result.checks.errorRate.message = `Low error rate: ${errorRate.toFixed(2)}%`;
      } else if (errorRate < 5) {
        result.checks.errorRate.message = `Moderate error rate: ${errorRate.toFixed(2)}%`;
      } else {
        result.checks.errorRate.message = `High error rate: ${errorRate.toFixed(2)}%`;
      }

      // Calculate overall score
      let score = 0;
      if (result.checks.connectivity.passed) score += 40;
      if (result.checks.memory.passed) score += 25;
      if (result.checks.performance.passed) score += 20;
      if (result.checks.errorRate.passed) score += 15;

      result.overallScore = score;
      result.isHealthy = score >= 70; // Healthy if score is 70 or above
    } catch (error) {
      result.checks.connectivity.message = `Health check failed: ${error.message}`;
      result.responseTime = Date.now() - startTime;
    }

    return result;
  }

  private calculateSystemHealth(
    healthResults: HealthCheckResult[],
    timestamp: Date,
  ): SystemHealthStatus {
    const healthyInstances = healthResults.filter((r) => r.isHealthy);
    const degradedInstances = healthResults.filter(
      (r) => !r.isHealthy && r.overallScore >= 40,
    );
    const criticalInstances = healthResults.filter((r) => r.overallScore < 40);

    const averageScore =
      healthResults.length > 0
        ? healthResults.reduce((sum, r) => sum + r.overallScore, 0) /
          healthResults.length
        : 0;

    let overall: "healthy" | "degraded" | "critical";
    if (criticalInstances.length > 0 || healthyInstances.length === 0) {
      overall = "critical";
    } else if (degradedInstances.length > 0 || averageScore < 80) {
      overall = "degraded";
    } else {
      overall = "healthy";
    }

    const recommendations = this.generateHealthRecommendations(
      healthResults,
      overall,
    );
    const autoRecoveryActions = this.getRecentAutoRecoveryActions();

    return {
      overall,
      timestamp,
      summary: {
        totalInstances: healthResults.length,
        healthyInstances: healthyInstances.length,
        degradedInstances: degradedInstances.length,
        criticalInstances: criticalInstances.length,
        averageScore: Math.round(averageScore),
      },
      instances: healthResults,
      recommendations,
      autoRecoveryActions,
    };
  }

  private async checkAlertRules(
    healthResult: HealthCheckResult,
  ): Promise<void> {
    for (const rule of this.alertRules) {
      if (!rule.enabled) continue;

      // Check cooldown
      const lastTriggered = this.activeAlerts.get(rule.id);
      if (
        lastTriggered &&
        Date.now() - lastTriggered.getTime() < rule.cooldown * 1000
      ) {
        continue;
      }

      let shouldTrigger = false;
      let currentValue = 0;

      // Get current metric value
      switch (rule.condition.metric) {
        case "memory":
          currentValue = healthResult.checks.memory.usage;
          break;
        case "responseTime":
          currentValue = healthResult.checks.performance.avgResponseTime;
          break;
        case "errorRate":
          currentValue = healthResult.checks.errorRate.rate;
          break;
        case "connectivity":
          currentValue = healthResult.checks.connectivity.passed ? 1 : 0;
          break;
      }

      // Check condition
      switch (rule.condition.operator) {
        case ">":
          shouldTrigger = currentValue > rule.condition.threshold;
          break;
        case "<":
          shouldTrigger = currentValue < rule.condition.threshold;
          break;
        case ">=":
          shouldTrigger = currentValue >= rule.condition.threshold;
          break;
        case "<=":
          shouldTrigger = currentValue <= rule.condition.threshold;
          break;
        case "=":
          shouldTrigger = currentValue === rule.condition.threshold;
          break;
        case "!=":
          shouldTrigger = currentValue !== rule.condition.threshold;
          break;
      }

      if (shouldTrigger) {
        await this.triggerAlert(rule, healthResult, currentValue);
      }
    }
  }

  private async triggerAlert(
    rule: AlertRule,
    healthResult: HealthCheckResult,
    currentValue: number,
  ): Promise<void> {
    this.activeAlerts.set(rule.id, new Date());

    const message =
      `Alert: ${rule.name} - Instance ${healthResult.instanceId} - ` +
      `${rule.condition.metric}: ${currentValue} ${rule.condition.operator} ${rule.condition.threshold}`;

    this.logger.warn(message);

    // Here you would typically send notifications (email, Slack, etc.)
    // For now, we'll just log the alert

    // Update rule's last triggered time
    rule.lastTriggered = new Date();
  }

  private async triggerAutoRecovery(
    instanceId: string,
    healthResult: HealthCheckResult,
  ): Promise<void> {
    const attempts = this.recoveryAttempts.get(instanceId) || 0;

    // Limit recovery attempts to prevent infinite loops
    if (attempts >= 3) {
      this.logger.error(
        `Max recovery attempts reached for instance ${instanceId}`,
      );
      return;
    }

    this.recoveryAttempts.set(instanceId, attempts + 1);

    this.logger.warn(
      `Initiating auto-recovery for instance ${instanceId} (attempt ${attempts + 1})`,
    );

    try {
      // Attempt to reconnect
      await this.redisRegistry.forceHealthCheck(instanceId);

      // If still unhealthy, trigger failover
      const updatedStatus = this.redisRegistry.getInstanceStatus(instanceId);
      if (!updatedStatus?.isHealthy) {
        await this.initiateFailover(
          instanceId,
          "Auto-recovery: Instance unhealthy",
        );
      }

      // Reset recovery attempts on successful recovery
      setTimeout(() => {
        this.recoveryAttempts.delete(instanceId);
      }, 300000); // Reset after 5 minutes
    } catch (error) {
      this.logger.error(
        `Auto-recovery failed for instance ${instanceId}:`,
        error,
      );
    }
  }

  private async initiateFailover(
    instanceId: string,
    reason: string,
  ): Promise<FailoverEvent> {
    const failoverEvent: FailoverEvent = {
      id: `failover_${Date.now()}_${instanceId}`,
      timestamp: new Date(),
      sourceInstanceId: instanceId,
      reason,
      status: "initiated",
      affectedOperations: 0,
      recoveryActions: [],
    };

    this.failoverEvents.push(failoverEvent);

    try {
      failoverEvent.status = "in-progress";

      // Mark source instance as inactive
      this.redisConfig.updateInstanceStatus(instanceId, false);
      failoverEvent.recoveryActions.push("Marked source instance as inactive");

      // Trigger emergency rebalancing
      await this.loadBalancer.emergencyRebalancing(instanceId);
      failoverEvent.recoveryActions.push("Triggered emergency rebalancing");

      // Attempt to restart the instance
      await this.redisRegistry.emergencyFailover(instanceId);
      failoverEvent.recoveryActions.push("Initiated instance restart");

      failoverEvent.status = "completed";
      failoverEvent.duration = Date.now() - failoverEvent.timestamp.getTime();

      this.logger.log(
        `Failover completed for instance ${instanceId} in ${failoverEvent.duration}ms`,
      );
    } catch (error) {
      failoverEvent.status = "failed";
      failoverEvent.recoveryActions.push(`Failover failed: ${error.message}`);

      this.logger.error(`Failover failed for instance ${instanceId}:`, error);
    }

    return failoverEvent;
  }

  private generateHealthRecommendations(
    healthResults: HealthCheckResult[],
    overallHealth: "healthy" | "degraded" | "critical",
  ): string[] {
    const recommendations: string[] = [];

    if (overallHealth === "critical") {
      recommendations.push(
        "Immediate attention required: System is in critical state",
      );
    }

    const unhealthyInstances = healthResults.filter((r) => !r.isHealthy);
    if (unhealthyInstances.length > 0) {
      recommendations.push(
        `${unhealthyInstances.length} instance(s) require attention`,
      );
    }

    const highMemoryInstances = healthResults.filter(
      (r) => r.checks.memory.usage > 85,
    );
    if (highMemoryInstances.length > 0) {
      recommendations.push("Consider scaling or optimizing memory usage");
    }

    const slowInstances = healthResults.filter(
      (r) => r.checks.performance.avgResponseTime > 100,
    );
    if (slowInstances.length > 0) {
      recommendations.push("Investigate performance bottlenecks");
    }

    const errorProneInstances = healthResults.filter(
      (r) => r.checks.errorRate.rate > 5,
    );
    if (errorProneInstances.length > 0) {
      recommendations.push("Review error patterns and fix underlying issues");
    }

    if (recommendations.length === 0) {
      recommendations.push("System is operating normally");
    }

    return recommendations;
  }

  private getRecentAutoRecoveryActions(): SystemHealthStatus["autoRecoveryActions"] {
    // Return recent failover events as auto-recovery actions
    const recentEvents = this.failoverEvents
      .filter(
        (event) => Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000,
      ) // Last 24 hours
      .slice(-10); // Last 10 events

    return recentEvents.map((event) => ({
      action: `Failover: ${event.reason}`,
      instanceId: event.sourceInstanceId,
      executed: event.status === "completed",
      timestamp: event.timestamp,
      result:
        event.status === "completed"
          ? "Success"
          : event.status === "failed"
            ? "Failed"
            : "In Progress",
    }));
  }

  private logHealthStatus(systemHealth: SystemHealthStatus): void {
    const { overall, summary } = systemHealth;

    if (overall === "critical") {
      this.logger.error(
        `Redis system health: CRITICAL - ${summary.healthyInstances}/${summary.totalInstances} healthy instances`,
      );
    } else if (overall === "degraded") {
      this.logger.warn(
        `Redis system health: DEGRADED - ${summary.healthyInstances}/${summary.totalInstances} healthy instances`,
      );
    } else {
      this.logger.log(
        `Redis system health: HEALTHY - ${summary.healthyInstances}/${summary.totalInstances} healthy instances`,
      );
    }
  }

  // Public API methods

  async getSystemHealth(): Promise<SystemHealthStatus> {
    return this.performHealthChecks();
  }

  async getInstanceHealth(
    instanceId: string,
  ): Promise<HealthCheckResult | undefined> {
    const status = this.redisRegistry.getInstanceStatus(instanceId);
    if (!status) return undefined;

    return this.checkInstanceHealth(status);
  }

  async getHealthHistory(
    instanceId: string,
    hours: number = 24,
  ): Promise<HealthCheckResult[]> {
    const history = this.healthHistory.get(instanceId) || [];
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

    return history.filter((h) => h.timestamp > cutoff);
  }

  async getFailoverHistory(hours: number = 24): Promise<FailoverEvent[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.failoverEvents.filter((event) => event.timestamp > cutoff);
  }

  async addAlertRule(rule: Omit<AlertRule, "id">): Promise<AlertRule> {
    const newRule: AlertRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    this.alertRules.push(newRule);
    this.logger.log(`Added new alert rule: ${newRule.name}`);

    return newRule;
  }

  async updateAlertRule(
    ruleId: string,
    updates: Partial<AlertRule>,
  ): Promise<boolean> {
    const ruleIndex = this.alertRules.findIndex((r) => r.id === ruleId);
    if (ruleIndex === -1) return false;

    Object.assign(this.alertRules[ruleIndex], updates);
    this.logger.log(`Updated alert rule: ${ruleId}`);

    return true;
  }

  async removeAlertRule(ruleId: string): Promise<boolean> {
    const ruleIndex = this.alertRules.findIndex((r) => r.id === ruleId);
    if (ruleIndex === -1) return false;

    this.alertRules.splice(ruleIndex, 1);
    this.logger.log(`Removed alert rule: ${ruleId}`);

    return true;
  }

  getAlertRules(): AlertRule[] {
    return [...this.alertRules];
  }

  async manualFailover(
    instanceId: string,
    reason: string,
  ): Promise<FailoverEvent> {
    this.logger.log(
      `Manual failover initiated for instance ${instanceId}: ${reason}`,
    );
    return this.initiateFailover(instanceId, `Manual failover: ${reason}`);
  }

  async clearRecoveryAttempts(instanceId?: string): Promise<void> {
    if (instanceId) {
      this.recoveryAttempts.delete(instanceId);
      this.logger.log(`Cleared recovery attempts for instance ${instanceId}`);
    } else {
      this.recoveryAttempts.clear();
      this.logger.log("Cleared all recovery attempts");
    }
  }
}

