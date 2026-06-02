import { type ReactNode, useEffect, useState } from 'react'
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
  const { user, getToken } = useAuthStore()
  const { t } = useI18n()

  // 使用 Zustand persist 内置的 hydration 状态，加上超时兜底防止一直卡在初始化
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated())

  useEffect(() => {
    if (hydrated) return

    // 安全超时：3 秒后无论如何都放行，避免一直卡住
    const timeout = setTimeout(() => setHydrated(true), 3000)

    const unsub = useAuthStore.persist.onFinishHydration(() => {
      clearTimeout(timeout)
      setHydrated(true)
    })

    return () => {
      clearTimeout(timeout)
      unsub()
    }
  }, [hydrated])

  const token = getToken()
  const isLogin = Boolean(token)

  // 从当前匹配路由的 handle 获取权限配置
  const matches = useMatches()
  const currentHandle =
    matches.length > 0
      ? (matches[matches.length - 1]?.handle as RouteHandle | undefined)
      : undefined

  // 不需要认证的页面，直接通过
  if (currentHandle?.auth === false) {
    return <>{children}</>
  }

  // 正在初始化（persist rehydration 未完成）
  if (!hydrated) {
    return <FullPageLoading title={t('common.initializingAuth')} />
  }

  // 需要认证但未登录
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />
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
