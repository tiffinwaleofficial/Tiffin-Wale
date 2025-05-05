import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiSecurity,
} from "@nestjs/swagger";
import { PartnerService } from "./partner.service";
import {
  CreatePartnerDto,
  UpdatePartnerDto,
  PartnerResponseDto,
  PartnerListResponseDto,
  PartnerStatusUpdateDto,
} from "./dto/partner.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";

@ApiTags("partners")
@Controller("partners")
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @ApiOperation({
    summary: "Register a new partner",
    description: "Anyone can register as a partner without authentication.",
  })
  @ApiResponse({
    status: 201,
    description: "Partner successfully created",
    type: PartnerResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - validation failed" })
  @ApiResponse({ status: 409, description: "Email already in use" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async create(
    @Body() createPartnerDto: CreatePartnerDto,
  ): Promise<PartnerResponseDto> {
    try {
      return await this.partnerService.create(createPartnerDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Failed to create partner",
          message: error.message || "An unexpected error occurred",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: "Get all partners",
    description: "Restricted to ADMIN and SUPER_ADMIN roles only.",
  })
  @ApiResponse({
    status: 200,
    description: "List of partners returned",
    type: PartnerListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - missing or invalid token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
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
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by status",
    type: String,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("status") status?: string,
  ): Promise<PartnerListResponseDto> {
    return this.partnerService.findAll(page, limit, status);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get partner by ID",
    description: "Any authenticated user can view a partner's details.",
  })
  @ApiResponse({
    status: 200,
    description: "Partner details returned",
    type: PartnerResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - missing or invalid token",
  })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") id: string): Promise<PartnerResponseDto> {
    return this.partnerService.findById(id);
  }

  @Get("user/:userId")
  @ApiOperation({
    summary: "Get partner by user ID",
    description: "Any authenticated user can retrieve a partner by user ID.",
  })
  @ApiResponse({
    status: 200,
    description: "Partner details returned",
    type: PartnerResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - missing or invalid token",
  })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findByUserId(
    @Param("userId") userId: string,
  ): Promise<PartnerResponseDto> {
    return this.partnerService.findByUserId(userId);
  }

  @Put(":id")
  @ApiOperation({
    summary: "Update partner",
    description:
      "Restricted to ADMIN, SUPER_ADMIN, and the partner themselves (BUSINESS role).",
  })
  @ApiResponse({
    status: 200,
    description: "Partner successfully updated",
    type: PartnerResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - missing or invalid token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.BUSINESS)
  async update(
    @Param("id") id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ): Promise<PartnerResponseDto> {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @Put(":id/status")
  @ApiOperation({
    summary: "Update partner status",
    description:
      "Restricted to ADMIN and SUPER_ADMIN roles only. Used to approve, reject, or suspend partners.",
  })
  @ApiResponse({
    status: 200,
    description: "Partner status successfully updated",
    type: PartnerResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - missing or invalid token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async updateStatus(
    @Param("id") id: string,
    @Body() statusUpdateDto: PartnerStatusUpdateDto,
  ): Promise<PartnerResponseDto> {
    return this.partnerService.updateStatus(id, statusUpdateDto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete partner",
    description:
      "Restricted to ADMIN and SUPER_ADMIN roles only. Permanently removes a partner account.",
  })
  @ApiResponse({
    status: 200,
    description: "Partner successfully deleted",
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - missing or invalid token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    await this.partnerService.remove(id);
    return { message: "Partner successfully deleted" };
  }

  @Get(":id/orders")
  @ApiOperation({
    summary: "Get partner orders",
    description:
      "Restricted to ADMIN, SUPER_ADMIN, and the partner themselves (BUSINESS role).",
  })
  @ApiResponse({ status: 200, description: "Partner orders returned" })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - missing or invalid token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
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
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter by status",
    type: String,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.BUSINESS)
  async getPartnerOrders(
    @Param("id") id: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("status") status?: string,
  ): Promise<any> {
    return this.partnerService.getPartnerOrders(id, page, limit, status);
  }

  @Get(":id/menu")
  @ApiOperation({
    summary: "Get partner menu",
    description: "Any authenticated user can view a partner's menu.",
  })
  @ApiResponse({ status: 200, description: "Partner menu returned" })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - missing or invalid token",
  })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getPartnerMenu(@Param("id") id: string): Promise<any> {
    return this.partnerService.getPartnerMenu(id);
  }

  @Get(":id/reviews")
  @ApiOperation({
    summary: "Get partner reviews",
    description: "Any authenticated user can view a partner's reviews.",
  })
  @ApiResponse({ status: 200, description: "Partner reviews returned" })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - missing or invalid token",
  })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getPartnerReviews(
    @Param("id") id: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ): Promise<any> {
    return this.partnerService.getPartnerReviews(id, page, limit);
  }

  @Get(":id/stats")
  @ApiOperation({
    summary: "Get partner statistics",
    description:
      "Restricted to ADMIN, SUPER_ADMIN, and the partner themselves (BUSINESS role).",
  })
  @ApiResponse({ status: 200, description: "Partner statistics returned" })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - missing or invalid token",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.BUSINESS)
  async getPartnerStats(@Param("id") id: string): Promise<any> {
    return this.partnerService.getPartnerStats(id);
  }
}
