import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  CustomerProfile,
  CustomerProfileSchema,
} from "./schemas/customer-profile.schema";
import { CustomerProfileService } from "./customer-profile.service";
import { CustomerProfileController } from "./customer-profile.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomerProfile.name, schema: CustomerProfileSchema },
    ]),
    UserModule,
  ],
  controllers: [CustomerProfileController],
  providers: [CustomerProfileService],
  exports: [CustomerProfileService],
})
export class CustomerModule {}
