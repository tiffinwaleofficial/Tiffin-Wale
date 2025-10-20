import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";
import { PartnerService } from "./partner.service";
import { CreatePartnerDto } from "./dto/create-partner.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";

@ApiTags("partners")
@Controller("partners")
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new partner" })
  @ApiResponse({ status: 201, description: "Partner created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all partners/restaurants" })
  @ApiResponse({ status: 200, description: "Return all partners" })
  @ApiQuery({
    name: "cuisineType",
    required: false,
    description: "Filter by cuisine type",
  })
  @ApiQuery({
    name: "rating",
    required: false,
    description: "Filter by minimum rating",
  })
  @ApiQuery({ name: "city", required: false, description: "Filter by city" })
  async findAll(
    @Query("cuisineType") cuisineType?: string,
    @Query("rating") rating?: number,
    @Query("city") city?: string,
  ) {
    return this.partnerService.findAll({ cuisineType, rating, city });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific partner by ID" })
  @ApiResponse({ status: 200, description: "Return the partner" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async findOne(@Param("id") id: string) {
    return this.partnerService.findOne(id);
  }

  @Get(":id/menu")
  @ApiOperation({ summary: "Get menu for a specific partner" })
  @ApiResponse({ status: 200, description: "Return partner menu" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async getMenu(@Param("id") id: string) {
    return this.partnerService.getMenu(id);
  }

  @Get(":id/reviews")
  @ApiOperation({ summary: "Get reviews for a specific partner" })
  @ApiResponse({ status: 200, description: "Return partner reviews" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async getReviews(@Param("id") id: string) {
    return this.partnerService.getReviews(id);
  }

  @Get(":id/stats")
  @ApiOperation({ summary: "Get statistics for a specific partner" })
  @ApiResponse({ status: 200, description: "Return partner statistics" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async getStats(@Param("id") id: string) {
    return this.partnerService.getStats(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a partner" })
  @ApiResponse({ status: 200, description: "Partner updated successfully" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async update(
    @Param("id") id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a partner" })
  @ApiResponse({ status: 200, description: "Partner deleted successfully" })
  @ApiResponse({ status: 404, description: "Partner not found" })
  @ApiParam({ name: "id", description: "Partner ID" })
  async remove(@Param("id") id: string) {
    return this.partnerService.remove(id);
  }
}
