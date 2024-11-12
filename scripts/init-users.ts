import { AuthService } from '../lib/services/auth.service'
import { db } from '../lib/db'
import { v4 as uuidv4 } from 'uuid'

async function initUsers() {
  try {
    const users = [
      {
        username: 'admin',
        password: 'admin123',
        roleId: 'role-admin',
        deityId: '1'  // 玉皇大帝
      },
      {
        username: 'manager',
        password: 'manager123',
        roleId: 'role-manager',
        deityId: '2'  // 太上老君
      },
      {
        username: 'user',
        password: 'user123',
        roleId: 'role-user',
        deityId: '3'  // 王母娘娘
      }
    ]

    const connection = await db.getConnection()
    
    try {
      await connection.beginTransaction()

      for (const user of users) {
        // 生成加密密码
        const hashedPassword = await AuthService.hashPassword(user.password)
        
        // 检查用户是否存在
        const [existingUsers] = await connection.query(
          'SELECT id FROM users WHERE username = ?',
          [user.username]
        )

        let userId: string

        if (existingUsers.length > 0) {
          // 更新现有用户
          userId = existingUsers[0].id
          await connection.query(
            'UPDATE users SET password = ?, deity_id = ?, status = ?, updated_at = ? WHERE id = ?',
            [hashedPassword, user.deityId, 'active', new Date(), userId]
          )
        } else {
          // 创建新用户
          userId = uuidv4()
          await connection.query(
            'INSERT INTO users (id, username, password, deity_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, user.username, hashedPassword, user.deityId, 'active', new Date(), new Date()]
          )
        }

        // 更新用户角色
        await connection.query('DELETE FROM user_roles WHERE user_id = ?', [userId])
        await connection.query(
          'INSERT INTO user_roles (id, user_id, role_id, created_at) VALUES (?, ?, ?, ?)',
          [uuidv4(), userId, user.roleId, new Date()]
        )

        console.log(`User ${user.username} initialized successfully`)
      }

      await connection.commit()
      console.log('All users have been initialized')
      process.exit(0)
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error initializing users:', error)
    process.exit(1)
  }
}

initUsers() 