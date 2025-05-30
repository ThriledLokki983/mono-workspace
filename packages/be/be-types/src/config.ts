import { CorsOptions } from "cors";

// Environment types
export type Environment = "development" | "production" | "test";

// Base application configuration
export interface AppConfig {
  name: string;
  port: number;
  environment: Environment;
  cors?: CorsOptions;
  rateLimit?: RateLimitConfig;
  logging?: LoggingConfig;
  security?: SecurityConfig;
}

// Rate limiting configuration
export interface RateLimitConfig {
  windowMs?: number;
  max?: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
}

// CORS configuration (re-export from cors package)
export interface CorsConfig extends CorsOptions {}

// Helmet configuration
export interface HelmetConfig {
  contentSecurityPolicy?: any;
  crossOriginEmbedderPolicy?: any;
  crossOriginOpenerPolicy?: any;
  crossOriginResourcePolicy?: any;
  dnsPrefetchControl?: any;
  frameguard?: any;
  hidePoweredBy?: any;
  hsts?: any;
  ieNoOpen?: any;
  noSniff?: any;
  originAgentCluster?: any;
  permittedCrossDomainPolicies?: any;
  referrerPolicy?: any;
  xssFilter?: any;
}

// Logging configuration
export interface LoggingConfig {
  level?: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
  dir?: string;
  format?: "json" | "simple";
  httpLogging?: boolean;
  maxFiles?: number;
  correlationId?: boolean;
}

// Security configuration
export interface SecurityConfig {
  jwt?: JWTConfig;
  bcrypt?: BcryptConfig;
  session?: SessionConfig;
}

// JWT configuration
export interface JWTConfig {
  secret: string;
  expiresIn?: string | number;
  refreshSecret?: string;
  refreshExpiresIn?: string | number;
  issuer?: string;
  audience?: string;
}

// Bcrypt configuration
export interface BcryptConfig {
  rounds?: number;
}

// Session configuration
export interface SessionConfig {
  secret: string;
  name?: string;
  resave?: boolean;
  saveUninitialized?: boolean;
  cookie?: {
    secure?: boolean;
    httpOnly?: boolean;
    maxAge?: number;
    sameSite?: "strict" | "lax" | "none";
  };
}
