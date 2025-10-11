import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { VercelRequest, VercelResponse } from '@vercel/node';

let app: NestExpressApplication;

async function createNestServer(): Promise<NestExpressApplication> {
  if (app) {
    return app;
  }

  const logger = new Logger('Vercel-Bootstrap');
  logger.log('Creating NestJS application for Vercel...');

  app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Add a root route for health checks - BEFORE setting global prefix
  app.getHttpAdapter().get('/', (req, res: any) => {
    res.json({ 
      status: 'ok', 
      message: 'TiffinWale API is running on Vercel!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    });
  });

  // Set global prefix
  const apiPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(apiPrefix, {
    exclude: ['/'], // Exclude root path from global prefix
  });

  // Enable CORS with more permissive settings for production
  app.enableCors({
    origin: [
      'https://tiffin-wale.com',
      'https://www.tiffin-wale.com',
      'https://m.tiffin-wale.com',
      'https://partner.tiffin-wale.com',
      'https://admin.tiffin-wale.com',
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*\.netlify\.app$/,
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
      process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '',
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
    ],
  });
  logger.log('CORS configured for production domains');

  // Serve static files (adjusted for Vercel)
  try {
    app.useStaticAssets(join(process.cwd(), 'public'));
    logger.log('Static file serving configured');
  } catch (error) {
    logger.warn('Static file serving configuration failed, continuing without it');
  }

  // Register global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  logger.log('Global exception filter configured');

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
          if (constraints.minLength && error.property === 'password') {
            messages.push(
              `Password must be at least ${error.constraints.minLength.split('must be longer than ')[1]}`,
            );
          }
          if (constraints.maxLength && error.property === 'password') {
            messages.push(
              `Password cannot be longer than ${error.constraints.maxLength.split('must be shorter than ')[1]}`,
            );
          }

          return {
            field: error.property,
            errors: messages,
          };
        });

        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );

  logger.log('Global validation pipe configured');

  // Set up Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'TiffinWale API')
    .setDescription(
      process.env.SWAGGER_DESCRIPTION || 'API Documentation for TiffinWale Platform',
    )
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .addBearerAuth()
    .addServer('https://backend-tiffin-wale-r2no8xm8z-tiffin-wale.vercel.app', 'Production')
    .addServer('http://localhost:3001', 'Development')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    process.env.SWAGGER_PATH || 'api-docs',
    app,
    document,
    {
      customSiteTitle: 'TiffinWale API Documentation',
      customfavIcon: '/favicon.ico',
      customCss: '.swagger-ui .topbar { display: none }',
    }
  );

  logger.log('Swagger documentation configured');

  // Initialize the app
  await app.init();
  logger.log('NestJS application initialized for Vercel');

  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const server = await createNestServer();
    const httpAdapter = server.getHttpAdapter();
    
    // Handle the request
    return httpAdapter.getInstance()(req, res);
  } catch (error) {
    console.error('Vercel handler error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
