'use client'

import { useEffect, useState } from 'react'
import DeitiesTable from '@/components/deities/DeitiesTable'
import { DeitiesFilter } from '@/components/deities/DeitiesFilter'
import { DeityDialog } from '@/components/deities/DeityDialog'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { PermissionGuard } from '@/components/auth/PermissionGuard'
import { deityApi, departmentApi, rankApi } from '@/services/api'
import { Deity, Department, Rank } from '@/types'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function DeitiesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDeity, setEditingDeity] = useState<Deity | null>(null)
  const [deitiesList, setDeitiesList] = useState<Deity[]>([])
  const [departmentsList, setDepartmentsList] = useState<Department[]>([])
  const [ranksList, setRanksList] = useState<Rank[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  const loadData = async (page = 1, filters = {}) => {
    try {
      setIsLoading(true)
      
      const [deitiesResponse, departments, ranks] = await Promise.all([
        deityApi.getList({ page, pageSize: pagination.pageSize, ...filters }),
        departmentApi.getList(),
        rankApi.getList()
      ])

      setDeitiesList(deitiesResponse.data)
      setPagination(deitiesResponse.pagination)
      setDepartmentsList(departments)
      setRanksList(ranks)
    } catch (error) {
      console.error('Error loading data:', error)
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
    loadData()
  }, [])

  const handleSearch = (filters: {
    keyword: string
    departmentId: string
    rankId: string
    status: string
  }) => {
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value && value !== 'all')
    )
    loadData(1, validFilters)
  }

  const handleSubmit = async (formData: Partial<Deity>) => {
    try {
      const savedDeity = editingDeity
        ? await deityApi.update(editingDeity.id, formData)
        : await deityApi.create(formData)

      setDeitiesList(prev => 
        editingDeity
          ? prev.map(deity => deity.id === editingDeity.id ? savedDeity : deity)
          : [...prev, savedDeity]
      )

      toast({
        title: editingDeity ? "神仙信息更新成功" : "新神仙添加成功",
        description: `${savedDeity.name} ${editingDeity ? '的信息已更新' : '已加入天庭'}`
      })

      setDialogOpen(false)
      setEditingDeity(null)
      loadData(pagination.current) // 重新加载当前页
    } catch (error) {
      toast({
        title: editingDeity ? "更新失败" : "添加失败",
        description: error instanceof Error ? error.message : '操作失败',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = async (deity: Deity) => {
    try {
      // 获取完整的神仙信息
      const response = await fetch(`/api/deities/${deity.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch deity details')
      }
      const deityDetails = await response.json()
      
      // 设置编辑状态并打开对话框
      setEditingDeity(deityDetails)
      setDialogOpen(true)
    } catch (error) {
      console.error('Error fetching deity details:', error)
      toast({
        title: "获取神仙信息失败",
        description: error instanceof Error ? error.message : '获取数据时发生错误',
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">加载中...</h3>
          <p className="mt-2 text-sm text-gray-500">
            正在获取数据，请稍候
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">神仙管理</h2>
          <p className="mt-2 text-sm text-gray-500">管理天庭所有神仙的职位、品级及任职状态</p>
        </div>
        <PermissionGuard permissionCode="deity:create">
          <Button size="lg" className="shadow-sm" onClick={() => {
            setEditingDeity(null)
            setDialogOpen(true)
          }}>
            <PlusCircle className="mr-2 h-5 w-5" />
            新增神仙
          </Button>
        </PermissionGuard>
      </div>
      
      <DeitiesFilter 
        departments={departmentsList}
        ranks={ranksList}
        onSearch={handleSearch}
      />
      
      <DeitiesTable 
        data={deitiesList}
        onEdit={handleEdit}
        onStatusChange={async (id, status) => {
          try {
            const updatedDeity = await deityApi.updateStatus(id, status)
            setDeitiesList(deitiesList.map(deity =>
              deity.id === id ? updatedDeity : deity
            ))
            toast({
              title: "状态更新成功",
              description: `${updatedDeity.name} 的状态已更新为 ${status}`
            })
            
            // 重新加载当前页数据
            loadData(pagination.current)
          } catch (error) {
            toast({
              title: "状态更新失败",
              description: error instanceof Error ? error.message : '更新失败',
              variant: 'destructive'
            })
          }
        }}
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          共 {pagination.total} 条记录
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
              />
            </PaginationItem>
            {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }).map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => handlePageChange(i + 1)}
                  isActive={pagination.current === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === Math.ceil(pagination.total / pagination.pageSize)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <DeityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingDeity}
        onSubmit={handleSubmit}
      />
    </div>
  )
} 