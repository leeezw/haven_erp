import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/auth.service'
import { cookies } from 'next/headers'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    // 1. 获取登录信息
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // 2. 验证用户
    const user = await AuthService.login(username, password)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // 3. 生成 JWT token
    const token = sign(
      { 
        id: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // 4. 设置 cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    // 5. 返回用户信息
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        deityName: user.deityName,
        deityTitle: user.deityTitle,
        roles: user.roles,
        permissions: user.permissions,
        status: user.status
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 