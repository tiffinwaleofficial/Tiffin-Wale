import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MarketingController } from "./marketing.controller";
import { MarketingService } from "./marketing.service";
import { Referral, ReferralSchema, Testimonial, TestimonialSchema, CorporateQuote, CorporateQuoteSchema } from "./schemas";
import { CorporateController } from "./corporate.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Referral.name, schema: ReferralSchema },
      { name: Testimonial.name, schema: TestimonialSchema },
      { name: CorporateQuote.name, schema: CorporateQuoteSchema },
    ]),
  ],
  controllers: [
    MarketingController,
    CorporateController,
  ],
  providers: [MarketingService],
  exports: [MarketingService],
})
export class MarketingModule {} 