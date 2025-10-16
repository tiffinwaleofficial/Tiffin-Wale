import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Resend } from "resend";
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

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
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
  };

  constructor(
    @InjectModel(EmailLog.name) private emailLogModel: Model<EmailLogDocument>,
    @InjectModel(EmailPreference.name)
    private emailPreferenceModel: Model<EmailPreferenceDocument>,
    private templateService: TemplateService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>("RESEND_API_KEY");
    if (!apiKey) {
      this.logger.warn(
        "RESEND_API_KEY not found. Email service will be disabled.",
      );
    }

    this.resend = new Resend(apiKey);
    this.fromEmail =
      this.configService.get<string>("FROM_EMAIL") ||
      "Tiffin-Wale <noreply@tiffin-wale.com>";
    this.appUrl =
      this.configService.get<string>("APP_URL") || "https://tiffin-wale.com";
    this.supportEmail =
      this.configService.get<string>("SUPPORT_EMAIL") ||
      "support@tiffin-wale.com";
    this.emailEnabled = this.configService.get<boolean>("EMAIL_ENABLED", true);

    // Initialize multiple sender email addresses
    this.emailAddresses = {
      info:
        this.configService.get<string>("INFO_EMAIL") ||
        "Tiffin-Wale <info@tiffin-wale.com>",
      sales:
        this.configService.get<string>("SALES_EMAIL") ||
        "Tiffin-Wale Sales <sales@tiffin-wale.com>",
      orders:
        this.configService.get<string>("ORDERS_EMAIL") ||
        "Tiffin-Wale Orders <orders@tiffin-wale.com>",
      billing:
        this.configService.get<string>("BILLING_EMAIL") ||
        "Tiffin-Wale Billing <billing@tiffin-wale.com>",
      feedback:
        this.configService.get<string>("FEEDBACK_EMAIL") ||
        "Tiffin-Wale Feedback <feedback@tiffin-wale.com>",
      careers:
        this.configService.get<string>("CAREERS_EMAIL") ||
        "Tiffin-Wale Careers <careers@tiffin-wale.com>",
      marketing:
        this.configService.get<string>("MARKETING_EMAIL") ||
        "Tiffin-Wale Marketing <marketing@tiffin-wale.com>",
      admin:
        this.configService.get<string>("ADMIN_EMAIL") ||
        "Tiffin-Wale Admin <admin@tiffin-wale.com>",
    };
  }

  /**
   * Get appropriate sender email based on email type
   */
  private getSenderEmail(
    type:
      | "welcome"
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
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    resetData: {
      name: string;
      resetToken: string;
      expiresIn?: string;
    },
  ): Promise<EmailResult> {
    const resetUrl = `${this.appUrl}/reset-password?token=${resetData.resetToken}`;

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
    const templateData: TemplateData = {
      subscription: subscriptionData,
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
  private async sendTemplateEmail(
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
      const htmlContent = await this.templateService.buildTemplate(
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

      // Send email via Resend
      const response = await this.resend.emails.send({
        from: emailData.from || this.fromEmail,
        to: emailData.to,
        subject: emailData.subject,
        html: htmlContent,
        cc: emailData.cc,
        bcc: emailData.bcc,
        replyTo: emailData.replyTo,
      });

      // Update email log with success
      await this.emailLogModel.findByIdAndUpdate(emailLog._id, {
        status: "sent",
        resendId: response.data?.id,
        sentAt: new Date(),
      });

      this.logger.log(
        `Email sent successfully to ${emailData.to} using template ${emailData.template}`,
      );

      return {
        success: true,
        messageId: response.data?.id,
        resendId: response.data?.id,
      };
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
