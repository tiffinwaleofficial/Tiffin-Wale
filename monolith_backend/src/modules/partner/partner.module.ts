import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PartnerController } from "./partner.controller";
import { PartnerService } from "./partner.service";
import { Partner, PartnerSchema } from "./schemas/partner.schema";
import { UserModule } from "../user/user.module";
import { OrderModule } from "../order/order.module";
import { MenuModule } from "../menu/menu.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Partner.name, schema: PartnerSchema }]),
    UserModule,
    OrderModule,
    MenuModule,
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService],
})
export class PartnerModule {}
