import { AuthService } from '../lib/services/auth.service'
import { db } from '../lib/db'

async function resetPassword() {
  try {
    const users = [
      { username: 'admin', password: 'admin123' },
      { username: 'manager', password: 'manager123' },
      { username: 'user', password: 'user123' }
    ]

    for (const user of users) {
      const hashedPassword = await AuthService.hashPassword(user.password)
      const connection = await db.getConnection()
      
      try {
        await connection.query(
          'UPDATE users SET password = ? WHERE username = ?',
          [hashedPassword, user.username]
        )
        console.log(`Password reset successful for user: ${user.username}`)
      } finally {
        connection.release()
      }
    }

    console.log('All passwords have been reset')
    process.exit(0)
  } catch (error) {
    console.error('Error resetting passwords:', error)
    process.exit(1)
  }
}

resetPassword() 