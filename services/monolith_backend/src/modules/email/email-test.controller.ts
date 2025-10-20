import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { EmailService } from "./email.service";
import { TemplateService } from "./template.service";

interface TestEmailRequest {
  to: string;
  template: string;
  data: any;
}

@ApiTags("Email Testing")
@Controller("email-test")
export class EmailTestController {
  constructor(
    private emailService: EmailService,
    private templateService: TemplateService,
  ) {}

  @Get("health")
  @ApiOperation({ summary: "Health check for email testing" })
  @ApiResponse({ status: 200, description: "Email service is healthy" })
  async healthCheck() {
    return {
      success: true,
      message: "Email testing service is running",
      timestamp: new Date().toISOString(),
    };
  }

  @Post("send")
  @ApiOperation({ summary: "Send test email (No auth required)" })
  @ApiResponse({ status: 200, description: "Test email sent successfully" })
  async sendTestEmail(@Body() request: TestEmailRequest) {
    try {
      // Get subject for the template
      const subject = await this.getTemplateSubject(
        request.template,
        request.data,
      );

      // Get appropriate sender email based on template type
      const fromEmail = this.getSenderEmailForTemplate(request.template);

      // Use the email service's sendTemplateEmail method via reflection
      // Since it's private, we'll access it through the service instance
      const emailService = this.emailService as any;
      const result = await emailService.sendTemplateEmail({
        to: request.to,
        subject,
        template: request.template,
        data: request.data,
        from: fromEmail,
      });

      return {
        success: true,
        message: `Test email sent successfully to ${request.to}`,
        template: request.template,
        subject,
        from: fromEmail,
        result,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to send test email: ${error.message}`,
        template: request.template,
        error: error.message,
      };
    }
  }

  @Post("preview")
  @ApiOperation({ summary: "Preview email template (No auth required)" })
  @ApiResponse({ status: 200, description: "Email preview generated" })
  async previewEmail(@Body() request: { template: string; data: any }) {
    try {
      const preview = await this.templateService.previewTemplate(
        request.template,
        request.data,
      );

      return {
        success: true,
        message: "Email preview generated successfully",
        template: request.template,
        preview,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to generate preview: ${error.message}`,
        template: request.template,
        error: error.message,
      };
    }
  }

  @Get("templates")
  @ApiOperation({ summary: "Get available templates for testing" })
  @ApiResponse({ status: 200, description: "List of available templates" })
  async getAvailableTemplates() {
    const templates = [
      "welcome",
      "password-reset",
      "email-verification",
      "order-confirmation",
      "order-preparing",
      "order-ready",
      "order-delivered",
      "subscription-created",
      "subscription-renewed",
      "subscription-expiring",
      "subscription-cancelled",
      "partner-welcome",
      "new-order-notification",
      "earnings-summary",
      "payment-success",
      "payment-failed",
      "refund-processed",
    ];

    return {
      success: true,
      message: "Available templates retrieved",
      templates,
      count: templates.length,
    };
  }

  private getSenderEmailForTemplate(templateName: string): string {
    // Map templates to appropriate sender email types
    const templateToEmailType = {
      // Welcome and auth emails - info@
      welcome: "info",
      "email-verification": "info",
      "password-reset": "info",

      // Order related emails - orders@
      "order-confirmation": "orders",
      "order-preparing": "orders",
      "order-ready": "orders",
      "order-delivered": "orders",
      "new-order-notification": "orders",

      // Payment and billing emails - billing@
      "payment-success": "billing",
      "payment-failed": "billing",
      "refund-processed": "billing",
      "subscription-created": "billing",
      "subscription-renewed": "billing",
      "subscription-expiring": "billing",
      "subscription-cancelled": "billing",

      // Partner emails - sales@
      "partner-welcome": "sales",
      "earnings-summary": "sales",
    };

    const emailType = templateToEmailType[templateName] || "info";

    // Get the appropriate email address from environment variables
    const emailAddresses = {
      info: process.env.INFO_EMAIL || "Tiffin-Wale <info@tiffin-wale.com>",
      sales:
        process.env.SALES_EMAIL || "Tiffin-Wale Sales <sales@tiffin-wale.com>",
      orders:
        process.env.ORDERS_EMAIL ||
        "Tiffin-Wale Orders <orders@tiffin-wale.com>",
      billing:
        process.env.BILLING_EMAIL ||
        "Tiffin-Wale Billing <billing@tiffin-wale.com>",
      feedback:
        process.env.FEEDBACK_EMAIL ||
        "Tiffin-Wale Feedback <feedback@tiffin-wale.com>",
      careers:
        process.env.CAREERS_EMAIL ||
        "Tiffin-Wale Careers <careers@tiffin-wale.com>",
      marketing:
        process.env.MARKETING_EMAIL ||
        "Tiffin-Wale Marketing <marketing@tiffin-wale.com>",
      admin:
        process.env.ADMIN_EMAIL || "Tiffin-Wale Admin <admin@tiffin-wale.com>",
    };

    return emailAddresses[emailType] || emailAddresses.info;
  }

  private async getTemplateSubject(
    templateName: string,
    data: any,
  ): Promise<string> {
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
      "earnings-summary": `Your Earnings Summary - ${data.earnings?.period || "This Week"}`,
      "payment-success": `Payment Successful - ${data.appName || "Tiffin-Wale"}`,
      "payment-failed": `Payment Failed - Action Required`,
      "refund-processed": `Refund Processed - ${data.appName || "Tiffin-Wale"}`,
    };

    return (
      defaultSubjects[templateName] ||
      `Notification from ${data.appName || "Tiffin-Wale"}`
    );
  }
}
