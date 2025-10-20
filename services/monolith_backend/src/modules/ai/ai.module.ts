import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FirebaseAIService } from "./firebase-ai.service";
import { AIController } from "./ai.controller";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [ConfigModule, RedisModule],
  controllers: [AIController],
  providers: [FirebaseAIService],
  exports: [FirebaseAIService],
})
export class AIModule {}
