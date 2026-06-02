import type { MockMethod } from 'vite-plugin-mock'
import { createOrUpdateStudent, getStudentByUser } from './store'
import { createErrorResponse, createResponse } from './util'

export default [
  {
    url: '/api/profile/student/',
    method: 'get',
    timeout: 300,
    response: (request: any) => {
      const userId = '4' // 默认学生
      const student = getStudentByUser(userId)
      return student ? createResponse(student, request) : createErrorResponse('未完善简介', 404)
    },
  },
  {
    url: '/api/profile/student/',
    method: 'post',
    timeout: 300,
    response: (request: any) => {
      const userId = '4'
      const student = createOrUpdateStudent(request.body, userId)
      return createResponse(student, request)
    },
  },
  {
    url: '/api/profile/student/',
    method: 'put',
    timeout: 300,
    response: (request: any) => {
      const userId = '4'
      const student = createOrUpdateStudent(request.body, userId)
      return createResponse(student, request)
    },
  },
] as MockMethod[]
