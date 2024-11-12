import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  // 清除 cookie
  cookies().delete('token')
  
  return NextResponse.json({ success: true })
} 