import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { NotificationsGateway } from "./notifications.gateway";
import { NativeWebSocketGateway } from "./native-websocket.gateway";
import {
  DeviceRegistration,
  DeviceRegistrationSchema,
} from "./schemas/device-registration.schema";
import {
  Notification,
  NotificationSchema,
} from "./schemas/notification.schema";
import {
  NotificationTemplate,
  NotificationTemplateSchema,
} from "./schemas/notification-template.schema";
import { PushNotificationService } from "./push-notification.service";
import { FirebaseNotificationService } from "./firebase-notification.service";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RedisModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "30d" },
      }),
    }),
    MongooseModule.forFeature([
      { name: DeviceRegistration.name, schema: DeviceRegistrationSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: NotificationTemplate.name, schema: NotificationTemplateSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsGateway,
    NativeWebSocketGateway,
    PushNotificationService,
    FirebaseNotificationService,
  ],
  exports: [
    NotificationsService,
    NotificationsGateway,
    NativeWebSocketGateway,
    PushNotificationService,
    FirebaseNotificationService,
  ],
})
export class NotificationsModule {}
