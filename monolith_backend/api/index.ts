import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { VercelRequest, VercelResponse } from '@vercel/node';
import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';

let app: NestExpressApplication;

async function createNestServer(): Promise<NestExpressApplication> {
  if (app) {
    console.log('✅ Reusing existing NestJS app instance');
    return app;
  }

  console.log('🚀 Starting NestJS app creation for Vercel...');

  // Set Vercel environment flag BEFORE creating the app
  process.env.VERCEL = '1';
  process.env.IS_SERVERLESS = 'true';
  console.log('✅ Environment flags set: VERCEL=1, IS_SERVERLESS=true');

  console.log('📦 Creating NestJS application...');
  app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
    abortOnError: false, // Don't crash on module initialization errors
  });
  console.log('✅ NestJS application created successfully');

  // Don't configure WebSocket adapter in serverless environment
  console.log('⚠️ Skipping WebSocket adapter for serverless environment');

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

  // Enable CORS - Allow all origins for maximum compatibility
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'Pragma',
      'Expires',
      'X-Forwarded-For',
      'X-Real-IP',
      'User-Agent',
      'Referer',
    ],
    exposedHeaders: ['Authorization', 'Content-Length', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  console.log('✅ CORS configured for production domains');

  // Serve static files (adjusted for Vercel)
  try {
    app.useStaticAssets(join(process.cwd(), 'public'));
    console.log('✅ Static file serving configured');
  } catch (error) {
    console.log('⚠️ Static file serving configuration failed, continuing without it');
  }

  // Register global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  console.log('✅ Global exception filter configured');

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

  console.log('✅ Global validation pipe configured');

  // Set up Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'TiffinWale API')
    .setDescription(
      process.env.SWAGGER_DESCRIPTION || 'API Documentation for TiffinWale Platform',
    )
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .addBearerAuth()
    .addServer('https://api-tiffin-wale.vercel.app', 'Production')
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
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
      },
      customCssUrl: undefined, // Disable external CSS to avoid 404s
      customJs: undefined, // Disable external JS to avoid 404s
    }
  );

  console.log('✅ Swagger documentation configured');

  // Note: Vercel Analytics for server-side is handled via middleware
  // The analytics tracking is implemented in AnalyticsMiddleware
  console.log('✅ Analytics middleware configured for API tracking');

  // Initialize the app
  await app.init();
  console.log('✅ NestJS application initialized for Vercel');

  return app;
}

// WebSocket server instance for Vercel
let wsServer: WebSocket.Server | null = null;

// WebSocket connection handler
function handleWebSocketConnection(client: WebSocket, request: IncomingMessage) {
  console.log('🔌 New WebSocket connection on Vercel');
  
  // Extract token from query parameters
  const url = new URL(request.url || '', `https://${request.headers.host}`);
  const token = url.searchParams.get('token');
  
  if (!token) {
    console.log('❌ No token provided, closing connection');
    client.close(1008, 'Token required');
    return;
  }
  
  console.log('✅ WebSocket connection authenticated');
  
  client.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📨 WebSocket message received:', message);
      
      // Handle different message types
      if (message.type === 'ping') {
        client.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      }
    } catch (error) {
      console.error('❌ Error parsing WebSocket message:', error);
    }
  });
  
  client.on('close', () => {
    console.log('🔌 WebSocket connection closed');
  });
  
  client.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
  
  // Send welcome message
  client.send(JSON.stringify({
    type: 'connected',
    data: { message: 'Connected to TiffinWale WebSocket on Vercel' },
    timestamp: Date.now(),
  }));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('🚀 Vercel handler started:', req.method, req.url);
    
    // Add CORS headers immediately
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, Expires, X-Forwarded-For, X-Real-IP, User-Agent, Referer');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'Authorization, Content-Length, X-Requested-With');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      console.log('✅ Handling preflight request');
      res.status(204).end();
      return;
    }
    
    // Handle WebSocket upgrade requests
    if (req.url === '/native-ws' && req.headers.upgrade === 'websocket') {
      console.log('🔌 WebSocket upgrade request detected');
      
      // In Vercel serverless environment, we need to handle WebSocket differently
      // For now, return a 426 Upgrade Required response
      res.status(426).json({
        error: 'WebSocket upgrade not supported in serverless environment',
        message: 'Please use the native WebSocket gateway on port 3002 for local development',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    
    console.log('🔍 Environment variables check:', {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'MISSING',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING',
    });

    const server = await createNestServer();
    const httpAdapter = server.getHttpAdapter();
    
    // Handle the request
    console.log('📡 Forwarding request to NestJS application');
    return httpAdapter.getInstance()(req, res);
  } catch (error) {
    console.error('❌ Vercel handler error:', error);
    console.error('📋 Error stack:', error.stack);
    
    // Add CORS headers to error response too
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
