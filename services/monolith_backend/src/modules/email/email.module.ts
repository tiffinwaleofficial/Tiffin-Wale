import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { EmailService } from "./email.service";
import { TemplateService } from "./template.service";
import { EmailController } from "./email.controller";
import { EmailTestController } from "./email-test.controller";
import { EmailLog, EmailLogSchema } from "./schemas/email-log.schema";
import {
  EmailPreference,
  EmailPreferenceSchema,
} from "./schemas/email-preference.schema";
import { MailjetService } from "./mailjet.service";
import { emailConfig } from "../../config/email.config";

@Module({
  imports: [
    ConfigModule.forFeature(emailConfig),
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: EmailLog.name, schema: EmailLogSchema },
      { name: EmailPreference.name, schema: EmailPreferenceSchema },
    ]),
  ],
  controllers: [EmailController, EmailTestController],
  providers: [EmailService, TemplateService, MailjetService],
  exports: [EmailService, TemplateService],
})
export class EmailModule {}
