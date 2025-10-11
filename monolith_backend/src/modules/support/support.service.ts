import { Injectable } from "@nestjs/common";
import { TicketDto } from "./dto/ticket.dto";

interface TicketData {
  id: string;
  userId: string;
  subject: string;
  message: string;
  category: string;
  createdAt: Date;
}

@Injectable()
export class SupportService {
  private tickets: TicketData[] = [];

  createTicket(
    userId: string,
    subject: string,
    message: string,
    category: string,
  ): TicketDto {
    const ticket: TicketData = {
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

  getTicketsForUser(userId: string): TicketDto[] {
    return this.tickets.filter((t) => t.userId === userId);
  }
}
