import { createBrowserRouter } from 'react-router-dom'
import { publicRoutes, protectedRoutes } from './routes.static'
import AppLayout from '@/layouts/AppLayout'
import { AuthGuard } from './components/AuthGuard'
import FullPageLoading from '@/components/FullPageLoading'

const router = createBrowserRouter([
  ...publicRoutes,
  {
    path: '/',
    HydrateFallback: () => <FullPageLoading title="正在加载页面..." />,
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: protectedRoutes,
  },
])

export default router
