import { NextFunction, Request, Response } from 'express';
import { redisClient } from '@database';
import { RedisMonitor } from '@services/helper/redisMonitor';
import { apiResponse } from '@utils/responseFormatter';
import { HttpStatusCodes } from '@utils/httpStatusCodes';
import os from 'os';

export class HealthController {
  private redisMonitor: RedisMonitor;

  constructor() {
    // Initialize Redis monitor
    this.redisMonitor = new RedisMonitor(redisClient);

    // Start monitoring with 1-minute interval
    this.redisMonitor.startMonitoring(60000);
  }

  /**
   * Get basic health status
   */
  public getHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Basic system info
      const systemInfo = {
        uptime: process.uptime(),
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        platform: process.platform,
        arch: process.arch,
        hostname: os.hostname(),
        loadAverage: os.loadavg(),
        cpus: os.cpus().length,
      };

      // Redis health check
      const redisHealthy = this.redisMonitor.isHealthy();

      // Overall health status
      const healthy = redisHealthy;

      const healthData = {
        status: healthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        redis: {
          status: redisHealthy ? 'healthy' : 'unhealthy',
        },
        system: systemInfo,
      };

      const statusCode = healthy ? HttpStatusCodes.OK : HttpStatusCodes.SERVICE_UNAVAILABLE;

      apiResponse.success(res, `Health check ${healthy ? 'successful' : 'failed'}`, healthData, { statusCode });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get detailed Redis metrics
   */
  public getRedisMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metrics = this.redisMonitor.getMetrics();
      apiResponse.success(res, 'Redis metrics retrieved successfully', metrics);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get detailed Redis health report
   */
  public getRedisHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = this.redisMonitor.getHealthReport();
      const statusCode = report.healthy ? HttpStatusCodes.OK : HttpStatusCodes.SERVICE_UNAVAILABLE;

      apiResponse.success(res, `Redis health check ${report.healthy ? 'successful' : 'failed'}`, report, { statusCode });
    } catch (error) {
      next(error);
    }
  };
}
