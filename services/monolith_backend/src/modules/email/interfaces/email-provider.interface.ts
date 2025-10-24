import { EmailData, EmailResult } from "./email.interface";

export interface EmailProviderInterface {
  /**
   * Provider name for identification
   */
  readonly name: string;

  /**
   * Initialize the provider with configuration
   */
  initialize(): Promise<void>;

  /**
   * Send a single email
   */
  sendEmail(emailData: EmailData, htmlContent: string): Promise<EmailResult>;

  /**
   * Send bulk emails
   */
  sendBulkEmails(
    emails: Array<{ emailData: EmailData; htmlContent: string }>,
  ): Promise<EmailResult[]>;

  /**
   * Check if provider is healthy and available
   */
  isHealthy(): Promise<boolean>;

  /**
   * Get provider-specific metadata
   */
  getMetadata(): {
    dailyLimit: number;
    enabled: boolean;
    fallbackThreshold: number;
  };
}

export interface EmailProviderStats {
  provider: string;
  emailsSentToday: number;
  dailyLimit: number;
  isEnabled: boolean;
  isHealthy: boolean;
  lastUsed?: Date;
  errorCount: number;
  isNearLimit?: boolean;
}

export interface EmailProviderSelection {
  provider: EmailProviderInterface;
  reason: "primary" | "fallback" | "only_available";
  stats: EmailProviderStats;
}

export enum EmailProviderType {
  RESEND = "resend",
  MAILJET = "mailjet",
}

export interface DailyEmailCounter {
  date: string;
  resendCount: number;
  mailjetCount: number;
  totalCount: number;
  lastReset: Date;
}
