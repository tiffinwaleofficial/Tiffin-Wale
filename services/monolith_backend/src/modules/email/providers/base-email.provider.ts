import { Logger } from "@nestjs/common";
import {
  EmailProviderInterface,
  EmailProviderStats,
} from "../interfaces/email-provider.interface";
import { EmailData, EmailResult } from "../interfaces/email.interface";

export abstract class BaseEmailProvider implements EmailProviderInterface {
  protected readonly logger: Logger;
  protected initialized = false;
  protected errorCount = 0;
  protected lastUsed?: Date;

  constructor(
    public readonly name: string,
    protected readonly config: {
      enabled: boolean;
      dailyLimit: number;
      fallbackThreshold: number;
    },
  ) {
    this.logger = new Logger(`${name}EmailProvider`);
  }

  abstract initialize(): Promise<void>;
  abstract sendEmail(
    emailData: EmailData,
    htmlContent: string,
  ): Promise<EmailResult>;
  abstract sendBulkEmails(
    emails: Array<{ emailData: EmailData; htmlContent: string }>,
  ): Promise<EmailResult[]>;
  abstract isHealthy(): Promise<boolean>;

  getMetadata() {
    return {
      dailyLimit: this.config.dailyLimit,
      enabled: this.config.enabled,
      fallbackThreshold: this.config.fallbackThreshold,
    };
  }

  protected handleError(error: any, context: string): EmailResult {
    this.errorCount++;
    this.logger.error(`${context}: ${error.message}`, error.stack);

    return {
      success: false,
      error: error.message,
    };
  }

  protected handleSuccess(messageId: string, context: string): EmailResult {
    this.lastUsed = new Date();
    this.logger.log(`${context}: Email sent successfully with ID ${messageId}`);

    return {
      success: true,
      messageId,
    };
  }

  protected validateEmailData(emailData: EmailData): void {
    if (!emailData.to) {
      throw new Error("Recipient email address is required");
    }
    if (!emailData.subject) {
      throw new Error("Email subject is required");
    }
    if (!emailData.template) {
      throw new Error("Email template is required");
    }
  }

  protected validateInitialization(): void {
    if (!this.initialized) {
      throw new Error(`${this.name} provider is not initialized`);
    }
    if (!this.config.enabled) {
      throw new Error(`${this.name} provider is disabled`);
    }
  }

  getStats(): EmailProviderStats {
    return {
      provider: this.name,
      emailsSentToday: 0, // This will be populated by the factory
      dailyLimit: this.config.dailyLimit,
      isEnabled: this.config.enabled,
      isHealthy: false, // This will be checked by the factory
      lastUsed: this.lastUsed,
      errorCount: this.errorCount,
    };
  }
}
