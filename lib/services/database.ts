import { Pool, PoolConnection } from 'mysql2/promise'
import pool from '@/lib/db'

export class DatabaseService {
  private static instance: DatabaseService
  private pool: Pool

  private constructor() {
    this.pool = pool
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  async getConnection(): Promise<PoolConnection> {
    return await this.pool.getConnection()
  }

  async transaction<T>(
    callback: (connection: PoolConnection) => Promise<T>
  ): Promise<T> {
    const connection = await this.getConnection()
    try {
      await connection.beginTransaction()
      const result = await callback(connection)
      await connection.commit()
      return result
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }
}

export const db = DatabaseService.getInstance() 