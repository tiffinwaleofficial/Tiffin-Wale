import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { RedisConfigService } from "../../config/redis-config";
import {
  RedisRegistryService,
  RedisInstanceStatus,
} from "./redis-registry.service";
import { RedisLoadBalancerService } from "./redis-load-balancer.service";
import { MultiRedisService } from "./multi-redis.service";

export interface RedisAnalytics {
  timestamp: Date;
  summary: {
    totalInstances: number;
    healthyInstances: number;
    totalMemoryUsed: number;
    totalMemoryMax: number;
    memoryUtilization: number; // percentage
    totalOperations: number;
    averageResponseTime: number;
    totalErrors: number;
    errorRate: number; // percentage
  };
  instances: Array<{
    id: string;
    name: string;
    status: RedisInstanceStatus;
    performance: {
      operationsPerMinute: number;
      cacheHitRate: number;
      memoryEfficiency: number;
      connectionUtilization: number;
    };
    trends: {
      memoryGrowthRate: number; // MB per hour
      operationGrowthRate: number; // ops per minute growth
      errorTrend: "increasing" | "decreasing" | "stable";
    };
  }>;
  loadBalancing: {
    strategy: string;
    efficiency: number;
    rebalancingEvents: number;
    distributionBalance: number; // 0-1, where 1 is perfectly balanced
  };
  alerts: Array<{
    level: "info" | "warning" | "critical";
    message: string;
    instanceId?: string;
    timestamp: Date;
    resolved: boolean;
  }>;
  recommendations: Array<{
    type: "performance" | "capacity" | "configuration";
    priority: "low" | "medium" | "high";
    message: string;
    action: string;
    estimatedImpact: string;
  }>;
}

export interface HistoricalMetrics {
  timeRange: {
    start: Date;
    end: Date;
    interval: "minute" | "hour" | "day";
  };
  dataPoints: Array<{
    timestamp: Date;
    memoryUsage: Record<string, number>;
    operations: Record<string, number>;
    responseTime: Record<string, number>;
    errors: Record<string, number>;
  }>;
}

export interface CapacityPrediction {
  instanceId: string;
  currentUsage: number; // MB
  maxCapacity: number; // MB
  predictedUsage: {
    nextHour: number;
    nextDay: number;
    nextWeek: number;
  };
  timeToCapacity: {
    hours: number;
    confidence: number; // 0-1
  };
  recommendations: string[];
}

@Injectable()
export class RedisAnalyticsService {
  private readonly logger = new Logger(RedisAnalyticsService.name);
  private readonly historicalData = new Map<string, any[]>();
  private readonly alerts = new Map<string, any>();
  private readonly performanceHistory = new Map<
    string,
    Array<{
      timestamp: Date;
      memoryUsage: number;
      operations: number;
      responseTime: number;
      errors: number;
    }>
  >();

  constructor(
    private readonly redisConfig: RedisConfigService,
    private readonly redisRegistry: RedisRegistryService,
    private readonly loadBalancer: RedisLoadBalancerService,
    private readonly multiRedis: MultiRedisService,
  ) {}

