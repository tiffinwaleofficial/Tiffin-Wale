import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { CustomerProfileService } from "./customer-profile.service";
import {
  CreateCustomerProfileDto,
  UpdateCustomerProfileDto,
  CustomerProfileResponseDto,
  CustomerListResponseDto,
  CustomerStatisticsDto,
} from "./dto/customer-profile.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";
import { GetCurrentUser } from "../../common/decorators/user.decorator";

@ApiTags("customers")
@Controller("customers")
export class CustomerProfileController {
  constructor(
    private readonly customerProfileService: CustomerProfileService,
  ) {}

  @Post("profile")
  @ApiOperation({
    summary: "Create customer profile",
    description:
      "Submit additional customer details to create a customer profile",
  })
  @ApiResponse({
    status: 201,
    description: "Profile created successfully",
    type: CustomerProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid data or profile exists",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Missing or invalid token",
  })
  @ApiResponse({ status: 403, description: "Forbidden - Not a customer role" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req,
    @Body() createProfileDto: CreateCustomerProfileDto,
  ): Promise<CustomerProfileResponseDto> {
    // The JWT strategy extracts user as a full User entity
    // Access the correct ID property based on what's available
    const userId = req.user._id || req.user.id || req.user.userId;

    // Ensure user is creating their own profile
    return this.customerProfileService.create(userId, createProfileDto);
  }

  @Get(":id/profile")
  @ApiOperation({
    summary: "Get customer profile",
    description: "Retrieve a customer's profile data",
  })
  @ApiParam({ name: "id", description: "Customer user ID" })
  @ApiResponse({
    status: 200,
    description: "Profile details returned successfully",
    type: CustomerProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Missing or invalid token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Profile not found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CUSTOMER)
  async findOne(
    @Request() req,
    @Param("id") id: string,
  ): Promise<CustomerProfileResponseDto> {
    // Get the authenticated user's ID
    const userId = req.user._id || req.user.id || req.user.userId;

    // Check if user is requesting their own profile or is an admin
    if (
      userId !== id &&
      req.user.role !== UserRole.ADMIN &&
      req.user.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException("Cannot access other user's profile");
    }

    return this.customerProfileService.findByUserId(id);
  }

  @Patch(":id/profile")
  @ApiOperation({
    summary: "Update customer profile",
    description: "Update an existing customer profile",
  })
  @ApiParam({ name: "id", description: "Customer user ID" })
  @ApiResponse({
    status: 200,
    description: "Profile updated successfully",
    type: CustomerProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid data format",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Missing or invalid token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Profile not found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CUSTOMER)
  async update(
    @Request() req,
    @Param("id") id: string,
    @Body() updateProfileDto: UpdateCustomerProfileDto,
  ): Promise<CustomerProfileResponseDto> {
    // Get the authenticated user's ID
    const userId = req.user._id || req.user.id || req.user.userId;

    // Check if user is updating their own profile or is an admin
    if (
      userId !== id &&
      req.user.role !== UserRole.ADMIN &&
      req.user.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException("Cannot update other user's profile");
    }

    return this.customerProfileService.update(id, updateProfileDto);
  }

  @Get("city/:city")
  @ApiOperation({
    summary: "Get customers by city",
    description: "Retrieve all customers from a specific city",
  })
  @ApiParam({ name: "city", description: "Name of the city to filter by" })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number",
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of items per page",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Customers list returned successfully",
    type: CustomerListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Missing or invalid token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "No customers found" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async findByCity(
    @Param("city") city: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<CustomerListResponseDto> {
    return this.customerProfileService.findByCity(city, page, limit);
  }

  @Get("stats")
  @ApiOperation({
    summary: "Get customer statistics",
    description: "Retrieve aggregated statistics about customers",
  })
  @ApiResponse({
    status: 200,
    description: "Statistics returned successfully",
    type: CustomerStatisticsDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Missing or invalid token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions",
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async getStatistics(): Promise<CustomerStatisticsDto> {
    return this.customerProfileService.getStatistics();
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current customer's profile" })
  @ApiResponse({ status: 200, description: "Profile details returned successfully", type: CustomerProfileResponseDto })
  getCurrentProfile(@GetCurrentUser("_id") userId: string): Promise<CustomerProfileResponseDto> {
    return this.customerProfileService.findByUserId(userId);
  }

  @Patch("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current customer's profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully", type: CustomerProfileResponseDto })
  updateCurrentProfile(
    @GetCurrentUser("_id") userId: string,
    @Body() updateProfileDto: UpdateCustomerProfileDto,
  ): Promise<CustomerProfileResponseDto> {
    return this.customerProfileService.update(userId, updateProfileDto);
  }
}
