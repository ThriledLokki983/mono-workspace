import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { LoginDto, RequestPasswordResetDto, ResetPasswordDto } from '@dtos/auth.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { NODE_ENV } from '@config';

export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /auth/signup:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Register a new user
     *     description: Create a new user account with email and password
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateUserDto'
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 email:
     *                   type: string
     *       400:
     *         description: Bad request - validation error
     *       409:
     *         description: Email already exists
     */
    this.router.post(`${this.path}/signup`, ValidationMiddleware(CreateUserDto, 'body'), this.auth.signUp);

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Login to the application
     *     description: Authenticate user with email and password
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginDto'
     *     responses:
     *       200:
     *         description: Login successful
     *         headers:
     *           Set-Cookie:
     *             description: Authentication cookie containing JWT
     *             schema:
     *               type: string
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 email:
     *                   type: string
     *       400:
     *         description: Bad request - validation error
     *       409:
     *         description: Wrong credentials
     */
    this.router.post(`${this.path}/login`, ValidationMiddleware(LoginDto, 'body'), this.auth.logIn);

    /**
     * @swagger
     * /auth/logout:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Logout from the application
     *     description: Invalidate the authentication token
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Logout successful
     *         headers:
     *           Set-Cookie:
     *             description: Clear authentication cookie
     *             schema:
     *               type: string
     *       401:
     *         description: Unauthorized - Invalid authentication token
     *       404:
     *         description: Authentication token missing
     */
    this.router.post(`${this.path}/logout`, AuthMiddleware, this.auth.logOut);

    /**
     * @swagger
     * /auth/request-password-reset:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Request password reset
     *     description: Request a password reset link to be sent to the user's email
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RequestPasswordResetDto'
     *     responses:
     *       200:
     *         description: Password reset link sent
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       400:
     *         description: Bad request - validation error
     *       409:
     *         description: User not found
     */
    this.router.post(`${this.path}/request-password-reset`, ValidationMiddleware(RequestPasswordResetDto, 'body'), this.auth.requestPasswordReset);

    /**
     * @swagger
     * /auth/reset-password:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Reset password
     *     description: Reset user's password using a valid reset token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ResetPasswordDto'
     *     responses:
     *       200:
     *         description: Password reset successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       400:
     *         description: Bad request - validation error
     *       409:
     *         description: Invalid or expired token
     */
    this.router.post(`${this.path}/reset-password`, ValidationMiddleware(ResetPasswordDto, 'body'), this.auth.resetPassword);

    // DEV-ONLY: Add development endpoint to retrieve tokens for testing
    if (NODE_ENV === 'development') {
      /**
       * @swagger
       * /auth/dev/get-reset-token:
       *   get:
       *     tags:
       *       - Development
       *     summary: Get reset token for a user (DEV ONLY)
       *     description: Development endpoint to retrieve a password reset token for testing
       *     parameters:
       *       - in: query
       *         name: email
       *         schema:
       *           type: string
       *         required: true
       *         description: The email address of the user
       *     responses:
       *       200:
       *         description: Retrieved token
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 email:
       *                   type: string
       *                 token:
       *                   type: string
       *       404:
       *         description: No token found for email
       */
      this.router.get(`${this.path}/dev/get-reset-token`, this.auth.getResetTokenForDev);
    }
  }
}
