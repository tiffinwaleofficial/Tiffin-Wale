export interface EmailTemplate {
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface EmailData {
  to: string | string[];
  subject: string;
  template: string;
  data: Record<string, any>;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  resendId?: string;
}

export interface TemplateData {
  [key: string]: any;
  // Common template variables
  appName?: string;
  appUrl?: string;
  supportEmail?: string;
  currentYear?: number;
  user?: {
    name: string;
    email: string;
    id: string;
  };
}

export interface EmailPreferences {
  orderUpdates: boolean;
  subscriptionNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

export interface EmailLog {
  to: string;
  subject: string;
  template: string;
  templateData: Record<string, any>;
  status: "pending" | "sent" | "delivered" | "failed" | "bounced";
  resendId?: string;
  errorMessage?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BulkEmailData {
  template: string;
  subject: string;
  recipients: Array<{
    email: string;
    data: Record<string, any>;
  }>;
  from?: string;
}

export interface EmailMetrics {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  failureRate: number;
  templateUsage: Record<string, number>;
}
