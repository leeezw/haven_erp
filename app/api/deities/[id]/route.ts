import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import crypto from 'crypto'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    const deity = await request.json()
    connection = await pool.getConnection()

    await connection.beginTransaction()

    // 构建更新对象，只包含非空字段
    const updateFields = {
      updated_at: new Date()
    };

    if (deity.name) updateFields.name = deity.name;
    if (deity.title) updateFields.title = deity.title;
    if (deity.department_id) updateFields.department_id = deity.department_id;
    if (deity.rank_id) updateFields.rank_id = deity.rank_id;
    if (deity.status) updateFields.status = deity.status;

    // 执行更新
    await connection.query(
      'UPDATE deities SET ? WHERE id = ?',
      [updateFields, params.id]
    );

    // 更新神仙职责：先删除旧的，再插入新的
    await connection.query('DELETE FROM deity_responsibilities WHERE deity_id = ?', [params.id])
    if (deity.responsibilities && deity.responsibilities.length > 0) {
      const responsibilities = deity.responsibilities.map(responsibility => [
        crypto.randomUUID(),  // 为每个职责生成新的 ID
        params.id,
        responsibility,
        new Date()
      ])
      await connection.query(
        'INSERT INTO deity_responsibilities (id, deity_id, responsibility, created_at) VALUES ?',
        [responsibilities]
      )
    }

    await connection.commit()

    // 返回更新后的神仙信息
    const [updatedDeity] = await connection.query<RowDataPacket[]>(`
      SELECT 
        d.*,
        GROUP_CONCAT(dr.responsibility) as responsibilities,
        dp.name as department_name,
        r.name as rank_name,
        r.code as rank_code
      FROM deities d 
      LEFT JOIN deity_responsibilities dr ON d.id = dr.deity_id
      LEFT JOIN departments dp ON d.department_id = dp.id
      LEFT JOIN ranks r ON d.rank_id = r.id
      WHERE d.id = ?
      GROUP BY d.id
    `, [params.id])

    const formattedDeity = {
      id: updatedDeity[0].id,
      name: updatedDeity[0].name,
      title: updatedDeity[0].title,
      departmentId: updatedDeity[0].department_id,
      departmentName: updatedDeity[0].department_name,
      rankId: updatedDeity[0].rank_id,
      rankName: `${updatedDeity[0].rank_name} (${updatedDeity[0].rank_code}级)`,
      status: updatedDeity[0].status,
      responsibilities: updatedDeity[0].responsibilities ? updatedDeity[0].responsibilities.split(',') : [],
      joinDate: updatedDeity[0].join_date,
      lastPromotionDate: updatedDeity[0].last_promotion_date
    }

    return NextResponse.json(formattedDeity)
  } catch (error) {
    if (connection) {
      await connection.rollback()
    }
    console.error('Error updating deity:', error)
    return NextResponse.json(
      { error: 'Failed to update deity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

// 获取单个神仙信息
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    connection = await pool.getConnection()
    
    const [deity] = await connection.query<RowDataPacket[]>(`
      SELECT 
        d.*,
        GROUP_CONCAT(dr.responsibility) as responsibilities,
        dp.name as department_name,
        r.name as rank_name,
        r.code as rank_code
      FROM deities d 
      LEFT JOIN deity_responsibilities dr ON d.id = dr.deity_id
      LEFT JOIN departments dp ON d.department_id = dp.id
      LEFT JOIN ranks r ON d.rank_id = r.id
      WHERE d.id = ?
      GROUP BY d.id
    `, [params.id])

    if (!deity[0]) {
      return NextResponse.json(
        { error: 'Deity not found' },
        { status: 404 }
      )
    }

    const formattedDeity = {
      id: deity[0].id,
      name: deity[0].name,
      title: deity[0].title,
      departmentId: deity[0].department_id,
      departmentName: deity[0].department_name,
      rankId: deity[0].rank_id,
      rankName: `${deity[0].rank_name} (${deity[0].rank_code}级)`,
      status: deity[0].status,
      responsibilities: deity[0].responsibilities ? deity[0].responsibilities.split(',') : [],
      joinDate: deity[0].join_date,
      lastPromotionDate: deity[0].last_promotion_date
    }

    return NextResponse.json(formattedDeity)
  } catch (error) {
    console.error('Error fetching deity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

// 删除神仙
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    connection = await pool.getConnection()

    await connection.beginTransaction()

    // 先删除神仙的职责
    await connection.query('DELETE FROM deity_responsibilities WHERE deity_id = ?', [params.id])
    
    // 再删除神仙本身
    await connection.query('DELETE FROM deities WHERE id = ?', [params.id])

    await connection.commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    if (connection) {
      await connection.rollback()
    }
    console.error('Error deleting deity:', error)
    return NextResponse.json(
      { error: 'Failed to delete deity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
} 