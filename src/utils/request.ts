import { useAuthStore } from '@/store'
import { message } from 'antd'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

// ==========================================
// 双 Token 核心改造：无感刷新所需要的状态变量
// ==========================================
let isRefreshing = false // 标记是否正在刷新 Token
let requestsQueue: ((token: string) => void)[] = [] // 挂起的请求队列

// 创建 axios 实例
const createAxiosInstance = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const useMock = import.meta.env.VITE_USE_MOCK === 'true'

      if (useMock && config.url?.startsWith('/mock-api')) {
        config.baseURL = ''
      }

      // 获取 Access Token
      const token = useAuthStore.getState().accessToken
      if (!config.skipToken) {
        if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
      }

      if (config.params?.current) {
        config.params.page = config.params.current
        delete config.params.current
      }

      config.metadata = { startTime: new Date().getTime() }

      return config
    },
    error => {
      return Promise.reject(error)
    },
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const endTime = new Date().getTime()
      const startTime = response.config.metadata?.startTime
      const duration = startTime ? endTime - startTime : 0

      // 业务逻辑成功：直接解包 ApiResponse，返回内层 data
      if (response.data?.code === 0) {
        return {
          ...response.data.data,
          duration: `API ${response.config.url} 耗时: ${duration}ms`,
        }
      }
      // 处理后端自定义结构的 401
      else if (response.data?.code === 401) {
        return handleUnauthorized(instance, response.config)
      }
      // 其他业务逻辑错误
      else {
        const errorMsg = response.data?.message || '请求失败'
        message.error(errorMsg)
        return Promise.reject(new Error(errorMsg))
      }
    },
    async error => {
      // 处理标准 HTTP 状态码错误
      if (error.response) {
        if (error.response.status === 401) {
          // 拦截 401，进入无感刷新逻辑
          return handleUnauthorized(instance, error.config)
        }

        let errorMessage = '网络错误，请稍后重试'
        switch (error.response.status) {
          case 403:
            errorMessage = '拒绝访问'
            break
          case 404:
            errorMessage = '请求资源不存在'
            break
          case 500:
            errorMessage = '服务器内部错误'
            break
          default:
            errorMessage = error.response.data?.message || `请求失败: ${error.response.status}`
        }
        message.error(errorMessage)
        return Promise.reject(new Error(errorMessage))
      } else if (error.request) {
        message.error('网络连接失败，请检查网络')
        return Promise.reject(new Error('网络连接失败，请检查网络'))
      }

      return Promise.reject(error)
    },
  )

  return instance
}

// ==========================================
// 核心逻辑：处理 401 与无感刷新
// ==========================================
const handleUnauthorized = async (instance: AxiosInstance, config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore.getState()
  const refreshToken = authStore.refreshToken

  // 如果连 Refresh Token 都没有，直接踢出
  if (!refreshToken) {
    forceLogout(authStore)
    return Promise.reject(new Error('登录已过期，请重新登录'))
  }

  // 1. 如果当前没有在刷新 Token，则发起刷新请求
  if (!isRefreshing) {
    isRefreshing = true

    try {
      // 注意：这里必须使用基础 axios 发起请求，或者在 config 中配置 skipToken
      // 避免刷新 Token 的请求也被当前实例拦截，陷入死循环
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/token_refresh/`, {
        refresh: refreshToken,
      })

      const newAccessToken = res.data.access
      // 假设你的 authStore 有更新 Token 的方法
      authStore.updateAccessToken(newAccessToken)

      // Token 刷新成功，执行队列里挂起的请求
      requestsQueue.forEach(cb => cb(newAccessToken))
      requestsQueue = [] // 清空队列

      // 重试当前触发 401 的请求
      if (config.headers) {
        config.headers.Authorization = `Bearer ${newAccessToken}`
      }
      return instance(config)
    } catch (_refreshError) {
      // 2. 如果 Refresh Token 也过期了或刷新失败，强制退出
      requestsQueue = [] // 清空队列
      forceLogout(authStore)
      return Promise.reject(new Error('登录状态已失效，请重新登录'))
    } finally {
      // 无论成功失败，重置刷新状态
      isRefreshing = false
    }
  }

  // 3. 如果当前正在刷新 Token，将后续因 401 失败的请求放入队列挂起
  return new Promise(resolve => {
    requestsQueue.push((newToken: string) => {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${newToken}`
      }
      // Token 刷新完成后，重新执行该请求并 resolve
      resolve(instance(config))
    })
  })
}

// 强制退出的通用方法
const forceLogout = (authStore: any) => {
  authStore.clearAuth()
  message.error('登录状态已失效，请重新登录')
  window.location.href = '/login'
}

// const baseURL = import.meta.env.VITE_BASE_API
const baseURL = import.meta.env.VITE_API_BASE_URL

// 拦截器已在运行时解包 AxiosResponse → ApiResponse → 内层 data，
// 此处覆盖类型声明，让调用方无需再手动处理 ApiResponse 包装
interface UnwrappedRequest {
  get<T = unknown>(url: string, config?: any): Promise<T>
  post<T = unknown>(url: string, data?: unknown, config?: any): Promise<T>
  put<T = unknown>(url: string, data?: unknown, config?: any): Promise<T>
  delete<T = unknown>(url: string, config?: any): Promise<T>
  patch<T = unknown>(url: string, data?: unknown, config?: any): Promise<T>
}

export const request = createAxiosInstance(baseURL) as unknown as UnwrappedRequest
export default request
