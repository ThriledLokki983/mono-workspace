import { Redis } from 'ioredis';
import { logger } from '@utils/logger';
import { EventEmitter } from 'events';

export interface RedisMetrics {
  uptime: number; // Server uptime in seconds
  connectedClients: number; // Number of connected clients
  usedMemory: number; // Used memory in bytes
  usedMemoryPeak: number; // Peak memory usage in bytes
  totalCommands: number; // Total number of commands processed
  hitRate?: number; // Cache hit rate (percentage)
  missRate?: number; // Cache miss rate (percentage)
  keyspaceHits: number; // Number of successful lookups
  keyspaceMisses: number; // Number of failed lookups
  status: 'connected' | 'disconnected' | 'reconnecting' | 'error';
  lastError?: string;
  lastErrorTime?: Date;
  reconnectAttempts: number;
  latency?: number; // Response time in milliseconds
}

/**
 * Redis Monitor Service for collecting metrics and health data
 */
export class RedisMonitor extends EventEmitter {
  private redis: Redis;
  private metrics: RedisMetrics = {
    uptime: 0,
    connectedClients: 0,
    usedMemory: 0,
    usedMemoryPeak: 0,
    totalCommands: 0,
    keyspaceHits: 0,
    keyspaceMisses: 0,
    status: 'disconnected',
    reconnectAttempts: 0,
  };
  private monitorInterval: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;

  constructor(redisClient: Redis) {
    super();
    this.redis = redisClient;
    this.setupEventHandlers();
  }

  /**
   * Set up event handlers for Redis client
   */
  private setupEventHandlers(): void {
    this.redis.on('connect', () => {
      this.metrics.status = 'connected';
      this.metrics.reconnectAttempts = this.reconnectAttempts;
      this.emit('status', { status: 'connected' });
      logger.info('Redis monitor: connection established');
    });

    this.redis.on('ready', () => {
      this.metrics.status = 'connected';
      this.emit('status', { status: 'connected' });
      logger.info('Redis monitor: client ready');
    });

    this.redis.on('error', err => {
      this.metrics.status = 'error';
      this.metrics.lastError = err.message;
      this.metrics.lastErrorTime = new Date();
      this.emit('status', { status: 'error', error: err.message });
      logger.error(`Redis monitor error: ${err.message}`);
    });

    this.redis.on('reconnecting', () => {
      this.reconnectAttempts++;
      this.metrics.status = 'reconnecting';
      this.metrics.reconnectAttempts = this.reconnectAttempts;
      this.emit('status', { status: 'reconnecting', attempts: this.reconnectAttempts });
      logger.warn(`Redis monitor: reconnecting (attempt ${this.reconnectAttempts})`);
    });

    this.redis.on('end', () => {
      this.metrics.status = 'disconnected';
      this.emit('status', { status: 'disconnected' });
      logger.warn('Redis monitor: connection closed');
    });
  }

  /**
   * Start monitoring Redis metrics
   * @param interval Collection interval in milliseconds (default 60000 - 1 minute)
   */
  public startMonitoring(interval = 60000): void {
    // Clear any existing intervals
    this.stopMonitoring();

    // Start periodic collection
    this.monitorInterval = setInterval(() => {
      this.collectMetrics();
    }, interval);

    // Also start ping interval (more frequent)
    this.pingInterval = setInterval(() => {
      this.measureLatency();
    }, Math.min(interval / 4, 15000)); // At least every 15 seconds

    // Collect initial metrics
    this.collectMetrics();

    logger.info(`Redis monitoring started with ${interval}ms interval`);
  }

