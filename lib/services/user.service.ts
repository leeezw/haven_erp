import { db } from './database'
import { RowDataPacket } from 'mysql2'
import bcrypt from 'bcryptjs'
import { User } from '@/types'

export class UserService {
  // 用户登录
  static async login(username: string, password: string): Promise<User | null> {
    const connection = await db.getConnection()
    try {
      // 获取用户信息
      const [users] = await connection.query<RowDataPacket[]>(`
        SELECT 
          u.*,
          GROUP_CONCAT(DISTINCT r.code) as roles,
          d.name as deity_name,
          d.title as deity_title
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        LEFT JOIN deities d ON u.deity_id = d.id
        WHERE u.username = ? AND u.status = 'active'
        GROUP BY u.id
      `, [username])

      if (users.length === 0) return null

      const user = users[0]

      // 验证密码
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) return null

      // 更新最后登录时间
      await connection.query(
        'UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?',
        [new Date(), new Date(), user.id]
      )

      // 获取用户权限
      const [permissions] = await connection.query<RowDataPacket[]>(`
        SELECT DISTINCT p.code
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = ?
      `, [user.id])

      return {
        id: user.id,
        username: user.username,
        deityId: user.deity_id,
        deityName: user.deity_name,
        deityTitle: user.deity_title,
        roles: user.roles ? user.roles.split(',') : [],
        permissions: permissions.map(p => p.code),
        status: user.status,
        lastLogin: user.last_login
      }
    } finally {
      connection.release()
    }
  }

  // 获取用户权限
  static async getUserPermissions(userId: string): Promise<string[]> {
    const connection = await db.getConnection()
    try {
      const [rows] = await connection.query<RowDataPacket[]>(`
        SELECT DISTINCT p.code
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = ?
      `, [userId])

      return rows.map(row => row.code)
    } finally {
      connection.release()
    }
  }

  // 获取用户菜单
  static async getUserMenus(userId: string): Promise<string[]> {
    const connection = await db.getConnection()
    try {
      const [rows] = await connection.query<RowDataPacket[]>(`
        SELECT DISTINCT p.code
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = ? AND p.type = 'menu'
      `, [userId])

      return rows.map(row => row.code)
    } finally {
      connection.release()
    }
  }
} 