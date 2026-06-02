import type { ReactNode } from 'react'
import FullPageLoading from '@/components/FullPageLoading'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store'
import { Navigate, useLocation, useMatches } from 'react-router-dom'
import type { RouteHandle } from '../types'

interface AuthGuardProps {
  children: ReactNode
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation()
  const { isInitialized, user, getToken } = useAuthStore()
  const { t } = useI18n()

  const token = getToken()
  const isLogin = Boolean(token)

  // 从当前匹配路由的 handle 获取权限配置
  const matches = useMatches()
  const currentHandle = matches.length > 0 ? (matches[matches.length - 1]?.handle as RouteHandle | undefined) : undefined

  // 不需要认证的页面且已经登录，直接通过
  if (currentHandle?.auth === false) {
    return <>{children}</>
  }

  // 需要认证但未登录
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 正在初始化
  if (!isInitialized) {
    return <FullPageLoading title={t('common.initializingAuth')} />
  }

  // 角色权限检查
  const userRole = user?.role
  if (currentHandle?.roles && currentHandle.roles.length > 0) {
    if (!userRole || !currentHandle.roles.includes(userRole)) {
      return <Navigate to="/403" replace />
    }
  }

  return <>{children}</>
}
