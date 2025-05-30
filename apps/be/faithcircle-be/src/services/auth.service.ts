import { Service } from 'typedi';
import { redisClient } from '@database';
import { HttpException } from '@exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { JwtBlacklist } from './helper/jwtBlacklist';
import { LoginDto, RequestPasswordResetDto, ResetPasswordDto } from '@dtos/auth.dto';
import { createToken, createCookie, hashPassword, comparePasswordWithHash, createPasswordResetToken, hashedToken } from './helper/auth.helper';
import { logger, redactSensitiveData } from '@utils/logger';
import { DbHelper } from '@utils/dbHelper';
import { PoolClient } from 'pg';
import { SqlHelper } from '@utils/sqlHelper';
import { UserHelper } from '@utils/userHelper';
import { HttpStatusCodes } from '@/utils/httpStatusCodes';

// Use the centralized Redis client
const jwtBlacklist = new JwtBlacklist(redisClient);

@Service()
export class AuthService {
  public async signup(userData: User): Promise<Omit<User, 'password'>> {
    const { email, password, name, first_name, last_name, phone, address } = userData;

    // Using transaction to ensure atomicity of the signup process
    return await DbHelper.withTransaction(async (client: PoolClient) => {
      // Check if the email already exists
      const { rowCount } = await DbHelper.query(`SELECT 1 FROM users WHERE email = $1 LIMIT 1`, [email], client);
      if (rowCount > 0) {
        throw new HttpException(HttpStatusCodes.CONFLICT, `This email ${email} already exists`);
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Insert the new user into the database
      const {
        rows: [newUser],
      } = await DbHelper.query(
        `INSERT INTO users (email, password, name, first_name, last_name, phone, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING ${SqlHelper.USER_SELECT_FIELDS}`,
        [email, hashedPassword, name, first_name, last_name, phone || null, address || null],
        client,
      );

      return newUser;
    });
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; findUser: Omit<User, 'password'>; token?: string }> {
    const { email, password } = userData;

    try {
      // Get the full user object with ALL fields including ID
      const { rows } = await DbHelper.query(SqlHelper.getUserByEmailQuery(true, true), [email]);

      const user = rows[0];

      if (!user) {
        // Changed status code to 404 as this is a not found scenario
        throw new HttpException(HttpStatusCodes.NOT_FOUND, `User with email ${email} not found or is inactive`);
      }

      // Check if the password is correct
      const isPasswordMatching: boolean = await comparePasswordWithHash(password, user.password);
      if (!isPasswordMatching) {
        // Incorrect credentials should be 401 Unauthorized
        throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Invalid credentials');
      }

      // Use debug level for development logs and redact any sensitive data
      logger.debug(`Creating token for user: ${JSON.stringify(redactSensitiveData({ id: user.id, email: user.email }))}`);

      // Create a token and cookie
      const tokenData = createToken(user);

      // For debugging - safely log token payload (only in development)
      if (process.env.NODE_ENV === 'development') {
        try {
          const decoded = require('jsonwebtoken').decode(tokenData.token);
          // Redact any sensitive data from the decoded token
          logger.debug(`Token payload: ${JSON.stringify(redactSensitiveData(decoded))}`);
        } catch (err) {
          logger.error(`Error decoding token: ${err.message}`);
        }
      }

      const cookie = createCookie(tokenData);

      // Format the user response using our helper
      const userWithoutPassword = UserHelper.formatUserResponse(user);

      return {
        cookie,
        findUser: userWithoutPassword,
        token: tokenData.token,
      };
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  public async logout(userData: User, token: string): Promise<Omit<User, 'password'>> {
    const { email } = userData;

    // Check if the user exists
    const { rows } = await DbHelper.query(SqlHelper.getUserByEmailQuery(true, false), [email]);
    const user = rows[0];

    if (!user) {
      // Changed to NOT_FOUND status code
      throw new HttpException(HttpStatusCodes.NOT_FOUND, `User with email ${email} not found`);
    }

    // Blacklist the token
    await jwtBlacklist.blacklistToken(token);

    // Format the user response using our helper
    return UserHelper.formatUserResponse(user);
  }

  public async requestPasswordReset(passwordResetData: RequestPasswordResetDto): Promise<{ message: string }> {
    const { email } = passwordResetData;

    // Using transaction to ensure atomicity of the password reset request
    return await DbHelper.withTransaction(async (client: PoolClient) => {
      // 1. Find user by email
      const {
        rows: [user],
      } = await DbHelper.query(`SELECT id, email FROM users WHERE email = $1 LIMIT 1`, [email], client);

      if (!user) {
        // Changed to NOT_FOUND status code
        throw new HttpException(HttpStatusCodes.NOT_FOUND, `User with email ${email} not found`);
      }

      // 2. Generate reset token & hash
      const { token, expiresAt } = createPasswordResetToken(email);
      const generatedHashedToken = hashedToken(token);

      // 3. Remove any existing reset tokens for the user
      await DbHelper.query(`DELETE FROM password_reset_tokens WHERE user_id = $1`, [user.id], client);

      // 4. Store new hashed reset token
      await DbHelper.query(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, generatedHashedToken, expiresAt],
        client,
      );

      // 5. Simulated email message (replace with email logic in production)
      return {
        message: `Password reset link has been sent to ${email}. In production, the link would contain: ${token}`,
      };
    });
  }

  public async resetPassword(resetData: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = resetData;

    // Using transaction to ensure atomicity of the password reset process
    return await DbHelper.withTransaction(async (client: PoolClient) => {
      // 1. Hash the provided token
      const generatedHashedToken = hashedToken(token);

      // 2. Look up the valid token record
      const {
        rows: [resetToken],
      } = await DbHelper.query(
        `SELECT user_id, expires_at
         FROM password_reset_tokens
         WHERE token = $1 AND expires_at > NOW()
         LIMIT 1`,
        [generatedHashedToken],
        client,
      );

      if (!resetToken) {
        // Changed to BAD_REQUEST as it's an invalid token
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Invalid or expired password reset token');
      }

      const userId = resetToken.user_id;

      // 3. Confirm user exists
      const {
        rows: [user],
      } = await DbHelper.query(`SELECT id FROM users WHERE id = $1 LIMIT 1`, [userId], client);

      if (!user) {
        // Changed to NOT_FOUND status code
        throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
      }

      // 4. Hash the new password
      const hashedPassword = await hashPassword(password);

      // 5. Update user's password
      await DbHelper.query(`UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`, [hashedPassword, userId], client);

      // 6. Remove used token
      await DbHelper.query(`DELETE FROM password_reset_tokens WHERE user_id = $1`, [userId], client);

      return { message: 'Password has been reset successfully' };
    });
  }

  // Development-only method to retrieve a fresh password reset token
  public async getResetTokenForDev(email: string): Promise<string | null> {
    try {
      return await DbHelper.withTransaction(async (client: PoolClient) => {
        // 1. Lookup user by email
        const {
          rows: [user],
        } = await DbHelper.query(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [email], client);

        if (!user) return null;

        const userId = user.id;

        // 2. Generate a new reset token
        const { token, expiresAt } = createPasswordResetToken(email);
        const generatedHashedToken = hashedToken(token);

        // 3. Update or insert reset token record
        const { rowCount: tokenExists } = await DbHelper.query(`SELECT 1 FROM password_reset_tokens WHERE user_id = $1 LIMIT 1`, [userId], client);

        if (tokenExists) {
          // Update existing token
          await DbHelper.query(
            `UPDATE password_reset_tokens SET token = $1, expires_at = $2 WHERE user_id = $3`,
            [generatedHashedToken, expiresAt, userId],
            client,
          );
        } else {
          // Insert new token
          await DbHelper.query(
            `INSERT INTO password_reset_tokens (user_id, token, expires_at)
             VALUES ($1, $2, $3)`,
            [userId, generatedHashedToken, expiresAt],
            client,
          );
        }

        // 4. Return the unhashed token (for dev use only!)
        return token;
      });
    } catch (error) {
      // Only log the error message, not the full error object which might contain sensitive data
      logger.error(`Dev reset token error: ${error.message}`);
      return null;
    }
  }
}
