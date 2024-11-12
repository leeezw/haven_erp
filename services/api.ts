import axios from 'axios'
import { toast } from '@/components/ui/use-toast'
import { Deity, Department, Rank, PaginatedResponse, User, LoginResponse, LoginRequest, Permission, Role } from '@/types'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

// 添加响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    // 处理错误响应
    const errorMessage = error.response?.data?.error || error.message || '操作失败'
    
    // 如果是登录接口的错误，不显示 toast，而是返回错误让组件处理
    if (error.config.url === '/auth/login') {
      return Promise.reject(new Error('用户名或密码错误'))
    }

    // 如果是 401 未授权错误，重定向到登录页
    if (error.response?.status === 401) {
      window.location.href = '/login'
      return Promise.reject(new Error('请重新登录'))
    }

    // 其他错误显示 toast 提示
    toast({
      title: "操作失败",
      description: errorMessage,
      variant: "destructive"
    })

    return Promise.reject(new Error(errorMessage))
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
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { username, password })
      return data
    } catch (error) {
      // 登录失败时返回 null，而不是抛出错误
      return null
    }
  },

  // 登出
  logout: async () => {
    try {
      const { data } = await api.post('/auth/logout')
      return data
    } catch (error) {
      // 登出失败时返回 false
      return false
    }
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    try {
      const { data } = await api.get<User>('/auth/me')
      return data
    } catch (error) {
      // 获取用户信息失败时返回 null
      return null
    }
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