/**
 * Provides standardized SQL query fragments for common database operations
 */
export class SqlHelper {
  /**
   * Standard fields to select for a user object (excluding password)
   */
  public static readonly USER_SELECT_FIELDS = `
    id,
    email,
    name,
    first_name,
    last_name,
    phone,
    address,
    role,
    language_preference,
    created_at,
    updated_at,
    is_active
  `;

  /**
   * Get SQL query to select all user fields (except password)
   */
  public static getUserSelectQuery(): string {
    return `
      SELECT
        ${SqlHelper.USER_SELECT_FIELDS}
      FROM users
      WHERE deleted_at IS NULL
    `;
  }

  /**
   * Get SQL query to select user by ID
   * @param includePassword Whether to include password field in the query
   */
  public static getUserByIdQuery(includePassword = false): string {
    const fields = includePassword ? `${SqlHelper.USER_SELECT_FIELDS}, password` : SqlHelper.USER_SELECT_FIELDS;

    return `
      SELECT
        ${fields}
      FROM users
      WHERE id = $1 AND deleted_at IS NULL
    `;
  }

  /**
   * Get SQL query to select user by email
   * @param includePassword Whether to include password field in the query
   * @param activeOnly Whether to only select active users
   */
  public static getUserByEmailQuery(includePassword = false, activeOnly = true): string {
    const fields = includePassword ? `${SqlHelper.USER_SELECT_FIELDS}, password` : SqlHelper.USER_SELECT_FIELDS;

    const activeCondition = activeOnly ? 'AND is_active = true' : '';

    return `
      SELECT
        ${fields}
      FROM users
      WHERE email = $1 AND deleted_at IS NULL ${activeCondition}
      LIMIT 1
    `;
  }

  /**
   * Get SQL query for inserting a new user
   * @param returningPassword Whether to include password in the returning clause
   */
  public static getInsertUserQuery(returningPassword = false): string {
    const returningFields = returningPassword ? `${SqlHelper.USER_SELECT_FIELDS}, password` : SqlHelper.USER_SELECT_FIELDS;

    return `
      INSERT INTO users (
        email,
        password,
        name,
        first_name,
        last_name,
        phone,
        address,
        role,
        language_preference,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING ${returningFields}
    `;
  }

  /**
   * Get SQL query for updating a user
   */
  public static getUpdateUserQuery(): string {
    return `
      UPDATE users
      SET
        email = $2,
        name = $3,
        first_name = $4,
        last_name = $5,
        phone = $6,
        address = $7,
        role = $8,
        language_preference = $9,
        password = $10,
        is_active = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING ${SqlHelper.USER_SELECT_FIELDS}
    `;
  }

  /**
   * Get SQL query for setting a user's deleted_at timestamp (soft delete)
   */
  public static getSoftDeleteUserQuery(): string {
    return `
      UPDATE users
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING ${SqlHelper.USER_SELECT_FIELDS}
    `;
  }
}
