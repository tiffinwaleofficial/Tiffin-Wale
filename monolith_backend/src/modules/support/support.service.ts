import { Injectable } from "@nestjs/common";

interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  category: string;
  createdAt: Date;
}

@Injectable()
export class SupportService {
  private tickets: Ticket[] = [];

  createTicket(userId: string, subject: string, message: string, category: string) {
    const ticket: Ticket = {
      id: Date.now().toString(),
      userId,
      subject,
      message,
      category,
      createdAt: new Date(),
    };
    this.tickets.push(ticket);
    return ticket;
  }

  getTicketsForUser(userId: string) {
    return this.tickets.filter((t) => t.userId === userId);
  }
}