import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
  ConflictException,
  Req,
  Param,
  Patch,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { MarketingService } from "./marketing.service";
import {
  CreateReferralDto,
  ReferralResponseDto,
  CreateTestimonialDto,
  TestimonialResponseDto,
  GetTestimonialsResponseDto,
  GetTestimonialsQueryDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";

@ApiTags("marketing")
@Controller()
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post("referrals")
  @ApiOperation({ summary: "Submit referral" })
  @ApiResponse({
    status: 201,
    description: "Referral created successfully",
    type: ReferralResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid data format or missing required fields",
  })
  @ApiResponse({
    status: 409,
    description: "Self-referral or already referred",
  })
  @ApiResponse({
    status: 429,
    description: "Too many requests (rate limiting)",
  })
  @ApiBody({ type: CreateReferralDto })
  async createReferral(
    @Body() createReferralDto: CreateReferralDto,
    @Req() request: any,
  ): Promise<ReferralResponseDto> {
    // Prevent self-referrals
    if (createReferralDto.referrerEmail === createReferralDto.referredEmail) {
      throw new ConflictException("You cannot refer yourself");
    }

    // Get user ID if authenticated
    const userId = request.user?.id;
    return this.marketingService.createReferral(createReferralDto, userId);
  }

  @Get("referrals")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "View tracked referrals (admin)" })
  @ApiResponse({
    status: 200,
    description: "List of referrals returned successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  async getReferrals(@Query() query: any) {
    const {
      page = 1,
      limit = 10,
      status,
      utmSource,
      utmMedium,
      utmCampaign,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    return this.marketingService.getReferrals({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      utmSource,
      utmMedium,
      utmCampaign,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    });
  }

  @Post("testimonials")
  @ApiOperation({ summary: "Submit testimonial" })
  @ApiResponse({
    status: 201,
    description: "Testimonial submitted successfully",
    type: TestimonialResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid data format or missing required fields",
  })
  @ApiResponse({
    status: 429,
    description: "Too many requests (rate limiting)",
  })
  @ApiBody({ type: CreateTestimonialDto })
  async createTestimonial(
    @Body() createTestimonialDto: CreateTestimonialDto,
    @Req() request: any,
  ): Promise<TestimonialResponseDto> {
    // Get user ID if authenticated
    const userId = request.user?.id;
    return this.marketingService.createTestimonial(
      createTestimonialDto,
      userId,
    );
  }

  @Get("testimonials/public")
  @ApiOperation({ summary: "Get approved testimonials (public)" })
  @ApiResponse({
    status: 200,
    description: "Public testimonials returned successfully",
  })
  async getPublicTestimonials(@Query() query: any) {
    const { limit = 6, featured = false } = query;

    return this.marketingService.getPublicTestimonials({
      limit: parseInt(limit),
      featured: featured === "true",
    });
  }

  @Get("admin/testimonials")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all testimonials (admin)" })
  @ApiResponse({
    status: 200,
    description: "Testimonials returned successfully",
    type: GetTestimonialsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  async getTestimonials(
    @Query() query: GetTestimonialsQueryDto,
  ): Promise<GetTestimonialsResponseDto> {
    const {
      page = 1,
      limit = 10,
      isApproved,
      isFeatured,
      search,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    return this.marketingService.getTestimonials({
      page: typeof page === "string" ? parseInt(page) : page,
      limit: typeof limit === "string" ? parseInt(limit) : limit,
      isApproved,
      isFeatured,
      search,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    });
  }

  @Patch("admin/testimonials/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update testimonial status (admin)" })
  @ApiParam({ name: "id", description: "Testimonial ID" })
  @ApiResponse({
    status: 200,
    description: "Testimonial updated successfully",
    type: TestimonialResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  @ApiResponse({
    status: 404,
    description: "Testimonial not found",
  })
  async updateTestimonialStatus(
    @Param("id") id: string,
    @Body() updates: { isApproved?: boolean; isFeatured?: boolean },
  ): Promise<TestimonialResponseDto> {
    return this.marketingService.updateTestimonialStatus(id, updates);
  }
}
