export interface Rank {
  id: string
  code: string  // S, A, B, C
  name: string  // 天仙, 金仙, 真仙, 地仙
  level: number // 1-4
  description: string
}

export const ranks: Rank[] = [
  {
    id: '1',
    code: 'S',
    name: '天仙',
    level: 1,
    description: '天庭最高级别仙职'
  },
  {
    id: '2',
    code: 'A',
    name: '金仙',
    level: 2,
    description: '天庭高级仙职'
  },
  {
    id: '3',
    code: 'B',
    name: '真仙',
    level: 3,
    description: '天庭中级仙职'
  },
  {
    id: '4',
    code: 'C',
    name: '地仙',
    level: 4,
    description: '天庭初级仙职'
  }
]

export interface Department {
  id: string
  name: string
  code: string
  parentId: string | null
  level: number
  description: string
  leaderId: string | null
  status: 'active' | 'inactive'
  children?: Department[]
  minRankId?: string
}

export const departments: Department[] = [
  // 核心决策机构
  {
    id: '1',
    name: '御前殿',
    code: 'YQD',
    parentId: null,
    level: 1,
    description: '天庭最高决策机构',
    leaderId: '1', // 玉皇大帝
    status: 'active',
    minRankId: '1',
    children: [
      {
        id: '1-1',
        name: '玉帝秘书部',
        code: 'YQD-MSB',
        parentId: '1',
        level: 2,
        description: '协助玉帝处理日常事务的智囊团',
        leaderId: '11', // 张道陵天师
        status: 'active',
        minRankId: '1'
      },
      {
        id: '1-2',
        name: '兜率宫',
        code: 'YQD-DSG',
        parentId: '1',
        level: 2,
        description: '太上老君炼丹处',
        leaderId: '2', // 太上老君
        status: 'active',
        minRankId: '1'
      }
    ]
  },
  // 行政管理部门
  {
    id: '2',
    name: '天庭行政部',
    code: 'TXB',
    parentId: null,
    level: 1,
    description: '负责天庭日常行政事务',
    leaderId: '3', // 王母娘娘
    status: 'active',
    minRankId: '1',
    children: [
      {
        id: '2-1',
        name: '蟠桃园',
        code: 'TXB-PTY',
        parentId: '2',
        level: 2,
        description: '王母娘娘的蟠桃园',
        leaderId: '12', // 董双成
        status: 'active',
        minRankId: '2'
      },
      {
        id: '2-2',
        name: '凌霄宝殿',
        code: 'TXB-LXBD',
        parentId: '2',
        level: 2,
        description: '天庭会议厅',
        leaderId: '13', // 太白金星
        status: 'active',
        minRankId: '2'
      }
    ]
  },
  // 军事部门
  {
    id: '3',
    name: '天庭国防部',
    code: 'TGB',
    parentId: null,
    level: 1,
    description: '负责天庭军事防务',
    leaderId: '4', // 托塔天王李靖
    status: 'active',
    minRankId: '1',
    children: [
      {
        id: '3-1',
        name: '天王殿',
        code: 'TGB-TWD',
        parentId: '3',
        level: 2,
        description: '四大天王驻地',
        leaderId: '14', // 魔礼青
        status: 'active',
        minRankId: '2'
      },
      {
        id: '3-2',
        name: '天兵营',
        code: 'TGB-TBY',
        parentId: '3',
        level: 2,
        description: '天兵驻地',
        leaderId: '5', // 二郎神
        status: 'active',
        minRankId: '2'
      },
      {
        id: '3-3',
        name: '天将营',
        code: 'TGB-TJY',
        parentId: '3',
        level: 2,
        description: '天将驻地',
        leaderId: '6', // 哪吒
        status: 'active',
        minRankId: '2'
      }
    ]
  },
  // 民政部门
  {
    id: '4',
    name: '天庭民政部',
    code: 'TMB',
    parentId: null,
    level: 1,
    description: '管理人间婚姻、生育等民生事务',
    leaderId: '15', // 月老
    status: 'active',
    minRankId: '1',
    children: [
      {
        id: '4-1',
        name: '姻缘殿',
        code: 'TMB-YYD',
        parentId: '4',
        level: 2,
        description: '管理人间姻缘',
        leaderId: '15', // 月老
        status: 'active',
        minRankId: '2'
      },
      {
        id: '4-2',
        name: '子孙堂',
        code: 'TMB-ZST',
        parentId: '4',
        level: 2,
        description: '管理人间生育',
        leaderId: '16', // 送子娘娘
        status: 'active',
        minRankId: '2'
      }
    ]
  },
  // 户籍管理
  {
    id: '5',
    name: '天庭户籍部',
    code: 'THB',
    parentId: null,
    level: 1,
    description: '管理三界生死簿、功德簿等',
    leaderId: '17', // 东岳大帝
    status: 'active',
    minRankId: '1',
    children: [
      {
        id: '5-1',
        name: '生死司',
        code: 'THB-SSS',
        parentId: '5',
        level: 2,
        description: '管理生死簿',
        leaderId: '18', // 阎罗王
        status: 'active',
        minRankId: '2'
      },
      {
        id: '5-2',
        name: '功德司',
        code: 'THB-GDS',
        parentId: '5',
        level: 2,
        description: '管理功德簿',
        leaderId: '19', // 文昌帝君
        status: 'active',
        minRankId: '2'
      }
    ]
  },
  // 气象管理
  {
    id: '6',
    name: '天庭气象部',
    code: 'TQB',
    parentId: null,
    level: 1,
    description: '管理风雨雷电等天象',
    leaderId: '20', // 雷公
    status: 'active',
    minRankId: '1',
    children: [
      {
        id: '6-1',
        name: '雷部',
        code: 'TQB-LB',
        parentId: '6',
        level: 2,
        description: '管理雷电',
        leaderId: '20', // 雷公
        status: 'active',
        minRankId: '2'
      },
      {
        id: '6-2',
        name: '风部',
        code: 'TQB-FB',
        parentId: '6',
        level: 2,
        description: '管理风',
        leaderId: '21', // 风婆
        status: 'active',
        minRankId: '2'
      },
      {
        id: '6-3',
        name: '雨部',
        code: 'TQB-YB',
        parentId: '6',
        level: 2,
        description: '管理雨水',
        leaderId: '22', // 雨师
        status: 'active',
        minRankId: '2'
      }
    ]
  },
  // ... 继续添加其他部门
]

