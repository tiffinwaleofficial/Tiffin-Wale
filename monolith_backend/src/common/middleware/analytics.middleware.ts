import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AnalyticsMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Disable Vercel Analytics in serverless - causes ESM import issues
    // Just log the request for now
    const startTime = Date.now();

    // Track API endpoint usage
    const originalSend = res.send;
    res.send = function (body) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Log API metrics (can be ingested by Vercel automatically)
      if (process.env.NODE_ENV === "production") {
        console.log(JSON.stringify({
          type: 'api_request',
          endpoint: req.path,
          method: req.method,
          status_code: statusCode,
          duration_ms: duration,
          timestamp: new Date().toISOString(),
        }));
      }

      return originalSend.call(this, body);
    };

    next();
  }
}