  /**
   * Get comprehensive Redis analytics
   */
  async getAnalytics(): Promise<RedisAnalytics> {
    const timestamp = new Date();
    const instanceStatuses = this.redisRegistry.getAllInstanceStatuses();
    const loadBalancingMetrics =
      await this.loadBalancer.getLoadBalancingMetrics();
    const globalConfig = this.redisConfig.getGlobalConfig();

    // Calculate summary metrics
    const healthyInstances = instanceStatuses.filter((s) => s.isHealthy);
    const totalMemoryUsed = instanceStatuses.reduce(
      (sum, s) => sum + s.memoryUsage.used,
      0,
    );
    const totalMemoryMax = instanceStatuses.reduce(
      (sum, s) => sum + s.memoryUsage.max,
      0,
    );
    const totalOperations = instanceStatuses.reduce(
      (sum, s) => sum + s.stats.totalOperations,
      0,
    );
    const totalErrors = instanceStatuses.reduce(
      (sum, s) => sum + s.stats.totalErrors,
      0,
    );
    const avgResponseTime =
      instanceStatuses.length > 0
        ? instanceStatuses.reduce(
            (sum, s) => sum + s.performance.avgResponseTime,
            0,
          ) / instanceStatuses.length
        : 0;

    const summary = {
      totalInstances: instanceStatuses.length,
      healthyInstances: healthyInstances.length,
      totalMemoryUsed: Math.round(totalMemoryUsed / (1024 * 1024)), // Convert to MB
      totalMemoryMax: Math.round(totalMemoryMax / (1024 * 1024)), // Convert to MB
      memoryUtilization:
        totalMemoryMax > 0 ? (totalMemoryUsed / totalMemoryMax) * 100 : 0,
      totalOperations,
      averageResponseTime: Math.round(avgResponseTime * 100) / 100,
      totalErrors,
      errorRate:
        totalOperations > 0 ? (totalErrors / totalOperations) * 100 : 0,
    };

    // Analyze each instance
    const instances = await Promise.all(
      instanceStatuses.map(async (status) => {
        const instanceConfig = this.redisConfig.getInstance(status.id);
        const performance = await this.calculateInstancePerformance(status);
        const trends = await this.calculateInstanceTrends(status.id);

        return {
          id: status.id,
          name: instanceConfig?.name || status.id,
          status,
          performance,
          trends,
        };
      }),
    );

    // Calculate load balancing metrics
    const distributionBalance =
      this.calculateDistributionBalance(instanceStatuses);

    const loadBalancing = {
      strategy: globalConfig.loadBalancing.strategy,
      efficiency: loadBalancingMetrics.efficiency,
      rebalancingEvents: loadBalancingMetrics.rebalancingEvents,
      distributionBalance,
    };

    // Generate alerts
    const alerts = await this.generateAlerts(instanceStatuses, summary);

    // Generate recommendations
    const recommendations = await this.generateRecommendations(
      instanceStatuses,
      summary,
      loadBalancing,
    );

    return {
      timestamp,
      summary,
      instances,
      loadBalancing,
      alerts,
      recommendations,
    };
  }

  /**
   * Get historical metrics for a specific time range
   */
  async getHistoricalMetrics(
    startDate: Date,
    endDate: Date,
    interval: "minute" | "hour" | "day" = "hour",
  ): Promise<HistoricalMetrics> {
    const dataPoints: HistoricalMetrics["dataPoints"] = [];
    const instanceIds = this.redisConfig.getInstances().map((i) => i.id);

    // Generate time points based on interval
    const timePoints = this.generateTimePoints(startDate, endDate, interval);

    for (const timestamp of timePoints) {
      const memoryUsage: Record<string, number> = {};
      const operations: Record<string, number> = {};
      const responseTime: Record<string, number> = {};
      const errors: Record<string, number> = {};

      // Get historical data for each instance at this timestamp
      for (const instanceId of instanceIds) {
        const historicalPoint = await this.getHistoricalDataPoint(
          instanceId,
          timestamp,
        );

        memoryUsage[instanceId] = historicalPoint.memoryUsage;
        operations[instanceId] = historicalPoint.operations;
        responseTime[instanceId] = historicalPoint.responseTime;
        errors[instanceId] = historicalPoint.errors;
      }

      dataPoints.push({
        timestamp,
        memoryUsage,
        operations,
        responseTime,
        errors,
      });
    }

    return {
      timeRange: { start: startDate, end: endDate, interval },
      dataPoints,
    };
  }

