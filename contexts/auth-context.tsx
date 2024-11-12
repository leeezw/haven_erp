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
          router.push('/login')
        }
      } catch (error) {
        if (pathname !== '/' && pathname !== '/login') {
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
      if (response?.user) {
        setUser(response.user)
        const menus = await authApi.getUserMenus()
        setUserMenus(menus)
        return true
      }
      return false
    } catch (error) {
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
      setUser(null)
      setUserMenus([])
      router.push('/login')
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