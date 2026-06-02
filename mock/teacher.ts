import type { MockMethod } from 'vite-plugin-mock'
import { createOrUpdateTeacher, getTeacherByUser } from './store'
import { createErrorResponse, createResponse } from './util'

export default [
  {
    url: '/api/profile/teacher/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      // 从 token 中提取 username（简化版：取 header 里的 Authorization）
      const userId = '2' // 默认老师
      const teacher = getTeacherByUser(userId)
      return teacher ? createResponse(teacher, request) : createErrorResponse('未完善简介', 404)
    },
  },
  {
    url: '/api/profile/teacher/',
    method: 'post',
    timeout: 300,
    response: (request: any) => {
      const userId = '2'
      const teacher = createOrUpdateTeacher(request.body, userId)
      return createResponse(teacher, request)
    },
  },
  {
    url: '/api/profile/teacher/',
    method: 'put',
    timeout: 300,
    response: (request: any) => {
      const userId = '2'
      const teacher = createOrUpdateTeacher(request.body, userId)
      return createResponse(teacher, request)
    },
  },
] as MockMethod[]
