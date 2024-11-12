'use client'

import { useState } from 'react'
import { roles, permissions } from '@/lib/mock-data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RoleDialog } from './RoleDialog'
import { PermissionGuard } from '@/components/auth/PermissionGuard'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function RolesList() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    role.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    role.description.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索角色名称、代码或描述"
              className="pl-9"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>
        <PermissionGuard permissionCode="role:edit">
          <Button onClick={() => {
            setEditingRole(null)
            setDialogOpen(true)
          }}>
            新增角色
          </Button>
        </PermissionGuard>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>角色名称</TableHead>
            <TableHead>角色代码</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>权限数量</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>{role.code}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {role.permissions.length} 个权限
                </Badge>
              </TableCell>
              <TableCell>
                <PermissionGuard permissionCode="role:edit">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setEditingRole(role)
                      setDialogOpen(true)
                    }}
                  >
                    编辑
                  </Button>
                </PermissionGuard>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingRole}
      />
    </div>
  )
} 