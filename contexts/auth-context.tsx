'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { User, Permission } from '@/types'
import { authApi, permissionApi } from '@/services/api'
import { useRouter, usePathname } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permissionCode: string) => boolean
  userMenus: Permission[]
  userOperations: (menuCode: string) => Promise<Permission[]>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userMenus, setUserMenus] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (pathname === '/login') {
          setIsLoading(false)
          return
        }

        const user = await authApi.getCurrentUser()
        if (user) {
          setUser(user)
          const menus = await authApi.getUserMenus()
          setUserMenus(menus)
        } else if (pathname !== '/') {
          toast({
            title: "认证失败",
            description: "请重新登录",
            variant: "destructive"
          })
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        if (pathname !== '/' && pathname !== '/login') {
          toast({
            title: "认证失败",
            description: error instanceof Error ? error.message : "请重新登录",
            variant: "destructive"
          })
          router.push('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password)
      if (response.user) {
        setUser(response.user)
        const menus = await authApi.getUserMenus()
        setUserMenus(menus)
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "用户名或密码错误",
        variant: "destructive"
      })
      return false
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
      setUser(null)
      setUserMenus([])
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      toast({
        title: "退出失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive"
      })
    }
  }

  const hasPermission = (permissionCode: string) => {
    if (!user?.permissions) return false
    return user.permissions.includes(permissionCode)
  }

  const userOperations = async (menuCode: string): Promise<Permission[]> => {
    try {
      const operations = await permissionApi.getOperations(menuCode)
      return operations
    } catch (error) {
      console.error('Failed to get operations:', error)
      toast({
        title: "获取权限失败",
        description: error instanceof Error ? error.message : "请刷新页面重试",
        variant: "destructive"
      })
      return []
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      hasPermission,
      userMenus,
      userOperations
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 