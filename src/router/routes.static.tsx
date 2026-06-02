import { Navigate, type RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import NotFound from '@/pages/error-page/404'
import ForbiddenPage from '@/pages/error-page/403'
import AuthLayout from '@/layouts/AuthLayout'
import { Role } from '@/apis/types'

const Login = lazy(() => import('@/pages/login'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const UserManagement = lazy(() => import('@/pages/user'))
const TeacherProfile = lazy(() => import('@/pages/teacher'))
const StudentProfile = lazy(() => import('@/pages/student'))
const ResearchGroup = lazy(() => import('@/pages/research-group'))
const ClassesManagement = lazy(() => import('@/pages/classes'))

export const publicRoutes: RouteObject[] = [
  {
    path: '',
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
        handle: { title: '登录', auth: false },
      },
    ],
  },
]

export const protectedRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    handle: { title: '仪表盘', auth: true },
  },
  {
    path: '/user',
    element: <UserManagement />,
    handle: { title: '用户管理', auth: true, roles: [Role.ADMIN] },
  },
  {
    path: '/teacher',
    element: <TeacherProfile />,
    handle: { title: '教师简介', auth: true },
  },
  {
    path: '/student',
    element: <StudentProfile />,
    handle: { title: '学生简介', auth: true },
  },
  {
    path: '/classes',
    element: <ClassesManagement />,
    handle: { title: '班级管理', auth: true, roles: [Role.ADMIN, Role.TEACHER] },
  },
  {
    path: '/research-group',
    element: <ResearchGroup />,
    handle: { title: '教研组', auth: true, roles: [Role.ADMIN, Role.TEACHER] },
  },
  {
    path: '/403',
    element: <ForbiddenPage />,
    handle: { title: '403', auth: false },
  },
  {
    path: '*',
    element: <NotFound />,
    handle: { title: '404', auth: false },
  },
]
