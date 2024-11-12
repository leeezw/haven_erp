'use client'

import { useState, useEffect } from 'react'
import { DepartmentTree } from '@/components/departments/DepartmentTree'
import { DepartmentDialog } from '@/components/departments/DepartmentDialog'
import { LeaderChangeDialog } from '@/components/departments/LeaderChangeDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { PlusCircle, Search, Building2, Users, AlertTriangle } from 'lucide-react'
import { Department } from '@/types'
import { useToast } from "@/components/ui/use-toast"
import { PermissionGuard } from '@/components/auth/PermissionGuard'
import { departmentApi } from '@/services/api'

export default function DepartmentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [leaderDialogOpen, setLeaderDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [departmentsList, setDepartmentsList] = useState<Department[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // 加载部门数据
  const loadDepartments = async () => {
    try {
      setIsLoading(true)
      const departments = await departmentApi.getList({ tree: true })
      setDepartmentsList(departments)
    } catch (error) {
      console.error('Error loading departments:', error)
      toast({
        title: '加载失败',
        description: error instanceof Error ? error.message : '获取数据时发生错误',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  // 统计信息
  const countDepartments = (deps: Department[]): number => {
    let count = deps.length
    deps.forEach(dep => {
      if (dep.children) {
        count += countDepartments(dep.children)
      }
    })
    return count
  }

  const totalDepartments = countDepartments(departmentsList)
  const activeDepartments = countDepartments(
    departmentsList.filter(d => d.status === 'active')
  )
  const inactiveDepartments = totalDepartments - activeDepartments

  // 搜索过滤
  const filterDepartments = (deps: Department[], keyword: string): Department[] => {
    return deps.map(dep => {
      const newDep = { ...dep }
      if (dep.children) {
        newDep.children = filterDepartments(dep.children, keyword)
      }
      if (
        dep.name.toLowerCase().includes(keyword.toLowerCase()) ||
        dep.code.toLowerCase().includes(keyword.toLowerCase()) ||
        (newDep.children && newDep.children.length > 0)
      ) {
        return newDep
      }
      return null
    }).filter(Boolean) as Department[]
  }

  const filteredDepartments = searchKeyword
    ? filterDepartments(departmentsList, searchKeyword)
    : departmentsList

  const handleSubmit = async (formData: Partial<Department>) => {
    try {
      if (!formData.name || !formData.code) {
        toast({
          title: "提交失败",
          description: "请填写必要信息",
          variant: "destructive",
        })
        return
      }

      if (editingDepartment) {
        await departmentApi.update(editingDepartment.id, formData)
      } else {
        await departmentApi.create(formData)
      }

      await loadDepartments() // 重新加载数据

      toast({
        title: editingDepartment ? "部门更新成功" : "新部门创建成功",
        description: `${formData.name} ${editingDepartment ? '部门信息已更新' : '部门已添加到组织架构中'}`
      })

      setDialogOpen(false)
      setEditingDepartment(null)
      setSelectedDepartment(null)
    } catch (error) {
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : '保存失败',
        variant: "destructive"
      })
    }
  }

  const handleLeaderChange = async (departmentId: string, leaderId: string) => {
    try {
      await departmentApi.updateLeader(departmentId, leaderId)
      await loadDepartments() // 重新加载数据

      toast({
        title: "负责人更新成功",
        description: "部门负责人已更新"
      })
      
      setLeaderDialogOpen(false)
    } catch (error) {
      toast({
        title: "更新失败",
        description: error instanceof Error ? error.message : '更新失败',
        variant: "destructive"
      })
    }
  }

  const handleToggleStatus = async (department: Department) => {
    try {
      const newStatus = department.status === 'active' ? 'inactive' : 'active'
      await departmentApi.updateStatus(department.id, newStatus)
      await loadDepartments() // 重新加载数据

      toast({
        title: `部门${newStatus === 'active' ? '启用' : '停用'}成功`,
        description: `${department.name} 已${newStatus === 'active' ? '启用' : '停用'}`
      })
    } catch (error) {
      toast({
        title: "状态更新失败",
        description: error instanceof Error ? error.message : '更新失败',
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">加载中...</h3>
          <p className="mt-2 text-sm text-gray-500">
            正在获取部门数据，请稍候
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">部门管理</h2>
          <p className="mt-2 text-sm text-gray-500">管理天庭各部门架构及职能</p>
        </div>
        <div>
          <PermissionGuard permissionCode="department:create">
            <Button 
              size="lg" 
              className="shadow-sm" 
              onClick={() => {
                setEditingDepartment(null)
                setSelectedDepartment(null)
                setDialogOpen(true)
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              新增部门
            </Button>
          </PermissionGuard>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-500">总部门数</h3>
            <Building2 className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{totalDepartments}</p>
        </Card>
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-500">在运行部门</h3>
            <Users className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">{activeDepartments}</p>
        </Card>
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-500">已停用部门</h3>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold">{inactiveDepartments}</p>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索部门名称或代码"
              className="pl-9"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>

        <DepartmentTree 
          departments={filteredDepartments}
          onEdit={setEditingDepartment}
          onAddSub={parent => {
            setEditingDepartment(null)
            setSelectedDepartment(parent)
            setDialogOpen(true)
          }}
          onChangeLeader={(department) => {
            setSelectedDepartment(department)
            setLeaderDialogOpen(true)
          }}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <DepartmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingDepartment}
        parentDepartment={selectedDepartment}
        departments={departmentsList}
        onSubmit={handleSubmit}
      />

      <LeaderChangeDialog
        open={leaderDialogOpen}
        onOpenChange={setLeaderDialogOpen}
        department={selectedDepartment}
        onSubmit={handleLeaderChange}
      />
    </div>
  )
} 