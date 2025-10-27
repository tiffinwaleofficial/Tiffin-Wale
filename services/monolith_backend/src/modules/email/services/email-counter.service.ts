import { Injectable, Logger, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import {
  DailyEmailCounter,
  EmailProviderType,
} from "../interfaces/email-provider.interface";

@Injectable()
export class EmailCounterService {
  private readonly logger = new Logger(EmailCounterService.name);
  private readonly COUNTER_KEY_PREFIX = "email_counter";
  private readonly COUNTER_TTL = 24 * 60 * 60; // 24 hours in seconds

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get current daily email counter
   */
  async getDailyCounter(): Promise<DailyEmailCounter> {
    const today = this.getTodayKey();
    const key = `${this.COUNTER_KEY_PREFIX}:${today}`;

    try {
      const cached = await this.cacheManager.get<DailyEmailCounter>(key);

      if (cached) {
        return cached;
      }

      // Initialize new counter for today
      const newCounter: DailyEmailCounter = {
        date: today,
        resendCount: 0,
        mailjetCount: 0,
        totalCount: 0,
        lastReset: new Date(),
      };

      await this.cacheManager.set(key, newCounter, this.COUNTER_TTL);
      return newCounter;
    } catch (error) {
      this.logger.error("Failed to get daily counter from cache:", error);

      // Return default counter if cache fails
      return {
        date: today,
        resendCount: 0,
        mailjetCount: 0,
        totalCount: 0,
        lastReset: new Date(),
      };
    }
  }

  /**
   * Increment email counter for specific provider
   */
  async incrementCounter(
    provider: EmailProviderType,
    count: number = 1,
  ): Promise<DailyEmailCounter> {
    const today = this.getTodayKey();
    const key = `${this.COUNTER_KEY_PREFIX}:${today}`;

    try {
      const counter = await this.getDailyCounter();

      // Update counters
      if (provider === EmailProviderType.RESEND) {
        counter.resendCount += count;
      } else if (provider === EmailProviderType.MAILJET) {
        counter.mailjetCount += count;
      }

      counter.totalCount = counter.resendCount + counter.mailjetCount;

      // Save updated counter
      await this.cacheManager.set(key, counter, this.COUNTER_TTL);

      this.logger.debug(
        `Incremented ${provider} counter by ${count}. New totals: Resend=${counter.resendCount}, Mailjet=${counter.mailjetCount}`,
      );

      return counter;
    } catch (error) {
      this.logger.error(`Failed to increment counter for ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Get email count for specific provider
   */
  async getProviderCount(provider: EmailProviderType): Promise<number> {
    const counter = await this.getDailyCounter();

    switch (provider) {
      case EmailProviderType.RESEND:
        return counter.resendCount;
      case EmailProviderType.MAILJET:
        return counter.mailjetCount;
      default:
        return 0;
    }
  }

  /**
   * Check if provider is near its daily limit
   */
  async isNearLimit(
    provider: EmailProviderType,
    dailyLimit: number,
    threshold: number = 0.9,
  ): Promise<boolean> {
    const count = await this.getProviderCount(provider);
    const limitThreshold = Math.floor(dailyLimit * threshold);

    return count >= limitThreshold;
  }

  /**
   * Check if provider has reached its daily limit
   */
  async hasReachedLimit(
    provider: EmailProviderType,
    dailyLimit: number,
  ): Promise<boolean> {
    const count = await this.getProviderCount(provider);
    return count >= dailyLimit;
  }

  /**
   * Reset counters (useful for testing or manual reset)
   */
  async resetCounters(): Promise<void> {
    const today = this.getTodayKey();
    const key = `${this.COUNTER_KEY_PREFIX}:${today}`;

    try {
      const resetCounter: DailyEmailCounter = {
        date: today,
        resendCount: 0,
        mailjetCount: 0,
        totalCount: 0,
        lastReset: new Date(),
      };

      await this.cacheManager.set(key, resetCounter, this.COUNTER_TTL);
      this.logger.log("Email counters reset successfully");
    } catch (error) {
      this.logger.error("Failed to reset counters:", error);
      throw error;
    }
  }

  /**
   * Get statistics for all providers
   */
  async getStatistics(): Promise<{
    counter: DailyEmailCounter;
    resendPercentage: number;
    mailjetPercentage: number;
  }> {
    const counter = await this.getDailyCounter();

    const resendPercentage =
      counter.totalCount > 0
        ? (counter.resendCount / counter.totalCount) * 100
        : 0;

    const mailjetPercentage =
      counter.totalCount > 0
        ? (counter.mailjetCount / counter.totalCount) * 100
        : 0;

    return {
      counter,
      resendPercentage: Math.round(resendPercentage * 100) / 100,
      mailjetPercentage: Math.round(mailjetPercentage * 100) / 100,
    };
  }

  /**
   * Clean up old counters (older than 7 days)
   */
  async cleanupOldCounters(): Promise<void> {
    try {
      const now = new Date();
      const daysToKeep = 7;

      for (let i = 1; i <= 30; i++) {
        // Check last 30 days for cleanup
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        if (i > daysToKeep) {
          const dateKey = this.formatDateKey(date);
          const key = `${this.COUNTER_KEY_PREFIX}:${dateKey}`;
          await this.cacheManager.del(key);
        }
      }

      this.logger.debug("Old email counters cleaned up");
    } catch (error) {
      this.logger.error("Failed to cleanup old counters:", error);
    }
  }

  /**
   * Get today's date key in YYYY-MM-DD format
   */
  private getTodayKey(): string {
    return this.formatDateKey(new Date());
  }

  /**
   * Format date to YYYY-MM-DD string
   */
  private formatDateKey(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  /**
   * Schedule automatic cleanup (called by cron job or scheduler)
   */
  async scheduleCleanup(): Promise<void> {
    // This method can be called by a cron job to clean up old data
    await this.cleanupOldCounters();
  }
}
