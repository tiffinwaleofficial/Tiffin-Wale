import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Meal, MealStatus } from "./schemas/meal.schema";
import { CreateMealDto } from "./dto/create-meal.dto";
import { UpdateMealDto } from "./dto/update-meal.dto";
import { MenuService } from "../menu/menu.service";
import { MealResponseDto } from "./dto/meal-response.dto";
import { UserService } from "../user/user.service";

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name) private readonly mealModel: Model<Meal>,
    private readonly menuService: MenuService,
    private readonly userService: UserService,
  ) {}

  /**
   * Transforms meal data to response format
   */
  private async transformMealResponse(meal: Meal): Promise<MealResponseDto> {
    const populatedMeal = await meal.populate({
      path: "menuItems",
      select: "name description price imageUrl",
    });

    const menuItems = populatedMeal.menuItems.map((item: any) => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
    }));

    return {
      id: meal._id.toString(),
      type: meal.type,
      scheduledDate: meal.scheduledDate.toISOString(),
      menuItems,
      status: meal.status,
      customerId: meal.customer.toString(),
      businessPartnerId: meal.businessPartner?.toString(),
      businessPartnerName: meal.businessPartnerName,
      isRated: meal.isRated,
      rating: meal.rating,
      review: meal.review,
      cancellationReason: meal.cancellationReason,
      deliveryNotes: meal.deliveryNotes,
      deliveredAt: meal.deliveredAt?.toISOString(),
      createdAt: meal.createdAt.toISOString(),
      updatedAt: meal.updatedAt.toISOString(),
    };
  }

  /**
   * Creates a new meal
   */
  async create(createMealDto: CreateMealDto): Promise<MealResponseDto> {
    try {
      // Verify that all menu items exist
      const menuItemPromises = createMealDto.menuItems.map((id) =>
        this.menuService.findMenuItemById(id),
      );
      await Promise.all(menuItemPromises);

      // Create new meal
      const newMeal = new this.mealModel(createMealDto);
      const savedMeal = await newMeal.save();

      return this.transformMealResponse(savedMeal);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(
          `One or more menu items not found: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        `Failed to create meal: ${error.message}`,
      );
    }
  }

  /**
   * Finds all meals
   */
  async findAll(): Promise<MealResponseDto[]> {
    const meals = await this.mealModel.find().sort({ scheduledDate: -1 }).exec();
    const responsePromises = meals.map((meal) =>
      this.transformMealResponse(meal),
    );
    return Promise.all(responsePromises);
  }

  /**
   * Finds a specific meal by ID
   */
  async findById(id: string): Promise<MealResponseDto> {
    const meal = await this.mealModel.findById(id).exec();
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    return this.transformMealResponse(meal);
  }

  /**
   * Find meals for a specific customer
   */
  async findByCustomer(customerId: string): Promise<MealResponseDto[]> {
    const meals = await this.mealModel
      .find({ customer: customerId })
      .sort({ scheduledDate: -1 })
      .exec();

    const responsePromises = meals.map((meal) =>
      this.transformMealResponse(meal),
    );
    return Promise.all(responsePromises);
  }

  /**
   * Find meals for today for a specific customer
   */
  async findTodayMeals(customerId: string): Promise<MealResponseDto[]> {
    // Get today's date range (start of day to end of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find meals scheduled for today
    const meals = await this.mealModel
      .find({
        customer: customerId,
        scheduledDate: {
          $gte: today,
          $lt: tomorrow,
        },
      })
      .sort({ scheduledDate: 1 })
      .exec();

    const responsePromises = meals.map((meal) =>
      this.transformMealResponse(meal),
    );
    return Promise.all(responsePromises);
  }

  /**
   * Find meal history for a specific customer (excluding today)
   */
  async findMealHistory(customerId: string): Promise<MealResponseDto[]> {
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find meals scheduled before today
    const meals = await this.mealModel
      .find({
        customer: customerId,
        scheduledDate: { $lt: today },
      })
      .sort({ scheduledDate: -1 })
      .exec();

    const responsePromises = meals.map((meal) =>
      this.transformMealResponse(meal),
    );
    return Promise.all(responsePromises);
  }

  /**
   * Updates a meal
   */
  async update(
    id: string,
    updateMealDto: UpdateMealDto,
  ): Promise<MealResponseDto> {
    const updatedMeal = await this.mealModel
      .findByIdAndUpdate(id, updateMealDto, { new: true })
      .exec();

    if (!updatedMeal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    return this.transformMealResponse(updatedMeal);
  }

  /**
   * Updates the status of a meal
   */
  async updateStatus(
    id: string,
    status: MealStatus,
  ): Promise<MealResponseDto> {
    // If setting to delivered, also set deliveredAt timestamp
    const updateData: any = { status };
    if (status === MealStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    const updatedMeal = await this.mealModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedMeal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    return this.transformMealResponse(updatedMeal);
  }

  /**
   * Skips a meal (marks as SKIPPED)
   */
  async skipMeal(
    id: string,
    reason?: string,
  ): Promise<MealResponseDto> {
    const updateData: any = { 
      status: MealStatus.SKIPPED,
      cancellationReason: reason || 'Customer skipped meal',
    };

    const updatedMeal = await this.mealModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedMeal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    return this.transformMealResponse(updatedMeal);
  }

  /**
   * Rates a meal
   */
  async rateMeal(
    id: string,
    rating: number,
    review?: string,
  ): Promise<MealResponseDto> {
    const updateData: any = { 
      isRated: true,
      rating,
      review,
    };

    const updatedMeal = await this.mealModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedMeal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    return this.transformMealResponse(updatedMeal);
  }

  /**
   * Deletes a meal
   */
  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.mealModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    return { deleted: true };
  }
} 