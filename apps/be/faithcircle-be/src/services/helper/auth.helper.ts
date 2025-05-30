import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { SECRET_KEY } from '@config';
import crypto from 'crypto';
import { randomBytes } from 'crypto';
import { redisClient } from '@database';
import { JwtBlacklist } from './jwtBlacklist';
import { logger, redactSensitiveData } from '@utils/logger';

// Use the centralized Redis client
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const jwtBlacklist = new JwtBlacklist(redisClient);

const createToken = (user: User): TokenData => {
  // Thorough validation of user object
  if (!user) {
    logger.error('Cannot create token: User object is null or undefined');
    throw new Error('Cannot create token: Invalid user object');
  }

  if (!user.id) {
    // Use the redaction utility instead of manual redaction
    logger.error(`Cannot create token: User ID missing. User data: ${JSON.stringify(redactSensitiveData(user))}`);
    throw new Error('Cannot create token: User ID is required');
  }

  // Get current timestamp for JWT claims
  const now = Math.floor(Date.now() / 1000);
  const expiresIn: number = 60 * 60; // 1 hour

  // Explicitly create payload with proper user ID and security claims
  const dataStoredInToken: DataStoredInToken & { [key: string]: any } = {
    id: user.id,
    iat: now, // Issued at - when the token was issued
    nbf: now, // Not before - token not valid before this time
    exp: now + expiresIn, // Expiration time
    iss: 'awesome-api', // Issuer - who issued this token
    aud: 'awesome-app', // Audience - who this token is intended for
    sub: user.id, // Subject - who this token represents (the user)
    role: user.role, // Include role for role-based access control
  };

  // Verify SECRET_KEY is available and adequate - only warn once during startup
  if (!SECRET_KEY) {
    logger.error('JWT SECRET_KEY is missing. This is a critical security risk.');
    throw new Error('Authentication configuration error: Missing secret key');
  } else if (SECRET_KEY.length < 32 && !process.env.SECRET_KEY_WARNING_SHOWN) {
    logger.warn('Warning: JWT SECRET_KEY is too short. This is a security risk.');
    process.env.SECRET_KEY_WARNING_SHOWN = 'true'; // Set flag to prevent repeated warnings
  }

  try {
    // Create token with enhanced security claims
    const token = sign(dataStoredInToken, SECRET_KEY);
    return { expiresIn, token };
  } catch (error) {
    logger.error(`Token creation failed: ${error.message}`);
    throw new Error(`Failed to create authentication token: ${error.message}`);
  }
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; SameSite=Strict; Path=/`;
};

const createPasswordResetToken = (_email: string): { token: string; expiresAt: Date } => {
  const resetToken = randomBytes(32).toString('hex');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Token expires in 10 minutes
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  return { token: resetToken, expiresAt };
};

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
};

const hashedToken = (token: string): string => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return hashedToken;
};

const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const isMatch = await compare(password, hashedPassword);
  return isMatch;
};

const comparePasswordWithHash = async (password: string, hashedPassword: string): Promise<boolean> => {
  const isMatch = await compare(password, hashedPassword);
  return isMatch;
};

export { createToken, createCookie, createPasswordResetToken, hashPassword, hashedToken, comparePassword, comparePasswordWithHash };
