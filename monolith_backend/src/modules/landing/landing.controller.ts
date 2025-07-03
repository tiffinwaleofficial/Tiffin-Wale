import { Controller, Post, Body, Get, UseGuards, Query } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { LandingService } from "./landing.service";
import {
  CreateContactDto,
  ContactResponseDto,
  CreateSubscriberDto,
  SubscriberResponseDto,
  GetSubscribersResponseDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";

@ApiTags("landing")
@Controller()
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Post("contact")
  @ApiOperation({ summary: "Submit contact form" })
  @ApiResponse({
    status: 201,
    description: "Contact form submitted successfully",
    type: ContactResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid data format or missing required fields",
  })
  @ApiResponse({
    status: 429,
    description: "Too many requests (rate limiting)",
  })
  @ApiBody({ type: CreateContactDto })
  async submitContact(
    @Body() createContactDto: CreateContactDto,
  ): Promise<ContactResponseDto> {
    return this.landingService.createContact(createContactDto);
  }

  @Post("subscribe")
  @ApiOperation({ summary: "Subscribe to newsletter" })
  @ApiResponse({
    status: 201,
    description: "Subscription created successfully",
    type: SubscriberResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid data format or missing required fields",
  })
  @ApiResponse({
    status: 409,
    description: "Email already subscribed",
  })
  @ApiResponse({
    status: 429,
    description: "Too many requests (rate limiting)",
  })
  @ApiBody({ type: CreateSubscriberDto })
  async subscribe(
    @Body() createSubscriberDto: CreateSubscriberDto,
  ): Promise<SubscriberResponseDto> {
    return this.landingService.createSubscriber(createSubscriberDto);
  }

  @Get("admin/contacts")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get contact submissions (admin)" })
  @ApiResponse({
    status: 200,
    description: "Contacts list returned successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  async getContacts(@Query() query: any) {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;
    return this.landingService.getContacts({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      search,
      sortBy,
      sortOrder,
    });
  }

  @Get("admin/subscribers")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get newsletter subscribers (admin)" })
  @ApiResponse({
    status: 200,
    description: "Subscribers list returned successfully",
    type: GetSubscribersResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  async getSubscribers(
    @Query() query: any,
  ): Promise<GetSubscribersResponseDto> {
    const {
      page = 1,
      limit = 10,
      isActive,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    // Convert isActive to a boolean if it's a string
    const isActiveBoolean =
      isActive === undefined ? undefined : isActive === "true";

    return this.landingService.getSubscribers({
      page: parseInt(page),
      limit: parseInt(limit),
      isActive: isActiveBoolean,
      search,
      sortBy,
      sortOrder,
    });
  }
}
