import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { redisClient } from '@database';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { JwtBlacklist } from '@services/helper/jwtBlacklist';
import { logger } from '@/utils/logger';
import { DbHelper } from '@utils/dbHelper';
import { SqlHelper } from '@utils/sqlHelper';

// Use the centralized Redis client
const jwtBlacklist = new JwtBlacklist(redisClient);

// Utility: Get token from cookies or headers
const extractToken = (req: Request): string | null => {
  const fromCookie = req.cookies?.Authorization;
  if (fromCookie) return fromCookie;

  const fromHeader = req.header('Authorization');
  if (fromHeader?.startsWith('Bearer ')) return fromHeader.slice(7);

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      return next(new HttpException(401, 'Authentication token missing'));
    }

    // Check if token is blacklisted - handle Redis errors gracefully
    try {
      if (await jwtBlacklist.isBlacklisted(token)) {
        return next(new HttpException(401, 'Token has been invalidated'));
      }
    } catch (error) {
      logger.error(`Error checking blacklisted token: ${error.message}`);
      // Continue even if Redis is down - fail open in this case
    }

    // Check for secret key issues
    if (!SECRET_KEY) {
      logger.error('SECRET_KEY is missing or empty');
      return next(new HttpException(500, 'Server configuration error'));
    }

    // Verify the token
    let decoded: DataStoredInToken;
    try {
      // Verify with options to validate audience and issuer
      decoded = verify(token, SECRET_KEY, {
        audience: 'huishelder-app',
        issuer: 'huishelder-api',
        complete: false,
      }) as DataStoredInToken;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new HttpException(401, 'Authentication token has expired'));
      } else if (error.name === 'JsonWebTokenError') {
        return next(new HttpException(401, 'Invalid authentication token'));
      } else if (error.name === 'NotBeforeError') {
        return next(new HttpException(401, 'Token cannot be used yet'));
      }

      logger.error(`Token verification failed: ${error.message}`);
      return next(new HttpException(401, `Invalid or expired authentication token`));
    }

    // Validate token has required fields
    if (!decoded.id) {
      logger.error(`Token missing ID field: ${JSON.stringify(decoded)}`);
      return next(new HttpException(401, 'Invalid token: missing user ID'));
    }

    // Additional validation of claims
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < now) {
      return next(new HttpException(401, 'Token has expired'));
    }

    if (decoded.nbf && decoded.nbf > now) {
      return next(new HttpException(401, 'Token not yet valid'));
    }

    try {
      // Using our SQL helper for consistent user queries
      const { rows } = await DbHelper.query(SqlHelper.getUserByIdQuery(), [decoded.id]);
      const user = rows[0];

      if (!user) {
        logger.error(`User not found for ID: ${decoded.id}`);
        return next(new HttpException(401, 'User not found'));
      }

      // Validate user role matches the role in the token
      if (decoded.role && decoded.role !== user.role) {
        logger.warn(`Role mismatch for user ${user.id}: token has ${decoded.role}, DB has ${user.role}`);
        return next(new HttpException(401, 'Token contains invalid role'));
      }

      // User authenticated successfully
      req.user = user;
      req.token = token; // For logout use
      return next();
    } catch (dbError) {
      logger.error(`Database error in auth middleware: ${dbError.message}`);
      return next(new HttpException(500, 'Internal server error during authentication'));
    }
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return next(new HttpException(401, 'Authentication failed'));
  }
};
