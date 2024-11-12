import { db } from './database'
import { Department } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export class DepartmentService {
  static async findAll(): Promise<Department[]> {
    const connection = await db.getConnection()
    try {
      const [rows] = await connection.query(`
        SELECT 
          d.*,
          CONCAT(r.name, ' (', r.code, '级)') as min_rank_name
        FROM departments d
        LEFT JOIN ranks r ON d.min_rank_id = r.id
        ORDER BY d.level, d.parent_id, d.id
      `)

      return rows as Department[]
    } finally {
      connection.release()
    }
  }

  static async create(department: Partial<Department>): Promise<Department> {
    return await db.transaction(async (connection) => {
      const id = uuidv4()
      
      await connection.query(
        'INSERT INTO departments SET ?',
        {
          id,
          name: department.name,
          code: department.code,
          parent_id: department.parent_id,
          level: department.level,
          description: department.description,
          leader_id: department.leader_id,
          status: department.status || 'active',
          min_rank_id: department.min_rank_id,
          created_at: new Date(),
          updated_at: new Date()
        }
      )

      const [newDepartment] = await connection.query(`
        SELECT 
          d.*,
          CONCAT(r.name, ' (', r.code, '级)') as min_rank_name
        FROM departments d
        LEFT JOIN ranks r ON d.min_rank_id = r.id
        WHERE d.id = ?
      `, [id])

      return newDepartment[0] as Department
    })
  }

  static async update(id: string, department: Partial<Department>): Promise<Department> {
    return await db.transaction(async (connection) => {
      await connection.query(
        'UPDATE departments SET ? WHERE id = ?',
        [{
          name: department.name,
          code: department.code,
          parent_id: department.parent_id,
          level: department.level,
          description: department.description,
          leader_id: department.leader_id,
          status: department.status,
          min_rank_id: department.min_rank_id,
          updated_at: new Date()
        }, id]
      )

      const [updatedDepartment] = await connection.query(`
        SELECT 
          d.*,
          CONCAT(r.name, ' (', r.code, '级)') as min_rank_name
        FROM departments d
        LEFT JOIN ranks r ON d.min_rank_id = r.id
        WHERE d.id = ?
      `, [id])

      return updatedDepartment[0] as Department
    })
  }

  static async updateLeader(id: string, leaderId: string | null): Promise<Department> {
    return await db.transaction(async (connection) => {
      await connection.query(
        'UPDATE departments SET leader_id = ?, updated_at = ? WHERE id = ?',
        [leaderId, new Date(), id]
      )

      const [updatedDepartment] = await connection.query(`
        SELECT 
          d.*,
          CONCAT(r.name, ' (', r.code, '级)') as min_rank_name
        FROM departments d
        LEFT JOIN ranks r ON d.min_rank_id = r.id
        WHERE d.id = ?
      `, [id])

      return updatedDepartment[0] as Department
    })
  }

  static async updateStatus(id: string, status: 'active' | 'inactive'): Promise<Department> {
    return await db.transaction(async (connection) => {
      await connection.query(
        'UPDATE departments SET status = ?, updated_at = ? WHERE id = ?',
        [status, new Date(), id]
      )

      const [updatedDepartment] = await connection.query(`
        SELECT 
          d.*,
          CONCAT(r.name, ' (', r.code, '级)') as min_rank_name
        FROM departments d
        LEFT JOIN ranks r ON d.min_rank_id = r.id
        WHERE d.id = ?
      `, [id])

      return updatedDepartment[0] as Department
    })
  }

  static async buildDepartmentTree(departments: Department[]): Promise<Department[]> {
    return departments
      .filter(dept => !dept.parent_id)
      .map(dept => ({
        ...dept,
        children: this.getChildren(departments, dept.id)
      }))
  }

  private static getChildren(departments: Department[], parentId: string): Department[] {
    return departments
      .filter(dept => dept.parent_id === parentId)
      .map(dept => ({
        ...dept,
        children: this.getChildren(departments, dept.id)
      }))
  }
} 