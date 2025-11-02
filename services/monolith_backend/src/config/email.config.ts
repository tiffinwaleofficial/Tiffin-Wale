import { registerAs } from "@nestjs/config";

export interface EmailProviderConfig {
  enabled: boolean;
  dailyLimit: number;
  fallbackThreshold: number;
}

export interface ResendConfig extends EmailProviderConfig {
  apiKey: string;
}

export interface MailjetConfig extends EmailProviderConfig {
  apiKey: string;
  secretKey: string;
}

export interface EmailConfig {
  enabled: boolean;
  preferredProvider: "resend" | "mailjet";
  autoFallback: boolean;
  resend: ResendConfig;
  mailjet: MailjetConfig;
  fromEmail: string;
  appUrl: string;
  supportEmail: string;
  emailAddresses: {
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
}

export const emailConfig = registerAs(
  "email",
  (): EmailConfig => ({
    enabled: process.env.EMAIL_ENABLED !== "false",
    preferredProvider:
      (process.env.EMAIL_PREFERRED_PROVIDER as "resend" | "mailjet") ||
      "resend",
    autoFallback: process.env.EMAIL_AUTO_FALLBACK !== "false",

    resend: {
      enabled: process.env.RESEND_ENABLED !== "false",
      apiKey: process.env.RESEND_API_KEY || "",
      dailyLimit: parseInt(process.env.RESEND_DAILY_LIMIT || "100", 10),
      fallbackThreshold: parseFloat(
        process.env.RESEND_FALLBACK_THRESHOLD || "0.9",
      ),
    },

    mailjet: {
      enabled: process.env.MAILJET_ENABLED !== "false",
      apiKey: process.env.MAILJET_API_KEY || "",
      secretKey: process.env.MAILJET_SECRET_KEY || "",
      dailyLimit: parseInt(process.env.MAILJET_DAILY_LIMIT || "200", 10),
      fallbackThreshold: parseFloat(
        process.env.MAILJET_FALLBACK_THRESHOLD || "0.9",
      ),
    },

    fromEmail:
      process.env.FROM_EMAIL || "Tiffin-Wale <noreply@tiffin-wale.com>",
    appUrl: process.env.APP_URL || "https://tiffin-wale.com",
    supportEmail: process.env.SUPPORT_EMAIL || "support@tiffin-wale.com",

    emailAddresses: {
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
      cfo: process.env.CFO_EMAIL || "Riya Tiwari <riya.tiwari@tiffin-wale.com>",
      ceo: process.env.CEO_EMAIL || "Rahul Vishwakarma <admin@tiffin-wale.com>",
    },
  }),
);
