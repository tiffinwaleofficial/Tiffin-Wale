import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetCurrentUser } from "../../common/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SupportService } from "./support.service";

@ApiTags("support")
@Controller("support")
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post("tickets")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create support ticket" })
  createTicket(
    @GetCurrentUser("_id") userId: string,
    @Body("subject") subject: string,
    @Body("message") message: string,
    @Body("category") category: string,
  ) {
    return this.supportService.createTicket(userId, subject, message, category);
  }

  @Get("tickets/me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get my support tickets" })
  getMyTickets(@GetCurrentUser("_id") userId: string) {
    return this.supportService.getTicketsForUser(userId);
  }
}