import { db } from './database'
import { RowDataPacket } from 'mysql2'
import bcrypt from 'bcryptjs'
import { User } from '@/types'

export class AuthService {
  // 用户登录
  static async login(username: string, password: string): Promise<User | null> {
    const connection = await db.getConnection()
    try {
      console.log('Attempting login for user:', username)

      // 1. 先查询用户基本信息
      const [users] = await connection.query<RowDataPacket[]>(`
        SELECT u.* 
        FROM users u 
        WHERE u.username = ?
      `, [username])

      console.log('Found users:', users)

      if (users.length === 0) {
        console.log('No user found with username:', username)
        return null
      }

      const user = users[0]
      console.log('User found:', { id: user.id, username: user.username, status: user.status })

      // 2. 验证密码
      console.log('Comparing passwords...')
      console.log('Stored password hash:', user.password)
      const isValid = await bcrypt.compare(password, user.password)
      console.log('Password valid:', isValid)

      if (!isValid) {
        console.log('Invalid password for user:', username)
        return null
      }

      // 3. 检查用户状态
      if (user.status !== 'active') {
        console.log('User is not active:', username)
        return null
      }

      // 4. 获取用户角色
      const [roles] = await connection.query<RowDataPacket[]>(`
        SELECT GROUP_CONCAT(r.code) as roles
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = ?
        GROUP BY ur.user_id
      `, [user.id])

      console.log('User roles:', roles)

      // 5. 获取用户权限
      const [permissions] = await connection.query<RowDataPacket[]>(`
        SELECT DISTINCT p.code
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = ?
      `, [user.id])

      console.log('User permissions:', permissions)

      // 6. 获取关联的神仙信息
      const [deities] = await connection.query<RowDataPacket[]>(`
        SELECT d.name, d.title
        FROM deities d
        WHERE d.id = ?
      `, [user.deity_id])

      console.log('Deity info:', deities)

      // 7. 更新最后登录时间
      await connection.query(
        'UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?',
        [new Date(), new Date(), user.id]
      )

      const userInfo = {
        id: user.id,
        username: user.username,
        deityId: user.deity_id,
        deityName: deities[0]?.name,
        deityTitle: deities[0]?.title,
        roles: roles[0]?.roles ? roles[0].roles.split(',') : [],
        permissions: permissions.map(p => p.code),
        status: user.status,
        lastLogin: user.last_login
      }

      console.log('Returning user info:', userInfo)
      return userInfo
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      connection.release()
    }
  }

  // 生成加密密码
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }
} 