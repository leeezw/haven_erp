import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { RowDataPacket } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: Request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const keyword = searchParams.get('keyword') || ''
    const departmentId = searchParams.get('departmentId')
    const rankId = searchParams.get('rankId')
    const status = searchParams.get('status')
    const sortField = searchParams.get('sortField') || 'r.level' // 默认按品级排序
    const sortOrder = searchParams.get('sortOrder') || 'ASC'     // 默认升序

    connection = await pool.getConnection()
    
    // 构建查询条件
    const conditions = []
    const params = []
    
    if (keyword) {
      conditions.push('(d.name LIKE ? OR d.title LIKE ?)')
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    if (departmentId && departmentId !== 'all') {
      conditions.push('d.department_id = ?')
      params.push(departmentId)
    }
    if (rankId && rankId !== 'all') {
      conditions.push('d.rank_id = ?')
      params.push(rankId)
    }
    if (status && status !== 'all') {
      conditions.push('d.status = ?')
      params.push(status)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // 获取总记录数
    const [countResult] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM deities d ${whereClause}`,
      params
    )
    const total = countResult[0].total

    // 构建排序子句
    const orderClause = `ORDER BY ${sortField} ${sortOrder}, d.created_at DESC`

    // 获取分页数据
    const offset = (page - 1) * pageSize
    const [deities] = await connection.query<RowDataPacket[]>(
      `SELECT 
        d.*,
        GROUP_CONCAT(dr.responsibility) as responsibilities,
        dp.name as department_name,
        r.name as rank_name,
        r.code as rank_code,
        r.level as rank_level
      FROM deities d 
      LEFT JOIN deity_responsibilities dr ON d.id = dr.deity_id
      LEFT JOIN departments dp ON d.department_id = dp.id
      LEFT JOIN ranks r ON d.rank_id = r.id
      ${whereClause}
      GROUP BY d.id
      ${orderClause}
      LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    )

    // 处理职责数组和格式化数据
    const formattedDeities = deities.map(deity => ({
      id: deity.id,
      name: deity.name,
      title: deity.title,
      departmentId: deity.department_id,
      departmentName: deity.department_name,
      rankId: deity.rank_id,
      rankName: `${deity.rank_name} (${deity.rank_code}级)`,
      status: deity.status,
      responsibilities: deity.responsibilities ? deity.responsibilities.split(',') : [],
      joinDate: deity.join_date,
      lastPromotionDate: deity.last_promotion_date
    }))

    return NextResponse.json({
      data: formattedDeities,
      pagination: {
        current: page,
        pageSize,
        total
      }
    })
  } catch (error) {
    console.error('Error fetching deities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deities', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    const deity = await request.json()
    connection = await pool.getConnection()

    await connection.beginTransaction()

    // 生成唯一ID
    const newId = uuidv4()

    // 插入神仙基本信息
    await connection.query(
      'INSERT INTO deities SET ?',
      {
        id: newId,  // 使用生成的UUID
        name: deity.name,
        title: deity.title,
        department_id: deity.departmentId,
        rank_id: deity.rankId,
        status: 'active',  // 默认状态为在职
        join_date: new Date().toISOString().split('T')[0],  // 使用当前日期作为入职日期
        created_at: new Date(),
        updated_at: new Date()
      }
    )

    // 插入神仙职责
    if (deity.responsibilities && deity.responsibilities.length > 0) {
      const responsibilities = deity.responsibilities.map(responsibility => [
        uuidv4(),  // 为每个职责生成唯一ID
        newId,     // 神仙ID
        responsibility,
        new Date()
      ])
      await connection.query(
        'INSERT INTO deity_responsibilities (id, deity_id, responsibility, created_at) VALUES ?',
        [responsibilities]
      )
    }

    await connection.commit()
    
    // 返回完整的神仙信息
    const [newDeity] = await connection.query<RowDataPacket[]>(`
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
    `, [newId])

    const formattedDeity = {
      id: newDeity[0].id,
      name: newDeity[0].name,
      title: newDeity[0].title,
      departmentId: newDeity[0].department_id,
      departmentName: newDeity[0].department_name,
      rankId: newDeity[0].rank_id,
      rankName: `${newDeity[0].rank_name} (${newDeity[0].rank_code}级)`,
      status: newDeity[0].status,
      responsibilities: newDeity[0].responsibilities ? newDeity[0].responsibilities.split(',') : [],
      joinDate: newDeity[0].join_date,
      lastPromotionDate: newDeity[0].last_promotion_date
    }

    return NextResponse.json(formattedDeity)
  } catch (error) {
    if (connection) {
      await connection.rollback()
    }
    console.error('Error creating deity:', error)
    return NextResponse.json(
      { error: 'Failed to create deity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

export async function PUT(request: Request) {
  let connection;
  try {
    const { id, ...deity } = await request.json()
    connection = await pool.getConnection()

    await connection.beginTransaction()

    // 更新神仙基本信息
    await connection.query(
      'UPDATE deities SET ? WHERE id = ?',
      [{
        name: deity.name,
        title: deity.title,
        department_id: deity.departmentId,
        rank_id: deity.rankId,
        status: deity.status
      }, id]
    )

    // 更新神仙职责
    await connection.query('DELETE FROM deity_responsibilities WHERE deity_id = ?', [id])
    if (deity.responsibilities && deity.responsibilities.length > 0) {
      const responsibilities = deity.responsibilities.map(responsibility => [
        id,
        responsibility
      ])
      await connection.query(
        'INSERT INTO deity_responsibilities (deity_id, responsibility) VALUES ?',
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
    `, [id])

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