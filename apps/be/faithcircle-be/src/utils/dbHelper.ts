import { PoolClient } from 'pg';
import { pool } from '@database';
import { logger } from './logger';

/**
 * Database helper utility to manage transactions and provide safe query execution
 */
export class DbHelper {
  /**
   * Execute database operations within a transaction
   * @param callback Function containing database operations to execute within transaction
   * @returns Result of the callback function
   */
  public static async withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await callback(client);

      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Transaction failed: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Execute a parameterized SQL query safely
   * @param text SQL query text with parameterized placeholders
   * @param params Array of parameter values
   * @param client Optional database client (for use within transactions)
   * @returns Query result
   */
  public static async query(text: string, params: any[] = [], client?: PoolClient) {
    const queryExecutor = client || pool;

    try {
      return await queryExecutor.query(text, params);
    } catch (error) {
      logger.error(`Query failed: ${error.message}`);
      logger.error(`Query text: ${text}`);
      logger.error(`Query params: ${JSON.stringify(params)}`);
      throw error;
    }
  }
}
