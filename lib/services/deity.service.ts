import { db } from './database'
import { Deity, DeityResponse, DeityStatus, QueryParams } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { RowDataPacket } from 'mysql2'

export class DeityService {
  static async findAll(params: QueryParams): Promise<{
    data: DeityResponse[]
    total: number
  }> {
    const connection = await db.getConnection()
    try {
      const { page = 1, pageSize = 10, keyword, departmentId, rankId, status } = params
      
      // 构建查询条件
      const conditions = []
      const queryParams = []
      
      if (keyword) {
        conditions.push('(d.name LIKE ? OR d.title LIKE ?)')
        queryParams.push(`%${keyword}%`, `%${keyword}%`)
      }
      // ... 其他条件构建

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      
      // 获取总数
      const [countResult] = await connection.query(
        `SELECT COUNT(*) as total FROM deities d ${whereClause}`,
        queryParams
      )
      
      // 获取分页数据
      const [deities] = await connection.query(
        `SELECT 
          d.*,
          GROUP_CONCAT(dr.responsibility) as responsibilities,
          dp.name as department_name,
          r.name as rank_name,
          r.code as rank_code
        FROM deities d 
        LEFT JOIN deity_responsibilities dr ON d.id = dr.deity_id
        LEFT JOIN departments dp ON d.department_id = dp.id
        LEFT JOIN ranks r ON d.rank_id = r.id
        ${whereClause}
        GROUP BY d.id
        ORDER BY r.level ASC, d.created_at DESC
        LIMIT ? OFFSET ?`,
        [...queryParams, pageSize, (page - 1) * pageSize]
      )

      return {
        data: this.formatDeityResponse(deities),
        total: countResult[0].total
      }
    } finally {
      connection.release()
    }
  }

  static async updateStatus(id: string, status: DeityStatus): Promise<DeityResponse> {
    return await db.transaction(async (connection) => {
      // 更新状态
      await connection.query(
        'UPDATE deities SET status = ?, updated_at = ? WHERE id = ?',
        [status, new Date(), id]
      )

      // 记录状态历史
      if (['suspended', 'dismissed', 'blacklisted'].includes(status)) {
        await connection.query(
          'INSERT INTO deity_status_history SET ?',
          {
            id: uuidv4(),
            deity_id: id,
            status,
            created_at: new Date()
          }
        )
      }

      // 获取更新后的数据
      const [updatedDeity] = await connection.query(
        `SELECT 
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
        GROUP BY d.id`,
        [id]
      )

      return this.formatDeityResponse(updatedDeity)[0]
    })
  }

  private static formatDeityResponse(data: any): DeityResponse[] {
    return Array.isArray(data) ? data.map(deity => ({
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
    })) : []
  }

  static async getAllDeities(): Promise<Deity[]> {
    const connection = await db.getConnection()
    try {
      const [deities] = await connection.query<RowDataPacket[]>(`
        SELECT 
          d.*,
          dp.name as department_name,
          r.name as rank_name,
          r.code as rank_code,
          r.level as rank_level
        FROM deities d 
        LEFT JOIN departments dp ON d.department_id = dp.id
        LEFT JOIN ranks r ON d.rank_id = r.id
        WHERE d.status = 'active'
        ORDER BY r.level ASC, d.name ASC
      `)

      return deities.map(deity => ({
        id: deity.id,
        name: deity.name,
        title: deity.title,
        departmentId: deity.department_id,
        departmentName: deity.department_name,
        rankId: deity.rank_id,
        rankName: `${deity.rank_name} (${deity.rank_code}级)`,
        rankLevel: deity.rank_level,
        status: deity.status,
        joinDate: deity.join_date,
        lastPromotionDate: deity.last_promotion_date
      }))
    } finally {
      connection.release()
    }
  }
} 