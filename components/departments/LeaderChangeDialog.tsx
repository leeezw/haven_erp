'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Department, deities, getAvailableLeaders, findDeityById } from "@/lib/mock-data"

interface LeaderChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department: Department | null
  onSubmit: (departmentId: string, leaderId: string) => void
}

export function LeaderChangeDialog({
  open,
  onOpenChange,
  department,
  onSubmit
}: LeaderChangeDialogProps) {
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (department && selectedLeaderId) {
      onSubmit(department.id, selectedLeaderId)
      onOpenChange(false)
      setSelectedLeaderId('')
    }
  }

  const availableLeaders = department ? getAvailableLeaders(deities, department.minRankId || '') : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>更换部门负责人</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">部门</Label>
              <div className="col-span-3">
                <span className="text-gray-700">{department?.name}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">当前负责人</Label>
              <div className="col-span-3">
                <span className="text-gray-700">
                  {department?.leaderId ? findDeityById(deities, department.leaderId)?.name || '未设置' : '未设置'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">新负责人</Label>
              <div className="col-span-3">
                <Select
                  value={selectedLeaderId || "none"}
                  onValueChange={(value) => setSelectedLeaderId(value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择新负责人" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">暂不设置</SelectItem>
                    {availableLeaders.map((leader) => (
                      <SelectItem key={leader.id} value={leader.id}>
                        {leader.name} ({leader.title})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={!selectedLeaderId}>确定</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 