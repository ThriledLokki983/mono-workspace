import { Request, Response, NextFunction } from "express";
import { Logger } from "../logging/Logger";

export interface HttpException extends Error {
  status?: number;
  statusCode?: number;
}

export class ErrorMiddleware {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Global error handler middleware
   */
  handle() {
    return (
      error: HttpException,
      req: Request,
      res: Response,
      _next: NextFunction
    ) => {
      try {
        const status: number = error.status || error.statusCode || 500;
        const message: string = error.message || "Something went wrong";
        const requestId = (req as any).requestId;

        // Log the error with request context
        this.logger.error(error, {
          method: req.method,
          url: req.url,
          requestId,
          userAgent: req.get("User-Agent"),
          ip: req.ip,
        });

        // Don't expose internal errors in production
        const responseMessage =
          status === 500 && process.env.NODE_ENV === "production"
            ? "Internal server error"
            : message;

        const errorResponse = {
          success: false,
          message: responseMessage,
          statusCode: status,
          ...(requestId && { requestId }),
          ...(process.env.NODE_ENV === "development" &&
            error.stack && { stack: error.stack }),
        };

        res.status(status).json(errorResponse);
      } catch (err) {
        // Fallback error handling
        this.logger.error(err as Error, { context: "ErrorMiddleware.handle" });
        res.status(500).json({
          success: false,
          message: "Internal server error",
          statusCode: 500,
        });
      }
    };
  }

  /**
   * 404 Not Found handler
   */
  notFound() {
    return (req: Request, res: Response) => {
      const requestId = (req as any).requestId;

      res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`,
        statusCode: 404,
        ...(requestId && { requestId }),
      });
    };
  }
}
