import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IdempotencyService } from "./idempotency.service";
import { IdempotencyMiddleware } from "./idempotency.middleware";
import {
  IdempotencyKey,
  IdempotencyKeySchema,
} from "./schemas/idempotency-key.schema";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IdempotencyKey.name, schema: IdempotencyKeySchema },
    ]),
    RedisModule,
  ],
  providers: [IdempotencyService, IdempotencyMiddleware],
  exports: [IdempotencyService, IdempotencyMiddleware],
})
export class IdempotencyModule {}
