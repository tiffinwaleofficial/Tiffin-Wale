import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { MongoError } from "mongodb";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let errors = [];

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === "object") {
        const errorObj = errorResponse as any;
        message = errorObj.message || message;
        errors = errorObj.errors || [];
      } else {
        message = errorResponse as string;
      }
    } else if (exception instanceof MongoError) {
      // Handle MongoDB specific errors
      if (exception.code === 11000) {
        status = HttpStatus.CONFLICT;
        message = "Duplicate key error";

        // Format the error message for better readability
        const keyPattern = (exception as any).keyPattern;
        if (keyPattern) {
          const fieldNames = Object.keys(keyPattern).join(", ");
          message = `A record with the same ${fieldNames} already exists`;
        }
      }
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}`,
    );
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }

    // Return consistent error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      errors,
    });
  }
}
