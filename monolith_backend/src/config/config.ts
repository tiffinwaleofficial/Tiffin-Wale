import { registerAs } from "@nestjs/config";

export const appConfig = registerAs("app", () => ({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || "api",
  appName: process.env.APP_NAME || "TiffinMate",
}));

export const databaseConfig = registerAs("database", () => ({
  uri: process.env.MONGODB_URI,
  user: process.env.MONGODB_USER,
  password: process.env.MONGODB_PASSWORD,
}));

export const jwtConfig = registerAs("jwt", () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRATION || "30d",
}));

export const swaggerConfig = registerAs("swagger", () => ({
  title: process.env.SWAGGER_TITLE || "TiffinMate API",
  description: process.env.SWAGGER_DESCRIPTION || "API Documentation",
  version: process.env.SWAGGER_VERSION || "1.0",
  path: process.env.SWAGGER_PATH || "api-docs",
}));

export const logConfig = registerAs("log", () => ({
  level: process.env.LOG_LEVEL || "info",
  dir: process.env.LOG_DIR || "./logs",
}));
