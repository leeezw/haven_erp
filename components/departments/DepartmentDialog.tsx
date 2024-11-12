'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Department, Deity } from "@/types"
import { deityApi } from '@/services/api'

interface DepartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Department | null
  parentDepartment?: Department | null
  departments: Department[]
  onSubmit: (data: Partial<Department>) => void
}

export function DepartmentDialog({
  open,
  onOpenChange,
  initialData,
  parentDepartment,
  departments,
  onSubmit
}: DepartmentDialogProps) {
  const [formData, setFormData] = useState<Partial<Department>>({
    name: '',
    code: '',
    parent_id: null,
    level: 1,
    description: '',
    leader_id: null,
    status: 'active',
    min_rank_id: null
  })

  const [availableLeaders, setAvailableLeaders] = useState<Deity[]>([])

  // 加载神仙列表
  useEffect(() => {
    const loadDeities = async () => {
      try {
        const response = await deityApi.getList({ status: 'active' })
        setAvailableLeaders(response.data)
      } catch (error) {
        console.error('Error loading deities:', error)
      }
    }

    if (open) {
      loadDeities()
    }
  }, [open])

  // 当对话框打开或初始数据变化时，更新表单数据
  useEffect(() => {
    if (open) {
      if (initialData) {
        // 编辑模式：使用初始数据
        setFormData({
          name: initialData.name,
          code: initialData.code,
          parent_id: initialData.parent_id,
          level: initialData.level,
          description: initialData.description || '',
          leader_id: initialData.leader_id,
          status: initialData.status,
          min_rank_id: initialData.min_rank_id
        })
      } else if (parentDepartment) {
        // 新增子部门模式
        setFormData({
          name: '',
          code: '',
          parent_id: parentDepartment.id,
          level: parentDepartment.level + 1,
          description: '',
          leader_id: null,
          status: 'active',
          min_rank_id: null
        })
      } else {
        // 新增顶级部门模式
        setFormData({
          name: '',
          code: '',
          parent_id: null,
          level: 1,
          description: '',
          leader_id: null,
          status: 'active',
          min_rank_id: null
        })
      }
    }
  }, [open, initialData, parentDepartment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.code) {
      alert('请填写必要信息')
      return
    }
    onSubmit(formData)
  }

  // 递归获取所有可选的父部门
  const getAllDepartments = (deps: Department[], current?: Department): Department[] => {
    let result: Department[] = []
    for (const dep of deps) {
      if (current && dep.id === current.id) continue
      result.push(dep)
      if (dep.children) {
        result = result.concat(getAllDepartments(dep.children, current))
      }
    }
    return result
  }

  const availableParents = getAllDepartments(departments, initialData || undefined)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? '编辑部门' : parentDepartment ? `新增 ${parentDepartment.name} 的子部门` : '新增部门'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">部门名称</Label>
              <Input
                id="name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">部门代码</Label>
              <Input
                id="code"
                className="col-span-3"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            {!parentDepartment && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parent_id" className="text-right">上级部门</Label>
                <Select
                  value={formData.parent_id?.toString() || "none"}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    parent_id: value === "none" ? null : value,
                    level: value === "none" ? 1 : (availableParents.find(d => d.id === value)?.level || 0) + 1
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择上级部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无上级部门</SelectItem>
                    {availableParents.map((dep) => (
                      <SelectItem key={dep.id} value={dep.id}>
                        {dep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="leader_id" className="text-right">负责人</Label>
              <Select
                value={formData.leader_id || "none"}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  leader_id: value === "none" ? null : value 
                })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择负责人" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">暂不设置</SelectItem>
                  {availableLeaders.map((deity) => (
                    <SelectItem key={deity.id} value={deity.id}>
                      {deity.name} ({deity.title}) - {deity.rankName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">描述</Label>
              <Textarea
                id="description"
                className="col-span-3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">状态</Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value: 'active' | 'inactive') => 
                  setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">正常</SelectItem>
                  <SelectItem value="inactive">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">确定</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 