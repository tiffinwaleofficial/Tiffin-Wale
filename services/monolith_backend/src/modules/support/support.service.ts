import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SupportTicket, TicketStatus } from "./schemas/support-ticket.schema";
import { CreateSupportTicketDto } from "./dto/create-support-ticket.dto";

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(SupportTicket.name)
    private supportTicketModel: Model<SupportTicket>,
  ) {}

  async generateTicketId(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.supportTicketModel.countDocuments();
    const ticketNumber = (count + 1).toString().padStart(5, "0");
    return `TW-${year}-${ticketNumber}`;
  }

  async create(
    createTicketDto: CreateSupportTicketDto,
  ): Promise<SupportTicket> {
    const ticketId = await this.generateTicketId();
    const newTicket = new this.supportTicketModel({
      ...createTicketDto,
      ticketId,
    });
    return newTicket.save();
  }

  async findAll(userId?: string): Promise<SupportTicket[]> {
    const query: any = {};
    if (userId) {
      query.user = userId;
    }
    return this.supportTicketModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(ticketId: string): Promise<SupportTicket> {
    const ticket = await this.supportTicketModel
      .findOne({ ticketId })
      .populate("user", "firstName lastName email phoneNumber")
      .populate("partner", "businessName contactEmail contactPhone")
      .exec();

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    return ticket;
  }

  async addReply(
    ticketId: string,
    message: string,
    by: string,
    userId?: string,
    adminId?: string,
  ): Promise<SupportTicket> {
    const ticket = await this.findOne(ticketId);

    ticket.replies.push({
      message,
      by,
      userId,
      adminId,
      timestamp: new Date(),
    });

    return ticket.save();
  }

  async updateStatus(
    ticketId: string,
    status: TicketStatus,
  ): Promise<SupportTicket> {
    const ticket = await this.findOne(ticketId);
    ticket.status = status;

    if (status === TicketStatus.RESOLVED) {
      ticket.resolvedAt = new Date();
    } else if (status === TicketStatus.CLOSED) {
      ticket.closedAt = new Date();
    }

    return ticket.save();
  }

  async getMyTickets(userId: string): Promise<SupportTicket[]> {
    return this.supportTicketModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
