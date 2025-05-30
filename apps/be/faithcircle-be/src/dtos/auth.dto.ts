import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestPasswordResetDto:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address to send reset link
 */
export class RequestPasswordResetDto {
  @IsEmail()
  public email: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ResetPasswordDto:
 *       type: object
 *       required:
 *         - token
 *         - password
 *       properties:
 *         token:
 *           type: string
 *           description: Password reset token received by email
 *         password:
 *           type: string
 *           format: password
 *           minLength: 9
 *           maxLength: 32
 *           description: New password (min 9 chars, max 32 chars)
 */
export class ResetPasswordDto {
  @IsString()
  public token: string;

  @IsString()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}