  /**
   * Predict capacity requirements
   */
  async predictCapacity(): Promise<CapacityPrediction[]> {
    const instanceStatuses = this.redisRegistry.getAllInstanceStatuses();
    const predictions: CapacityPrediction[] = [];

    for (const status of instanceStatuses) {
      const historicalData = this.performanceHistory.get(status.id) || [];

      if (historicalData.length < 10) {
        // Not enough data for prediction
        predictions.push({
          instanceId: status.id,
          currentUsage: Math.round(status.memoryUsage.used / (1024 * 1024)),
          maxCapacity: Math.round(status.memoryUsage.max / (1024 * 1024)),
          predictedUsage: {
            nextHour: Math.round(status.memoryUsage.used / (1024 * 1024)),
            nextDay: Math.round(status.memoryUsage.used / (1024 * 1024)),
            nextWeek: Math.round(status.memoryUsage.used / (1024 * 1024)),
          },
          timeToCapacity: {
            hours: Infinity,
            confidence: 0,
          },
          recommendations: [
            "Insufficient historical data for accurate prediction",
          ],
        });
        continue;
      }

      // Calculate growth rate using linear regression (memory usage in MB)
      const growthRate = this.calculateGrowthRate(
        historicalData.map((h) => ({
          timestamp: h.timestamp,
          value: h.memoryUsage / (1024 * 1024), // Convert to MB
        })),
      );
      const currentUsageMB = status.memoryUsage.used / (1024 * 1024);
      const maxCapacityMB = status.memoryUsage.max / (1024 * 1024);

      const predictedUsage = {
        nextHour: Math.max(0, currentUsageMB + growthRate * 1),
        nextDay: Math.max(0, currentUsageMB + growthRate * 24),
        nextWeek: Math.max(0, currentUsageMB + growthRate * 24 * 7),
      };

      // Calculate time to capacity
      const timeToCapacity =
        growthRate > 0
          ? (maxCapacityMB - currentUsageMB) / growthRate
          : Infinity;

      const confidence = Math.min(1, historicalData.length / 100); // More data = higher confidence

      const recommendations = this.generateCapacityRecommendations(
        status.id,
        currentUsageMB,
        maxCapacityMB,
        growthRate,
        timeToCapacity,
      );

      predictions.push({
        instanceId: status.id,
        currentUsage: Math.round(currentUsageMB),
        maxCapacity: Math.round(maxCapacityMB),
        predictedUsage: {
          nextHour: Math.round(predictedUsage.nextHour),
          nextDay: Math.round(predictedUsage.nextDay),
          nextWeek: Math.round(predictedUsage.nextWeek),
        },
        timeToCapacity: {
          hours: Math.round(timeToCapacity),
          confidence: Math.round(confidence * 100) / 100,
        },
        recommendations,
      });
    }

    return predictions;
  }

  /**
   * Store performance metrics for historical analysis
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async collectMetrics(): Promise<void> {
    const instanceStatuses = this.redisRegistry.getAllInstanceStatuses();

    for (const status of instanceStatuses) {
      const history = this.performanceHistory.get(status.id) || [];

      history.push({
        timestamp: new Date(),
        memoryUsage: status.memoryUsage.used,
        operations: status.performance.operationsPerSecond,
        responseTime: status.performance.avgResponseTime,
        errors: status.performance.errorRate,
      });

      // Keep only last 24 hours of minute-level data
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const filteredHistory = history.filter((h) => h.timestamp > cutoff);

      this.performanceHistory.set(status.id, filteredHistory);
    }

    // Store aggregated hourly data
    await this.storeHourlyAggregates();
  }

  /**
   * Generate performance report
   */
  async generatePerformanceReport(): Promise<{
    executiveSummary: string;
    keyMetrics: Record<string, any>;
    instanceReports: Array<{
      instanceId: string;
      summary: string;
      metrics: Record<string, any>;
      recommendations: string[];
    }>;
    systemRecommendations: string[];
  }> {
    const analytics = await this.getAnalytics();
    const predictions = await this.predictCapacity();

    // Executive summary
    const executiveSummary = this.generateExecutiveSummary(analytics);

    // Key metrics
    const keyMetrics = {
      totalCapacity: `${analytics.summary.totalMemoryMax}MB`,
      utilization: `${analytics.summary.memoryUtilization.toFixed(1)}%`,
      performance: `${analytics.summary.averageResponseTime}ms avg response`,
      reliability: `${((analytics.summary.healthyInstances / analytics.summary.totalInstances) * 100).toFixed(1)}% uptime`,
      efficiency: `${(analytics.loadBalancing.efficiency * 100).toFixed(1)}% load balance efficiency`,
    };

    // Instance reports
    const instanceReports = analytics.instances.map((instance) => {
      const prediction = predictions.find((p) => p.instanceId === instance.id);

      return {
        instanceId: instance.id,
        summary: this.generateInstanceSummary(instance),
        metrics: {
          memoryUsage: `${instance.status.memoryUsage.percentage.toFixed(1)}%`,
          responseTime: `${instance.status.performance.avgResponseTime}ms`,
          errorRate: `${instance.status.performance.errorRate.toFixed(2)}%`,
          predictedGrowth: prediction
            ? `${prediction.predictedUsage.nextDay}MB in 24h`
            : "N/A",
        },
        recommendations: this.generateInstanceRecommendations(instance),
      };
    });

    // System recommendations
    const systemRecommendations = analytics.recommendations.map(
      (r) => r.message,
    );

    return {
      executiveSummary,
      keyMetrics,
      instanceReports,
      systemRecommendations,
    };
  }

