'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import {
  Users,
  ClipboardList,
  Building2,
  FileText,
  LayoutDashboard,
  Lock,
} from 'lucide-react'
import { Permission } from '@/lib/mock-data'

interface MenuItem {
  title: string
  href: string
  icon: React.ElementType
  permissionCode: string
}

const menuItems: MenuItem[] = [
  {
    title: '总览',
    href: '/dashboard',
    icon: LayoutDashboard,
    permissionCode: 'dashboard'
  },
  {
    title: '神仙管理',
    href: '/dashboard/deities',
    icon: Users,
    permissionCode: 'deities'
  },
  {
    title: '部门管理',
    href: '/dashboard/departments',
    icon: Building2,
    permissionCode: 'departments'
  },
  {
    title: '权限管理',
    href: '/dashboard/permissions',
    icon: Lock,
    permissionCode: 'permissions'
  },
  {
    title: '任务管理',
    href: '/dashboard/tasks',
    icon: ClipboardList,
    permissionCode: 'tasks'
  },
  {
    title: '奏折管理',
    href: '/dashboard/reports',
    icon: FileText,
    permissionCode: 'reports'
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const { userMenus } = useAuth()

  // 过滤出用户有权限访问的菜单
  const authorizedMenus = menuItems.filter(item =>
    userMenus.some(menu => menu.code === item.permissionCode)
  )

  return (
    <div className="w-64 bg-white border-r">
      <nav className="flex flex-col p-4 space-y-1">
        {authorizedMenus.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100",
                pathname === item.href && "bg-gray-100 text-gray-900"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 