import { Controller, Post, Get, Body, UseGuards, Query, Req } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDto, FeedbackResponseDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";

@ApiTags("feedback")
@Controller()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post("feedback")
  @ApiOperation({ summary: "Submit feedback or report" })
  @ApiResponse({
    status: 201,
    description: "Feedback submitted successfully",
    type: FeedbackResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid data format or missing required fields",
  })
  @ApiResponse({
    status: 429,
    description: "Too many requests (rate limiting)",
  })
  @ApiBody({ type: CreateFeedbackDto })
  async submitFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Req() request: any,
  ): Promise<FeedbackResponseDto> {
    // Get user from request if authenticated
    const userId = request.user?.id;
    return this.feedbackService.createFeedback(createFeedbackDto, userId);
  }

  @Get("admin/feedback")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "View customer feedback (admin)" })
  @ApiResponse({
    status: 200,
    description: "List of feedback returned successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  async getFeedback(@Query() query: any) {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      category,
      priority,
      status,
      isResolved,
      search,
      startDate,
      endDate,
      sortBy = "createdAt", 
      sortOrder = "desc" 
    } = query;
    
    return this.feedbackService.getFeedbackList({
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      category,
      priority,
      status,
      isResolved: isResolved === 'true' ? true : isResolved === 'false' ? false : undefined,
      search,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    });
  }
} 