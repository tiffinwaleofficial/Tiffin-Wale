import {
  Injectable,
  NestMiddleware,
  Logger,
  ConflictException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { IdempotencyService } from "./idempotency.service";

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(IdempotencyMiddleware.name);

  // Read-only methods that don't need idempotency
  private readonly READ_ONLY_METHODS = ["GET", "HEAD", "OPTIONS"];

  constructor(private readonly idempotencyService: IdempotencyService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const method = req.method.toUpperCase();
    const idempotencyKey = req.headers["idempotency-key"] as string;

    // Skip idempotency for read-only methods
    if (this.READ_ONLY_METHODS.includes(method) || !idempotencyKey) {
      return next();
    }

    try {
      // Generate request hash
      const requestHash = this.idempotencyService.generateRequestHash(
        method,
        req.path,
        req.body,
      );

      // Extract user info from request (if authenticated)
      const user = (req as any).user;
      const userId = user?.sub || user?._id || user?.id;
      const userRole = user?.role;

      // Check if key exists
      const cached = await this.idempotencyService.checkKey(
        idempotencyKey,
        requestHash,
      );

      if (cached.exists) {
        // Return cached response
        this.logger.debug(
          `Returning cached response for idempotency key: ${idempotencyKey}`,
        );

        // Set response headers
        res.setHeader("X-Idempotency-Key", idempotencyKey);
        res.setHeader("X-Idempotency-Replayed", "true");

        // Return cached response
        return res.status(cached.statusCode || 200).json(cached.response);
      }

      // Key doesn't exist, create pending entry for concurrent request handling
      const pendingCreated = await this.idempotencyService.createPendingKey(
        idempotencyKey,
        {
          userId,
          userRole,
          method,
          path: req.path,
          requestHash,
          metadata: {
            ipAddress: req.ip || req.socket.remoteAddress,
            userAgent: req.headers["user-agent"],
          },
        },
      );

      if (!pendingCreated) {
        // Another request is processing or key was just created
        // Wait a bit and check again
        await new Promise((resolve) => setTimeout(resolve, 100));

        const retryCheck = await this.idempotencyService.checkKey(
          idempotencyKey,
          requestHash,
        );

        if (retryCheck.exists) {
          res.setHeader("X-Idempotency-Key", idempotencyKey);
          res.setHeader("X-Idempotency-Replayed", "true");
          return res
            .status(retryCheck.statusCode || 200)
            .json(retryCheck.response);
        }

        // Still not found, proceed with request
        this.logger.warn(
          `Concurrent request detected for key ${idempotencyKey}, proceeding...`,
        );
      }

      // Store original send function
      const originalSend = res.send.bind(res);
      const originalJson = res.json.bind(res);

      // Override response methods to capture response
      let responseBody: any;
      let statusCode: number = res.statusCode || 200;

      res.status = function (code: number) {
        statusCode = code;
        return res;
      };

      res.json = function (body: any) {
        responseBody = body;
        return originalJson(body);
      };

      res.send = function (body: any) {
        responseBody = body;
        return originalSend(body);
      };

      // Capture response after it's sent
      res.on("finish", async () => {
        try {
          if (statusCode >= 200 && statusCode < 300) {
            // Success - store response
            await this.idempotencyService.updatePendingKey(
              idempotencyKey,
              responseBody,
              statusCode,
            );
          } else if (statusCode >= 400) {
            // Error - mark as failed
            await this.idempotencyService.markKeyAsFailed(idempotencyKey, {
              statusCode,
              message: responseBody?.message || "Request failed",
            });
          }
        } catch (error) {
          this.logger.error(
            `Error storing idempotency response for key ${idempotencyKey}:`,
            error,
          );
        }
      });

      // Continue with request
      next();
    } catch (error) {
      if (error instanceof ConflictException) {
        // Request hash mismatch
        this.logger.warn(
          `Idempotency key ${idempotencyKey} used with different payload`,
        );
        return res.status(409).json({
          error: "Idempotency key already used with different request payload",
          message: error.message,
        });
      }

      // Log error but don't block request (fail open)
      this.logger.error(
        `Error in idempotency middleware for key ${idempotencyKey}:`,
        error,
      );
      next();
    }
  }
}
