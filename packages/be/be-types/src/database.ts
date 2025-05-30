// Database connection configuration
export interface DatabaseConfig {
  connections: Record<string, DatabaseConnectionConfig>;
  default?: string;
  migrations?: MigrationConfig;
}

// Individual database connection configuration
export interface DatabaseConnectionConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean | any;
  pool?: {
    min?: number;
    max?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
  };
}

// Migration configuration
export interface MigrationConfig {
  tableName?: string;
  directory?: string;
  schemaTable?: string;
}

// Query result interface
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  command: string;
}

// Transaction callback
export type TransactionCallback<T> = (client: any) => Promise<T>;

// Cache configuration
export interface CacheConfig {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  ttl?: number;
  maxRetries?: number;
  retryDelay?: number;
}

// Cache operations
export interface CacheOperations {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  keys(pattern: string): Promise<string[]>;
  flushAll(): Promise<void>;
}
