import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Mailjet from "node-mailjet";
import { EmailData, EmailResult } from "./interfaces/email.interface";
import { MailjetConfig } from "../../config/email.config";

@Injectable()
export class MailjetService {
  private readonly logger = new Logger(MailjetService.name);
  private mailjet: any;
  private mailjetConfig: MailjetConfig;
  private isServiceEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.mailjetConfig =
      this.configService.get<MailjetConfig>("email.mailjet")!;
    this.isServiceEnabled = this.mailjetConfig?.enabled || false;

    if (!this.isServiceEnabled) {
      this.logger.log("Mailjet email service is disabled via config.");
      return;
    }

    const apiKey = this.mailjetConfig?.apiKey;
    const secretKey = this.mailjetConfig?.secretKey;

    if (!apiKey || !secretKey) {
      this.logger.error(
        "Mailjet API key and secret key are required in config. Mailjet service will be disabled.",
      );
      this.isServiceEnabled = false;
      return;
    }

    try {
      // Use the correct Mailjet SDK initialization method
      this.mailjet = new Mailjet({
        apiKey: apiKey,
        apiSecret: secretKey,
      });
      this.logger.log("Mailjet email service initialized successfully.");
      this.logger.debug(
        `Mailjet initialized with API Key: ${apiKey.substring(0, 8)}...`,
      );
    } catch (error) {
      this.logger.error("Failed to initialize Mailjet:", error);
      this.isServiceEnabled = false;
    }
  }

  async sendEmail(emailData: {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
    cc?: string[];
    bcc?: string[];
    replyTo?: string;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }>;
  }): Promise<EmailResult> {
    if (!this.isServiceEnabled) {
      this.logger.warn("Mailjet email service is disabled.");
      return { success: false, error: "Mailjet service disabled" };
    }

    try {
      // For testing: Use verified sender if domain is not verified
      let senderEmail = emailData.from;
      const testSender = process.env.MAILJET_TEST_SENDER;

      if (testSender && emailData.from.includes("tiffin-wale.com")) {
        senderEmail = `Tiffin-Wale <${testSender}>`;
        this.logger.warn(
          `Using test sender ${testSender} instead of ${emailData.from} for domain verification`,
        );
      }

      const { name: fromName, email: fromEmail } =
        this.parseEmailAddress(senderEmail);

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
            Subject: emailData.subject,
            HTMLPart: emailData.html,
            Cc: ccRecipients.length > 0 ? ccRecipients : undefined,
            Bcc: bccRecipients.length > 0 ? bccRecipients : undefined,
            ReplyTo: emailData.replyTo
              ? { Email: emailData.replyTo }
              : undefined,
            Attachments: emailData.attachments?.map((att) => ({
              ContentType: att.contentType || "application/pdf",
              Filename: att.filename,
              Base64Content: Buffer.isBuffer(att.content)
                ? att.content.toString("base64")
                : att.content,
            })),
          },
        ],
      };

      this.logger.debug(`Sending email via Mailjet to ${emailData.to}`);
      this.logger.debug(
        `Mailjet payload:`,
        JSON.stringify(mailjetData, null, 2),
      );

      const response = await this.mailjet
        .post("send", { version: "v3.1" })
        .request(mailjetData);

      this.logger.debug(
        `Mailjet response:`,
        JSON.stringify(response.body, null, 2),
      );

      if (
        response.body &&
        response.body.Messages &&
        response.body.Messages[0]
      ) {
        const messageInfo = response.body.Messages[0];

        if (messageInfo.Status === "success") {
          this.logger.log(`Mailjet email sent successfully to ${emailData.to}`);
          return {
            success: true,
            messageId: messageInfo.To[0].MessageID?.toString(),
          };
        } else {
          const errorMsg = messageInfo.Errors
            ? JSON.stringify(messageInfo.Errors)
            : "Unknown error";
          throw new Error(`Mailjet send failed: ${errorMsg}`);
        }
      } else {
        throw new Error("Invalid response from Mailjet API");
      }
    } catch (error) {
      this.logger.error(`Failed to send email via Mailjet:`, error);
      return { success: false, error: error.message };
    }
  }

  isEnabled(): boolean {
    return this.isServiceEnabled;
  }

  private parseEmailAddress(emailAddress: string): {
    name: string;
    email: string;
  } {
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
