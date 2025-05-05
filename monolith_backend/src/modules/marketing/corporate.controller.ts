import { Controller, Post, Body, Get, UseGuards, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { MarketingService } from "./marketing.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";
import { CreateCorporateQuoteDto } from "./dto";

@ApiTags("corporate")
@Controller("corporate")
export class CorporateController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post("quote")
  @ApiOperation({ summary: "Submit a corporate quote request" })
  @ApiResponse({
    status: 201,
    description: "Corporate quote request submitted successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid data provided",
  })
  async createQuoteRequest(@Body() createQuoteDto: CreateCorporateQuoteDto) {
    return this.marketingService.createCorporateQuote(createQuoteDto);
  }

  @Get("quotes")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get corporate quote requests (admin)" })
  @ApiResponse({
    status: 200,
    description: "Quote requests list returned successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  async getQuoteRequests(@Query() query: any) {
    const { page = 1, limit = 10, status, search, sortBy = "createdAt", sortOrder = "desc" } = query;
    return this.marketingService.getCorporateQuotes({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      search,
      sortBy,
      sortOrder,
    });
  }
} 