import { Injectable, Logger } from "@nestjs/common";
import { render } from "@react-email/render";
import { TemplateData } from "./interfaces/email.interface";

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private templateCache = new Map<string, any>();

  /**
   * Build complete HTML email from React Email template
   */
  async buildTemplate(
    templateName: string,
    data: TemplateData,
  ): Promise<string> {
    try {
      // Get the React component for the template
      const TemplateComponent = await this.getTemplateComponent(templateName);

      // Prepare template data with common variables
      const templateData = this.prepareTemplateData(data);

      // Render React component to HTML
      const html = render(TemplateComponent(templateData));

      this.logger.debug(
        `React Email template ${templateName} rendered successfully`,
      );
      return html;
    } catch (error) {
      this.logger.error(
        `Failed to build React Email template ${templateName}:`,
        error,
      );
      throw new Error(`Template compilation failed: ${error.message}`);
    }
  }

  /**
   * Get template for preview (without sending)
   */
  async previewTemplate(
    templateName: string,
    data: TemplateData,
  ): Promise<{ html: string; subject: string }> {
    const html = await this.buildTemplate(templateName, data);

    // Extract subject from template metadata or use default
    const subject = await this.getTemplateSubject(templateName, data);

    return { html, subject };
  }

  /**
   * Get React component for template
   */
  private async getTemplateComponent(templateName: string): Promise<any> {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName);
    }

    try {
      // Dynamic import of React Email template
      const templatePath = this.resolveTemplatePath(templateName);
      const templateModule = await import(templatePath);
      const TemplateComponent =
        templateModule.default || templateModule[templateName];

      if (!TemplateComponent) {
        throw new Error(`Template component not found: ${templateName}`);
      }

      // Cache the component
      this.templateCache.set(templateName, TemplateComponent);

      this.logger.debug(
        `Loaded and cached React Email template: ${templateName}`,
      );
      return TemplateComponent;
    } catch (error) {
      this.logger.error(
        `Failed to load template component ${templateName}:`,
        error,
      );
      throw new Error(`Template not found: ${templateName}`);
    }
  }

  /**
   * Resolve template file path for dynamic import
   */
  private resolveTemplatePath(templateName: string): string {
    // Map template names to their file paths
    const templateMap = {
      // Auth templates
      welcome: "./templates/emails/WelcomeEmail",
      "password-reset": "./templates/emails/PasswordResetEmail",
      "email-verification": "./templates/emails/EmailVerificationEmail",

      // Order templates
      "order-confirmation": "./templates/emails/OrderConfirmationEmail",
      "order-preparing": "./templates/emails/OrderPreparingEmail",
      "order-ready": "./templates/emails/OrderReadyEmail",
      "order-delivered": "./templates/emails/OrderDeliveredEmail",

      // Subscription templates
      "subscription-created": "./templates/emails/SubscriptionCreatedEmail",
      "subscription-renewed": "./templates/emails/SubscriptionRenewedEmail",
      "subscription-expiring": "./templates/emails/SubscriptionExpiringEmail",
      "subscription-cancelled": "./templates/emails/SubscriptionCancelledEmail",

      // Partner templates
      "partner-welcome": "./templates/emails/PartnerWelcomeEmail",
      "new-order-notification": "./templates/emails/NewOrderNotificationEmail",
      "earnings-summary": "./templates/emails/EarningsSummaryEmail",

      // Payment templates
      "payment-success": "./templates/emails/PaymentSuccessEmail",
      "payment-failed": "./templates/emails/PaymentFailedEmail",
      "refund-processed": "./templates/emails/RefundProcessedEmail",
    };

    const templatePath = templateMap[templateName];
    if (!templatePath) {
      throw new Error(`Unknown template: ${templateName}`);
    }

    return templatePath;
  }

  /**
   * Prepare template data with common variables
   */
  private prepareTemplateData(data: TemplateData): TemplateData {
    return {
      ...data,
      appName: data.appName || "Tiffin-Wale",
      appUrl: data.appUrl || process.env.APP_URL || "https://tiffin-wale.com",
      supportEmail:
        data.supportEmail ||
        process.env.SUPPORT_EMAIL ||
        "support@tiffin-wale.com",
      currentYear: data.currentYear || new Date().getFullYear(),
      brandColors: {
        primary: "#FF6B35",
        secondary: "#2E8B57",
        accent: "#FFA500",
        text: "#333333",
        background: "#FFFFFF",
        muted: "#6B7280",
      },
      // Add timestamp for cache busting
      timestamp: Date.now(),
    };
  }

  /**
   * Get template subject (from metadata or default)
   */
  private async getTemplateSubject(
    templateName: string,
    data: TemplateData,
  ): Promise<string> {
    // Default subjects for different template types
    const defaultSubjects = {
      welcome: `Welcome to ${data.appName || "Tiffin-Wale"}!`,
      "password-reset": `Reset Your Password - ${data.appName || "Tiffin-Wale"}`,
      "email-verification": `Verify Your Email - ${data.appName || "Tiffin-Wale"}`,
      "order-confirmation": `Order Confirmed #${data.order?.orderNumber || "N/A"} - ${data.appName || "Tiffin-Wale"}`,
      "order-preparing": `Your Order is Being Prepared #${data.order?.orderNumber || "N/A"}`,
      "order-ready": `Your Order is Ready #${data.order?.orderNumber || "N/A"}`,
      "order-delivered": `Order Delivered #${data.order?.orderNumber || "N/A"} - Rate Your Experience`,
      "subscription-created": `Subscription Activated - ${data.appName || "Tiffin-Wale"}`,
      "subscription-renewed": `Subscription Renewed - ${data.appName || "Tiffin-Wale"}`,
      "subscription-expiring": `Subscription Expiring Soon - ${data.appName || "Tiffin-Wale"}`,
      "subscription-cancelled": `Subscription Cancelled - ${data.appName || "Tiffin-Wale"}`,
      "partner-welcome": `Welcome to ${data.appName || "Tiffin-Wale"} Partner Program!`,
      "new-order-notification": `New Order Received #${data.order?.orderNumber || "N/A"}`,
      "earnings-summary": `Your Earnings Summary - ${data.period || "This Week"}`,
      "payment-success": `Payment Successful - ${data.appName || "Tiffin-Wale"}`,
      "payment-failed": `Payment Failed - Action Required`,
      "refund-processed": `Refund Processed - ${data.appName || "Tiffin-Wale"}`,
    };

    return (
      defaultSubjects[templateName] ||
      `Notification from ${data.appName || "Tiffin-Wale"}`
    );
  }

  /**
   * Clear template cache (useful for development)
   */
  clearCache(): void {
    this.templateCache.clear();
    this.logger.debug("React Email template cache cleared");
  }

  /**
   * Get available templates
   */
  async getAvailableTemplates(): Promise<string[]> {
    return [
      // Auth templates
      "welcome",
      "password-reset",
      "email-verification",

      // Order templates
      "order-confirmation",
      "order-preparing",
      "order-ready",
      "order-delivered",

      // Subscription templates
      "subscription-created",
      "subscription-renewed",
      "subscription-expiring",
      "subscription-cancelled",

      // Partner templates
      "partner-welcome",
      "new-order-notification",
      "earnings-summary",

      // Payment templates
      "payment-success",
      "payment-failed",
      "refund-processed",
    ];
  }

  /**
   * Render template to plain text (for email clients that don't support HTML)
   */
  async renderToText(
    templateName: string,
    data: TemplateData,
  ): Promise<string> {
    try {
      const TemplateComponent = await this.getTemplateComponent(templateName);
      const templateData = this.prepareTemplateData(data);

      // Render to plain text
      const text = render(TemplateComponent(templateData), { plainText: true });

      return text;
    } catch (error) {
      this.logger.error(
        `Failed to render template ${templateName} to text:`,
        error,
      );
      throw new Error(`Text rendering failed: ${error.message}`);
    }
  }
}
