'use client'

import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'

interface PermissionGuardProps {
  permissionCode: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({
  permissionCode,
  children,
  fallback = null
}: PermissionGuardProps) {
  const { hasPermission } = useAuth()
  const [canRender, setCanRender] = useState(false)

  useEffect(() => {
    setCanRender(hasPermission(permissionCode))
  }, [hasPermission, permissionCode])

  if (!canRender) {
    return fallback
  }

  return <>{children}</>
} 