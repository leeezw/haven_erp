import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'

export async function GET(request: Request) {
  let connection;
  try {
    connection = await pool.getConnection()
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM ranks ORDER BY level')
    
    // 确保返回数组
    if (!Array.isArray(rows)) {
      throw new Error('Invalid data format from database')
    }

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching ranks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ranks', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
} 