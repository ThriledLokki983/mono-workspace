import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { HealthController } from '@controllers/health.controller';
import { AuthMiddleware } from '@middlewares/auth.middleware';

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: System health monitoring endpoints
 */
export class HealthRoute implements Routes {
  public path = '/health';
  public router = Router();
  public health = new HealthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /health:
     *   get:
     *     tags:
     *       - Health
     *     summary: Get system health status
     *     description: Returns basic health information about the system
     *     responses:
     *       200:
     *         description: System is healthy
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *                   properties:
     *                     status:
     *                       type: string
     *                       enum: [healthy, unhealthy]
     *                     timestamp:
     *                       type: string
     *                       format: date-time
     *                     redis:
     *                       type: object
     *                     system:
     *                       type: object
     *       503:
     *         description: System is unhealthy
     */
    this.router.get(`${this.path}`, this.health.getHealth);

    /**
     * @swagger
     * /health/redis:
     *   get:
     *     tags:
     *       - Health
     *     summary: Get Redis health status
     *     description: Returns detailed health information about Redis
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Redis is healthy
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *                   properties:
     *                     healthy:
     *                       type: boolean
     *                     status:
     *                       type: string
     *                     latency:
     *                       type: number
     *                       description: Response time in milliseconds
     *                     uptime:
     *                       type: number
     *                       description: Redis server uptime in seconds
     *       401:
     *         description: Unauthorized
     *       503:
     *         description: Redis is unhealthy
     */
    this.router.get(`${this.path}/redis`, AuthMiddleware, this.health.getRedisHealth);

    /**
     * @swagger
     * /health/redis/metrics:
     *   get:
     *     tags:
     *       - Health
     *     summary: Get Redis metrics
     *     description: Returns detailed metrics about Redis usage and performance
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Redis metrics retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *                   properties:
     *                     uptime:
     *                       type: number
     *                       description: Redis server uptime in seconds
     *                     connectedClients:
     *                       type: number
     *                     usedMemory:
     *                       type: number
     *                       description: Used memory in bytes
     *                     hitRate:
     *                       type: number
     *                       description: Cache hit rate percentage
     *       401:
     *         description: Unauthorized
     */
    this.router.get(`${this.path}/redis/metrics`, AuthMiddleware, this.health.getRedisMetrics);
  }
}
