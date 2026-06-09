import { Navigate, type RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import NotFound from '@/pages/error-page/404'
import ForbiddenPage from '@/pages/error-page/403'
import AuthLayout from '@/layouts/AuthLayout'
import { Role } from '@/apis/types'

const Login = lazy(() => import('@/pages/login'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const UsersAdmin = lazy(() => import('@/pages/users/admin'))
const UsersTeachers = lazy(() => import('@/pages/users/teachers'))
const UsersStudents = lazy(() => import('@/pages/users/students'))
const DictsClasses = lazy(() => import('@/pages/dicts/classes'))
const DictsResearchGroup = lazy(() => import('@/pages/dicts/research-group'))
const DictsSemester = lazy(() => import('@/pages/dicts/semester'))
const DictsSubject = lazy(() => import('@/pages/dicts/subject'))
const Exams = lazy(() => import('@/pages/exams'))
const Scores = lazy(() => import('@/pages/scores'))
const Profile = lazy(() => import('@/pages/profile'))

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
  // ============ Dashboard ============
  {
    path: '/dashboard',
    element: <Dashboard />,
    handle: { title: '仪表盘', auth: true },
  },
  // ============ Users ============
  {
    path: '/users/admin',
    element: <UsersAdmin />,
    handle: { title: '管理员管理', auth: true, roles: [Role.ADMIN] },
  },
  {
    path: '/users/teachers',
    element: <UsersTeachers />,
    handle: { title: '老师管理', auth: true },
  },
  {
    path: '/users/students',
    element: <UsersStudents />,
    handle: { title: '学生管理', auth: true },
  },
  // ============ Dicts ============
  {
    path: '/dicts/classes',
    element: <DictsClasses />,
    handle: { title: '班级字典', auth: true, roles: [Role.ADMIN, Role.TEACHER] },
  },
  {
    path: '/dicts/research-group',
    element: <DictsResearchGroup />,
    handle: { title: '教研组', auth: true, roles: [Role.ADMIN, Role.TEACHER] },
  },
  {
    path: '/dicts/semester',
    element: <DictsSemester />,
    handle: { title: '学期字典', auth: true, roles: [Role.ADMIN, Role.TEACHER] },
  },
  {
    path: '/dicts/subject',
    element: <DictsSubject />,
    handle: { title: '科目字典', auth: true, roles: [Role.ADMIN, Role.TEACHER] },
  },
  // ============ Exams ============
  {
    path: '/exams',
    element: <Exams />,
    handle: { title: '考试管理', auth: true, roles: [Role.ADMIN, Role.TEACHER] },
  },
  // ============ Scores ============
  {
    path: '/scores',
    element: <Scores />,
    handle: { title: '成绩管理', auth: true, roles: [Role.ADMIN, Role.TEACHER, Role.STUDENT] },
  },
  // ============ Profile ============
  {
    path: '/profile',
    element: <Profile />,
    handle: { title: '个人档案', auth: true },
  },
  // ============ Error ============
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
