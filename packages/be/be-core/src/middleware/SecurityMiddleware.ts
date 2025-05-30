import { Request, Response, NextFunction, RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import { RateLimitConfig, CorsConfig, HelmetConfig } from "@mono/be-types";

export class SecurityMiddleware {
  /**
   * Create rate limiting middleware
   */
  static rateLimit(config: RateLimitConfig): RequestHandler {
    return rateLimit({
      windowMs: config.windowMs || 15 * 60 * 1000, // 15 minutes
      max: config.max || 100, // limit each IP to 100 requests per windowMs
      message: config.message || "Too many requests from this IP",
      standardHeaders: true,
      legacyHeaders: false,
      ...config,
    });
  }

  /**
   * Create helmet security middleware
   */
  static helmet(config?: HelmetConfig): RequestHandler {
    return helmet(config);
  }

  /**
   * Create CORS middleware
   */
  static cors(config: CorsConfig): RequestHandler {
    return cors(config);
  }

  /**
   * Create request ID middleware for correlation tracking
   */
  static requestId(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const requestId =
        (req.headers["x-request-id"] as string) || this.generateId();

      // Add to request for access in handlers
      (req as any).requestId = requestId;

      // Add to response headers
      res.setHeader("X-Request-ID", requestId);

      next();
    };
  }

  /**
   * Create request timeout middleware
   */
  static timeout(ms: number = 30000): RequestHandler {
    return (_req: Request, res: Response, next: NextFunction) => {
      const timeout = setTimeout(() => {
        if (!res.headersSent) {
          res.status(408).json({
            success: false,
            message: "Request timeout",
            statusCode: 408,
          });
        }
      }, ms);

      res.on("finish", () => clearTimeout(timeout));
      res.on("close", () => clearTimeout(timeout));

      next();
    };
  }

  private static generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
