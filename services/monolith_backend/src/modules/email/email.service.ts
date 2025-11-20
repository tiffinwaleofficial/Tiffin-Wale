import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TemplateService } from "./template.service";
import { EmailLog, EmailLogDocument } from "./schemas/email-log.schema";
import {
  EmailPreference,
  EmailPreferenceDocument,
} from "./schemas/email-preference.schema";
import {
  EmailData,
  EmailResult,
  TemplateData,
  BulkEmailData,
} from "./interfaces/email.interface";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";
import { MailjetService } from "./mailjet.service";
import { EmailConfig } from "../../config/email.config";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly emailConfig: EmailConfig;
  private readonly fromEmail: string;
  private readonly appUrl: string;
  private readonly supportEmail: string;
  private readonly emailEnabled: boolean;

  // Multiple sender email addresses
  private readonly emailAddresses: {
    info: string;
    sales: string;
    orders: string;
    billing: string;
    feedback: string;
    careers: string;
    marketing: string;
    admin: string;
    cfo: string;
    ceo: string;
  };

  constructor(
    @InjectModel(EmailLog.name) private emailLogModel: Model<EmailLogDocument>,
    @InjectModel(EmailPreference.name)
    private emailPreferenceModel: Model<EmailPreferenceDocument>,
    private templateService: TemplateService,
    private configService: ConfigService,
    private mailjetService: MailjetService,
  ) {
    // Load centralized email configuration
    this.emailConfig = this.configService.get<EmailConfig>("email")!;

    if (!this.emailConfig) {
      this.logger.error(
        "Email configuration not found. Using fallback values.",
      );
    }

    // Initialize Resend if enabled
    const resendConfig = this.emailConfig?.resend;
    if (resendConfig?.enabled && resendConfig?.apiKey) {
      this.resend = new Resend(resendConfig.apiKey);
      this.logger.log("Resend email service initialized");
    } else {
      this.logger.warn("Resend service disabled or API key missing");
    }

    // Use centralized configuration
    this.fromEmail =
      this.emailConfig?.fromEmail || "Tiffin-Wale <noreply@tiffin-wale.com>";
    this.appUrl = this.emailConfig?.appUrl || "https://tiffin-wale.com";
    this.supportEmail =
      this.emailConfig?.supportEmail || "support@tiffin-wale.com";
    this.emailEnabled = this.emailConfig?.enabled ?? true;

    // Use centralized email addresses configuration
    this.emailAddresses = this.emailConfig?.emailAddresses || {
      info: "Tiffin-Wale <info@tiffin-wale.com>",
      sales: "Tiffin-Wale Sales <sales@tiffin-wale.com>",
      orders: "Tiffin-Wale Orders <orders@tiffin-wale.com>",
      billing: "Tiffin-Wale Billing <billing@tiffin-wale.com>",
      feedback: "Tiffin-Wale Feedback <feedback@tiffin-wale.com>",
      careers: "Tiffin-Wale Careers <careers@tiffin-wale.com>",
      marketing: "Tiffin-Wale Marketing <marketing@tiffin-wale.com>",
      admin: "Tiffin-Wale Admin <admin@tiffin-wale.com>",
      cfo: "Riya Tiwari <riya.tiwari@tiffin-wale.com>",
      ceo: "Rahul Vishwakarma <admin@tiffin-wale.com>",
    };

    // Log comprehensive email service status
    this.logEmailServiceStatus();
  }

  /**
   * Log comprehensive email service status on startup
   */
  private logEmailServiceStatus(): void {
    const resendEnabled = this.emailConfig?.resend?.enabled && this.resend;
    const mailjetEnabled =
      this.emailConfig?.mailjet?.enabled && this.mailjetService.isEnabled();
    const preferredProvider = this.emailConfig?.preferredProvider || "resend";
    const autoFallback = this.emailConfig?.autoFallback ?? true;

    // Main status
    this.logger.log("📧 EMAIL SERVICE INITIALIZED");
    this.logger.log("═══════════════════════════════════════");

    // Overall configuration
    this.logger.log(
      `🎯 Service Status: ${this.emailEnabled ? "✅ ENABLED" : "❌ DISABLED"}`,
    );
    this.logger.log(
      `🔄 Auto-Fallback: ${autoFallback ? "✅ ENABLED" : "❌ DISABLED"}`,
    );
    this.logger.log(
      `⭐ Preferred Provider: ${preferredProvider.toUpperCase()}`,
    );

    // Provider status
    this.logger.log("\n📊 PROVIDER STATUS:");

    // Resend status
    const resendStatus = resendEnabled ? "✅ READY" : "❌ DISABLED";
    const resendLimit = this.emailConfig?.resend?.dailyLimit || 100;
    this.logger.log(`  📤 Resend: ${resendStatus} (${resendLimit} emails/day)`);
    if (resendEnabled) {
      this.logger.log(
        `     API Key: ${this.emailConfig?.resend?.apiKey ? "✅ Configured" : "❌ Missing"}`,
      );
    }

    // Mailjet status
    const mailjetStatus = mailjetEnabled ? "✅ READY" : "❌ DISABLED";
    const mailjetLimit = this.emailConfig?.mailjet?.dailyLimit || 200;
    this.logger.log(
      `  📤 Mailjet: ${mailjetStatus} (${mailjetLimit} emails/day)`,
    );
    if (this.emailConfig?.mailjet?.enabled) {
      const hasApiKey = !!this.emailConfig?.mailjet?.apiKey;
      const hasSecretKey = !!this.emailConfig?.mailjet?.secretKey;
      this.logger.log(
        `     API Key: ${hasApiKey ? "✅ Configured" : "❌ Missing"}`,
      );
      this.logger.log(
        `     Secret Key: ${hasSecretKey ? "✅ Configured" : "❌ Missing"}`,
      );
    }

    // Total capacity
    let totalCapacity = 0;
    if (resendEnabled) totalCapacity += resendLimit;
    if (mailjetEnabled) totalCapacity += mailjetLimit;

    this.logger.log(`\n📈 TOTAL DAILY CAPACITY: ${totalCapacity} emails/day`);

    // Email addresses
    this.logger.log("\n📮 SENDER ADDRESSES:");
    this.logger.log(`  Default: ${this.fromEmail}`);
    this.logger.log(`  Support: ${this.supportEmail}`);
    this.logger.log(`  App URL: ${this.appUrl}`);

    // Warnings and recommendations
    this.logger.log("\n⚠️  STATUS SUMMARY:");

    if (!resendEnabled && !mailjetEnabled) {
      this.logger.error(
        "❌ NO EMAIL PROVIDERS AVAILABLE - Email service will not work!",
      );
    } else if (!resendEnabled) {
      this.logger.warn("⚠️  Resend disabled - Using Mailjet only");
    } else if (!mailjetEnabled) {
      this.logger.warn(
        "⚠️  Mailjet disabled - Using Resend only (no fallback)",
      );
    } else {
      this.logger.log("✅ Both providers available - Full redundancy enabled");
    }

    if (autoFallback && resendEnabled && mailjetEnabled) {
      this.logger.log(
        "🔄 Smart fallback enabled - Automatic provider switching available",
      );
    }

    this.logger.log("═══════════════════════════════════════\n");
  }

  /**
   * Get appropriate sender email based on email type
   */
  private getSenderEmail(
    type:
      | "welcome"
      | "cfo-welcome"
      | "ceo-welcome"
      | "password-reset"
      | "verification"
      | "order"
      | "billing"
      | "feedback"
      | "marketing"
      | "admin"
      | "support",
  ): string {
    switch (type) {
      case "welcome":
        return this.emailAddresses.info;
      case "cfo-welcome":
        return this.emailAddresses.cfo;
      case "ceo-welcome":
        return this.emailAddresses.ceo;
      case "password-reset":
      case "verification":
        return this.emailAddresses.info;
      case "order":
        return this.emailAddresses.orders;
      case "billing":
        return this.emailAddresses.billing;
      case "feedback":
        return this.emailAddresses.feedback;
      case "marketing":
        return this.emailAddresses.marketing;
      case "admin":
        return this.emailAddresses.admin;
      case "support":
        return this.fromEmail; // Use default for support tickets
      default:
        return this.fromEmail;
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(
    userId: string,
    userData: {
      name: string;
      email: string;
      role?: string;
    },
  ): Promise<EmailResult> {
    const templateData: TemplateData = {
      user: {
        name: userData.name,
        email: userData.email,
        id: userId,
      },
      loginUrl: `${this.appUrl}/login`,
      dashboardUrl: `${this.appUrl}/dashboard`,
      supportUrl: `${this.appUrl}/support`,
    };

    return this.sendTemplateEmail(
      {
        to: userData.email,
        template: "welcome",
        data: templateData,
        subject: `Welcome to Tiffin-Wale, ${userData.name}!`,
        from: this.getSenderEmail("welcome"),
      },
      userId,
    );
  }

  /**
   * Send CFO welcome email to new users
   */
  async sendCfoWelcomeEmail(
    userId: string,
    userData: {
      name: string;
      email: string;
    },
  ): Promise<EmailResult> {
    const templateData: TemplateData = {
      user: {
        name: userData.name,
        email: userData.email,
        id: userId,
      },
      // dashboardUrl is no longer needed as the URL is hardcoded in the template
    };

    return this.sendTemplateEmail(
      {
        to: userData.email,
        template: "cfo-welcome",
        data: templateData,
        subject: `Tiffin Wale, CFO Riya Tiwari`,
        from: this.getSenderEmail("cfo-welcome"),
      },
      userId,
    );
  }

  /**
   * Send CEO welcome email to new users
   */
  async sendCeoWelcomeEmail(
    userId: string,
    userData: {
      name: string;
      email: string;
    },
  ): Promise<EmailResult> {
    const templateData: TemplateData = {
      user: {
        name: userData.name,
        email: userData.email,
        id: userId,
      },
      // dashboardUrl is no longer needed as the URL is hardcoded in the template
    };

    return this.sendTemplateEmail(
      {
        to: userData.email,
        template: "ceo-welcome",
        data: templateData,
        subject: `Invitation to Rejoin Tiffin Wale`,
        from: this.getSenderEmail("ceo-welcome"),
      },
      userId,
    );
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    resetData: {
      name: string;
      resetToken: string;
      role: "customer" | "business_partner";
      resetUrl?: string;
      expiresIn?: string;
    },
  ): Promise<EmailResult> {
    // Use provided resetUrl or generate based on role
    const resetUrl =
      resetData.resetUrl ||
      (resetData.role === "customer"
        ? `${this.configService.get<string>("STUDENT_APP_URL")}/reset-password?token=${resetData.resetToken}`
        : `${this.configService.get<string>("PARTNER_APP_URL")}/reset-password?token=${resetData.resetToken}`);

    const templateData: TemplateData = {
      user: { name: resetData.name, email, id: "" },
      resetUrl,
      expiresIn: resetData.expiresIn || "1 hour",
      supportUrl: `${this.appUrl}/support`,
    };

    return this.sendTemplateEmail({
      to: email,
      template: "password-reset",
      data: templateData,
      subject: "Reset Your Password - Tiffin-Wale",
      from: this.getSenderEmail("password-reset"),
    });
  }

  /**
   * Send password change confirmation email
   */
  async sendPasswordChangeConfirmation(
    email: string,
    confirmationData: {
      name: string;
      timestamp: string;
    },
  ): Promise<EmailResult> {
    const templateData: TemplateData = {
      user: { name: confirmationData.name, email, id: "" },
      timestamp: confirmationData.timestamp,
      supportUrl: `${this.appUrl}/support`,
    };

    return this.sendTemplateEmail({
      to: email,
      template: "password-change-confirmation",
      data: templateData,
      subject: "Password Changed Successfully - Tiffin-Wale",
      from: this.getSenderEmail("password-reset"),
    });
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(
    email: string,
    verificationData: {
      name: string;
      verificationToken: string;
    },
  ): Promise<EmailResult> {
    const verificationUrl = `${this.appUrl}/verify-email?token=${verificationData.verificationToken}`;

    const templateData: TemplateData = {
      user: { name: verificationData.name, email, id: "" },
      verificationUrl,
      supportUrl: `${this.appUrl}/support`,
    };

    return this.sendTemplateEmail({
      to: email,
      template: "email-verification",
      data: templateData,
      subject: "Verify Your Email - Tiffin-Wale",
      from: this.getSenderEmail("verification"),
    });
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(orderData: {
    orderNumber: string;
    customerEmail: string;
    customerName: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    deliveryAddress: string;
    estimatedDeliveryTime: string;
    partnerName: string;
  }): Promise<EmailResult> {
    const templateData: TemplateData = {
      order: orderData,
      trackingUrl: `${this.appUrl}/orders/${orderData.orderNumber}`,
      supportUrl: `${this.appUrl}/support`,
    };

    return this.sendTemplateEmail({
      to: orderData.customerEmail,
      template: "order-confirmation",
      data: templateData,
      subject: `Order Confirmed #${orderData.orderNumber} - Tiffin-Wale`,
      from: this.getSenderEmail("order"),
    });
  }

  /**
   * Send order status update
   */
  async sendOrderStatusUpdate(orderData: {
    orderNumber: string;
    customerEmail: string;
    customerName: string;
    status: "preparing" | "ready" | "delivered";
    estimatedTime?: string;
    partnerName: string;
  }): Promise<EmailResult> {
    const templates = {
      preparing: "order-preparing",
      ready: "order-ready",
      delivered: "order-delivered",
    };

    const subjects = {
      preparing: `Your Order is Being Prepared #${orderData.orderNumber}`,
      ready: `Your Order is Ready for Pickup #${orderData.orderNumber}`,
      delivered: `Order Delivered #${orderData.orderNumber} - Rate Your Experience`,
    };

    const templateData: TemplateData = {
      order: orderData,
      trackingUrl: `${this.appUrl}/orders/${orderData.orderNumber}`,
      ratingUrl: `${this.appUrl}/orders/${orderData.orderNumber}/rate`,
      supportUrl: `${this.appUrl}/support`,
    };

    return this.sendTemplateEmail({
      to: orderData.customerEmail,
      template: templates[orderData.status],
      data: templateData,
      subject: subjects[orderData.status],
      from: this.getSenderEmail("order"),
    });
  }

  /**
   * Send subscription confirmation
   */
  async sendSubscriptionConfirmation(subscriptionData: {
    customerEmail: string;
    customerName: string;
    planName: string;
    startDate: string;
    endDate: string;
    amount: number;
    billingCycle: string;
  }): Promise<EmailResult> {
    // Ensure all data is properly serialized (convert ObjectIds to strings)
    const sanitizedSubscriptionData = {
      customerEmail: String(subscriptionData.customerEmail),
      customerName: String(subscriptionData.customerName),
      planName: String(subscriptionData.planName),
      startDate: String(subscriptionData.startDate),
      endDate: String(subscriptionData.endDate),
      amount: Number(subscriptionData.amount),
      billingCycle: String(subscriptionData.billingCycle),
      // Add nextBillingDate for template compatibility
      nextBillingDate: String(subscriptionData.endDate),
      // Add price alias for template compatibility
      price: Number(subscriptionData.amount),
    };

    const templateData: TemplateData = {
      subscription: sanitizedSubscriptionData,
      manageUrl: `${this.appUrl}/subscription`,
      supportUrl: `${this.appUrl}/support`,
    };

    return this.sendTemplateEmail({
      to: subscriptionData.customerEmail,
      template: "subscription-created",
      data: templateData,
      subject: "Subscription Activated - Tiffin-Wale",
      from: this.getSenderEmail("billing"),
    });
  }

  /**
   * Send subscription expiry warning
   */
  async sendSubscriptionExpiryWarning(subscriptionData: {
    customerEmail: string;
    customerName: string;
    planName: string;
    expiryDate: string;
    daysLeft: number;
  }): Promise<EmailResult> {
    const templateData: TemplateData = {
      subscription: subscriptionData,
      renewUrl: `${this.appUrl}/subscription/renew`,
      manageUrl: `${this.appUrl}/subscription`,
      supportUrl: `${this.appUrl}/support`,
    };

    return this.sendTemplateEmail({
      to: subscriptionData.customerEmail,
      template: "subscription-expiring",
      data: templateData,
      subject: `Subscription Expiring in ${subscriptionData.daysLeft} Days - Tiffin-Wale`,
      from: this.getSenderEmail("billing"),
    });
  }

  /**
   * Send partner welcome email
   */
  async sendPartnerWelcomeEmail(partnerData: {
    email: string;
    name: string;
    businessName: string;
    partnerId: string;
  }): Promise<EmailResult> {
    const templateData: TemplateData = {
      partner: partnerData,
      dashboardUrl: `${this.appUrl}/partner/dashboard`,
      onboardingUrl: `${this.appUrl}/partner/onboarding`,
      supportUrl: `${this.appUrl}/partner/support`,
    };

    return this.sendTemplateEmail(
      {
        to: partnerData.email,
        template: "partner-welcome",
        data: templateData,
        subject: "Welcome to Tiffin-Wale Partner Program!",
        from: this.getSenderEmail("marketing"),
      },
      partnerData.partnerId,
    );
  }

  /**
   * Send new order notification to partner
   */
  async sendPartnerOrderNotification(orderData: {
    partnerEmail: string;
    partnerName: string;
    orderNumber: string;
    customerName: string;
    items: Array<{
      name: string;
      quantity: number;
    }>;
    deliveryTime: string;
    totalAmount: number;
  }): Promise<EmailResult> {
    const templateData: TemplateData = {
      order: orderData,
      orderUrl: `${this.appUrl}/partner/orders/${orderData.orderNumber}`,
      dashboardUrl: `${this.appUrl}/partner/dashboard`,
    };

    return this.sendTemplateEmail({
      to: orderData.partnerEmail,
      template: "new-order-notification",
      data: templateData,
      subject: `New Order Received #${orderData.orderNumber}`,
      from: this.getSenderEmail("order"),
    });
  }

  /**
   * Send payment confirmation
   */
  async sendPaymentConfirmation(paymentData: {
    customerEmail: string;
    customerName: string;
    amount: number;
    paymentId: string;
    orderNumber?: string;
    subscriptionId?: string;
  }): Promise<EmailResult> {
    const templateData: TemplateData = {
      payment: paymentData,
      receiptUrl: `${this.appUrl}/receipts/${paymentData.paymentId}`,
      supportUrl: `${this.appUrl}/support`,
    };

    return this.sendTemplateEmail({
      to: paymentData.customerEmail,
      template: "payment-success",
      data: templateData,
      subject: "Payment Successful - Tiffin-Wale",
      from: this.getSenderEmail("billing"),
    });
  }

  /**
   * Send payment failure notification
   */
  async sendPaymentFailure(paymentData: {
    customerEmail: string;
    customerName: string;
    amount: number;
    reason: string;
    retryUrl: string;
  }): Promise<EmailResult> {
    const templateData: TemplateData = {
      payment: paymentData,
      supportUrl: `${this.appUrl}/support`,
    };

    return this.sendTemplateEmail({
      to: paymentData.customerEmail,
      template: "payment-failed",
      data: templateData,
      subject: "Payment Failed - Action Required",
      from: this.getSenderEmail("billing"),
    });
  }

  /**
   * Send bulk emails (for marketing campaigns)
   */
  async sendBulkEmails(bulkData: BulkEmailData): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    for (const recipient of bulkData.recipients) {
      try {
        const result = await this.sendTemplateEmail({
          to: recipient.email,
          template: bulkData.template,
          data: recipient.data,
          subject: bulkData.subject,
          from: bulkData.from,
        });

        results.push(result);

        // Add delay to respect rate limits
        await this.delay(100);
      } catch (error) {
        this.logger.error(
          `Failed to send bulk email to ${recipient.email}:`,
          error,
        );
        results.push({
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Core method to send templated emails
   */
  async sendTemplateEmail(
    emailData: EmailData,
    userId?: string,
  ): Promise<EmailResult> {
    if (!this.emailEnabled) {
      this.logger.warn("Email service is disabled");
      return { success: false, error: "Email service disabled" };
    }

    try {
      // Check user email preferences if userId provided
      if (userId) {
        const canSend = await this.checkEmailPreferences(
          userId,
          emailData.template,
        );
        if (!canSend) {
          this.logger.debug(
            `Email blocked by user preferences: ${emailData.to}`,
          );
          return { success: false, error: "Blocked by user preferences" };
        }
      }

      // Build HTML content from template
      const emailComponent = await this.templateService.getTemplateComponent(
        emailData.template,
        emailData.data,
      );

      // Create email log entry
      const emailLog = new this.emailLogModel({
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template,
        templateData: emailData.data,
        status: "pending",
        userId: userId,
        from: emailData.from || this.fromEmail,
        cc: emailData.cc,
        bcc: emailData.bcc,
        replyTo: emailData.replyTo,
      });

      await emailLog.save();

      // Determine which provider to use based on central configuration
      let result: EmailResult;
      let provider: string;
      const preferredProvider = this.emailConfig?.preferredProvider || "resend";
      const autoFallback = this.emailConfig?.autoFallback ?? true;

      // Check if preferred provider is available
      const resendEnabled = this.emailConfig?.resend?.enabled && this.resend;
      const mailjetEnabled =
        this.emailConfig?.mailjet?.enabled && this.mailjetService.isEnabled();

      if (preferredProvider === "mailjet" && mailjetEnabled) {
        // Use Mailjet as primary
        provider = "mailjet";
        const htmlContent = await this.templateService.buildTemplate(
          emailData.template,
          emailData.data,
        );

        result = await this.mailjetService.sendEmail({
          from: emailData.from || this.fromEmail,
          to: emailData.to,
          subject: emailData.subject,
          html: htmlContent,
          cc: emailData.cc,
          bcc: emailData.bcc,
          replyTo: emailData.replyTo,
          attachments: emailData.attachments,
        });

        // Fallback to Resend if Mailjet fails and auto-fallback is enabled
        if (!result.success && autoFallback && resendEnabled) {
          this.logger.warn(
            `Mailjet failed, trying Resend fallback: ${result.error}`,
          );
          provider = "resend";

          try {
            const response = await this.resend.emails.send({
              from: emailData.from || this.fromEmail,
              to: emailData.to,
              subject: emailData.subject,
              react: emailComponent,
              cc: emailData.cc,
              bcc: emailData.bcc,
              replyTo: emailData.replyTo,
              attachments: emailData.attachments,
            });

            if (response.error) {
              throw new Error(`Resend API error: ${response.error.message}`);
            }

            result = {
              success: true,
              messageId: response.data?.id,
              resendId: response.data?.id,
            };
          } catch (resendError) {
            result = {
              success: false,
              error: `Both providers failed. Mailjet: ${result.error}, Resend: ${resendError.message}`,
            };
          }
        }
      } else {
        // Use Resend as primary (default behavior)
        provider = "resend";

        if (!resendEnabled) {
          result = {
            success: false,
            error: "Resend service is not enabled or configured",
          };
        } else {
          try {
            const response = await this.resend.emails.send({
              from: emailData.from || this.fromEmail,
              to: emailData.to,
              subject: emailData.subject,
              react: emailComponent,
              cc: emailData.cc,
              bcc: emailData.bcc,
              replyTo: emailData.replyTo,
            });

            if (response.error) {
              throw new Error(`Resend API error: ${response.error.message}`);
            }

            result = {
              success: true,
              messageId: response.data?.id,
              resendId: response.data?.id,
            };
          } catch (resendError) {
            // Fallback to Mailjet if Resend fails and auto-fallback is enabled
            if (autoFallback && mailjetEnabled) {
              this.logger.warn(
                `Resend failed, trying Mailjet fallback: ${resendError.message}`,
              );
              provider = "mailjet";

              const htmlContent = await this.templateService.buildTemplate(
                emailData.template,
                emailData.data,
              );

              result = await this.mailjetService.sendEmail({
                from: emailData.from || this.fromEmail,
                to: emailData.to,
                subject: emailData.subject,
                html: htmlContent,
                cc: emailData.cc,
                bcc: emailData.bcc,
                replyTo: emailData.replyTo,
              });

              if (!result.success) {
                result = {
                  success: false,
                  error: `Both providers failed. Resend: ${resendError.message}, Mailjet: ${result.error}`,
                };
              }
            } else {
              result = {
                success: false,
                error: `Resend failed and no fallback available: ${resendError.message}`,
              };
            }
          }
        }
      }

      // Update email log with result
      if (result.success) {
        await this.emailLogModel.findByIdAndUpdate(emailLog._id, {
          status: "sent",
          resendId: result.messageId,
          sentAt: new Date(),
          metadata: { provider },
        });

        this.logger.log(
          `Email sent successfully to ${emailData.to} using template ${emailData.template} via ${provider}`,
        );
      } else {
        await this.emailLogModel.findByIdAndUpdate(emailLog._id, {
          status: "failed",
          errorMessage: result.error,
          failedAt: new Date(),
          metadata: { provider },
        });
      }

      return result;
    } catch (error) {
      this.logger.error(`Failed to send email to ${emailData.to}:`, error);

      // Update email log with failure
      if (userId) {
        await this.emailLogModel.findOneAndUpdate(
          { to: emailData.to, template: emailData.template, status: "pending" },
          {
            status: "failed",
            errorMessage: error.message,
            failedAt: new Date(),
          },
          { sort: { createdAt: -1 } },
        );
      }

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check if user allows this type of email
   */
  private async checkEmailPreferences(
    userId: string,
    template: string,
  ): Promise<boolean> {
    try {
      const preferences = await this.emailPreferenceModel.findOne({ userId });

      if (!preferences) {
        // Default to allowing all emails if no preferences set
        return true;
      }

      if (preferences.globalUnsubscribe) {
        return false;
      }

      // Map templates to preference categories
      const templateCategories = {
        welcome: "securityAlerts",
        "cfo-welcome": "securityAlerts",
        "ceo-welcome": "securityAlerts",
        "password-reset": "securityAlerts",
        "email-verification": "securityAlerts",
        "order-confirmation": "orderUpdates",
        "order-preparing": "orderUpdates",
        "order-ready": "orderUpdates",
        "order-delivered": "orderUpdates",
        "subscription-created": "subscriptionNotifications",
        "subscription-renewed": "subscriptionNotifications",
        "subscription-expiring": "subscriptionNotifications",
        "subscription-cancelled": "subscriptionNotifications",
        "payment-success": "paymentNotifications",
        "payment-failed": "paymentNotifications",
        "refund-processed": "paymentNotifications",
        "partner-welcome": "partnerNotifications",
        "new-order-notification": "partnerNotifications",
        "earnings-summary": "partnerNotifications",
      };

      const category = templateCategories[template];
      if (!category) {
        // Allow unknown templates by default
        return true;
      }

      return preferences[category] !== false;
    } catch (error) {
      this.logger.error(
        `Error checking email preferences for user ${userId}:`,
        error,
      );
      // Default to allowing email if there's an error
      return true;
    }
  }

  /**
   * Retry failed emails
   */
  async retryFailedEmails(limit = 50, maxRetries = 3): Promise<number> {
    const failedEmails = await this.emailLogModel
      .find({
        status: "failed",
        retryCount: { $lt: maxRetries },
        $or: [
          { nextRetryAt: { $lte: new Date() } },
          { nextRetryAt: { $exists: false } },
        ],
      })
      .limit(limit)
      .exec();

    let retriedCount = 0;

    for (const emailLog of failedEmails) {
      try {
        const result = await this.sendTemplateEmail(
          {
            to: emailLog.to,
            subject: emailLog.subject,
            template: emailLog.template,
            data: emailLog.templateData,
            from: emailLog.from,
            cc: emailLog.cc,
            bcc: emailLog.bcc,
            replyTo: emailLog.replyTo,
          },
          emailLog.userId?.toString(),
        );

        if (result.success) {
          await this.emailLogModel.findByIdAndUpdate(emailLog._id, {
            status: "sent",
            resendId: result.resendId,
            sentAt: new Date(),
          });
          retriedCount++;
        } else {
          // Schedule next retry with exponential backoff
          const nextRetryDelay = Math.pow(2, emailLog.retryCount) * 60 * 1000; // Minutes to milliseconds
          await this.emailLogModel.findByIdAndUpdate(emailLog._id, {
            retryCount: emailLog.retryCount + 1,
            nextRetryAt: new Date(Date.now() + nextRetryDelay),
            errorMessage: result.error,
          });
        }
      } catch (error) {
        this.logger.error(`Failed to retry email ${emailLog._id}:`, error);
      }
    }

    this.logger.log(`Retried ${retriedCount} failed emails`);
    return retriedCount;
  }

  /**
   * Get email statistics
   */
  async getEmailStats(userId?: string, days = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const matchStage: any = { createdAt: { $gte: startDate } };
    if (userId) {
      matchStage.userId = userId;
    }

    const stats = await this.emailLogModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalSent: { $sum: 1 },
          successful: { $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        },
      },
    ]);

    const templateStats = await this.emailLogModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$template",
          count: { $sum: 1 },
          successful: { $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return {
      overview: stats[0] || {
        totalSent: 0,
        successful: 0,
        failed: 0,
        pending: 0,
      },
      byTemplate: templateStats,
    };
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
