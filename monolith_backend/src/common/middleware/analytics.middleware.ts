import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { track } from "@vercel/analytics/server";

@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AnalyticsMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Only track in production
    if (process.env.NODE_ENV !== "production") {
      return next();
    }

    const startTime = Date.now();

    // Track API endpoint usage
    const originalSend = res.send;
    res.send = function (body) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Track API usage with Vercel Analytics
      try {
        track("api_request", {
          endpoint: req.path,
          method: req.method,
          status_code: statusCode,
          duration_ms: duration,
          user_agent: req.get("User-Agent") || "unknown",
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        // Silently fail - don't break the API
        console.warn("Analytics tracking failed:", error.message);
      }

      return originalSend.call(this, body);
    };

    next();
  }
}
