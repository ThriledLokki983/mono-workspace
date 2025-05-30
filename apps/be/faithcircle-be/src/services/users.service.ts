import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@dtos/users.dto';
import { DbHelper } from '@utils/dbHelper';
import { PoolClient } from 'pg';
import { SqlHelper } from '@utils/sqlHelper';
import { HttpStatusCodes } from '@utils/httpStatusCodes';
import { CacheHelper } from '@utils/cacheHelper';

@Service()
export class UserService {
  // Cache key prefixes for better organization and pattern-based invalidation
  private readonly CACHE_PREFIX = 'users';
  private readonly CACHE_ALL_USERS = `${this.CACHE_PREFIX}:all`;
  private readonly CACHE_USER_BY_ID = `${this.CACHE_PREFIX}:id:`;

  // Cache TTLs (in seconds)
  private readonly CACHE_TTL = {
    USER_LIST: 5 * 60, // 5 minutes for user lists
    USER_DETAIL: 10 * 60, // 10 minutes for individual users
  };

  /**
   * Find all users with caching
   */
  public async findAllUsers(): Promise<UserResponseDto[]> {
    return CacheHelper.getOrSet<UserResponseDto[]>(
      this.CACHE_ALL_USERS,
      async () => {
        const { rows } = await DbHelper.query(SqlHelper.getUserSelectQuery());
        return rows;
      },
      { ttl: this.CACHE_TTL.USER_LIST },
    );
  }

  /**
   * Find user by ID with caching
   */
  public async findUserById(userId: string): Promise<UserResponseDto> {
    return CacheHelper.getOrSet<UserResponseDto>(
      `${this.CACHE_USER_BY_ID}${userId}`,
      async () => {
        const {
          rows: [user],
        } = await DbHelper.query(SqlHelper.getUserByIdQuery(), [userId]);

        if (!user) {
          throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
        }

        return user;
      },
      { ttl: this.CACHE_TTL.USER_DETAIL },
    );
  }

  /**
   * Create user and invalidate related caches
   */
  public async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, name, first_name, last_name, phone, address, role, language_preference, is_active } = userData;

    // Using transaction to ensure atomicity
    const newUser = await DbHelper.withTransaction(async (client: PoolClient) => {
      // Check if email already exists
      const {
        rows: [{ exists }],
      } = await DbHelper.query(`SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND deleted_at IS NULL)`, [email], client);

      if (exists) {
        throw new HttpException(HttpStatusCodes.CONFLICT, `This email ${email} already exists`);
      }

      // Hash password
      const hashedPassword = await hash(password, 10);

      // Insert user
      const {
        rows: [newUser],
      } = await DbHelper.query(
        SqlHelper.getInsertUserQuery(),
        [email, hashedPassword, name, first_name, last_name, phone, address, role, language_preference, is_active],
        client,
      );

      return newUser;
    });

    // Invalidate all users cache since we added a new user
    await this.invalidateUserCaches();

    return newUser;
  }

  /**
   * Update user and invalidate related caches
   */
  public async updateUser(userId: string, userData: UpdateUserDto): Promise<UserResponseDto> {
    // Using transaction to ensure atomicity of the update operation
    const updatedUser = await DbHelper.withTransaction(async (client: PoolClient) => {
      // Step 1: Fetch current user
      const {
        rows: [currentUser],
      } = await DbHelper.query(SqlHelper.getUserByIdQuery(true), [userId], client);

      if (!currentUser) {
        throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
      }

      // Step 2: Merge incoming data with existing data
      const {
        email = currentUser.email,
        name = currentUser.name,
        first_name = currentUser.first_name,
        last_name = currentUser.last_name,
        phone = currentUser.phone,
        address = currentUser.address,
        role = currentUser.role,
        language_preference = currentUser.language_preference,
        is_active = currentUser.is_active,
        password,
      } = userData;

      // If the email is being changed, check if the new email already exists
      if (email !== currentUser.email) {
        const {
          rows: [{ exists }],
        } = await DbHelper.query(`SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 AND id != $2 AND deleted_at IS NULL)`, [email, userId], client);

        if (exists) {
          throw new HttpException(HttpStatusCodes.CONFLICT, `This email ${email} already exists`);
        }
      }

      const hashedPassword = password ? await hash(password, 10) : currentUser.password;

      // Step 3: Update the user
      const {
        rows: [updatedUser],
      } = await DbHelper.query(
        SqlHelper.getUpdateUserQuery(),
        [userId, email, name, first_name, last_name, phone, address, role, language_preference, hashedPassword, is_active],
        client,
      );

      return updatedUser;
    });

    // Invalidate affected caches
    await Promise.all([CacheHelper.invalidate(`${this.CACHE_USER_BY_ID}${userId}`), CacheHelper.invalidate(this.CACHE_ALL_USERS)]);

    return updatedUser;
  }

  /**
   * Delete user and invalidate related caches
   */
  public async deleteUser(userId: string): Promise<UserResponseDto> {
    // Using transaction for consistency
    const deletedUser = await DbHelper.withTransaction(async (client: PoolClient) => {
      // Using soft delete by setting deleted_at timestamp
      const {
        rows: [deletedUser],
      } = await DbHelper.query(SqlHelper.getSoftDeleteUserQuery(), [userId], client);

      if (!deletedUser) {
        throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
      }

      return deletedUser;
    });

    // Invalidate affected caches
    await this.invalidateUserCaches(userId);

    return deletedUser;
  }

  /**
   * Helper method to invalidate user-related caches
   * @param userId Optional user ID to invalidate specific user cache
   */
  private async invalidateUserCaches(userId?: string): Promise<void> {
    const promises: Promise<boolean>[] = [CacheHelper.invalidate(this.CACHE_ALL_USERS)];

    if (userId) {
      promises.push(CacheHelper.invalidate(`${this.CACHE_USER_BY_ID}${userId}`));
    }

    await Promise.all(promises);
  }
}
