import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { MotiaStreamService } from "./motia-stream.service";

@Module({
  imports: [
    ConfigModule,
    HttpModule, // Import HttpModule from @nestjs/axios
  ],
  providers: [MotiaStreamService],
  exports: [MotiaStreamService],
})
export class MotiaStreamModule {}
