import { redisClient } from '@/database';
import { logger } from '@utils/logger';

/**
 * Cache options interface for configuring cache behavior
 */
interface CacheOptions {
  /** TTL (Time To Live) in seconds */
  ttl?: number;
  /** Whether to refresh the TTL on get operations */
  refreshOnAccess?: boolean;
  /** Whether to return stale data while refreshing in background */
  staleWhileRevalidate?: boolean;
}

/**
 * Default cache options
 */
const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  ttl: 3600, // 1 hour default TTL
  refreshOnAccess: true,
  staleWhileRevalidate: true,
};

/**
 * CacheHelper class for application-level caching
 * Implements various caching strategies using Redis
 */
export class CacheHelper {
  /**
   * Get data from cache or execute the fetcher function and cache the result
   *
   * @param key - Cache key
   * @param fetcher - Async function to get data if not in cache
   * @param options - Cache options
   * @returns The data from cache or fetcher
   */
  public static async getOrSet<T>(key: string, fetcher: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
    const opts = { ...DEFAULT_CACHE_OPTIONS, ...options };
    const cacheKey = this.formatKey(key);

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);

      // If we have cached data
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as T;

        // Refresh TTL if configured
        if (opts.refreshOnAccess && opts.ttl) {
          await redisClient.expire(cacheKey, opts.ttl);
        }

        // If staleWhileRevalidate is enabled, refresh cache in background after returning data
        if (opts.staleWhileRevalidate) {
          // Get cache metadata to check age
          const ttlRemaining = await redisClient.ttl(cacheKey);
          const isStale = opts.ttl && ttlRemaining < opts.ttl / 2;

          if (isStale) {
            // Background refresh without awaiting
            this.refreshCache(cacheKey, fetcher, opts.ttl).catch(err => {
              logger.error(`Background cache refresh failed for key ${cacheKey}: ${err.message}`);
            });
          }
        }

        return parsedData;
      }

      // Cache miss, get fresh data
      return this.refreshCache(cacheKey, fetcher, opts.ttl);
    } catch (error) {
      // If anything goes wrong with Redis, fallback to fetcher
      logger.warn(
        `Cache operation failed for key ${cacheKey}: ${error instanceof Error ? error.message : String(error)}. Falling back to direct data fetch.`,
      );
      return fetcher();
    }
  }

  /**
   * Store data in the cache
   *
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - TTL in seconds
   * @returns Promise resolving to true if successful
   */
  public static async set<T>(key: string, data: T, ttl = DEFAULT_CACHE_OPTIONS.ttl): Promise<boolean> {
    const cacheKey = this.formatKey(key);
    try {
      const serialized = JSON.stringify(data);
      if (ttl) {
        await redisClient.setex(cacheKey, ttl, serialized);
      } else {
        await redisClient.set(cacheKey, serialized);
      }
      return true;
    } catch (error) {
      logger.error(`Failed to set cache for key ${cacheKey}: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Get data from the cache
   *
   * @param key - Cache key
   * @returns The cached data or null if not found
   */
  public static async get<T>(key: string): Promise<T | null> {
    const cacheKey = this.formatKey(key);
    try {
      const data = await redisClient.get(cacheKey);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      logger.error(`Failed to get cache for key ${cacheKey}: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /**
   * Invalidate a cache entry
   *
   * @param key - Cache key
   * @returns Promise resolving to true if successful
   */
  public static async invalidate(key: string): Promise<boolean> {
    const cacheKey = this.formatKey(key);
    try {
      await redisClient.del(cacheKey);
      return true;
    } catch (error) {
      logger.error(`Failed to invalidate cache for key ${cacheKey}: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Invalidate multiple cache entries by pattern
   *
   * @param pattern - Cache key pattern (e.g. "users:*")
   * @returns Number of keys removed
   */
  public static async invalidatePattern(pattern: string): Promise<number> {
    const cachePattern = this.formatKey(pattern);
    try {
      // Find all keys matching pattern
      const keys = await redisClient.keys(cachePattern);

      if (keys.length === 0) {
        return 0;
      }

      // Delete all matching keys
      await redisClient.del(...keys);
      logger.debug(`Invalidated ${keys.length} cache entries matching pattern ${cachePattern}`);
      return keys.length;
    } catch (error) {
      logger.error(`Failed to invalidate cache pattern ${cachePattern}: ${error instanceof Error ? error.message : String(error)}`);
      return 0;
    }
  }

  /**
   * Helper method to refresh cache
   */
  private static async refreshCache<T>(key: string, fetcher: () => Promise<T>, ttl = DEFAULT_CACHE_OPTIONS.ttl): Promise<T> {
    const freshData = await fetcher();
    await this.set(key, freshData, ttl);
    return freshData;
  }

  /**
   * Helper method to format cache keys consistently
   */
  private static formatKey(key: string): string {
    return key.startsWith('huishelder:') ? key : `huishelder:${key}`;
  }
}