export interface Deity {
  id: string
  name: string
  title: string
  departmentId: string
  rankId: string
  status: 'active' | 'inactive' | 'suspended' | 'dismissed'
  responsibilities: string[]
  joinDate: string
  lastPromotionDate?: string
}

export const deities: Deity[] = [
  // 最高领导层
  {
    id: '1',
    name: '玉皇大帝',
    title: '天帝',
    departmentId: '1',
    rankId: '1',
    status: 'active',
    responsibilities: ['统管三界', '审阅奏章', '任命神职'],
    joinDate: '0000-01-01'
  },
  {
    id: '2',
    name: '太上老君',
    title: '道德天尊',
    departmentId: '1-2',
    rankId: '1',
    status: 'active',
    responsibilities: ['炼制仙丹', '传授道法', '化解危机'],
    joinDate: '0000-01-02'
  },
  {
    id: '3',
    name: '王母娘娘',
    title: '天后',
    departmentId: '2',
    rankId: '1',
    status: 'active',
    responsibilities: ['管理行政', '主持蟠桃会', '调解纷争'],
    joinDate: '0000-01-03'
  },
  // 军事将领
  {
    id: '4',
    name: '托塔天王',
    title: '李靖',
    departmentId: '3',
    rankId: '1',
    status: 'active',
    responsibilities: ['统领天兵', '镇守天门', '平定叛乱'],
    joinDate: '0000-02-01'
  },
  {
    id: '5',
    name: '二郎神',
    title: '杨戬',
    departmentId: '3-2',
    rankId: '1',
    status: 'active',
    responsibilities: ['巡查三界', '降妖除魔', '处理突发事件'],
    joinDate: '0000-02-02'
  },
  {
    id: '6',
    name: '哪吒',
    title: '三太子',
    departmentId: '3-3',
    rankId: '2',
    status: 'active',
    responsibilities: ['协助巡查', '支援行动', '处理突发事件'],
    joinDate: '0000-02-03'
  },
  // ... 继续添加其他神仙
]

