// jwtBlacklist.ts
import { Redis } from 'ioredis';
import jwt from 'jsonwebtoken';
import { logger } from '@utils/logger';

/**
 * Class to handle JWT token blacklisting using Redis
 */
export class JwtBlacklist {
  private redis: Redis;
  private readonly keyPrefix = 'blacklist:';
  private redisAvailable = true;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(redisClient: Redis) {
    this.redis = redisClient;
    this.setupHealthCheck();

    // Monitor Redis connection events
    this.redis.on('error', err => {
      logger.error(`Redis Error: ${err.message}`);
      this.redisAvailable = false;
    });

    this.redis.on('ready', () => {
      logger.info('Redis connection established');
      this.redisAvailable = true;
    });

    this.redis.on('reconnecting', () => {
      logger.info('Redis client reconnecting');
    });

    this.redis.on('end', () => {
      logger.warn('Redis connection closed');
      this.redisAvailable = false;
    });
  }

  /**
   * Setup a health check interval to periodically verify Redis connectivity
   */
  private setupHealthCheck() {
    // Clear any existing interval
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Check every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.redis.ping();
        if (!this.redisAvailable) {
          logger.info('Redis connection restored');
          this.redisAvailable = true;
        }
      } catch (err) {
        if (this.redisAvailable) {
          logger.error(`Redis health check failed: ${err.message}`);
          this.redisAvailable = false;
        }
      }
    }, 30000); // 30 seconds
  }

  /**
   * Check if Redis is available
   */
  public isRedisAvailable(): boolean {
    return this.redisAvailable;
  }

  /**
   * Adds a token to the blacklist until it expires.
   * @param token JWT string
   * @returns Promise resolving to true if blacklisting was successful
   */
  async blacklistToken(token: string): Promise<boolean> {
    try {
      if (!this.redisAvailable) {
        logger.warn('Redis unavailable, token blacklisting skipped');
        return false;
      }

      const decoded: any = jwt.decode(token);
      if (!decoded || !decoded.exp) {
        logger.warn('Invalid token format: missing exp claim');
        throw new Error('Invalid token: missing exp claim');
      }

      const ttl = decoded.exp - Math.floor(Date.now() / 1000); // seconds
      if (ttl <= 0) {
        logger.info('Token already expired, no need to blacklist');
        return true; // Already expired, no need to blacklist
      }

      // Add to blacklist with expiry
      await this.redis.set(`${this.keyPrefix}${token}`, '1', 'EX', ttl);
      logger.debug(`Token blacklisted for ${ttl} seconds`);
      return true;
    } catch (err) {
      logger.error(`Failed to blacklist token: ${err.message}`);
      // Don't throw the error, but return false to indicate failure
      return false;
    }
  }

  /**
   * Checks if a token is blacklisted.
   * @param token JWT string
   * @returns true if blacklisted, false otherwise
   */
  async isBlacklisted(token: string): Promise<boolean> {
    try {
      if (!this.redisAvailable) {
        logger.warn('Redis unavailable during blacklist check, proceeding with caution');
        // Configure behavior based on security needs:
        // 1. Fail closed: return true (assuming token is blacklisted when Redis is down)
        // 2. Fail open: return false (assuming token is valid when Redis is down)
        // Default to fail open, but this is configurable based on security requirements
        return false;
      }

      const exists = await this.redis.exists(`${this.keyPrefix}${token}`);
      return exists === 1;
    } catch (err) {
      logger.error(`Error checking blacklisted token: ${err.message}`);
      // In case of Redis error, fail open (assume token is valid)
      return false;
    }
  }

  /**
   * Clears all blacklisted tokens (admin use only)
   * @returns number of tokens cleared
   */
  async clearAllBlacklisted(): Promise<number> {
    try {
      if (!this.redisAvailable) {
        logger.warn('Redis unavailable, cannot clear blacklist');
        return 0;
      }

      const keys = await this.redis.keys(`${this.keyPrefix}*`);
      if (keys.length > 0) {
        const deleted = await this.redis.del(...keys);
        logger.info(`Cleared ${deleted} blacklisted tokens`);
        return deleted;
      }
      return 0;
    } catch (err) {
      logger.error(`Error clearing blacklisted tokens: ${err.message}`);
      throw err;
    }
  }

  /**
   * Clean up resources when this class is no longer needed
   */
  public destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

export default JwtBlacklist;
