import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Patch,
  Inject,
  forwardRef,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { SupportService } from "./support.service";
import { CreateSupportTicketDto } from "./dto/create-support-ticket.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetCurrentUser } from "../../common/decorators/user.decorator";
import { PartnerService } from "../partner/partner.service";
import { UserRole } from "../../common/interfaces/user.interface";

@ApiTags("support")
@Controller("support")
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    @Inject(forwardRef(() => PartnerService))
    private readonly partnerService: PartnerService,
  ) {}

  @Post("tickets")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new support ticket" })
  @ApiResponse({ status: 201, description: "Ticket created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async createTicket(
    @GetCurrentUser() user: any,
    @Body() createTicketDto: CreateSupportTicketDto,
  ) {
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }

    // Set user ID
    createTicketDto.user = userId;

    // If user is a partner, also set partner ID
    if (user.role === UserRole.PARTNER) {
      try {
        const partner = await this.partnerService.findByUserId(userId);
        if (partner) {
          createTicketDto.partner = partner._id.toString();
        }
      } catch (error) {
        // Partner not found, continue without partner ID
        console.log("Partner not found for user:", userId);
      }
    }

    const ticket = await this.supportService.create(createTicketDto);

    return {
      success: true,
      message:
        "Your support request has been submitted successfully. Our team will get back to you within 24 hours.",
      ticket: {
        ticketId: ticket.ticketId,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    };
  }

  @Get("tickets")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all tickets for current user" })
  @ApiResponse({ status: 200, description: "Return user tickets" })
  async getMyTickets(@GetCurrentUser() user: any) {
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }

    return this.supportService.getMyTickets(userId);
  }

  @Get("tickets/:ticketId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get ticket by ID" })
  @ApiResponse({ status: 200, description: "Return ticket details" })
  @ApiResponse({ status: 404, description: "Ticket not found" })
  async getTicket(@Param("ticketId") ticketId: string) {
    return this.supportService.findOne(ticketId);
  }

  @Post("tickets/:ticketId/reply")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add reply to ticket" })
  @ApiResponse({ status: 200, description: "Reply added successfully" })
  async addReply(
    @GetCurrentUser() user: any,
    @Param("ticketId") ticketId: string,
    @Body() body: { message: string },
  ) {
    const userId =
      user._id?.toString() || user.id?.toString() || (user as any).sub;
    if (!userId) {
      throw new NotFoundException("User ID not found in token");
    }

    return this.supportService.addReply(ticketId, body.message, "user", userId);
  }
}