export function findDepartmentById(departments: Department[], id: string): Department | null {
  for (const dept of departments) {
    if (dept.id === id) return dept
    if (dept.children) {
      const found = findDepartmentById(dept.children, id)
      if (found) return found
    }
  }
  return null
}

export function findDeityById(deities: Deity[], id: string): Deity | null {
  return deities.find(deity => deity.id === id) || null
}

export function findRankById(ranks: Rank[], id: string): Rank | null {
  return ranks.find(rank => rank.id === id) || null
}

export function getDepartmentName(departments: Department[], id: string): string {
  const dept = findDepartmentById(departments, id)
  return dept ? dept.name : ''
}

export function getRankName(rankId: string): string {
  const rank = ranks.find(r => r.id === rankId)
  return rank ? `${rank.name} (${rank.code}级)` : ''
}

export function getAvailableLeaders(deities: Deity[], minRankId: string): Deity[] {
  const minRank = ranks.find(r => r.id === minRankId)
  if (!minRank) return []
  return deities.filter(deity => {
    const deityRank = ranks.find(r => r.id === deity.rankId)
    return deityRank && deityRank.level <= minRank.level && deity.status === 'active'
  })
}

export function getDepartmentPath(departments: Department[], departmentId: string): string {
  const department = findDepartmentById(departments, departmentId)
  if (!department) return ''

  const path: string[] = [department.name]
  let current = department
  while (current.parentId) {
    const parent = findDepartmentById(departments, current.parentId)
    if (!parent) break
    path.unshift(parent.name)
    current = parent
  }
  return path.join(' / ')
}

// 权限定义
export interface Permission {
  id: string
  code: string        // 权限代码
  name: string        // 权限名称
  description: string // 权限描述
  type: 'menu' | 'operation' // 权限类型：菜单权限或操作权限
  parentId?: string   // 父权限ID
}

// 角色定义
export interface Role {
  id: string
  code: string        // 角色代码
  name: string        // 角色名称
  description: string // 角色描述
  permissions: string[] // 权限ID列表
  level: number      // 角色级别，用于判断权限继承
}

// 用户定义
export interface User {
  id: string
  username: string
  password: string    // 实际应用中应该是加密的
  deityId?: string    // 关联的神仙ID
  roles: string[]     // 角色ID列表
  status: 'active' | 'inactive'
  lastLogin?: string
}

