import { Module, Logger, OnModuleInit, DynamicModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Connection } from "mongoose";
import { getConnectionToken } from "@nestjs/mongoose";

@Module({
  imports: [
    // Mongoose Configuration (MongoDB)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.on("connected", () => {
      this.logger.log("MongoDB connection established successfully");
      this.logDatabaseInfo();
    });

    this.connection.on("disconnected", () => {
      this.logger.warn("MongoDB connection disconnected");
    });

    this.connection.on("error", (error) => {
      this.logger.error(
        `MongoDB connection error: ${error.message}`,
        error.stack,
      );
    });

    // If already connected when module initializes
    if (this.connection.readyState === 1) {
      this.logger.log("MongoDB connection already established");
      this.logDatabaseInfo();
    }
  }

  private logDatabaseInfo() {
    const { host, port, name } = this.connection;
    this.logger.log(`Connected to MongoDB at ${host}:${port}/${name}`);
  }

  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: Connection,
          useFactory: (connection: Connection) => connection,
          inject: [getConnectionToken()],
        },
      ],
      exports: [Connection],
    };
  }
}
