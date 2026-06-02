import type { ItemType } from 'antd/es/menu/interface'
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  IdcardOutlined,
  SolutionOutlined,
  BankOutlined,
  ApartmentOutlined,
} from '@ant-design/icons'
import { Role } from '@/apis/types'

export interface StaticMenuItem extends ItemType {
  path: string
  roles?: Role[]
}

export const menuConfig: StaticMenuItem[] = [
  {
    key: '/dashboard',
    label: '仪表盘',
    icon: <DashboardOutlined />,
    path: '/dashboard',
  },
  {
    key: 'management',
    label: '系统管理',
    icon: <TeamOutlined />,
    path: '',
    children: [
      {
        key: '/user',
        label: '用户管理',
        icon: <UserOutlined />,
        path: '/user',
        roles: [Role.ADMIN],
      },
      {
        key: '/teacher',
        label: '教师简介',
        icon: <IdcardOutlined />,
        path: '/teacher',
      },
      {
        key: '/student',
        label: '学生简介',
        icon: <SolutionOutlined />,
        path: '/student',
      },
      {
        key: '/classes',
        label: '班级管理',
        icon: <BankOutlined />,
        path: '/classes',
        roles: [Role.ADMIN, Role.TEACHER],
      },
      {
        key: '/research-group',
        label: '教研组',
        icon: <ApartmentOutlined />,
        path: '/research-group',
        roles: [Role.ADMIN, Role.TEACHER],
      },
    ],
  },
]

/** 获取当前角色可见的菜单项 */
export function getVisibleMenus(role?: string): ItemType[] {
  if (!role) return menuConfig.filter(item => !item.roles)

  return menuConfig
    .filter(item => !item.roles || item.roles.includes(role as Role))
    .map(item => {
      if (item.children) {
        return {
          ...item,
          children: (item.children as StaticMenuItem[]).filter(
            child => !child.roles || child.roles.includes(role as Role),
          ),
        }
      }
      return item
    })
    .filter(item => {
      if (item.children) {
        return (item.children as StaticMenuItem[]).length > 0
      }
      return true
    })
}
