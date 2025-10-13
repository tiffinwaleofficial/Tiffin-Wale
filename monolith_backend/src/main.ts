import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger, BadRequestException } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { join } from "path";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  logger.log("Starting TiffinMate Monolith Backend...");

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Configure WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));
  logger.log("WebSocket adapter configured");

  // Add a root route for health checks - BEFORE setting global prefix
  app.getHttpAdapter().get("/", (req, res: any) => {
    res.json({ status: "ok", message: "TiffinWale API is running!" });
  });

  // Set global prefix
  const apiPrefix = configService.get<string>("API_PREFIX") || "api";
  app.setGlobalPrefix(apiPrefix, {
    exclude: ["/"], // Exclude root path from global prefix
  });

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  });
  logger.log("CORS configured for frontend domains");

  // Serve static files
  app.useStaticAssets(join(__dirname, "..", "public"));
  logger.log("Static file serving configured");

  // Register global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  logger.log("Global exception filter configured");

  // Set up global validation pipe with better error messaging
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: false,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => {
          const constraints = error.constraints || {};
          const messages = Object.values(constraints);

          // Add more descriptive messages for common validations
          if (constraints.minLength && error.property === "password") {
            messages.push(
              `Password must be at least ${error.constraints.minLength.split("must be longer than ")[1]}`,
            );
          }
          if (constraints.maxLength && error.property === "password") {
            messages.push(
              `Password cannot be longer than ${error.constraints.maxLength.split("must be shorter than ")[1]}`,
            );
          }

          return {
            field: error.property,
            errors: messages,
          };
        });

        return new BadRequestException({
          statusCode: 400,
          message: "Validation failed",
          errors: formattedErrors,
        });
      },
    }),
  );

  logger.log("Global validation pipe configured");

  // Set up Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>("SWAGGER_TITLE") || "TiffinMate API")
    .setDescription(
      configService.get<string>("SWAGGER_DESCRIPTION") || "API Documentation",
    )
    .setVersion(configService.get<string>("SWAGGER_VERSION") || "1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    configService.get<string>("SWAGGER_PATH") || "api-docs",
    app,
    document,
  );

  logger.log("Swagger documentation configured");

  // Start the server - Directly read from process.env.PORT to ensure Cloud Run compatibility
  // Cloud Run injects the PORT environment variable
  const port = parseInt(process.env.PORT || "8080", 10);
  const environment = configService.get<string>("NODE_ENV") || "development";

  // Log port for debugging
  logger.log(`Starting server on port: ${port} in ${environment} mode`);

  try {
    // Explicitly bind to 0.0.0.0 to listen on all interfaces - critical for containerized environments
    await app.listen(port, "0.0.0.0");
    logger.log(`Application is running on port ${port}`);

    const appUrl = await app.getUrl();
    logger.log(`Application URL: ${appUrl}`);
    logger.log(
      `Swagger documentation: ${appUrl}/${configService.get<string>("SWAGGER_PATH") || "api-docs"}`,
    );
    logger.log("TiffinMate Monolith Backend started successfully");
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
}

bootstrap();
