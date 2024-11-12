'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RolesList } from '@/components/permissions/RolesList'
import { PermissionsList } from '@/components/permissions/PermissionsList'
import { useAuth } from '@/contexts/auth-context'
import { PermissionGuard } from '@/components/auth/PermissionGuard'

export default function PermissionsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('roles')

  if (!user?.roles.includes('role-admin')) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">无权访问</h3>
          <p className="mt-2 text-sm text-gray-500">
            您没有权限访问权限管理页面
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">权限管理</h2>
          <p className="mt-2 text-sm text-gray-500">管理系统角色和权限配置</p>
        </div>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="roles" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="roles">角色管理</TabsTrigger>
            <TabsTrigger value="permissions">权限配置</TabsTrigger>
          </TabsList>
          <TabsContent value="roles" className="mt-6">
            <RolesList />
          </TabsContent>
          <TabsContent value="permissions" className="mt-6">
            <PermissionsList />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 