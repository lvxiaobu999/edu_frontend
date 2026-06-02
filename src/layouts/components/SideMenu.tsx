import React, { useMemo, useState } from 'react'
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { useAuthStore, useThemeStore } from '@/store'
import '../styles/menu.reset.less'
import { getVisibleMenus } from '@/router/menu.config'

const getParentKeys = (items: MenuProps['items'], targetKey: string): string[] => {
  const result: string[] = []
  const traverse = (data: MenuProps['items'], parents: string[]): boolean => {
    if (!data) return false
    for (const item of data) {
      if (!item) continue
      if (item.key === targetKey) {
        result.push(...parents)
        return true
      }
      if ('children' in item && item.children && item.children.length > 0) {
        if (traverse(item.children as MenuProps['items'], [...parents, item.key as string])) {
          return true
        }
      }
    }
    return false
  }
  traverse(items, [])
  return result
}

const SideMenu: React.FC = () => {
  const { isDark } = useThemeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey = location.pathname
  const userRole = user?.role

  const visibleMenus = useMemo(() => getVisibleMenus(userRole), [userRole])

  const defaultOpenKeys = useMemo(
    () => getParentKeys(visibleMenus, selectedKey),
    [visibleMenus, selectedKey],
  )

  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys)

  const onClick: MenuProps['onClick'] = e => {
    navigate(e.key)
  }

  return (
    <div className={['side-menu-container', isDark ? 'side-menu-dark' : ''].join(' ')}>
      <Menu
        mode="inline"
        theme="light"
        style={{ height: '100%', borderRight: 0 }}
        selectedKeys={[selectedKey]}
        defaultOpenKeys={defaultOpenKeys}
        openKeys={openKeys}
        onOpenChange={keys => setOpenKeys(keys)}
        items={visibleMenus}
        onClick={onClick}
      />
    </div>
  )
}

export default SideMenu
