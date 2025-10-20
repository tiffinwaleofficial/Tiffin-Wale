import { Injectable, Logger } from "@nestjs/common";

export interface PerformanceMetrics {
  phase: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  recordsProcessed: number;
  recordsPerSecond?: number;
  memoryUsed?: number;
  errors: number;
}

export interface SeederStats {
  totalDuration: number;
  totalRecords: number;
  phases: PerformanceMetrics[];
  averageRecordsPerSecond: number;
  peakMemoryUsage: number;
  errorCount: number;
}

@Injectable()
export class PerformanceMonitor {
  private readonly logger = new Logger(PerformanceMonitor.name);
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private globalStartTime: number = 0;

  startGlobalMonitoring(): void {
    this.globalStartTime = Date.now();
    this.metrics.clear();
    this.logger.log("🚀 Started global seeding performance monitoring");
  }

  startPhase(phase: string): void {
    const metric: PerformanceMetrics = {
      phase,
      startTime: Date.now(),
      recordsProcessed: 0,
      errors: 0,
      memoryUsed: this.getMemoryUsage(),
    };

    this.metrics.set(phase, metric);
    this.logger.log(`⏱️ Started monitoring phase: ${phase}`);
  }

  updatePhaseProgress(
    phase: string,
    recordsProcessed: number,
    errors: number = 0,
  ): void {
    const metric = this.metrics.get(phase);
    if (metric) {
      metric.recordsProcessed = recordsProcessed;
      metric.errors = errors;
    }
  }

  endPhase(phase: string): PerformanceMetrics | null {
    const metric = this.metrics.get(phase);
    if (!metric) {
      this.logger.warn(`No metric found for phase: ${phase}`);
      return null;
    }

    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.recordsPerSecond =
      metric.recordsProcessed / (metric.duration / 1000);
    metric.memoryUsed = this.getMemoryUsage();

    this.logger.log(
      `✅ Phase ${phase} completed: ${metric.recordsProcessed} records in ${metric.duration}ms ` +
        `(${metric.recordsPerSecond.toFixed(2)} records/sec)`,
    );

    return metric;
  }

  getGlobalStats(): SeederStats {
    const phases = Array.from(this.metrics.values()).filter((m) => m.endTime);
    const totalDuration = Date.now() - this.globalStartTime;
    const totalRecords = phases.reduce((sum, p) => sum + p.recordsProcessed, 0);
    const errorCount = phases.reduce((sum, p) => sum + p.errors, 0);
    const peakMemoryUsage = Math.max(...phases.map((p) => p.memoryUsed || 0));
    const averageRecordsPerSecond = totalRecords / (totalDuration / 1000);

    return {
      totalDuration,
      totalRecords,
      phases,
      averageRecordsPerSecond,
      peakMemoryUsage,
      errorCount,
    };
  }

  logGlobalStats(): void {
    const stats = this.getGlobalStats();

    this.logger.log("📊 Global Seeding Performance Report:");
    this.logger.log(`   Total Duration: ${stats.totalDuration}ms`);
    this.logger.log(`   Total Records: ${stats.totalRecords}`);
    this.logger.log(
      `   Average Speed: ${stats.averageRecordsPerSecond.toFixed(2)} records/sec`,
    );
    this.logger.log(
      `   Peak Memory: ${(stats.peakMemoryUsage / 1024 / 1024).toFixed(2)} MB`,
    );
    this.logger.log(`   Errors: ${stats.errorCount}`);

    this.logger.log("📋 Phase Breakdown:");
    stats.phases.forEach((phase) => {
      this.logger.log(
        `   ${phase.phase}: ${phase.recordsProcessed} records, ` +
          `${phase.duration}ms, ${phase.recordsPerSecond?.toFixed(2)} rec/sec`,
      );
    });
  }

  // Memory monitoring
  private getMemoryUsage(): number {
    const usage = process.memoryUsage();
    return usage.heapUsed;
  }

  logMemoryUsage(context: string): void {
    const usage = process.memoryUsage();
    this.logger.log(
      `💾 Memory usage (${context}): ` +
        `Heap: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB, ` +
        `Total: ${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    );
  }

  // Performance warnings
  checkPerformanceWarnings(phase: string): void {
    const metric = this.metrics.get(phase);
    if (!metric || !metric.recordsPerSecond) return;

    // Warn if processing is too slow
    if (metric.recordsPerSecond < 10) {
      this.logger.warn(
        `⚠️ Slow processing detected in ${phase}: ${metric.recordsPerSecond.toFixed(2)} records/sec`,
      );
    }

    // Warn if memory usage is high
    const memoryMB = (metric.memoryUsed || 0) / 1024 / 1024;
    if (memoryMB > 512) {
      this.logger.warn(
        `⚠️ High memory usage in ${phase}: ${memoryMB.toFixed(2)} MB`,
      );
    }

    // Warn if there are errors
    if (metric.errors > 0) {
      this.logger.warn(
        `⚠️ Errors detected in ${phase}: ${metric.errors} errors`,
      );
    }
  }

  // Batch processing helpers
  async processBatch<T>(
    items: T[],
    batchSize: number,
    processor: (batch: T[]) => Promise<number>,
    phase: string,
  ): Promise<number> {
    let totalProcessed = 0;
    let errorCount = 0;

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      try {
        const processed = await processor(batch);
        totalProcessed += processed;

        // Update progress
        this.updatePhaseProgress(phase, totalProcessed, errorCount);

        // Log progress every 5 batches
        if ((i / batchSize) % 5 === 0) {
          this.logger.log(
            `📈 ${phase} progress: ${totalProcessed}/${items.length} ` +
              `(${((totalProcessed / items.length) * 100).toFixed(1)}%)`,
          );
        }
      } catch (error) {
        errorCount++;
        this.logger.error(`Error processing batch in ${phase}:`, error);
      }
    }

    return totalProcessed;
  }

  // Estimate completion time
  estimateCompletion(phase: string, totalItems: number): string {
    const metric = this.metrics.get(phase);
    if (!metric || !metric.recordsPerSecond || metric.recordsProcessed === 0) {
      return "Calculating...";
    }

    const remaining = totalItems - metric.recordsProcessed;
    const estimatedSeconds = remaining / metric.recordsPerSecond;

    if (estimatedSeconds < 60) {
      return `~${Math.ceil(estimatedSeconds)}s`;
    } else if (estimatedSeconds < 3600) {
      return `~${Math.ceil(estimatedSeconds / 60)}m`;
    } else {
      return `~${Math.ceil(estimatedSeconds / 3600)}h`;
    }
  }
}
