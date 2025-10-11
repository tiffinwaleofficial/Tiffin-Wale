import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SubscriptionPlanService } from "./subscription-plan.service";
import { CreateSubscriptionPlanDto } from "./dto/create-subscription-plan.dto";
import { UpdateSubscriptionPlanDto } from "./dto/update-subscription-plan.dto";

@ApiTags("subscription-plans")
@Controller("subscription-plans")
export class SubscriptionPlanController {
  constructor(
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new subscription plan" })
  @ApiResponse({
    status: 201,
    description: "Subscription plan created successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  async create(@Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    return this.subscriptionPlanService.create(createSubscriptionPlanDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all subscription plans" })
  @ApiResponse({ status: 200, description: "Return all subscription plans" })
  async findAll() {
    return this.subscriptionPlanService.findAll();
  }

  @Get("active")
  @ApiOperation({ summary: "Get all active subscription plans" })
  @ApiResponse({ status: 200, description: "Return active subscription plans" })
  async findActive() {
    return this.subscriptionPlanService.findActive();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a specific subscription plan by ID" })
  @ApiResponse({ status: 200, description: "Return the subscription plan" })
  @ApiResponse({ status: 404, description: "Subscription plan not found" })
  @ApiParam({ name: "id", description: "Subscription plan ID" })
  async findOne(@Param("id") id: string) {
    return this.subscriptionPlanService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a subscription plan" })
  @ApiResponse({
    status: 200,
    description: "Subscription plan updated successfully",
  })
  @ApiResponse({ status: 404, description: "Subscription plan not found" })
  @ApiParam({ name: "id", description: "Subscription plan ID" })
  async update(
    @Param("id") id: string,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {
    return this.subscriptionPlanService.update(id, updateSubscriptionPlanDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a subscription plan" })
  @ApiResponse({
    status: 200,
    description: "Subscription plan deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Subscription plan not found" })
  @ApiParam({ name: "id", description: "Subscription plan ID" })
  async remove(@Param("id") id: string) {
    return this.subscriptionPlanService.remove(id);
  }
}
