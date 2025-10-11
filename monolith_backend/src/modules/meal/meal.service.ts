import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Meal, MealStatus } from "./schemas/meal.schema";
import { CreateMealDto } from "./dto/create-meal.dto";

@Injectable()
export class MealService {
  constructor(@InjectModel(Meal.name) private mealModel: Model<Meal>) {}

  async create(createMealDto: CreateMealDto): Promise<Meal> {
    const createdMeal = new this.mealModel(createMealDto);
    return createdMeal.save();
  }

  async findById(id: string): Promise<Meal> {
    const meal = await this.mealModel.findById(id).exec();
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    return meal;
  }

  async getTodayMeals(userId: string): Promise<Meal[]> {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
    );

    return this.mealModel
      .find({
        userId: userId,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .populate("restaurantId", "name address")
      .exec();
  }

  // Backward-compatible alias used elsewhere
  async findTodayMeals(userId: string): Promise<Meal[]> {
    return this.getTodayMeals(userId);
  }

  async getMealHistory(userId: string): Promise<Meal[]> {
    return this.mealModel
      .find({
        userId: userId,
      })
      .populate("restaurantId", "name address")
      .sort({ date: -1 })
      .limit(50)
      .exec();
  }

  async updateStatus(id: string, status: MealStatus): Promise<Meal> {
    const meal = await this.findById(id);

    // Validate status transition
    if (!this.isValidStatusTransition(meal.status, status)) {
      throw new BadRequestException(
        `Invalid status transition from ${meal.status} to ${status}`,
      );
    }

    return this.mealModel
      .findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true })
      .exec();
  }

  async skipMeal(id: string, reason?: string): Promise<Meal> {
    const meal = await this.findById(id);

    if (meal.status !== MealStatus.SCHEDULED) {
      throw new BadRequestException("Only scheduled meals can be skipped");
    }

    return this.mealModel
      .findByIdAndUpdate(
        id,
        {
          status: MealStatus.SKIPPED,
          skipReason: reason,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async rateMeal(id: string, rating: number, review?: string): Promise<Meal> {
    const meal = await this.findById(id);

    if (meal.status !== MealStatus.DELIVERED) {
      throw new BadRequestException("Only delivered meals can be rated");
    }

    if (meal.userRating) {
      throw new BadRequestException("Meal has already been rated");
    }

    return this.mealModel
      .findByIdAndUpdate(
        id,
        {
          userRating: rating,
          userReview: review,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  private isValidStatusTransition(
    currentStatus: MealStatus,
    newStatus: MealStatus,
  ): boolean {
    const validTransitions = {
      [MealStatus.SCHEDULED]: [
        MealStatus.PREPARING,
        MealStatus.CANCELLED,
        MealStatus.SKIPPED,
      ],
      [MealStatus.PREPARING]: [MealStatus.READY, MealStatus.CANCELLED],
      [MealStatus.READY]: [MealStatus.DELIVERED, MealStatus.CANCELLED],
      [MealStatus.DELIVERED]: [], // Final state
      [MealStatus.CANCELLED]: [], // Final state
      [MealStatus.SKIPPED]: [], // Final state
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  async findByCustomer(customerId: string): Promise<Meal[]> {
    return this.mealModel
      .find({ userId: customerId })
      .populate("restaurantId", "name address")
      .sort({ date: -1 })
      .exec();
  }

  async findByPartner(partnerId: string, date?: string): Promise<Meal[]> {
    const query: any = { restaurantId: partnerId };

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
      );
      const endOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        23,
        59,
        59,
      );

      query.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    return this.mealModel
      .find(query)
      .populate("userId", "firstName lastName email")
      .sort({ date: -1 })
      .exec();
  }
}
