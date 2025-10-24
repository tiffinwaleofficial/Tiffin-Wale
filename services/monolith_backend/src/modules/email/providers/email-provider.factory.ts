import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  EmailProviderInterface,
  EmailProviderSelection,
  EmailProviderStats,
  EmailProviderType,
} from "../interfaces/email-provider.interface";
import { ResendEmailProvider } from "./resend.provider";
import { MailjetEmailProvider } from "./mailjet.provider";
import { EmailCounterService } from "../services/email-counter.service";
import { EmailConfig } from "../../../config/email.config";

@Injectable()
export class EmailProviderFactory implements OnModuleInit {
  private readonly logger = new Logger(EmailProviderFactory.name);
  private readonly providers = new Map<
    EmailProviderType,
    EmailProviderInterface
  >();
  private readonly emailConfig: EmailConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailCounterService: EmailCounterService,
    private readonly resendProvider: ResendEmailProvider,
    private readonly mailjetProvider: MailjetEmailProvider,
  ) {
    this.emailConfig = this.configService.get<EmailConfig>("email")!;
  }

  /**
   * Initialize all email providers
   */
  async onModuleInit(): Promise<void> {
    try {
      // Initialize Resend provider
      if (this.emailConfig.resend.enabled) {
        await this.resendProvider.initialize();
        this.providers.set(EmailProviderType.RESEND, this.resendProvider);
        this.logger.log("Resend provider initialized and registered");
      }

      // Initialize Mailjet provider
      if (this.emailConfig.mailjet.enabled) {
        await this.mailjetProvider.initialize();
        this.providers.set(EmailProviderType.MAILJET, this.mailjetProvider);
        this.logger.log("Mailjet provider initialized and registered");
      }

      if (this.providers.size === 0) {
        throw new Error("No email providers are enabled or configured");
      }

      this.logger.log(
        `Email provider factory initialized with ${this.providers.size} providers`,
      );
    } catch (error) {
      this.logger.error("Failed to initialize email providers:", error);
      throw error;
    }
  }

  /**
   * Select the best available email provider based on configuration and limits
   */
  async selectProvider(): Promise<EmailProviderSelection> {
    const availableProviders = await this.getAvailableProviders();

    if (availableProviders.length === 0) {
      throw new Error("No email providers are available");
    }

    // If only one provider is available, use it
    if (availableProviders.length === 1) {
      const providerType = availableProviders[0].provider as EmailProviderType;
      return {
        provider: this.providers.get(providerType)!,
        reason: "only_available",
        stats: availableProviders[0],
      };
    }

    // Check preferred provider first
    const preferredType =
      this.emailConfig.preferredProvider === "resend"
        ? EmailProviderType.RESEND
        : EmailProviderType.MAILJET;

    const preferredProvider = availableProviders.find(
      (p) => p.provider === preferredType,
    );

    if (preferredProvider && !preferredProvider.isNearLimit) {
      return {
        provider: this.providers.get(preferredType)!,
        reason: "primary",
        stats: preferredProvider,
      };
    }

    // If preferred provider is near limit or unavailable, use fallback
    const fallbackProvider = availableProviders.find(
      (p) => p.provider !== preferredType && !p.isNearLimit,
    );

    if (fallbackProvider) {
      this.logger.warn(
        `Switching to fallback provider ${fallbackProvider.provider} ` +
          `(preferred provider ${preferredType} is near limit or unavailable)`,
      );

      return {
        provider: this.providers.get(
          fallbackProvider.provider as EmailProviderType,
        )!,
        reason: "fallback",
        stats: fallbackProvider,
      };
    }

    // If all providers are near limit, use the one with the most capacity remaining
    const bestProvider = availableProviders.reduce((best, current) => {
      const bestRemaining = best.dailyLimit - best.emailsSentToday;
      const currentRemaining = current.dailyLimit - current.emailsSentToday;
      return currentRemaining > bestRemaining ? current : best;
    });

    this.logger.warn(
      `All providers are near their limits. Using ${bestProvider.provider} ` +
        `with ${bestProvider.dailyLimit - bestProvider.emailsSentToday} emails remaining`,
    );

    return {
      provider: this.providers.get(bestProvider.provider as EmailProviderType)!,
      reason: "fallback",
      stats: bestProvider,
    };
  }

  /**
   * Get statistics for all providers
   */
  async getProviderStats(): Promise<EmailProviderStats[]> {
    const stats: EmailProviderStats[] = [];
    const counter = await this.emailCounterService.getDailyCounter();

    for (const [type, provider] of this.providers) {
      const metadata = provider.getMetadata();
      const emailsSentToday =
        type === EmailProviderType.RESEND
          ? counter.resendCount
          : counter.mailjetCount;

      const isHealthy = await provider.isHealthy();
      const isNearLimit = await this.emailCounterService.isNearLimit(
        type,
        metadata.dailyLimit,
        metadata.fallbackThreshold,
      );

      stats.push({
        provider: type,
        emailsSentToday,
        dailyLimit: metadata.dailyLimit,
        isEnabled: metadata.enabled,
        isHealthy,
        lastUsed: undefined, // This would need to be tracked separately
        errorCount: 0, // This would need to be tracked separately
        isNearLimit,
      });
    }

    return stats;
  }

  /**
   * Get available providers (enabled, healthy, and not at limit)
   */
  private async getAvailableProviders(): Promise<EmailProviderStats[]> {
    const stats = await this.getProviderStats();

    return stats
      .filter((stat) => stat.isEnabled && stat.isHealthy)
      .filter((stat) => stat.emailsSentToday < stat.dailyLimit); // Exclude providers at limit
  }

  /**
   * Increment counter for a provider after successful email send
   */
  async incrementProviderCounter(
    providerType: EmailProviderType,
    count: number = 1,
  ): Promise<void> {
    await this.emailCounterService.incrementCounter(providerType, count);
  }

  /**
   * Get provider by type
   */
  getProvider(type: EmailProviderType): EmailProviderInterface | undefined {
    return this.providers.get(type);
  }

  /**
   * Check if any provider is available
   */
  async hasAvailableProvider(): Promise<boolean> {
    const available = await this.getAvailableProviders();
    return available.length > 0;
  }

  /**
   * Get total daily capacity across all providers
   */
  getTotalDailyCapacity(): number {
    let total = 0;

    if (this.emailConfig.resend.enabled) {
      total += this.emailConfig.resend.dailyLimit;
    }

    if (this.emailConfig.mailjet.enabled) {
      total += this.emailConfig.mailjet.dailyLimit;
    }

    return total;
  }

  /**
   * Get remaining capacity for today
   */
  async getRemainingCapacity(): Promise<number> {
    const counter = await this.emailCounterService.getDailyCounter();
    const totalCapacity = this.getTotalDailyCapacity();
    return Math.max(0, totalCapacity - counter.totalCount);
  }

  /**
   * Force refresh provider health status
   */
  async refreshProviderHealth(): Promise<void> {
    for (const [type, provider] of this.providers) {
      try {
        const isHealthy = await provider.isHealthy();
        this.logger.debug(
          `Provider ${type} health check: ${isHealthy ? "healthy" : "unhealthy"}`,
        );
      } catch (error) {
        this.logger.error(`Health check failed for provider ${type}:`, error);
      }
    }
  }

  /**
   * Get provider type from provider instance
   */
  getProviderType(
    provider: EmailProviderInterface,
  ): EmailProviderType | undefined {
    for (const [type, p] of this.providers) {
      if (p === provider) {
        return type;
      }
    }
    return undefined;
  }
}
