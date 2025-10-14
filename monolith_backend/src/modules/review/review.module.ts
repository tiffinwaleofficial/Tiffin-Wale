import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";
import { Review, ReviewSchema } from "./schemas/review.schema";
import { Partner, PartnerSchema } from "../partner/schemas/partner.schema";
import { MenuItem, MenuItemSchema } from "../menu/schemas/menu-item.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Partner.name, schema: PartnerSchema },
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
