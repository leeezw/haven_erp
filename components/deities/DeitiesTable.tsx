'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PermissionGuard } from '@/components/auth/PermissionGuard'

interface Deity {
  id: string
  name: string
  title: string
  departmentId: string
  departmentName: string
  rankId: string
  rankName: string
  status: 'active' | 'inactive' | 'suspended' | 'dismissed' | 'blacklisted'
  responsibilities: string[]
  joinDate: string
  lastPromotionDate: string | null
}

const statusMap = {
  active: { label: '在职', color: 'bg-green-100 text-green-800' },
  inactive: { label: '离职', color: 'bg-gray-100 text-gray-800' },
  suspended: { label: '停职', color: 'bg-yellow-100 text-yellow-800' },
  dismissed: { label: '撤职', color: 'bg-red-100 text-red-800' },
  blacklisted: { label: '黑名单', color: 'bg-gray-100 text-gray-800' }
}

interface DeitiesTableProps {
  data: Deity[]
  onEdit: (deity: Deity) => void
  onStatusChange: (id: string, status: keyof typeof statusMap) => void
}

export default function DeitiesTable({ 
  data, 
  onEdit,
  onStatusChange 
}: DeitiesTableProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">姓名</TableHead>
            <TableHead className="font-semibold">职位</TableHead>
            <TableHead className="font-semibold">部门</TableHead>
            <TableHead className="font-semibold">品级</TableHead>
            <TableHead className="font-semibold">职责</TableHead>
            <TableHead className="font-semibold">状态</TableHead>
            <TableHead className="text-right font-semibold">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((deity) => (
            <TableRow key={deity.id} className="hover:bg-gray-50/50">
              <TableCell className="font-medium">{deity.name}</TableCell>
              <TableCell>{deity.title}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {deity.departmentName}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                  {deity.rankName}
                </span>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {deity.responsibilities.join('、')}
              </TableCell>
              <TableCell>
                <Badge 
                  className={cn(
                    "font-semibold",
                    statusMap[deity.status]?.color
                  )}
                >
                  {statusMap[deity.status]?.label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <PermissionGuard permissionCode="deity:edit">
                      <DropdownMenuItem
                        onClick={() => onEdit(deity)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                      >
                        <span className="w-full">编辑</span>
                      </DropdownMenuItem>
                    </PermissionGuard>
                    <PermissionGuard permissionCode="deity:status">
                      {deity.status === 'active' && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onStatusChange(deity.id, 'suspended')}
                            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 cursor-pointer"
                          >
                            <span className="w-full">停职</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onStatusChange(deity.id, 'dismissed')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <span className="w-full">撤职</span>
                          </DropdownMenuItem>
                        </>
                      )}
                      {deity.status !== 'blacklisted' && (
                        <DropdownMenuItem
                          onClick={() => onStatusChange(deity.id, 'blacklisted')}
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          <span className="w-full">加入黑名单</span>
                        </DropdownMenuItem>
                      )}
                      {deity.status !== 'active' && (
                        <DropdownMenuItem
                          onClick={() => onStatusChange(deity.id, 'active')}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
                        >
                          <span className="w-full">恢复在职</span>
                        </DropdownMenuItem>
                      )}
                    </PermissionGuard>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 