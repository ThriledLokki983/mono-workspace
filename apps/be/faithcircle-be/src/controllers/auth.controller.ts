import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { AuthService } from '@services/auth.service';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { LoginDto, RequestPasswordResetDto, ResetPasswordDto } from '@dtos/auth.dto';
import { NODE_ENV } from '@config';
import { apiResponse } from '@utils/responseFormatter';

export class AuthController {
  private readonly authService = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const newUser = await this.authService.signup(userData);
      apiResponse.created(res, 'User successfully registered', newUser);
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginDto = req.body;
      const { cookie, findUser, token } = await this.authService.login(loginData);
      res.setHeader('Set-Cookie', [cookie]);

      const responseData = {
        ...findUser,
        ...(NODE_ENV === 'development' ? { debug: { token } } : {}),
      };

      apiResponse.success(res, 'Login successful', responseData);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const logOutUser = await this.authService.logout(req.user, req.token);
      res.setHeader('Set-Cookie', ['Authorization=; Max-Age=0']);
      apiResponse.success(res, 'Logout successful', logOutUser);
    } catch (error) {
      next(error);
    }
  };

  public requestPasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: RequestPasswordResetDto = req.body;
      const result = await this.authService.requestPasswordReset(dto);
      apiResponse.success(res, result.message);
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: ResetPasswordDto = req.body;
      const result = await this.authService.resetPassword(dto);
      apiResponse.success(res, result.message);
    } catch (error) {
      next(error);
    }
  };

  public getResetTokenForDev = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (NODE_ENV !== 'development') {
        apiResponse.notFound(res, 'Endpoint not available in this environment');
        return;
      }

      const email = req.query.email;
      if (typeof email !== 'string') {
        apiResponse.badRequest(res, 'A valid email is required');
        return;
      }

      const token = await this.authService.getResetTokenForDev(email);

      if (!token) {
        apiResponse.notFound(res, 'No active reset token found for this email');
        return;
      }

      apiResponse.success(res, 'Reset token retrieved successfully', { email, token });
    } catch (error) {
      next(error);
    }
  };
}