  /**
   * Stop monitoring Redis metrics
   */
  public stopMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    logger.info('Redis monitoring stopped');
  }

  /**
   * Measure Redis response latency
   */
  private async measureLatency(): Promise<void> {
    if (this.metrics.status !== 'connected') {
      return;
    }

    try {
      const start = Date.now();
      await this.redis.ping();
      const end = Date.now();
      this.metrics.latency = end - start;

      // Emit event if latency is too high (> 100ms)
      if (this.metrics.latency > 100) {
        this.emit('high-latency', { latency: this.metrics.latency });
        logger.warn(`Redis high latency: ${this.metrics.latency}ms`);
      }
    } catch (error) {
      logger.error(`Redis latency check failed: ${error.message}`);
    }
  }

  /**
   * Collect Redis metrics using INFO command
   */
  private async collectMetrics(): Promise<void> {
    if (this.metrics.status !== 'connected') {
      return;
    }

    try {
      // Get Redis statistics
      const info = await this.redis.info();
      const sections = this.parseRedisInfo(info);

      // Update metrics from Redis INFO
      if (sections.server) {
        this.metrics.uptime = parseInt(sections.server['uptime_in_seconds'] || '0', 10);
      }

      if (sections.clients) {
        this.metrics.connectedClients = parseInt(sections.clients['connected_clients'] || '0', 10);
      }

      if (sections.memory) {
        this.metrics.usedMemory = parseInt(sections.memory['used_memory'] || '0', 10);
        this.metrics.usedMemoryPeak = parseInt(sections.memory['used_memory_peak'] || '0', 10);
      }

      if (sections.stats) {
        this.metrics.totalCommands = parseInt(sections.stats['total_commands_processed'] || '0', 10);
        this.metrics.keyspaceHits = parseInt(sections.stats['keyspace_hits'] || '0', 10);
        this.metrics.keyspaceMisses = parseInt(sections.stats['keyspace_misses'] || '0', 10);

        // Calculate hit/miss rates
        const total = this.metrics.keyspaceHits + this.metrics.keyspaceMisses;
        if (total > 0) {
          this.metrics.hitRate = (this.metrics.keyspaceHits / total) * 100;
          this.metrics.missRate = (this.metrics.keyspaceMisses / total) * 100;
        }
      }

      // Emit metrics event
      this.emit('metrics', this.metrics);

      // Log important metrics changes only if they changed significantly
      logger.debug(`Redis metrics collected: ${this.metrics.connectedClients} clients, ${(this.metrics.usedMemory / 1024 / 1024).toFixed(2)}MB used`);
    } catch (error) {
      logger.error(`Redis metrics collection failed: ${error.message}`);
    }
  }

  /**
   * Parse Redis INFO command output
   */
  private parseRedisInfo(info: string): Record<string, Record<string, string>> {
    const sections: Record<string, Record<string, string>> = {};
    let currentSection = '';

    const lines = info.split('\n');
    for (const line of lines) {
      // Skip empty lines and comments
      if (!line || line.startsWith('#')) continue;

      // New section
      if (line.startsWith('# ')) {
        currentSection = line.substring(2).trim().toLowerCase();
        sections[currentSection] = {};
        continue;
      }

      // Key-value pair
      const parts = line.split(':');
      if (parts.length >= 2 && currentSection) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        if (sections[currentSection]) {
          sections[currentSection][key] = value;
        }
      }
    }

    return sections;
  }

  /**
   * Get the current metrics snapshot
   */
  public getMetrics(): RedisMetrics {
    return { ...this.metrics };
  }

  /**
   * Check if Redis is healthy based on current metrics
   */
  public isHealthy(): boolean {
    return this.metrics.status === 'connected' && (this.metrics.latency === undefined || this.metrics.latency < 500);
  }

  /**
   * Get a detailed health report for Redis
   */
  public getHealthReport(): {
    healthy: boolean;
    status: string;
    latency?: number;
    uptime: number;
    memoryUsage: number;
    memoryPeakUsage: number;
    cacheHitRatio?: number;
    lastError?: string;
    lastErrorTime?: Date;
  } {
    const healthy = this.isHealthy();

    return {
      healthy,
      status: this.metrics.status,
      latency: this.metrics.latency,
      uptime: this.metrics.uptime,
      memoryUsage: this.metrics.usedMemory,
      memoryPeakUsage: this.metrics.usedMemoryPeak,
      cacheHitRatio: this.metrics.hitRate,
      lastError: this.metrics.lastError,
      lastErrorTime: this.metrics.lastErrorTime,
    };
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.stopMonitoring();
    this.removeAllListeners();
  }
}
