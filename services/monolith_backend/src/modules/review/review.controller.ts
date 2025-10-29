import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetCurrentUser } from "../../common/decorators/user.decorator";

@ApiTags("reviews")
@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post("restaurant/:restaurantId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create restaurant review" })
  @ApiParam({ name: "restaurantId", description: "Restaurant ID" })
  @ApiResponse({ status: 201, description: "Review created successfully" })
  @ApiResponse({
    status: 400,
    description: "Invalid input or already reviewed",
  })
  @ApiResponse({ status: 404, description: "Restaurant not found" })
  createRestaurantReview(
    @Param("restaurantId") restaurantId: string,
    @Body() createReviewDto: CreateReviewDto,
    @GetCurrentUser("_id") userId: string,
  ) {
    return this.reviewService.createReview(
      { ...createReviewDto, restaurantId },
      userId,
    );
  }

  @Post("menu-item/:itemId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create menu item review" })
  @ApiParam({ name: "itemId", description: "Menu item ID" })
  @ApiResponse({ status: 201, description: "Review created successfully" })
  @ApiResponse({
    status: 400,
    description: "Invalid input or already reviewed",
  })
  @ApiResponse({ status: 404, description: "Menu item not found" })
  createMenuItemReview(
    @Param("itemId") itemId: string,
    @Body() createReviewDto: CreateReviewDto,
    @GetCurrentUser("_id") userId: string,
  ) {
    return this.reviewService.createReview(
      { ...createReviewDto, menuItemId: itemId },
      userId,
    );
  }

  @Get("restaurant/:restaurantId")
  @ApiOperation({ summary: "Get restaurant reviews" })
  @ApiParam({ name: "restaurantId", description: "Restaurant ID" })
  @ApiResponse({ status: 200, description: "Return restaurant reviews" })
  getRestaurantReviews(@Param("restaurantId") restaurantId: string) {
    return this.reviewService.getRestaurantReviews(restaurantId);
  }

  @Get("menu-item/:itemId")
  @ApiOperation({ summary: "Get menu item reviews" })
  @ApiParam({ name: "itemId", description: "Menu item ID" })
  @ApiResponse({ status: 200, description: "Return menu item reviews" })
  getMenuItemReviews(@Param("itemId") itemId: string) {
    return this.reviewService.getMenuItemReviews(itemId);
  }

  @Patch(":id/helpful")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark review as helpful" })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 200, description: "Review marked as helpful" })
  @ApiResponse({ status: 404, description: "Review not found" })
  markHelpful(@Param("id") id: string) {
    return this.reviewService.markHelpful(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update review" })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 200, description: "Review updated successfully" })
  @ApiResponse({ status: 404, description: "Review not found" })
  @ApiResponse({
    status: 403,
    description: "Not authorized to update this review",
  })
  updateReview(
    @Param("id") id: string,
    @Body() updateReviewDto: CreateReviewDto,
    @GetCurrentUser("_id") userId: string,
  ) {
    return this.reviewService.updateReview(id, updateReviewDto, userId);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete review" })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 200, description: "Review deleted successfully" })
  @ApiResponse({ status: 404, description: "Review not found" })
  @ApiResponse({
    status: 403,
    description: "Not authorized to delete this review",
  })
  deleteReview(@Param("id") id: string, @GetCurrentUser("_id") userId: string) {
    return this.reviewService.deleteReview(id, userId);
  }

  @Post(":id/reply")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Partner reply to review" })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({ status: 200, description: "Reply added successfully" })
  @ApiResponse({ status: 404, description: "Review not found" })
  async replyToReview(
    @Param("id") id: string,
    @Body("response") response: string,
    @GetCurrentUser() user: any,
  ) {
    const userId = user?._id || user?.id || (user as any).sub;
    return this.reviewService.addPartnerResponse(id, userId, response);
  }
}