  // Private helper methods

  private async calculateInstancePerformance(status: RedisInstanceStatus) {
    const history = this.performanceHistory.get(status.id) || [];

    // Calculate operations per minute from recent history
    const recentHistory = history.slice(-60); // Last 60 minutes
    const operationsPerMinute =
      recentHistory.length > 0
        ? (recentHistory.reduce((sum, h) => sum + h.operations, 0) /
            recentHistory.length) *
          60
        : status.performance.operationsPerSecond * 60;

    // Estimate cache hit rate (simplified)
    const cacheHitRate = Math.max(0, 100 - status.performance.errorRate * 10);

    // Memory efficiency (how well memory is being used)
    const memoryEfficiency =
      status.memoryUsage.percentage > 0
        ? Math.min(
            100,
            (operationsPerMinute / status.memoryUsage.percentage) * 10,
          )
        : 0;

    // Connection utilization (simplified)
    const connectionUtilization = Math.min(100, status.connectionCount * 10);

    return {
      operationsPerMinute: Math.round(operationsPerMinute),
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      memoryEfficiency: Math.round(memoryEfficiency * 100) / 100,
      connectionUtilization: Math.round(connectionUtilization * 100) / 100,
    };
  }

  private async calculateInstanceTrends(instanceId: string) {
    const history = this.performanceHistory.get(instanceId) || [];

    if (history.length < 10) {
      return {
        memoryGrowthRate: 0,
        operationGrowthRate: 0,
        errorTrend: "stable" as const,
      };
    }

    // Calculate memory growth rate (MB per hour)
    const memoryGrowthRate = this.calculateGrowthRate(
      history.map((h) => ({
        timestamp: h.timestamp,
        value: h.memoryUsage / (1024 * 1024), // Convert to MB
      })),
    );

    // Calculate operation growth rate
    const operationGrowthRate = this.calculateGrowthRate(
      history.map((h) => ({
        timestamp: h.timestamp,
        value: h.operations,
      })),
    );

    // Determine error trend
    const recentErrors = history.slice(-30).map((h) => h.errors);
    const olderErrors = history.slice(-60, -30).map((h) => h.errors);

    const recentAvg =
      recentErrors.reduce((sum, e) => sum + e, 0) / recentErrors.length;
    const olderAvg =
      olderErrors.reduce((sum, e) => sum + e, 0) / olderErrors.length;

    let errorTrend: "increasing" | "decreasing" | "stable";
    if (recentAvg > olderAvg * 1.1) {
      errorTrend = "increasing";
    } else if (recentAvg < olderAvg * 0.9) {
      errorTrend = "decreasing";
    } else {
      errorTrend = "stable";
    }

    return {
      memoryGrowthRate: Math.round(memoryGrowthRate * 100) / 100,
      operationGrowthRate: Math.round(operationGrowthRate * 100) / 100,
      errorTrend,
    };
  }

  private calculateDistributionBalance(
    instanceStatuses: RedisInstanceStatus[],
  ): number {
    if (instanceStatuses.length <= 1) return 1;

    const memoryUsages = instanceStatuses.map((s) => s.memoryUsage.percentage);
    const avgUsage =
      memoryUsages.reduce((sum, usage) => sum + usage, 0) / memoryUsages.length;

    // Calculate standard deviation
    const variance =
      memoryUsages.reduce(
        (sum, usage) => sum + Math.pow(usage - avgUsage, 2),
        0,
      ) / memoryUsages.length;
    const standardDeviation = Math.sqrt(variance);

    // Convert to balance score (lower deviation = higher balance)
    return Math.max(0, 1 - standardDeviation / 100);
  }

