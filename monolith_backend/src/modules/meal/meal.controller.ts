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
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "../../common/interfaces/user.interface";
import { GetCurrentUser } from "../../common/decorators/user.decorator";
import { MealService } from "./meal.service";
import { CreateMealDto } from "./dto/create-meal.dto";
import { UpdateMealDto } from "./dto/update-meal.dto";
import { MealResponseDto } from "./dto/meal-response.dto";
import { MealStatus } from "./schemas/meal.schema";

@ApiTags("meals")
@Controller("meals")
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new meal" })
  @ApiResponse({
    status: 201,
    description: "Meal created successfully",
    type: MealResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Insufficient permissions" })
  create(@Body() createMealDto: CreateMealDto): Promise<MealResponseDto> {
    return this.mealService.create(createMealDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all meals" })
  @ApiResponse({
    status: 200,
    description: "Meals retrieved successfully",
    type: [MealResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Insufficient permissions" })
  findAll(): Promise<MealResponseDto[]> {
    return this.mealService.findAll();
  }

  @Get("today")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get today's meals for the current user" })
  @ApiResponse({
    status: 200,
    description: "Today's meals retrieved successfully",
    type: [MealResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async findTodayMeals(
    @GetCurrentUser("_id") userId: string,
  ): Promise<MealResponseDto[]> {
    return this.mealService.findTodayMeals(userId);
  }

  @Get("history")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get meal history for the current user" })
  @ApiResponse({
    status: 200,
    description: "Meal history retrieved successfully",
    type: [MealResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async findMealHistory(
    @GetCurrentUser("_id") userId: string,
  ): Promise<MealResponseDto[]> {
    return this.mealService.findMealHistory(userId);
  }

  @Get("customer/:customerId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get meals for a specific customer" })
  @ApiParam({
    name: "customerId",
    description: "Customer ID",
    example: "60d21b4667d0d8992e610c87",
  })
  @ApiResponse({
    status: 200,
    description: "Customer meals retrieved successfully",
    type: [MealResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Insufficient permissions" })
  findByCustomer(
    @Param("customerId") customerId: string,
  ): Promise<MealResponseDto[]> {
    return this.mealService.findByCustomer(customerId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a meal by ID" })
  @ApiParam({
    name: "id",
    description: "Meal ID",
    example: "60d21b4667d0d8992e610d01",
  })
  @ApiResponse({
    status: 200,
    description: "Meal retrieved successfully",
    type: MealResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  findOne(@Param("id") id: string): Promise<MealResponseDto> {
    return this.mealService.findById(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a meal" })
  @ApiParam({
    name: "id",
    description: "Meal ID",
    example: "60d21b4667d0d8992e610d01",
  })
  @ApiResponse({
    status: 200,
    description: "Meal updated successfully",
    type: MealResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Insufficient permissions" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  update(
    @Param("id") id: string,
    @Body() updateMealDto: UpdateMealDto,
  ): Promise<MealResponseDto> {
    return this.mealService.update(id, updateMealDto);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BUSINESS)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update meal status" })
  @ApiParam({
    name: "id",
    description: "Meal ID",
    example: "60d21b4667d0d8992e610d01",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: Object.values(MealStatus),
          example: MealStatus.PREPARING,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Meal status updated successfully",
    type: MealResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Insufficient permissions" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: MealStatus,
  ): Promise<MealResponseDto> {
    return this.mealService.updateStatus(id, status);
  }

  @Patch(":id/skip")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Skip a meal" })
  @ApiParam({
    name: "id",
    description: "Meal ID",
    example: "60d21b4667d0d8992e610d01",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          example: "I will be out of town",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Meal skipped successfully",
    type: MealResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  skipMeal(
    @Param("id") id: string,
    @Body("reason") reason?: string,
  ): Promise<MealResponseDto> {
    return this.mealService.skipMeal(id, reason);
  }

  @Post(":id/rate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Rate a meal" })
  @ApiParam({
    name: "id",
    description: "Meal ID",
    example: "60d21b4667d0d8992e610d01",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["rating"],
      properties: {
        rating: {
          type: "number",
          minimum: 1,
          maximum: 5,
          example: 4,
        },
        review: {
          type: "string",
          example: "The food was delicious and arrived on time.",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Meal rated successfully",
    type: MealResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  rateMeal(
    @Param("id") id: string,
    @Body("rating") rating: number,
    @Body("review") review?: string,
  ): Promise<MealResponseDto> {
    return this.mealService.rateMeal(id, rating, review);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a meal" })
  @ApiParam({
    name: "id",
    description: "Meal ID",
    example: "60d21b4667d0d8992e610d01",
  })
  @ApiResponse({
    status: 200,
    description: "Meal deleted successfully",
    schema: {
      type: "object",
      properties: {
        deleted: {
          type: "boolean",
          example: true,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Insufficient permissions" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  remove(@Param("id") id: string) {
    return this.mealService.delete(id);
  }
} 