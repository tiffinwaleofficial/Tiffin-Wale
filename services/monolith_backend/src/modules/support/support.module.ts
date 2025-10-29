import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SupportController } from "./support.controller";
import { SupportService } from "./support.service";
import {
  SupportTicket,
  SupportTicketSchema,
} from "./schemas/support-ticket.schema";
import { PartnerModule } from "../partner/partner.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportTicket.name, schema: SupportTicketSchema },
    ]),
    forwardRef(() => PartnerModule),
  ],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
