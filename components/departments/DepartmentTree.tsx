'use client'

import { Department } from '@/types'
import { Button } from '@/components/ui/button'
import {
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Pencil,
  UserPlus,
  Power,
  PowerOff,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PermissionGuard } from '@/components/auth/PermissionGuard'
import { deityApi } from '@/services/api'

interface DepartmentTreeProps {
  departments: Department[]
  onEdit: (department: Department) => void
  onAddSub: (department: Department) => void
  onChangeLeader: (department: Department) => void
  onToggleStatus: (department: Department) => void
  level?: number
}

export function DepartmentTree({ 
  departments, 
  onEdit, 
  onAddSub,
  onChangeLeader,
  onToggleStatus,
  level = 0 
}: DepartmentTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [leaderNames, setLeaderNames] = useState<Record<string, string>>({})

  // 获取部门负责人名称
  const getLeaderName = async (leaderId: string | null) => {
    if (!leaderId) return '未设置'
    try {
      const response = await deityApi.getList({ status: 'active' })
      const leader = response.data.find(deity => deity.id === leaderId)
      return leader ? leader.name : '未设置'
    } catch (error) {
      console.error('Error fetching leader name:', error)
      return '未设置'
    }
  }

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleEdit = (department: Department, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit(department)
  }

  const handleAddSub = (department: Department, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddSub(department)
  }

  const handleChangeLeader = (department: Department, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChangeLeader(department)
  }

  const handleToggleStatus = (department: Department, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleStatus(department)
  }

  return (
    <div className={cn("space-y-2", level > 0 && "ml-8 mt-2")}>
      {departments.map((dept) => (
        <div key={dept.id}>
          <div className={cn(
            "flex items-center p-2 rounded-lg hover:bg-gray-50 group",
            expanded[dept.id] && "bg-gray-50"
          )}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 transition-colors",
                (!dept.children || dept.children.length === 0) && "invisible",
                "group-hover:bg-gray-100"
              )}
              onClick={() => toggleExpand(dept.id)}
            >
              {expanded[dept.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            <div className="flex-1 flex items-center gap-3 ml-1">
              <span className="font-medium">{dept.name}</span>
              <span className="text-sm text-gray-500">({dept.code})</span>
              <Badge variant={dept.status === 'active' ? 'success' : 'secondary'}>
                {dept.status === 'active' ? '正常' : '停用'}
              </Badge>
              {dept.level === 1 && (
                <Badge variant="outline" className="border-blue-500 text-blue-500">
                  一级部门
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                      <UserPlus className="h-3 w-3" />
                      <span className="text-sm">
                        {leaderNames[dept.id] || '未设置'}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>当前负责人</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <PermissionGuard permissionCode="department:edit">
                    <DropdownMenuItem 
                      onClick={(e) => handleEdit(dept, e)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      编辑部门
                    </DropdownMenuItem>
                  </PermissionGuard>
                  <PermissionGuard permissionCode="department:edit">
                    <DropdownMenuItem 
                      onClick={(e) => handleAddSub(dept, e)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
                      disabled={dept.status === 'inactive'}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      添加子部门
                    </DropdownMenuItem>
                  </PermissionGuard>
                  <DropdownMenuItem 
                    onClick={(e) => handleChangeLeader(dept, e)}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 cursor-pointer"
                    disabled={dept.status === 'inactive'}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    更换负责人
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => handleToggleStatus(dept, e)}
                    className={cn(
                      "cursor-pointer",
                      dept.status === 'active' ? "text-red-600" : "text-green-600"
                    )}
                  >
                    {dept.status === 'active' ? (
                      <>
                        <PowerOff className="mr-2 h-4 w-4" />
                        停用部门
                      </>
                    ) : (
                      <>
                        <Power className="mr-2 h-4 w-4" />
                        启用部门
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {expanded[dept.id] && dept.children && dept.children.length > 0 && (
            <DepartmentTree
              departments={dept.children}
              onEdit={onEdit}
              onAddSub={onAddSub}
              onChangeLeader={onChangeLeader}
              onToggleStatus={onToggleStatus}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  )
} 