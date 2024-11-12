import axios from 'axios'
import { Deity, Department, Rank, PaginatedResponse, User, LoginResponse, LoginRequest, Permission, Role } from '@/types'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

// 添加响应拦截器
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // 如果是登录接口返回 401，直接抛出错误
      if (error.config.url === '/auth/login') {
        throw error
      }
      
      // 其他接口返回 401，重定向到登录页
      window.location.href = '/login'
    }
    throw error
  }
)

// 神仙相关 API
export const deityApi = {
  // 获取神仙列表
  getList: async (params: {
    page?: number
    pageSize?: number
    keyword?: string
    departmentId?: string
    rankId?: string
    status?: string
    sortField?: string
    sortOrder?: 'ASC' | 'DESC'
  }) => {
    const { data } = await api.get<PaginatedResponse<Deity[]>>('/deities', { params })
    return data
  },

  // 创建神仙
  create: async (deity: Partial<Deity>) => {
    const { data } = await api.post<Deity>('/deities', deity)
    return data
  },

  // 更新神仙
  update: async (id: string, deity: Partial<Deity>) => {
    const { data } = await api.put<Deity>(`/deities/${id}`, deity)
    return data
  },

  // 更新神仙状态
  updateStatus: async (id: string, status: string) => {
    const { data } = await api.put<Deity>(`/deities/${id}/status`, { status })
    return data
  }
}

// 部门相关 API
export const departmentApi = {
  // 获取部门列表
  getList: async (params?: { tree?: boolean }) => {
    const { data } = await api.get<Department[]>('/departments', { params })
    return data
  },

  // 创建部门
  create: async (department: Partial<Department>) => {
    const { data } = await api.post<Department>('/departments', department)
    return data
  },

  // 更新部门
  update: async (id: string, department: Partial<Department>) => {
    const { data } = await api.put<Department>(`/departments/${id}`, department)
    return data
  },

  // 更新部门负责人
  updateLeader: async (id: string, leaderId: string) => {
    const { data } = await api.put<Department>(`/departments/${id}/leader`, { leaderId })
    return data
  },

  // 更新部门状态
  updateStatus: async (id: string, status: 'active' | 'inactive') => {
    const { data } = await api.put<Department>(`/departments/${id}/status`, { status })
    return data
  }
}

// 职级相关 API
export const rankApi = {
  // 获取职级列表
  getList: async () => {
    const { data } = await api.get<Rank[]>('/ranks')
    return data
  }
}

// 认证相关 API
export const authApi = {
  // 登录
  login: async (username: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/auth/login', { username, password })
    return data
  },

  // 登出
  logout: async () => {
    const { data } = await api.post('/auth/logout')
    return data
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    const { data } = await api.get<User>('/auth/me')
    return data
  },

  // 获取用户权限
  getUserPermissions: async () => {
    const { data } = await api.get<Permission[]>('/auth/permissions')
    return data
  },

  // 获取用户菜单
  getUserMenus: async () => {
    const { data } = await api.get<Permission[]>('/auth/menus')
    return data
  }
}

// 角色相关 API
export const roleApi = {
  // 获取角色列表
  getList: async () => {
    const { data } = await api.get<Role[]>('/roles')
    return data
  },

  // 创建角色
  create: async (role: Partial<Role>) => {
    const { data } = await api.post<Role>('/roles', role)
    return data
  },

  // 更新角色
  update: async (id: string, role: Partial<Role>) => {
    const { data } = await api.put<Role>(`/roles/${id}`, role)
    return data
  },

  // 删除角色
  delete: async (id: string) => {
    const { data } = await api.delete(`/roles/${id}`)
    return data
  }
}

// 权限相关 API
export const permissionApi = {
  // 获取权限列表
  getList: async () => {
    const { data } = await api.get<Permission[]>('/permissions')
    return data
  },

  // 获取菜单权限
  getMenus: async () => {
    const { data } = await api.get<Permission[]>('/permissions/menus')
    return data
  },

  // 获取操作权限
  getOperations: async (menuCode: string) => {
    const { data } = await api.get<Permission[]>(`/permissions/operations/${menuCode}`)
    return data
  }
} 