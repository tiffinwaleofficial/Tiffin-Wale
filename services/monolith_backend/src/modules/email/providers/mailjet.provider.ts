import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Mailjet from "node-mailjet";
import { BaseEmailProvider } from "./base-email.provider";
import { EmailData, EmailResult } from "../interfaces/email.interface";
import { EmailConfig } from "../../../config/email.config";

@Injectable()
export class MailjetEmailProvider extends BaseEmailProvider {
  private mailjet: any;
  private readonly mailjetConfig: EmailConfig["mailjet"];

  constructor(private readonly configService: ConfigService) {
    const emailConfig = configService.get<EmailConfig>("email")!;
    super("Mailjet", emailConfig.mailjet);
    this.mailjetConfig = emailConfig.mailjet;
  }

  async initialize(): Promise<void> {
    try {
      if (!this.mailjetConfig.apiKey || !this.mailjetConfig.secretKey) {
        throw new Error("Mailjet API key and secret key are required");
      }

      this.mailjet = new Mailjet({
        apiKey: this.mailjetConfig.apiKey,
        apiSecret: this.mailjetConfig.secretKey,
      });

      this.initialized = true;
      this.logger.log("Mailjet email provider initialized successfully");
    } catch (error) {
      this.logger.error("Failed to initialize Mailjet provider:", error);
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

      // Parse sender email to extract name and email
      const { name: fromName, email: fromEmail } = this.parseEmailAddress(
        emailData.from || "noreply@tiffin-wale.com",
      );

      // Parse recipient emails
      const toRecipients = Array.isArray(emailData.to)
        ? emailData.to.map((email) => ({ Email: email }))
        : [{ Email: emailData.to }];

      const ccRecipients =
        emailData.cc?.map((email) => ({ Email: email })) || [];
      const bccRecipients =
        emailData.bcc?.map((email) => ({ Email: email })) || [];

      const mailjetData = {
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName,
            },
            To: toRecipients,
            Cc: ccRecipients.length > 0 ? ccRecipients : undefined,
            Bcc: bccRecipients.length > 0 ? bccRecipients : undefined,
            Subject: emailData.subject,
            HTMLPart: htmlContent,
            ReplyTo: emailData.replyTo
              ? { Email: emailData.replyTo }
              : undefined,
          },
        ],
      };

      const response = await this.mailjet
        .post("send", { version: "v3.1" })
        .request(mailjetData);

      if (
        response.body &&
        response.body.Messages &&
        response.body.Messages[0]
      ) {
        const messageInfo = response.body.Messages[0];

        if (messageInfo.Status === "success") {
          return this.handleSuccess(
            messageInfo.To[0].MessageID.toString(),
            "Mailjet email sent",
          );
        } else {
          throw new Error(
            `Mailjet send failed: ${JSON.stringify(messageInfo.Errors)}`,
          );
        }
      } else {
        throw new Error("Invalid response from Mailjet API");
      }
    } catch (error) {
      return this.handleError(error, "Mailjet email send failed");
    }
  }

  async sendBulkEmails(
    emails: Array<{ emailData: EmailData; htmlContent: string }>,
  ): Promise<EmailResult[]> {
    try {
      this.validateInitialization();

      // Mailjet supports bulk sending with multiple messages in one request
      const messages = emails.map(({ emailData, htmlContent }) => {
        this.validateEmailData(emailData);

        const { name: fromName, email: fromEmail } = this.parseEmailAddress(
          emailData.from || "noreply@tiffin-wale.com",
        );

        const toRecipients = Array.isArray(emailData.to)
          ? emailData.to.map((email) => ({ Email: email }))
          : [{ Email: emailData.to }];

        const ccRecipients =
          emailData.cc?.map((email) => ({ Email: email })) || [];
        const bccRecipients =
          emailData.bcc?.map((email) => ({ Email: email })) || [];

        return {
          From: {
            Email: fromEmail,
            Name: fromName,
          },
          To: toRecipients,
          Cc: ccRecipients.length > 0 ? ccRecipients : undefined,
          Bcc: bccRecipients.length > 0 ? bccRecipients : undefined,
          Subject: emailData.subject,
          HTMLPart: htmlContent,
          ReplyTo: emailData.replyTo ? { Email: emailData.replyTo } : undefined,
        };
      });

      const response = await this.mailjet
        .post("send", { version: "v3.1" })
        .request({
          Messages: messages,
        });

      const results: EmailResult[] = [];

      if (response.body && response.body.Messages) {
        response.body.Messages.forEach((messageInfo: any, index: number) => {
          if (messageInfo.Status === "success") {
            results.push(
              this.handleSuccess(
                messageInfo.To[0].MessageID.toString(),
                `Mailjet bulk email ${index + 1} sent`,
              ),
            );
          } else {
            results.push(
              this.handleError(
                new Error(
                  `Mailjet bulk send failed: ${JSON.stringify(messageInfo.Errors)}`,
                ),
                `Mailjet bulk email ${index + 1} failed`,
              ),
            );
          }
        });
      } else {
        throw new Error("Invalid response from Mailjet bulk API");
      }

      return results;
    } catch (error) {
      // If bulk send fails completely, return error for all emails
      return emails.map(() =>
        this.handleError(error, "Mailjet bulk email send failed"),
      );
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.initialized || !this.mailjetConfig.enabled) {
        return false;
      }

      // Simple health check by calling Mailjet API info endpoint
      const response = await this.mailjet.get("user").request();
      return response.response.status === 200;
    } catch (error) {
      this.logger.error("Mailjet health check failed:", error);
      return false;
    }
  }

  private parseEmailAddress(emailAddress: string): {
    name: string;
    email: string;
  } {
    // Parse email address in format "Name <email@domain.com>" or just "email@domain.com"
    const match = emailAddress.match(/^(.+?)\s*<(.+?)>$/);

    if (match) {
      return {
        name: match[1].trim(),
        email: match[2].trim(),
      };
    }

    return {
      name: "",
      email: emailAddress.trim(),
    };
  }
}
