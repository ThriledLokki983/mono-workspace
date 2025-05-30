import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { UserService } from '@services/users.service';
import { HttpException } from '@exceptions/httpException';
import { apiResponse } from '@utils/responseFormatter';
import { HttpStatusCodes } from '@utils/httpStatusCodes';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: Omit<User, 'password'>[] = await this.user.findAllUsers();

      apiResponse.success(res, 'Users retrieved successfully', findAllUsersData, { count: findAllUsersData.length });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const findOneUserData: Omit<User, 'password'> = await this.user.findUserById(userId);

      apiResponse.success(res, 'User retrieved successfully', findOneUserData);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: Omit<User, 'password'> = await this.user.createUser(userData);

      apiResponse.created(res, 'User created successfully', createUserData);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const userData: UpdateUserDto = req.body;
      const updateUserData: Omit<User, 'password'> = await this.user.updateUser(userId, userData);

      apiResponse.success(res, 'User updated successfully', updateUserData);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const deleteUserData: Omit<User, 'password'> = await this.user.deleteUser(userId);

      apiResponse.success(res, 'User deleted successfully', deleteUserData);
    } catch (error) {
      next(error);
    }
  };

  public getCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      const userId = req.user.id;
      const findUserData: Omit<User, 'password'> = await this.user.findUserById(userId);

      apiResponse.success(res, 'Current user retrieved', findUserData);
    } catch (error) {
      next(error);
    }
  };
}
