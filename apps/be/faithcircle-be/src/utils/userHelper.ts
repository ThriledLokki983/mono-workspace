import { UserResponseDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';

/**
 * Utility functions for user object operations
 */
export class UserHelper {
  /**
   * Removes password from a user object
   * @param user User object that may contain a password
   * @returns User object with password removed
   */
  public static formatUserResponse<T extends Partial<User>>(user: T): Omit<T, 'password'> {
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Removes passwords from an array of user objects
   * @param users Array of user objects that may contain passwords
   * @returns Array of user objects with passwords removed
   */
  public static formatUserArrayResponse<T extends Partial<User>>(users: T[]): Omit<T, 'password'>[] {
    if (!users || !Array.isArray(users)) return [];

    return users.map(user => UserHelper.formatUserResponse(user));
  }

  /**
   * Maps a database user record to a UserResponseDto
   * @param user User object from database query
   * @returns UserResponseDto with standardized fields
   */
  public static mapToUserResponseDto(user: Partial<User>): UserResponseDto {
    if (!user) return null;

    const responseDto = new UserResponseDto();
    responseDto.id = user.id;
    responseDto.email = user.email;
    responseDto.name = user.name;
    responseDto.first_name = user.first_name;
    responseDto.last_name = user.last_name;
    responseDto.phone = user.phone;
    responseDto.address = user.address;
    responseDto.role = user.role;
    responseDto.language_preference = user.language_preference;
    responseDto.created_at = user.created_at;
    responseDto.updated_at = user.updated_at;
    responseDto.is_active = user.is_active;

    return responseDto;
  }

  /**
   * Maps an array of database user records to an array of UserResponseDto objects
   * @param users Array of User objects from database query
   * @returns Array of UserResponseDto objects
   */
  public static mapToUserResponseDtoArray(users: Partial<User>[]): UserResponseDto[] {
    if (!users || !Array.isArray(users)) return [];

    return users.map(user => UserHelper.mapToUserResponseDto(user));
  }
}
