import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { SupportService } from "./support.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetCurrentUser } from "../../common/decorators/user.decorator";
import { TicketDto } from "./dto/ticket.dto";
import { ApiProperty } from "@nestjs/swagger";

class CreateTicketDto {
  @ApiProperty()
  subject: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  category: string;
}

@ApiTags("support")
@Controller("support")
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post("ticket")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new support ticket" })
  @ApiBody({ type: CreateTicketDto })
  @ApiResponse({
    status: 201,
    description: "Ticket created successfully.",
    type: TicketDto,
  })
  createTicket(
    @GetCurrentUser("_id") userId: string,
    @Body() body: CreateTicketDto,
  ): TicketDto {
    return this.supportService.createTicket(
      userId,
      body.subject,
      body.message,
      body.category,
    );
  }

  @Get("tickets")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all support tickets for the current user" })
  @ApiResponse({
    status: 200,
    description: "Returns all support tickets for the user.",
    type: [TicketDto],
  })
  getMyTickets(@GetCurrentUser("_id") userId: string): TicketDto[] {
    return this.supportService.getTicketsForUser(userId);
  }
}
