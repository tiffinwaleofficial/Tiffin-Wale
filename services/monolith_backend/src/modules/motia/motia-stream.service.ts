import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { AxiosResponse } from "axios";

@Injectable()
export class MotiaStreamService {
  private readonly logger = new Logger(MotiaStreamService.name);
  private readonly motiaApiUrl: string;
  private readonly motiaApiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.motiaApiUrl = this.configService.get<string>("MOTIA_API_URL");
    this.motiaApiKey = this.configService.get<string>("MOTIA_API_KEY");

    if (!this.motiaApiUrl || !this.motiaApiKey) {
      this.logger.error(
        "MOTIA_API_URL or MOTIA_API_KEY is not configured. Motia stream integration will not function.",
      );
    }
  }

  private async sendEventToMotia(eventName: string, data: any): Promise<any> {
    if (!this.motiaApiUrl || !this.motiaApiKey) {
      this.logger.warn(
        `Motia API not configured. Skipping event: ${eventName}`,
      );
      return null;
    }

    const url = `${this.motiaApiUrl}/events/${eventName}`;
    const headers = {
      "X-Motia-Api-Key": this.motiaApiKey,
      "Content-Type": "application/json",
    };

    try {
      this.logger.debug(
        `Sending event to Motia: ${eventName} with data: ${JSON.stringify(data)}`,
      );
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(url, data, { headers }),
      );
      this.logger.debug(
        `Motia event ${eventName} response: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to send event ${eventName} to Motia:`,
        error.response?.data || error.message,
      );
      throw new Error(
        `Motia event failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  async sendNotification(notificationData: {
    userId: string;
    userType: "student" | "partner" | "admin";
    type: "order_status" | "general" | "promotion" | "system";
    title: string;
    message: string;
    data?: any;
    expiresAt?: string;
  }): Promise<any> {
    return this.sendEventToMotia("notification.send", notificationData);
  }

  async updateOrderStatus(orderData: {
    orderId: string;
    status:
      | "pending"
      | "confirmed"
      | "preparing"
      | "ready"
      | "delivered"
      | "cancelled";
    userId: string;
    partnerId: string;
    message?: string;
    estimatedTime?: number;
    location?: { latitude: number; longitude: number };
  }): Promise<any> {
    return this.sendEventToMotia("order.status.update", orderData);
  }

  async sendChatMessage(chatMessageData: {
    conversationId: string;
    senderId: string;
    receiverId: string;
    message: string;
  }): Promise<any> {
    return this.sendEventToMotia("chat.message.send", chatMessageData);
  }

  async updateUserPresence(presenceData: {
    userId: string;
    isOnline: boolean;
  }): Promise<any> {
    return this.sendEventToMotia("user.presence.update", presenceData);
  }
}
