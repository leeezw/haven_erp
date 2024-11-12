// 基础接口
export interface BaseEntity {
  id: string
  created_at?: Date
  updated_at?: Date
}

// 神仙相关
export interface Deity extends BaseEntity {
  name: string
  title: string
  department_id: string
  rank_id: string
  status: DeityStatus
  join_date: string
  last_promotion_date?: string
}

export interface DeityResponse extends Deity {
  departmentName: string
  rankName: string
  responsibilities: string[]
}

export type DeityStatus = 'active' | 'inactive' | 'suspended' | 'dismissed' | 'blacklisted'

export interface DeityResponsibility extends BaseEntity {
  deity_id: string
  responsibility: string
}

export interface DeityStatusHistory extends BaseEntity {
  deity_id: string
  status: DeityStatus
  reason?: string
}

// 部门相关
export interface Department extends BaseEntity {
  name: string
  code: string
  parent_id: string | null
  level: number
  description: string
  leader_id: string | null
  status: 'active' | 'inactive'
  min_rank_id: string | null
  children?: Department[]
}

// 职级相关
export interface Rank extends BaseEntity {
  code: string
  name: string
  level: number
  description: string
}

// API 响应格式
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    current: number
    pageSize: number
    total: number
  }
}

// 查询参数
export interface QueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  sortField?: string
  sortOrder?: 'ASC' | 'DESC'
  [key: string]: any
}

// 用户相关类型
export interface User {
  id: string
  username: string
  deityId?: string
  deityName?: string
  deityTitle?: string
  roles: string[]
  permissions?: string[]
  status: 'active' | 'inactive'
  lastLogin?: Date
}

export interface LoginResponse {
  user: User
  token: string
}

export interface LoginRequest {
  username: string
  password: string
}

// 权限相关类型
export interface Permission {
  id: string
  code: string
  name: string
  description: string
  type: 'menu' | 'operation'
  parentId?: string
}

export interface Role {
  id: string
  code: string
  name: string
  description: string
  level: number
  permissions: string[]
} 