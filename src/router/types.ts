import type { RouteObject } from 'react-router-dom'

export interface RouteHandle {
  title: string
  icon?: React.ReactNode
  hidden?: boolean
  roles?: string[]
  auth?: boolean
  [key: string]: any
}

export type AppRouteObject = RouteObject & {
  handle?: RouteHandle
  children?: AppRouteObject[]
}