// 预定义权限
export const permissions: Permission[] = [
  // 菜单权限
  {
    id: 'menu-dashboard',
    code: 'dashboard',
    name: '仪表盘',
    description: '查看系统仪表盘',
    type: 'menu'
  },
  {
    id: 'menu-deities',
    code: 'deities',
    name: '神仙管理',
    description: '访问神仙管理模块',
    type: 'menu'
  },
  {
    id: 'menu-departments',
    code: 'departments',
    name: '部门管理',
    description: '访问部门管理模块',
    type: 'menu'
  },
  
  // 神仙管理操作权限
  {
    id: 'deity-create',
    code: 'deity:create',
    name: '新增神仙',
    description: '创建新的神仙记录',
    type: 'operation',
    parentId: 'menu-deities'
  },
  {
    id: 'deity-edit',
    code: 'deity:edit',
    name: '编辑神仙',
    description: '修改现有神仙信息',
    type: 'operation',
    parentId: 'menu-deities'
  },
  {
    id: 'deity-status',
    code: 'deity:status',
    name: '变更神仙状态',
    description: '变更神仙的在职状态',
    type: 'operation',
    parentId: 'menu-deities'
  },
  
  // 部门管理操作权限
  {
    id: 'department-create',
    code: 'department:create',
    name: '新增部门',
    description: '创建新的部门',
    type: 'operation',
    parentId: 'menu-departments'
  },
  {
    id: 'department-edit',
    code: 'department:edit',
    name: '编辑部门',
    description: '修改现有部门信息',
    type: 'operation',
    parentId: 'menu-departments'
  },
  {
    id: 'department-status',
    code: 'department:status',
    name: '变更部门状态',
    description: '启用/停用部门',
    type: 'operation',
    parentId: 'menu-departments'
  },
  
  // 权限管理操作权限
  {
    id: 'menu-permissions',
    code: 'permissions',
    name: '权限管理',
    description: '访问权限管理模块',
    type: 'menu'
  },
  {
    id: 'permission-edit',
    code: 'permission:edit',
    name: '编辑权限',
    description: '修改权限配置',
    type: 'operation',
    parentId: 'menu-permissions'
  },
  {
    id: 'role-edit',
    code: 'role:edit',
    name: '编辑角色',
    description: '修改角色配置',
    type: 'operation',
    parentId: 'menu-permissions'
  }
]

// 预定义角色
export const roles: Role[] = [
  {
    id: 'role-admin',
    code: 'admin',
    name: '系统管理员',
    description: '拥有系统所有权限',
    permissions: permissions.map(p => p.id),
    level: 0
  },
  {
    id: 'role-manager',
    code: 'manager',
    name: '部门管理员',
    description: '管理部门和神仙',
    permissions: [
      'menu-dashboard',
      'menu-deities',
      'menu-departments',
      'deity-edit',
      'deity-status',
      'department-edit'
    ],
    level: 1
  },
  {
    id: 'role-user',
    code: 'user',
    name: '普通用户',
    description: '基础查看权限',
    permissions: [
      'menu-dashboard',
      'menu-deities',
      'menu-departments'
    ],
    level: 2
  }
]

// 预定义用户
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin',  // 实际应用中应该是加密的
    roles: ['role-admin'],
    status: 'active'
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager',
    deityId: '2',  // 太白金星
    roles: ['role-manager'],
    status: 'active'
  },
  {
    id: '3',
    username: 'user',
    password: 'user',
    deityId: '3',  // 托塔天王
    roles: ['role-user'],
    status: 'active'
  }
]

// 权限检查工具函数
export function hasPermission(user: User, permissionCode: string): boolean {
  // 获取用户的所有角色
  const userRoles = roles.filter(role => user.roles.includes(role.id))
  
  // 获取这些角色的所有权限
  const userPermissions = userRoles.flatMap(role => role.permissions)
  
  // 查找权限代码对应的权限ID
  const permission = permissions.find(p => p.code === permissionCode)
  if (!permission) return false
  
  return userPermissions.includes(permission.id)
}

// 获取用户菜单权限
export function getUserMenus(user: User): Permission[] {
  // 获取用户的所有角色
  const userRoles = roles.filter(role => user.roles.includes(role.id))
  
  // 获取这些角色的所有权限ID
  const userPermissions = userRoles.flatMap(role => role.permissions)
  
  // 返回菜单类型的权限
  return permissions.filter(p => 
    p.type === 'menu' && userPermissions.includes(p.id)
  )
}

// 获取用户操作权限
export function getUserOperations(user: User, menuCode: string): Permission[] {
  // 获取用户的所有角色
  const userRoles = roles.filter(role => user.roles.includes(role.id))
  
  // 获取这些角色的所有权限ID
  const userPermissions = userRoles.flatMap(role => role.permissions)
  
  // 获取菜单ID
  const menuPermission = permissions.find(p => p.code === menuCode)
  if (!menuPermission) return []
  
  // 返回该菜单下的操作权限
  return permissions.filter(p => 
    p.type === 'operation' && 
    p.parentId === menuPermission.id && 
    userPermissions.includes(p.id)
  )
}