  private async generateAlerts(
    instanceStatuses: RedisInstanceStatus[],
    summary: any,
  ): Promise<RedisAnalytics["alerts"]> {
    const alerts: RedisAnalytics["alerts"] = [];
    const monitoringConfig = this.redisConfig.getMonitoringConfig();

    // Memory usage alerts
    for (const status of instanceStatuses) {
      if (
        status.memoryUsage.percentage >
        monitoringConfig.alertThresholds.memoryUsage
      ) {
        alerts.push({
          level: status.memoryUsage.percentage > 95 ? "critical" : "warning",
          message: `High memory usage on ${status.id}: ${status.memoryUsage.percentage.toFixed(1)}%`,
          instanceId: status.id,
          timestamp: new Date(),
          resolved: false,
        });
      }
    }

    // Response time alerts
    for (const status of instanceStatuses) {
      if (
        status.performance.avgResponseTime >
        monitoringConfig.alertThresholds.responseTime
      ) {
        alerts.push({
          level:
            status.performance.avgResponseTime > 500 ? "critical" : "warning",
          message: `High response time on ${status.id}: ${status.performance.avgResponseTime}ms`,
          instanceId: status.id,
          timestamp: new Date(),
          resolved: false,
        });
      }
    }

    // Error rate alerts
    for (const status of instanceStatuses) {
      if (
        status.performance.errorRate >
        monitoringConfig.alertThresholds.errorRate
      ) {
        alerts.push({
          level: status.performance.errorRate > 10 ? "critical" : "warning",
          message: `High error rate on ${status.id}: ${status.performance.errorRate.toFixed(2)}%`,
          instanceId: status.id,
          timestamp: new Date(),
          resolved: false,
        });
      }
    }

    // System-wide alerts
    if (summary.healthyInstances < summary.totalInstances) {
      alerts.push({
        level: "critical",
        message: `${summary.totalInstances - summary.healthyInstances} Redis instance(s) unhealthy`,
        timestamp: new Date(),
        resolved: false,
      });
    }

    return alerts;
  }

  private async generateRecommendations(
    instanceStatuses: RedisInstanceStatus[],
    summary: any,
    loadBalancing: any,
  ): Promise<RedisAnalytics["recommendations"]> {
    const recommendations: RedisAnalytics["recommendations"] = [];

    // Memory optimization recommendations
    if (summary.memoryUtilization > 80) {
      recommendations.push({
        type: "capacity",
        priority: "high",
        message: "System memory utilization is high",
        action:
          "Consider adding more Redis instances or increasing memory limits",
        estimatedImpact:
          "Improved performance and reduced risk of memory exhaustion",
      });
    }

    // Load balancing recommendations
    if (loadBalancing.efficiency < 0.7) {
      recommendations.push({
        type: "configuration",
        priority: "medium",
        message: "Load balancing efficiency is suboptimal",
        action:
          "Review load balancing strategy and instance data type assignments",
        estimatedImpact:
          "Better resource utilization and improved response times",
      });
    }

    // Performance recommendations
    if (summary.averageResponseTime > 50) {
      recommendations.push({
        type: "performance",
        priority: "medium",
        message: "Average response time is elevated",
        action: "Optimize queries, review network latency, or scale instances",
        estimatedImpact: "Faster application response times",
      });
    }

    return recommendations;
  }

