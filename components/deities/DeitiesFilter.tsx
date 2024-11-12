'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { Department, Rank } from "@/lib/mock-data"

interface DeitiesFilterProps {
  departments: Department[]
  ranks: Rank[]
  onSearch: (filters: {
    keyword: string
    departmentId: string
    rankId: string
    status: string
  }) => void
}

export function DeitiesFilter({ departments, ranks, onSearch }: DeitiesFilterProps) {
  const [filters, setFilters] = useState({
    keyword: '',
    departmentId: '',
    rankId: '',
    status: ''
  })

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters = {
      keyword: '',
      departmentId: '',
      rankId: '',
      status: ''
    }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  return (
    <div className="flex gap-4 items-end bg-white p-6 rounded-lg border shadow-sm">
      <div className="space-y-2 flex-1">
        <label className="text-sm font-medium text-gray-700">关键词搜索</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="搜索神仙姓名、职位或部门" 
            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">部门</label>
        <Select
          value={filters.departmentId}
          onValueChange={(value: string) => setFilters({ ...filters, departmentId: value })}
        >
          <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
            <SelectValue placeholder="选择部门" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">品级</label>
        <Select
          value={filters.rankId}
          onValueChange={(value) => setFilters({ ...filters, rankId: value })}
        >
          <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
            <SelectValue placeholder="选择品级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            {ranks.map((rank) => (
              <SelectItem key={rank.id} value={rank.id}>
                {rank.name} ({rank.code}级)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">状态</label>
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="active">在职</SelectItem>
            <SelectItem value="suspended">停职</SelectItem>
            <SelectItem value="dismissed">撤职</SelectItem>
            <SelectItem value="blacklisted">黑名单</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button size="lg" className="shadow-sm" onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          搜索
        </Button>
        <Button variant="outline" size="lg" className="shadow-sm" onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  )
} 