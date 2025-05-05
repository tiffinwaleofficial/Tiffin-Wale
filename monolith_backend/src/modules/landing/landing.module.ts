import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LandingController } from "./landing.controller";
import { LandingService } from "./landing.service";
import { Contact, ContactSchema, Subscriber, SubscriberSchema } from "./schemas";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema },
      { name: Subscriber.name, schema: SubscriberSchema },
    ]),
  ],
  controllers: [LandingController],
  providers: [LandingService],
  exports: [LandingService],
})
export class LandingModule {} 