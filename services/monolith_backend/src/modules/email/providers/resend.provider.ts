import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";
import { BaseEmailProvider } from "./base-email.provider";
import { EmailData, EmailResult } from "../interfaces/email.interface";
import { EmailConfig } from "../../../config/email.config";

@Injectable()
export class ResendEmailProvider extends BaseEmailProvider {
  private resend: Resend;
  private readonly resendConfig: EmailConfig["resend"];

  constructor(private readonly configService: ConfigService) {
    const emailConfig = configService.get<EmailConfig>("email")!;
    super("Resend", emailConfig.resend);
    this.resendConfig = emailConfig.resend;
  }

  async initialize(): Promise<void> {
    try {
      if (!this.resendConfig.apiKey) {
        throw new Error("Resend API key is not configured");
      }

      this.resend = new Resend(this.resendConfig.apiKey);
      this.initialized = true;
      this.logger.log("Resend email provider initialized successfully");
    } catch (error) {
      this.logger.error("Failed to initialize Resend provider:", error);
      throw error;
    }
  }

  async sendEmail(
    emailData: EmailData,
    htmlContent: string,
  ): Promise<EmailResult> {
    try {
      this.validateInitialization();
      this.validateEmailData(emailData);

      // For Resend, we can send HTML directly or use React components
      // Since we already have HTML content, we'll use it directly
      const response = await this.resend.emails.send({
        from: emailData.from || "noreply@tiffin-wale.com",
        to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
        subject: emailData.subject,
        html: htmlContent,
        cc: emailData.cc,
        bcc: emailData.bcc,
        replyTo: emailData.replyTo,
      });

      if (response.error) {
        throw new Error(`Resend API error: ${response.error.message}`);
      }

      return this.handleSuccess(
        response.data?.id || "unknown",
        "Resend email sent",
      );
    } catch (error) {
      return this.handleError(error, "Resend email send failed");
    }
  }

  async sendBulkEmails(
    emails: Array<{ emailData: EmailData; htmlContent: string }>,
  ): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    // Resend doesn't have native bulk send, so we send individually
    for (const { emailData, htmlContent } of emails) {
      try {
        const result = await this.sendEmail(emailData, htmlContent);
        results.push(result);
      } catch (error) {
        results.push(
          this.handleError(
            error,
            `Resend bulk email failed for ${emailData.to}`,
          ),
        );
      }
    }

    return results;
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.initialized || !this.resendConfig.enabled) {
        return false;
      }

      // Simple health check - we can't really test Resend without sending an email
      // So we just check if we have the API key and the service is initialized
      return !!this.resend && !!this.resendConfig.apiKey;
    } catch (error) {
      this.logger.error("Resend health check failed:", error);
      return false;
    }
  }
}
