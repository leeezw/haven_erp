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
import { departments, ranks, findDepartmentById, getDepartmentPath } from '@/lib/mock-data'

interface DeityFormData {
  id?: string
  name: string
  title: string
  departmentId: string
  rankId: string
  responsibilities: string[]
}

interface DeityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: DeityFormData | null
  onSubmit: (data: DeityFormData) => void
}

export function DeityDialog({ open, onOpenChange, initialData, onSubmit }: DeityDialogProps) {
  const [formData, setFormData] = useState<DeityFormData>({
    name: '',
    title: '',
    departmentId: '',
    rankId: '',
    responsibilities: []
  })

  // 当对话框打开或初始数据变化时，更新表单数据
  useEffect(() => {
    if (open && initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        title: initialData.title,
        departmentId: initialData.departmentId,
        rankId: initialData.rankId,
        responsibilities: initialData.responsibilities || []
      })
    } else if (open) {
      // 如果是新增，重置表单
      setFormData({
        name: '',
        title: '',
        departmentId: '',
        rankId: '',
        responsibilities: []
      })
    }
  }, [open, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ 
      ...formData, 
      responsibilities: e.target.value.split('、').filter(Boolean)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? '编辑神仙' : '新增神仙'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">姓名</Label>
              <Input
                id="name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">职位</Label>
              <Input
                id="title"
                className="col-span-3"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="departmentId" className="text-right">所属部门</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem 
                      key={dept.id} 
                      value={dept.id}
                      disabled={dept.status === 'inactive'}
                    >
                      {getDepartmentPath(departments, dept.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rankId" className="text-right">职级</Label>
              <Select
                value={formData.rankId}
                onValueChange={(value) => setFormData({ ...formData, rankId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择职级" />
                </SelectTrigger>
                <SelectContent>
                  {ranks.map((rank) => {
                    const department = findDepartmentById(departments, formData.departmentId)
                    const isDisabled = department?.minRankId 
                      ? rank.level > ranks.find(r => r.id === department.minRankId)!.level
                      : false
                    
                    return (
                      <SelectItem 
                        key={rank.id} 
                        value={rank.id}
                        disabled={isDisabled}
                      >
                        {rank.name} ({rank.code}级)
                        {isDisabled && ' - 职级不满足部门要求'}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsibilities" className="text-right">
                职责
              </Label>
              <Textarea
                id="responsibilities"
                className="col-span-3"
                value={formData.responsibilities.join('、')}
                onChange={handleTextareaChange}
                placeholder="请输入职责，多个职责用顿号分隔"
              />
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