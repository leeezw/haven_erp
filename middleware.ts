import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 不需要验证的路由
const publicPaths = ['/', '/login', '/api/auth/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 如果是公开路由，直接放行
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // 检查 token
  const token = request.cookies.get('token')?.value

  // API 路由的处理
  if (pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    try {
      verify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }

  // 页面路由的处理
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    verify(token, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    // token 无效，重定向到登录页
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 