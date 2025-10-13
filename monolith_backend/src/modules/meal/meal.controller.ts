import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
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
import { MealService } from "./meal.service";
import { CreateMealDto } from "./dto/create-meal.dto";
import { UpdateMealStatusDto } from "./dto/update-meal-status.dto";
import { SkipMealDto } from "./dto/skip-meal.dto";
import { RateMealDto } from "./dto/rate-meal.dto";
import { GetCurrentUser } from "../../common/decorators/user.decorator";

@ApiTags("meals")
@Controller("meals")
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get("today")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get today's meals for the authenticated user" })
  @ApiResponse({ status: 200, description: "Return today's meals" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getTodayMeals(@GetCurrentUser("_id") userId: string) {
    return this.mealService.getTodayMeals(userId);
  }

  @Get("me/history")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get meal history for the authenticated user" })
  @ApiResponse({ status: 200, description: "Return meal history" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getMealHistory(@GetCurrentUser("_id") userId: string) {
    return this.mealService.getMealHistory(userId);
  }

  @Get("upcoming")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get upcoming meals for the authenticated user" })
  @ApiResponse({ status: 200, description: "Return upcoming meals" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getUpcomingMeals(@GetCurrentUser("_id") userId: string) {
    return this.mealService.getUpcomingMeals(userId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a specific meal by ID" })
  @ApiResponse({ status: 200, description: "Return the meal" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  @ApiParam({ name: "id", description: "Meal ID" })
  async getMealById(@Param("id") id: string) {
    return this.mealService.findById(id);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update meal status" })
  @ApiResponse({ status: 200, description: "Meal status updated successfully" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  @ApiParam({ name: "id", description: "Meal ID" })
  async updateMealStatus(
    @Param("id") id: string,
    @Body() updateMealStatusDto: UpdateMealStatusDto,
  ) {
    return this.mealService.updateStatus(id, updateMealStatusDto.status);
  }

  @Patch(":id/skip")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Skip a meal" })
  @ApiResponse({ status: 200, description: "Meal skipped successfully" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  @ApiParam({ name: "id", description: "Meal ID" })
  async skipMeal(@Param("id") id: string, @Body() skipMealDto: SkipMealDto) {
    return this.mealService.skipMeal(id, skipMealDto.reason);
  }

  @Post(":id/rate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Rate a meal" })
  @ApiResponse({ status: 201, description: "Meal rated successfully" })
  @ApiResponse({ status: 404, description: "Meal not found" })
  @ApiParam({ name: "id", description: "Meal ID" })
  async rateMeal(@Param("id") id: string, @Body() rateMealDto: RateMealDto) {
    return this.mealService.rateMeal(
      id,
      rateMealDto.rating,
      rateMealDto.review,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new meal" })
  @ApiResponse({ status: 201, description: "Meal created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async createMeal(@Body() createMealDto: CreateMealDto) {
    return this.mealService.create(createMealDto);
  }
}
