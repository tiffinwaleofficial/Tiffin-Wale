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
      useFactory: async (configService: ConfigService) => {
        const isServerless =
          process.env.VERCEL === "1" || process.env.IS_SERVERLESS === "true";

        return {
          uri: configService.get<string>("MONGODB_URI"),
          // Serverless-optimized connection settings
          maxPoolSize: isServerless ? 1 : 10, // Limit connections in serverless
          minPoolSize: isServerless ? 0 : 2,
          maxIdleTimeMS: isServerless ? 10000 : 60000, // Close idle connections faster in serverless
          serverSelectionTimeoutMS: 10000, // Faster timeout for serverless
          socketTimeoutMS: 45000,
          family: 4, // Use IPv4, skip trying IPv6
          retryWrites: true,
          retryReads: true,
          // Connection pooling for serverless
          bufferCommands: false, // Don't buffer commands if not connected
        };
      },
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly connection: Connection) {}

  onModuleInit() {
    try {
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
    } catch (error) {
      this.logger.error(`Failed to initialize database module: ${error.message}`);
      // Don't crash the entire app if database connection fails
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
