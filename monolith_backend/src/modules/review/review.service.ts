import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Review } from "./schemas/review.schema";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Partner } from "../partner/schemas/partner.schema";
import { MenuItem } from "../menu/schemas/menu-item.schema";

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Partner.name) private readonly partnerModel: Model<Partner>,
    @InjectModel(MenuItem.name) private readonly menuItemModel: Model<MenuItem>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    const { rating, comment, images, restaurantId, menuItemId } = createReviewDto;

    // Validate that either restaurantId or menuItemId is provided, but not both
    if (!restaurantId && !menuItemId) {
      throw new BadRequestException("Either restaurantId or menuItemId must be provided");
    }
    if (restaurantId && menuItemId) {
      throw new BadRequestException("Cannot review both restaurant and menu item in one review");
    }

    // Check if user already reviewed this specific restaurant/item
    const existingReview = await this.reviewModel.findOne({
      user: userId,
      ...(restaurantId ? { restaurant: restaurantId } : {}),
      ...(menuItemId ? { menuItem: menuItemId } : {})
    });

    if (existingReview) {
      throw new BadRequestException("You have already reviewed this restaurant/item");
    }

    // Verify restaurant/item exists
    if (restaurantId) {
      const restaurant = await this.partnerModel.findById(restaurantId);
      if (!restaurant) {
        throw new NotFoundException("Restaurant not found");
      }
    }

    if (menuItemId) {
      const menuItem = await this.menuItemModel.findById(menuItemId);
      if (!menuItem) {
        throw new NotFoundException("Menu item not found");
      }
    }

    const review = new this.reviewModel({
      user: userId,
      restaurant: restaurantId,
      menuItem: menuItemId,
      rating,
      comment,
      images: images || [],
    });

    const savedReview = await review.save();

    // Update average rating and total reviews
    await this.updateRatingStats(restaurantId, menuItemId);

    return savedReview;
  }

  async getRestaurantReviews(restaurantId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ restaurant: restaurantId })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .exec();
  }

  async getMenuItemReviews(menuItemId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ menuItem: menuItemId })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .exec();
  }

  async markHelpful(reviewId: string): Promise<Review> {
    const review = await this.reviewModel.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      throw new NotFoundException("Review not found");
    }

    return review;
  }

  private async updateRatingStats(restaurantId?: string, menuItemId?: string): Promise<void> {
    if (restaurantId) {
      const reviews = await this.reviewModel.find({ restaurant: restaurantId });
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      const totalReviews = reviews.length;

      await this.partnerModel.findByIdAndUpdate(restaurantId, {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews,
      });
    }

    if (menuItemId) {
      const reviews = await this.reviewModel.find({ menuItem: menuItemId });
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      const totalReviews = reviews.length;

      await this.menuItemModel.findByIdAndUpdate(menuItemId, {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews,
      });
    }
  }
}
