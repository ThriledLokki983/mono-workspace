import { Pool } from 'pg';
import Redis from 'ioredis';
import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, REDIS_HOST, REDIS_PORT } from '@config';
import { logger } from '@utils/logger';
import migrate from 'node-pg-migrate';

// PostgreSQL pool setup with optimized connection parameters
export const pool = new Pool({
  connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
  // Explicit connection limits
  max: 20, // Maximum number of clients in the pool
  // min: 4, // Minimum number of idle clients maintained in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection cannot be established
  // Connection health check
  allowExitOnIdle: false, // Don't allow the Node process to exit while there are still clients in the pool
});

// Connection pool event listeners for monitoring and logging
pool.on('connect', () => {
  logger.debug('New connection established to the database pool');
});

pool.on('error', (err: Error) => {
  logger.error(`Unexpected error on idle client: ${err.message}`);
});

// Expose a query function for simpler usage
export const query = (text: string, params?: any[], client?: any) => {
  return client ? client.query(text, params) : pool.query(text, params);
};

// For backward compatibility
export const client = pool;

// Initialize Redis client with enhanced configuration options
export const redisClient = new Redis({
  host: REDIS_HOST || 'localhost',
  port: parseInt(REDIS_PORT || '6379'),
  // Enable offline queue for better recovery when Redis becomes available again
  enableOfflineQueue: true,
  // Increase maximum retries
  maxRetriesPerRequest: 5,
  // Add connection timeout
  connectTimeout: 10000, // 10 seconds
  // Improved retry strategy with exponential backoff
  retryStrategy(times) {
    const maxDelay = 30000; // 30 seconds maximum delay
    const delay = Math.min(times * 500, maxDelay); // Exponential backoff starting at 500ms
    logger.info(`Redis retrying connection in ${delay}ms (attempt ${times})`);
    return delay;
  },
  // Add reconnect strategy
  reconnectOnError(err) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      // Only reconnect when specific error occurs
      return 1; // Reconnect with the same options
    }
    return false;
  },
});

// Handle Redis client events
redisClient.on('error', (err: Error) => {
  logger.error(`Redis client error: ${err.message}`);
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis client reconnecting');
});

redisClient.on('end', () => {
  logger.warn('Redis client connection closed');
});

/**
 * Connect to the database
 */
export const connectToDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.connect();
    connection.release(); // Release the client back to the pool
    logger.info('✅ Database connection pool established successfully');
  } catch (error) {
    logger.error(`❌ Failed to connect to database pool: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Connect to Redis
 */
export const connectRedis = async (): Promise<void> => {
  try {
    // Test connection by pinging Redis
    await redisClient.ping();
    logger.info('✅ Redis client connected successfully');
  } catch (error) {
    logger.error(`❌ Failed to connect to Redis: ${error instanceof Error ? error.message : String(error)}`);
    // Don't throw the error here, as the application should be able to start without Redis
    // The JwtBlacklist class will handle Redis unavailability
    logger.warn('Application will continue without Redis service. Token blacklisting may be unavailable.');
  }
};

/**
 * Apply database migrations using node-pg-migrate
 */
export const applyMigrations = async (): Promise<void> => {
  try {
    logger.info('Running database migrations...');

    // Run migrations using node-pg-migrate
    const result = await migrate({
      dir: 'migrations',
      migrationsTable: 'pgmigrations',
      direction: 'up',
      count: Infinity,
      databaseUrl: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
      ignorePattern: '.*\\.(map|md)', // Ignore sourcemap files and markdown files
      singleTransaction: true,
      dryRun: false,
    });

    if (result.length === 0) {
      logger.info('No new migrations to apply');
    } else {
      logger.info(`✅ Applied ${result.length} migrations successfully`);
      result.forEach(migration => {
        logger.info(`- ${migration.name}`);
      });
    }
  } catch (error) {
    logger.error(`❌ Failed to apply migrations: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * Initialize the database connection and apply migrations
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    await connectToDatabase();

    try {
      await applyMigrations();
    } catch (error) {
      // Check if the error is about relations already existing
      if (error instanceof Error && error.message && error.message.includes('already exists')) {
        logger.warn(`Migration warning: ${error.message}`);
        logger.info('Continuing application startup despite migration issues');
      } else {
        // Rethrow if it's a different error
        throw error;
      }
    }

    await connectRedis();
  } catch (error) {
    logger.error('Failed to initialize database');
    throw error;
  }
};

// Export both the query function and pool for flexibility
export default { query, pool, redisClient };
