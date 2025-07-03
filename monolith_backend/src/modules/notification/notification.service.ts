import { Injectable } from "@nestjs/common";
import { OrderStatus } from "../../common/interfaces/order.interface";

@Injectable()
export class NotificationService {
  // For demo purposes only - in a real application, this would come from actual order data
  getRandomOrderStatus(): string {
    const statuses = Object.values(OrderStatus);
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  }

  private notifications: Record<string, any[]> = {};

  getForUser(userId: string) {
    return this.notifications[userId] || [];
  }

  addNotification(userId: string, notif: any) {
    if (!this.notifications[userId]) this.notifications[userId] = [];
    this.notifications[userId].push({ ...notif, id: Date.now().toString(), read: false });
  }

  markAsRead(userId: string, id: string) {
    const userNotifs = this.notifications[userId] || [];
    const notif = userNotifs.find((n) => n.id === id);
    if (notif) notif.read = true;
    return { success: true };
  }

  markAllAsRead(userId: string) {
    (this.notifications[userId] || []).forEach((n) => (n.read = true));
    return { success: true };
  }
}
