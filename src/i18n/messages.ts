import type { Locale } from '@/store/modules/useLocaleStore'

export const zhCNMessages = {
  common: {
    login: '登录',
    logout: '退出登录',
    goLogin: '去登录',
    register: '去注册',
    loadingApp: '正在加载应用，请稍候...',
    loading: '正在加载，请稍候...',
    initializingAuth: '正在初始化系统权限...',
    language: '语言',
    chinese: '中文',
    english: 'English',
  },
  login: {
    welcomeBack: '欢迎回来',
    accountPassword: '账号密码登录',
    rememberPassword: '记住密码',
    pleaseEnterUsername: '请输入用户名',
    pleaseEnterPassword: '请输入密码',
    loginSuccess: '欢迎回来，{username}！',
  },
  user: {
    profileAria: '打开用户菜单',
  },
  dashboard: {
    title: '仪表盘',
  },
  userManagement: {
    title: '用户管理',
  },
  teacher: {
    title: '教师简介',
  },
  student: {
    title: '学生简介',
  },
  classes: {
    title: '班级管理',
  },
  researchGroup: {
    title: '教研组管理',
  },
} as const

type DeepString<T> = {
  [K in keyof T]: T[K] extends object ? DeepString<T[K]> : string
}

type MessageSchema = DeepString<typeof zhCNMessages>

export const enUSMessages: MessageSchema = {
  common: {
    login: 'Login',
    logout: 'Log out',
    goLogin: 'Go to login',
    register: 'Register',
    loadingApp: 'Loading application, please wait...',
    loading: 'Loading, please wait...',
    initializingAuth: 'Initializing permissions...',
    language: 'Language',
    chinese: '中文',
    english: 'English',
  },
  login: {
    welcomeBack: 'Welcome back',
    accountPassword: 'Password Login',
    rememberPassword: 'Remember password',
    pleaseEnterUsername: 'Please enter your username',
    pleaseEnterPassword: 'Please enter your password',
    loginSuccess: 'Welcome back, {username}!',
  },
  user: {
    profileAria: 'Open user menu',
  },
  dashboard: {
    title: 'Dashboard',
  },
  userManagement: {
    title: 'User Management',
  },
  teacher: {
    title: 'Teacher Profile',
  },
  student: {
    title: 'Student Profile',
  },
  classes: {
    title: 'Class Management',
  },
  researchGroup: {
    title: 'Research Group Management',
  },
}

export const messages: Record<Locale, MessageSchema> = {
  'zh-CN': zhCNMessages,
  'en-US': enUSMessages,
}
