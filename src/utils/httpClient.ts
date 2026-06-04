import { request } from './request'
import type { AxiosRequestConfig } from 'axios'

// 分页响应类型
export interface PaginatedResponse<T = unknown> {
  results: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 分页请求参数
export interface PaginatedRequest {
  page?: number
  pageSize?: number
  [key: string]: unknown
}

/**
 * HTTP 客户端 —— 对已解包 AxiosResponse 和 ApiResponse 的 request 实例做薄封装。
 * 拦截器已在运行时完成两层解包，此处的 request.get<T>() 直接返回 Promise<T>。
 */
class HttpClient {
  private instance = request

  async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.instance.get<T>(url, { params, ...config })
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T>(url, data, config)
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T>(url, data, config)
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch<T>(url, data, config)
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T>(url, config)
  }

  async getPaginated<T = unknown>(
    url: string,
    params: PaginatedRequest = {},
    config?: AxiosRequestConfig,
  ): Promise<PaginatedResponse<T>> {
    return this.instance.get<PaginatedResponse<T>>(url, { params, ...config })
  }
}

export const httpClient = new HttpClient()