  private calculateGrowthRate(
    data: Array<{ timestamp: Date; value: number }>,
  ): number {
    if (data.length < 2) return 0;

    // Simple linear regression to calculate growth rate per hour
    const n = data.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;

    for (let i = 0; i < n; i++) {
      const x = i; // Time index
      const y = data[i].value;

      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    // Convert to per-hour rate (assuming data points are per minute)
    return slope * 60;
  }

  private generateTimePoints(
    startDate: Date,
    endDate: Date,
    interval: "minute" | "hour" | "day",
  ): Date[] {
    const points: Date[] = [];
    const current = new Date(startDate);

    const incrementMs = {
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
    }[interval];

    while (current <= endDate) {
      points.push(new Date(current));
      current.setTime(current.getTime() + incrementMs);
    }

    return points;
  }

  private async getHistoricalDataPoint(instanceId: string, timestamp: Date) {
    const history = this.performanceHistory.get(instanceId) || [];

    // Find closest data point to the timestamp
    const closest = history.reduce(
      (prev, curr) => {
        const prevDiff = Math.abs(
          prev.timestamp.getTime() - timestamp.getTime(),
        );
        const currDiff = Math.abs(
          curr.timestamp.getTime() - timestamp.getTime(),
        );
        return currDiff < prevDiff ? curr : prev;
      },
      history[0] || {
        timestamp,
        memoryUsage: 0,
        operations: 0,
        responseTime: 0,
        errors: 0,
      },
    );

    return {
      memoryUsage: closest.memoryUsage / (1024 * 1024), // Convert to MB
      operations: closest.operations,
      responseTime: closest.responseTime,
      errors: closest.errors,
    };
  }

  private generateCapacityRecommendations(
    instanceId: string,
    currentUsage: number,
    maxCapacity: number,
    growthRate: number,
    timeToCapacity: number,
  ): string[] {
    const recommendations: string[] = [];
    const utilizationPercent = (currentUsage / maxCapacity) * 100;

    if (utilizationPercent > 90) {
      recommendations.push(
        "Critical: Memory usage is very high, immediate action required",
      );
    } else if (utilizationPercent > 80) {
      recommendations.push("Warning: Memory usage is high, monitor closely");
    }

    if (timeToCapacity < 24) {
      recommendations.push("Urgent: Will reach capacity within 24 hours");
    } else if (timeToCapacity < 168) {
      // 1 week
      recommendations.push("Plan capacity expansion within the next week");
    }

    if (growthRate > 1) {
      // Growing more than 1MB per hour
      recommendations.push(
        "High growth rate detected, consider proactive scaling",
      );
    }

    if (recommendations.length === 0) {
      recommendations.push("Instance is operating within normal parameters");
    }

    return recommendations;
  }

  private async storeHourlyAggregates(): Promise<void> {
    // This would typically store to a time-series database
    // For now, we'll just log the aggregation
    const currentHour = new Date();
    currentHour.setMinutes(0, 0, 0);

    this.logger.debug(
      `Storing hourly aggregates for ${currentHour.toISOString()}`,
    );
  }

  private generateExecutiveSummary(analytics: RedisAnalytics): string {
    const { summary, loadBalancing, alerts } = analytics;
    const criticalAlerts = alerts.filter((a) => a.level === "critical").length;
    const warningAlerts = alerts.filter((a) => a.level === "warning").length;

    return (
      `Redis system operating with ${summary.healthyInstances}/${summary.totalInstances} healthy instances. ` +
      `Memory utilization at ${summary.memoryUtilization.toFixed(1)}% (${summary.totalMemoryUsed}MB/${summary.totalMemoryMax}MB). ` +
      `Average response time: ${summary.averageResponseTime}ms. ` +
      `Load balancing efficiency: ${(loadBalancing.efficiency * 100).toFixed(1)}%. ` +
      `Active alerts: ${criticalAlerts} critical, ${warningAlerts} warnings.`
    );
  }

  private generateInstanceSummary(instance: any): string {
    const { status } = instance;
    return (
      `Instance ${instance.id} is ${status.isHealthy ? "healthy" : "unhealthy"} with ` +
      `${status.memoryUsage.percentage.toFixed(1)}% memory usage and ` +
      `${status.performance.avgResponseTime}ms average response time.`
    );
  }

  private generateInstanceRecommendations(instance: any): string[] {
    const recommendations: string[] = [];
    const { status, trends } = instance;

    if (status.memoryUsage.percentage > 80) {
      recommendations.push("Consider memory optimization or scaling");
    }

    if (status.performance.avgResponseTime > 100) {
      recommendations.push("Investigate performance bottlenecks");
    }

    if (trends.errorTrend === "increasing") {
      recommendations.push(
        "Monitor error patterns and investigate root causes",
      );
    }

    if (trends.memoryGrowthRate > 2) {
      recommendations.push(
        "High memory growth rate - plan for capacity expansion",
      );
    }

    return recommendations.length > 0
      ? recommendations
      : ["Instance operating normally"];
  }
}
