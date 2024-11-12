'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { permissions, Role } from '@/lib/mock-data'

interface RoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Role | null
}

export function RoleDialog({
  open,
  onOpenChange,
  initialData
}: RoleDialogProps) {
  const [formData, setFormData] = useState<Partial<Role>>(
    initialData || {
      name: '',
      code: '',
      description: '',
      permissions: [],
      level: 0
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 处理提交逻辑
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? '编辑角色' : '新增角色'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">角色名称</Label>
              <Input
                id="name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">角色代码</Label>
              <Input
                id="code"
                className="col-span-3"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
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
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right pt-2">权限配置</Label>
              <div className="col-span-3 space-y-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions?.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            permissions: [...(formData.permissions || []), permission.id]
                          })
                        } else {
                          setFormData({
                            ...formData,
                            permissions: formData.permissions?.filter(id => id !== permission.id)
                          })
                        }
                      }}
                    />
                    <label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.name}
                      <span className="text-gray-500 text-xs ml-2">({permission.code})</span>
                    </label>
                  </div>
                ))}
              </div>
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