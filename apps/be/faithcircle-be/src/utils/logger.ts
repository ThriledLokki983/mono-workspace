import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { LOG_DIR } from '@config';

// logs dir
const logDir: string = join(__dirname, LOG_DIR);

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // debug log setting - only log debug messages in development mode
    new winstonDaily({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/debug', // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error', // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

// Only add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
    }),
  );
}

/**
 * Safely redacts sensitive fields from objects for logging purposes
 * @param data The object that may contain sensitive information
 * @param sensitiveFields Array of sensitive field names to redact
 * @returns A copy of the object with sensitive fields redacted
 */
export const redactSensitiveData = (data: any, sensitiveFields: string[] = ['password', 'token', 'secret', 'credit_card', 'ssn']): any => {
  if (!data) return data;

  // Handle primitive values
  if (typeof data !== 'object') return data;

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => redactSensitiveData(item, sensitiveFields));
  }

  // Handle objects
  const redactedData = { ...data };

  for (const key in redactedData) {
    if (Object.prototype.hasOwnProperty.call(redactedData, key)) {
      // Check if this key should be redacted
      if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        redactedData[key] = '[REDACTED]';
      } else if (typeof redactedData[key] === 'object' && redactedData[key] !== null) {
        // Recursively redact nested objects
        redactedData[key] = redactSensitiveData(redactedData[key], sensitiveFields);
      }
    }
  }

  return redactedData;
};

/**
 * Safely logs information about a user, redacting sensitive data
 * @param level The log level to use
 * @param message The message to log
 * @param userData User data to be logged (will be redacted)
 */
export const logUserData = (level: 'debug' | 'info' | 'warn' | 'error', message: string, userData: any): void => {
  const redactedData = redactSensitiveData(userData);
  logger[level](`${message}: ${JSON.stringify(redactedData)}`);
};

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream };
