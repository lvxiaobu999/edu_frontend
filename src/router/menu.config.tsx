import type { ItemType } from 'antd/es/menu/interface'
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  ExperimentOutlined,
  TrophyOutlined,
  IdcardOutlined,
  TeamOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  ReadOutlined,
} from '@ant-design/icons'
import { Role } from '@/apis/types'

export interface MenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  path: string
  roles?: Role[]
  children?: MenuItem[]
}

export const menuConfig: MenuItem[] = [
  // ============ Dashboard ============
  {
    key: '/dashboard',
    label: '仪表盘',
    icon: <DashboardOutlined />,
    path: '/dashboard',
  },
  // ============ Users ============
  {
    key: 'users',
    label: '用户管理',
    icon: <UserOutlined />,
    path: '',
    children: [
      {
        key: '/users/admin',
        label: '管理员',
        icon: <TeamOutlined />,
        path: '/users/admin',
        roles: [Role.ADMIN],
      },
      {
        key: '/users/teachers',
        label: '老师',
        icon: <IdcardOutlined />,
        path: '/users/teachers',
      },
      {
        key: '/users/students',
        label: '学生',
        icon: <UserOutlined />,
        path: '/users/students',
      },
    ],
  },
  // ============ Dicts ============
  {
    key: 'dicts',
    label: '字典管理',
    icon: <BookOutlined />,
    path: '',
    roles: [Role.ADMIN, Role.TEACHER],
    children: [
      {
        key: '/dicts/classes',
        label: '班级',
        icon: <TeamOutlined />,
        path: '/dicts/classes',
        roles: [Role.ADMIN, Role.TEACHER],
      },
      {
        key: '/dicts/research-group',
        label: '教研组',
        icon: <ApartmentOutlined />,
        path: '/dicts/research-group',
        roles: [Role.ADMIN, Role.TEACHER],
      },
      {
        key: '/dicts/semester',
        label: '学期',
        icon: <CalendarOutlined />,
        path: '/dicts/semester',
        roles: [Role.ADMIN, Role.TEACHER],
      },
      {
        key: '/dicts/subject',
        label: '科目',
        icon: <ReadOutlined />,
        path: '/dicts/subject',
        roles: [Role.ADMIN, Role.TEACHER],
      },
    ],
  },
  // ============ Exams ============
  {
    key: '/exams',
    label: '考试管理',
    icon: <ExperimentOutlined />,
    path: '/exams',
    roles: [Role.ADMIN, Role.TEACHER],
  },
  // ============ Scores ============
  {
    key: '/scores',
    label: '成绩管理',
    icon: <TrophyOutlined />,
    path: '/scores',
    roles: [Role.ADMIN, Role.TEACHER, Role.STUDENT],
  },
  // ============ Profile ============
  {
    key: '/profile',
    label: '个人档案',
    icon: <IdcardOutlined />,
    path: '/profile',
  },
]

/** 获取当前角色可见的菜单项 */
export function getVisibleMenus(role?: string): ItemType[] {
  if (!role) return menuConfig.filter(item => !item.roles) as unknown as ItemType[]

  return menuConfig
    .filter(item => !item.roles || item.roles.includes(role as Role))
    .map(item => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(
            child => !child.roles || child.roles.includes(role as Role),
          ),
        }
      }
      return item
    })
    .filter(item => {
      if (item.children) {
        return item.children.length > 0
      }
      return true
    }) as unknown as ItemType[]
}
