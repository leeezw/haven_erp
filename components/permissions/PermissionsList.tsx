'use client'

import { useState } from 'react'
import { permissions } from '@/lib/mock-data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PermissionsList() {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredPermissions = permissions.filter(permission => {
    const matchesKeyword = 
      permission.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      permission.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchKeyword.toLowerCase())
    
    const matchesType = typeFilter === 'all' || permission.type === typeFilter

    return matchesKeyword && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索权限名称、代码或描述"
              className="pl-9"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>
        <div className="w-[160px]">
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择权限类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="menu">菜单权限</SelectItem>
              <SelectItem value="operation">操作权限</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>权限名称</TableHead>
            <TableHead>权限代码</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>描述</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPermissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium">{permission.name}</TableCell>
              <TableCell>{permission.code}</TableCell>
              <TableCell>
                <Badge variant={permission.type === 'menu' ? 'default' : 'secondary'}>
                  {permission.type === 'menu' ? '菜单' : '操作'}
                </Badge>
              </TableCell>
              <TableCell>{permission.description}</TableCell>
            </TableRow>
          ))}
          {filteredPermissions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                没有找到匹配的权限
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 